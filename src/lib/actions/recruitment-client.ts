async function callRpc(action: string, payload: unknown) {
  const res = await fetch("/api/recruitment-rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(json.error || "An error occurred");
  }
  return json.data;
}

export async function createRecruitmentEntry(rawInput: unknown) {
  return callRpc("createRecruitmentEntry", rawInput);
}

export async function updateRecruitmentEntry(rawInput: unknown) {
  return callRpc("updateRecruitmentEntry", rawInput);
}

export async function updateRecruitmentSettings(entryId: string, settings: Record<string, unknown>) {
  return callRpc("updateRecruitmentSettings", { entryId, settings });
}

export async function updateApplicantStage(applicantId: string, stage: string) {
  return callRpc("updateApplicantStage", { applicantId, stage });
}

export async function updateApplicantDecision(applicantId: string, status: "approved" | "rejected") {
  return callRpc("updateApplicantDecision", { applicantId, status });
}
