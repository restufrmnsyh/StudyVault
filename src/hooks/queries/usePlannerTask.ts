import { useCallback, useEffect, useRef, useState } from "react";
import {
    getPlannerTaskById,
    updatePlannerTask as updatePlannerTaskService,
    toggleChecklistItemDone,
    type UpdatePlannerTaskInput,
    type PlannerTaskRecord,
} from "@/services/planner.service";

export interface UsePlannerTaskResult {
    /** null while loading, on error, or when the task doesn't exist / isn't owned
     *  by the signed-in user — RLS makes those last two indistinguishable by design,
     *  same convention as useNote. The page treats both as "not found". */
    data: PlannerTaskRecord | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    /** Updates scalar task fields via the service and replaces `data` with the
     *  returned record (checklist included). Throws on failure. */
    updateTask: (input: UpdatePlannerTaskInput) => Promise<PlannerTaskRecord>;
    /** Optimistically flips a checklist item's `done` flag, then persists the change
     *  to Supabase. Reverts the optimistic update on error. */
    toggleChecklistItem: (itemId: string) => Promise<void>;
}

/** Loads a single planner task by id for Task Detail. Separate from usePlanner()
 *  because it fetches one record via getPlannerTaskById rather than the full list,
 *  and re-runs whenever `id` changes (e.g. navigating between two tasks without
 *  unmounting the page). Mirrors the pattern used by useNote(). */
export function usePlannerTask(id: string): UsePlannerTaskResult {
    const [data, setData] = useState<PlannerTaskRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Sync the ref after every render so toggleChecklistItem always reads the
    // latest `data` without listing it as a useCallback dependency.
    // Assigning in useEffect (not the render body) satisfies react-hooks/refs.
    const dataRef = useRef<PlannerTaskRecord | null>(null);
    useEffect(() => {
        dataRef.current = data;
    });

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const record = await getPlannerTaskById(id);
            setData(record);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load task.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Initial load on mount, and again whenever `id` changes. Deliberately not just
    // "refresh()" here — see useCourses.ts for why the initial load is its own promise
    // chain rather than calling the callback from inside the effect body.
    useEffect(() => {
        let active = true;

        getPlannerTaskById(id)
            .then((record) => {
                if (active) setData(record);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load task.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const updateTask = useCallback(
        async (input: UpdatePlannerTaskInput): Promise<PlannerTaskRecord> => {
            const record = await updatePlannerTaskService(id, input);
            setData(record);
            return record;
        },
        [id],
    );

    const toggleChecklistItem = useCallback(async (itemId: string): Promise<void> => {
        const current = dataRef.current;
        if (!current) return;

        const item = current.checklist.find((i) => i.id === itemId);
        if (!item) return;

        const newDone = !item.done;

        // Optimistic flip
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                checklist: prev.checklist.map((i) => (i.id === itemId ? { ...i, done: newDone } : i)),
            };
        });

        try {
            await toggleChecklistItemDone(itemId, newDone);
        } catch {
            // Revert on failure
            setData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    checklist: prev.checklist.map((i) => (i.id === itemId ? { ...i, done: !newDone } : i)),
                };
            });
        }
    }, []);

    return { data, loading, error, refresh, updateTask, toggleChecklistItem };
}
