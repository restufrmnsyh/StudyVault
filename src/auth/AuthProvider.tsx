import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import type { Session } from "@supabase/supabase-js";

/**
 * Owns the Supabase session and exposes it (plus the four auth actions the spec calls
 * for) through context. No token handling here — `supabase-js` persists the session to
 * storage and refreshes it internally; this provider only ever reads what it hands back
 * via getSession() / onAuthStateChange(), never touches a token directly.
 *
 * AuthContext and its type definitions live in ./AuthContext.ts so this file exports
 * only the AuthProvider component, satisfying react-refresh/only-export-components.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        // Resolves whatever session Supabase already has persisted (e.g. from a
        // previous visit) before we render anything that depends on auth state.
        supabase.auth.getSession().then(({ data }) => {
            if (!active) return;
            setSession(data.session);
            setLoading(false);
        });

        // Keeps session state in sync with every subsequent auth event — sign in, sign
        // out, token refresh, password recovery — for the lifetime of the app.
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            if (!active) return;
            setSession(nextSession);
            setLoading(false);
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const value: AuthContextValue = {
        user: session?.user ?? null,
        session,
        loading,
        signIn: async (email, password) => {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            return { error: error?.message ?? null };
        },
        signUp: async (email, password) => {
            const { error } = await supabase.auth.signUp({ email, password });
            return { error: error?.message ?? null };
        },
        resetPassword: async (email) => {
            // Sends the user back to /login (via a real path Supabase can redirect a
            // plain GET to) — the SPA's hash router takes it from there once loaded.
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}${window.location.pathname}#/login`,
            });
            return { error: error?.message ?? null };
        },
        signOut: async () => {
            await supabase.auth.signOut();
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}