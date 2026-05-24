'use client';

function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const LINKS = [
    { label: 'Product',  target: 'features'    },
    { label: 'Features', target: 'how-it-works' },
    { label: 'Pricing',  target: 'pricing'      },
];

export function NavLinks() {
    return (
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--muted)]">
            {LINKS.map(({ label, target }) => (
                <button
                    key={label}
                    type="button"
                    onClick={() => scrollTo(target)}
                    className="relative py-1 hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
