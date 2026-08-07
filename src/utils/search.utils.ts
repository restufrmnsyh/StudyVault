import {
    BookOpen,
    FileText,
    ListTodo,
    FileImage,
    FileVideo,
    FileSpreadsheet,
    Presentation,
    FileArchive,
} from "lucide-react";
import type {
    SearchableData,
    SearchResults,
    CourseSearchResult,
    NoteSearchResult,
    MaterialSearchResult,
    TaskSearchResult,
} from "@/types/search";
import type { MaterialType } from "@/types/courses";
import { getMaterialType, canPreviewInBrowser, formatBytes } from "@/services/material.service";

const MAX_RESULTS_PER_TYPE = 5;
const TODAY_ISO = new Date().toISOString().split("T")[0];

/**
 * Get material icon based on type.
 * Reuses the same logic as MaterialContextMenu and course detail materials section.
 */
function getMaterialIcon(type: MaterialType) {
    switch (type) {
        case "image":
            return FileImage;
        case "video":
            return FileVideo;
        case "pdf":
            return FileText;
        case "ppt":
            return Presentation;
        case "xls":
            return FileSpreadsheet;
        case "zip":
            return FileArchive;
        default:
            return FileText;
    }
}

/**
 * Calculate time since last edit for display.
 * Returns human-readable string like "2h ago" or "5d ago".
 */
function getTimeAgo(updatedAt: string): string {
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

/**
 * Get task overdue status for visual indicators.
 */
function getOverdueStatus(dueDate: string, completed: boolean): "overdue" | "today" | "upcoming" | undefined {
    if (completed) return undefined;
    if (dueDate < TODAY_ISO) return "overdue";
    if (dueDate === TODAY_ISO) return "today";
    return "upcoming";
}

// ============================================================================
// RANKING UTILITIES
// ============================================================================

/**
 * Calculate relevance score for a match.
 * Higher score = better match.
 *
 * Score breakdown:
 * - Exact match: 100
 * - Starts with query: 80
 * - Word starts with query: 60
 * - Contains query: 40
 * - No match: 0
 */
function calculateMatchScore(text: string, query: string): number {
    if (!text || !query) return 0;

    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact match (case-insensitive)
    if (textLower === queryLower) return 100;

    // Starts with query (prefix match)
    if (textLower.startsWith(queryLower)) return 80;

    // Word starts with query (e.g., "data" matches "Data Structures")
    const words = textLower.split(/\s+/);
    if (words.some((word) => word.startsWith(queryLower))) return 60;

    // Contains query anywhere
    if (textLower.includes(queryLower)) return 40;

    return 0;
}

/**
 * Calculate overall relevance score for a search result.
 * Considers multiple fields with weighted importance.
 */
function calculateRelevanceScore(
    item: {
        title: string;
        code?: string;
        tags?: string[];
        preview?: string | null;
        description?: string | null;
    },
    query: string,
): number {
    let score = 0;

    // Title match (highest weight)
    score += calculateMatchScore(item.title, query) * 3;

    // Code match (for courses)
    if (item.code) {
        score += calculateMatchScore(item.code, query) * 2.5;
    }

    // Tags match (for notes)
    if (item.tags) {
        const tagScores = item.tags.map((tag) => calculateMatchScore(tag, query));
        score += Math.max(...tagScores, 0) * 2;
    }

    // Preview/description match (lower weight)
    if (item.preview) {
        score += calculateMatchScore(item.preview, query) * 1;
    }
    if (item.description) {
        score += calculateMatchScore(item.description, query) * 1;
    }

    return score;
}

// ============================================================================
// COURSE SEARCH
// ============================================================================

/**
 * Search courses by code, name, lecturer, semester, or description.
 * Extracted from CoursesPage.tsx filter logic.
 * Results are ranked by relevance.
 */
export function searchCourses(query: string, courses: SearchableData["courses"]): CourseSearchResult[] {
    const q = query.trim().toLowerCase();
    if (q === "") return [];

    const results: Array<CourseSearchResult & { relevanceScore: number }> = [];

    for (const course of courses) {
        const matchesQuery =
            course.name.toLowerCase().includes(q) ||
            (course.lecturer?.toLowerCase() || "").includes(q) ||
            course.code.toLowerCase().includes(q) ||
            (course.description?.toLowerCase() || "").includes(q) ||
            (course.semester ? `semester ${course.semester}`.includes(q) : false);

        if (matchesQuery) {
            const relevanceScore = calculateRelevanceScore(
                {
                    title: course.name,
                    code: course.code,
                    description: course.description,
                },
                q,
            );

            results.push({
                id: course.id,
                type: "course",
                title: course.name,
                subtitle: course.code,
                icon: BookOpen,
                href: `#/dashboard/courses/${course.id}`,
                courseCode: course.code,
                semester: course.semester != null ? `Semester ${course.semester}` : "Semester —",
                color: course.color ?? "from-violet-500 to-indigo-500",
                relevanceScore,
            });

            if (results.length >= MAX_RESULTS_PER_TYPE) break;
        }
    }

    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================================
// NOTE SEARCH
// ============================================================================

/**
 * Search notes by title, preview, tags, course, and full content blocks.
 * Extracted from NotesPage.tsx noteRecordMatchesQuery logic.
 * Results are ranked by relevance, with favorites boosted.
 */
export function searchNotes(
    query: string,
    notes: SearchableData["notes"],
    courses: SearchableData["courses"],
): NoteSearchResult[] {
    const q = query.trim().toLowerCase();
    if (q === "") return [];

    const results: Array<NoteSearchResult & { relevanceScore: number }> = [];

    for (const note of notes) {
        const course = courses.find((c) => c.id === note.courseId);
        const courseCode = course ? course.code : "Unknown";
        const courseName = course ? course.name.toLowerCase() : "";

        // Search across multiple fields (same as NotesPage deep search)
        const matchesQuery =
            note.title.toLowerCase().includes(q) ||
            (note.preview ?? "").toLowerCase().includes(q) ||
            courseCode.toLowerCase().includes(q) ||
            courseName.includes(q) ||
            note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
            note.content.some((block) => {
                if (block.kind === "heading" || block.kind === "paragraph" || block.kind === "quote") {
                    return block.text?.toLowerCase().includes(q);
                } else if (block.kind === "bullet-list" || block.kind === "numbered-list") {
                    return block.items?.some((item) => item.toLowerCase().includes(q));
                } else if (block.kind === "code") {
                    return block.code?.toLowerCase().includes(q);
                }
                return false;
            });

        if (matchesQuery) {
            const relevanceScore = calculateRelevanceScore(
                {
                    title: note.title,
                    tags: note.tags,
                    preview: note.preview,
                },
                q,
            );

            // Boost favorites
            const finalScore = note.favorite ? relevanceScore * 1.2 : relevanceScore;

            results.push({
                id: note.id,
                type: "note",
                title: note.title,
                subtitle: `${courseCode} • ${getTimeAgo(note.updatedAt)}`,
                icon: FileText,
                href: `#/dashboard/notes/${note.id}`,
                preview: note.preview ?? undefined,
                courseCode,
                tags: note.tags,
                favorite: note.favorite,
                lastEdited: getTimeAgo(note.updatedAt),
                relevanceScore: finalScore,
            });

            if (results.length >= MAX_RESULTS_PER_TYPE) break;
        }
    }

    // Sort by relevance score (favorites already boosted)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================================
// MATERIAL SEARCH
// ============================================================================

/**
 * Search materials by title, description, or filename.
 * Materials navigate to their parent Course Detail page.
 * Results ranked by relevance and recency.
 */
export function searchMaterials(
    query: string,
    materials: SearchableData["materials"],
    courses: SearchableData["courses"],
): MaterialSearchResult[] {
    const q = query.trim().toLowerCase();
    if (q === "") return [];

    const results: Array<MaterialSearchResult & { relevanceScore: number; createdAt: string }> = [];

    for (const material of materials) {
        const course = courses.find((c) => c.id === material.courseId);
        const courseCode = course ? course.code : "Unknown";

        const matchesQuery =
            material.title.toLowerCase().includes(q) ||
            (material.description?.toLowerCase() || "").includes(q) ||
            material.fileName.toLowerCase().includes(q) ||
            courseCode.toLowerCase().includes(q);

        if (matchesQuery) {
            const type = getMaterialType(material.mimeType, material.fileName);

            const relevanceScore = calculateRelevanceScore(
                {
                    title: material.title,
                    description: material.description,
                },
                q,
            );

            results.push({
                id: material.id,
                type: "material",
                title: material.title,
                subtitle: `${courseCode} • ${formatBytes(material.fileSize)}`,
                icon: getMaterialIcon(type),
                href: `#/dashboard/courses/${material.courseId}`,
                courseCode,
                courseId: material.courseId,
                materialType: type,
                fileSize: formatBytes(material.fileSize),
                canPreview: canPreviewInBrowser(type),
                relevanceScore,
                createdAt: material.createdAt,
            });

            if (results.length >= MAX_RESULTS_PER_TYPE) break;
        }
    }

    // Sort by relevance, then by recency
    return results.sort((a, b) => {
        const scoreDiff = b.relevanceScore - a.relevanceScore;
        if (Math.abs(scoreDiff) > 10) return scoreDiff; // Significant score difference
        // Similar scores: sort by recency
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

// ============================================================================
// TASK SEARCH
// ============================================================================

/**
 * Search tasks by title, description, course name, and checklist item labels.
 * Extracted from PlannerPage.tsx taskMatchesQuerySupabase logic.
 * Results ranked by relevance, with overdue tasks boosted.
 */
export function searchTasks(
    query: string,
    tasks: SearchableData["tasks"],
    courses: SearchableData["courses"],
): TaskSearchResult[] {
    const q = query.trim().toLowerCase();
    if (q === "") return [];

    const results: Array<TaskSearchResult & { relevanceScore: number }> = [];

    for (const task of tasks) {
        const course = courses.find((c) => c.id === task.courseId);
        const courseCode = course ? course.code : "Unknown";
        const courseName = course ? course.name.toLowerCase() : "";

        const matchesQuery =
            task.title.toLowerCase().includes(q) ||
            (task.description ?? "").toLowerCase().includes(q) ||
            courseCode.toLowerCase().includes(q) ||
            courseName.includes(q) ||
            task.checklist.some((item) => item.label.toLowerCase().includes(q));

        if (matchesQuery) {
            const relevanceScore = calculateRelevanceScore(
                {
                    title: task.title,
                    description: task.description,
                },
                q,
            );

            const overdueStatus = getOverdueStatus(task.dueDate, task.completed);

            // Boost overdue tasks
            const finalScore = overdueStatus === "overdue" ? relevanceScore * 1.3 : relevanceScore;

            results.push({
                id: task.id,
                type: "task",
                title: task.title,
                subtitle: `${courseCode} • Due ${task.dueDate}`,
                icon: ListTodo,
                href: `#/dashboard/planner/tasks/${task.id}`,
                preview: task.description ?? undefined,
                courseCode,
                dueDate: task.dueDate,
                priority: task.priority,
                completed: task.completed,
                overdueStatus,
                relevanceScore: finalScore,
            });

            if (results.length >= MAX_RESULTS_PER_TYPE) break;
        }
    }

    // Sort by relevance score (overdue already boosted)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// ============================================================================
// GLOBAL SEARCH
// ============================================================================

/**
 * Perform global search across all data types.
 * Combines results from courses, notes, materials, and tasks.
 *
 * @param query - Search query string
 * @param data - All searchable data from query hooks
 * @returns Grouped search results with totals
 */
export function performGlobalSearch(query: string, data: SearchableData): SearchResults {
    const trimmedQuery = query.trim();

    // Empty query returns empty results (not all data)
    if (trimmedQuery === "") {
        return {
            courses: [],
            notes: [],
            materials: [],
            tasks: [],
            total: 0,
        };
    }

    const courses = searchCourses(trimmedQuery, data.courses);
    const notes = searchNotes(trimmedQuery, data.notes, data.courses);
    const materials = searchMaterials(trimmedQuery, data.materials, data.courses);
    const tasks = searchTasks(trimmedQuery, data.tasks, data.courses);

    return {
        courses,
        notes,
        materials,
        tasks,
        total: courses.length + notes.length + materials.length + tasks.length,
    };
}
