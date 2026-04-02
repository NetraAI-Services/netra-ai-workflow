'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState } from '@/types/settings';

interface SettingsStore extends SettingsState {
  updateBrand: (patch: Partial<SettingsState['brand']>) => void;
  updateApiKeys: (patch: Partial<SettingsState['apiKeys']>) => void;
  updatePlatform: (id: keyof SettingsState['platforms'], patch: Partial<SettingsState['platforms'][keyof SettingsState['platforms']]>) => void;
  updateGeneration: (patch: Partial<SettingsState['generation']>) => void;
  updatePublishing: (patch: Partial<SettingsState['publishing']>) => void;
  updateCompliance: (patch: Partial<SettingsState['compliance']>) => void;
  setPlatformConnected: (id: keyof SettingsState['platforms'], data: { handle?: string; accountId?: string; tokenExpiry?: number; scope?: string[] }) => void;
  setPlatformDisconnected: (id: keyof SettingsState['platforms']) => void;
}

const defaults: SettingsState = {
  brand: {
    name: 'My Brand',
    primaryColor: '#5B6CF6',
    secondaryColor: '#8D97FA',
    logoUrl: '',
    tone: 'professional',
    voiceKeywords: [],
    targetAudience: '',
  },
  apiKeys: {
    geminiApiKey: '',
    openaiApiKey: '',
  },
  platforms: {
    instagram: { connected: false },
    tiktok:    { connected: false },
    youtube:   { connected: false },
    twitter:   { connected: false },
  },
  generation: {
    defaultPostLength: 'medium',
    defaultHashtagCount: 5,
    includeEmoji: true,
    language: 'English',
    defaultImageStyle: 'photorealistic',
    autoGenerateHashtags: true,
  },
  publishing: {
    requireApproval: false,
    autoPublish: false,
    defaultScheduleTime: '09:00',
    approvers: [],
    notifyOnPublish: true,
    notifyOnFail: true,
  },
  compliance: {
    restrictedKeywords: [],
    safetyLevel: 'medium',
    blockExplicitContent: true,
    requireDisclosure: false,
    disclosureText: '',
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      updateBrand: (patch) =>
        set((s) => ({ brand: { ...s.brand, ...patch } })),
      updateApiKeys: (patch) =>
        set((s) => ({ apiKeys: { ...s.apiKeys, ...patch } })),
      updatePlatform: (id, patch) =>
        set((s) => ({
          platforms: {
            ...s.platforms,
            [id]: { ...s.platforms[id], ...patch },
          },
        })),
      updateGeneration: (patch) =>
        set((s) => ({ generation: { ...s.generation, ...patch } })),
      updatePublishing: (patch) =>
        set((s) => ({ publishing: { ...s.publishing, ...patch } })),
      updateCompliance: (patch) =>
        set((s) => ({ compliance: { ...s.compliance, ...patch } })),
      setPlatformConnected: (id, data) =>
        set((s) => ({
          platforms: {
            ...s.platforms,
            [id]: {
              ...s.platforms[id],
              connected: true,
              handle: data.handle,
              accountId: data.accountId,
              tokenExpiry: data.tokenExpiry,
              scope: data.scope,
            },
          },
        })),
      setPlatformDisconnected: (id) =>
        set((s) => ({
          platforms: {
            ...s.platforms,
            [id]: {
              connected: false,
              handle: undefined,
              accountId: undefined,
              tokenExpiry: undefined,
              scope: undefined,
            },
          },
        })),
    }),
    { name: 'netra-settings' }
  )
);
