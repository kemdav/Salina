# Contributing to Salina

This guide covers everything a KIRK Ltd. engineer needs to build, test, and ship features in Salina. Read this before opening your first PR.

---

## Table of Contents

- [Atomic System Design](#atomic-system-design)
- [The Next.js 16 Proxy](#the-nextjs-16-proxy)
- [Unidirectional Data Flow](#unidirectional-data-flow)
- [Security and RLS](#security-and-rls)
- [Optimistic UI](#optimistic-ui)
- [Tenant-Aware Development](#tenant-aware-development)
- [The Supabase Workflow](#the-supabase-workflow)
- [CI/CD Rules](#cicd-rules)
- [Common Commands](#common-commands)

---

## Atomic System Design

Salina's codebase is structured using an **Atomic System Design** pattern. Every piece of functionality falls into one of three tiers, ordered by complexity and scope.

### Atoms

Atoms are **foundational services and primitives**. They have zero business logic, zero tenant awareness, and zero UI. Other layers import atoms — atoms never import molecules or organisms.

Examples:

- `createSupabaseAdminClient()` — raw Supabase client factory
- `getTenantRequestContext()` — reads the `x-tenant-slug` header from the current request
- Shared TypeScript types and Zod schemas
- Utility functions (date formatting, slug normalization)

**Rule:** If it does one thing with no dependencies on higher layers, it is an Atom.

### Molecules

Molecules are **configurable logic** that compose one or more Atoms with tenant-scoped behavior. They carry business rules but are not full user-facing features.

Examples:

- `theme_config` — resolves the tenant's branding (logo, colors, fonts) and injects CSS custom properties into the root layout. Loaded once per request. Used by every organism that renders UI.
- `resolveCurrentTenant()` — composes the admin client Atom with the request context Atom to produce a full `TenantContext` object.
- Permission checks — evaluates a user's role against the organization's policy rules.

**Rule:** If it combines Atoms and adds tenant or business logic, it is a Molecule.

### Organisms

Organisms are **complex, user-facing modules**. Each maps to a major feature in the product (see [Core Modules](README.md#core-modules) in the README). Organisms consume Molecules and Atoms, manage their own state, and own a complete slice of the user experience.

Examples:

- **Policy Engine** — rule evaluation, approval workflows, audit logging
- **Applicant Kanban Board** — drag-and-drop pipeline, stage transitions, bulk actions
- **Digital QR ID** — card generation, cryptographic signing, scan verification
- **Newsfeed** — post creation, reactions, threaded comments, real-time subscriptions

**Rule:** If it is a full-screen or near-full-screen feature with its own state management, it is an Organism.

### Dependency Direction

```text
Organisms → Molecules → Atoms
     ↓            ↓         ↓
  (complex)  (configurable) (foundational)
```

> [!WARNING]
> Never import upward. An Atom must not import a Molecule. A Molecule must not import an Organism. Circular dependencies between tiers will break build-time tree shaking and make testing impossible.

---

## The Next.js 16 Proxy

> [!IMPORTANT]
> Next.js 16 renamed `middleware.ts` to **`proxy.ts`** and changed the export convention. If you see online tutorials referencing `middleware.ts`, that pattern is **deprecated**. We use `src/proxy.ts` with a named `proxy` export.

### What It Does

The proxy is the first code that runs on every inbound request. It performs **one job**: extract the tenant slug from the hostname and set it as a request header. This establishes the **namespace isolation boundary** — every downstream layer (Server Components, Server Actions, RLS policies) reads `x-tenant-slug` to scope its behavior.

```text
Request: https://acme.salina.com/dashboard
                 ^^^^
                 subdomain parsed by proxy

-> x-tenant-slug: acme  (set on forwarded request headers)
-> Request continues to App Router with tenant context attached
```

### Design Rules

1. **Header-only** — The proxy never makes database calls. It parses the hostname and sets/deletes the `x-tenant-slug` header. This keeps it zero-cost at the edge.

2. **Reserved subdomains** — `www`, `app`, `admin`, and `api` are reserved. They do *not* produce a tenant slug and are intended for platform-level routes.

3. **Local development** — Subdomains like `acme.localhost` work out of the box in Chrome and Edge without `/etc/hosts` changes.

4. **Matcher** — The proxy only runs on page routes. Static assets, API routes, and Next.js internals are excluded:

   ```ts
   export const config = {
     matcher: ["/((?!api|_next|.*\\..*).*)"],
   };
   ```

5. **Namespace isolation** — The `x-tenant-slug` header is the single source of truth for "which organization is this request for." It is set exclusively by the proxy. Application code must never fabricate or override this header.

> [!WARNING]
> Do **not** create a `src/middleware.ts` file. Next.js 16 will ignore it in favor of `proxy.ts`, and having both can cause confusing behavior.

---

## Unidirectional Data Flow

Salina uses **Server Actions** as the primary mutation path. This eliminates the need for traditional REST API routes for most operations and enforces a clean, unidirectional data flow.

### The Pattern

```text
User Interaction
  → React Server Action (runs on the server)
    → Direct Supabase call (via service_role or user session)
      → Database mutation (enforced by RLS + triggers)
        → Revalidation / redirect
          → Server Component re-render with fresh data
```

### Why Server Actions Over REST

- **No API route boilerplate.** A Server Action is a function with `"use server"` — no route file, no request parsing, no response serialization.
- **Type safety end-to-end.** The action's input and return types flow directly from the form to the server and back to the component, with full TypeScript inference.
- **Automatic CSRF protection.** Next.js handles the origin check for Server Actions natively.
- **Colocated logic.** The mutation logic lives next to (or inside) the component that triggers it, rather than in a separate `api/` directory.

### When to Use REST API Routes

Server Actions handle the majority of cases. Use a dedicated `route.ts` API route only when:

- An **external system** needs to call Salina (webhooks, third-party integrations).
- The operation is **not triggered by a user interaction** (cron jobs, background tasks).
- You need to support **non-browser clients** (mobile apps, CLI tools).

> [!IMPORTANT]
> Even when using API routes, tenant isolation still applies. The route must resolve the tenant from the request and scope all database queries accordingly.

---

## Security and RLS

Salina follows a **default-deny** security architecture. No data is accessible unless an explicit policy grants it.

### How Tenant Isolation Works

1. **The proxy** sets `x-tenant-slug` on the request (see [above](#the-nextjs-16-proxy)).
2. **`resolveCurrentTenant()`** maps the slug to an `organizations` record and returns the `org_id`.
3. **Supabase Auth** embeds the user's `org_id` (tenant ID) into the JWT as a **custom claim** under `app_metadata.tenant_id`.
4. **RLS policies** on every tenant-scoped table call `has_tenant_access(tenant_id)`, which extracts the `org_id` from the JWT and compares it to the row.

```sql
-- Simplified RLS policy (actual implementation in 02_security.sql)
create policy "tenant_isolation" on projects
  using (has_tenant_access(tenant_id));
```

### The `org_id` Extraction Chain

```text
JWT → auth.jwt() → app_metadata ->> 'tenant_id' → current_tenant_id() → RLS policy
```

The `current_tenant_id()` function reads from `app_metadata` first, then falls back to `user_metadata`. If neither contains a `tenant_id`, the function returns `null` and the default-deny policy blocks all access.

### The `enforce_tenant_scope()` Trigger

Every tenant-scoped table has this trigger, which runs on `INSERT` and `UPDATE`:

- **On insert:** If `tenant_id` is null, it auto-fills it from the JWT's `org_id`. If the JWT has no `org_id`, the insert is rejected.
- **On update:** If the new `tenant_id` differs from the old one, the update is rejected with a clear error.
- **Privileged bypass:** The trigger checks `is_privileged_session()` first. Sessions running as `service_role`, `postgres`, or `supabase_admin` skip all checks — this is required for migrations and seeds.

### Adding a New Tenant-Scoped Table

Every new table that holds tenant data **must** follow this checklist:

- [ ] Add `tenant_id uuid not null references public.organizations(id)` column
- [ ] Enable RLS: `alter table <name> enable row level security;`
- [ ] Create a `<name>_tenant_isolation` policy using `has_tenant_access(tenant_id)`
- [ ] Create an `enforce_<name>_tenant_scope` trigger using `enforce_tenant_scope()`
- [ ] Grant `select, insert, update, delete` to `authenticated`
- [ ] Add a pgTAP test in `supabase/tests/` verifying isolation

> [!IMPORTANT]
> If you skip any step, the table is either **completely inaccessible** (default-deny with no policy) or **leaking data** (no `tenant_id` column). There is no safe middle ground.

---

## Optimistic UI

Interactive organisms like the **Applicant Kanban Board** must maintain high responsiveness despite server round-trips. Salina uses React's `useOptimistic` hook to achieve this.

### The useOptimistic Pattern

```tsx
"use client";

import { useOptimistic } from "react";
import { moveCandidate } from "./actions";

export function KanbanColumn({ candidates }: { candidates: Candidate[] }) {
  const [optimisticCandidates, setOptimistic] = useOptimistic(
    candidates,
    (current, moved: { id: string; newStage: string }) =>
      current.map((c) =>
        c.id === moved.id ? { ...c, stage: moved.newStage } : c
      )
  );

  async function handleDrop(id: string, newStage: string) {
    setOptimistic({ id, newStage }); // Instant UI update
    await moveCandidate(id, newStage); // Server Action (may revalidate)
  }

  return (
    <ul>
      {optimisticCandidates.map((c) => (
        <li key={c.id}>{c.name} — {c.stage}</li>
      ))}
    </ul>
  );
}
```

### Rules

1. **Always optimistic for drag-and-drop.** The user must see the result of their action within the same frame. Server confirmation happens in the background.
2. **Server Actions are the source of truth.** If the Server Action fails (e.g. a Policy Engine rule blocks the transition), the next re-render will revert the optimistic state automatically.
3. **No client-side caching layers.** Do not introduce SWR, React Query, or manual cache invalidation. Server Components + `useOptimistic` + Server Actions cover the data lifecycle.

> [!WARNING]
> `useOptimistic` only works in Client Components. The parent Server Component should fetch the data and pass it as props. Do not `fetch()` inside the Client Component.

---

## Tenant-Aware Development

### Reading the Tenant in a Server Component

**Quick access (header only, no DB call):**

```ts
import { getTenantRequestContext } from "@/lib/tenant";

export default async function Page() {
  const { tenantSlug, host } = await getTenantRequestContext();
  // tenantSlug = "acme" | null
}
```

**Full resolution (resolves slug to organization record):**

```ts
import { resolveCurrentTenant } from "@/lib/supabase/server";

export default async function Page() {
  const { tenant, tenantSlug, resolvedBy } = await resolveCurrentTenant();

  if (!tenant) {
    // No matching organization — show a 404 or onboarding page
  }

  // tenant.id, tenant.name, tenant.slug, tenant.plan, tenant.billingEmail
}
```

`resolveCurrentTenant` is wrapped in React's `cache()` — calling it multiple times in the same request tree is free.

### Resolution Order

1. **Slug lookup** — Query `organizations` by the `x-tenant-slug` header.
2. **Domain lookup** — If slug didn't match, query `tenant_domains` by `host`.
3. **Graceful fallback** — If neither resolves, tenant is `null` with no error.

---

## The Supabase Workflow

### Local Commands

```bash
npm run db:start     # Start all Supabase containers
npm run db:reset     # Drop and rebuild from migrations + seed.sql
npm run db:test      # Run pgTAP tests in supabase/tests/
npm run db:lint      # Lint SQL migrations
```

After `db:start`, Supabase Studio is available at **<http://127.0.0.1:54323>**.

### Adding Database Changes

> [!IMPORTANT]
> **Never make schema changes through the Supabase Studio dashboard.** All changes must go through migration files.

```bash
# 1. Create a timestamped migration file
supabase migration new my_change_description

# 2. Write your SQL in supabase/migrations/<timestamp>_my_change_description.sql

# 3. Apply locally
npm run db:reset

# 4. Verify tests still pass
npm run db:test
```

### Migration Conventions

- **File naming:** CLI auto-generates the timestamp. Add a descriptive suffix: `add_events_table`, `rls_for_invoices`.
- **Tenant scoping:** Every table with user data needs `tenant_id`, an RLS policy, and the `enforce_tenant_scope` trigger. Follow `02_security.sql`.
- **Idempotent where possible:** Use `create or replace` for functions and `if not exists` for extensions.

### Current Migrations

| File | Purpose |
| --- | --- |
| `202604020001_01_initial_schema.sql` | Core tables: `organizations`, `organization_memberships`, `tenant_domains`, `projects`, `audit_events` |
| `202604020002_02_security.sql` | RLS policies, tenant helper functions, `enforce_tenant_scope` triggers |

### Supabase Branching (Pull Requests)

When Supabase Branching is enabled:

1. You open a **Pull Request** on GitHub.
2. Supabase creates an **ephemeral preview database**, applying all committed migrations.
3. The preview runs `seed.sql` so you have demo data.
4. Your Vercel preview deployment connects to this ephemeral branch.
5. When the PR merges to `main`, migrations apply to production and the preview branch is deleted.

---

## CI/CD Rules

Every PR targeting `main` triggers two **parallel** GitHub Actions jobs in `.github/workflows/ci.yml`:

### Job 1: Lint and Build

| Step | Command | What It Checks |
| --- | --- | --- |
| Lint | `npm run lint` | ESLint rules (core-web-vitals + TypeScript) |
| Typecheck | `npm run typecheck` | TypeScript strict mode, no emit |
| Build | `npm run build` | Full production build via Turbopack |

### Job 2: Database Validation

| Step | Command | What It Checks |
| --- | --- | --- |
| Start stack | `supabase start` | Boots Postgres + Auth locally in CI |
| Lint schema | `supabase db lint` | SQL anti-patterns and naming issues |
| Reset | `supabase db reset` | Migrations apply cleanly from scratch |
| Tests | `supabase db test` | pgTAP tests pass |

> [!IMPORTANT]
> **Both jobs must pass before a PR can be merged.** The workflow uses `concurrency` keyed by PR number — pushing a new commit cancels any in-progress run.

### Running CI Locally

```bash
# App checks
npm run lint
npm run typecheck
npm run build

# Database checks
npm run db:start      # if not already running
npm run db:lint
npm run db:reset
npm run db:test
```

---

## Common Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run db:start` | Start local Supabase stack |
| `npm run db:reset` | Drop and rebuild DB from migrations + seed |
| `npm run db:test` | Run pgTAP database tests |
| `npm run db:lint` | Lint SQL migrations |
| `supabase migration new <name>` | Create a new migration file |
| `supabase stop` | Stop local Supabase containers |
