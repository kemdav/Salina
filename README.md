# Salina

**The Operating System for Organizations.**

Salina is a multi-tenant platform that gives every accredited organization its own subdomain, its own data boundary, and a complete suite of management tools — out of the box, with no feature paywalls. Built on **Next.js 16**, **Supabase**, and **TypeScript**.

---

## Table of Contents

- [Salina](#salina)
  - [Table of Contents](#table-of-contents)
  - [Vision](#vision)
  - [Features](#features)
    - [Tenant Routing and Isolation](#tenant-routing-and-isolation)
    - [Authentication and Role System](#authentication-and-role-system)
    - [Organization Management](#organization-management)
    - [Member Roster](#member-roster)
    - [Recruitment Pipeline](#recruitment-pipeline)
    - [Events and Attendance](#events-and-attendance)
    - [Announcements and Feed](#announcements-and-feed)
    - [Documents Library](#documents-library)
    - [Digital QR ID](#digital-qr-id)
    - [Branding and White-Labeling](#branding-and-white-labeling)
    - [Admin and Super Admin Portals](#admin-and-super-admin-portals)
  - [Tenant Model](#tenant-model)
    - [Single-Tier Access](#single-tier-access)
    - [Namespace Isolation](#namespace-isolation)
  - [Visual Identity and White-Labeling](#visual-identity-and-white-labeling)
  - [Tech Stack](#tech-stack)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [3-Step Start](#3-step-start)
    - [Seeded Demo Tenants](#seeded-demo-tenants)
    - [System Admin (Platform Management)](#system-admin-platform-management)
    - [Acme](#acme)
    - [ICPEP.SE - CIT University](#icpepse---cit-university)
  - [Project Structure](#project-structure)
    - [Database](#database)
  - [Contributing](#contributing)

---

## Vision

Salina is not another form builder or membership tracker. It is designed as a **unified operating system** — a single platform that replaces the patchwork of tools organizations currently rely on for governance, recruitment, events, communications, and compliance.

Every organization on Salina operates under its own subdomain (e.g. `acme.salina.software`) with **complete namespace isolation**. One organization can never see, query, or modify another organization's data. This isolation is enforced at the database level through Row Level Security, not just at the application layer.

---

## Features

Salina ships a comprehensive suite of features, each built as an **Organism** (see [Atomic System Design](CONTRIBUTING.md#atomic-system-design)) that can be composed, extended, or themed per tenant.

### Tenant Routing and Isolation

Every organization operates under its own subdomain (e.g. `acme.salina.software`) with complete namespace isolation enforced at every layer of the stack. The platform resolves tenants from request hostnames at the edge, maps them to database records, and enforces Row Level Security on every query.

- Subdomain-based tenant resolution via the Next.js 16 proxy (`src/proxy.ts`)
- Database-level RLS policies ensure one organization can never access another's data
- `enforce_tenant_scope()` trigger auto-fills and validates `tenant_id` on every write
- Reserved subdomains (`www`, `app`, `admin`, `api`) are excluded from tenant routing

### Authentication and Role System

A six-tier role hierarchy governs access across the platform, from platform-level system administrators down to read-only viewers. Password policies enforce strong, 12-character minimum credentials with complexity requirements.

- **Roles**: `system_admin` → `owner` → `admin` → `officer` → `member` → `viewer`
- Server-side password validation via Zod + `bcryptjs`
- JWT-based session claims for tenant scoping
- Role-based navigation with customizable sidebar routes
- Temporary applicant accounts with restricted access
- Auth landing redirects based on role and tenant membership

### Organization Management

Platform administrators manage the full organization lifecycle through accreditation workflows. Organizations transition through status states — from application to accreditation, with support for suspension and reactivation.

- Accreditation request submission and review
- Organization status lifecycle: `pending` → `active` → `inactive` / `suspended` / `rejected`
- Per-organization type classification
- Onboarding wizard for new organizations (branding, pipeline setup)

### Member Roster

Each tenant manages their own member directory with role assignments, invitations, and temporary applicant review.

- Member table with role-level views
- Invite members by email with role assignment
- Temporary applicant submission and officer review queue
- Temporary role assignments with configurable permissions
- Realtime membership change listeners

### Recruitment Pipeline

Organizations create recruitment cycles, collect applications, and move candidates through configurable stages.

- Create and manage recruitment cycles
- Application submission with custom forms
- Officer review board for evaluating candidates
- Stage-based pipeline management

### Events and Attendance

Event management with QR-code check-in and live attendance tracking, plus a member-facing calendar view.

- Create and manage events with date, location, and capacity
- QR code generation for event check-in
- Live attendance tracker with realtime updates
- Member event calendar and discovery
- Attendance history per member

### Announcements and Feed

Per-tenant organization feed for announcements and communications visible to all members.

- Create and publish announcements to the organization feed
- Feed post display with timestamps
- Cross-cutting visibility for all tenant members

### Documents Library

Hierarchical document storage with folder organization and access controls.

- Nested folder structure per tenant
- Document upload and management
- Access control at the document level

### Digital QR ID

Verified members receive a branded digital identity card with a scannable QR code for event check-in and credential verification.

- Per-member QR identity card with tenant branding
- QR scanner modal for attendance verification
- Branded per-tenant (logo, colors, layout)

### Branding and White-Labeling

Every tenant can customize their instance to match their organization's brand. These settings are stored in `theme_config` and injected into every page layout.

- **Logo** — Displayed in navigation, emails, and Digital QR ID cards
- **Color palette** — Primary color applied across the entire UI via CSS custom properties
- **Typography** — Configurable font family for headings and body text

### Admin and Super Admin Portals

Role-scoped dashboards with dedicated layouts for tenant administrators and platform administrators.

- **Admin Portal** (`/admin`) — Dashboard, member management, events, recruitment, roles, documents, settings
- **Super Admin Portal** (`/superadmin`) — Organization management, accreditations, adviser management, platform settings

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

The `supabase/seed.sql` file pre-populates three tenants for local development. The System Admin tenant is where all organizations are managed — its accounts are all platform-level `system_admin` for the Salina dev team. The other two tenants each have accounts spanning every role:

### System Admin (Platform Management)

| Tenant | Role | Email | Password |
| --- | --- | --- | --- |
| System Admin | System Admin | `system-admin@salina.dev` | `SalinaPreview123!` |
| System Admin | System Admin | `system-admin-1@salina.dev` | `SalinaPreview123!` |
| System Admin | System Admin | `system-admin-2@salina.dev` | `SalinaPreview123!` |

### Acme

| Tenant | Role | Email | Password |
| --- | --- | --- | --- |
| Acme | Owner | `acme-admin@salina.dev` | `SalinaPreview123!` |
| Acme | Officer | `acme-officer@salina.dev` | `SalinaPreview123!` |
| Acme | Member | `acme-member@salina.dev` | `SalinaPreview123!` |
| Acme | Viewer | `acme-viewer@salina.dev` | `SalinaPreview123!` |

### ICPEP.SE - CIT University

| Tenant | Role | Email | Password |
| --- | --- | --- | --- |
| ICPEP.SE - CIT University | Owner | `icpep-se-admin@salina.dev` | `SalinaPreview123!` |
| ICPEP.SE - CIT University | Officer | `icpep-se-officer@salina.dev` | `SalinaPreview123!` |
| ICPEP.SE - CIT University | Member | `icpep-se-member@salina.dev` | `SalinaPreview123!` |
| ICPEP.SE - CIT University | Viewer | `icpep-se-viewer@salina.dev` | `SalinaPreview123!` |

| Tenant | Slug | Local URL |
| --- | --- | --- |
| System Admin | `system-admin` | <http://system-admin.salina.localhost:3000> |
| Acme | `acme` | <http://acme.salina.localhost:3000> |
| ICPEP.SE - CIT University | `icpep-se` | <http://icpep-se.salina.localhost:3000> |

> These credentials are **local/preview only**. They are committed intentionally for development convenience.

---

## Project Structure

```text
salina/
├── .github/workflows/
│   └── ci.yml                           # PR validation (lint + typecheck + build + db test)
├── src/
│   ├── proxy.ts                         # Next.js 16 tenant routing proxy (subdomain → x-tenant-slug)
│   ├── app/
│   │   ├── layout.tsx                   # Root layout (Geist fonts, Tailwind entry)
│   │   ├── page.tsx                     # Tenant runtime debug page
│   │   ├── not-found.tsx                # 404 page
│   │   ├── globals.css                  # Tailwind v4 entry point
│   │   ├── _tenantSlug/                 # Tenant-scoped catch-all layout with auth gating
│   │   ├── (auth)/                      # Auth route group
│   │   │   ├── login/                   #   Sign-in page
│   │   │   ├── sign-up/                 #   Registration page
│   │   │   ├── reset-password/          #   Password reset flow
│   │   │   └── accreditation/           #   Accreditation form
│   │   ├── admin/                       # Admin portal (Org Owner/Admin role)
│   │   │   ├── dashboard/               #   Admin dashboard
│   │   │   ├── members/                 #   Member management
│   │   │   ├── events/                  #   Event creation & management
│   │   │   ├── recruitment/             #   Recruitment cycles & review
│   │   │   ├── roles/                   #   Role & permission assignment
│   │   │   ├── settings/                #   Organization settings
│   │   │   ├── feed/                    #   Organization feed
│   │   │   └── documents/               #   Document library
│   │   ├── superadmin/                  # Platform admin portal (system_admin role)
│   │   │   ├── dashboard/               #   Platform overview
│   │   │   ├── organizations/           #   Tenant management
│   │   │   ├── accreditations/          #   Accreditation review
│   │   │   ├── members/                 #   Platform-wide member view
│   │   │   ├── settings/                #   Platform settings
│   │   │   └── advisers/                #   Adviser management
│   │   ├── member/                      # Member portal (member role)
│   │   │   ├── dashboard/               #   Member dashboard
│   │   │   ├── feed/                    #   Organization feed (home)
│   │   │   ├── events/                  #   Event calendar
│   │   │   ├── attendance/              #   Attendance history
│   │   │   ├── applications/            #   Personal applications
│   │   │   ├── id/                      #   Digital QR ID card
│   │   │   ├── members/                 #   Member directory
│   │   │   ├── settings/                #   Profile settings
│   │   │   └── documents/               #   Document library
│   │   ├── officer/                     # Officer portal (officer role)
│   │   │   ├── dashboard/               #   Officer dashboard
│   │   │   ├── feed/                    #   Organization feed
│   │   │   ├── events/                  #   Event management
│   │   │   ├── attendance/              #   Attendance tracking
│   │   │   ├── recruitment/             #   Recruitment review
│   │   │   ├── members/                 #   Roster management
│   │   │   └── documents/               #   Document library
│   │   ├── landing/                     # Public landing page
│   │   ├── onboarding/                  # New organization onboarding wizard
│   │   ├── pending/                     # Organization status: pending accreditation
│   │   ├── rejected/                    # Organization status: rejected
│   │   ├── inactive/                    # Organization status: inactive
│   │   ├── suspended/                   # Organization status: suspended
│   │   ├── sandbox/                     # Development/testing sandbox
│   │   ├── [role]/                      # Dynamic role-based routing
│   │   │   ├── apply/                   #   Role-scoped application
│   │   │   └── [[...slug]]/             #   Catch-all fallback
│   │   └── api/                         # API routes (webhooks, RPC proxies)
│   ├── components/
│   │   ├── atoms/                       # 11 foundational primitives (button, input, badge, etc.)
│   │   ├── molecules/                   # 21 composable components (forms, nav, cards, etc.)
│   │   ├── organisms/                   # 52 full-featured modules (dashboards, managers, forms)
│   │   ├── providers/                   # React context providers (tenant, temporary-applicant)
│   │   └── templates/                   # Page-level shells (authenticated, landing, onboarding)
│   └── lib/
│       ├── tenant.ts                    # getTenantRequestContext() — header-only tenant resolution
│       ├── host-routing.ts              # Subdomain parsing, root domain config, cookie domain
│       ├── auth-policy.ts               # Password requirements, session claims extraction
│       ├── auth-landing.ts              # Auth landing page helpers
│       ├── navigation-config.tsx        # Route definitions, sidebar navigation, visibility rules
│       ├── roles.ts                     # Role hierarchy, privilege checking (isRoleAtLeast)
│       ├── organization-permissions.ts  # Permission system (7 permission types)
│       ├── notification-data.ts         # Notification type definitions and demo data
│       ├── officer-demo-data.ts         # Demo events for officer views
│       ├── root-domain.ts               # Root domain configuration
│       ├── reserved-subdomains.ts       # Reserved tenant slug blocklist
│       ├── utils.ts                     # Shared utility functions (cn, etc.)
│       ├── actions/                     # 15 Server Action files
│       │   ├── auth.ts                  #   Sign in, sign up, sign out, password reset
│       │   ├── organizations.ts         #   Organization CRUD
│       │   ├── accreditation.ts         #   Accreditation workflow
│       │   ├── accreditation-requests.ts#   Accreditation request handling
│       │   ├── members.ts               #   Member management
│       │   ├── temporary-applicants.ts  #   Temporary applicant review
│       │   ├── recruitment.ts           #   Recruitment cycles (server)
│       │   ├── recruitment-client.ts    #   Recruitment (client-safe)
│       │   ├── events.ts                #   Event CRUD
│       │   ├── attendance.ts            #   Attendance tracking
│       │   ├── announcements.ts         #   Announcements & feed
│       │   ├── documents.ts             #   Document management
│       │   ├── roles.ts                 #   Role assignment
│       │   ├── organization-settings.ts #   Theme & org config
│       │   └── provisioning.ts          #   Account provisioning
│       └── supabase/
│           └── server.ts                # resolveCurrentTenant(), getCurrentViewer() — React cache()
├── supabase/
│   ├── config.toml                      # Local Supabase CLI config
│   ├── migrations/                      # 23 migration files (schema, RLS, features)
│   │   ├── ..._01_initial_schema.sql    #   Core tables (organizations, memberships, projects, audit)
│   │   ├── ..._02_security.sql          #   RLS policies, tenant helper functions
│   │   ├── ..._03_theme_config.sql      #   Branding/theming support
│   │   ├── ..._organization_type.sql    #   Organization type classification
│   │   ├── ..._temporary_applicants*.sql#   Temporary applicant records & security
│   │   ├── ..._organization_roles.sql   #   Role system enhancements
│   │   ├── ..._recruitment_*.sql        #   Recruitment pipeline & settings
│   │   ├── ..._events_and_attendance.sql#   Events & attendance tracking
│   │   ├── ..._qr_attendance_fields.sql #   QR code support for events
│   │   ├── ..._organization_status*.sql #   Organization status lifecycle
│   │   ├── ..._temporary_roles.sql      #   Temporary role assignments
│   │   ├── ..._accreditation_requests.sql#  Accreditation request workflow
│   │   ├── ..._announcements.sql        #   Announcements & feed
│   │   └── ..._documents*.sql           #   Documents, folders, access control
│   ├── seed.sql                         # Demo tenant data (system-admin, acme, icpep-se)
│   └── tests/                           # pgTAP RLS verification tests
├── tasks/
│   ├── todo.md                          # Active task tracking
│   └── lessons.md                       # Development lessons learned
├── Documents/
│   └── SALINA_Documentation.md          # Architectural and technical specification
├── .env.example                         # Environment variable template
├── CONTRIBUTING.md                      # Developer guide — architecture, conventions, CI
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── next.config.ts
└── postcss.config.mjs
```

### Database

The database has evolved through 23 tracked migrations from the initial core schema. Current tables include:

| Table | Tenant-scoped | Purpose |
|---|---|---|
| `organizations` | N/A (is the tenant) | Tenant records with status, type, and theme config |
| `organization_memberships` | Yes (`tenant_id`) | User ↔ org role mapping with permissions |
| `tenant_domains` | Yes (`tenant_id`) | Custom domain → tenant mapping |
| `projects` | Yes (`tenant_id`) | Workspaces within a tenant |
| `audit_events` | Yes (`tenant_id`) | Audit trail for all actions |
| `temporary_applicants` | Yes (`tenant_id`) | Pre-membership applicant records |
| `recruitment_entries` | Yes (`tenant_id`) | Recruitment cycle definitions |
| `recruitment_settings` | Yes (`tenant_id`) | Per-tenant recruitment configuration |
| `events` | Yes (`tenant_id`) | Organization events |
| `event_attendance` | Yes (`tenant_id`) | Attendance records with QR check-in |
| `announcements` | Yes (`tenant_id`) | Organization announcements & feed |
| `documents` | Yes (`tenant_id`) | Document storage with access control |
| `document_folders` | Yes (`tenant_id`) | Folder hierarchy for documents |
| `accreditation_requests` | Yes (`tenant_id`) | Organization accreditation workflow |
| `organization_roles` | Yes (`tenant_id`) | Configurable role definitions |

All tenant-scoped tables are protected by Row Level Security with `has_tenant_access()` policies and `enforce_tenant_scope()` triggers.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full developer guide: architecture decisions, the Atomic System Design pattern, proxy and data-flow conventions, database workflow, and CI/CD rules.

For the complete architectural and technical specification, see [SALINA Documentation](Documents/SALINA_Documentation.md).
