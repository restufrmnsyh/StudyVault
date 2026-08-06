import type { LucideIcon } from "lucide-react";

interface EmptyStateAction {
    label: string;
    onClick: () => void;
}

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    /** Optional call-to-action rendered below the description. */
    action?: EmptyStateAction;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03]">
                <Icon className="h-5 w-5 text-text-muted" />
            </div>
            <p className="text-[13px] font-medium text-text-primary">{title}</p>
            <p className="mt-1 text-[12px] text-text-muted">{description}</p>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-4 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-[13px] font-medium text-violet-400 transition-colors hover:bg-violet-500/20"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
