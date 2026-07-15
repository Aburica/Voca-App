import { useApp } from '../store';
import { ALL_LANGS, TIER_INFO, FREE_MIC_LIMIT } from '../constants';
import { VocaBird } from '../components/VocaBird';
import {
  Crown, Mic, RotateCcw, AlertTriangle, User as UserIcon,
  Clock, Trophy, BookMarked, Sun, Moon, Check,
} from 'lucide-react';
import type { LangCode } from '../types';

export function Settings() {
  const { state, t, setInterfaceLang, setTargetLang, setView, resetProgress, micLeft, toggleTheme } = useApp();
  const user = state.user!;
  const tier = TIER_INFO[user.subscription];
  const isDark = state.theme === 'dark';
  const startedLangs = Object.entries(state.progress).filter(([, p]) => p) as [LangCode, typeof state.progress[LangCode]][];

  return (
    <div className="space-y-6">
      <h1 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{t('settings.title')}</h1>

      {/* Appearance — Dark Mode */}
      <div className="card p-6">
        <h2 className="section-title mb-4 flex items-center gap-2">
          {isDark ? <Moon size={20} className="text-sky-400" /> : <Sun size={20} className="text-voca-500" />} {t('settings.appearance')}
        </h2>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-2xl bg-ink-50 px-4 py-3 font-bold text-ink-700 transition hover:bg-ink-100 dark:bg-ink-900/60 dark:text-ink-200 dark:hover:bg-ink-700"
        >
          <span>{isDark ? t('common.darkMode') : t('common.lightMode')}</span>
          <span className="relative flex h-6 w-11 items-center rounded-full bg-ink-200 transition dark:bg-sky-600">
            <span className={`absolute h-5 w-5 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </span>
        </button>
      </div>

      {/* Account */}
      <div className="card p-6">
        <h2 className="section-title mb-4 flex items-center gap-2"><UserIcon size={20} /> {t('settings.account')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-voca-500 font-brand text-2xl font-bold text-ink-900 shadow-inner-3px">{user.avatar}</div>
          <div>
            <p className="font-bold text-ink-900 dark:text-ink-100">{user.name}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">{user.email}</p>
            <p className="text-xs text-ink-400 dark:text-ink-500">{new Date(user.createdAt).toLocaleDateString(state.interfaceLang)}</p>
          </div>
        </div>
      </div>

      {/* Interface Language */}
      <div className="card p-6">
        <h2 className="section-title mb-2 flex items-center gap-2">🌐 {t('settings.interfaceLang')}</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">{t('settings.interfaceLangDesc')}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ALL_LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setInterfaceLang(l.code)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-3 text-start transition ${state.interfaceLang === l.code ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/30' : 'border-ink-100 hover:border-sky-200 dark:border-ink-700 dark:hover:border-sky-600'}`}
            >
              <span className="text-lg">{l.flag}</span>
              <span className="truncate text-sm font-bold text-ink-900 dark:text-ink-100">{l.nativeName}</span>
              {state.interfaceLang === l.code && <Check size={14} className="ms-auto text-sky-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Language */}
      <div className="card p-6">
        <h2 className="section-title mb-2 flex items-center gap-2">📚 {t('settings.learningLang')}</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">{t('settings.learningLangDesc')}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ALL_LANGS.map((l) => {
            const active = state.targetLang === l.code;
            const lp = state.progress[l.code];
            return (
              <button key={l.code} onClick={() => setTargetLang(l.code)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-center transition ${active ? 'border-voca-400 bg-voca-50 dark:bg-voca-900/30' : 'border-ink-100 hover:border-voca-200 dark:border-ink-700 dark:hover:border-voca-600'}`}>
                <span className="text-2xl">{l.flag}</span>
                <span className="text-sm font-bold text-ink-900 dark:text-ink-100">{l.name}</span>
                <span className="text-xs text-ink-400 dark:text-ink-500">{lp ? `${lp.cefrLevel} · ${lp.xp} XP` : t('common.start')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subscription */}
      <div className="card p-6">
        <h2 className="section-title mb-4 flex items-center gap-2"><Crown size={20} /> {t('settings.subscription')}</h2>
        <div className="flex items-center justify-between rounded-2xl bg-ink-50 p-4 dark:bg-ink-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-voca-100 text-voca-700"><Crown size={20} /></div>
            <div>
              <p className="font-bold text-ink-900 dark:text-ink-100">{t(tier.nameKey)}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{tier.levels}</p>
            </div>
          </div>
          <button onClick={() => setView('subscriptions')} className="btn btn-ghost">{t('nav.subscriptions')}</button>
        </div>
      </div>

      {/* Mic usage */}
      <div className="card p-6">
        <h2 className="section-title mb-4 flex items-center gap-2"><Mic size={20} /> {t('settings.micUsage')}</h2>
        <div className="flex items-center justify-between rounded-2xl bg-ink-50 p-4 dark:bg-ink-900/60">
          <p className="text-sm font-bold text-ink-700 dark:text-ink-200">{t('settings.micUsageDesc', { n: FREE_MIC_LIMIT })}</p>
          <span className="text-sm font-bold text-ink-700 dark:text-ink-200">{user.subscription === 'free' ? `${micLeft}/${FREE_MIC_LIMIT}` : '∞'}</span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-coral-200 p-6 dark:border-coral-900/40">
        <h2 className="section-title mb-2 flex items-center gap-2 text-coral-600"><AlertTriangle size={20} /> {t('settings.dangerZone')}</h2>
        <p className="mb-4 text-sm text-ink-500 dark:text-ink-400">{t('settings.resetConfirm')}</p>
        <button onClick={resetProgress} className="btn btn-danger">
          <RotateCcw size={16} /> {t('settings.reset')}
        </button>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-1 py-6 text-center">
        <VocaBird size={40} animated />
        <p className="font-brand lowercase text-lg font-bold text-ink-400 dark:text-ink-500">voca</p>
        <p className="text-xs text-ink-300 dark:text-ink-600">{t('app.tagline')}</p>
      </div>
    </div>
  );
}
