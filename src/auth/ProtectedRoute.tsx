import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/useAuth";

/** Shown while the initial session check is in flight, and briefly while a guard's
 *  redirect propagates through the hash router. Matches the app's dark shell so there's
 *  no flash of unstyled/white content before Landing or Dashboard takes over. */
function AuthLoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
        </div>
    );
}

interface RouteGuardProps {
    children: ReactNode;
}

/**
 * Wraps a protected page. Redirects to /login if there's no session once the initial
 * check resolves — this app has no <Route> tree to hook into (see App.tsx), so "redirect"
 * here means setting the hash directly, the same primitive the rest of the app's
 * navigation already uses.
 */
export function ProtectedRoute({ children }: RouteGuardProps) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            window.location.hash = "#/login";
        }
    }, [loading, user]);

    if (loading || !user) {
        return <AuthLoadingScreen />;
    }

    return <>{children}</>;
}

/**
 * The inverse guard for /login and /register: bounces an already-authenticated user to
 * /dashboard instead of letting them see the auth forms again. Co-located with
 * ProtectedRoute rather than split into its own file — the two are a matched pair (same
 * shape, opposite condition) and the auth module's file list was kept intentionally
 * small for this sprint.
 */
export function GuestOnlyRoute({ children }: RouteGuardProps) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            window.location.hash = "#/dashboard";
        }
    }, [loading, user]);

    if (loading || user) {
        return <AuthLoadingScreen />;
    }

    return <>{children}</>;
}