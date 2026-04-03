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
      <span className="rounded-lg overflow-hidden bg-white inline-flex items-center justify-center"
        style={{ width: size, height: size }}>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={size}
          height={size}
          className="w-full h-full object-contain"
          priority
        />
      </span>
    </Link>
  );
}
