import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer?: ReactNode;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

/**
 * Reused by LoginPage/RegisterPage/ForgotPasswordPage so the three forms differ only in
 * their fields, not in page chrome. Mirrors Hero's ambient violet glow and the app's
 * standard rounded-2xl/border-zinc-800/bg-zinc-900 card language (SectionCard,
 * ConfirmDialog) rather than introducing a new visual style for auth.
 */
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[140px]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(99,102,241,0.3) 40%, transparent 70%)",
                    }}
                />
            </div>

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-sm"
            >
                <a href="/" className="mb-8 flex items-center justify-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm shadow-violet-500/20">
                        <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[16px] font-semibold tracking-[-0.01em] text-text-primary">
                        StudyVault
                    </span>
                </a>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-xl font-bold tracking-tight text-text-primary">{title}</h1>
                        <p className="mt-1.5 text-[13px] text-text-muted">{subtitle}</p>
                    </div>

                    {children}
                </div>

                {footer && <div className="mt-5 text-center text-[13px] text-text-muted">{footer}</div>}
            </motion.div>
        </div>
    );
}