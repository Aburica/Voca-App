import { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { generateResponse, welcomeMessage, type ChatMessage } from '../lib/lyoby';
import { ALL_LANGS } from '../constants';
import { Send, Mic, Volume2, Sparkles } from 'lucide-react';
import { speak } from '../lib/tts';
import { startRecognition, recognitionSupported } from '../lib/speech';

export function Chat() {
  const { state, t, useMic, micLeft } = useApp();
  const lang = ALL_LANGS.find((l) => l.code === state.targetLang)!;
  const ifaceLang = ALL_LANGS.find((l) => l.code === state.interfaceLang)!;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<ReturnType<typeof startRecognition> | null>(null);
  const initialized = useRef(false);

  const ctx = {
    interfaceLang: state.interfaceLang,
    targetLang: state.targetLang,
    targetLangName: lang.name,
    interfaceLangName: ifaceLang.name,
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMessages([{ id: 'welcome', role: 'ai', text: welcomeMessage(ctx), timestamp: Date.now() }]);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate Lyoby's response
    const aiText = generateResponse(text, ctx);
    const aiMsg: ChatMessage = { id: `a_${Date.now()}`, role: 'ai', text: aiText, timestamp: Date.now() };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const startMic = () => {
    if (!recognitionSupported()) return;
    if (!useMic()) return;
    recRef.current?.stop();
    setIsListening(true);
    const handle = startRecognition(
      state.targetLang,
      (txt, isFinal) => {
        setInput(txt);
        if (isFinal) {
          setIsListening(false);
        }
      },
      () => {},
      () => setIsListening(false),
    );
    recRef.current = handle;
  };

  const stopMic = () => {
    recRef.current?.stop();
    setIsListening(false);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-2xl flex-col">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-3xl bg-white px-5 py-4 shadow-soft dark:bg-ink-800 dark:shadow-none">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-voca-400">
            <Sparkles size={20} className="text-ink-900" />
          </div>
          <div>
            <h1 className="font-brand text-lg font-bold text-ink-900 dark:text-ink-100">{t('chat.title')}</h1>
            <p className="text-xs text-ink-500 dark:text-ink-400">{t('chat.subtitle')} · {lang.flag} {lang.name}</p>
          </div>
        </div>
        <div className="text-xs text-ink-400 dark:text-ink-500">
          {ifaceLang.flag} UI
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-ink-50/50 px-4 py-5 scrollbar-thin dark:bg-ink-900/40">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`group max-w-[85%] rounded-2xl px-4 py-3 whitespace-pre-line ${
              m.role === 'ai'
                ? 'bg-white text-ink-800 shadow-soft dark:bg-ink-800 dark:text-ink-200 dark:shadow-none'
                : 'bg-sky-500 text-white'
            }`}>
              <p className="leading-relaxed">{m.text}</p>
              {m.role === 'ai' && (
                <button
                  onClick={() => speak(m.text, state.targetLang)}
                  className="mt-2 flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  <Volume2 size={14} /> {t('context.listen')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="rounded-b-3xl bg-white p-3 shadow-soft dark:bg-ink-800 dark:shadow-none">
        <div className="mb-2 flex items-center gap-2">
          <p className="text-xs text-ink-400 dark:text-ink-500">{t('chat.topicHint')}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder={t('chat.placeholder')}
            className="input flex-1"
          />
          {isListening ? (
            <button onClick={stopMic} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-500 text-white animate-pulse">
              <Mic size={20} />
            </button>
          ) : (
            <button
              onClick={startMic}
              disabled={micLeft <= 0 && state.user?.subscription === 'free'}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-100 text-ink-600 hover:bg-voca-100 hover:text-voca-700 disabled:opacity-40 dark:bg-ink-900/60 dark:text-ink-300 dark:hover:bg-voca-900/40 dark:hover:text-voca-300"
            >
              <Mic size={20} />
            </button>
          )}
          <button onClick={send} disabled={!input.trim()} className="btn btn-primary h-11 px-4">
            <Send size={18} className="rtl:rotate-180" />
          </button>
        </div>
        {state.user?.subscription === 'free' && (
          <p className="mt-2 text-center text-xs text-ink-400 dark:text-ink-500">
            {t('settings.micUsageDesc', { n: micLeft })}
          </p>
        )}
      </div>
    </div>
  );
}
