import { useCallback, useEffect, useState } from "react";
import {
    getNoteById,
    updateNote as updateNoteService,
    deleteNote as deleteNoteService,
    type UpdateNoteInput,
    type NoteRecord,
} from "@/services/note.service";

export interface UseNoteResult {
    /** null while loading, on error, or when the note doesn't exist / isn't owned
     *  by the signed-in user — RLS makes those last two indistinguishable by design
     *  (see getNoteById's own doc comment), so the page treats both as "not found". */
    data: NoteRecord | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    /** Updates the note via note.service.ts, then replaces `data` with the fresh
     *  record — no extra round-trip refetch needed. Throws on failure so the caller
     *  can show its own error state. */
    updateNote: (input: UpdateNoteInput) => Promise<NoteRecord>;
    /** Deletes the note via note.service.ts. Doesn't touch `data` on success — the
     *  caller (Note Detail page) navigates away immediately, so there's no
     *  "deleted but still displayed" state to reconcile here. */
    deleteNote: () => Promise<void>;
}

/** Loads a single note by id for Note Detail. Separate from useNotes() (the list
 *  hook) because it fetches one record via getNoteById rather than the full list via
 *  getNotes, and re-runs whenever `id` changes (e.g. navigating between two notes
 *  without unmounting the page). */
export function useNote(id: string): UseNoteResult {
    const [data, setData] = useState<NoteRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Public, callable-anytime re-fetch (e.g. a manual "Retry"/refresh button).
    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const record = await getNoteById(id);
            setData(record);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load note.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Initial load on mount, and again whenever `id` changes. Deliberately not just
    // "refresh()" here — see useCourses.ts for why the initial load is its own promise
    // chain rather than calling the callback from inside the effect body.
    useEffect(() => {
        let active = true;

        getNoteById(id)
            .then((record) => {
                if (active) setData(record);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load note.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const updateNote = useCallback(
        async (input: UpdateNoteInput): Promise<NoteRecord> => {
            const record = await updateNoteService(id, input);
            setData(record);
            return record;
        },
        [id],
    );

    const deleteNote = useCallback(async (): Promise<void> => {
        await deleteNoteService(id);
    }, [id]);

    return { data, loading, error, refresh, updateNote, deleteNote };
}
