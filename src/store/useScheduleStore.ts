'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post } from '@/types/content';
import type { CalendarView } from '@/types/schedule';
import { generateId } from '@/lib/utils';

interface ScheduleStore {
  posts: Post[];
  calendarView: CalendarView;
  selectedDate: string; // ISO string

  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  deletePost: (id: string) => void;
  setCalendarView: (view: CalendarView) => void;
  setSelectedDate: (date: string) => void;
  getPostsForDate: (dateStr: string) => Post[];
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      posts: [],
      calendarView: 'month',
      selectedDate: new Date().toISOString(),

      addPost: (post) =>
        set((s) => ({
          posts: [...s.posts, { ...post, id: generateId(), createdAt: new Date().toISOString() }],
        })),

      updatePost: (id, patch) =>
        set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

      deletePost: (id) =>
        set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),

      setCalendarView: (view) => set({ calendarView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),

      getPostsForDate: (dateStr) => {
        const { posts } = get();
        return posts.filter((p) => {
          const d = p.scheduledAt || p.publishedAt;
          return d && d.startsWith(dateStr);
        });
      },
    }),
    { name: 'netra-schedule' }
  )
);
