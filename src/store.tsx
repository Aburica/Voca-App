import {
  createContext, useContext, useEffect, useReducer, useRef, useCallback, useState, type ReactNode,
} from 'react';
import type {
  AppState, LangCode, View, User, SubscriptionTier, BillingCycle, CefrLevel, Theme,
} from './types';
import { defaultState, loadState, saveState, newUser, clearState, emptyProgress } from './lib/storage';
import { translate } from './i18n';
import { ALL_LANGS, AD_INTERVAL_SECONDS, FREE_MIC_LIMIT, levelFromHours } from './constants';
import { stopSpeaking } from './lib/tts';

type Action =
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_INTERFACE_LANG'; lang: LangCode }
  | { type: 'SET_TARGET_LANG'; lang: LangCode }
  | { type: 'ADD_SECONDS'; seconds: number }
  | { type: 'ADD_XP'; xp: number }
  | { type: 'SAVE_WORD'; word: string }
  | { type: 'REMOVE_WORD'; word: string }
  | { type: 'COMPLETE_LESSON'; lessonId: string; xp: number }
  | { type: 'SET_CEFR'; level: CefrLevel; score: number }
  | { type: 'USE_MIC' }
  | { type: 'RESET_MIC' }
  | { type: 'SET_SUBSCRIPTION'; tier: SubscriptionTier; cycle: BillingCycle }
  | { type: 'RESET_PROGRESS' }
  | { type: 'CONSUME_AD'; seconds: number }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'HYDRATE'; state: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE': return action.state;
    case 'LOGIN':
      return { ...state, user: { ...action.user, micUsed: 0, activeSecondsFree: 0 } };
    case 'LOGOUT':
      stopSpeaking();
      return { ...state, user: null };
    case 'SET_INTERFACE_LANG':
      return { ...state, interfaceLang: action.lang };
    case 'SET_TARGET_LANG': {
      const progress = state.progress[action.lang]
        ? state.progress
        : { ...state.progress, [action.lang]: emptyProgress(action.lang) };
      return { ...state, targetLang: action.lang, progress };
    }
    case 'ADD_SECONDS': {
      if (!state.user) return state;
      const t = state.targetLang;
      const p = state.progress[t] ?? emptyProgress(t);
      const progress = { ...state.progress, [t]: { ...p, totalSeconds: p.totalSeconds + action.seconds, lastActive: Date.now() } };
      const user = state.user.subscription === 'free'
        ? { ...state.user, activeSecondsFree: state.user.activeSecondsFree + action.seconds }
        : state.user;
      return { ...state, progress, user };
    }
    case 'ADD_XP': {
      const t = state.targetLang;
      const p = state.progress[t] ?? emptyProgress(t);
      return { ...state, progress: { ...state.progress, [t]: { ...p, xp: p.xp + action.xp } } };
    }
    case 'SAVE_WORD': {
      const t = state.targetLang;
      const p = state.progress[t] ?? emptyProgress(t);
      if (p.wordsSaved.includes(action.word)) return state;
      return { ...state, progress: { ...state.progress, [t]: { ...p, wordsSaved: [...p.wordsSaved, action.word] } } };
    }
    case 'REMOVE_WORD': {
      const t = state.targetLang;
      const p = state.progress[t] ?? emptyProgress(t);
      return { ...state, progress: { ...state.progress, [t]: { ...p, wordsSaved: p.wordsSaved.filter((w) => w !== action.word) } } };
    }
    case 'COMPLETE_LESSON': {
      const t = state.targetLang;
      const p = state.progress[t] ?? emptyProgress(t);
      if (p.completedLessons.includes(action.lessonId)) return state;
      return { ...state, progress: { ...state.progress, [t]: { ...p, completedLessons: [...p.completedLessons, action.lessonId], xp: p.xp + action.xp } } };
    }
    case 'SET_CEFR': {
      const t = state.targetLang;
      const p = state.progress[t] ?? emptyProgress(t);
      return { ...state, progress: { ...state.progress, [t]: { ...p, cefrLevel: action.level, testCompleted: true, testScore: action.score } } };
    }
    case 'USE_MIC':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, micUsed: state.user.micUsed + 1 } };
    case 'RESET_MIC':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, micUsed: 0 } };
    case 'SET_SUBSCRIPTION': {
      if (!state.user) return state;
      const months = action.cycle === 'monthly' ? 1 : action.cycle === 'quarterly' ? 3 : action.cycle === 'biannual' ? 6 : 12;
      return { ...state, user: { ...state.user, subscription: action.tier, subscriptionExpiry: Date.now() + months * 30 * 24 * 60 * 60 * 1000, activeSecondsFree: action.tier === 'free' ? state.user.activeSecondsFree : 0 } };
    }
    case 'RESET_PROGRESS': {
      const fresh = defaultState();
      return { ...fresh, user: state.user ? { ...state.user, micUsed: 0, activeSecondsFree: 0 } : null, interfaceLang: state.interfaceLang, targetLang: state.targetLang };
    }
    case 'CONSUME_AD':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, activeSecondsFree: Math.max(0, state.user.activeSecondsFree - AD_INTERVAL_SECONDS) } };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

interface ToastMsg { id: number; text: string; type: 'info' | 'success' | 'error'; }

interface Ctx {
  state: AppState;
  view: View;
  setView: (v: View) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  login: (name: string, email: string) => void;
  logout: () => void;
  setInterfaceLang: (l: LangCode) => void;
  setTargetLang: (l: LangCode) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  addSeconds: (s: number) => void;
  addXp: (xp: number) => void;
  saveWord: (w: string) => void;
  removeWord: (w: string) => void;
  completeLesson: (id: string, xp: number) => void;
  setCefr: (level: CefrLevel, score: number) => void;
  useMic: () => boolean;
  micLeft: number;
  setSubscription: (tier: SubscriptionTier, cycle: BillingCycle) => void;
  resetProgress: () => void;
  toasts: ToastMsg[];
  toast: (text: string, type?: ToastMsg['type']) => void;
  dismissToast: (id: number) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadState());
  const [view, setView] = useState<View>('dashboard');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;
  const viewRef = useRef(view);
  viewRef.current = view;

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    const meta = ALL_LANGS.find((l) => l.code === state.interfaceLang);
    document.documentElement.lang = state.interfaceLang;
    document.documentElement.dir = meta?.rtl ? 'rtl' : 'ltr';
  }, [state.interfaceLang]);

  useEffect(() => {
    if (state.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.theme]);

  // Active learning timer
  useEffect(() => {
    if (!state.user) return;
    const TICK = 5000;
    const id = setInterval(() => {
      const learningViews: View[] = ['dashboard', 'lessons', 'flashcards', 'context', 'chat', 'cefr-test'];
      if (!learningViews.includes(viewRef.current)) return;
      dispatch({ type: 'ADD_SECONDS', seconds: TICK / 1000 });
    }, TICK);
    return () => clearInterval(id);
  }, [state.user]);

  const toast = useCallback((text: string, type: ToastMsg['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3200);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((prev) => prev.filter((x) => x.id !== id)), []);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => translate(state.interfaceLang, key, vars), [state.interfaceLang]);

  const login = useCallback((name: string, email: string) => {
    dispatch({ type: 'LOGIN', user: newUser(name, email) });
    setView('dashboard');
  }, []);
  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const setInterfaceLang = useCallback((l: LangCode) => dispatch({ type: 'SET_INTERFACE_LANG', lang: l }), []);
  const setTargetLang = useCallback((l: LangCode) => {
    dispatch({ type: 'SET_TARGET_LANG', lang: l });
    const name = ALL_LANGS.find((x) => x.code === l)?.name ?? l;
    toast(translate(stateRef.current.interfaceLang, 'toast.langSwitched', { lang: name }), 'success');
  }, [toast]);
  const setTheme = useCallback((theme: Theme) => dispatch({ type: 'SET_THEME', theme }), []);
  const toggleTheme = useCallback(() => dispatch({ type: 'SET_THEME', theme: stateRef.current.theme === 'dark' ? 'light' : 'dark' }), []);
  const addSeconds = useCallback((s: number) => dispatch({ type: 'ADD_SECONDS', seconds: s }), []);
  const addXp = useCallback((xp: number) => dispatch({ type: 'ADD_XP', xp }), []);
  const saveWord = useCallback((w: string) => {
    dispatch({ type: 'SAVE_WORD', word: w });
    toast(translate(stateRef.current.interfaceLang, 'toast.wordSaved'), 'success');
  }, [toast]);
  const removeWord = useCallback((w: string) => dispatch({ type: 'REMOVE_WORD', word: w }), []);
  const completeLesson = useCallback((id: string, xp: number) => dispatch({ type: 'COMPLETE_LESSON', lessonId: id, xp }), []);
  const setCefr = useCallback((level: CefrLevel, score: number) => {
    dispatch({ type: 'SET_CEFR', level, score });
    toast(translate(stateRef.current.interfaceLang, 'toast.testSaved', { level }), 'success');
  }, [toast]);
  const useMic = useCallback(() => {
    const u = stateRef.current.user;
    if (!u) return false;
    if (u.subscription !== 'free') return true;
    if (u.micUsed >= FREE_MIC_LIMIT) return false;
    dispatch({ type: 'USE_MIC' });
    return true;
  }, []);
  const setSubscription = useCallback((tier: SubscriptionTier, cycle: BillingCycle) => {
    dispatch({ type: 'SET_SUBSCRIPTION', tier, cycle });
    toast(translate(stateRef.current.interfaceLang, 'toast.subsUpdated'), 'success');
  }, [toast]);
  const resetProgress = useCallback(() => {
    clearState();
    dispatch({ type: 'RESET_PROGRESS' });
    toast(translate(stateRef.current.interfaceLang, 'settings.resetDone'), 'success');
  }, [toast]);

  const micLeft = state.user
    ? state.user.subscription === 'free' ? Math.max(0, FREE_MIC_LIMIT - state.user.micUsed) : Infinity
    : 0;

  const value: Ctx = {
    state, view, setView, t, login, logout,
    setInterfaceLang, setTargetLang, setTheme, toggleTheme,
    addSeconds, addXp, saveWord, removeWord,
    completeLesson, setCefr, useMic, micLeft,
    setSubscription, resetProgress,
    toasts, toast, dismissToast,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export { ALL_LANGS, levelFromHours };
