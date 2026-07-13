import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListRowProps {
    title: string;
    subtitle: string;
    trailing?: string;
    icon?: LucideIcon;
    onClick?: () => void;
    /**
     * Optional trailing action buttons (e.g. Preview/Download). When provided, the row
     * renders as a <div> instead of a <button> — nested <button> elements are invalid
     * HTML — and `onClick` is ignored, since the actions themselves are the click targets.
     */
    actions?: ReactNode;
}

export function ListRow({ title, subtitle, trailing, icon: Icon, onClick, actions }: ListRowProps) {
    const content = (
        <>
            {Icon && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-text-muted transition-colors duration-200 group-hover:text-violet-400">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-text-primary transition-colors group-hover:text-violet-400">
                    {title}
                </p>
                <p className="mt-1 truncate text-[11px] text-text-muted">{subtitle}</p>
            </div>
            {trailing && (
                <span
                    className={cn(
                        "ml-2 flex-shrink-0 text-[11px] text-text-muted transition-transform duration-200 group-hover:-translate-x-0.5",
                        actions && "hidden sm:inline",
                    )}
                >
                    {trailing}
                </span>
            )}
            {actions && <div className="ml-2 flex flex-shrink-0 items-center gap-1.5">{actions}</div>}
        </>
    );

    if (actions) {
        return (
            <div className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.03]">
                {content}
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.03]"
        >
            {content}
        </button>
    );
}
