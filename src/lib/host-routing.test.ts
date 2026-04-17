import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveRootDomainFromHost,
  getCanonicalLocalAuthUrl,
  getCookieDomain,
  getTenantSlugFromHost,
  PRODUCTION_ROOT_DOMAIN,
  isLandingHost,
} from "./host-routing";

function setEnv(name: string, value: string | undefined) {
  const env = process.env as Record<string, string | undefined>;

  if (value === undefined) {
    delete env[name];
    return;
  }

  env[name] = value;
}

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
    assert.equal(isLandingHost("www.salina.software"), true);
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

test("production hosts still resolve when ROOT_DOMAIN is unset", () => {
  const originalRootDomain = process.env.ROOT_DOMAIN;
  const originalNodeEnv = process.env.NODE_ENV;

  setEnv("ROOT_DOMAIN", undefined);
  setEnv("NODE_ENV", "production");

  try {
    assert.equal(isLandingHost(PRODUCTION_ROOT_DOMAIN), true);
    assert.equal(isLandingHost(`www.${PRODUCTION_ROOT_DOMAIN}`), true);
    assert.equal(
      deriveRootDomainFromHost(PRODUCTION_ROOT_DOMAIN),
      PRODUCTION_ROOT_DOMAIN
    );
    assert.equal(
      getTenantSlugFromHost(`acme.${PRODUCTION_ROOT_DOMAIN}`),
      "acme"
    );
  } finally {
    setEnv("ROOT_DOMAIN", originalRootDomain);
    setEnv("NODE_ENV", originalNodeEnv);
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
