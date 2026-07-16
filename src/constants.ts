import type { CefrLevel, LangCode, SubscriptionTier, BillingCycle } from './types';

export const ALL_LANGS: { code: LangCode; name: string; flag: string; nativeName: string; rtl: boolean; bcp47: string }[] = [
  { code: 'ar', name: 'Arabic',    flag: '🇸🇦', nativeName: 'العربية',     rtl: true,  bcp47: 'ar-SA' },
  { code: 'en', name: 'English',   flag: '🇬🇧', nativeName: 'English',     rtl: false, bcp47: 'en-US' },
  { code: 'de', name: 'German',    flag: '🇩🇪', nativeName: 'Deutsch',     rtl: false, bcp47: 'de-DE' },
  { code: 'fr', name: 'French',    flag: '🇫🇷', nativeName: 'Français',    rtl: false, bcp47: 'fr-FR' },
  { code: 'zh', name: 'Chinese',   flag: '🇨🇳', nativeName: '中文',         rtl: false, bcp47: 'zh-CN' },
  { code: 'ja', name: 'Japanese',  flag: '🇯🇵', nativeName: '日本語',       rtl: false, bcp47: 'ja-JP' },
  { code: 'ko', name: 'Korean',    flag: '🇰🇷', nativeName: '한국어',       rtl: false, bcp47: 'ko-KR' },
  { code: 'hi', name: 'Hindi',     flag: '🇮🇳', nativeName: 'हिन्दी',       rtl: false, bcp47: 'hi-IN' },
  { code: 'ur', name: 'Urdu',      flag: '🇵🇰', nativeName: 'اردو',        rtl: true,  bcp47: 'ur-PK' },
  { code: 'es', name: 'Spanish',   flag: '🇪🇸', nativeName: 'Español',     rtl: false, bcp47: 'es-ES' },
  { code: 'id', name: 'Indonesian',flag: '🇮🇩', nativeName: 'Bahasa Indonesia', rtl: false, bcp47: 'id-ID' },
  { code: 'pt', name: 'Portuguese',flag: '🇵🇹', nativeName: 'Português',   rtl: false, bcp47: 'pt-PT' },
  { code: 'ru', name: 'Russian',   flag: '🇷🇺', nativeName: 'Русский',     rtl: false, bcp47: 'ru-RU' },
  { code: 'bn', name: 'Bengali',   flag: '🇧🇩', nativeName: 'বাংলা',        rtl: false, bcp47: 'bn-BD' },
  { code: 'tr', name: 'Turkish',   flag: '🇹🇷', nativeName: 'Türkçe',      rtl: false, bcp47: 'tr-TR' },
  { code: 'vi', name: 'Vietnamese',flag: '🇻🇳', nativeName: 'Tiếng Việt',  rtl: false, bcp47: 'vi-VN' },
];

export const LANG_CODES: LangCode[] = ALL_LANGS.map((l) => l.code);
export const LANG_BY_CODE = Object.fromEntries(ALL_LANGS.map((l) => [l.code, l])) as Record<LangCode, typeof ALL_LANGS[number]>;
export const BCP47: Record<LangCode, string> = Object.fromEntries(ALL_LANGS.map((l) => [l.code, l.bcp47])) as Record<LangCode, string>;

export const CEFR_LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const CEFR_NEXT_HOURS: Record<CefrLevel, number> = { A1: 10, A2: 25, B1: 50, B2: 100, C1: 200, C2: 400 };

export function levelFromHours(hours: number): CefrLevel {
  if (hours >= 200) return 'C2';
  if (hours >= 100) return 'C1';
  if (hours >= 50) return 'B2';
  if (hours >= 25) return 'B1';
  if (hours >= 10) return 'A2';
  return 'A1';
}

export function cefrToScore(score: number): CefrLevel {
  if (score >= 36) return 'C2';
  if (score >= 30) return 'C1';
  if (score >= 22) return 'B2';
  if (score >= 14) return 'B1';
  if (score >= 7) return 'A2';
  return 'A1';
}

export const TIER_INFO: Record<SubscriptionTier, {
  id: SubscriptionTier; nameKey: string; levels: string;
  monthly: number; quarterly: number; biannual: number; annual: number;
  color: string; featuresKey: string[];
}> = {
  free: { id: 'free', nameKey: 'tier.free.name', levels: 'A1', monthly: 0, quarterly: 0, biannual: 0, annual: 0, color: 'ink', featuresKey: ['tier.free.f1', 'tier.free.f2'] },
  explorer: { id: 'explorer', nameKey: 'tier.explorer.name', levels: 'A1-A2', monthly: 2.99, quarterly: 5.99, biannual: 11.99, annual: 23.99, color: 'sky', featuresKey: ['tier.explorer.f1', 'tier.explorer.f2', 'tier.explorer.f3'] },
  builder: { id: 'builder', nameKey: 'tier.builder.name', levels: 'A1-B2', monthly: 4.99, quarterly: 14.99, biannual: 24.99, annual: 39.99, color: 'voca', featuresKey: ['tier.builder.f1', 'tier.builder.f2', 'tier.builder.f3', 'tier.builder.f4'] },
  professional: { id: 'professional', nameKey: 'tier.professional.name', levels: 'A1-C1 + Exam Prep', monthly: 19.99, quarterly: 29.99, biannual: 39.99, annual: 79.99, color: 'forest', featuresKey: ['tier.professional.f1', 'tier.professional.f2', 'tier.professional.f3', 'tier.professional.f4', 'tier.professional.f5'] },
};

export const BILLING_LABELS: Record<BillingCycle, { months: number; key: string }> = {
  monthly: { months: 1, key: 'billing.monthly' },
  quarterly: { months: 3, key: 'billing.quarterly' },
  biannual: { months: 6, key: 'billing.biannual' },
  annual: { months: 12, key: 'billing.annual' },
};

export const AD_INTERVAL_SECONDS = 20 * 60;
export const FREE_MIC_LIMIT = 5;
export const FLASHCARDS_PER_SESSION = 5;
