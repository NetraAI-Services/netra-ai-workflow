export type PlatformId = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export type ContentType =
  | 'image_post'
  | 'reel'
  | 'carousel'
  | 'story'
  | 'text_post'
  | 'video'
  | 'short';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';

export interface GeneratedCaption {
  id: string;
  platform: PlatformId;
  text: string;
  hashtags: string[];
  charCount: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  provider: 'gemini' | 'dalle';
  prompt: string;
  selected?: boolean;
}

export interface Draft {
  id: string;
  platforms: PlatformId[];
  contentType: ContentType;
  topic: string;
  tone: string;
  pillarId?: string;
  captions: GeneratedCaption[];
  images: GeneratedImage[];
  selectedImageId?: string;
  hashtags: string[];
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  draft: Draft;
  status: PostStatus;
  publishedAt?: string;
  scheduledAt?: string;
  platformPostIds?: Partial<Record<PlatformId, string>>;
  metrics?: PostMetrics;
  error?: string;
  createdAt: string;
}

export interface PostMetrics {
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}
