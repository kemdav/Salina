import Image from 'next/image';

interface SalinaLogoProps {
  variant: 'dark' | 'light';
  width?: number;
}

export function SalinaLogo({ variant, width = 120 }: SalinaLogoProps) {
  const src = variant === 'dark' ? '/salina-logo-white.png' : '/salina-logo-dark.png';

  return (
    <Image
      src={src}
      alt="Salina"
      width={width}
      height={0}
      priority
      style={{ height: 'auto' }}
    />
  );
}
