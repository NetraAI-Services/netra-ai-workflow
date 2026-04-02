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
import {
  LayoutDashboard, PenSquare, Calendar, FileText,
  Lightbulb, BarChart2, MessageCircle, Settings,
  Menu, X, LogOut, User, Bell,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/create',     label: 'Create',     icon: PenSquare },
  { href: '/calendar',   label: 'Calendar',   icon: Calendar },
  { href: '/posts',      label: 'Posts',       icon: FileText },
  { href: '/ideas',      label: 'Ideas',       icon: Lightbulb },
  { href: '/analytics',  label: 'Analytics',   icon: BarChart2 },
  { href: '/engagement', label: 'Engagement',  icon: MessageCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-nav/80 backdrop-blur-xl border-b border-border/60">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-5">
          <NetraLogo className="flex-shrink-0" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all',
                    active
                      ? 'text-primary bg-primary/8 dark:bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-[9px] left-3 right-3 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />

            <button className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full netra-pulse" />
            </button>

            <Link href="/settings/brand" className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>

            <div className="hidden md:block w-px h-5 bg-border mx-1" />

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
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="netra-divider my-2" />
            <Link
              href="/settings/brand"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <Settings className="w-4 h-4" /> Settings
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
