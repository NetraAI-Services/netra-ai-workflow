import type { PlatformId } from './content';

export interface PlatformStats {
  platform: PlatformId;
  reach: number;
  impressions: number;
  engagementRate: number;
  followers: number;
  postsCount: number;
}

export interface EngagementDataPoint {
  date: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
}

export interface OverviewMetrics {
  totalReach: number;
  totalImpressions: number;
  avgEngagementRate: number;
  postsPublished: number;
  reachChange: number;
  impressionsChange: number;
  engagementChange: number;
  postsChange: number;
}
