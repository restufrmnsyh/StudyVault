import { useMemo } from "react";
import { useCourses } from "@/hooks/queries/useCourses";
import { useNotes } from "@/hooks/queries/useNotes";
import { useAllMaterials } from "@/hooks/queries/useAllMaterials";
import { usePlanner } from "@/hooks/queries/usePlanner";
import { performGlobalSearch } from "@/utils/search.utils";
import type { SearchResults, SearchableData } from "@/types/search";

/**
 * Global search hook that combines data from all four query hooks
 * and performs unified search across courses, notes, materials, and tasks.
 *
 * @param query - Search query string
 * @returns Search results grouped by type, with loading/error states
 *
 * @example
 * ```tsx
 * function SearchModal() {
 *   const [query, setQuery] = useState("");
 *   const { results, loading, error } = useGlobalSearch(query);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *
 *   return <SearchResults data={results} />;
 * }
 * ```
 */
export function useGlobalSearch(query: string) {
    // Fetch all data sources (each hook manages its own caching/state)
    const {
        data: courses,
        loading: coursesLoading,
        error: coursesError,
    } = useCourses();

    const {
        data: notes,
        loading: notesLoading,
        error: notesError,
    } = useNotes();

    const {
        data: materials,
        loading: materialsLoading,
        error: materialsError,
    } = useAllMaterials();

    const {
        data: tasks,
        loading: tasksLoading,
        error: tasksError,
    } = usePlanner();

    // Aggregate loading states (search is "loading" if any source is still loading)
    const loading = coursesLoading || notesLoading || materialsLoading || tasksLoading;

    // Aggregate error states (show first error encountered, if any)
    const error = coursesError || notesError || materialsError || tasksError;

    // Perform search across all data sources
    // Memoized to prevent re-searching on every render
    const results: SearchResults = useMemo(() => {
        // Don't search if data is still loading or if there's an error
        if (loading || error) {
            return {
                courses: [],
                notes: [],
                materials: [],
                tasks: [],
                total: 0,
            };
        }

        // Prepare searchable data in the shape search.utils expects
        const searchableData: SearchableData = {
            courses: courses.map((c) => {
                // Extract semester number from "Semester X" string format
                // CourseRecord has semester as number | null, but Course (UI type) has it as string
                // We need the raw CourseRecord shape here
                return {
                    id: c.id,
                    code: c.code,
                    name: c.name,
                    lecturer: c.lecturer || null,
                    semester: c.semester && c.semester.startsWith("Semester ")
                        ? parseInt(c.semester.split(" ")[1], 10)
                        : null,
                    description: c.description || null,
                    color: c.color || null,
                };
            }),
            notes: notes.map((n) => ({
                id: n.id,
                courseId: n.courseId,
                title: n.title,
                content: n.content,
                preview: n.preview,
                tags: n.tags,
                favorite: n.favorite,
                updatedAt: n.updatedAt,
            })),
            materials: materials.map((m) => ({
                id: m.id,
                courseId: m.courseId,
                title: m.title,
                description: m.description,
                fileName: m.fileName,
                fileUrl: m.fileUrl,
                mimeType: m.mimeType,
                fileSize: m.fileSize,
                createdAt: m.createdAt,
            })),
            tasks: tasks.map((t) => ({
                id: t.id,
                courseId: t.courseId,
                title: t.title,
                description: t.description,
                dueDate: t.dueDate,
                priority: t.priority,
                completed: t.completed,
                checklist: t.checklist,
                createdAt: t.createdAt,
            })),
        };

        // Perform the actual search
        return performGlobalSearch(query, searchableData);
    }, [query, courses, notes, materials, tasks, loading, error]);

    return {
        /** Grouped search results */
        results,
        /** True if any data source is still loading */
        loading,
        /** First error encountered from any data source */
        error,
        /** Convenience flags for checking if results exist */
        hasResults: results.total > 0,
        isEmpty: results.total === 0 && query.trim() !== "",
    };
}
