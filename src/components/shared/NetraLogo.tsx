'use client';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Image from 'next/image';

interface NetraLogoProps {
  iconOnly?: boolean;
  className?: string;
}

export function NetraLogo({ iconOnly = false, className = '' }: NetraLogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 select-none ${className}`}>
      {/* Icon mark */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm"
        style={{ background: 'linear-gradient(135deg, #5B6CF6 0%, #3340B2 100%)' }}
      >
        N
      </div>
      {!iconOnly && (
        <span className="text-xl font-bold tracking-tight text-foreground">
          <span style={{ color: '#5B6CF6' }}>Netra</span>
          <span className="text-muted-foreground font-normal ml-1 text-sm">AI</span>
        </span>
      )}
    </Link>
  );
}
