import { type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    /** Optional right-aligned element in the label row — used for the "Forgot
     *  password?" link next to the password field on LoginPage. */
    labelAction?: ReactNode;
}

/** Same input chrome as the app's other form fields (NoteDetailPage / TaskDetailPage
 *  Edit Mode) — kept as one small reusable component here since three auth pages share
 *  an email field and two share a password field. */
export function AuthField({ label, id, labelAction, className, ...inputProps }: AuthFieldProps) {
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor={id} className="text-[12px] font-medium text-text-muted">
                    {label}
                </label>
                {labelAction}
            </div>
            <input
                id={id}
                className={cn(
                    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[14px] text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4",
                    className,
                )}
                {...inputProps}
            />
        </div>
    );
}