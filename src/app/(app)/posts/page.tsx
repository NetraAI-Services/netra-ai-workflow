'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/shared/animations';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Sparkles, FileText, Send, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { PlatformId, PostStatus, Post } from '@/types/content';

const ALL_STATUSES: PostStatus[] = ['draft', 'scheduled', 'published', 'failed'];

const STATUS_STYLES: Record<PostStatus, string> = {
  draft:            'bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20 dark:bg-gray-500/15 dark:text-gray-400 dark:ring-gray-400/20',
  scheduled:        'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400 dark:ring-blue-400/20',
  published:        'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-400/20',
  failed:           'bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-400/20',
  pending_approval: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:ring-amber-400/20',
};

const PLATFORM_BRAND_COLORS: Record<PlatformId, string> = {
  instagram: '#E1306C',
  tiktok: '#010101',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
};

export default function PostsPage() {
  const { posts, deletePost, updatePost } = useScheduleStore();
  const { platforms } = useSettingsStore();
  const [filter, setFilter] = useState<PostStatus | 'all'>('all');
  const [publishing, setPublishing] = useState<string | null>(null);

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  async function handlePublish(post: Post) {
    if (!platforms.instagram.connected) {
      toast.error('Instagram not connected. Go to Settings \u2192 Platforms to connect.');
      return;
    }

    const selectedImage = post.draft.images.find((img) => img.id === post.draft.selectedImageId) || post.draft.images[0];
    if (!selectedImage?.url) {
      toast.error('No image found for this post. Edit the post and add an image first.');
      return;
    }

    const igCaption = post.draft.captions.find((c) => c.platform === 'instagram');
    const captionText = igCaption?.text || post.draft.captions[0]?.text || post.draft.topic;
    const hashtags = post.draft.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
    const fullCaption = hashtags ? `${captionText}\n\n${hashtags}` : captionText;

    setPublishing(post.id);
    try {
      const res = await fetch('/api/platforms/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default-user',
          imageUrl: selectedImage.url,
          caption: fullCaption,
        }),
      });

      const data = await res.json();
      if (data.success) {
        updatePost(post.id, {
          status: 'published',
          publishedAt: new Date().toISOString(),
          platformPostIds: { ...post.platformPostIds, instagram: data.mediaId },
        });
        toast.success('Published to Instagram!');
      } else {
        updatePost(post.id, { status: 'failed', error: data.error });
        toast.error(`Publish failed: ${data.error}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      updatePost(post.id, { status: 'failed', error: msg });
      toast.error(`Publish failed: ${msg}`);
    } finally {
      setPublishing(null);
    }
  }

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-foreground">Posts</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            {posts.length} total post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/create">
          <Button className="netra-btn-premium netra-btn-shimmer gap-2 rounded-xl cursor-pointer">
            <Sparkles className="w-4 h-4" /> New Post
          </Button>
        </Link>
      </div>

      {/* Pill-style filter tabs */}
      <div className="flex gap-1.5 flex-wrap p-1 bg-muted/50 dark:bg-muted/30 rounded-xl w-fit">
        {(['all', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize cursor-pointer ${
              filter === s
                ? 'text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {filter === s && (
              <motion.span
                layoutId="posts-filter"
                className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{s}</span>
          </button>
        ))}
      </div>

      {/* Posts list */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="netra-card p-14 text-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 flex items-center justify-center mx-auto mb-4"
              >
                <FileText className="w-8 h-8 text-muted-foreground/40" />
              </motion.div>
              <p className="font-semibold text-foreground text-lg">No posts found</p>
              <p className="text-sm text-muted-foreground mt-1.5 mb-5">
                {filter === 'all' ? 'Create your first post to get started.' : `No ${filter} posts.`}
              </p>
              {filter === 'all' && (
                <Link href="/create">
                  <Button className="netra-btn-premium netra-btn-shimmer gap-2 rounded-xl cursor-pointer">
                    <Sparkles className="w-4 h-4" /> Create Post
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <StaggerContainer className="flex flex-col gap-2">
              {filtered.map((post) => {
                const leadPlatform = post.draft.platforms[0] as PlatformId | undefined;
                const borderColor = leadPlatform ? PLATFORM_BRAND_COLORS[leadPlatform] : undefined;

                return (
                  <StaggerItem key={post.id}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="netra-card p-4 flex items-center gap-4"
                      style={{
                        borderLeft: borderColor ? `3px solid ${borderColor}` : undefined,
                      }}
                    >
                      <div className="flex gap-1.5 flex-shrink-0">
                        {post.draft.platforms.map((p) => (
                          <PlatformIcon key={p} platform={p as PlatformId} size={18} />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {post.draft.topic || 'Untitled Post'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {post.scheduledAt
                            ? `Scheduled: ${formatDate(post.scheduledAt, 'MMM d, yyyy h:mm a')}`
                            : formatDate(post.createdAt)}
                        </p>
                      </div>
                      <span className={`hidden sm:inline text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[post.status]}`}>
                        {post.status.replace('_', ' ')}
                      </span>
                      {(post.status === 'scheduled' || post.status === 'draft') &&
                        post.draft.platforms.includes('instagram') && (
                          <button
                            onClick={() => handlePublish(post)}
                            disabled={publishing === post.id}
                            className="p-1.5 rounded-xl hover:bg-primary/10 text-muted-foreground/60 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
                            title="Publish to Instagram"
                          >
                            {publishing === post.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-1.5 rounded-xl hover:bg-destructive/10 text-muted-foreground/30 hover:text-destructive transition-colors cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
