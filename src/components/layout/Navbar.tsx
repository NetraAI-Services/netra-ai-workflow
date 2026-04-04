'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-3 left-4 right-4 z-50 rounded-2xl transition-shadow duration-300',
          'netra-nav-glass',
          scrolled && 'netra-nav-scrolled'
        )}
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-6 h-14 flex items-center gap-6">
          <NetraLogo className="flex-shrink-0" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3.5 py-1.5 rounded-xl text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-200',
                    active
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/[0.08] dark:bg-primary/[0.12]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />

            <div className="hidden md:block w-px h-5 bg-border/60 mx-1" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex w-8 h-8 rounded-full items-center justify-center bg-gradient-to-br from-primary to-netra-700 text-white text-xs font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2 ring-offset-background transition-all duration-200 hover:shadow-[0_0_16px_rgba(91,108,246,0.3)] hover:scale-105">
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
              className="md:hidden rounded-xl w-8 h-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-[4.5rem] left-4 right-4 bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 p-2 flex flex-col gap-0.5 shadow-xl"
            >
              {NAV_ITEMS.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-2.5 rounded-xl text-sm font-semibold tracking-[-0.01em] transition-colors',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="netra-divider my-1.5" />
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
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
