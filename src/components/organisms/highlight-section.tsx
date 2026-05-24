'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/button';

export function HighlightSection() {
    const router = useRouter();

    return (
        <section className="px-8 py-24 w-full max-w-[var(--grid-max-width)] mx-auto">
            <div className="bg-foreground text-background rounded-3xl py-24 px-8 md:px-16 flex flex-col items-center justify-center text-center shadow-xl">

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance font-[family:var(--font-heading)] max-w-3xl">
                    Deploy the standard in identity structure today.
                </h2>

                <p className="mt-6 text-lg text-background/80 max-w-xl text-pretty font-small">
                    Join Salina and other 67,000+ organizations who have standardized on our identity structure to power their operations, governance, and more.
                </p>

                <Button
                    variant="secondary"
                    className="mt-10 h-12 px-10 text-base"
                    onClick={() => router.push('/sign-up')}
                >
                    Get Started for Free →
                </Button>
            </div>
        </section>
    );
}
