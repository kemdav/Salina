# Salina

**The Operating System for Organizations.**

Salina is a multi-tenant platform that gives every accredited organization its own subdomain, its own data boundary, and a complete suite of management tools — out of the box, with no feature paywalls. Built on **Next.js 16**, **Supabase**, and **TypeScript**.

---

## Table of Contents

- [Salina](#salina)
  - [Table of Contents](#table-of-contents)
  - [Vision](#vision)
  - [Core Modules](#core-modules)
    - [Policy Engine](#policy-engine)
    - [Applicant Kanban Board](#applicant-kanban-board)
    - [Digital QR ID](#digital-qr-id)
  - [Tenant Model](#tenant-model)
    - [Single-Tier Access](#single-tier-access)
    - [Namespace Isolation](#namespace-isolation)
  - [Visual Identity and White-Labeling](#visual-identity-and-white-labeling)
  - [Tech Stack](#tech-stack)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [3-Step Start](#3-step-start)
    - [Seeded Demo Tenants](#seeded-demo-tenants)
  - [Project Structure](#project-structure)
  - [Contributing](#contributing)

---

## Vision

Salina is not another form builder or membership tracker. It is designed as a **unified operating system** — a single platform that replaces the patchwork of tools organizations currently rely on for governance, recruitment, events, communications, and compliance.

Every organization on Salina operates under its own subdomain (e.g. `acme.salina.software`) with **complete namespace isolation**. One organization can never see, query, or modify another organization's data. This isolation is enforced at the database level through Row Level Security, not just at the application layer.

---

## Core Modules

Salina ships three foundational modules. Each is designed as a standalone **Organism** (see [Atomic System Design](CONTRIBUTING.md#atomic-system-design) in the contributing guide) that can be composed, extended, or themed per tenant.

### Policy Engine

The governance backbone. Organizations define approval workflows, constitutional rules, and operational policies as declarative logic. The Policy Engine evaluates these rules at runtime to automate decisions that would otherwise require manual committee review.

- Workflow-driven approval chains (e.g. budget requests, event proposals)
- Configurable rule sets per organization
- Audit trail for every policy evaluation

### Applicant Kanban Board

A visual pipeline for managing recruitment, applications, and onboarding. Candidates move through configurable stages — each transition can trigger Policy Engine rules automatically.

- Drag-and-drop stage management with **optimistic UI** (React `useOptimistic`)
- Bulk actions and filtering
- Stage-transition hooks into the Policy Engine

### Digital QR ID

Every verified member receives a digitally-signed QR identity card that can be scanned for event check-in, access control, or credential verification.

- Cryptographically signed payloads
- Offline-capable verification
- Branded per-tenant (logo, colors, layout)

---

## Tenant Model

### Single-Tier Access

Salina follows a **single-tier access strategy**. Every accredited organization on the platform receives the full feature set — there are no paywalled tiers, no "premium" modules, and no artificial limitations. If an organization is on Salina, it has everything.

This design decision is intentional:

- It eliminates support complexity around "which plan has which feature."
- It ensures every organization has equal tooling for governance and compliance.
- It aligns with Salina's mission as infrastructure, not a profit-gated product.

### Namespace Isolation

Each tenant is identified by a unique `slug` (e.g. `acme`). The platform resolves the tenant from the request hostname at the edge via the [Next.js 16 Proxy](CONTRIBUTING.md#the-nextjs-16-proxy), then enforces isolation at every layer:

| Layer | Mechanism |
| --- | --- |
| **Edge** | `src/proxy.ts` extracts the `x-tenant-slug` header from the subdomain |
| **Application** | `resolveCurrentTenant()` maps the slug to an `organizations` record |
| **Database** | RLS policies enforce `org_id` scoping via JWT custom claims |
| **Trigger** | `enforce_tenant_scope()` auto-fills and validates `tenant_id` on every write |

> [!IMPORTANT]
> The isolation model is **default-deny**. If a table has no RLS policy, Supabase blocks all access. Every new table must explicitly opt in to tenant-scoped access by adding a `tenant_id` column, RLS policies, and the `enforce_tenant_scope` trigger.

---

## Visual Identity and White-Labeling

Every tenant can customize their instance to match their organization's brand:

- **Logo** — Displayed in the navigation bar, emails, and the Digital QR ID card.
- **Color palette** — Primary, secondary, and accent colors applied across the entire UI via CSS custom properties.
- **Typography** — Configurable font family for headings and body text.

These settings are stored in a `theme_config` **Molecule** (see [Atomic System Design](CONTRIBUTING.md#atomic-system-design)) that is loaded once per request and injected into the root layout. Tenant branding is never hard-coded — it is always resolved dynamically.

---

## Tech Stack

| Layer | Technology | Version |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.2.2 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS | v4 |
| Language | TypeScript (strict) | 5.x |
| Database and Auth | Supabase | CLI 2.x |
| CI | GitHub Actions | — |

---

## Quick Start

### Prerequisites

| Requirement | Why |
| --- | --- |
| **Node.js >= 20.11** | Required by the project engine constraint |
| **Docker Desktop** | The Supabase CLI runs Postgres, Auth, Storage, and other services in containers |
| **Supabase CLI** | Manages local database, migrations, and tests — [install guide](https://supabase.com/docs/guides/cli/getting-started) |

> [!IMPORTANT]
> Docker Desktop **must be running** before any `supabase` command. If you see a `dockerDesktopLinuxEngine` pipe error, start Docker Desktop and try again.

### 3-Step Start

```bash
# 1. Install dependencies
npm install

# 2. Start the local Supabase stack (Postgres, Auth, Studio, etc.)
npm run db:start

# 3. Start the Next.js dev server
npm run dev
```

After `db:start` completes, the CLI prints your local keys. Copy them into a `.env.local` file using `.env.example` as a template:

```bash
cp .env.example .env.local
# Then paste the anon key, service role key, and URL from the supabase start output
```

Open **<http://salina.localhost:3000/login>** to sign in with the shared local auth host. After login, tenant redirects land on `*.salina.localhost` so the auth cookie stays scoped to local development. If your browser does not resolve the wildcard automatically, add `salina.localhost` and the tenant hosts you need to your local hosts file.

### Seeded Demo Tenants

The `supabase/seed.sql` file pre-populates three tenants for local development:

| Tenant | Slug | Local URL | Email | Password |
| --- | --- | --- | --- | --- |
| System Admin | `system-admin` | <http://system-admin.salina.localhost:3000> | `system-admin@salina.dev` | `SalinaPreview123!` |
| Acme | `acme` | <http://acme.salina.localhost:3000> | `acme-admin@salina.dev` | `SalinaPreview123!` |
| ICPEP.SE - CIT University | `icpep-se` | <http://icpep-se.salina.localhost:3000> | `icpep-se-admin@salina.dev` | `SalinaPreview123!` |

> These credentials are **local/preview only**. They are committed to the repo intentionally for development convenience.

---

## Project Structure

```text
salina/
├── .github/workflows/
│   └── ci.yml                      # PR validation (lint + db test)
├── src/
│   ├── proxy.ts                    # Next.js 16 tenant routing proxy
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Tenant runtime debug page
│   └── lib/
│       ├── tenant.ts               # getTenantRequestContext() — header-only
│       └── supabase/
│           └── server.ts           # resolveCurrentTenant() — full DB resolution
├── supabase/
│   ├── config.toml                 # Local Supabase CLI config
│   ├── migrations/
│   │   ├── ..._01_initial_schema.sql
│   │   └── ..._02_security.sql
│   ├── seed.sql                    # Demo tenant data
│   └── tests/
│       └── tenant_rls.sql          # pgTAP RLS verification tests
├── .env.example                    # Environment variable template
├── CONTRIBUTING.md                 # Developer guide — architecture, conventions, CI
├── package.json
└── tsconfig.json
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full developer guide: architecture decisions, the Atomic System Design pattern, proxy and data-flow conventions, database workflow, and CI/CD rules.
