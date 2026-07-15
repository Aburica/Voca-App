import { useState } from 'react';
import { useApp } from '../store';
import { VocaBird } from '../components/VocaBird';
import { Headphones, Sparkles, Globe, ArrowRight } from 'lucide-react';
import { ALL_LANGS } from '../constants';
import type { LangCode } from '../types';

export function Login() {
  const { login, state, setInterfaceLang, t } = useApp();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const finalName = name.trim() || email.split('@')[0];
    login(finalName, email.trim());
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-voca-100 via-sky-50 to-white dark:from-ink-800 dark:via-ink-900 dark:to-ink-950">
      <div className="absolute -top-20 -start-20 h-64 w-64 rounded-full bg-voca-200/40 blur-3xl" />
      <div className="absolute -bottom-20 -end-20 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />

      {/* Interface language picker */}
      <div className="absolute top-5 end-5 z-10">
        <select
          value={state.interfaceLang}
          onChange={(e) => setInterfaceLang(e.target.value as LangCode)}
          className="rounded-2xl border-2 border-ink-100 bg-white px-3 py-2 text-sm font-bold text-ink-700 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
        >
          {ALL_LANGS.map((l) => (
            <option key={l.code} value={l.code}>{l.flag} {l.nativeName}</option>
          ))}
        </select>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-4 py-10 lg:flex-row lg:items-center lg:justify-between">
        {/* Hero */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/60 backdrop-blur dark:bg-ink-800/60">
            <VocaBird size={96} animated />
          </div>
          <h1 className="mt-6 font-brand lowercase text-6xl font-extrabold tracking-tight text-ink-900 dark:text-ink-100">
            {t('app.name')}
          </h1>
          <p className="mt-2 max-w-sm font-brand text-xl font-semibold text-voca-700 dark:text-voca-400">
            {t('app.tagline')}
          </p>
          <p className="mt-4 max-w-sm text-ink-500 dark:text-ink-400">{t('login.subtitle')}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2.5 text-sm font-bold text-ink-700 shadow-soft backdrop-blur dark:bg-ink-800/80 dark:text-ink-200">
              <Headphones size={18} className="text-sky-500" /> Yahya AI
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2.5 text-sm font-bold text-ink-700 shadow-soft backdrop-blur dark:bg-ink-800/80 dark:text-ink-200">
              <Sparkles size={18} className="text-voca-500" /> 16 languages
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-2.5 text-sm font-bold text-ink-700 shadow-soft backdrop-blur dark:bg-ink-800/80 dark:text-ink-200">
              <Globe size={18} className="text-forest-500" /> 16 UI languages
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-sm">
          <div className="card p-6 sm:p-8">
            <h2 className="font-brand text-2xl font-bold text-ink-900 dark:text-ink-100">{t('login.welcome')}</h2>
            <div className="mt-4 flex rounded-2xl bg-ink-50 p-1 dark:bg-ink-900/60">
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${mode === 'signup' ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-700 dark:text-ink-100' : 'text-ink-500 dark:text-ink-400'}`}
              >{t('login.signup')}</button>
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${mode === 'signin' ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-700 dark:text-ink-100' : 'text-ink-500 dark:text-ink-400'}`}
              >{t('login.signin')}</button>
            </div>
            <form onSubmit={submit} className="mt-5 space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-sm font-bold text-ink-600 dark:text-ink-400">{t('login.name')}</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('login.name')} />
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-bold text-ink-600 dark:text-ink-400">{t('login.email')}</label>
                <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-ink-600 dark:text-ink-400">{t('login.password')}</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                {t('login.start')} <ArrowRight size={18} className="rtl:rotate-180" />
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-ink-400 dark:text-ink-500">{t('login.demoNote')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
