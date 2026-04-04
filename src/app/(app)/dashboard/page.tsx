'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  AnimatedNumber,
} from '@/components/shared/animations';
import {
  Calendar, BarChart2, Lightbulb,
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
    { label: 'Total Reach',     value: 0,   numValue: true, icon: Eye,        change: null },
    { label: 'Engagement',      value: 0,   numValue: true, icon: Heart,      change: null },
    { label: 'Published',       value: published, numValue: true, icon: TrendingUp, change: null },
    { label: 'Scheduled',       value: scheduled, numValue: true, icon: Clock,      change: null },
  ];

  const quickActions = [
    { href: '/create',    label: 'Create Post',   icon: Sparkles,  desc: 'AI-powered content creation', accent: 'group-hover:text-blue-600 dark:group-hover:text-blue-400' },
    { href: '/calendar',  label: 'Schedule',       icon: Calendar,  desc: 'Plan your content calendar', accent: 'group-hover:text-violet-600 dark:group-hover:text-violet-400' },
    { href: '/analytics', label: 'View Analytics', icon: BarChart2, desc: 'Track performance metrics', accent: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' },
    { href: '/ideas',     label: 'Idea Bank',      icon: Lightbulb, desc: 'Browse content pillars', accent: 'group-hover:text-amber-600 dark:group-hover:text-amber-400' },
  ];

  return (
    <PageTransition className="space-y-8">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative overflow-hidden rounded-2xl netra-gradient-hero p-8 lg:p-10"
      >
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ x: [0, -10, 0], y: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-300/10 rounded-full blur-2xl"
        />
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-overline text-white/45 mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-page-title text-white">
              Welcome back{brand.name !== 'My Brand' ? `, ${brand.name}` : ''}
            </h1>
            <p className="text-body-sm text-white/55 mt-2 max-w-md">
              Here&apos;s your social media overview. Create AI-powered content, schedule posts, and track engagement.
            </p>
          </div>
          <Link href="/create">
            <Button className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-sm gap-2 font-semibold shadow-lg rounded-xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              <Sparkles className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Metrics grid — staggered */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          const accent = METRIC_ACCENTS[i];
          return (
            <StaggerItem key={m.label}>
              <div className={`netra-card netra-metric-card netra-card-interactive bg-gradient-to-br ${accent.gradient} p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-label text-muted-foreground">{m.label}</p>
                  <div className={`w-9 h-9 rounded-xl ${accent.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-[18px] h-[18px] ${accent.iconColor}`} />
                  </div>
                </div>
                {m.numValue ? (
                  <AnimatedNumber
                    value={m.value}
                    className="font-heading text-3xl font-bold text-foreground tracking-tight block"
                    formatFn={(n) => n === 0 && (m.label === 'Total Reach' || m.label === 'Engagement') ? '\u2014' : Math.round(n).toLocaleString()}
                    duration={1}
                  />
                ) : (
                  <p className="font-heading text-3xl font-bold text-foreground tracking-tight">{m.value}</p>
                )}
                {m.change && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                    <ArrowUpRight className="w-3 h-3" /> {m.change}
                  </p>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick actions — staggered */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-overline px-1">Quick Actions</h2>
          <StaggerContainer className="flex flex-col gap-2" delay={0.2} staggerDelay={0.06}>
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <StaggerItem key={a.href}>
                  <Link href={a.href}>
                    <div className="netra-card netra-card-interactive p-4 flex items-center gap-3.5 group">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 dark:bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                        <Icon className={`w-[18px] h-[18px] text-primary transition-colors duration-200 ${a.accent}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{a.label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Recent posts — staggered */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-overline">Recent Posts</h2>
            <Link href="/posts" className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="netra-card p-10 flex flex-col items-center gap-4 text-center"
            >
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center"
              >
                <FileText className="w-7 h-7 text-primary/70" />
              </motion.div>
              <div>
                <p className="font-semibold text-foreground">No posts yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Create your first AI-powered post and it will appear here.
                </p>
              </div>
              <Link href="/create">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground netra-btn-glow netra-btn-shimmer mt-1 gap-2 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5" /> Create Post
                </Button>
              </Link>
            </motion.div>
          ) : (
            <StaggerContainer className="flex flex-col gap-2" delay={0.15} staggerDelay={0.05}>
              {recent.map((post) => (
                <StaggerItem key={post.id}>
                  <div className="netra-card p-4 flex items-center gap-4">
                    <div className="flex gap-1.5 flex-shrink-0">
                      {post.draft.platforms.map((p) => (
                        <PlatformIcon key={p} platform={p as PlatformId} size={16} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {post.draft.topic || 'Untitled Post'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(post.createdAt)}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[post.status] || ''}`}>
                      {post.status}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>

      {/* Status summary — animated numbers */}
      {posts.length > 0 && (
        <StaggerContainer className="grid grid-cols-3 gap-4" delay={0.4} staggerDelay={0.1}>
          {[
            { label: 'Drafts',    count: drafts,    color: 'text-muted-foreground', bg: 'bg-muted/50' },
            { label: 'Scheduled', count: scheduled, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/80 dark:bg-blue-950/30' },
            { label: 'Published', count: published, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/80 dark:bg-emerald-950/30' },
          ].map((s) => (
            <StaggerItem key={s.label}>
              <div className={`netra-card text-center p-5 ${s.bg}`}>
                <AnimatedNumber
                  value={s.count}
                  className={`font-heading text-3xl font-bold tracking-tight ${s.color} block`}
                  duration={0.8}
                />
                <p className="text-label text-muted-foreground mt-1">{s.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </PageTransition>
  );
}
