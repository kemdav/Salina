import Link from 'next/link';
import { Button } from '@/components/atoms/button';

export function HeroActions() {
    return (
        <div className="flex flex-wrap gap-4 mt-4">
            <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-[var(--radius)] px-8 h-12 text-base font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-primary text-white hover:bg-primary-hover active:opacity-90"
            >
                Get Started
            </Link>
            <Button variant="secondary" className="h-12 px-8 text-base">
                Learn More
            </Button>
        </div>
    );
}