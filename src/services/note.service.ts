import { supabase } from "@/lib/supabase";
import type { NoteContentBlock } from "@/types/notes";

/** Raw shape of a `notes` row (migration.sql section 2.3). `content` is typed as
 *  NoteContentBlock[] — the frontend's existing block-shape type — since that's exactly
 *  what the column comment in the migration describes (heading/paragraph/list/code/quote),
 *  not a new shape invented here. */
interface NoteRow {
    id: string;
    user_id: string;
    course_id: string;
    title: string;
    content: NoteContentBlock[];
    preview: string | null;
    tags: string[];
    favorite: boolean;
    archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface NoteRecord {
    id: string;
    courseId: string;
    title: string;
    content: NoteContentBlock[];
    preview: string | null;
    tags: string[];
    favorite: boolean;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
}

function mapNote(row: NoteRow): NoteRecord {
    return {
        id: row.id,
        courseId: row.course_id,
        title: row.title,
        content: row.content,
        preview: row.preview,
        tags: row.tags,
        favorite: row.favorite,
        archived: row.archived,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/** Fetches every note owned by the signed-in user, newest first (matches
 *  idx_notes_created_at). RLS scopes this to the caller — see course.service.ts. */
export async function getNotes(): Promise<NoteRecord[]> {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false })
        .returns<NoteRow[]>();

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map(mapNote);
}

/** Fetches a single note by id. Returns null if it doesn't exist or isn't owned
 *  by the signed-in user. */
export async function getNoteById(id: string): Promise<NoteRecord | null> {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .maybeSingle<NoteRow>();

    if (error) {
        throw new Error(error.message);
    }

    return data ? mapNote(data) : null;
}

/** Fetches every note that belongs to one course — the query the Course Detail page's
 *  "Related Notes" list will eventually run. Separate from getNotes() rather than a
 *  client-side filter, so the database does the filtering instead of shipping every
 *  note over the wire just to discard most of them. */
export async function getNotesByCourse(courseId: string): Promise<NoteRecord[]> {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .returns<NoteRow[]>();

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map(mapNote);
}