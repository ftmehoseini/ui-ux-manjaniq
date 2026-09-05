"use client";

import * as React from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastTone = "success" | "info" | "error";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show(message: string, tone?: ToastTone): void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** Confirms that an action landed. Never used for content the user must read. */
export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}

const ICONS: Record<ToastTone, React.ReactNode> = {
  success: <Check className="size-4 text-success" aria-hidden />,
  info: <Info className="size-4 text-info" aria-hidden />,
  error: <TriangleAlert className="size-4 text-danger" aria-hidden />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = React.useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm animate-rise items-center gap-3",
              "rounded-lg border border-line bg-surface px-4 py-3 shadow-md",
            )}
          >
            {ICONS[toast.tone]}
            <p className="t-small min-w-0 flex-1 text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="بستن پیام"
              className="shrink-0 rounded p-1 text-faint transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
