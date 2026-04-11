'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/shared/PlatformIcon';
import { PageTransition } from '@/components/shared/animations';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Hash, Calendar, Send, Loader2, ImageOff, Copy, Check,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';
import type { PlatformId, PostStatus } from '@/types/content';

const STATUS_STYLES: Record<PostStatus, string> = {
  draft:            'bg-gray-500/10 text-gray-400 ring-1 ring-gray-400/20',
  scheduled:        'bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/20',
  published:        'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20',
  failed:           'bg-red-500/10 text-red-400 ring-1 ring-red-400/20',
  pending_approval: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-400/20',
};

const PLATFORM_BRAND_COLORS: Record<PlatformId, string> = {
  instagram: '#E1306C',
  tiktok:    '#010101',
  youtube:   '#FF0000',
  twitter:   '#1DA1F2',
};

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { posts, updatePost } = useScheduleStore();
  const { platforms } = useSettingsStore();
  const [publishing, setPublishing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <PageTransition className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground text-lg">Post not found.</p>
        <Link href="/posts">
          <Button variant="outline" className="gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to Posts
          </Button>
        </Link>
      </PageTransition>
    );
  }

  const { draft, status, createdAt, scheduledAt, publishedAt } = post;
  const selectedImage =
    draft.images.find((img) => img.id === draft.selectedImageId) ?? draft.images[0];
  const leadPlatform = draft.platforms[0] as PlatformId | undefined;
  const borderColor = leadPlatform ? PLATFORM_BRAND_COLORS[leadPlatform] : undefined;

  async function handleCopy(text: string, captionId: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(captionId);
    toast.success('Caption copied!');
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handlePublish() {
    if (!platforms.instagram.connected) {
      toast.error('Instagram not connected. Go to Settings → Platforms to connect.');
      return;
    }
    if (!selectedImage?.url) {
      toast.error('No image found for this post.');
      return;
    }
    const igCaption = draft.captions.find((c) => c.platform === 'instagram');
    const captionText = igCaption?.text ?? draft.captions[0]?.text ?? draft.topic;
    const hashtags = draft.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
    const fullCaption = hashtags ? `${captionText}\n\n${hashtags}` : captionText;

    setPublishing(true);
    try {
      const res = await fetch('/api/platforms/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'default-user', imageUrl: selectedImage.url, caption: fullCaption }),
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
      setPublishing(false);
    }
  }

  return (
    <PageTransition className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-page-title text-foreground truncate">{draft.topic || 'Untitled Post'}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[status]}`}>
              {status.replace('_', ' ')}
            </span>
            <span className="text-xs text-muted-foreground">
              {scheduledAt
                ? `Scheduled: ${formatDate(scheduledAt, 'MMM d, yyyy h:mm a')}`
                : publishedAt
                ? `Published: ${formatDate(publishedAt, 'MMM d, yyyy h:mm a')}`
                : `Created: ${formatDate(createdAt)}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {draft.platforms.map((p) => (
            <PlatformIcon key={p} platform={p as PlatformId} size={20} />
          ))}
          {(status === 'draft' || status === 'scheduled') && draft.platforms.includes('instagram') && (
            <Button
              onClick={handlePublish}
              disabled={publishing}
              className="netra-btn-premium netra-btn-shimmer gap-2 rounded-xl cursor-pointer ml-2"
            >
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="netra-card overflow-hidden"
          style={{ borderLeft: borderColor ? `3px solid ${borderColor}` : undefined }}
        >
          <div className="p-4 border-b border-border/50">
            <p className="text-sm font-semibold text-foreground">Image</p>
          </div>
          {selectedImage ? (
            <div className="relative aspect-square bg-muted/30">
              <img
                src={selectedImage.url}
                alt={selectedImage.prompt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-[11px] text-white/80 line-clamp-2">{selectedImage.prompt}</p>
                <p className="text-[10px] text-white/50 mt-0.5 capitalize">{selectedImage.provider}</p>
              </div>
            </div>
          ) : (
            <div className="aspect-square flex flex-col items-center justify-center gap-3 text-muted-foreground/40 bg-muted/20">
              <ImageOff className="w-10 h-10" />
              <p className="text-sm">No image generated</p>
            </div>
          )}
        </motion.div>

        {/* Captions panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="flex flex-col gap-4"
        >
          {draft.captions.length > 0 ? (
            draft.captions.map((caption) => (
              <div
                key={caption.id}
                className="netra-card p-4 flex flex-col gap-3"
                style={{ borderLeft: `3px solid ${PLATFORM_BRAND_COLORS[caption.platform]}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={caption.platform} size={16} />
                    <span className="text-sm font-semibold capitalize text-foreground">{caption.platform}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">{caption.charCount} chars</span>
                    <button
                      onClick={() => handleCopy(`${caption.text}\n\n${caption.hashtags.join(' ')}`, caption.id)}
                      className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy caption"
                    >
                      {copiedId === caption.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{caption.text}</p>
                {caption.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {caption.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="netra-card p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
              <p className="text-sm">No captions generated</p>
            </div>
          )}

          {/* Hashtags (global) */}
          {draft.hashtags.length > 0 && (
            <div className="netra-card p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Global Hashtags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {draft.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground"
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="netra-card p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Details</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <span className="text-muted-foreground">Tone</span>
              <span className="text-foreground capitalize">{draft.tone || '—'}</span>
              <span className="text-muted-foreground">Content type</span>
              <span className="text-foreground capitalize">{draft.contentType?.replace('_', ' ') || '—'}</span>
              <span className="text-muted-foreground">Platforms</span>
              <span className="text-foreground capitalize">{draft.platforms.join(', ')}</span>
              {scheduledAt && (
                <>
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="text-foreground">{formatDate(scheduledAt, 'MMM d, yyyy h:mm a')}</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
