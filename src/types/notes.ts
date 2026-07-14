import type { MaterialType } from "@/types/courses";

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
    /** Display string, e.g. "May 12, 2026" — when the note was first created */
    createdDate: string;
    /** The note's body. Lives directly on the note (rather than being derived on every
     *  render) so edits can be saved to state and persisted to localStorage as plain data. */
    content: NoteContentBlock[];
}

export type NoteFilterKey = "all" | "favorites" | "recent" | "archived";

/**
 * Structured dummy content for the Note Detail page. Deliberately not markdown — each
 * block is a typed shape the renderer switches on directly, so no parser is needed and
 * a real editor can later serialize straight into this shape without a rewrite.
 */
export type NoteContentBlock =
    | { kind: "heading"; level: 2 | 3; text: string }
    | { kind: "paragraph"; text: string }
    | { kind: "bullet-list"; items: string[] }
    | { kind: "numbered-list"; items: string[] }
    | { kind: "code"; code: string; language?: string }
    | { kind: "quote"; text: string };

/** A file attached to a note. Reuses courses' MaterialType so the icon/label maps in
 *  constants/materialIcons.ts cover both Course Materials and Note Materials. */
export interface NoteMaterial {
    id: string;
    name: string;
    type: MaterialType;
}

export type NoteActivityType = "created" | "edited" | "viewed" | "favorited";

export interface NoteActivityItem {
    id: string;
    type: NoteActivityType;
    updatedAt: string;
}