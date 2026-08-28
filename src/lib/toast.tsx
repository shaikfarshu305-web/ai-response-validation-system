import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  title: string;
  body?: string;
  type: ToastType;
}

interface ToastCtx {
  toast: (t: { title: string; body?: string; type?: ToastType }) => void;
}

const Ctx = createContext<ToastCtx | undefined>(undefined);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'border-success-200 bg-success-50 text-success-800 dark:border-success-800/50 dark:bg-success-900/30 dark:text-success-300',
  error: 'border-error-200 bg-error-50 text-error-800 dark:border-error-800/50 dark:bg-error-900/30 dark:text-error-300',
  info: 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-800/50 dark:bg-brand-900/30 dark:text-brand-300',
  warning: 'border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800/50 dark:bg-warning-900/30 dark:text-warning-300',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, body, type = 'info' }: { title: string; body?: string; type?: ToastType }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, title, body, type } as Toast]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 rounded-xl border p-4 shadow-card animate-slide-in ${STYLES[t.type]}`}
              role="alert"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                {t.body && <p className="mt-0.5 text-xs opacity-90">{t.body}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0 rounded-md p-0.5 opacity-60 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
