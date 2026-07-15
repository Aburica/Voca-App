import { useMemo, useState } from 'react';
import { useApp } from '../store';
import { lessonsFor } from '../data';
import { ALL_LANGS } from '../constants';
import { VocaBird } from '../components/VocaBird';
import { ArrowRight, ArrowLeft, Check, X, CheckCircle2, Lock, BookMarked, Volume2 } from 'lucide-react';
import { speak } from '../lib/tts';
import type { Lesson, LessonQuestion } from '../types';

export function Lessons() {
  const { state, t, setView } = useApp();
  const lessons = useMemo(() => lessonsFor(state.targetLang, state.interfaceLang), [state.targetLang, state.interfaceLang]);
  const [active, setActive] = useState<Lesson | null>(null);

  if (active) {
    return <QuizRunner lesson={active} onExit={() => setActive(null)} />;
  }

  const lang = ALL_LANGS.find((l) => l.code === state.targetLang)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{t('nav.lessons')}</h1>
        <p className="mt-1 text-ink-500 dark:text-ink-400">{lang.flag} {lang.name} · {t('app.tagline')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, i) => {
          const done = state.progress[state.targetLang]?.completedLessons.includes(lesson.id);
          return (
            <div key={lesson.id} className="card relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-pop">
              <div className="absolute -top-8 -end-8 h-24 w-24 rounded-full bg-voca-100/60 dark:bg-voca-900/30" />
              <div className="relative flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-voca-400 text-2xl font-brand font-bold text-ink-900 shadow-inner-3px">{i + 1}</div>
                {done ? (
                  <span className="chip bg-forest-100 text-forest-700"><CheckCircle2 size={14} /> {t('common.completed')}</span>
                ) : (
                  <span className="chip bg-sky-100 text-sky-700">{lesson.level}</span>
                )}
              </div>
              <h3 className="relative mt-4 font-brand text-xl font-bold text-ink-900 dark:text-ink-100">{t(lesson.titleKey)}</h3>
              <p className="relative mt-1 text-sm text-ink-500 dark:text-ink-400">{lesson.questions.length} {t('nav.lessons')} · +{lesson.xp} {t('common.xp')}</p>
              <button onClick={() => setActive(lesson)} className="btn btn-primary mt-4 w-full">
                {t('common.start')} <ArrowRight size={16} className="rtl:rotate-180" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuizRunner({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const { state, t, completeLesson, saveWord } = useApp();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  const q = lesson.questions[qIdx];
  const total = lesson.questions.length;
  const lang = ALL_LANGS.find((l) => l.code === state.targetLang)!;

  // CRITICAL: prompt shows the word in the INTERFACE language
  // options are in the TARGET (learning) language
  const promptText = t(q.prompt, { word: q.wordInInterfaceLang });

  const choose = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === q.correctAnswer) setScore((s) => s + 1);
  };

  const next = () => {
    if (qIdx + 1 >= total) {
      completeLesson(lesson.id, lesson.xp);
      setFinished(true);
      return;
    }
    setQIdx((i) => i + 1);
    setSelected(null); // clear selection on next question
    setAnswered(false);
  };

  const toggleSave = (word: string) => {
    const next = new Set(savedWords);
    if (next.has(word)) next.delete(word);
    else { next.add(word); saveWord(word); }
    setSavedWords(next);
  };

  if (finished) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center">
          <div className="mx-auto -mt-16 mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-voca-400 shadow-glow">
            <VocaBird size={64} animated />
          </div>
          <h2 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{t('lesson.complete')}</h2>
          <p className="mt-2 font-brand text-2xl font-bold text-voca-700 dark:text-voca-400">{t('lesson.score', { n: score, total })}</p>
          <p className="mt-1 text-ink-500 dark:text-ink-400">{t('lesson.xpEarned', { n: lesson.xp })}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={onExit} className="btn btn-ghost flex-1">{t('lesson.backToLessons')}</button>
            <button onClick={() => { setQIdx(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false); }} className="btn btn-primary flex-1">
              {t('lesson.restart')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="flex items-center gap-1 text-sm font-bold text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100">
          <ArrowLeft size={18} className="rtl:rotate-180" /> {t('common.back')}
        </button>
        <span className="text-sm font-bold text-ink-500 dark:text-ink-400">{t('lesson.question', { n: qIdx + 1, total })}</span>
      </div>

      <div className="progress-track">
        <div className="progress-fill bg-gradient-to-r from-voca-400 to-voca-600" style={{ width: `${((qIdx) / total) * 100}%` }} />
      </div>

      <div className="card p-6 dark:bg-ink-800 dark:border-ink-700">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-brand text-2xl font-bold text-ink-900 dark:text-ink-100">{promptText}</h2>
          <button onClick={() => speak(q.correctAnswer, state.targetLang)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-400">
            <Volume2 size={20} />
          </button>
        </div>

        <p className="mb-4 mt-2 text-sm text-ink-400 dark:text-ink-500">{t('quiz.select')}</p>

        <div className="space-y-3">
          {q.options.map((option) => {
            const isSelected = selected === option;
            const isCorrect = option === q.correctAnswer;
            let cls = 'border-ink-100 hover:border-sky-300 bg-white dark:border-ink-700 dark:bg-ink-800 dark:hover:border-sky-600';
            if (answered) {
              if (isCorrect) cls = 'border-forest-400 bg-forest-50 dark:bg-forest-900/30';
              else if (isSelected) cls = 'border-coral-400 bg-coral-50 dark:bg-coral-900/30';
              else cls = 'border-ink-100 bg-white opacity-60 dark:border-ink-700 dark:bg-ink-800';
            } else if (isSelected) {
              cls = 'border-sky-400 bg-sky-50 dark:bg-sky-900/40';
            }
            return (
              <button key={option} onClick={() => choose(option)} disabled={answered} className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-start font-bold text-ink-900 transition dark:text-ink-100 ${cls}`}>
                <span className="text-lg">{option}</span>
                {answered && isCorrect && <Check size={22} className="text-forest-600" />}
                {answered && isSelected && !isCorrect && <X size={22} className="text-coral-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className="card animate-slideUp p-5">
          <div className="flex items-center gap-3">
            {selected === q.correctAnswer ? (
              <div className="flex items-center gap-2 font-bold text-forest-700"><CheckCircle2 size={22} /> {t('common.correct')}</div>
            ) : (
              <div className="flex items-center gap-2 font-bold text-coral-600"><X size={22} /> {t('common.wrong')}: {q.correctAnswer}</div>
            )}
            <button onClick={() => toggleSave(q.word)} className={`ms-auto flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${savedWords.has(q.word) ? 'bg-forest-100 text-forest-700' : 'bg-ink-50 text-ink-600 hover:bg-ink-100 dark:bg-ink-900/60 dark:text-ink-300 dark:hover:bg-ink-700'}`}>
              <BookMarked size={16} /> {savedWords.has(q.word) ? t('lesson.saved') : t('lesson.saveWord')}
            </button>
          </div>
          <button onClick={next} className="btn btn-primary mt-4 w-full">
            {qIdx + 1 >= total ? t('lesson.complete') : t('lesson.nextQuestion')} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
