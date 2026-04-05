'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Palette, Key, Link2, Wand2, Send, ShieldCheck } from 'lucide-react';

const SETTINGS_NAV = [
  { href: '/settings/brand',      label: 'Brand',       icon: Palette,     desc: 'Identity & voice' },
  { href: '/settings/platforms',  label: 'Platforms',    icon: Link2,       desc: 'Social connections' },
  { href: '/settings/generation', label: 'Generation',   icon: Wand2,       desc: 'AI preferences' },
  { href: '/settings/publishing', label: 'Publishing',   icon: Send,        desc: 'Workflow & schedule' },
  { href: '/settings/api-keys',  label: 'API Keys',     icon: Key,         desc: 'Service credentials' },
  { href: '/settings/compliance', label: 'Compliance',   icon: ShieldCheck, desc: 'Safety & rules' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-foreground">Settings</h1>
        <p className="text-body-sm text-muted-foreground mt-1">Manage your workspace preferences and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-56 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 -mx-2 lg:mx-0 px-2 lg:px-0">
            {SETTINGS_NAV.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0 cursor-pointer',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="settings-nav"
                      className="absolute inset-0 rounded-xl bg-primary/8 dark:bg-primary/12"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 w-4 h-4 flex-shrink-0" />
                  <div className="relative z-10 hidden lg:block">
                    <p className="font-semibold text-[13px]">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
                  </div>
                  <span className="relative z-10 lg:hidden text-[13px] font-semibold whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
