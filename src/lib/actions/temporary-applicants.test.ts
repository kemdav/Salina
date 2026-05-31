import assert from "node:assert/strict";
import test from "node:test";

import { parseSelfInitiateApplicationSubmission } from "./temporary-applicants-parser";

function makeFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

test("self-initiate application parsing uses bound route context", () => {
  const submission = parseSelfInitiateApplicationSubmission(
    "acme",
    "550e8400-e29b-41d4-a716-446655440000",
    makeFormData({
      applicantEmail: "jordan.reyes@campus.edu",
      applicantName: "Jordan Reyes",
    }),
  );

  assert.equal(submission.ok, true);
  if (!submission.ok) {
    throw new Error("Expected a successful submission parse.");
  }

  assert.equal(submission.values.tenantSlug, "acme");
  assert.equal(submission.values.recruitmentEntryId, "550e8400-e29b-41d4-a716-446655440000");
  assert.equal(submission.values.applicantName, "Jordan Reyes");
  assert.equal(submission.values.applicantEmail, "jordan.reyes@campus.edu");
});

test("self-initiate application parsing reports missing route context explicitly", () => {
  const submission = parseSelfInitiateApplicationSubmission(
    "",
    "",
    makeFormData({
      applicantEmail: "jordan.reyes@campus.edu",
      applicantName: "Jordan Reyes",
    }),
  );

  assert.equal(submission.ok, false);
  if (submission.ok) {
    throw new Error("Expected the submission parse to fail.");
  }

  assert.equal(submission.error, "Application link is missing its recruitment cycle.");
});