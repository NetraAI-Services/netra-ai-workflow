'use client';
import Link from 'next/link';
import Image from 'next/image';

interface NetraLogoProps {
  className?: string;
  size?: number;
}

export function NetraLogo({ className = '', size = 48 }: NetraLogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center select-none ${className}`}>
      <Image
        src="/logo-mark.svg"
        alt="Logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain"
        priority
      />
    </Link>
  );
}
