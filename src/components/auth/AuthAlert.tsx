import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthAlertProps {
    variant: "error" | "success";
    children: string;
}

const variantConfig: Record<AuthAlertProps["variant"], { icon: LucideIcon; className: string }> = {
    error: { icon: AlertCircle, className: "border-rose-500/20 bg-rose-500/[0.06] text-rose-400" },
    success: { icon: CheckCircle2, className: "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400" },
};

/** Same rose/emerald tokens used elsewhere for destructive/success states (ConfirmDialog,
 *  toasts) — reused here instead of introducing new alert colors for auth forms. */
export function AuthAlert({ variant, children }: AuthAlertProps) {
    const { icon: Icon, className } = variantConfig[variant];
    return (
        <div className={cn("mb-4 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[12.5px] leading-relaxed", className)}>
            <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <span>{children}</span>
        </div>
    );
}