export function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-border py-10 px-8 bg-background">
            <div className="max-w-[var(--grid-max-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                {/* Left Side: Copyright */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <p className="text-xs text-[var(--muted)] font-medium">
                        Salina
                    </p>
                </div>

                {/* Right Side: Links (Non-functional) */}
                <div className="flex gap-8 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                    <button type="button" className="text-[var(--muted)]">
                        Privacy
                    </button>
                    <button type="button" className="text-[var(--muted)]">
                        Terms
                    </button>
                    <button type="button" className="text-[var(--muted)]">
                        Support
                    </button>
                </div>

            </div>
        </footer>
    );
}