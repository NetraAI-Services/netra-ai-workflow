import type { PlatformId } from './content';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface EngagementItem {
  id: string;
  platform: PlatformId;
  postId: string;
  postThumbnail?: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  text: string;
  sentiment: Sentiment;
  createdAt: string;
  replied: boolean;
}
