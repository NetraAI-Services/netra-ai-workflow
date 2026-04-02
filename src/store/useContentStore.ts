'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Draft, GeneratedCaption, GeneratedImage, PlatformId, ContentType } from '@/types/content';
import { generateId } from '@/lib/utils';

interface GenerationState {
  isGeneratingCaption: boolean;
  isGeneratingImage: boolean;
  captions: GeneratedCaption[];
  images: GeneratedImage[];
  error: string | null;
}

interface ContentStore {
  currentDraft: Draft | null;
  drafts: Draft[];
  generationState: GenerationState;
  wizardStep: number;

  setWizardStep: (step: number) => void;
  initDraft: (platforms: PlatformId[], contentType: ContentType) => void;
  updateDraft: (patch: Partial<Draft>) => void;
  saveDraft: () => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  clearCurrentDraft: () => void;

  setGeneratingCaption: (val: boolean) => void;
  setGeneratingImage: (val: boolean) => void;
  setCaptions: (captions: GeneratedCaption[]) => void;
  setImages: (images: GeneratedImage[]) => void;
  selectImage: (id: string) => void;
  setGenerationError: (err: string | null) => void;
}

const defaultGen: GenerationState = {
  isGeneratingCaption: false,
  isGeneratingImage: false,
  captions: [],
  images: [],
  error: null,
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      currentDraft: null,
      drafts: [],
      generationState: defaultGen,
      wizardStep: 0,

      setWizardStep: (step) => set({ wizardStep: step }),

      initDraft: (platforms, contentType) => {
        const now = new Date().toISOString();
        set({
          currentDraft: {
            id: generateId(),
            platforms,
            contentType,
            topic: '',
            tone: 'professional',
            captions: [],
            images: [],
            hashtags: [],
            createdAt: now,
            updatedAt: now,
          },
          generationState: defaultGen,
          wizardStep: 1,
        });
      },

      updateDraft: (patch) =>
        set((s) =>
          s.currentDraft
            ? { currentDraft: { ...s.currentDraft, ...patch, updatedAt: new Date().toISOString() } }
            : {}
        ),

      saveDraft: () => {
        const { currentDraft, drafts } = get();
        if (!currentDraft) return;
        const exists = drafts.find((d) => d.id === currentDraft.id);
        set({
          drafts: exists
            ? drafts.map((d) => (d.id === currentDraft.id ? currentDraft : d))
            : [...drafts, currentDraft],
        });
      },

      loadDraft: (id) => {
        const draft = get().drafts.find((d) => d.id === id);
        if (draft) set({ currentDraft: draft, generationState: defaultGen, wizardStep: 1 });
      },

      deleteDraft: (id) =>
        set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),

      clearCurrentDraft: () =>
        set({ currentDraft: null, generationState: defaultGen, wizardStep: 0 }),

      setGeneratingCaption: (val) =>
        set((s) => ({ generationState: { ...s.generationState, isGeneratingCaption: val } })),
      setGeneratingImage: (val) =>
        set((s) => ({ generationState: { ...s.generationState, isGeneratingImage: val } })),
      setCaptions: (captions) =>
        set((s) => ({ generationState: { ...s.generationState, captions } })),
      setImages: (images) =>
        set((s) => ({ generationState: { ...s.generationState, images } })),
      selectImage: (id) =>
        set((s) => ({
          generationState: {
            ...s.generationState,
            images: s.generationState.images.map((img) => ({
              ...img,
              selected: img.id === id,
            })),
          },
          currentDraft: s.currentDraft
            ? { ...s.currentDraft, selectedImageId: id }
            : null,
        })),
      setGenerationError: (err) =>
        set((s) => ({ generationState: { ...s.generationState, error: err } })),
    }),
    { name: 'netra-content', partialize: (s) => ({ drafts: s.drafts }) }
  )
);
