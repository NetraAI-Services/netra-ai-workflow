'use client';
import { useEffect, useState } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { PageTransition, StaggerContainer, StaggerItem, AnimatedNumber, FadeIn } from '@/components/shared/animations';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Loader2, AlertTriangle } from 'lucide-react';
import type { PlatformId } from '@/types/content';

// Fallback sample data used when Instagram is not connected
const SAMPLE_ENGAGEMENT = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    reach: Math.floor(Math.random() * 3000 + 500),
    likes: Math.floor(Math.random() * 500 + 50),
  };
});

const SAMPLE_PLATFORM_DATA = [
  { platform: 'instagram' as PlatformId, reach: 12400, engagement: 4.2, posts: 8 },
  { platform: 'twitter'   as PlatformId, reach: 8100,  engagement: 2.8, posts: 15 },
  { platform: 'youtube'   as PlatformId, reach: 5300,  engagement: 6.1, posts: 3 },
  { platform: 'tiktok'    as PlatformId, reach: 21000, engagement: 8.3, posts: 5 },
];

const METRIC_STYLES = [
  { iconBg: 'bg-blue-500/10 dark:bg-blue-400/10', iconColor: 'text-blue-600 dark:text-blue-400' },
  { iconBg: 'bg-pink-500/10 dark:bg-pink-400/10', iconColor: 'text-pink-600 dark:text-pink-400' },
  { iconBg: 'bg-emerald-500/10 dark:bg-emerald-400/10', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { iconBg: 'bg-violet-500/10 dark:bg-violet-400/10', iconColor: 'text-violet-600 dark:text-violet-400' },
];

interface InsightsData {
  metrics: Record<string, number[]>;
  dates: string[];
}

function formatK(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function parseMetricValue(val: string): { numeric: number; suffix: string } | null {
  const match = val.match(/^([\d.]+)(.*)$/);
  if (!match) return null;
  return { numeric: parseFloat(match[1]), suffix: match[2] };
}

export default function AnalyticsPage() {
  const { posts } = useScheduleStore();
  const { platforms } = useSettingsStore();
  const published = posts.filter((p) => p.status === 'published').length;
  const igConnected = platforms.instagram.connected;

  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!igConnected) return;
    setLoading(true);
    fetch('/api/platforms/instagram/insights?userId=default-user&type=account&period=days_28')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && data.metrics) setInsights(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [igConnected]);

  // Build chart data from real insights or fallback to sample
  const engagementData = insights
    ? insights.dates.map((dt, i) => ({
        date: new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reach: insights.metrics.reach?.[i] ?? 0,
        likes: insights.metrics.likes?.[i] ?? 0,
      }))
    : SAMPLE_ENGAGEMENT;

  // Compute overview metrics from real data if available
  const totalReach = insights
    ? (insights.metrics.reach?.reduce((a, b) => a + b, 0) ?? 0)
    : 0;
  const totalLikes = insights
    ? (insights.metrics.likes?.reduce((a, b) => a + b, 0) ?? 0)
    : 0;
  const totalComments = insights
    ? (insights.metrics.comments?.reduce((a, b) => a + b, 0) ?? 0)
    : 0;
  const totalImpressions = insights
    ? (insights.metrics.impressions?.reduce((a, b) => a + b, 0) ?? 0)
    : 0;
  const avgEngagement = totalImpressions > 0
    ? ((totalLikes + totalComments) / totalImpressions * 100).toFixed(1)
    : '0.0';

  // Build platform data — use real values for Instagram if available
  const platformData = SAMPLE_PLATFORM_DATA.map((p) => {
    if (p.platform === 'instagram' && insights) {
      const igPosts = posts.filter((post) => post.status === 'published' && post.draft.platforms.includes('instagram')).length;
      return {
        ...p,
        reach: totalReach,
        engagement: parseFloat(avgEngagement),
        posts: igPosts,
      };
    }
    return p;
  });

  const overview = [
    { label: 'Total Reach',     value: insights ? formatK(totalReach) : (published > 0 ? '46.8K' : '—'), icon: Eye,           sub: insights ? 'From Instagram (28 days)' : 'Connect platforms to track' },
    { label: 'Avg Engagement',  value: insights ? `${avgEngagement}%` : (published > 0 ? '5.4%' : '—'),  icon: Heart,         sub: insights ? 'Likes + comments / impressions' : 'Across all platforms' },
    { label: 'Posts Published', value: String(published || '0'),                                            icon: TrendingUp,    sub: 'All time' },
    { label: 'Total Comments',  value: insights ? formatK(totalComments) : (published > 0 ? '1.2K' : '—'), icon: MessageCircle, sub: insights ? 'From Instagram (28 days)' : 'Connect platforms to track' },
  ];

  return (
    <PageTransition className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-foreground">Analytics</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            Track performance across all connected platforms.
          </p>
        </div>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
      </div>

      {!igConnected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="netra-card rounded-2xl p-4 border-l-4 border-l-amber-400 dark:border-l-amber-500 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Connect your Instagram account in <strong>Settings → Platforms</strong> to see real analytics data.
            </p>
          </div>
        </motion.div>
      )}

      {/* Overview metrics */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" delay={0.1} staggerDelay={0.08}>
        {overview.map((m, i) => {
          const Icon = m.icon;
          const style = METRIC_STYLES[i];
          const parsed = parseMetricValue(m.value);
          return (
            <StaggerItem key={m.label}>
              <div className="netra-card netra-metric-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-[18px] h-[18px] ${style.iconColor}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground tracking-tight">
                  {m.value === '—' ? (
                    <span>—</span>
                  ) : parsed ? (
                    <>
                      <AnimatedNumber
                        value={parsed.numeric}
                        formatFn={(n) => n >= 1000 ? (n / 1000).toFixed(1) : n % 1 !== 0 ? n.toFixed(1) : String(Math.round(n))}
                        duration={1.4}
                      />
                      <span>{parsed.suffix}</span>
                    </>
                  ) : (
                    <AnimatedNumber
                      value={parseFloat(m.value) || 0}
                      formatFn={(n) => String(Math.round(n))}
                      duration={1.4}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{m.sub}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Engagement over time */}
      <FadeIn delay={0.3}>
        <div className="netra-card rounded-2xl overflow-hidden">
          <div className="p-6 pb-3">
            <h3 className="text-sm font-semibold text-foreground">Engagement Over Time</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {insights ? 'Last 28 days (Instagram)' : 'Sample data — connect Instagram for real metrics'}
            </p>
          </div>
          <div className="px-4 pb-5">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={engagementData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1306C" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: 'var(--shadow-lg)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Area type="monotone" dataKey="reach" stroke="hsl(var(--primary))" fill="url(#reachGradient)" strokeWidth={2.5} name="Reach" dot={false} animationDuration={1200} />
                <Area type="monotone" dataKey="likes" stroke="#E1306C" fill="url(#likesGradient)" strokeWidth={2.5} name="Likes" dot={false} animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </FadeIn>

      {/* Platform breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <FadeIn delay={0.4}>
          <div className="netra-card rounded-2xl overflow-hidden">
            <div className="p-6 pb-3">
              <h3 className="text-sm font-semibold text-foreground">Platform Reach</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Reach across connected platforms</p>
            </div>
            <div className="px-4 pb-5">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={platformData.map((p) => ({ name: p.platform, reach: p.reach }))} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: 'var(--shadow-lg)' }} />
                  <Bar dataKey="reach" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Reach" animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="netra-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">Platform Performance</h3>
            <p className="text-xs text-muted-foreground mb-4">Engagement rate by platform</p>
            <div className="flex flex-col gap-4">
              {platformData.map((p, i) => (
                <motion.div
                  key={p.platform}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.55 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <PlatformIcon platform={p.platform} size={22} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="capitalize font-medium text-foreground">
                        {p.platform === 'twitter' ? 'X (Twitter)' : p.platform}
                      </span>
                      <span className="text-xs font-semibold text-primary">{p.engagement}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-netra-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.engagement / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right font-medium">
                    {formatK(p.reach)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
