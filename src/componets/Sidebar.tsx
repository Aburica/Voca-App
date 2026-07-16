import { useApp } from '../store';
import { VocaLogo } from './VocaBird';
import {
  Home, BookOpen, Layers, Languages, MessageCircle, ClipboardCheck,
  CreditCard, Settings, LogOut, Crown, X, Check, Sun, Moon,
} from 'lucide-react';
import type { View } from '../types';
import { ALL_LANGS } from '../constants';

const NAV: { view: View; key: string; icon: typeof Home }[] = [
  { view: 'dashboard', key: 'nav.dashboard', icon: Home },
  { view: 'lessons', key: 'nav.lessons', icon: BookOpen },
  { view: 'flashcards', key: 'nav.flashcards', icon: Layers },
  { view: 'context', key: 'nav.context', icon: Languages },
  { view: 'chat', key: 'nav.chat', icon: MessageCircle },
  { view: 'cefr-test', key: 'nav.cefr', icon: ClipboardCheck },
  { view: 'subscriptions', key: 'nav.subscriptions', icon: CreditCard },
  { view: 'settings', key: 'nav.settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, view, setView, t, logout, setTargetLang, toggleTheme } = useApp();
  const user = state.user;
  const isFree = user?.subscription === 'free';
  const isDark = state.theme === 'dark';

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden dark:bg-ink-950/60" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static inset-y-0 z-50 flex w-72 flex-col bg-white dark:bg-ink-800 border-e border-ink-100 dark:border-ink-700 transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <VocaLogo size={36} animated />
          <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-ink-700 dark:text-ink-400 dark:hover:text-ink-200">
            <X size={20} />
          </button>
        </div>

        {/* Dark mode toggle — at the top */}
        <div className="px-3 pb-2">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-2xl bg-ink-50 px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:bg-ink-100 dark:bg-ink-900/60 dark:text-ink-200 dark:hover:bg-ink-700"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Moon size={16} className="text-sky-400" /> : <Sun size={16} className="text-voca-500" />}
              {isDark ? t('common.darkMode') : t('common.lightMode')}
            </span>
            <span className="relative flex h-5 w-9 items-center rounded-full bg-ink-200 transition dark:bg-sky-600">
              <span className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </span>
          </button>
        </div>

        {/* Learning language switcher */}
        <div className="px-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-400 dark:text-ink-500">
            {t('dash.switchLang')}
          </p>
          <div className="max-h-44 space-y-1 overflow-y-auto rounded-2xl bg-ink-50/50 dark:bg-ink-900/50 p-1.5 scrollbar-thin">
            {ALL_LANGS.map((l) => {
              const active = state.targetLang === l.code;
              const started = !!state.progress[l.code];
              return (
                <button
                  key={l.code}
                  onClick={() => { setTargetLang(l.code); onClose(); }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-voca-400 text-ink-900 shadow-inner-3px'
                      : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="truncate flex-1 text-start">{l.name}</span>
                  {started && <Check size={13} className="shrink-0 text-forest-500" />}
                </button>
              );
            })}
          </div>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
          {NAV.map(({ view: v, key, icon: Icon }) => {
            const active = view === v;
            return (
              <button
                key={v}
                onClick={() => { setView(v); onClose(); }}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition ${
                  active
                    ? 'bg-voca-100 text-voca-800 shadow-inner-3px dark:bg-voca-900/50 dark:text-voca-300'
                    : 'text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-700/60'
                }`}
              >
                <Icon size={20} className={active ? 'text-voca-700 dark:text-voca-400' : 'text-ink-400 group-hover:text-ink-700 dark:text-ink-500 dark:group-hover:text-ink-200'} />
                {t(key)}
                {v === 'subscriptions' && isFree && (
                  <span className="ms-auto rounded-full bg-coral-100 px-2 py-0.5 text-[10px] font-bold text-coral-600 dark:bg-coral-900/50 dark:text-coral-400">
                    {t('common.pro')}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User card */}
        <div className="border-t border-ink-100 dark:border-ink-700 p-3">
          <div className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3 dark:bg-ink-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-voca-500 font-brand text-lg font-bold text-ink-900">
              {user?.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900 dark:text-ink-100">{user?.name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-ink-400 dark:text-ink-500">
                {isFree ? (
                  <><Crown size={12} className="text-voca-500" /> {t('common.free')}</>
                ) : (
                  <><Crown size={12} className="text-forest-500" /> {t('common.pro')}</>
                )}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-ink-400 hover:bg-coral-50 hover:text-coral-600 dark:hover:bg-coral-900/40 dark:hover:text-coral-400"
              aria-label={t('nav.logout')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
