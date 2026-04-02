'use client';
import { useEffect, useState } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Eye, Heart, MessageCircle, Loader2 } from 'lucide-react';
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
    <div className="space-y-8 netra-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track performance across all connected platforms.
          </p>
        </div>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
      </div>

      {!igConnected && (
        <div className="netra-card p-4 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Connect your Instagram account in <strong>Settings → Platforms</strong> to see real analytics data.
          </p>
        </div>
      )}

      {/* Overview metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overview.map((m, i) => {
          const Icon = m.icon;
          const style = METRIC_STYLES[i];
          return (
            <div key={m.label} className="netra-card netra-metric-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                <div className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${style.iconColor}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground tracking-tight">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1.5">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Engagement over time */}
      <div className="netra-card overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Engagement Over Time</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {insights ? 'Last 28 days (Instagram)' : 'Sample data — connect Instagram for real metrics'}
          </p>
        </div>
        <div className="px-4 pb-5">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={engagementData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B6CF6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5B6CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="likes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E1306C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E1306C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: 'var(--shadow-lg)' }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="reach" stroke="#5B6CF6" fill="url(#reach)" strokeWidth={2.5} name="Reach" dot={false} />
              <Area type="monotone" dataKey="likes" stroke="#E1306C" fill="url(#likes)" strokeWidth={2.5} name="Likes" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="netra-card overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <h3 className="text-sm font-semibold text-foreground">Platform Reach</h3>
          </div>
          <div className="px-4 pb-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={platformData.map((p) => ({ name: p.platform, reach: p.reach }))} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: 'var(--shadow-lg)' }} />
                <Bar dataKey="reach" fill="#5B6CF6" radius={[6, 6, 0, 0]} name="Reach" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="netra-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Platform Performance</h3>
          <div className="flex flex-col gap-4">
            {platformData.map((p) => (
              <div key={p.platform} className="flex items-center gap-3">
                <PlatformIcon platform={p.platform} size={22} />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="capitalize font-medium text-foreground">
                      {p.platform === 'twitter' ? 'X (Twitter)' : p.platform}
                    </span>
                    <span className="text-xs font-semibold text-primary">{p.engagement}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-netra-400"
                      style={{ width: `${(p.engagement / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right font-medium">
                  {formatK(p.reach)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
