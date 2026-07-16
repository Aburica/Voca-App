import { useMemo, useState } from 'react';
import { useApp } from '../store';
import { getVocabulary } from '../lib/vocabGen';
import { FLASHCARDS_PER_SESSION } from '../constants';
import { VocaBird } from '../components/VocaBird';
import { Volume2, RotateCcw, Check, X, Info } from 'lucide-react';
import { speak } from '../lib/tts';
import type { WordEntry } from '../types';

export function Flashcards() {
  const { state, t, setView } = useApp();
  const a1Pool = useMemo(() => getVocabulary(state.targetLang).filter((w) => w.level === 'A1'), [state.targetLang]);
  const [session, setSession] = useState<WordEntry[]>(() => {
    const shuffled = [...a1Pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(FLASHCARDS_PER_SESSION, shuffled.length));
  });
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [done, setDone] = useState(false);

  const card = session[idx];

  const restart = () => {
    const reshuffled = [...a1Pool].sort(() => Math.random() - 0.5).slice(0, FLASHCARDS_PER_SESSION);
    setSession(reshuffled);
    setIdx(0);
    setFlipped(false);
    setKnown(0);
    setDone(false);
  };

  const answer = (knew: boolean) => {
    if (knew) setKnown((k) => k + 1);
    if (idx + 1 >= session.length) { setDone(true); return; }
    setIdx((i) => i + 1);
    setFlipped(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center">
          <div className="mx-auto -mt-16 mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-voca-400 shadow-glow">
            <VocaBird size={64} animated />
          </div>
          <h2 className="font-brand text-2xl font-extrabold text-ink-900 dark:text-ink-100">{t('flash.done')}</h2>
          <p className="mt-2 text-ink-500 dark:text-ink-400">{known}/{session.length}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setView('dashboard')} className="btn btn-ghost flex-1">{t('common.back')}</button>
            <button onClick={restart} className="btn btn-primary flex-1">{t('flash.restart')}</button>
          </div>
        </div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{t('flash.title')}</h1>
        <span className="text-sm font-bold text-ink-500 dark:text-ink-400">{idx + 1}/{session.length}</span>
      </div>
      <p className="text-ink-500 dark:text-ink-400">{t('flash.subtitle')}</p>

      <div className="progress-track">
        <div className="progress-fill bg-gradient-to-r from-voca-400 to-voca-600" style={{ width: `${(idx / session.length) * 100}%` }} />
      </div>

      {/* Flip card */}
      <div className="flip-card h-72 cursor-pointer" onClick={() => setFlipped((f) => !f)}>
        <div className={`flip-inner ${flipped ? 'flipped' : ''}`}>
          {/* Front — word in target language */}
          <div className="flip-face card flex flex-col items-center justify-center bg-gradient-to-br from-voca-100 to-voca-200 dark:from-ink-800 dark:to-ink-900 dark:border-ink-700">
            <span className="text-5xl">{card.emoji}</span>
            <h2 className="mt-4 font-brand text-4xl font-extrabold text-ink-900 dark:text-ink-100">{card.word}</h2>
            <span className="mt-2 chip bg-white text-ink-500 dark:bg-ink-800 dark:text-ink-400">{card.level}</span>
            <button onClick={(e) => { e.stopPropagation(); speak(card.word, state.targetLang); }} className="mt-4 flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-bold text-sky-600 dark:bg-ink-800 dark:text-sky-400">
              <Volume2 size={16} /> {t('context.listen')}
            </button>
            <p className="mt-3 text-xs text-ink-400 dark:text-ink-500">{t('flash.tap')}</p>
          </div>
          {/* Back — translation in interface language */}
          <div className="flip-face flip-back card flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 dark:from-ink-800 dark:to-ink-900 dark:border-ink-700">
            <h2 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{card.translations[state.interfaceLang] ?? card.translations.en}</h2>
            <div className="mt-4 w-full rounded-2xl bg-white/70 p-4 text-center dark:bg-ink-800/70">
              <p className="text-xs font-bold uppercase text-ink-400 dark:text-ink-500">{t('context.example')}</p>
              <p className="mt-1 font-semibold text-ink-800 dark:text-ink-200">{card.example}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={() => answer(false)} className="btn btn-danger flex-1">
          <X size={18} /> {t('flash.dontKnow')}
        </button>
        <button onClick={() => answer(true)} className="btn btn-secondary flex-1">
          <Check size={18} /> {t('flash.know')}
        </button>
      </div>
    </div>
  );
}
