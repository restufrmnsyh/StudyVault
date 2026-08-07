/**
 * Highlight matching keywords in text.
 * Returns an array of text segments with highlighting info.
 *
 * @param text - Text to search within
 * @param query - Search query
 * @returns Array of segments with `text` and `highlight` boolean
 *
 * @example
 * ```tsx
 * const segments = highlightMatches("Introduction to React", "react");
 * // [
 * //   { text: "Introduction to ", highlight: false },
 * //   { text: "React", highlight: true }
 * // ]
 * ```
 */
export interface TextSegment {
    text: string;
    highlight: boolean;
}

export function highlightMatches(text: string, query: string): TextSegment[] {
    if (!query.trim() || !text) {
        return [{ text, highlight: false }];
    }

    const queryLower = query.trim().toLowerCase();
    const textLower = text.toLowerCase();

    // Find first occurrence
    const index = textLower.indexOf(queryLower);

    if (index === -1) {
        return [{ text, highlight: false }];
    }

    const segments: TextSegment[] = [];

    // Before match
    if (index > 0) {
        segments.push({ text: text.substring(0, index), highlight: false });
    }

    // Match
    segments.push({
        text: text.substring(index, index + query.length),
        highlight: true,
    });

    // After match
    if (index + query.length < text.length) {
        segments.push({
            text: text.substring(index + query.length),
            highlight: false,
        });
    }

    return segments;
}
