import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveRootDomainFromHost,
  getCanonicalLocalAuthUrl,
  getCookieDomain,
  getTenantSlugFromHost,
  isLandingHost,
} from "./host-routing";

test("local hosts resolve to the shared salina.localhost root", () => {
  assert.equal(deriveRootDomainFromHost("localhost:3000"), "salina.localhost:3000");
  assert.equal(deriveRootDomainFromHost("acme.localhost:3000"), "salina.localhost:3000");
  assert.equal(
    deriveRootDomainFromHost("acme.salina.localhost:3000"),
    "salina.localhost:3000"
  );
});

test("only salina.localhost tenant subdomains produce a tenant slug", () => {
  assert.equal(getTenantSlugFromHost("localhost:3000"), null);
  assert.equal(getTenantSlugFromHost("acme.localhost:3000"), null);
  assert.equal(getTenantSlugFromHost("acme.salina.localhost:3000"), "acme");
  assert.equal(
    getTenantSlugFromHost("system-admin.salina.localhost:3000"),
    "system-admin"
  );
});

test("landing hosts are exact shared roots, not tenant subdomains", () => {
  const originalRootDomain = process.env.ROOT_DOMAIN;

  process.env.ROOT_DOMAIN = "salina.software";

  try {
    assert.equal(isLandingHost("localhost:3000"), true);
    assert.equal(isLandingHost("salina.localhost:3000"), true);
    assert.equal(isLandingHost("acme.localhost:3000"), false);
    assert.equal(isLandingHost("acme.salina.localhost:3000"), false);
    assert.equal(isLandingHost("salina.software"), true);
    assert.equal(isLandingHost("acme.salina.software"), false);
  } finally {
    if (originalRootDomain === undefined) {
      delete process.env.ROOT_DOMAIN;
    } else {
      process.env.ROOT_DOMAIN = originalRootDomain;
    }
  }
});

test("local auth cookies are pinned to the shared salina.localhost domain", () => {
  assert.equal(getCookieDomain("salina.localhost:3000"), ".salina.localhost");
  assert.equal(getCookieDomain("acme.salina.localhost:3000"), ".salina.localhost");
});

test("local auth redirects normalize bare localhost and tenant localhost hosts", () => {
  const redirectUrl = getCanonicalLocalAuthUrl(
    new URL("http://acme.localhost:3000/login")
  );

  assert.equal(redirectUrl, "http://salina.localhost:3000/login");
});
