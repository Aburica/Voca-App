import { useApp } from '../store';
import { VocaBird } from '../components/VocaBird';
import { Flame, Trophy, BookOpen, Layers, Languages, MessageCircle, ClipboardCheck, Clock, ArrowRight, Headphones } from 'lucide-react';
import { ALL_LANGS, levelFromHours } from '../constants';
import type { View } from '../types';

export function Dashboard() {
  const { state, t, setView, setTargetLang } = useApp();
  const p = state.progress[state.targetLang]!;
  const lang = ALL_LANGS.find((l) => l.code === state.targetLang)!;
  const hours = p.totalSeconds / 3600;
  const cefrLevel = levelFromHours(hours);
  const dailyGoalPct = Math.min(100, ((p.totalSeconds % 1800) / 1800) * 100);

  const cards: { view: View; titleKey: string; descKey: string; icon: typeof BookOpen; color: string }[] = [
    { view: 'lessons', titleKey: 'nav.lessons', descKey: 'lesson.basics', icon: BookOpen, color: 'bg-sky-100 text-sky-700' },
    { view: 'flashcards', titleKey: 'nav.flashcards', descKey: 'flash.subtitle', icon: Layers, color: 'bg-voca-100 text-voca-700' },
    { view: 'context', titleKey: 'nav.context', descKey: 'context.subtitle', icon: Languages, color: 'bg-forest-100 text-forest-700' },
    { view: 'chat', titleKey: 'nav.chat', descKey: 'chat.subtitle', icon: MessageCircle, color: 'bg-coral-100 text-coral-600' },
    { view: 'cefr-test', titleKey: 'nav.cefr', descKey: 'cefr.subtitle', icon: ClipboardCheck, color: 'bg-sky-100 text-sky-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">
            {t('dash.greeting', { name: state.user?.name ?? '' })}
          </h1>
          <p className="mt-1 text-ink-500 dark:text-ink-400">{t('dash.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-soft dark:bg-ink-800 dark:shadow-none">
          <Flame size={20} className="text-coral-500" />
          <span className="font-bold text-ink-900 dark:text-ink-100">7</span>
          <span className="text-sm text-ink-500 dark:text-ink-400">{t('dash.streak')}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={<Clock size={20} />} label={t('common.hours')} value={hours.toFixed(1)} unit="" color="sky" />
        <StatCard icon={<Trophy size={20} />} label={t('common.xp')} value={String(p.xp)} unit="" color="voca" />
        <StatCard icon={<ClipboardCheck size={20} />} label="CEFR" value={cefrLevel} unit="" color="forest" />
        <StatCard icon={<BookOpen size={20} />} label={t('nav.lessons')} value={String(p.completedLessons.length)} unit="" color="coral" />
      </div>

      {/* Daily goal */}
      <div className="card p-5">
        <p className="mb-3 font-brand text-lg font-bold text-ink-900 dark:text-ink-100">{t('dash.dailyGoal')}</p>
        <div className="progress-track">
          <div className="progress-fill bg-gradient-to-r from-voca-400 to-voca-600" style={{ width: `${dailyGoalPct}%` }} />
        </div>
        <span className="mt-2 inline-block text-sm font-bold text-ink-500 dark:text-ink-400">{Math.round(dailyGoalPct)}%</span>
      </div>

      {/* Start learning cards */}
      <div>
        <h2 className="section-title mb-3">{t('dash.startLearning')}</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">{lang.flag} {lang.name}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <button key={card.view} onClick={() => setView(card.view)} className="card p-5 text-start transition hover:-translate-y-1 hover:shadow-pop">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.color}`}>
                <card.icon size={28} />
              </div>
              <p className="mt-3 font-brand text-lg font-bold text-ink-900 dark:text-ink-100">{t(card.titleKey)}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{t(card.descKey)}</p>
              <div className="mt-3 flex items-center gap-1 text-sm font-bold text-sky-600 dark:text-sky-400">
                {t('common.start')} <ArrowRight size={16} className="rtl:rotate-180" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick language switch */}
      <div className="card p-5">
        <h2 className="section-title mb-3">{t('dash.switchLang')}</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_LANGS.map((l) => {
            const active = state.targetLang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setTargetLang(l.code)}
                className={`chip border-2 transition ${active ? 'border-voca-400 bg-voca-50 text-voca-800' : 'border-ink-100 text-ink-600 hover:border-sky-300 dark:border-ink-700 dark:text-ink-300 dark:hover:border-sky-600'}`}
              >
                <span className="text-base">{l.flag}</span> {l.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, color }: { icon: React.ReactNode; label: string; value: string; unit: string; color: string }) {
  const colors: Record<string, string> = {
    sky: 'bg-sky-100 text-sky-700', voca: 'bg-voca-100 text-voca-700',
    forest: 'bg-forest-100 text-forest-700', coral: 'bg-coral-100 text-coral-600',
  };
  return (
    <div className="card p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>{icon}</div>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink-400 dark:text-ink-500">{label}</p>
      <p className="mt-0.5 font-brand text-2xl font-extrabold text-ink-900 dark:text-ink-100">
        {value}<span className="ms-1 text-sm font-bold text-ink-400 dark:text-ink-500">{unit}</span>
      </p>
    </div>
  );
}
