'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NetraLogo } from '@/components/shared/NetraLogo';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/create',     label: 'Create' },
  { href: '/calendar',   label: 'Calendar' },
  { href: '/posts',      label: 'Posts' },
  { href: '/ideas',      label: 'Ideas' },
  { href: '/analytics',  label: 'Analytics' },
  { href: '/engagement', label: 'Engagement' },
];

export function Navbar() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-nav/50 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_12px_rgba(0,0,0,0.12)]">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-8 h-14 flex items-center gap-6">
          <NetraLogo size={32} className="flex-shrink-0" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium tracking-[0.01em] transition-all',
                    active
                      ? 'text-primary bg-primary/8 dark:bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[9px] left-3 right-3 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            <div className="hidden md:block w-px h-5 bg-border mx-0.5" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex w-8 h-8 rounded-full items-center justify-center bg-gradient-to-br from-primary to-netra-700 text-white text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background transition-transform hover:scale-105">
                N
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem render={<Link href="/settings/brand" />} className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings/brand" />} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/login" />} className="flex items-center gap-2 text-destructive">
                  <LogOut className="w-4 h-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-lg w-8 h-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="absolute top-14 left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border p-3 flex flex-col gap-0.5 shadow-xl">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium tracking-[0.01em] transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="netra-divider my-2" />
            <Link
              href="/settings/brand"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              Settings
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              Sign out
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
