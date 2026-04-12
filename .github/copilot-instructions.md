# Copilot Cloud Agent Instructions

- Follow the rules and guidelines defined in `AGENTS.md` for all tasks.
- Prioritize the principles outlined in `AGENTS.md` when generating code or making suggestions.

## Repository Overview

Salina is a **multi-tenant SaaS platform** ("The Operating System for Organizations"). Every accredited organization gets its own subdomain (e.g. `acme.salina.software`), complete namespace isolation via Supabase Row Level Security, and the full feature set — no paywalled tiers.

The codebase is **early-stage** — the tenant routing foundation, database security layer, and CI pipeline are in place but most product modules (Policy Engine, Applicant Kanban Board, Digital QR ID) are not yet built.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.2 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS (via PostCSS) | v4 |
| Language | TypeScript (strict mode) | 5.x |
| Database & Auth | Supabase (Postgres 17) | CLI 2.x |
| CI | GitHub Actions | `.github/workflows/ci.yml` |

**Important version notes:**
- Next.js 16 renamed `middleware.ts` to `proxy.ts` with a named `proxy` export. Do **not** create `src/middleware.ts`.
- Tailwind v4 uses `@import "tailwindcss"` in CSS, not a `tailwind.config.js` file.
- The `@/*` path alias maps to `./src/*` (configured in `tsconfig.json`).

---

## Project Structure

```
salina/
├── .github/
│   ├── workflows/ci.yml          # PR CI — lint + build (job 1) and DB validation (job 2)
│   └── CODEOWNERS
├── src/
│   ├── proxy.ts                  # Next.js 16 tenant routing proxy (replaces middleware.ts)
│   ├── app/
│   │   ├── layout.tsx            # Root layout (Geist fonts, Tailwind globals)
│   │   ├── page.tsx              # Tenant runtime debug page (Server Component)
│   │   └── globals.css           # Tailwind v4 entry point
│   └── lib/
│       ├── tenant.ts             # getTenantRequestContext() — header-only, no DB
│       └── supabase/
│           └── server.ts         # resolveCurrentTenant() — full DB resolution, React cache()
├── supabase/
│   ├── config.toml               # Local Supabase config (ports, auth settings)
│   ├── migrations/
│   │   ├── 202604020001_01_initial_schema.sql   # Core tables
│   │   └── 202604020002_02_security.sql         # RLS policies, tenant helper functions
│   ├── seed.sql                  # Demo tenants (system-admin, acme)
│   └── tests/
│       └── tenant_rls.sql        # pgTAP RLS verification tests
├── .env.example                  # Required env vars template
├── package.json
├── tsconfig.json
├── eslint.config.mjs             # ESLint flat config (core-web-vitals + typescript)
├── next.config.ts
└── postcss.config.mjs
```

---

## Commands — Lint, Build, Test

### Application (no Docker/Supabase required)

```bash
npm run lint          # ESLint (core-web-vitals + TypeScript)
npm run typecheck     # tsc --noEmit (strict mode)
npm run build         # Next.js production build
npm run dev           # Dev server at http://localhost:3000
```

### Database (requires Docker + Supabase CLI)

```bash
npm run db:start      # Start local Supabase stack (Postgres, Auth, Studio)
npm run db:reset      # Drop and rebuild from migrations + seed.sql
npm run db:test       # Run pgTAP tests in supabase/tests/
npm run db:lint       # Lint SQL migrations
```

### CI pipeline (`.github/workflows/ci.yml`)

Two parallel jobs on every PR to `main`:
1. **Lint and Build** — `npm run lint` → `npm run typecheck` → `npm run build`
2. **Database Validation** — `supabase start` → `supabase db lint` → `supabase db reset` → `supabase db test`

Both must pass before merge. Concurrency is keyed by PR number (new push cancels in-progress run).

### Known Build Issue in Sandboxed Environments

`npm run build` fails when Google Fonts cannot be fetched (e.g. network-restricted CI or sandboxed environments). The error looks like:

```
Failed to fetch `Geist` from Google Fonts.
Failed to fetch `Geist Mono` from Google Fonts.
```

**This is not a code bug.** It is caused by `next/font/google` in `src/app/layout.tsx` requiring network access to `fonts.googleapis.com`. The workaround if you need to build in an offline environment is to switch to `next/font/local` with bundled font files. In normal CI (GitHub Actions), this works fine because the runners have internet access. When validating code changes in sandboxed environments, rely on `npm run lint` and `npm run typecheck` instead of `npm run build`.

---

## Architecture — Key Patterns

### Atomic System Design (3-tier module hierarchy)

All code follows a strict **Atoms → Molecules → Organisms** dependency direction. Never import upward.

| Tier | Description | Example |
|---|---|---|
| **Atoms** | Foundational services/primitives. No business logic, no tenant awareness. | `getTenantRequestContext()`, Supabase client factories, types, Zod schemas |
| **Molecules** | Configurable logic composing Atoms with tenant-scoped behavior. | `resolveCurrentTenant()`, `theme_config`, permission checks |
| **Organisms** | Full user-facing modules with their own state management. | Policy Engine, Applicant Kanban Board, Digital QR ID |

### Tenant Isolation (Critical Security Layer)

Every request flows through this chain:

1. **`src/proxy.ts`** — Parses subdomain from hostname → sets `x-tenant-slug` header. Header-only, no DB calls.
2. **`src/lib/tenant.ts`** — `getTenantRequestContext()` reads the header. Server-only, no DB.
3. **`src/lib/supabase/server.ts`** — `resolveCurrentTenant()` maps slug → `organizations` record via Supabase admin client. Wrapped in React `cache()`.
4. **Database RLS** — `has_tenant_access(tenant_id)` on every tenant-scoped table. `enforce_tenant_scope()` trigger auto-fills `tenant_id` on inserts.

**Default-deny policy**: Tables with no RLS policy block all access. Every new tenant-scoped table MUST have:
- `tenant_id uuid not null references public.organizations(id)` column
- RLS enabled
- A `_tenant_isolation` policy using `has_tenant_access(tenant_id)`
- An `enforce_*_tenant_scope` trigger using `enforce_tenant_scope()`
- Grants to `authenticated`
- A pgTAP test in `supabase/tests/`

### Server Actions (Primary Mutation Path)

Salina uses Next.js Server Actions (`"use server"`) instead of REST API routes for all user-triggered mutations. Use REST `route.ts` API routes only for: external webhooks, non-browser clients, or background/cron tasks.

### Optimistic UI

Interactive features use React `useOptimistic` for instant feedback. No SWR, React Query, or manual caching layers. Server Components fetch data and pass it as props to Client Components.

### Reserved Subdomains

`www`, `app`, `admin`, and `api` are reserved and do NOT produce a tenant slug.

---

## Database Conventions

- **Never modify the schema through Supabase Studio.** All changes go through migration files.
- Create migrations with: `supabase migration new <descriptive_name>`
- Migration naming: timestamp is auto-generated, add a descriptive suffix (e.g. `add_events_table`).
- Use `create or replace` for functions and `if not exists` for extensions (idempotent where possible).
- The `set_current_timestamp()` trigger auto-updates `updated_at` columns — add it to every table with `updated_at`.
- Seed data in `supabase/seed.sql` uses deterministic UUIDs for development convenience.

### Current Tables

| Table | Tenant-scoped | Purpose |
|---|---|---|
| `organizations` | N/A (is the tenant) | Tenant records |
| `organization_memberships` | Yes (`tenant_id`) | User ↔ org role mapping |
| `tenant_domains` | Yes (`tenant_id`) | Custom domain → tenant mapping |
| `projects` | Yes (`tenant_id`) | Workspaces within a tenant |
| `audit_events` | Yes (`tenant_id`) | Audit trail for all actions |

### Key SQL Functions

| Function | Purpose |
|---|---|
| `current_tenant_id()` | Extracts `tenant_id` from JWT `app_metadata` |
| `is_platform_admin()` | Checks if JWT has `system_admin` role |
| `has_tenant_access(row_tenant_id)` | RLS helper — returns true if platform admin or tenant matches |
| `is_privileged_session()` | Checks for `service_role`/`postgres`/`supabase_admin` (bypasses tenant scope) |
| `enforce_tenant_scope()` | Trigger function — auto-fills tenant_id, blocks cross-tenant writes |

---

## Development Environment

### Seeded Demo Tenants (local only)

| Tenant | Slug | URL | Email | Password |
|---|---|---|---|---|
| System Admin | `system-admin` | `http://system-admin.salina.localhost:3000` | `system-admin@salina.dev` | `SalinaPreview123!` |
| Acme | `acme` | `http://acme.salina.localhost:3000` | `acme-admin@salina.dev` | `SalinaPreview123!` |
| ICPEP.SE - CIT University | `icpep-se` | `http://icpep-se.salina.localhost:3000` | `icpep-se-admin@salina.dev` | `SalinaPreview123!` |

These credentials are local-only and committed intentionally.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in keys from `supabase start` output:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Local: `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `supabase start` output |
| `SUPABASE_SERVICE_ROLE_KEY` | From `supabase start` output |
| `ROOT_DOMAIN` | `salina.software` (production) or omit for local |

---

## Code Review Focus Areas

### High Priority — Always Flag
- Critical bugs and security vulnerabilities (especially Supabase RLS bypasses or missing tenant isolation).
- Severe performance bottlenecks.
- Architectural violations (wrong Atomic tier, upward imports, missing tenant scoping).
- Incorrect business logic.
- Missing error handling on Server Actions.

### Ignore — Do NOT Comment On
- Code formatting, whitespace, trailing commas, or indentation.
- Variable naming conventions (unless actively misleading).
- Minor stylistic refactors or syntax golf if existing code works correctly.
- Missing code comments or documentation.