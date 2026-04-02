'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Palette, KeyRound, Link2, Sliders, Send, ShieldCheck } from 'lucide-react';

const SETTINGS_NAV = [
  { href: '/settings/brand',      label: 'Brand',       icon: Palette },
  { href: '/settings/api-keys',   label: 'API Keys',    icon: KeyRound },
  { href: '/settings/platforms',  label: 'Platforms',   icon: Link2 },
  { href: '/settings/generation', label: 'Generation',  icon: Sliders },
  { href: '/settings/publishing', label: 'Publishing',  icon: Send },
  { href: '/settings/compliance', label: 'Compliance',  icon: ShieldCheck },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your workflow configuration.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings nav */}
        <aside className="lg:w-52 flex-shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SETTINGS_NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
