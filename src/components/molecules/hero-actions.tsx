'use client';

import { Button } from '@/components/atoms/button';

export function HeroActions() {
    return (
        <div className="flex flex-wrap gap-4 mt-4">
            <Button className="h-12 px-8 text-base" onClick={(e) => e.preventDefault()}>
                Get Started
            </Button>
            <Button variant="secondary" className="h-12 px-8 text-base" onClick={(e) => e.preventDefault()}>
                Learn More
            </Button>
        </div>
    );
}