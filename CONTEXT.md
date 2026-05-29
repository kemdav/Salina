**Description:** Wire the superadmin Advisers tab (currently mock-only) into the existing architecture — database table, server actions, RLS, navigation, and accreditation assignment. Advisers are platform-level reviewers who evaluate organization accreditation requests.

**Acceptance Criteria:**
- [ ] Advisers have a dedicated database table with proper RLS and tenant helpers
- [ ] Superadmins can view, approve, and reject adviser applications via the `/superadmin/advisers` page
- [ ] Approved advisers appear in the accreditation review workspace "Assigned Adviser" dropdown
- [ ] Adviser approval/rejection is audited via `audit_events`
- [ ] `npm run lint` and `npm run typecheck` pass

---

> **Dependencies:** None (this is a net-new feature integration of an existing mock page)

---

### Phase 1: Database Foundation

1. Create migration: `advisers` table (`id`, `tenant_id` nullable, `user_id` nullable, `name`, `email`, `organization_name`, `status` with check constraint `pending|approved|rejected`, `reviewed_by`, `reviewed_at`, `notes`, timestamps)
2. Add RLS policy + `enforce_*_tenant_scope` trigger + `updated_at` trigger
3. Add `authenticated` grants
4. Create `supabase/tests/advisers_rls.sql` pgTAP test

### Phase 2: Server Actions (Atom tier) — *depends on Phase 1*

5. Create `src/lib/actions/advisers.ts`: `approveAdviser`, `rejectAdviser`, `getAdvisers` (filter/search), `getApprovedAdvisers` (lightweight for dropdowns)
6. Define `Adviser` TypeScript type

### Phase 3: Wire the UI (Organism tier) — *depends on Phase 2*

7. Refactor page.tsx: replace mock data with real server actions, wire Approve/Reject/View buttons, filter + search, pagination, loading/empty/error states

### Phase 4: Accreditation Integration (Molecule tier) — *depends on Phase 2*

8. Add `assigned_adviser_id` column to `accreditation_requests` via migration
9. Extend accreditation.ts with `assignAdviser` action
10. Replace mock adviser dropdown in `accreditation-review-workspace.tsx` with live data from `getApprovedAdvisers`

### Phase 5: Verification — *depends on all prior phases*

11. `npm run lint` + `npm run typecheck`
12. `npm run db:reset` + `npm run db:test`
13. Manual smoke test with `system-admin@salina.dev`

---

**Relevant files**
- migrations — new migration for `advisers` table + RLS
- `supabase/tests/advisers_rls.sql` — new pgTAP test
- `src/lib/actions/advisers.ts` — new server actions (follow `accreditation.ts` pattern)
- page.tsx — refactor mock → real
- accreditation-review-workspace.tsx — live adviser assignment
- accreditation.ts — extend with `assignAdviser`

**Decisions**
- Advisers are **platform-level** — `tenant_id` is nullable for platform-wide scope
- No new role in `roles.ts` — advisers are a separate entity, not org members
- Adviser *application* flow (how pending records are created) is **out of scope** — assumes pre-seeded records
- "View" button opens inline detail panel, not a separate page
- "Bulk Review" button kept as stub for follow-up

**Further Considerations**
1. How do applications originate? Public form vs. email invite (like `temporary_applicants`)? → **Follow-up task**
2. Should approved advisers get Supabase Auth accounts? → `user_id` column supports it, but auth flow is **out of scope**
3. Bulk review → **stub for follow-up**