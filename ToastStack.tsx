import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../store';

export function ToastStack() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info;
        const color =
          toast.type === 'success'
            ? 'bg-forest-500 text-white'
            : toast.type === 'error'
            ? 'bg-coral-500 text-white'
            : 'bg-ink-900 text-white';
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-2xl px-4 py-3 shadow-pop animate-slideUp ${color}`}
          >
            <Icon size={18} />
            <span className="text-sm font-semibold">{toast.text}</span>
            <button onClick={() => dismissToast(toast.id)} className="opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
