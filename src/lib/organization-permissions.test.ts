import assert from "node:assert/strict";
import test from "node:test";

import { canManageTemporaryApplicants } from "./organization-permissions";

test("platform admins can manage temporary applicants", () => {
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: true, tenantRole: null }), true);
});

test("tenant owners, admins, and officers can manage temporary applicants", () => {
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "owner" }), true);
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "admin" }), true);
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "officer" }), true);
});

test("members and viewers cannot manage temporary applicants", () => {
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "member" }), false);
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "viewer" }), false);
  assert.equal(canManageTemporaryApplicants(null), false);
});