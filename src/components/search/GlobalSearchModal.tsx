import { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Loader2, FileQuestion, X, Clock, Trash2 } from "lucide-react";
import { SearchResultGroup } from "./SearchResultGroup";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useDebounce } from "@/hooks/useDebounce";
import type { SearchResult } from "@/types/search";

interface GlobalSearchModalProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Global search command palette modal.
 * Full-screen overlay with compact search interface.
 *
 * Features:
 * - Type-ahead search across all data types
 * - Recent searches (localStorage)
 * - Debounced search (150ms)
 * - Keyword highlighting
 * - Improved relevance ranking
 * - Grouped results by type
 * - Loading and empty states
 * - Keyboard navigation (Arrow Up/Down, Enter)
 * - Click to navigate
 * - Escape to close
 */
export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 150);
    const { results, loading, error, isEmpty } = useGlobalSearch(debouncedQuery);
    const { recentSearches, addSearch, clearSearches } = useRecentSearches();
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Flatten all results into a single array for keyboard navigation
    // Memoized to prevent re-creation on every render
    const allResults: SearchResult[] = useMemo(
        () => [
            ...results.courses,
            ...results.notes,
            ...results.tasks,
            ...results.materials,
        ],
        [results.courses, results.notes, results.tasks, results.materials]
    );

    // Auto-focus input when modal opens
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    function handleQueryChange(newQuery: string) {
        setQuery(newQuery);
        // Reset selection when query changes
        setSelectedIndex(0);
    }

    // Keyboard navigation
    useEffect(() => {
        if (!open) return;

        function handleKeyDown(e: KeyboardEvent) {
            // Escape to close
            if (e.key === "Escape") {
                e.preventDefault();
                setQuery("");
                setSelectedIndex(0);
                onClose();
                return;
            }

            // Only handle arrow keys and enter if we have results
            if (allResults.length === 0) return;

            // Arrow Down - move to next result
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % allResults.length);
            }

            // Arrow Up - move to previous result
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
            }

            // Enter - navigate to selected result
            if (e.key === "Enter" && allResults[selectedIndex]) {
                e.preventDefault();
                const href = allResults[selectedIndex].href;
                // Save to recent searches
                if (debouncedQuery.trim()) {
                    addSearch(debouncedQuery.trim());
                }
                window.location.hash = href;
                setQuery("");
                setSelectedIndex(0);
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, allResults, selectedIndex, onClose, debouncedQuery, addSearch]);

    function handleResultClick(href: string) {
        // Save to recent searches
        if (debouncedQuery.trim()) {
            addSearch(debouncedQuery.trim());
        }
        // Navigate to result
        window.location.hash = href;
        // Close modal and clear query
        setQuery("");
        setSelectedIndex(0);
        onClose();
    }

    function handleRecentSearchClick(searchQuery: string) {
        setQuery(searchQuery);
        setSelectedIndex(0);
    }

    function handleBackdropClick() {
        // Clear query when closing
        setQuery("");
        setSelectedIndex(0);
        onClose();
    }

    // Prevent closing during loading (optional, can be removed if desired)
    const canClose = !loading;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={canClose ? handleBackdropClick : undefined}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="search-modal-title"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative flex w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40"
                        style={{ maxHeight: "80vh" }}
                    >
                        {/* Search Input Header */}
                        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
                            <Search className="h-5 w-5 flex-shrink-0 text-text-muted" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => handleQueryChange(e.target.value)}
                                placeholder="Search courses, notes, materials, tasks..."
                                aria-label="Global search"
                                className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-muted"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => handleQueryChange("")}
                                    aria-label="Clear search"
                                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Results Area (Scrollable) */}
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {/* Loading State */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center gap-3 py-16">
                                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                                    <p className="text-[13px] text-text-muted">Searching...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex flex-col items-center justify-center gap-3 py-16">
                                    <FileQuestion className="h-8 w-8 text-rose-400" />
                                    <p className="text-[13px] font-medium text-text-primary">
                                        Search failed
                                    </p>
                                    <p className="max-w-sm text-center text-[12px] text-text-muted">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Empty Query State - Recent Searches or Guidance */}
                            {!query.trim() && !loading && !error && (
                                <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
                                    {recentSearches.length > 0 ? (
                                        /* Recent Searches */
                                        <div className="w-full max-w-md space-y-3">
                                            <div className="flex items-center justify-between px-3">
                                                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-text-muted">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Recent Searches
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearSearches}
                                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                {recentSearches.map((search, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleRecentSearchClick(search)}
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/[0.04]"
                                                    >
                                                        <Clock className="h-4 w-4 flex-shrink-0 text-text-muted" />
                                                        <span className="flex-1 truncate text-[13px] text-text-primary">
                                                            {search}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Empty State Guidance */
                                        <>
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
                                                <Search className="h-6 w-6 text-violet-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[13px] font-medium text-text-primary">
                                                    Search across StudyVault
                                                </p>
                                                <p className="mt-1 text-[12px] text-text-muted">
                                                    Find courses, notes, tasks, and materials
                                                </p>
                                            </div>
                                            <div className="mt-2 space-y-1.5 text-[11px] text-text-muted">
                                                <p>• Search by title, content, or course code</p>
                                                <p>• Filter by tags, priority, or due date</p>
                                                <p>• Press Escape to close</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* No Results State */}
                            {isEmpty && !loading && !error && (
                                <div className="flex flex-col items-center justify-center gap-3 py-16">
                                    <FileQuestion className="h-8 w-8 text-text-muted" />
                                    <p className="text-[13px] font-medium text-text-primary">
                                        No results found
                                    </p>
                                    <p className="max-w-sm text-center text-[12px] text-text-muted">
                                        Try different keywords or check your spelling
                                    </p>
                                </div>
                            )}

                            {/* Results Groups */}
                            {!loading && !error && !isEmpty && query.trim() && (
                                <div className="space-y-4 px-2 py-4">
                                    <SearchResultGroup
                                        title="Courses"
                                        results={results.courses}
                                        onResultClick={handleResultClick}
                                        selectedIndex={selectedIndex}
                                        startIndex={0}
                                        query={debouncedQuery}
                                    />
                                    <SearchResultGroup
                                        title="Notes"
                                        results={results.notes}
                                        onResultClick={handleResultClick}
                                        selectedIndex={selectedIndex}
                                        startIndex={results.courses.length}
                                        query={debouncedQuery}
                                    />
                                    <SearchResultGroup
                                        title="Tasks"
                                        results={results.tasks}
                                        onResultClick={handleResultClick}
                                        selectedIndex={selectedIndex}
                                        startIndex={results.courses.length + results.notes.length}
                                        query={debouncedQuery}
                                    />
                                    <SearchResultGroup
                                        title="Materials"
                                        results={results.materials}
                                        onResultClick={handleResultClick}
                                        selectedIndex={selectedIndex}
                                        startIndex={results.courses.length + results.notes.length + results.tasks.length}
                                        query={debouncedQuery}
                                    />

                                    {/* Results Summary */}
                                    {results.total > 0 && (
                                        <div className="border-t border-zinc-800 px-3 pt-3">
                                            <p className="text-center text-[11px] text-text-muted">
                                                {results.total} result{results.total !== 1 ? "s" : ""} found
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Hint */}
                        <div className="border-t border-zinc-800 px-4 py-2.5">
                            <div className="flex items-center justify-between text-[11px] text-text-muted">
                                <span>Click result to navigate</span>
                                <span>ESC to close</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
