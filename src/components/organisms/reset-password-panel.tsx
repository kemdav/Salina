"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/atoms/button";
import { SalinaLogo } from "@/components/atoms/salina-logo";
import { AuthHeading } from "@/components/molecules/auth-heading";
import { TextField } from "@/components/molecules/text-field";
import { AuthFooter } from "@/components/organisms/auth-footer";

export function ResetPasswordPanel() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSuccess(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--neutral)] [font-family:var(--font-body)]">
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-[420px] rounded-xl border border-black/5 bg-[var(--surface-light)] px-8 py-10 shadow-[0_4px_32px_rgba(0,0,0,0.08)] sm:px-12">
          <div className="mb-7 flex flex-col items-center">
            <SalinaLogo variant="light" width={100} />
            <div className="mt-5 h-px w-10 bg-[#E5E7EB]" />
          </div>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_12%,white)]">
                <svg
                  aria-hidden="true"
                  className="size-[22px]"
                  fill="none"
                  stroke="var(--success)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="mb-2 text-lg font-bold text-foreground [font-family:var(--font-heading)]">
                  Check your inbox
                </p>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  We sent a reset link to your email address.
                </p>
              </div>
              <Link
                className="mt-1 text-[13px] text-[var(--muted)] transition duration-200 hover:text-primary"
                href="/login"
              >
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <div>
              <AuthHeading
                align="center"
                description="Enter your email and we'll send you a link to restore access."
                title="Reset password"
              />

              <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
                <TextField
                  aria-label="Email address"
                  autoComplete="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@organization.com"
                  required
                  type="email"
                  value={email}
                />

                <Button
                  className="h-12 w-full text-[15px] font-semibold tracking-[0.02em] [font-family:var(--font-heading)]"
                  disabled={loading}
                  type="submit"
                  variant="dark"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>

              <p className="mt-5 text-center">
                <Link
                  className="text-[13px] text-[var(--muted)] transition duration-200 hover:text-primary"
                  href="/login"
                >
                  ← Back to sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
