import type { LucideIcon } from "lucide-react";

interface ListRowProps {
    title: string;
    subtitle: string;
    trailing?: string;
    icon?: LucideIcon;
    onClick?: () => void;
}

export function ListRow({ title, subtitle, trailing, icon: Icon, onClick }: ListRowProps) {
    return (
        <button
            onClick={onClick}
            className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.03]"
        >
            {Icon && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-text-muted transition-colors duration-200 group-hover:text-violet-400">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-text-primary transition-colors group-hover:text-violet-400">
                    {title}
                </p>
                <p className="mt-1 text-[11px] text-text-muted">{subtitle}</p>
            </div>
            {trailing && (
                <span className="ml-4 flex-shrink-0 text-[11px] text-text-muted transition-transform duration-200 group-hover:-translate-x-0.5">
                    {trailing}
                </span>
            )}
        </button>
    );
}
