"use client";

import { Button } from "@/components/atoms/button";
import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Recruitment entries failed to load:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center" style={{ fontFamily: "var(--font-body)" }}>
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 
        className="mb-2 text-2xl font-bold text-foreground"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Something went wrong
      </h2>
      <p className="mb-6 text-slate-600">
        We encountered an error while loading the applicants for this pipeline.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="secondary">
          Try again
        </Button>
        <Link href="/admin/recruitment" className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Back to Recruitment
        </Link>
      </div>
    </div>
  );
}