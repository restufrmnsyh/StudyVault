import { useCallback, useEffect, useState } from "react";
import {
    getNotes,
    createNote as createNoteService,
    updateNote as updateNoteService,
    type NoteRecord,
    type CreateNoteInput,
    type UpdateNoteInput,
} from "@/services/note.service";

export interface UseNotesResult {
    data: NoteRecord[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createNote: (input: CreateNoteInput) => Promise<NoteRecord>;
    updateNote: (id: string, input: UpdateNoteInput) => Promise<NoteRecord>;
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

    const createNote = useCallback(async (input: CreateNoteInput): Promise<NoteRecord> => {
        const record = await createNoteService(input);
        setData((prev) => [record, ...prev]);
        return record;
    }, []);

    const updateNote = useCallback(async (id: string, input: UpdateNoteInput): Promise<NoteRecord> => {
        let rollbackRecord: NoteRecord | null = null;
        
        setData((prev) => {
            return prev.map((n) => {
                if (n.id === id) {
                    rollbackRecord = n;
                    return { ...n, ...input } as NoteRecord;
                }
                return n;
            });
        });

        try {
            const record = await updateNoteService(id, input);
            setData((prev) => prev.map((n) => (n.id === id ? record : n)));
            return record;
        } catch (err) {
            if (rollbackRecord) {
                const recordToRestore = rollbackRecord as NoteRecord;
                setData((prev) => prev.map((n) => (n.id === id ? recordToRestore : n)));
            }
            throw err;
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

    return { data, loading, error, refresh, createNote, updateNote };
}