import { useCallback, useEffect, useState } from "react";
import {
    getPlannerTasks,
    createPlannerTask,
    type PlannerTaskRecord,
    type CreatePlannerTaskInput,
} from "@/services/planner.service";

export interface UsePlannerResult {
    data: PlannerTaskRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    /** Creates a task via Supabase and appends it to the list sorted by due date.
     *  Throws on failure so the caller (CreateTaskModal) can surface an error toast. */
    createTask: (input: CreatePlannerTaskInput) => Promise<PlannerTaskRecord>;
}

/**
 * Loads every planner task (with checklist) owned by the signed-in user, from Supabase.
 *
 * NOTE: `hooks/usePlanner.ts` already exists — it reads the Planner module's local,
 * localStorage-backed demo store (edit/checklist/completion, no backend). Same naming
 * situation as `hooks/queries/useNotes.ts` — see that file's note for why this isn't
 * renamed instead. Import the one you mean explicitly:
 *   import { usePlanner } from "@/hooks/usePlanner";          // local demo store
 *   import { usePlanner } from "@/hooks/queries/usePlanner";  // Supabase-backed
 */
export function usePlanner(): UsePlannerResult {
    const [data, setData] = useState<PlannerTaskRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await getPlannerTasks());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load planner tasks.");
        } finally {
            setLoading(false);
        }
    }, []);

    // See hooks/queries/useCourses.ts for why the initial load is a separate promise
    // chain rather than just calling refresh() here.
    useEffect(() => {
        let active = true;

        getPlannerTasks()
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load planner tasks.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const createTask = useCallback(async (input: CreatePlannerTaskInput): Promise<PlannerTaskRecord> => {
        const record = await createPlannerTask(input);
        // Optimistic-append, sorted by due date ascending — same convention as getPlannerTasks().
        setData((prev) => [...prev, record].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
        return record;
    }, []);

    return { data, loading, error, refresh, createTask };
}