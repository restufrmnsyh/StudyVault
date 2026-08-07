import { useState, useEffect } from "react";

/**
 * Debounce a value with a specified delay.
 * Returns the debounced value that only updates after the delay has passed
 * without the value changing.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 200ms)
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 150);
 *
 * // Use debouncedQuery for expensive operations
 * const results = useSearch(debouncedQuery);
 * ```
 */
export function useDebounce<T>(value: T, delay: number = 200): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up the timeout
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout if value changes before delay expires
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
