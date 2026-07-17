import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/auth/AuthProvider";

/** Access the current session and auth actions. Must be called under <AuthProvider>
 *  (mounted once, at the App root) — throwing on misuse surfaces a missing provider
 *  immediately instead of components silently getting a null user. */
export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}