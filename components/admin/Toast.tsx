"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type ToastVariant = "error" | "success";

interface ToastItem {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    error: (message: string) => void;
    success: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 6000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const nextId = useRef(0);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (message: string, variant: ToastVariant) => {
            const id = nextId.current++;
            setToasts((prev) => [...prev, { id, message, variant }]);
            setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
        },
        [dismiss]
    );

    const value: ToastContextValue = {
        error: (message) => push(message, "error"),
        success: (message) => push(message, "success"),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-4 right-4 z-100 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        role="alert"
                        className={`pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm ${
                            toast.variant === "error"
                                ? "bg-red-50 border-red-200 text-red-700"
                                : "bg-green-50 border-green-200 text-green-700"
                        }`}
                    >
                        <span className="flex-1">{toast.message}</span>
                        <button
                            type="button"
                            onClick={() => dismiss(toast.id)}
                            aria-label="Dismiss"
                            className="shrink-0 opacity-60 hover:opacity-100"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}
