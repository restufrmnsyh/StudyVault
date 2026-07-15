import { useCallback, useEffect, useState } from "react";
import { getCourseById, toCourse } from "@/services/course.service";
import type { Course } from "@/types/courses";

export interface UseCourseResult {
    /** null while loading, on error, or when the course doesn't exist / isn't owned
     *  by the signed-in user — RLS makes those last two indistinguishable by design
     *  (see getCourseById's own doc comment), so the page treats both as "not found". */
    data: Course | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

/** Loads a single course by id for Course Detail. Separate from useCourses() (the list
 *  hook) because it fetches one record via getCourseById rather than the full list via
 *  getCourses, and re-runs whenever `id` changes (e.g. navigating between two courses
 *  without unmounting the page). */
export function useCourse(id: string): UseCourseResult {
    const [data, setData] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Public, callable-anytime re-fetch (e.g. a manual "Retry"/refresh button).
    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const record = await getCourseById(id);
            setData(record ? toCourse(record) : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load course.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Initial load on mount, and again whenever `id` changes. Deliberately not just
    // "refresh()" here — see useCourses.ts for why the initial load is its own promise
    // chain rather than calling the callback from inside the effect body (calling
    // setState synchronously in an effect body trips react-hooks/set-state-in-effect).
    // Note: `loading`/`error` aren't reset back to true/null when `id` changes on an
    // already-mounted instance — no current navigation flow does that (Course Detail
    // only links back to the Courses list, never to another course's detail), so this
    // is a defensive dependency rather than a reachable case today.
    useEffect(() => {
        let active = true;

        getCourseById(id)
            .then((record) => {
                if (active) setData(record ? toCourse(record) : null);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load course.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    return { data, loading, error, refresh };
}
