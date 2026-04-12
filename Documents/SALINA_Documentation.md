# SALINA - Software Design Document

**KIRK Ltd.** **Version:** 0.01  
**Date:** 03/17/2026  

---

## Revision History

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 03/17/2026 | v0.01 | Commencement of system design, including multi-tenant architecture mapping, UI/UX specifications, and database schema formulation. | K.I.R.K Ltd. |

---

## Introduction

### Purpose

This document defines the architectural and technical specification for SALINA. It translates the functional and non-functional requirements into concrete design decisions, system blueprints, and implementation guidelines. This Software Design Document serves as the authoritative reference and development blueprint for all engineering work on the SALINA system. It encompasses the system's multi-tenant architecture, data model, API layer, security control, and component hierarchy. All development activities shall be aligned with and traceable to the specification defined herein. This document is intended for use by the SALINA development team, including frontend engineers, backend engineers, database architects and the leads of K.I.R.K Ltd.

### Scope

#### IN-SCOPE ITEMS

1. The platform centralizes recruitment, data management, and internal communications.
2. The system provides a Policy Engine to configure recruitment workflows.
3. The architecture enforces database-level multi-tenancy.
4. The application features digital QR identification and event check-in attendance tracking for members.
5. Members can view organization-specific internal newsfeed along with ability to monitor dues and membership status.

#### OUT-OF-SCOPE ITEMS

1. Direct financial transactions and payment processing are excluded from the platform.
2. Users upload payment receipts for manual verification.
3. The system excludes academic grading or university-level enrollments.
4. The architecture excludes public-facing social media integrations.
5. Content remains restricted to the internal organizational feed and not published externally.
6. Native communication channels such as direct messaging, group chats, and video calling are excluded.

---

## SaaS Strategy

### TARGET AUDIENCE

The platform targets any organization seeking to centralize recruitment, membership management, and internal operations. Organization Officers configure and manage the environment while Members and Applicants interact with the portal and pipeline.

### TENANT MODEL

SALINA operates on a single shared backend where all tenants share the same Next.js deployment and Supabase PostgreSQL instance. Isolation is enforced at the database level through Row Level Security (RLS), which validates every query against the user's JWT `org_id` claim, ensuring no user can access another organization's data under any circumstance. Organizations enter the platform through a Super Admin accreditation flow, and only those granted Live status may onboard members and operate a recruitment pipeline. Each tenant independently configures its own brand identity such as logo, colors, and font and which is applied platform-wide through a white-labeled interface.

### MONETIZATION INTERFACE

SALINA uses a single-tier access model where all accredited organizations receive the full feature set with no subscription tiers, feature flags, or paywalled capabilities. The platform excludes all financial transaction processing - dues statuses are tracked as member metadata and updated manually by Officers upon receipt verification. Interface design and feature availability remain consistent across all tenants.

---

## System Overview

SALINA is built on a client-server architecture where a Next.js App Router frontend communicates directly with a Supabase PostgreSQL backend through Next.js Server Actions. This design eliminates the need for a separately deployed middleware or REST API layer, consolidating the application logic, data communication, and database state management within a single cohesive technical stack. The architecture is designed to support multi-tenant operations, enforcing organization-level data isolation at every layer from the frontend session down to the database query.

---

## Definitions and Acronyms

* **Tenant:** A registered organization operating on the platform.
* **Policy Engine:** The core logic system that dynamically alters the application workflow based on an organization's configuration.
* **RLS:** A database-level security feature that enforces strict data isolation between tenants at the PostgreSQL layer.
* **Pipeline Stage:** A specific step in a recruitment workflow as defined by the tenant's active policy configuration.

---

## System & Multi-tenancy Architecture

Salina is a specialized, multi-tenant Software-as-a-Service (SaaS) engine designed to centralize recruitment, data management, and internal communications into one platform. Acting as an "Operating System" for organizations, it replaces disjointed workflows such as scattered spreadsheets and chat groups with a unified, configurable solution.

### Architectural Pattern

The project utilizes a modern, serverless Client-Server architecture built on the Next.js App Router. The frontend leverages React Server Components to pre-render dynamic, multi-tenant UI layouts on the server, while Client Components handle interactive states. This architecture eliminates the need for a traditional standalone middleware layer (like Node.js/Express) by communicating directly with the cloud-hosted Supabase PostgreSQL backend via Next.js Server Actions.

### Tenant Isolation Strategy

Because all organizations share a single database schema, strict tenant isolation is the highest security priority.

**Data Isolation:**
Salina implements a Shared-Schema with `tenant_id` filters strategy, mathematically enforced at the PostgreSQL level using Supabase Row Level Security (RLS). Every database query automatically validates the user's active JSON Web Token (JWT) against the `org_id` column of the queried table (e.g., `auth.jwt() ->> 'org_id' = organization_id`). This guarantees that cross-tenant data leakage is impossible.

**Application Isolation:**
The application utilizes a Shared runtime with namespace isolation. By extracting the `org_id` from the URL slug or active session, the Next.js frontend dynamically swaps the organizational context (such as branding colors, typography, and policy JSONs) to provide the illusion of a dedicated, standalone application for each tenant.

### Atomic Infrastructure

The system infrastructure is partitioned following an adapted Atomic Design methodology:

* **Global Atoms:** Foundational, immutable services that power the entire platform (e.g., Supabase Auth, Supabase Storage).
* **Tenant Molecules:** Configurable logic blocks injected by individual tenants (e.g., `theme_config`, `pipeline_config`).
* **Tenant Organisms:** Complex, interactive modules driven by active Molecules (e.g., Real-time Internal Newsfeed, dynamic Applicant Kanban Board).
* **Templates/Pages:** Final layout wrappers that assemble Organisms, inject Tenant Molecules, and serve the branded experience.

### Authentication & RBAC (Role-Based Access Control)

All user identities are authenticated via Supabase Auth using secure JSON Web Tokens. The platform implements a dynamic, multi-tier RBAC system:

1. **Super Admin:** Platform-wide access; handles global accreditation.
2. **Organization Officer (Tenant Admin):** Write-access scoped strictly to their specific `org_id`. Can dynamically assign sub-roles.
3. **Organization Member / Applicant:** Read-only or limited write-access (e.g., viewing internal feeds, QR IDs, submitting applications).

---

## Data Flow & Integration

The system utilizes a streamlined, unidirectional data flow that bypasses traditional REST APIs for direct server-to-database communication.

1. **Trigger Event:** Client Component invokes Action.
2. **Validate JWT & Role:** Server Action performs RBAC validation.
3. **Execute SQL Mutation:** Direct call to Supabase PostgreSQL.
4. **RLS Math Check & Return Result:** DB enforces security, returns state.
5. **revalidatePath() / Return Status:** Next.js syncs server state.
6. **Update UI:** React State / Optimistic UI updates.

### State Management & Optimistic UI Updates

To ensure a highly responsive user experience (like the Kanban Board), Salina implements Optimistic UI updates. When a user initiates a state change, the Next.js frontend utilizes React's `useOptimistic` hook to instantly reflect the new state visually. The Server Action fires asynchronously; if it fails, the state is rolled back.

---

## Error Handling & Logging Strategy

* **Client-Side Boundaries:** Next.js `error.tsx` React Error Boundaries catch unhandled runtime exceptions in Client Components, displaying a branded fallback.
* **Server Action Catch Blocks:** All database mutations are wrapped in strict try-catch blocks. Standardized JSON error objects are returned instead of raw 500 codes.
* **Form Validation:** Client and server inputs are validated using Zod schemas.
* **Centralized Logging:** Critical failures and DB timeouts are logged via Vercel edge logging.

---

## Deployment & Environments

* **Hosting Infrastructure:** Next.js frontend and Server Actions deployed on Vercel. Database/Auth hosted on managed Supabase cloud.
* **Local Development:** Local Next.js client and local Dockerized Supabase instance for schema modifications.
* **Staging:** Pushes to the main branch trigger an automated Vercel preview deployment connected to a Supabase Staging project.
* **Production:** Merges to the production branch trigger live deployment. DB changes applied strictly via Supabase Migration files.

---

## Design System & UI/UX (Foundational Elements)

### Design Tokens (The Atoms)

* **Primary Color (#C6623E):** Primary buttons, Active States, Navigation Highlights.
* **Secondary Color (#95CDE0):** Secondary actions, Supporting UI accents.
* **Accent Color (#8A6ED4):** Tags, badges.
* **Neutral Color (#FBF5F2):** Layout structure, backgrounds, readability.

### Typography

* **H1:** Plus Jakarta Sans, Bold, 45px
* **H2:** Plus Jakarta Sans, Bold, 35px
* **H3:** Space Grotesk, Bold, 25px
* **H4:** Space Grotesk, Medium, 18px
* **H5:** Space Grotesk, Regular, 16px
* **Paragraph:** Inter, Regular, 16px

### Spacing and Grid

* **Desktop Grid:** 12 Columns, Max Width 1440px, Gutter 24px, Margin 80px.
* **Spacing Scale (4px system):** 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px.

---

## Component Library & Atomic System

### Atoms

* **Buttons:** Default, Hover, Active, Disabled states.
* **Input Fields:** Text input, Password input, Search input.
* **Badges:** Applicant/Member/Payment status.

### Molecules

* **Search bars:** Enables filtering of table data.
* **Card Headers:** Analytic panels, Dashboard cards.
* **Form Groups:** Label + input + validation message.

### Provisioning Organism (The Onboarding Engine)

Validates organization accreditation, creates Organization record (`OrgID`), assigns roles, and seeds recruitment policy and initial UI configuration.

### Organisms

1. **Navigation Sidebar:** Route-based active state, dynamic rendering based on user role.
2. **Data Dashboard Grid:** Header (Search/Filters), Body (Metrics Cards, Tables, Charts). Uses Pagination (max 50 records) and Optimistic UI.

---

## Data Design (Schema Logic)

Salina relies on strict tenant data isolation enforced by Row Level Security (RLS). Every table containing tenant-specific data includes an `OrgID` foreign key.

### Global Platform Tables

* **Organization:** `OrgID` (PK), `Name`, `Status`, `PrimaryColor`, `FontStyle`, `Mode`, `LogoURL`.

### Tenant-Scoped Tables

* **User:** `UserID` (PK), `OrgID` (FK), `Email`, `FullName`, `Role`, `IsVerified`.
* **Recruitment Policy:** `PolicyID` (PK), `OrgID` (FK), `PipelineStages` (JSONB), `IsActive`.
* **Applicant:** `ApplicantID` (PK), `OrgID` (FK), `UserID` (FK), `CurrentStage`, `ApplicationStatus`, `ApplicationData` (JSONB).
* **Submission File:** `FileID` (PK), `ApplicantID` (FK), `FileURL`, `VerificationStatus`.
* **Member:** `MemberID` (PK), `UserID` (FK), `OrgID` (FK), `Status`, `DuesStatus`, `EngagementScore`.
* **Digital ID:** `IDToken` (PK), `UserID` (FK), `OrgID` (FK), `QRCodeURL`, `IsActive`.
* **Attendance:** `AttendanceID` (PK), `EventID` (FK), `UserID` (FK), `OrgID` (FK), `CheckInTime`, `CheckInMethod`.
* **Event:** `EventID` (PK), `OrgID` (FK), `Name`, `Description`, `Location`, `ScheduledDate`.
* **Member Activity:** `ActivityID` (PK), `MemberID` (FK), `PostID`, `ActivityType`, `Points`.

### RLS Policies (Examples)

* **Applicant Table:** Select/Update allowed if `auth.jwt() ->> 'org_id' = OrgID` AND the user possesses the Officer role.
* **Organization Table:** Update allowed only for platform Super Admin or the specific tenant's verified Officer.

---

## API Design & Rate Limiting

### Tenant Scoping

Tenant scoping is enforced via cryptographic JWT claims. The Next.js server extracts the signed JWT from the secure session cookie and passes it directly to Supabase, bypassing traditional `X-Tenant-ID` header spoofing risks.

### Quotas (Mitigating Noisy Neighbors)

1. **Edge-Level Rate Limiting:** Sliding window limits keyed by `OrgID`.
2. **Storage Quotas:** `TotalStorageUsed` tracked per tenant. Hard quota enforced before Supabase Storage upload.
3. **Query Complexity Caps:** GIN-indexed JSONB queries enforce strict limits (e.g., max 50 records per page).

---

## Database Backups & Disaster Recovery

* **Automated Daily Backups:** Managed by Supabase (rolling 7 days).
* **Point-in-Time Recovery (PITR):** Utilizes Write-Ahead Logs (WAL) to enable rollback to a specific minute.
* **Storage Redundancy:** Supabase Storage backed by standard cloud-provider redundancy across availability zones.

---

## Requirements Traceability Matrix

| Req ID | Component Name | Atomic Category | Verification Method |
| :--- | :--- | :--- | :--- |
| FR-1.1 | AccreditationDataTable | Organism | Integration Test / UI Test |
| FR-1.2 | GlobalMetrics Dashboard | Template | End-to-End (E2E) Test |
| FR-1.3 | Adviser ApprovalModal | Molecule | Unit Test |
| FR-1.4 | ThemeSettingsForm | Organism | Integration Test / UI Test |
| FR-2.1 | PipelineConfigBuilder (JSON) | Organism | Unit Test (Logic) / UI Test |
| FR-2.2 | KanbanBoard & DraggableCard | Organism | E2E Test (Drag-and-Drop) |
| FR-2.3 | DynamicApplicationForm | Organism | Integration Test |
| FR-3.1 | Member RosterGrid (Tags) | Organism | Integration Test |
| FR-3.2 | PostComposer & EventScheduler | Molecule | Unit Test / UI Test |
| FR-3.3 | QRScannerCamera | Molecule | Manual Test / E2E Test |
| FR-4.1 | ApplicationStatus Tracker | Molecule | Unit Test |
| FR-4.2 | DigitalIDCard (QR Generator) | Molecule | Unit Test / UI Test |
| FR-4.3 | NewsfeedStream (Realtime) | Organism | Integration Test |
| FR-4.4 | MemberStanding Dashboard | Organism | UI Test |
| FR-5.1 | SupabaseAuthProvider (JWT) | Atom (Logic) | Integration Test |
| FR-5.2 | PostgresRLSPolicies | Database Level | Automated Security/DB Test |
| FR-5.3 | RBACServerActionWrapper | Atom (Logic) | Unit Test / Security Test |
| FR-5.4 | SecureFileUploader (Storage) | Molecule | Integration Test |
