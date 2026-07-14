import { useContext } from "react";
import { NotesContext, type NotesContextValue } from "@/context/NotesContext";

export function useNotes(): NotesContextValue {
    const ctx = useContext(NotesContext);
    if (!ctx) {
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return ctx;
}