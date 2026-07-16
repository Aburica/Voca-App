import { useState } from 'react';
import { useApp } from '../store';
import { TIER_INFO, BILLING_LABELS } from '../constants';
import { Check, Crown, X } from 'lucide-react';
import type { SubscriptionTier, BillingCycle } from '../types';

export function Subscriptions() {
  const { state, t, setSubscription } = useApp();
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [checkout, setCheckout] = useState<SubscriptionTier | null>(null);
  const [success, setSuccess] = useState<SubscriptionTier | null>(null);
  const currentTier = state.user?.subscription ?? 'free';

  const tiers: SubscriptionTier[] = ['free', 'explorer', 'builder', 'professional'];

  const colorClasses: Record<string, string> = {
    ink: 'border-ink-200 dark:border-ink-700', sky: 'border-sky-300 dark:border-sky-700',
    voca: 'border-voca-300 dark:border-voca-700', forest: 'border-forest-300 dark:border-forest-700',
  };
  const btnClass: Record<string, string> = {
    ink: 'bg-ink-500 text-white hover:bg-ink-600', sky: 'bg-sky-500 text-white hover:bg-sky-600',
    voca: 'bg-voca-500 text-ink-900 hover:bg-voca-600', forest: 'bg-forest-500 text-white hover:bg-forest-600',
  };

  const confirmPay = () => {
    if (!checkout) return;
    setSubscription(checkout, cycle);
    setSuccess(checkout);
    setCheckout(null);
  };

  if (success) {
    const tier = TIER_INFO[success];
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-8 text-center">
          <div className="mx-auto -mt-16 mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-forest-400 shadow-glow">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="mt-4 font-brand text-2xl font-bold text-ink-900 dark:text-ink-100">{t('subs.success', { plan: t(tier.nameKey) })}</h2>
          <p className="mt-2 text-ink-500 dark:text-ink-400">{t('subs.successDesc')}</p>
          <button onClick={() => setSuccess(null)} className="btn btn-primary mt-6 w-full">{t('common.close')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-brand text-3xl font-extrabold text-ink-900 dark:text-ink-100">{t('subs.title')}</h1>
        <p className="mt-1 text-ink-500 dark:text-ink-400">{t('subs.subtitle')}</p>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex rounded-2xl bg-ink-50 p-1 dark:bg-ink-900/60">
        {(Object.keys(BILLING_LABELS) as BillingCycle[]).map((c) => (
          <button key={c} onClick={() => setCycle(c)}
            className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${cycle === c ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-700 dark:text-ink-100' : 'text-ink-500 dark:text-ink-400'}`}>
            {t(BILLING_LABELS[c].key)}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tierId) => {
          const info = TIER_INFO[tierId];
          const isCurrent = currentTier === tierId;
          return (
            <div key={tierId} className={`card border-2 p-6 ${colorClasses[info.color]} ${tierId === 'builder' ? 'ring-2 ring-voca-400' : ''}`}>
              {tierId === 'builder' && (
                <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-voca-100 px-3 py-1 text-xs font-bold text-voca-700">
                  <Crown size={12} /> Best Value
                </div>
              )}
              <h3 className="mt-4 font-brand text-xl font-bold text-ink-900 dark:text-ink-100">{t(info.nameKey)}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">{info.levels}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-brand text-4xl font-extrabold text-ink-900 dark:text-ink-100">${info[cycle].toFixed(2)}</span>
                <span className="text-sm font-bold text-ink-400 dark:text-ink-500">{t('subs.perMonth')}</span>
              </div>
              <p className="text-xs text-ink-400 dark:text-ink-500">{t('subs.billed', { cycle: t(BILLING_LABELS[cycle].key) })}</p>
              <ul className="mt-5 space-y-2">
                {info.featuresKey.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-forest-500" /> {t(f)}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => tierId === 'free' ? null : setCheckout(tierId)}
                disabled={isCurrent || tierId === 'free'}
                className={`mt-6 w-full rounded-2xl py-3 text-sm font-bold transition ${isCurrent ? 'bg-ink-100 text-ink-400 dark:bg-ink-900/60 dark:text-ink-500' : btnClass[info.color]} disabled:cursor-not-allowed`}
              >
                {isCurrent ? t('common.completed') : t('subs.choose', { plan: t(info.nameKey) })}
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout modal */}
      {checkout && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm animate-fadeIn" onClick={() => setCheckout(null)}>
          <div className="card w-full max-w-md p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-brand text-xl font-bold text-ink-900 dark:text-ink-100">{t('subs.checkout')}</h3>
                <p className="text-sm text-ink-500 dark:text-ink-400">
                  {t(TIER_INFO[checkout].nameKey)} · {t(BILLING_LABELS[cycle].key)}
                </p>
              </div>
              <button onClick={() => setCheckout(null)} className="flex h-8 w-8 items-center justify-center rounded-xl text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 dark:bg-ink-900/60">
              <span className="font-bold text-ink-700 dark:text-ink-200">{t('subs.confirm')}</span>
              <span className="font-brand text-2xl font-extrabold text-ink-900 dark:text-ink-100">${TIER_INFO[checkout][cycle].toFixed(2)}</span>
            </div>
            <p className="mt-3 text-center text-xs text-ink-400 dark:text-ink-500">{t('subs.demoPayment')}</p>
            <button onClick={confirmPay} className="btn btn-primary mt-4 w-full">{t('subs.confirm')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
