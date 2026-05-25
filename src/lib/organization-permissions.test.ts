import assert from "node:assert/strict";
import test from "node:test";

import { canManageTemporaryApplicants } from "./organization-permissions";

test("platform admins can manage temporary applicants", () => {
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: true, tenantRole: null, customPermissions: [] }), true);
});

test("tenant owners, admins, and officers can manage temporary applicants", () => {
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "owner", customPermissions: [] }), true);
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "admin", customPermissions: [] }), true);
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "officer", customPermissions: [] }), true);
});

test("members and viewers cannot manage temporary applicants", () => {
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "member", customPermissions: [] }), false);
  assert.equal(canManageTemporaryApplicants({ isPlatformAdmin: false, tenantRole: "viewer", customPermissions: [] }), false);
  assert.equal(canManageTemporaryApplicants(null), false);
});