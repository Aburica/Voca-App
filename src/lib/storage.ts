import { AppState, User } from '../types';

export const emptyProgress = {
  lessonsCompleted: [],
  wordsLearned: 0,
  xp: 0,
  streak: 0,
  lastActive: null
};

export const newUser = (username: string): User => ({
  id: Math.random().toString(36).substring(2, 9),
  username: username, 
  createdAt: new Date() as any,
  progress: emptyProgress as any
});

export const defaultState: AppState = {
  view: 'welcome' as any, 
  user: null,
  theme: 'light' as any,
  language: 'en' as any,
  targetLanguage: 'es' as any,
  subscription: {
    tier: 'free' as any,
    expiresAt: null
  }
};

const STORAGE_KEY = 'voca_app_state';

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultState;
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch {
    // Ignore write errors
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore errors
  }
};