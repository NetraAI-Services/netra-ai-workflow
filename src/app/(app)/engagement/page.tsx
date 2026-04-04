'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { PageTransition, StaggerContainer, StaggerItem, SlideIn } from '@/components/shared/animations';
import { MessageCircle, Send, Smile, Meh, Frown, Inbox } from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { generateId } from '@/lib/utils';
import type { PlatformId } from '@/types/content';
import type { EngagementItem, Sentiment } from '@/types/engagement';

const SAMPLE_ITEMS: EngagementItem[] = [
  { id: generateId(), platform: 'instagram', postId: '1', authorName: 'Sarah Chen', authorHandle: '@sarahchen', text: 'This is absolutely amazing! Love the new feature', sentiment: 'positive', createdAt: new Date(Date.now() - 1800000).toISOString(), replied: false },
  { id: generateId(), platform: 'twitter',   postId: '2', authorName: 'Mark Torres', authorHandle: '@markdev', text: 'How does this compare to the competition?', sentiment: 'neutral', createdAt: new Date(Date.now() - 3600000).toISOString(), replied: false },
  { id: generateId(), platform: 'instagram', postId: '1', authorName: 'Priya Singh', authorHandle: '@priyadesign', text: 'Been waiting for this! Will this be available for teams?', sentiment: 'positive', createdAt: new Date(Date.now() - 7200000).toISOString(), replied: true },
  { id: generateId(), platform: 'youtube',   postId: '3', authorName: 'Alex Kim', authorHandle: '@alexkim', text: 'The tutorial was helpful but the audio quality could be better in the second half.', sentiment: 'neutral', createdAt: new Date(Date.now() - 10800000).toISOString(), replied: false },
  { id: generateId(), platform: 'tiktok',    postId: '4', authorName: 'Jordan Lee', authorHandle: '@jordanl', text: "I tried this and it didn't work as shown :/", sentiment: 'negative', createdAt: new Date(Date.now() - 14400000).toISOString(), replied: false },
];

const SENTIMENT_ICON: Record<Sentiment, React.ReactNode> = {
  positive: <Smile className="w-3.5 h-3.5 text-emerald-500" />,
  neutral:  <Meh  className="w-3.5 h-3.5 text-amber-500" />,
  negative: <Frown className="w-3.5 h-3.5 text-red-500" />,
};

const SENTIMENT_STYLE: Record<Sentiment, string> = {
  positive: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-800/40',
  neutral:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800/40',
  negative: 'bg-red-50 text-red-700 ring-1 ring-red-200/60 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-800/40',
};

type PlatformFilterValue = PlatformId | 'all';
type SentimentFilterValue = Sentiment | 'all';

const PLATFORM_FILTERS: { value: PlatformFilterValue; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
];

const SENTIMENT_FILTERS: Sentiment[] = ['positive', 'neutral', 'negative'];

export default function EngagementPage() {
  const [items, setItems] = useState<EngagementItem[]>(SAMPLE_ITEMS);
  const [selected, setSelected] = useState<EngagementItem | null>(null);
  const [reply, setReply] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilterValue>('all');
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilterValue>('all');

  const filtered = items.filter((i) => {
    if (platformFilter !== 'all' && i.platform !== platformFilter) return false;
    if (sentimentFilter !== 'all' && i.sentiment !== sentimentFilter) return false;
    return true;
  });

  const unreplied = items.filter((i) => !i.replied).length;

  function sendReply() {
    if (!reply.trim() || !selected) return;
    setItems((prev) => prev.map((i) => i.id === selected.id ? { ...i, replied: true } : i));
    setSelected((s) => s ? { ...s, replied: true } : s);
    setReply('');
  }

  return (
    <PageTransition className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-page-title text-foreground">Engagement</h1>
          {unreplied > 0 && (
            <span className="text-[11px] bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-bold tabular-nums">
              {unreplied} new
            </span>
          )}
        </div>
        <p className="text-body-sm text-muted-foreground mt-1">Unified inbox for comments and replies across platforms.</p>
      </div>

      {/* ── Filter bar ── */}
      <SlideIn direction="top" delay={0.1}>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORM_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setPlatformFilter(f.value)}
              className={cn(
                'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors',
                platformFilter === f.value
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {platformFilter === f.value && (
                <motion.span
                  layoutId="engagement-platform-filter"
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {f.value !== 'all' && (
                  <PlatformIcon platform={f.value as PlatformId} size={13} colored={platformFilter !== f.value} />
                )}
                {f.label}
              </span>
            </button>
          ))}

          <div className="w-px bg-border mx-1 self-stretch" />

          {SENTIMENT_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSentimentFilter(sentimentFilter === s ? 'all' : s)}
              className={cn(
                'relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize',
                sentimentFilter === s
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {sentimentFilter === s && (
                <motion.span
                  layoutId="engagement-sentiment-filter"
                  className="absolute inset-0 rounded-full bg-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {SENTIMENT_ICON[s]} {s}
              </span>
            </button>
          ))}
        </div>
      </SlideIn>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── Comment feed ── */}
        <div className="lg:col-span-2 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="netra-card p-10 text-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block"
              >
                <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-7 h-7 text-muted-foreground/40" />
                </div>
              </motion.div>
              <p className="font-semibold text-foreground">No comments found</p>
              <p className="text-sm text-muted-foreground mt-1">No comments match your current filters. Try adjusting them above.</p>
            </div>
          ) : (
            <StaggerContainer className="space-y-1.5">
              {filtered.map((item) => (
                <StaggerItem key={item.id}>
                  <button
                    onClick={() => setSelected(item)}
                    className={cn(
                      'w-full text-left rounded-xl transition-all group',
                      selected?.id === item.id && 'ring-2 ring-primary/40'
                    )}
                  >
                    <div className={cn(
                      'netra-card p-3 transition-all',
                      selected?.id === item.id
                        ? 'border-l-2 border-l-primary bg-primary/[0.04] dark:bg-primary/[0.06]'
                        : !item.replied
                          ? 'border-l-[3px] border-l-primary'
                          : '',
                      'group-hover:bg-accent/30'
                    )}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs">
                          {item.authorName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold text-foreground">{item.authorName}</span>
                            <PlatformIcon platform={item.platform} size={12} />
                            <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(item.createdAt)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn('text-[11px] px-2 py-0.5 rounded-full capitalize flex items-center gap-1 font-semibold', SENTIMENT_STYLE[item.sentiment])}>
                              {SENTIMENT_ICON[item.sentiment]} {item.sentiment}
                            </span>
                            {item.replied && <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Replied</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        {/* ── Detail / reply panel ── */}
        <div className="lg:col-span-3">
          <div className="netra-card h-full min-h-[400px] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col h-full"
                >
                  <div className="p-5 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                      {selected.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{selected.authorName}</p>
                      <p className="text-xs text-muted-foreground">{selected.authorHandle} &middot; {timeAgo(selected.createdAt)}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <PlatformIcon platform={selected.platform} size={16} />
                      <span className={cn('text-[11px] px-2.5 py-0.5 rounded-full capitalize flex items-center gap-1 font-semibold', SENTIMENT_STYLE[selected.sentiment])}>
                        {SENTIMENT_ICON[selected.sentiment]} {selected.sentiment}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1">
                    <p className="text-foreground leading-relaxed">{selected.text}</p>
                  </div>
                  <div className="p-4 border-t border-border space-y-3 bg-surface/50">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder={`Reply to ${selected.authorName}...`}
                      rows={3}
                      className="resize-none rounded-xl"
                    />
                    <div className="flex justify-between items-center">
                      {selected.replied && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Already replied</span>}
                      <Button
                        onClick={sendReply}
                        disabled={!reply.trim()}
                        className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground gap-2 netra-btn-glow rounded-lg"
                        size="sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Reply
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex items-center justify-center text-center py-20"
                >
                  <div>
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-block"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-7 h-7 text-muted-foreground/40" />
                      </div>
                    </motion.div>
                    <p className="font-semibold text-foreground">Select a comment</p>
                    <p className="text-sm text-muted-foreground mt-1">Click a comment on the left to read the full message and reply.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
