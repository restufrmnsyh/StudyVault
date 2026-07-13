import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
    icon: LucideIcon;
    title: string;
    action?: {
        label: string;
        onClick?: () => void;
    };
    children: ReactNode;
    className?: string;
}

export function SectionCard({ icon: Icon, title, action, children, className }: SectionCardProps) {
    return (
        <div className={cn("rounded-2xl border border-zinc-800 bg-zinc-900", className)}>
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-text-muted">
                    <Icon className="h-3.5 w-3.5" />
                    {title}
                </div>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-[12px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                        {action.label}
                    </button>
                )}
            </div>
            {children}
        </div>
    );
}
