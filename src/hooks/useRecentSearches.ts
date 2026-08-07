import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "studyvault-recent-searches";
const MAX_RECENT_SEARCHES = 5;

/**
 * Load recent searches from localStorage.
 * Separated into a function to avoid setState in effect.
 */
function loadRecentSearches(): string[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed.slice(0, MAX_RECENT_SEARCHES);
            }
        }
    } catch (error) {
        // Ignore localStorage errors (private browsing, quota exceeded, etc.)
        console.warn("Failed to load recent searches:", error);
    }
    return [];
}

/**
 * Hook for managing recent searches in localStorage.
 * Stores up to 5 unique search queries.
 */
export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);

    // Save to localStorage whenever recent searches change
    useEffect(() => {
        if (recentSearches.length > 0) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
            } catch (error) {
                console.warn("Failed to save recent searches:", error);
            }
        }
    }, [recentSearches]);

    /**
     * Add a search query to recent searches.
     * Deduplicates and maintains max 5 items.
     */
    const addSearch = useCallback((query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        setRecentSearches((prev) => {
            // Remove duplicate if it exists
            const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
            // Add to front, maintain max count
            return [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
        });
    }, []);

    /**
     * Clear all recent searches.
     */
    const clearSearches = useCallback(() => {
        setRecentSearches([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn("Failed to clear recent searches:", error);
        }
    }, []);

    return {
        recentSearches,
        addSearch,
        clearSearches,
    };
}
