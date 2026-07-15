import { useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { AuthLayout, AuthField, AuthAlert } from "@/components/auth";
import { useAuth } from "@/auth/useAuth";

export function RegisterPage() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setSubmitting(true);
        const { error: signUpError } = await signUp(email, password);
        setSubmitting(false);

        if (signUpError) {
            setError(signUpError);
            return;
        }

        // If the Supabase project has email confirmation on, signUp() succeeds without
        // returning a session — there's nothing to redirect to yet, so show a
        // confirmation message instead. If confirmation is off, a session comes back
        // immediately and GuestOnlyRoute (wrapping this page) redirects to /dashboard
        // on its own the moment that session lands in AuthProvider.
        setSubmitted(true);
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start organizing your courses, notes, and deadlines."
            footer={
                <>
                    Already have an account?{" "}
                    <a href="#/login" className="font-medium text-violet-400 transition-colors hover:text-violet-300">
                        Sign in
                    </a>
                </>
            }
        >
            {submitted ? (
                <AuthAlert variant="success">
                    Account created. Check your email to confirm it — you'll be signed in automatically once that's
                    done.
                </AuthAlert>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {error && <AuthAlert variant="error">{error}</AuthAlert>}

                    <AuthField
                        id="register-email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    <AuthField
                        id="register-password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        minLength={6}
                        required
                    />

                    <AuthField
                        id="register-confirm-password"
                        label="Confirm password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={6}
                        required
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                        <UserPlus className="h-3.5 w-3.5" />
                        {submitting ? "Creating account..." : "Create account"}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
}