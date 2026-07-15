import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useApp } from '../store';
import { AD_DURATION_SECONDS } from '../constants';
import { VocaBird } from './VocaBird';

// Fullscreen, unskippable mock ad overlay with a 30s countdown. The close
// button is hidden until the timer reaches 0. Active learning is paused while
// visible (handled by the background timer in the store).
export function AdOverlay() {
  const { adVisible, t, setView, closeAd } = useApp();
  const [remaining, setRemaining] = useState(AD_DURATION_SECONDS);

  useEffect(() => {
    if (!adVisible) {
      setRemaining(AD_DURATION_SECONDS);
      return;
    }
    setRemaining(AD_DURATION_SECONDS);
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [adVisible]);

  if (!adVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/80 backdrop-blur-sm animate-fadeIn p-4">
      <div className="relative w-full max-w-2xl card overflow-hidden animate-scaleIn">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-ink-900 px-5 py-3 text-white">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">
            {t('ad.title')}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold opacity-70">
              {remaining > 0 ? t('ad.skipSoon', { n: remaining }) : t('ad.close')}
            </span>
            {remaining === 0 && (
              <button
                onClick={() => closeAd()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
                aria-label={t('ad.close')}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Ad creative (mock) */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-sky-500 via-sky-600 to-voca-500 flex flex-col items-center justify-center text-white p-8 text-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 0, transparent 40%), radial-gradient(circle at 80% 70%, #fff 0, transparent 35%)' }} />
          <Sparkles className="mb-3 animate-floaty" size={40} />
          <h3 className="font-brand text-3xl font-extrabold">LinguaPro Headphones</h3>
          <p className="mt-2 max-w-md text-white/90">
            Hear every word in crystal clarity. The perfect companion for your language journey.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
            <VocaBird size={24} />
            Sponsored by voca partners
          </div>

          {/* Countdown ring */}
          <div className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-900/40 backdrop-blur">
            <span className="font-brand text-xl font-bold">{remaining}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 bg-ink-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-ink-800">
          <p className="text-sm text-ink-500 dark:text-ink-400">{t('ad.freeNote')}</p>
          <button
            onClick={() => {
              closeAd();
              setView('subscriptions');
            }}
            className="btn btn-primary text-sm"
          >
            {t('ad.upgrade')}
          </button>
        </div>
      </div>
    </div>
  );
}
