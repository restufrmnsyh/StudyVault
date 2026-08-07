import type { LucideIcon } from "lucide-react";
import type { MaterialType, AssignmentPriority } from "./courses";

/**
 * Base search result shape — every result type extends this.
 * Contains fields needed for display and navigation across all result types.
 */
export interface SearchResultBase {
    /** Unique identifier (matches the record id in its source table) */
    id: string;
    /** Result type for grouping and icon selection */
    type: "course" | "note" | "material" | "task";
    /** Primary display text (course name, note title, etc.) */
    title: string;
    /** Secondary context (course code, last edited date, etc.) */
    subtitle: string;
    /** Type-specific icon */
    icon: LucideIcon;
    /** Navigation target (hash-based route) */
    href: string;
    /** Optional preview text for notes/tasks with descriptions */
    preview?: string;
    /** Relevance score (0-100) for sorting within type group */
    score?: number;
}

/**
 * Course search result.
 * Navigates to Course Detail page.
 */
export interface CourseSearchResult extends SearchResultBase {
    type: "course";
    courseCode: string;
    semester: string;
    /** Tailwind gradient for course color pill */
    color: string;
}

/**
 * Note search result.
 * Navigates to Note Detail page.
 */
export interface NoteSearchResult extends SearchResultBase {
    type: "note";
    courseCode: string;
    tags: string[];
    favorite: boolean;
    /** Display string like "2h ago" or "5d ago" */
    lastEdited: string;
}

/**
 * Material search result.
 * Navigates to parent Course Detail page.
 */
export interface MaterialSearchResult extends SearchResultBase {
    type: "material";
    courseCode: string;
    /** Parent course ID (for navigation to Course Detail) */
    courseId: string;
    materialType: MaterialType;
    /** Human-readable file size like "2.4 MB" */
    fileSize: string;
    /** Whether material can be previewed in-app (PDF/image) */
    canPreview: boolean;
}

/**
 * Task search result.
 * Navigates to Task Detail page.
 */
export interface TaskSearchResult extends SearchResultBase {
    type: "task";
    courseCode: string;
    /** ISO date string (YYYY-MM-DD) */
    dueDate: string;
    priority: AssignmentPriority;
    completed: boolean;
    /** Computed status for visual indicators */
    overdueStatus?: "overdue" | "today" | "upcoming";
}

/**
 * Union type of all possible search results.
 */
export type SearchResult =
    | CourseSearchResult
    | NoteSearchResult
    | MaterialSearchResult
    | TaskSearchResult;

/**
 * Grouped search results returned by global search.
 * Each group contains results of one type, sorted by relevance.
 */
export interface SearchResults {
    courses: CourseSearchResult[];
    notes: NoteSearchResult[];
    materials: MaterialSearchResult[];
    tasks: TaskSearchResult[];
    /** Total count across all result types */
    total: number;
}

/**
 * Input data shape for global search.
 * Aggregates data from all four query hooks.
 */
export interface SearchableData {
    courses: Array<{
        id: string;
        code: string;
        name: string;
        lecturer: string | null;
        semester: number | null;
        description: string | null;
        color: string | null;
    }>;
    notes: Array<{
        id: string;
        courseId: string;
        title: string;
        content: Array<{
            kind: string;
            text?: string;
            items?: string[];
            code?: string;
        }>;
        preview: string | null;
        tags: string[];
        favorite: boolean;
        updatedAt: string;
    }>;
    materials: Array<{
        id: string;
        courseId: string;
        title: string;
        description: string | null;
        fileName: string;
        fileUrl: string;
        mimeType: string;
        fileSize: number;
        createdAt: string;
    }>;
    tasks: Array<{
        id: string;
        courseId: string;
        title: string;
        description: string | null;
        dueDate: string;
        priority: AssignmentPriority;
        completed: boolean;
        checklist: Array<{
            id: string;
            label: string;
            done: boolean;
        }>;
        createdAt: string;
    }>;
}
