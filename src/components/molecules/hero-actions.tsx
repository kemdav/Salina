'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/button';

export function HeroActions() {
    const router = useRouter();

    function scrollToFeatures() {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="flex flex-wrap gap-4 mt-4">
            <Button
                variant="primary"
                className="h-12 px-8 text-base"
                onClick={() => router.push('/sign-up')}
            >
                Get Started
            </Button>
            <Button
                variant="secondary"
                className="h-12 px-8 text-base"
                onClick={scrollToFeatures}
            >
                Learn More
            </Button>
        </div>
    );
}
