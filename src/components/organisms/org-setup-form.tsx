'use client';

export function OrgSpaceSetupForm() {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold font-[family:var(--font-heading)] text-foreground">
                    Let us set up your workspace
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                    This is how your team will identify your organization.
                </p>
            </div>

            <form className="flex flex-col gap-6">

                {/* Organization Name */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="orgName" className="text-sm font-semibold text-foreground">
                        Organization Name
                    </label>
                    <input
                        id="orgName"
                        type="text"
                        placeholder="e.g. Acme Corp"
                        className="flex h-10 w-full rounded-[var(--radius)] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {/* Workspace URL / Slug */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="orgSlug" className="text-sm font-semibold text-foreground">
                        Workspace URL
                    </label>
                    <div className="flex rounded-[var(--radius)] overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20">
                        <div className="bg-slate-50 border-r border-input px-3 py-2 flex items-center justify-center text-sm text-[var(--muted)] select-none">
                            salina.com/
                        </div>
                        <input
                            id="orgSlug"
                            type="text"
                            placeholder="acme"
                            className="flex-1 bg-background px-3 py-2 text-sm outline-none"
                        />
                    </div>
                </div>

                {/* Organization Logo Upload Placeholder */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground">
                        Organization Logo
                    </label>
                    <div className="border-2 border-dashed border-border rounded-[var(--radius)] p-8 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                            <svg className="w-6 h-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-[var(--muted)]">SVG, PNG, or JPG (max. 2MB)</p>
                    </div>
                </div>

            </form>
        </div>
    );
}