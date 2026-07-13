import { motion } from "framer-motion";
import { Archive, Clock, FileText, Star, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NoteFilterKey } from "@/types/notes";

interface NotesFilterSidebarProps {
    activeFilter: NoteFilterKey;
    onFilterChange: (filter: NoteFilterKey) => void;
    counts: Record<NoteFilterKey, number>;
}

const filters: Array<{ key: NoteFilterKey; label: string; icon: LucideIcon }> = [
    { key: "all", label: "All Notes", icon: FileText },
    { key: "favorites", label: "Favorites", icon: Star },
    { key: "recent", label: "Recent", icon: Clock },
    { key: "archived", label: "Archived", icon: Archive },
];

export function NotesFilterSidebar({ activeFilter, onFilterChange, counts }: NotesFilterSidebarProps) {
    return (
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:w-52 lg:flex-shrink-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                    <motion.button
                        key={filter.key}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onFilterChange(filter.key)}
                        className={cn(
                            "flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[13px] whitespace-nowrap transition-colors duration-200 lg:w-full",
                            isActive
                                ? "bg-violet-500/10 font-medium text-violet-400"
                                : "text-text-muted hover:bg-white/[0.04] hover:text-text-secondary",
                        )}
                    >
                        <filter.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{filter.label}</span>
                        <span
                            className={cn(
                                "ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                                isActive ? "bg-violet-500/15 text-violet-300" : "bg-white/[0.04] text-text-muted",
                            )}
                        >
                            {counts[filter.key]}
                        </span>
                    </motion.button>
                );
            })}
        </nav>
    );
}