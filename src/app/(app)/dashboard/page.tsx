'use client';
import Link from 'next/link';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import {
  PenSquare, Calendar, BarChart2, Lightbulb,
  TrendingUp, Eye, Heart, Clock, ArrowUpRight,
  ArrowRight, Sparkles, FileText,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { PlatformId } from '@/types/content';

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-800/40',
  published: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/40',
  draft:     'bg-gray-50 text-gray-600 ring-1 ring-gray-200/60 dark:bg-gray-900/40 dark:text-gray-400 dark:ring-gray-700/40',
  failed:    'bg-red-50 text-red-700 ring-1 ring-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800/40',
};

const METRIC_ACCENTS = [
  { gradient: 'from-blue-500/10 to-indigo-500/5', iconBg: 'bg-blue-500/10 dark:bg-blue-400/10', iconColor: 'text-blue-600 dark:text-blue-400' },
  { gradient: 'from-pink-500/10 to-rose-500/5', iconBg: 'bg-pink-500/10 dark:bg-pink-400/10', iconColor: 'text-pink-600 dark:text-pink-400' },
  { gradient: 'from-emerald-500/10 to-green-500/5', iconBg: 'bg-emerald-500/10 dark:bg-emerald-400/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { gradient: 'from-violet-500/10 to-purple-500/5', iconBg: 'bg-violet-500/10 dark:bg-violet-400/10', iconColor: 'text-violet-600 dark:text-violet-400' },
];

export default function DashboardPage() {
  const { posts } = useScheduleStore();
  const { brand } = useSettingsStore();

  const scheduled = posts.filter((p) => p.status === 'scheduled').length;
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts    = posts.filter((p) => p.status === 'draft').length;
  const recent    = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const metrics = [
    { label: 'Total Reach',     value: '—',   icon: Eye,        change: null },
    { label: 'Engagement',      value: '—',   icon: Heart,      change: null },
    { label: 'Published',       value: String(published || '0'), icon: TrendingUp, change: null },
    { label: 'Scheduled',       value: String(scheduled || '0'), icon: Clock,      change: null },
  ];

  const quickActions = [
    { href: '/create',    label: 'Create Post',    icon: Sparkles,   desc: 'AI-powered content creation', accent: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' },
    { href: '/calendar',  label: 'Schedule',        icon: Calendar,   desc: 'Plan your content calendar', accent: 'group-hover:text-violet-600 dark:group-hover:text-violet-400' },
    { href: '/analytics', label: 'View Analytics', icon: BarChart2,  desc: 'Track performance metrics', accent: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' },
    { href: '/ideas',     label: 'Idea Bank',       icon: Lightbulb,  desc: 'Browse content pillars', accent: 'group-hover:text-amber-600 dark:group-hover:text-amber-400' },
  ];

  return (
    <div className="space-y-8 netra-fade-in">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl netra-gradient-hero p-8 lg:p-10">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl" />
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-overline text-white/50 mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-page-title text-white">
              Welcome back{brand.name !== 'My Brand' ? `, ${brand.name}` : ''}
            </h1>
            <p className="text-body-sm text-white/60 mt-2 max-w-md">
              Here&apos;s your social media overview. Create AI-powered content, schedule posts, and track engagement.
            </p>
          </div>
          <Link href="/create">
            <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm gap-2 font-semibold shadow-lg">
              <Sparkles className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const accent = METRIC_ACCENTS[i];
          return (
            <div key={m.label} className={`netra-card netra-metric-card netra-card-interactive bg-gradient-to-br ${accent.gradient} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-label text-muted-foreground">
                  {m.label}
                </p>
                <div className={`w-9 h-9 rounded-xl ${accent.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${accent.iconColor}`} />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground tracking-tight">{m.value}</p>
              {m.change && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="w-3 h-3" /> {m.change}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-overline px-1">
            Quick Actions
          </h2>
          <div className="flex flex-col gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.href} href={a.href}>
                  <div className="netra-card netra-card-interactive p-4 flex items-center gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 dark:bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                      <Icon className={`w-[18px] h-[18px] text-primary transition-colors ${a.accent}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{a.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent posts */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-overline">
              Recent Posts
            </h2>
            <Link href="/posts" className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="netra-card p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary/70" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No posts yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Create your first AI-powered post and it will appear here.
                </p>
              </div>
              <Link href="/create">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground netra-btn-glow mt-1 gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Create Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map((post) => (
                <div key={post.id} className="netra-card p-4 flex items-center gap-4">
                  <div className="flex gap-1.5 flex-shrink-0">
                    {post.draft.platforms.map((p) => (
                      <PlatformIcon key={p} platform={p as PlatformId} size={16} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {post.draft.topic || 'Untitled Post'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[post.status] || ''}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status summary */}
      {posts.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Drafts',    count: drafts,    color: 'text-muted-foreground', bg: 'bg-muted/50' },
            { label: 'Scheduled', count: scheduled, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/80 dark:bg-blue-950/30' },
            { label: 'Published', count: published, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/80 dark:bg-emerald-950/30' },
          ].map((s) => (
            <div key={s.label} className={`netra-card text-center p-5 ${s.bg}`}>
              <p className={`font-heading text-3xl font-bold tracking-tight ${s.color}`}>{s.count}</p>
              <p className="text-label text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
