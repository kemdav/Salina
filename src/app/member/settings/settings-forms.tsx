"use client";

import { useActionState, useEffect, useState, useMemo } from "react";
import { updateProfileAction, changePasswordAction } from "@/lib/actions/auth";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Switch } from "@/components/atoms/switch";
import { FieldMessage } from "@/components/atoms/field-message";
import { Label } from "@/components/atoms/label";

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export function SettingsForms({
  initialDisplayName,
  initialAvatarUrl,
}: {
  initialDisplayName: string;
  initialAvatarUrl: string;
}) {
  const [profileState, profileAction, isProfilePending] = useActionState(
    updateProfileAction,
    {},
  );
  const [passwordState, passwordAction, isPasswordPending] = useActionState(
    changePasswordAction,
    {},
  );

  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("salina_notifications");
    if (saved !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotificationsEnabled(saved === "true");
    }
  }, []);

  const handleToggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem("salina_notifications", String(checked));
  };

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  return (
    <div className="flex flex-col gap-8">
      {/* Profile Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Profile</h2>
        <form action={profileAction} className="flex flex-col gap-5">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-inner">
              {avatarUrl ? (
                <div
                  className="h-full w-full bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${avatarUrl})` }}
                />
              ) : (
                <span className="text-2xl font-bold text-slate-600">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.png"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-slate-500">
                Provide a URL to your avatar image, or leave blank to use
                initials.
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1"
            />
          </div>

          {profileState.error && (
            <FieldMessage variant="error">{profileState.error}</FieldMessage>
          )}
          {profileState.success && (
            <FieldMessage variant="success">
              {profileState.success}
            </FieldMessage>
          )}

          <div className="mt-2">
            <Button type="submit" disabled={isProfilePending}>
              {isProfilePending ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </section>

      {/* Notifications Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Preferences
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-800">
              Email Notifications
            </h3>
            <p className="text-sm text-slate-500">
              Receive updates and alerts via email.
            </p>
          </div>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
          />
        </div>
      </section>

      {/* Password Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Change Password
        </h2>
        <form action={passwordAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1"
            />
          </div>

          {passwordState.error && (
            <FieldMessage variant="error">{passwordState.error}</FieldMessage>
          )}
          {passwordState.success && (
            <FieldMessage variant="success">
              {passwordState.success}
            </FieldMessage>
          )}

          <div className="mt-2">
            <Button
              type="submit"
              disabled={isPasswordPending}
              variant="secondary"
            >
              {isPasswordPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
