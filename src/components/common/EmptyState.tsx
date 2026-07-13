import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.03]">
                <Icon className="h-5 w-5 text-text-muted" />
            </div>
            <p className="text-[13px] font-medium text-text-primary">{title}</p>
            <p className="mt-1 text-[12px] text-text-muted">{description}</p>
        </div>
    );
}
