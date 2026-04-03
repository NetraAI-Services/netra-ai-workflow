'use client';
import Link from 'next/link';

interface NetraLogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

export function NetraLogo({ className = '', variant = 'default' }: NetraLogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-primary';

  return (
    <Link href="/dashboard" className={`flex items-center select-none ${className}`}>
      <span className={`text-2xl font-bold tracking-tight ${textColor}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
        Netra<span className="font-black">AI</span>
      </span>
    </Link>
  );
}
