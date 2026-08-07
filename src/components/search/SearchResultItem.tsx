import { motion } from "framer-motion";
import { Star, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types/search";
import { highlightMatches } from "@/utils/highlight.utils";

interface SearchResultItemProps {
    result: SearchResult;
    onClick: (href: string) => void;
    selected?: boolean;
    query?: string;
}

/**
 * Individual search result row.
 * Displays type-specific icon, title, subtitle, and optional metadata.
 * Highlights matching keywords in title and preview.
 * Keyboard navigable and clickable.
 */
export function SearchResultItem({ result, onClick, selected = false, query = "" }: SearchResultItemProps) {
    const Icon = result.icon;

    function handleClick() {
        onClick(result.href);
    }

    // Highlight title matches
    const titleSegments = highlightMatches(result.title, query);
    // Highlight preview matches
    const previewSegments = result.preview ? highlightMatches(result.preview, query) : [];

    return (
        <motion.button
            type="button"
            onClick={handleClick}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                selected
                    ? "bg-violet-500/10 ring-2 ring-violet-500/30"
                    : "hover:bg-white/[0.04] focus-visible:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30",
            )}
        >
            {/* Icon with type-specific styling */}
            <div
                className={cn(
                    "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                    result.type === "course" && "bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20",
                    result.type === "note" && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
                    result.type === "material" && "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
                    result.type === "task" && "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20",
                )}
            >
                <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[13.5px] font-medium text-text-primary group-hover:text-white">
                        {titleSegments.map((segment, i) => (
                            <span
                                key={i}
                                className={segment.highlight ? "bg-violet-400/20 text-violet-300" : ""}
                            >
                                {segment.text}
                            </span>
                        ))}
                    </p>

                    {/* Type-specific badges */}
                    {result.type === "note" && "favorite" in result && result.favorite && (
                        <Star className="h-3.5 w-3.5 flex-shrink-0 fill-amber-400 text-amber-400" />
                    )}
                    {result.type === "task" && "completed" in result && result.completed && (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                    )}
                    {result.type === "task" &&
                        "overdueStatus" in result &&
                        result.overdueStatus === "overdue" &&
                        !result.completed && (
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-rose-400" />
                        )}
                </div>

                <p className="mt-0.5 truncate text-[12px] text-text-muted">{result.subtitle}</p>

                {/* Optional preview text for notes and tasks */}
                {result.preview && (
                    <p className="mt-1 line-clamp-1 text-[11.5px] text-text-muted/80">
                        {previewSegments.map((segment, i) => (
                            <span
                                key={i}
                                className={segment.highlight ? "bg-violet-400/10 text-violet-400" : ""}
                            >
                                {segment.text}
                            </span>
                        ))}
                    </p>
                )}

                {/* Type-specific metadata */}
                {result.type === "note" && "tags" in result && result.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                        {result.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-text-muted"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {result.type === "task" && "priority" in result && (
                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                        <span
                            className={cn(
                                "rounded px-1.5 py-0.5 font-medium",
                                result.priority === "high" && "bg-rose-500/10 text-rose-400",
                                result.priority === "medium" && "bg-amber-500/10 text-amber-400",
                                result.priority === "low" && "bg-blue-500/10 text-blue-400",
                            )}
                        >
                            {result.priority}
                        </span>
                        {result.overdueStatus === "today" && (
                            <span className="flex items-center gap-1 text-amber-400">
                                <Clock className="h-3 w-3" />
                                <span>Due today</span>
                            </span>
                        )}
                    </div>
                )}

                {result.type === "course" && "semester" in result && (
                    <p className="mt-1 text-[11px] text-text-muted/70">{result.semester}</p>
                )}
            </div>
        </motion.button>
    );
}
