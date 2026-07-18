import { motion } from "framer-motion";
import { FolderPlus, StickyNote } from "lucide-react";
import { usePlanner } from "@/hooks/usePlanner";
import { useAuth } from "@/auth/useAuth";
import type { Course } from "@/types/courses";
import type { NoteRecord } from "@/services/note.service";
import type { ProfileRecord } from "@/services/profile.service";

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

function HeroStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold tabular-nums text-text-primary">{value}</span>
            <span className="text-[12px] text-text-muted">{label}</span>
        </div>
    );
}

interface HeroProps {
    /** Passed down from DashboardPage rather than calling useCourses() here directly —
     *  DashboardPage owns the one instance this stat and the Create Course modal both
     *  need to share, so creating a course updates this count live. */
    courses: Course[];
    coursesLoading: boolean;
    notes: NoteRecord[];
    notesLoading: boolean;
    profile: ProfileRecord | null;
    onCreateCourse: () => void;
    onCreateNote: () => void;
}

export function Hero({ courses, coursesLoading, notes, notesLoading, profile, onCreateCourse, onCreateNote }: HeroProps) {
    const { tasks } = usePlanner();
    const { user } = useAuth();

    // Sprint 6.5.1 — Extract user display information from profile
    // Fallbacks ensure graceful handling when profile is still loading or fields are null
    
    // Extract first name for greeting with smart fallbacks:
    // 1. Use fullName from profile
    // 2. Derive from authenticated email (username part)
    // 3. Default to "Student"
    let userFirstName = "Student";
    if (profile?.fullName) {
        userFirstName = profile.fullName.split(" ")[0];
    } else if (user?.email) {
        // Extract username from email (before @)
        const emailUsername = user.email.split("@")[0];
        // Capitalize first letter and remove dots/underscores
        userFirstName = emailUsername
            .replace(/[._]/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // Build compact display format
    // Line 1: Major (if available)
    // Line 2: Semester X (if available)
    const majorDisplay = profile?.major || "";
    const semesterDisplay = profile?.semester ? `Semester ${profile.semester}` : "";

    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8"
        >
            {/* Subtle gradient accent — matches the design language's established use of
             *  soft violet/indigo glows rather than flat color blocks. */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-indigo-500/[0.06] blur-3xl" />

            <div className="relative">
                <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    {getGreeting()}, {userFirstName} 👋
                </h1>
                {majorDisplay && (
                    <p className="mt-1.5 text-[14px] text-text-muted">
                        {majorDisplay}
                    </p>
                )}
                {semesterDisplay && (
                    <p className="mt-0.5 text-[14px] text-text-muted">
                        {semesterDisplay}
                    </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-800/80 pt-5">
                    <HeroStat label="Courses" value={coursesLoading ? "–" : String(courses.length)} />
                    <HeroStat label="Notes" value={notesLoading ? "–" : String(notes.length)} />
                    <HeroStat label="Planner Tasks" value={String(tasks.length)} />
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={onCreateCourse}
                        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20"
                    >
                        <FolderPlus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                        Create Course
                    </button>
                    <button
                        type="button"
                        onClick={onCreateNote}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-2.5 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary"
                    >
                        <StickyNote className="h-3.5 w-3.5" />
                        Create Note
                    </button>
                </div>
            </div>
        </motion.div>
    );
}