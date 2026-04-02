import type { Post } from './content';

export interface ScheduledPost extends Post {
  scheduledAt: string;
}

export type CalendarView = 'month' | 'week' | 'day';
