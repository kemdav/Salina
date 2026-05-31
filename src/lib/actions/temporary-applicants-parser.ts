import { z } from "zod";

const createTemporaryApplicantSchema = z.object({
  applicantEmail: z.string().trim().email("Enter a valid email address."),
  applicantName: z.string().trim().min(1, "Applicant name is required."),
});

export type SelfInitiateApplicationSubmission =
  | {
      ok: true;
      values: {
        applicantEmail: string;
        applicantName: string;
        recruitmentEntryId: string;
        tenantSlug: string;
      };
    }
  | {
      ok: false;
      error?: string;
      notice?: string;
      fields: {
        applicantEmail: string;
        applicantName: string;
        recruitmentEntryId?: string;
      };
    };

export function parseSelfInitiateApplicationSubmission(
  tenantSlug: string,
  recruitmentEntryId: string,
  formData: FormData,
): SelfInitiateApplicationSubmission {
  const fields = {
    applicantEmail: String(formData.get("applicantEmail") ?? "").trim(),
    applicantName: String(formData.get("applicantName") ?? "").trim(),
    recruitmentEntryId: recruitmentEntryId.trim() || undefined,
  };

  if (!fields.recruitmentEntryId) {
    return {
      ok: false,
      error: "Application link is missing its recruitment cycle.",
      fields,
    };
  }

  if (!tenantSlug.trim()) {
    return {
      ok: false,
      error: "Application link is missing its tenant information.",
      fields,
    };
  }

  const values = createTemporaryApplicantSchema.safeParse({
    applicantEmail: fields.applicantEmail,
    applicantName: fields.applicantName,
    recruitmentEntryId: fields.recruitmentEntryId,
  });

  if (!values.success) {
    const fieldErrors = values.error.flatten().fieldErrors;

    return {
      ok: false,
      notice:
        fieldErrors.applicantEmail?.[0] ??
        fieldErrors.applicantName?.[0] ??
        "Enter applicant details.",
      fields,
    };
  }

  return {
    ok: true,
    values: {
      applicantEmail: values.data.applicantEmail,
      applicantName: values.data.applicantName,
      recruitmentEntryId: fields.recruitmentEntryId,
      tenantSlug: tenantSlug.trim(),
    },
  };
}