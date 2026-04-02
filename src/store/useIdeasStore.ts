'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContentPillar, IdeaCard } from '@/types/ideas';
import { generateId } from '@/lib/utils';
import { PILLAR_COLORS } from '@/lib/constants';

interface IdeasStore {
  pillars: ContentPillar[];
  ideas: IdeaCard[];

  addPillar: (name: string, description?: string) => void;
  updatePillar: (id: string, patch: Partial<ContentPillar>) => void;
  deletePillar: (id: string) => void;
  addIdea: (idea: Omit<IdeaCard, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, patch: Partial<IdeaCard>) => void;
  deleteIdea: (id: string) => void;
  moveIdea: (ideaId: string, toPillarId: string) => void;
}

const defaultPillars: ContentPillar[] = [
  { id: 'educational',  name: 'Educational',      color: '#5B6CF6', description: 'Tips, tutorials, how-tos', order: 0 },
  { id: 'promotional',  name: 'Promotional',      color: '#E1306C', description: 'Product & service highlights', order: 1 },
  { id: 'behind',       name: 'Behind the Scenes', color: '#F59E0B', description: 'Team, culture, process', order: 2 },
  { id: 'user-stories', name: 'User Stories',     color: '#22C55E', description: 'Testimonials, UGC', order: 3 },
];

export const useIdeasStore = create<IdeasStore>()(
  persist(
    (set, get) => ({
      pillars: defaultPillars,
      ideas: [],

      addPillar: (name, description = '') =>
        set((s) => ({
          pillars: [
            ...s.pillars,
            {
              id: generateId(),
              name,
              description,
              color: PILLAR_COLORS[s.pillars.length % PILLAR_COLORS.length],
              order: s.pillars.length,
            },
          ],
        })),

      updatePillar: (id, patch) =>
        set((s) => ({ pillars: s.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

      deletePillar: (id) =>
        set((s) => ({
          pillars: s.pillars.filter((p) => p.id !== id),
          ideas: s.ideas.filter((i) => i.pillarId !== id),
        })),

      addIdea: (idea) =>
        set((s) => ({
          ideas: [...s.ideas, { ...idea, id: generateId(), createdAt: new Date().toISOString() }],
        })),

      updateIdea: (id, patch) =>
        set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),

      deleteIdea: (id) =>
        set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) })),

      moveIdea: (ideaId, toPillarId) => {
        const { pillars } = get();
        if (!pillars.find((p) => p.id === toPillarId)) return;
        set((s) => ({
          ideas: s.ideas.map((i) => (i.id === ideaId ? { ...i, pillarId: toPillarId } : i)),
        }));
      },
    }),
    { name: 'netra-ideas' }
  )
);
