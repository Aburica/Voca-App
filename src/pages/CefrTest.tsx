import { useState, useRef, useMemo } from 'react';
import { useApp } from '../store';
import { buildCefrTest } from '../data';
import { cefrToScore, ALL_LANGS } from '../constants';
import { VocaBird } from '../components/VocaBird';
import {
  ArrowRight, ArrowLeft, Check, Volume2, Mic, ClipboardCheck,
  Headphones, BookOpen, PenLine, MessagesSquare,
} from 'lucide-react';
import type { CefrLevel } from '../types';

const SECTION_META = [
  { key: 'cefr.listening', icon: Headphones, color: 'sky' },
  { key: 'cefr.reading', icon: BookOpen, color: 'voca' },
  { key: 'cefr.writing', icon: PenLine, color: 'forest' },
  { key: 'cefr.speaking', icon: MessagesSquare, color: 'coral' },
] as const;

export function CefrTest() {
  const { state, t, setCefr } = useApp();
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [writing, setWriting] = useState('');
  const [speakingText, setSpeakingText] = useState('');
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<{ score: number; level: CefrLevel } | null>(null);
  // const recRef = useRef<ReturnType<typeof startRecognition> | null>(null);

  const CEFR_TEST_QUESTIONS = useMemo(
    () => buildCefrTest(state.targetLang, state.interfaceLang),
    [state.targetLang, state.interfaceLang],
  );
  const total = CEFR_TEST_QUESTIONS.length;
  const q = CEFR_TEST_QUESTIONS[idx];
  const lang = ALL_LANGS.find((l) => l.code === state.targetLang)!;
  const sectionIdx = Math.floor(idx / 10);

  const recordAnswer = (val: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: val }));
  };

  const goNext = () => {
    if (idx + 1 >= total) {
      let score = 0;
      for (const question of CEFR_TEST_QUESTIONS) {
        const a = answers[question.id] ?? '';
        if (question.section === 'listening' || question.section === 'reading') {
          if (a.trim() === (question.correctAnswer ?? '').trim()) score++;
        } else {
          if (question.section === 'writing' && a.trim().split(/\s+/).filter(Boolean).length >= 6) score++;
          if (question.section === 'speaking' && a.trim().length >= 2) score++;
        }
      }
      const level = cefrToScore(score);
      setResult({ score, level });
      setCefr(level, score);
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null); // clear selection when navigating to next question
    setWriting('');
    setSpeakingText('');
  };

  const goBack = () => {
    if (idx === 0) return;
    setIdx((i) => i - 1);
    const prevQ = CEFR_TEST_QUESTIONS[idx - 1];
    const prevA = answers[prevQ.id] ?? '';
    setSelected(prevQ.options ? prevA : null);
    setWriting(prevQ.section === 'writing' ? prevA : '');
    setSpeakingText(prevQ.section === 'speaking' ? prevA : '');
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="card overflow-hidden">
          <div className="relative bg-gradient-to-br from-sky-500 to-voca-500 p-8 text-center text-white">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #fff 0, transparent 40%)' }} />
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <ClipboardCheck size={40} />
            </div>
            <h1 className="relative mt-4 font-brand text-3xl font-extrabold">{t('cefr.title')}</h1>
            <p className="relative mt-1 text-white/90">{t('cefr.subtitle')}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SECTION_META.map((s) => (
                <div key={s.key} className="rounded-2xl bg-ink-50 p-4 text-center dark:bg-ink-900/60">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${
                    s.color === 'sky' ? 'bg-sky-100 text-sky-600' : s.color === 'voca' ? 'bg-voca-100 text-voca-700' : s.color === 'forest' ? 'bg-forest-100 text-forest-700' : 'bg-coral-100 text-coral-600'
                  }`}>
                    <s.icon size={20} />
                  </div>
                  <p className="mt-2 text-sm font-bold text-ink-700 dark:text-ink-200">{t(s.key)}</p>
                  <p className="text-xs text-ink-400 dark:text-ink-500">10</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStarted(true)} className="btn btn-primary mt-6 w-full">
              {t('cefr.start')} <ArrowRight size={18} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center">
          <div className="mx-auto -mt-16 mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-voca-400 shadow-glow">
            <VocaBird size={64} animated />
          </div>
          <h2 className="font-brand text-2xl font-extrabold text-ink-900 dark:text-ink-100">
            {t('cefr.result', { level: result.level })}
          </h2>
          <p className="mt-2 font-brand text-3xl font-bold text-sky-600 dark:text-sky-400">
            {t('cefr.scoreLine', { score: result.score })}
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lv) => (
              <span key={lv} className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                lv === result.level ? 'bg-voca-500 text-ink-900 shadow-pop' : ['A1','A2','B1','B2','C1','C2'].indexOf(lv) < ['A1','A2','B1','B2','C1','C2'].indexOf(result.level) ? 'bg-forest-400 text-white' : 'bg-ink-100 text-ink-400 dark:bg-ink-900/60 dark:text-ink-500'
              }`}>{lv}</span>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-500 dark:text-ink-400">{t('cefr.saved')}</p>
          <button onClick={() => { setStarted(false); setIdx(0); setAnswers({}); setResult(null); }} className="btn btn-primary mt-6 w-full">
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  // Question prompt in interface language; for reading MCQ, show the word in interface lang
  const promptText = t(q.prompt, { lang: lang.name });

  const chooseOption = (opt: string) => {
    if (!q.options) return;
    setSelected(opt); // single select — replaces any previous
    recordAnswer(opt);
  };

  const playListening = () => {
    if (!q.tts) return;
    setListening(true);
   // speak(q.tts, state.targetLang, () => setListening(false));
  };

  const canProceed = q.options ? !!selected : q.section === 'writing' ? writing.trim().length > 0 : speakingText.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <button onClick={goBack} disabled={idx === 0} className="flex items-center gap-1 text-sm font-bold text-ink-500 hover:text-ink-900 disabled:opacity-30 dark:text-ink-400 dark:hover:text-ink-100">
          <ArrowLeft size={18} className="rtl:rotate-180" /> {t('common.back')}
        </button>
        <div className="flex items-center gap-2">
          {SECTION_META.map((s, i) => (
            <div key={s.key} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              sectionIdx === i ? 'bg-ink-900 text-white' : i < sectionIdx ? 'bg-forest-100 text-forest-700' : 'bg-ink-100 text-ink-400 dark:bg-ink-900/60 dark:text-ink-500'
            }`}>
              <s.icon size={12} />
              <span className="hidden sm:inline">{t(s.key)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="shrink-0 text-sm font-bold text-ink-500 dark:text-ink-400">
          {t('cefr.question', { n: idx + 1 })}
        </span>
        <div className="progress-track flex-1">
          <div className="progress-fill bg-gradient-to-r from-sky-400 to-sky-600" style={{ width: `${(idx / total) * 100}%` }} />
        </div>
      </div>

      <div className="card p-6 dark:bg-ink-800 dark:border-ink-700">
        <h2 className="font-brand text-xl font-bold text-ink-900 dark:text-ink-100">{promptText}</h2>

        {q.section === 'listening' && (
          <button
            onClick={playListening}
            disabled={listening}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 py-4 font-bold text-white hover:bg-sky-600 disabled:opacity-60"
          >
            <Volume2 size={22} className={listening ? 'animate-pulse' : ''} />
            {listening ? t('misc.listening') : t('cefr.play')}
          </button>
      //  

      //  {q.section === 'reading' && q.passage && (
        //  <div className="mt-4 rounded-2xl bg-ink-50 p-4 dark:bg-ink-900/60">
          //  <p className="text-xs font-bold uppercase tracking-wide text-ink-400 dark:text-ink-500">{t('cefr.passage')}</p>
          //  <p className="mt-2 leading-relaxed text-ink-800 dark:text-ink-200">{q.passage}</p>
          // <button onClick={() => speak(q.passage!, state.targetLang)} className="mt-2 flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400">
            //  <Volume2 size={16} /> {t('cefr.replay')}
          //  </button>
        //  </div>
      //  

        {q.options && (
          <div className="mt-5 space-y-3">
            {q.options.map((opt) => {
              const isSel = selected === opt;
              return (
                <button
                  key={opt}
                  onClick={() => { /* chooseOption(opt); */ }}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-start font-bold text-ink-900 transition dark:text-ink-100 ${
                    isSel ? 'border-sky-400 bg-sky-50 dark:bg-sky-900/40' : 'border-ink-100 bg-white hover:border-sky-300 dark:border-ink-700 dark:bg-ink-800 dark:hover:border-sky-600'
                  }`}
                >
                  <span className="text-lg">{opt}</span>
                  {isSel && <Check size={20} className="text-sky-600" />}
                </button>
              );
            })}
          </div>
        )}

        {q.section === 'writing' && (
          <div className="mt-4">
            <textarea
              value={writing}
              onChange={(e) => { setWriting(e.target.value); /* recordAnswer(e.target.value); */ }}
              rows={5}
              className="input resize-none"
              placeholder={t('cefr.typeAnswer', { lang: lang.name })}
            />
            <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">
              {writing.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        )}

        {q.section === 'speaking' && (
          <div className="mt-4 flex flex-col items-center gap-3">
           // <button 
           // onClick={startSpeak}
           //   className="flex h-20 w-20 items-center justify-center rounded-full bg-coral-500 text-white shadow-pop hover:bg-coral-600 transition"
            >
              <Mic size={32} />
            </button>
            {speakingText ? (
              <div className="w-full rounded-2xl bg-forest-50 p-4 dark:bg-forest-900/30">
                <p className="text-xs font-bold uppercase text-forest-700 dark:text-forest-400">{t('misc.speaking')}</p>
                <p className="mt-1 text-ink-800 dark:text-ink-200">{speakingText}</p>
              </div>
            ) : (
              <p className="text-sm text-ink-400 dark:text-ink-500">{t('cefr.speakAnswer', { lang: lang.name })}</p>
          // 
          // !recognitionSupported && 
            //  <p className="text-xs text-coral-500">{t('mic.unsupported')}</p>
          //
          </div>
        )}
      </div>

      <button onClick={goNext} disabled={!canProceed} className="btn btn-primary w-full">
        {idx + 1 >= total ? t('cefr.submit') : t('common.next')}
        <ArrowRight size={16} className="rtl:rotate-180" />
      </button>
    </div>
  );
}
