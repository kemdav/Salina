import assert from "node:assert/strict";
import test from "node:test";

import { getSidebarRoutes } from "./navigation-config";

test("member sidebar routes exclude discover", () => {
  const memberRouteHrefs = getSidebarRoutes("Member").map((route) => route.href);

  assert.deepEqual(memberRouteHrefs, [
    "/member/feed",
    "/member/applications",
    "/member/events",
    "/member/id",
  ]);
  assert.equal(memberRouteHrefs.includes("/member/discover"), false);
});