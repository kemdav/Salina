"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { inviteMember } from "@/lib/actions/members";
import { FeedbackModal } from "@/components/organisms/feedback-modal";
import { Select } from "@/components/atoms/drop-down";

export function InviteMemberModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [emailData, setEmailData] = useState<{
    email: string;
    subject: string;
    body: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await inviteMember(formData);
      if (!res.success) {
        setError(res.error || "Failed to invite member");
        setIsPending(false);
        return;
      }

      const email = formData.get("email") as string;
      const name = formData.get("name") as string;
      const role = formData.get("role") as string;

      const tempPassword = res.tempPassword;
      let bodyText = "";
      if (tempPassword) {
        bodyText = `Hi ${name},\n\nYou have been invited to join our organization as a ${role}.\n\nPlease head over to our application and sign in with the following credentials to access your dashboard:\n\nEmail: ${email}\nPassword: ${tempPassword}\n\nBest regards,\nThe Admin Team`;
      } else {
        bodyText = `Hi ${name},\n\nYou have been added to our organization as a ${role}.\n\nPlease log into your account to access your new dashboard.\n\nBest regards,\nThe Admin Team`;
      }

      const subject = encodeURIComponent("Invitation to join our organization");
      const body = encodeURIComponent(bodyText);

      setEmailData({ email, subject, body });

      setIsOpen(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to invite member";
      setError(errorMessage);
    } finally {
      setIsPending(false);
    }
  };

  const handleGmail = () => {
    if (!emailData) return;
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${emailData.email}&su=${emailData.subject}&body=${emailData.body}`,
      "_blank",
    );
    setEmailData(null);
  };

  const handleOutlook = () => {
    if (!emailData) return;
    window.open(
      `https://outlook.office.com/mail/deeplink/compose?to=${emailData.email}&subject=${emailData.subject}&body=${emailData.body}`,
      "_blank",
    );
    setEmailData(null);
  };

  const handleDefaultEmail = () => {
    if (!emailData) return;
    window.location.href = `mailto:${emailData.email}?subject=${emailData.subject}&body=${emailData.body}`;
    setEmailData(null);
  };

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          setError("");
        }}
      >
        + Invite Member
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-foreground">Invite Member</h2>
            <p className="mt-2 text-sm text-slate-500">
              Invite a new member to join the organization. They will receive an
              email invitation.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Role
                </label>
                <Select
                  id="role"
                  name="role"
                  className="h-10 w-full cursor-pointer"
                >
                  <option value="member">Member</option>
                  <option value="officer">Officer</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsOpen(false);
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Inviting..." : "Send Invite"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={!!emailData}
        onClose={() => setEmailData(null)}
        tone="success"
        title="Member Invited Successfully!"
        message="How would you like to send the email invitation?"
        actions={[
          { label: "Gmail", onClick: handleGmail, isPrimary: true },
          { label: "Outlook", onClick: handleOutlook, isPrimary: true },
          { label: "Default App", onClick: handleDefaultEmail },
        ]}
      />
    </>
  );
}
