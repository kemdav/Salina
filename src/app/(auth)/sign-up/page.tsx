import type { ComponentType } from "react";

import { SignUpForm, type SignUpFormProps } from "@/components/organisms/sign-up-form";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type InviteData = {
  applicantEmail: string;
  applicantName: string;
} | null;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const inviteToken = typeof params.invite === "string" ? params.invite : "";

  let inviteData: InviteData = null;

  if (inviteToken) {
    const adminClient = createSupabaseAdminClient("sign-up-prefill");

    if (adminClient) {
      const { data: temporaryApplicant } = await adminClient
        .from("temporary_applicants")
        .select("applicant_email, applicant_name")
        .eq("invite_token", inviteToken)
        .maybeSingle<{
          applicant_email: string;
          applicant_name: string;
        }>();

      if (temporaryApplicant) {
        inviteData = {
          applicantEmail: temporaryApplicant.applicant_email,
          applicantName: temporaryApplicant.applicant_name,
        };
      }
    }
  }

  const InviteAwareSignUpForm = SignUpForm as ComponentType<SignUpFormProps>;

  return <InviteAwareSignUpForm inviteData={inviteData} inviteToken={inviteToken} />;
}
