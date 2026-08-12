import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthResult {
    error: string | null;
}

export interface AuthContextValue {
    /** Null while the initial session check is in flight — see `loading`. */
    user: User | null;
    session: Session | null;
    /** True only until the first getSession()/onAuthStateChange() resolves. Guards
     *  (ProtectedRoute/GuestOnlyRoute) use this to avoid redirecting on a still-unknown
     *  session, which would otherwise bounce a logged-in user to /login for a flash. */
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthResult>;
    signUp: (email: string, password: string) => Promise<AuthResult>;
    resetPassword: (email: string) => Promise<AuthResult>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
