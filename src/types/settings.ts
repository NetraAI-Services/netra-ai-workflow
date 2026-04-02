import type { PlatformId } from './content';

export type ToneType = 'professional' | 'casual' | 'witty' | 'inspirational' | 'educational';

export type PostLength = 'short' | 'medium' | 'long';

export interface BrandSettings {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  tone: ToneType;
  voiceKeywords: string[];
  targetAudience: string;
}

export interface ApiKeys {
  geminiApiKey: string;
  openaiApiKey: string;
}

export interface PlatformConnection {
  connected: boolean;
  handle?: string;
  accountId?: string;
  tokenExpiry?: number; // Unix timestamp (milliseconds)
  scope?: string[];
  refreshToken?: string; // Client-side cache (not from DB)
}

export interface GenerationPreferences {
  defaultPostLength: PostLength;
  defaultHashtagCount: number;
  includeEmoji: boolean;
  language: string;
  defaultImageStyle: string;
  autoGenerateHashtags: boolean;
}

export interface PublishingConfig {
  requireApproval: boolean;
  autoPublish: boolean;
  defaultScheduleTime: string; // HH:mm format
  approvers: string[];
  notifyOnPublish: boolean;
  notifyOnFail: boolean;
}

export interface ComplianceConfig {
  restrictedKeywords: string[];
  safetyLevel: 'low' | 'medium' | 'high';
  blockExplicitContent: boolean;
  requireDisclosure: boolean;
  disclosureText: string;
}

export interface SettingsState {
  brand: BrandSettings;
  apiKeys: ApiKeys;
  platforms: Record<PlatformId, PlatformConnection>;
  generation: GenerationPreferences;
  publishing: PublishingConfig;
  compliance: ComplianceConfig;
}
