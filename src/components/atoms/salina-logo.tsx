import Image from "next/image";

import { cn } from "@/lib/utils";

interface SalinaLogoProps {
  className?: string;
  priority?: boolean;
  variant: "dark" | "light";
  width?: number;
}

export function SalinaLogo({
  className,
  priority = true,
  variant,
  width = 120,
}: SalinaLogoProps) {
  const src =
    variant === "dark" ? "/salina-logo-white.png" : "/salina-logo-dark.png";

  return (
    <Image
      alt="Salina"
      className={cn("h-auto", className)}
      height={0}
      priority={priority}
      src={src}
      width={width}
    />
  );
}
