import assert from "node:assert/strict";
import test from "node:test";

import {
  AUTH_PASSWORD_HELP_TEXT,
  AUTH_PASSWORD_REQUIREMENTS_PATTERN,
  getAuthSessionClaims,
  isStrongPassword,
} from "./auth-policy";

test("strong passwords must satisfy length and complexity requirements", () => {
  assert.equal(isStrongPassword("Short1!"), false);
  assert.equal(isStrongPassword("lowercaseonly123!"), false);
  assert.equal(isStrongPassword("ValidPass123!"), true);
  assert.equal(AUTH_PASSWORD_REQUIREMENTS_PATTERN.test("ValidPass123!"), true);
  assert.match(AUTH_PASSWORD_HELP_TEXT, /12 characters/);
});

test("auth session claims detect system admins and tenant IDs", () => {
  assert.deepEqual(
    getAuthSessionClaims({
      app_metadata: {
        roles: ["system_admin"],
        tenant_id: "11111111-1111-1111-1111-111111111111",
      },
    }),
    {
      isPlatformAdmin: true,
      isTemporaryApplicant: false,
      tenantId: "11111111-1111-1111-1111-111111111111",
    }
  );

  assert.deepEqual(
    getAuthSessionClaims({
      app_metadata: {
        role: "system_admin",
      },
    }),
    {
      isPlatformAdmin: true,
      isTemporaryApplicant: false,
      tenantId: null,
    }
  );

  assert.deepEqual(
    getAuthSessionClaims({
      app_metadata: {
        roles: ["member"],
        tenant_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      },
    }),
    {
      isPlatformAdmin: false,
      isTemporaryApplicant: false,
      tenantId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    }
  );
});

test("temporary applicant claims are detected from auth metadata", () => {
  assert.deepEqual(
    getAuthSessionClaims({
      app_metadata: {
        temporary_applicant: true,
      },
    }),
    {
      isPlatformAdmin: false,
      isTemporaryApplicant: true,
      tenantId: null,
    }
  );
});

test("auth session claims preserve tenant and temporary flags together", () => {
  assert.deepEqual(
    getAuthSessionClaims({
      app_metadata: {
        tenant_id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        temporary_applicant: true,
      },
    }),
    {
      isPlatformAdmin: false,
      isTemporaryApplicant: true,
      tenantId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    }
  );
});