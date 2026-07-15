import { useCallback, useEffect, useState } from "react";
import { getNotes, type NoteRecord } from "@/services/note.service";

export interface UseNotesResult {
    data: NoteRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

/**
 * Loads every note owned by the signed-in user, from Supabase.
 *
 * NOTE: `hooks/useNotes.ts` already exists — it reads the Notes module's local,
 * localStorage-backed demo store (favorite/archive/edit, no backend). This is a
 * different hook with the same name living in `hooks/queries/`, deliberately kept
 * apart rather than renamed, since the sprint spec calls for a hook literally named
 * `useNotes()`. Import the one you mean explicitly:
 *   import { useNotes } from "@/hooks/useNotes";          // local demo store
 *   import { useNotes } from "@/hooks/queries/useNotes";  // Supabase-backed
 */
export function useNotes(): UseNotesResult {
    const [data, setData] = useState<NoteRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await getNotes());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load notes.");
        } finally {
            setLoading(false);
        }
    }, []);

    // See hooks/queries/useCourses.ts for why the initial load is a separate promise
    // chain rather than just calling refresh() here.
    useEffect(() => {
        let active = true;

        getNotes()
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load notes.");
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