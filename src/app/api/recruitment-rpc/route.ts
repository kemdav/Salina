import { NextResponse } from "next/server";
import {
  createRecruitmentEntry,
  updateRecruitmentEntry,
  updateRecruitmentSettings,
  updateApplicantStage,
  updateApplicantDecision,
} from "@/lib/actions/recruitment";

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    let result;
    switch (action) {
      case "createRecruitmentEntry":
        result = await createRecruitmentEntry(payload);
        break;
      case "updateRecruitmentEntry":
        result = await updateRecruitmentEntry(payload);
        break;
      case "updateRecruitmentSettings":
        result = await updateRecruitmentSettings(payload.entryId, payload.settings);
        break;
      case "updateApplicantStage":
        result = await updateApplicantStage(payload.applicantId, payload.stage);
        break;
      case "updateApplicantDecision":
        result = await updateApplicantDecision(payload.applicantId, payload.status);
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ data: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
