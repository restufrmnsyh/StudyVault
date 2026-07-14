import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    open: boolean;
    icon?: LucideIcon;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Red confirm button for destructive actions (delete, discard). Defaults to true
     *  since that's the more common case for this dialog today. */
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

/**
 * Small centered confirm/cancel modal. Generic on purpose — first used for the Edit Mode
 * "discard unsaved changes?" prompt, but written to also cover future destructive
 * confirmations (e.g. the currently-unconfirmed Delete Note button) instead of relying
 * on the browser's native confirm().
 */
export function ConfirmDialog({
    open,
    icon: Icon = AlertTriangle,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = true,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="confirm-dialog-title"
                        aria-describedby="confirm-dialog-description"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/40"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={cn(
                                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                                    destructive ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400",
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                                <p id="confirm-dialog-title" className="text-[14px] font-semibold text-text-primary">
                                    {title}
                                </p>
                                <p id="confirm-dialog-description" className="mt-1 text-[13px] leading-relaxed text-text-muted">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary"
                            >
                                {cancelLabel}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className={cn(
                                    "rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition-colors",
                                    destructive
                                        ? "bg-rose-500/90 hover:bg-rose-500"
                                        : "bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 hover:shadow-lg hover:shadow-violet-500/20",
                                )}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}