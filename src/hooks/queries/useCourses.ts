import { useCallback, useEffect, useState } from "react";
import { getCourses, createCourse as createCourseService, toCourse, type CreateCourseInput } from "@/services/course.service";
import type { Course } from "@/types/courses";

export interface UseCoursesResult {
    data: Course[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    /** Creates a course via course.service.ts, then appends it to `data` (re-sorted by
     *  code, matching getCourses()'s own ordering) — no extra round-trip refetch needed.
     *  Throws on failure so the caller (the Create Course modal) can show its own error
     *  state; this hook doesn't swallow it into `error` above, since that's reserved for
     *  the list fetch. */
    createCourse: (input: CreateCourseInput) => Promise<Course>;
}

/** Loads every course owned by the signed-in user, adapted to the frontend Course model
 *  via toCourse() — the same adapter useCourse() (singular, Course Detail) already uses,
 *  so CoursesPage and CourseDetailPage never see two different shapes for "a course". */
export function useCourses(): UseCoursesResult {
    const [data, setData] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Public, callable-anytime re-fetch (e.g. a manual "Retry"/refresh button).
    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData((await getCourses()).map(toCourse));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load courses.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load on mount. Deliberately not just "refresh()" — that would call
    // setLoading synchronously from inside an effect body, which is exactly what
    // react-hooks/set-state-in-effect flags. Mirrors AuthProvider's own pattern:
    // the fetch runs as a promise chain, and only the (still-mounted) result updates
    // state.
    useEffect(() => {
        let active = true;

        getCourses()
            .then((result) => {
                if (active) setData(result.map(toCourse));
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load courses.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const createCourse = useCallback(async (input: CreateCourseInput): Promise<Course> => {
        const record = await createCourseService(input);
        const course = toCourse(record);
        setData((prev) => [...prev, course].sort((a, b) => a.code.localeCompare(b.code)));
        return course;
    }, []);

    return { data, loading, error, refresh, createCourse };
}