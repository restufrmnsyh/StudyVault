import { createContext } from "react";
import type { Note } from "@/types/notes";

export interface NotesContextValue {
    notes: Note[];
    toggleFavorite: (id: string) => void;
    toggleArchive: (id: string) => void;
    updateNote: (id: string, changes: Partial<Pick<Note, "title" | "tags" | "content">>) => void;
    resetDemoData: () => void;
}

export const NotesContext = createContext<NotesContextValue | null>(null);