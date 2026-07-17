import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ToastContext, type ToastContextValue, type ToastVariant } from "@/context/ToastContext";

interface ToastItem {
    id: string;
    message: string;
    variant: ToastVariant;
}

const TOAST_DURATION_MS = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts((prev) => [...prev, { id, message, variant }]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, TOAST_DURATION_MS);
    }, []);

    const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Fixed toast stack — pointer-events-none on the wrapper so it never blocks
       *  clicks on the page beneath it; each toast re-enables events for itself. */}
            <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end sm:px-0">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                            className="pointer-events-auto flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-[13px] font-medium text-text-primary shadow-lg shadow-black/30"
                        >
                            {toast.variant === "error" ? (
                                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                            )}
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}