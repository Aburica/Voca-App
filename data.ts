import { getVocabulary, translateWord, reverseLookup } from './lib/vocabGen';
import type { Lesson, CefrTestQuestion, LangCode, WordEntry, LessonQuestion } from './types';
import { getListeningDialogues } from './lib/listeningDialogues';

export function vocabularyFor(lang: LangCode): WordEntry[] {
  return getVocabulary(lang);
}

// Build lessons for a given learning language.
//
// CRITICAL LOGIC — The "inverted bilingual" MCQ:
//   - The prompt asks "What does '{word in interface lang}' mean?"
//   - The answer options are in the TARGET (learning) language
//
// So the user sees a word they understand (in their interface language) and
// must pick the correct translation in the language they are learning.
// This avoids the old bug where the prompt contained the answer.
export function lessonsFor(targetLang: LangCode, interfaceLang: LangCode): Lesson[] {
  const pool = getVocabulary(targetLang).filter((w) => w.level === 'A1');

  function makeQ(entry: WordEntry, distractorEntries: WordEntry[], idx: number): LessonQuestion {
    // wordInInterfaceLang = the meaning of this word in the interface language
    const wordInInterfaceLang = entry.translations[interfaceLang] ?? entry.translations.en ?? entry.word;

    // correctAnswer + options are all in the TARGET language
    const correct = entry.word;
    const distractors = distractorEntries.map((d) => d.word).filter((w) => w !== correct).slice(0, 2);
    const options = shuffle([correct, ...distractors]);

    return {
      prompt: 'quiz.meaning',
      word: correct,
      wordInInterfaceLang,
      options,
      correctAnswer: correct,
    };
  }

  const sample = pool.slice(0, 8);
  const distractorPool = pool.slice(8, 20);
  if (distractorPool.length < 2) distractorPool.push(...pool.slice(0, 4));

  const q1 = sample.slice(0, 5).map((w, i) => makeQ(w, [distractorPool[i * 2], distractorPool[i * 2 + 1]].filter(Boolean), i));
  const q2 = sample.slice(5, 8).map((w, i) => makeQ(w, [distractorPool[(i + 5) * 2], distractorPool[(i + 5) * 2 + 1]].filter(Boolean), i + 5));
  if (q2.length === 0) q2.push(makeQ(sample[0], [distractorPool[0], distractorPool[1]], 0));

  return [
    { id: `${targetLang}-a1-1`, titleKey: 'lesson.basics', level: 'A1', xp: 15, questions: q1 },
    { id: `${targetLang}-a1-2`, titleKey: 'lesson.everyday', level: 'A1', xp: 20, questions: q2 },
  ];
}

// 40-question CEFR test: 10 listening, 10 reading, 10 writing, 10 speaking.
// Listening: realistic dialogue TTS + comprehension MCQ (options in target lang).
// Reading: passage + comprehension MCQ (options in target lang).
// Writing/speaking: open-ended prompts (i18n keys → interface language).
export function buildCefrTest(targetLang: LangCode, interfaceLang: LangCode): CefrTestQuestion[] {
  const pool = getVocabulary(targetLang).filter((w) => w.level === 'A1').slice(0, 10);
  const words = pool.map((w) => w.word);
  const examples = pool.map((w) => w.example);
  const dialogues = getListeningDialogues(targetLang);

  function threeOpts(correct: string, d1: string, d2: string): string[] {
    return shuffle([correct, d1, d2]);
  }

  const questions: CefrTestQuestion[] = [];

  // 10 listening questions with realistic dialogues
  for (let i = 0; i < 10; i++) {
    const dlg = dialogues[i % dialogues.length];
    questions.push({
      id: i + 1,
      section: 'listening',
      tts: dlg.tts,
      prompt: `cefr.listen.q${i + 1}`,
      options: threeOpts(dlg.answer, dlg.distractors[0], dlg.distractors[1]),
      correctAnswer: dlg.answer,
    });
  }

  // 10 reading questions
  for (let i = 0; i < 10; i++) {
    const idx = i % words.length;
    const entry = pool[idx];
    const wordInInterfaceLang = entry.translations[interfaceLang] ?? entry.translations.en ?? entry.word;
    questions.push({
      id: 11 + i,
      section: 'reading',
      prompt: `cefr.read.q${i + 1}`,
      passage: examples[idx],
      wordInInterfaceLang,
      options: threeOpts(words[idx], words[(idx + 3) % words.length], words[(idx + 6) % words.length]),
      correctAnswer: words[idx],
    });
  }

  // 10 writing questions
  for (let i = 0; i < 10; i++) {
    questions.push({ id: 21 + i, section: 'writing', prompt: `cefr.write.q${i + 1}` });
  }

  // 10 speaking questions
  for (let i = 0; i < 10; i++) {
    questions.push({ id: 31 + i, section: 'speaking', prompt: `cefr.speak.q${i + 1}` });
  }

  return questions;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
