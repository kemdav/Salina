import { redirect } from "next/navigation";
import { createUserClient } from "@/lib/supabase/user-server";
import { LOCAL_COOKIE_DOMAIN } from "@/lib/host-routing";
import { SettingsForms } from "./settings-forms";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const supabase = await createUserClient(LOCAL_COOKIE_DOMAIN);

  if (!supabase) {
    redirect("/login");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userMetadata = user.user_metadata || {};
  const displayName =
    userMetadata.display_name || user.email?.split("@")[0] || "";
  const avatarUrl = userMetadata.avatar_url || "";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Settings</h1>
      <SettingsForms
        initialDisplayName={displayName}
        initialAvatarUrl={avatarUrl}
      />
    </div>
  );
}
