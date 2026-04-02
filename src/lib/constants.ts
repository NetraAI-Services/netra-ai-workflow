import type { PlatformId, ContentType } from '@/types/content';

export const PLATFORMS: { id: PlatformId; label: string; color: string }[] = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'tiktok',    label: 'TikTok',    color: '#010101' },
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000' },
  { id: 'twitter',   label: 'X (Twitter)', color: '#1DA1F2' },
];

export const CONTENT_TYPES: { id: ContentType; label: string; platforms: PlatformId[] }[] = [
  { id: 'image_post', label: 'Image Post',  platforms: ['instagram', 'twitter'] },
  { id: 'reel',       label: 'Reel / Short', platforms: ['instagram', 'tiktok', 'youtube'] },
  { id: 'carousel',   label: 'Carousel',    platforms: ['instagram'] },
  { id: 'story',      label: 'Story',       platforms: ['instagram'] },
  { id: 'text_post',  label: 'Text Post',   platforms: ['twitter', 'instagram'] },
  { id: 'video',      label: 'Video',       platforms: ['youtube', 'tiktok'] },
  { id: 'short',      label: 'Short',       platforms: ['youtube'] },
];

export const CHAR_LIMITS: Record<PlatformId, number> = {
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  twitter: 280,
};

export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual',       label: 'Casual' },
  { value: 'witty',        label: 'Witty' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'educational',  label: 'Educational' },
] as const;

export const PILLAR_COLORS = [
  '#5B6CF6', '#E1306C', '#FF6B35', '#22C55E',
  '#F59E0B', '#8B5CF6', '#06B6D4', '#EF4444',
];
