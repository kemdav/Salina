"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { inviteAdviser } from "@/lib/actions/advisers";

interface InviteAdviserModalProps {
  onClose: () => void;
  onInviteSuccess: () => void;
}

export function InviteAdviserModal({ onClose, onInviteSuccess }: InviteAdviserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill out all fields.");
      return;
    }
    
    setError("");
    
    startTransition(async () => {
      try {
        const token = await inviteAdviser(name, email);
        const baseUrl = window.location.origin;
        setInviteLink(`${baseUrl}/adviser-sign-up?invite=${token}`);
        onInviteSuccess();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to invite adviser.");
        }
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
          Invite Adviser
        </h2>
        
        {inviteLink ? (
          <div className="mt-4">
            <p className="mb-2 text-sm text-slate-600">
              The adviser has been invited! Send them the following link to sign up:
            </p>
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly className="flex-1" />
              <Button type="button" onClick={copyToClipboard} variant="secondary">
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="button" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
              <Input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            
            <div className="mt-2 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Generating..." : "Generate Invite"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
