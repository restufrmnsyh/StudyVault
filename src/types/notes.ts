export interface Note {
    id: string;
    title: string;
    courseCode: string;
    tags: string[];
    /** Display string, e.g. "2h ago" or "5d ago" */
    lastEdited: string;
    /** Numeric days-since-edit, used for the "Recent" filter and sorting */
    editedDaysAgo: number;
    preview: string;
    favorite: boolean;
    archived: boolean;
}

export type NoteFilterKey = "all" | "favorites" | "recent" | "archived";