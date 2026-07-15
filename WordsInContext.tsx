import { useApp } from '../store';
import { getVocabulary } from '../lib/vocabGen';
import { Volume2, BookMarked, ArrowLeft, Layers } from 'lucide-react';
import { speak } from '../lib/tts';

export function WordsInContext() {
  const { state, t, setView, saveWord, removeWord } = useApp();
  const vocab = getVocabulary(state.targetLang).filter((w) => w.level === 'A1');
  const saved = state.progress[state.targetLang]?.wordsSaved ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{t('context.title')}</h1>
          <p className="mt-1 text-ink-500 dark:text-ink-400">{t('context.subtitle')}</p>
        </div>
        <button onClick={() => setView('flashcards')} className="btn btn-ghost">
          <Layers size={18} /> {t('nav.flashcards')}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vocab.map((w) => {
          const isSaved = saved.includes(w.word);
          return (
            <div key={w.word} className="card overflow-hidden">
              <div className="flex items-center gap-3 p-5">
                <span className="text-3xl">{w.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-brand text-2xl font-extrabold text-ink-900 dark:text-ink-100">{w.word}</h3>
                  <span className="chip bg-white text-ink-500 dark:bg-ink-800 dark:text-ink-400">{w.level}</span>
                </div>
                <button onClick={() => speak(w.word, state.targetLang)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-400">
                  <Volume2 size={18} />
                </button>
              </div>
              <div className="px-5">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-400 dark:text-ink-500">{t('context.translation')}</p>
                <p className="mt-1 font-brand text-xl font-bold text-sky-700 dark:text-sky-400">{w.translations[state.interfaceLang] ?? w.translations.en}</p>
              </div>
              <div className="mx-5 mb-5 mt-3 rounded-2xl bg-ink-50 p-4 dark:bg-ink-900/60">
                <p className="text-xs font-bold uppercase text-ink-400 dark:text-ink-500">{t('context.example')}</p>
                <p className="mt-1 font-semibold leading-relaxed text-ink-800 dark:text-ink-200">{w.example}</p>
              </div>
              <div className="border-t border-ink-100 dark:border-ink-700 px-5 py-3">
                <button
                  onClick={() => isSaved ? removeWord(w.word) : saveWord(w.word)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition ${isSaved ? 'bg-forest-100 text-forest-700' : 'bg-ink-50 text-ink-600 hover:bg-voca-100 hover:text-voca-700 dark:bg-ink-900/60 dark:text-ink-300 dark:hover:bg-voca-900/40 dark:hover:text-voca-300'}`}
                >
                  <BookMarked size={16} /> {isSaved ? t('lesson.saved') : t('lesson.saveWord')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
