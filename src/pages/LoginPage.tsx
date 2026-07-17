import { useState, type FormEvent } from "react";
import { LogIn } from "lucide-react";
import { AuthLayout, AuthField, AuthAlert } from "@/components/auth";
import { useAuth } from "@/auth/useAuth";

export function LoginPage() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // No manual redirect on success: GuestOnlyRoute (wrapping this page in App.tsx) is
    // watching the same auth state this call updates, and sends the user to /dashboard
    // itself the moment a session appears.
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSubmitting(true);
        const { error: signInError } = await signIn(email, password);
        setSubmitting(false);
        if (signInError) setError(signInError);
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to keep track of your courses, notes, and tasks."
            footer={
                <>
                    Don't have an account?{" "}
                    <a href="#/register" className="font-medium text-violet-400 transition-colors hover:text-violet-300">
                        Create one
                    </a>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && <AuthAlert variant="error">{error}</AuthAlert>}

                <AuthField
                    id="login-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                />

                <AuthField
                    id="login-password"
                    label="Password"
                    labelAction={
                        <a
                            href="#/forgot-password"
                            className="text-[12px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                        >
                            Forgot password?
                        </a>
                    }
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                    <LogIn className="h-3.5 w-3.5" />
                    {submitting ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </AuthLayout>
    );
}