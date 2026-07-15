export type LangCode =
  | 'ar' | 'en' | 'de' | 'fr' | 'zh' | 'ja' | 'ko' | 'hi'
  | 'ur' | 'es' | 'id' | 'pt' | 'ru' | 'bn' | 'tr' | 'vi';

export type Theme = 'light' | 'dark';

export type View =
  | 'dashboard' | 'lessons' | 'flashcards' | 'context'
  | 'chat' | 'cefr-test' | 'subscriptions' | 'settings';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SubscriptionTier = 'free' | 'explorer' | 'builder' | 'professional';
export type BillingCycle = 'monthly' | 'quarterly' | 'biannual' | 'annual';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: number;
  subscription: SubscriptionTier;
  subscriptionExpiry: number | null;
  micUsed: number;
  activeSecondsFree: number;
}

export interface LanguageProgress {
  targetLang: LangCode;
  totalSeconds: number;
  xp: number;
  wordsSaved: string[];
  cefrLevel: CefrLevel;
  completedLessons: string[];
  testCompleted: boolean;
  testScore: number | null;
  lastActive: number;
}

export interface AppState {
  user: User | null;
  interfaceLang: LangCode;
  targetLang: LangCode;
  theme: Theme;
  progress: Partial<Record<LangCode, LanguageProgress>>;
}

export interface WordEntry {
  word: string;          // in the target learning language
  translations: Partial<Record<LangCode, string>>; // meaning in every interface language
  example: string;       // example sentence in the target language
  exampleTranslation: string; // example translation (in interface lang or EN)
  level: CefrLevel;
  emoji: string;
}

export interface LessonQuestion {
  prompt: string;          // i18n key
  word: string;            // the word in the target language
  wordInInterfaceLang: string; // the word's meaning in the interface language
  options: string[];       // all in target language
  correctAnswer: string;   // in target language
}

export interface Lesson {
  id: string;
  titleKey: string;
  level: CefrLevel;
  xp: number;
  questions: LessonQuestion[];
}

export type CefrSection = 'listening' | 'reading' | 'writing' | 'speaking';

export interface CefrTestQuestion {
  id: number;
  section: CefrSection;
  prompt: string;          // i18n key
  tts?: string;            // full dialogue text for TTS
  passage?: string;        // reading passage
  wordInInterfaceLang?: string; // for reading MCQ: word meaning in interface lang
  options?: string[];      // in target language
  correctAnswer?: string;  // in target language
}
