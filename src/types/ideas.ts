import type { PlatformId, ContentType } from './content';

export type IdeaPriority = 'low' | 'medium' | 'high';

export interface ContentPillar {
  id: string;
  name: string;
  color: string;
  description: string;
  order: number;
}

export interface IdeaCard {
  id: string;
  pillarId: string;
  title: string;
  description: string;
  platforms: PlatformId[];
  contentType?: ContentType;
  priority: IdeaPriority;
  tags: string[];
  createdAt: string;
}
