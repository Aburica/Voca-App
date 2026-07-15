import { useEffect, useState } from 'react';
import { useApp } from '../store';
import { VocaBird } from './VocaBird';
import { ALL_LANGS } from '../constants';
import { PartyPopper } from 'lucide-react';

export function LevelUpOverlay() {
  const { levelUp, clearLevelUp, t } = useApp();
  const [confetti, setConfetti] = useState<number[]>([]);

  useEffect(() => {
    if (levelUp) {
      setConfetti(Array.from({ length: 40 }, (_, i) => i));
    }
  }, [levelUp]);

  if (!levelUp) return null;
  const langName = ALL_LANGS.find((l) => l.code === levelUp.lang)?.name ?? levelUp.lang;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 0.6;
          const colors = ['#FFC107', '#0EA5E9', '#10B981', '#F43F5E', '#FFB300'];
          const color = colors[i % colors.length];
          const size = 6 + Math.random() * 8;
          return (
            <span
              key={i}
              className="absolute top-0 animate-confetti"
              style={{
                left: `${left}%`,
                width: size,
                height: size * 1.4,
                background: color,
                borderRadius: 2,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="relative card max-w-sm w-full p-8 text-center animate-scaleIn">
        <div className="mx-auto -mt-20 mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-voca-400 shadow-glow">
          <VocaBird size={64} animated />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3 py-1 text-sm font-bold text-forest-700">
          <PartyPopper size={16} />
          {t('levelup.title')}
        </div>
        <h2 className="mt-3 font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">
          {t('levelup.subtitle', { level: levelUp.level, lang: langName })}
        </h2>
        <p className="mt-1 text-ink-500 dark:text-ink-400">{t('levelup.xp', { n: 50 })}</p>

        <div className="mt-5 flex items-center justify-center gap-1.5">
          {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lv) => (
            <span
              key={lv}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                lv === levelUp.level
                  ? 'bg-voca-500 text-ink-900 shadow-pop'
                  : ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(lv) < ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(levelUp.level)
                  ? 'bg-forest-400 text-white'
                  : 'bg-ink-100 text-ink-400 dark:bg-ink-900/60 dark:text-ink-500'
              }`}
            >
              {lv}
            </span>
          ))}
        </div>

        <button onClick={clearLevelUp} className="btn btn-primary mt-6 w-full">
          {t('levelup.continue')}
        </button>
      </div>
    </div>
  );
}
