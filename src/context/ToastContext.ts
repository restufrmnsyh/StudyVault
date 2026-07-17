import { createContext } from "react";

export type ToastVariant = "success" | "error";

export interface ToastContextValue {
    /** variant defaults to "success" — every existing call site (`showToast("message")`)
     *  keeps its current green-checkmark look unchanged. */
    showToast: (message: string, variant?: ToastVariant) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);