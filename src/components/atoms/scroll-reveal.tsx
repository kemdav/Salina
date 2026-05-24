"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "none";
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    direction = "up",
}: ScrollRevealProps) {
    const offsets = {
        up:    { y: 32,  x: 0   },
        left:  { y: 0,   x: -32 },
        right: { y: 0,   x: 32  },
        none:  { y: 0,   x: 0   },
    }[direction];

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, ...offsets }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
}
