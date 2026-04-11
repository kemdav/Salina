import { resolveCurrentTenant } from "@/lib/supabase/server";

export default async function Home() {
  const tenantContext = await resolveCurrentTenant();

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-12">
        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-amber-300">
              Salina tenant runtime
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Proxy-derived tenant context is now available inside the App
              Router.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">
              The request host is parsed in proxy.ts, forwarded as
              x-tenant-slug, and resolved on the server through Supabase when
              environment keys are configured.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <section className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6 shadow-lg shadow-emerald-950/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                  Preview Demo
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  This banner proves your branch deployed successfully.
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100">
                Tenant: {tenantContext.tenantSlug ?? "public"}
              </div>
            </div>
          </section>

          <article className="rounded-3xl border border-white/10 bg-stone-900/80 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
              Request context
            </h2>
            <dl className="mt-5 space-y-4 text-sm text-stone-300">
              <div>
                <dt className="text-stone-500">Host</dt>
                <dd className="mt-1 font-mono text-stone-100">
                  {tenantContext.host ?? "No host header"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Tenant slug header</dt>
                <dd className="mt-1 font-mono text-stone-100">
                  {tenantContext.tenantSlug ?? "No tenant slug resolved"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-500">Resolved by</dt>
                <dd className="mt-1 font-mono text-stone-100">
                  {tenantContext.resolvedBy ?? "Not resolved"}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border-white/10 bg-stone-900/80 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">
              Tenant record
            </h2>
            <div className="mt-5 space-y-4 text-sm text-stone-300">
              {tenantContext.tenant ? (
                <dl className="space-y-4">
                  <div>
                    <dt className="text-stone-500">Organization</dt>
                    <dd className="mt-1 text-lg font-semibold text-white">
                      {tenantContext.tenant.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Slug</dt>
                    <dd className="mt-1 font-mono text-stone-100">
                      {tenantContext.tenant.slug}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Plan</dt>
                    <dd className="mt-1 font-mono text-stone-100">
                      {tenantContext.tenant.plan}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Billing email</dt>
                    <dd className="mt-1 font-mono text-stone-100">
                      {tenantContext.tenant.billingEmail ?? "Not set"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="leading-7 text-stone-300">
                  No tenant record has been resolved yet. Configure the Supabase
                  environment variables and visit a tenant host such as
                  system-admin.localhost to confirm end-to-end resolution.
                </p>
              )}

              {tenantContext.resolutionError ? (
                <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">
                  {tenantContext.resolutionError}
                </p>
              ) : null}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
