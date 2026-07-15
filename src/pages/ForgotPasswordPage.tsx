import { useState, type FormEvent } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { AuthLayout, AuthField, AuthAlert } from "@/components/auth";
import { useAuth } from "@/auth/useAuth";

export function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setSubmitting(true);
        const { error: resetError } = await resetPassword(email);
        setSubmitting(false);

        if (resetError) {
            setError(resetError);
            return;
        }
        setSubmitted(true);
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email and we'll send you a reset link."
            footer={
                <a
                    href="#/login"
                    className="inline-flex items-center gap-1.5 font-medium text-violet-400 transition-colors hover:text-violet-300"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Back to sign in
                </a>
            }
        >
            {submitted ? (
                <AuthAlert variant="success">
                    If an account exists for that email, a reset link is on its way. Check your inbox.
                </AuthAlert>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {error && <AuthAlert variant="error">{error}</AuthAlert>}

                    <AuthField
                        id="forgot-password-email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                        <Send className="h-3.5 w-3.5" />
                        {submitting ? "Sending..." : "Send reset link"}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
}