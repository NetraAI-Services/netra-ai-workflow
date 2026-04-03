'use client';
import Link from 'next/link';
import Image from 'next/image';

interface NetraLogoProps {
  iconOnly?: boolean;
  className?: string;
  variant?: 'default' | 'white';
}

export function NetraLogo({ iconOnly = false, className = '', variant = 'default' }: NetraLogoProps) {
  const src = variant === 'white' ? '/netra-logo-white.svg' : '/netra-logo.svg';

  return (
    <Link href="/dashboard" className={`flex items-center select-none ${className}`}>
      <Image
        src={src}
        alt="Netra AI"
        width={iconOnly ? 36 : 130}
        height={iconOnly ? 36 : 38}
        className={iconOnly ? 'w-9 h-9' : 'h-8 w-auto'}
        priority
      />
    </Link>
  );
}
