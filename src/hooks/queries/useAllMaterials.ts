import { useCallback, useEffect, useState } from "react";
import { getAllMaterials, type MaterialRecord } from "@/services/material.service";

export interface UseAllMaterialsResult {
    data: MaterialRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

/**
 * Sprint 6.5.2 — Loads ALL materials owned by the signed-in user across all courses,
 * from Supabase. Used for dashboard statistics.
 *
 * Follows the same pattern as useCourses(), useNotes(), and usePlanner() from queries/.
 * For per-course materials, use useMaterials(courseId) instead.
 */
export function useAllMaterials(): UseAllMaterialsResult {
    const [data, setData] = useState<MaterialRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await getAllMaterials());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load materials.");
        } finally {
            setLoading(false);
        }
    }, []);

    // See hooks/queries/useCourses.ts for why the initial load is a separate promise
    // chain rather than just calling refresh() here.
    useEffect(() => {
        let active = true;

        getAllMaterials()
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load materials.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return { data, loading, error, refresh };
}
