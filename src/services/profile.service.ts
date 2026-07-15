import { supabase } from "@/lib/supabase";

/**
 * Raw shape of a `profiles` row exactly as Postgres returns it (snake_case,
 * nullable columns as declared in migration.sql section 2.1).
 */
interface ProfileRow {
    id: string;
    full_name: string | null;
    university: string | null;
    faculty: string | null;
    major: string | null;
    semester: number | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

/** Public, camelCase shape every caller of this service actually works with. */
export interface ProfileRecord {
    id: string;
    fullName: string | null;
    university: string | null;
    faculty: string | null;
    major: string | null;
    semester: number | null;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

function mapProfile(row: ProfileRow): ProfileRecord {
    return {
        id: row.id,
        fullName: row.full_name,
        university: row.university,
        faculty: row.faculty,
        major: row.major,
        semester: row.semester,
        avatarUrl: row.avatar_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Fetches the signed-in user's own profile row.
 *
 * Takes no id — `profiles.id` IS `auth.users.id` (see migration.sql 2.1), so "my
 * profile" is always exactly one row, found via the current session rather than a
 * caller-supplied id. Returns null if the auth user has no profile row yet (e.g.
 * a fresh sign-up before onboarding has run) rather than throwing.
 */
export async function getProfile(): Promise<ProfileRecord | null> {
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        throw new Error(authError.message);
    }
    if (!user) {
        return null;
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

    if (error) {
        throw new Error(error.message);
    }

    return data ? mapProfile(data) : null;
}