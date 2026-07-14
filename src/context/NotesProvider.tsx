import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { notes as dummyNotes } from "@/data/notes";
import type { Note } from "@/types/notes";
import { NotesContext, type NotesContextValue } from "@/context/NotesContext";

const STORAGE_KEY = "studyvault:notes";

type NotesAction =
    | { type: "TOGGLE_FAVORITE"; id: string }
    | { type: "TOGGLE_ARCHIVE"; id: string }
    | { type: "UPDATE_NOTE"; id: string; changes: Partial<Pick<Note, "title" | "tags" | "content">> }
    | { type: "RESET" };

function notesReducer(state: Note[], action: NotesAction): Note[] {
    switch (action.type) {
        case "TOGGLE_FAVORITE":
            return state.map((note) => (note.id === action.id ? { ...note, favorite: !note.favorite } : note));

        case "TOGGLE_ARCHIVE":
            return state.map((note) => (note.id === action.id ? { ...note, archived: !note.archived } : note));

        case "UPDATE_NOTE":
            // A real edit also bumps "last edited" so the change reads as freshly made,
            // instead of silently keeping the old dummy timestamp after a save.
            return state.map((note) =>
                note.id === action.id
                    ? { ...note, ...action.changes, lastEdited: "Just now", editedDaysAgo: 0 }
                    : note,
            );

        case "RESET":
            return dummyNotes;

        default:
            return state;
    }
}

/** Reads the persisted notes on first mount, falling back to the dummy set if
 *  localStorage is empty, corrupted, or unavailable (e.g. private browsing). */
function loadInitialNotes(): Note[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Note[];
    } catch {
        // Corrupted JSON or inaccessible storage — fall through to the dummy dataset.
    }
    return dummyNotes;
}

export function NotesProvider({ children }: { children: ReactNode }) {
    const [notes, dispatch] = useReducer(notesReducer, undefined, loadInitialNotes);

    // Persist on every change, including the very first render — this is what makes
    // "on first load, initialize from dummy data" and "subsequent edits load from
    // localStorage" both true without any special-casing.
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch {
            // Storage full or unavailable — edits still work for this session, they just
            // won't survive a refresh. Not worth surfacing as an error for a demo app.
        }
    }, [notes]);

    const value = useMemo<NotesContextValue>(
        () => ({
            notes,
            toggleFavorite: (id) => dispatch({ type: "TOGGLE_FAVORITE", id }),
            toggleArchive: (id) => dispatch({ type: "TOGGLE_ARCHIVE", id }),
            updateNote: (id, changes) => dispatch({ type: "UPDATE_NOTE", id, changes }),
            resetDemoData: () => dispatch({ type: "RESET" }),
        }),
        [notes],
    );

    return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}