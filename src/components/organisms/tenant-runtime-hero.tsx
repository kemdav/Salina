export function TenantRuntimeHero() {
  return (
    <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-amber-300">
          Salina tenant runtime
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Proxy-derived tenant context is now available inside the App Router.
        </h1>
        <p className="max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">
          The request host is parsed in proxy.ts, forwarded as x-tenant-slug,
          and resolved on the server through Supabase when environment keys are
          configured.
        </p>
      </div>
    </section>
  );
}
