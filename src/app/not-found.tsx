import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-950 px-6 text-stone-50">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-stone-900/80 p-8 text-center shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
          Page not found
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          We couldn&apos;t find that page.
        </h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          The route may be missing, moved, or you may not have access to it.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-stone-200"
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}
