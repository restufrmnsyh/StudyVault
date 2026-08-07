import { motion } from "framer-motion";
import { SearchResultItem } from "./SearchResultItem";
import type { SearchResult } from "@/types/search";

interface SearchResultGroupProps {
    title: string;
    results: SearchResult[];
    onResultClick: (href: string) => void;
    selectedIndex: number;
    startIndex: number;
    query?: string;
}

const groupStagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.03, delayChildren: 0.05 },
    },
};

/**
 * Grouped search results section.
 * Displays section header with count and list of results.
 */
export function SearchResultGroup({
    title,
    results,
    onResultClick,
    selectedIndex,
    startIndex,
    query = "",
}: SearchResultGroupProps) {
    if (results.length === 0) return null;

    return (
        <motion.div
            variants={groupStagger}
            initial="hidden"
            animate="visible"
            className="space-y-1"
        >
            {/* Section Header */}
            <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    {title}
                </h3>
                <span className="text-[11px] font-medium text-text-muted/60">
                    {results.length}
                </span>
            </div>

            {/* Results List */}
            <div className="space-y-0.5">
                {results.map((result, index) => (
                    <SearchResultItem
                        key={result.id}
                        result={result}
                        onClick={onResultClick}
                        selected={startIndex + index === selectedIndex}
                        query={query}
                    />
                ))}
            </div>
        </motion.div>
    );
}
