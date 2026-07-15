import { Menu, Flame, Trophy, Mic, ArrowLeft, Home } from 'lucide-react';
import { useApp } from '../store';
import { ALL_LANGS } from '../constants';
import { VocaBird } from './VocaBird';

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { state, t, micLeft, setView, view } = useApp();
  const p = state.progress[state.targetLang];
  const lang = ALL_LANGS.find((l) => l.code === state.targetLang);
  const hours = p ? (p.totalSeconds / 3600).toFixed(1) : '0.0';
  const xp = p ? p.xp : 0;
  const isFree = state.user?.subscription === 'free';
  const isDashboard = view === 'dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink-100 bg-white/80 px-4 py-3 backdrop-blur dark:border-ink-700 dark:bg-ink-800/80 lg:px-6">
      {/* Voca Bird logo — clickable to toggle sidebar */}
      <button
        onClick={onMenu}
        className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-ink-50 dark:hover:bg-ink-700"
        aria-label="menu"
      >
        <VocaBird size={32} animated />
      </button>

      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-700 lg:hidden"
        aria-label="menu"
      >
        <Menu size={20} />
      </button>

      {!isDashboard && (
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-1.5 rounded-2xl bg-coral-50 px-3 py-2 text-sm font-bold text-coral-600 transition hover:bg-coral-100 dark:bg-coral-900/40 dark:text-coral-400 dark:hover:bg-coral-900/60"
          aria-label={t('common.backToDashboard')}
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          <span className="hidden sm:inline">{t('common.exit')}</span>
          <Home size={15} className="sm:hidden" />
        </button>
      )}

      <div className="flex items-center gap-2 rounded-full bg-ink-50 px-3 py-1.5 text-sm font-bold text-ink-700 dark:bg-ink-900/60 dark:text-ink-200">
        <span className="text-base">{lang?.flag}</span>
        {lang?.name}
      </div>

      <div className="ms-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-700 sm:flex dark:bg-sky-900/40 dark:text-sky-400">
          <Flame size={16} />
          {hours} {t('common.hours')}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-voca-100 px-3 py-1.5 text-sm font-bold text-voca-800 dark:bg-voca-900/40 dark:text-voca-300">
          <Trophy size={16} />
          {xp} {t('common.xp')}
        </div>
        {isFree && (
          <div className="flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-sm font-bold text-ink-600 dark:bg-ink-900/60 dark:text-ink-300">
            <Mic size={16} />
            {micLeft === Infinity ? '∞' : micLeft}/5
          </div>
        )}
      </div>
    </header>
  );
}
