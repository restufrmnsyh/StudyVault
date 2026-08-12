import { useCallback, useEffect, useRef, useState } from "react";
import {
    getPlannerTasksByCourse,
    createPlannerTask,
    updatePlannerTask,
    type PlannerTaskRecord,
    type CreatePlannerTaskInput,
} from "@/services/planner.service";

export interface UsePlannerByCourseResult {
    data: PlannerTaskRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    /** Creates a task via Supabase and appends it to the local list, sorted by due date.
     *  The caller (CourseDetailPage) passes `courseId` via the input — no second query. */
    createTask: (input: CreatePlannerTaskInput) => Promise<PlannerTaskRecord>;
    /** Optimistically flips a task's `completed` flag, persists to Supabase, reverts on
     *  error. Used by TaskCard's checkbox in CourseDetailPage. */
    toggleComplete: (taskId: string) => Promise<void>;
}

/**
 * Loads every planner task for a single course, with its checklist embedded.
 *
 * Mirrors the shape of usePlanner() but scopes the Supabase query to one course_id,
 * so CourseDetailPage never fetches the full task list. Follows the same local-state
 * pattern used by useMaterials(courseId) in the materials query hook.
 *
 * The usePlanner() hook (all-tasks view used by PlannerPage) is a separate instance —
 * creating a task here does NOT update usePlanner's cache. usePlanner re-fetches on
 * next mount, which is the correct behaviour (same as notes: useNotes doesn't know
 * about notes created by createNote() in CourseDetailPage).
 */
export function usePlannerByCourse(courseId: string): UsePlannerByCourseResult {
    const [data, setData] = useState<PlannerTaskRecord[]>([]);
    // Start in loading state only if we actually have a courseId to query.
    const [loading, setLoading] = useState(Boolean(courseId));
    const [error, setError] = useState<string | null>(null);

    // Mirrors `data` into a ref so toggleComplete can read the current task state
    // synchronously without capturing `data` as a useCallback dependency.
    // Same pattern as usePlannerTask — see that file for the full rationale.
    const dataRef = useRef<PlannerTaskRecord[]>([]);
    useEffect(() => {
        dataRef.current = data;
    });

    const refresh = useCallback(async () => {
        if (!courseId) return;
        setLoading(true);
        setError(null);
        try {
            setData(await getPlannerTasksByCourse(courseId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    // Initial load — separate promise chain so the effect cleanup flag works correctly.
    // See hooks/queries/useCourses.ts for the rationale behind this pattern.
    useEffect(() => {
        // Do not query Supabase when courseId is missing — an empty filter would
        // produce `course_id=eq.` which Supabase rejects with HTTP 400.
        if (!courseId) return;

        let active = true;

        getPlannerTasksByCourse(courseId)
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load tasks.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [courseId]);

    const createTask = useCallback(
        async (input: CreatePlannerTaskInput): Promise<PlannerTaskRecord> => {
            const record = await createPlannerTask(input);
            // Optimistic-append, sorted by due date — mirrors usePlanner.createTask.
            setData((prev) => [...prev, record].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
            return record;
        },
        [],
    );

    const toggleComplete = useCallback(async (taskId: string): Promise<void> => {
        const task = dataRef.current.find((t) => t.id === taskId);
        if (!task) return;

        const previousCompleted = task.completed;
        const newCompleted = !previousCompleted;

        // Optimistic flip — visible immediately.
        setData((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: newCompleted } : t)));

        try {
            await updatePlannerTask(taskId, { completed: newCompleted });
        } catch {
            // Revert on failure.
            setData((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: previousCompleted } : t)));
        }
    }, []);

    return { data, loading, error, refresh, createTask, toggleComplete };
}
