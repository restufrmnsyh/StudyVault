import { supabase } from "@/lib/supabase";
import type { Course } from "@/types/courses";

/** Raw shape of a `courses` row (migration.sql section 2.2). */
interface CourseRow {
    id: string;
    user_id: string;
    code: string;
    name: string;
    lecturer: string | null;
    semester: number | null;
    description: string | null;
    color: string | null;
    created_at: string;
    updated_at: string;
}

export interface CourseRecord {
    id: string;
    code: string;
    name: string;
    lecturer: string | null;
    semester: number | null;
    description: string | null;
    color: string | null;
    createdAt: string;
    updatedAt: string;
}

function mapCourse(row: CourseRow): CourseRecord {
    return {
        id: row.id,
        code: row.code,
        name: row.name,
        lecturer: row.lecturer,
        semester: row.semester,
        description: row.description,
        color: row.color,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/** Falls back to the same "from-violet-500 to-indigo-500" gradient CourseCard already
 *  ships as its own default, so an unset color looks identical wherever it's rendered. */
const DEFAULT_COURSE_COLOR = "from-violet-500 to-indigo-500";

/**
 * Adapts a `CourseRecord` (Supabase shape) into the existing frontend `Course` model
 * that every course-related component already renders. This is the one place that
 * absorbs the differences between the two shapes:
 *
 * - `lecturer` / `description`: nullable in the DB, non-nullable on `Course` — empty
 *   string when unset, which every consumer already renders fine (e.g. an empty
 *   description paragraph).
 * - `semester`: stored as a `smallint`, displayed as a string ("Semester 3") — mirrors
 *   the exact label format `data/courses.ts`'s dummy fixtures already use.
 * - `color`: nullable in the DB — falls back to a default gradient rather than
 *   rendering a broken `bg-gradient-to-br undefined` class.
 * - `notesCount` / `materialsCount` / `assignmentsCount` / `progress`: **not yet backed
 *   by any Supabase table or column** (no materials/assignments schema exists yet, and
 *   aggregating notesCount from the `notes` table is out of scope for this sprint — see
 *   Sprint 4.3B.1 notes). Defaulted to 0, which correctly renders the Materials Library
 *   and Upcoming Assignments sections' existing empty states rather than showing
 *   fabricated numbers with nothing behind them.
 */
export function toCourse(record: CourseRecord): Course {
    return {
        id: record.id,
        code: record.code,
        name: record.name,
        lecturer: record.lecturer ?? "",
        semester: record.semester != null ? `Semester ${record.semester}` : "Semester —",
        description: record.description ?? "",
        color: record.color ?? DEFAULT_COURSE_COLOR,
        notesCount: 0,
        materialsCount: 0,
        assignmentsCount: 0,
        progress: 0,
    };
}

/**
 * Fetches every course owned by the signed-in user.
 *
 * No `user_id` filter is applied here on purpose — `courses_select_own` (RLS) already
 * restricts every row read through this client to `auth.uid()`. Adding a redundant
 * `.eq("user_id", ...)` wouldn't change the result set, only require the caller to
 * know their own id for no reason.
 */
export async function getCourses(): Promise<CourseRecord[]> {
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("code", { ascending: true })
        .returns<CourseRow[]>();

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map(mapCourse);
}

/** Fetches a single course by id. Returns null if it doesn't exist or isn't owned
 *  by the signed-in user (RLS makes those two cases indistinguishable, by design). */
export async function getCourseById(id: string): Promise<CourseRecord | null> {
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .maybeSingle<CourseRow>();

    if (error) {
        throw new Error(error.message);
    }

    return data ? mapCourse(data) : null;
}

export interface CreateCourseInput {
    name: string;
    code: string;
    /** Empty string is treated as "not set" and stored as null, same as the DB column. */
    lecturer: string;
    semester: number;
    description: string;
    /** Omit (or empty string) to fall back to DEFAULT_COURSE_COLOR via toCourse(). */
    color: string;
}

/**
 * Creates a course owned by the signed-in user.
 *
 * `user_id` is set explicitly from the current session rather than relying on a
 * column default — `courses_insert_own` (RLS) requires `user_id = auth.uid()` in its
 * WITH CHECK clause, so the row is rejected outright if this is wrong or missing.
 */
export async function createCourse(input: CreateCourseInput): Promise<CourseRecord> {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        throw new Error(authError.message);
    }
    if (!user) {
        throw new Error("You need to be signed in to create a course.");
    }

    const { data, error } = await supabase
        .from("courses")
        .insert({
            user_id: user.id,
            code: input.code,
            name: input.name,
            lecturer: input.lecturer || null,
            semester: input.semester,
            description: input.description || null,
            color: input.color || null,
        })
        .select()
        .single<CourseRow>();

    if (error) {
        // 23505 = unique_violation — courses_user_id_code_key (migration.sql 2.2).
        if (error.code === "23505") {
            throw new Error(`You already have a course with the code "${input.code}".`);
        }
        throw new Error(error.message);
    }

    return mapCourse(data);
}