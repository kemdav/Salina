'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/button';


export function HeroActions() {

    const router = useRouter();

    return (
        <div className="flex flex-wrap gap-4 mt-4">
            <Button
                variant="primary-2"
                className="h-12 px-8 text-base"
                onClick={() => router.push('/sign-up')}>
                Get Started
            </Button>
            <Button
                variant="secondary-2"
                className="h-12 px-8 text-base"
                onClick={(e) => e.preventDefault()}>
                Learn More
            </Button>
        </div>
    );
}