import { useCallback, useEffect, useState } from "react";
import { getProfile, type ProfileRecord } from "@/services/profile.service";

export interface UseProfileResult {
    data: ProfileRecord | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

/** Loads the signed-in user's profile. Pages consume this hook — never the service
 *  or the Supabase client directly (page → hook → service → Supabase). */
export function useProfile(): UseProfileResult {
    const [data, setData] = useState<ProfileRecord | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await getProfile());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }, []);

    // See useCourses.ts for why the initial load is a separate promise chain rather
    // than just calling refresh() here.
    useEffect(() => {
        let active = true;

        getProfile()
            .then((result) => {
                if (active) setData(result);
            })
            .catch((err) => {
                if (active) setError(err instanceof Error ? err.message : "Failed to load profile.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    return { data, loading, error, refresh };
}