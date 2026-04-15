'use client';

import Link from 'next/link';

export function NavLinks() {
    return (
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--muted)]">
            <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="relative py-1 hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
            >
                Product
            </Link>
            <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="relative py-1 hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
            >
                Features
            </Link>
            <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="relative py-1 hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-foreground after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center"
            >
                Pricing
            </Link>
        </div>
    );
}