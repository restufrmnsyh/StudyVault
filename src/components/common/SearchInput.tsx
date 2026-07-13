import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    ariaLabel,
    className,
}: SearchInputProps) {
    return (
        <div
            className={cn(
                "group flex flex-1 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-text-muted ring-violet-500/15 transition-all duration-200 focus-within:border-violet-500/30 focus-within:bg-white/[0.04] focus-within:ring-4",
                className,
            )}
        >
            <Search className="h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200 group-focus-within:text-violet-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel ?? placeholder}
                className="w-full bg-transparent text-text-secondary outline-none placeholder:text-text-muted"
            />
        </div>
    );
}