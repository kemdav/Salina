import type { Metadata } from "next";
import { AdviserSignUpForm } from "@/components/organisms/adviser-sign-up-form";
import { getCurrentViewer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Adviser Sign Up | Salina",
  description: "Complete your adviser registration.",
};

export default async function AdviserSignUpPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const inviteToken = typeof params.invite === "string" ? params.invite : "";

  if (!inviteToken) {
    return (
      <div className="mx-auto max-w-xl py-12 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Invalid Invite Link</h1>
        <p className="mt-4 text-slate-600">
          This invite link is missing or invalid. Please request a new invite from the platform administrator.
        </p>
      </div>
    );
  }

  const viewer = await getCurrentViewer();

  if (viewer) {
    return (
      <div className="mx-auto max-w-xl py-12 px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Already Signed In</h1>
        <p className="mt-4 text-slate-600">
          You are currently signed in. If you want to accept an invitation, please sign out first, or use a private browsing window.
        </p>
      </div>
    );
  }

  return <AdviserSignUpForm inviteToken={inviteToken} />;
}
