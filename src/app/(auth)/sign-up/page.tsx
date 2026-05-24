import type { ComponentType } from "react";

import { SignUpForm, type SignUpFormProps } from "@/components/organisms/sign-up-form";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getCurrentViewer } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";

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

  const viewer = await getCurrentViewer();

  if (viewer) {
    return (
      <div className="mx-auto max-w-xl py-12 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Already Signed In</h1>
        <p className="mt-4 text-slate-600">
          You are currently signed in. If you want to accept an invitation or create a new account, please sign out first, or use a private browsing window (Incognito).
        </p>
        <div className="mt-6">
          <form action={signOut}>
            <button type="submit" className="text-indigo-600 font-medium hover:underline">
              Sign out of current account
            </button>
          </form>
        </div>
      </div>
    );
  }

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
