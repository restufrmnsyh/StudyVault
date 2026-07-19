import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/common";
import { recommendCourse, getRecommendationReason } from "@/utils/activity.utils";
import type { Course } from "@/types/courses";
import type { NoteRecord } from "@/services/note.service";
import type { MaterialRecord } from "@/services/material.service";
import type { PlannerTaskRecord } from "@/services/planner.service";

interface ContinueLearningProps {
    courses: Course[];
    notes: NoteRecord[];
    materials: MaterialRecord[];
    tasks: PlannerTaskRecord[];
    loading: boolean;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.2 },
    },
};

/** Skeleton placeholder rendered while course/notes/materials data is still loading.
 *  Matches the card's approximate height to prevent layout shift on mount. */
function ContinueLearningskeleton() {
    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
        >
            <div className="relative p-5 sm:p-6">
                {/* Header row */}
                <div className="mb-4 flex items-center gap-2">
                    <div className="h-6 w-6 animate-pulse rounded-md bg-zinc-800" />
                    <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="h-5 w-52 animate-pulse rounded bg-zinc-800" />
                        <div className="h-3.5 w-40 animate-pulse rounded bg-zinc-800" />
                        <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
                        <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
                    </div>
                    <div className="h-9 w-28 animate-pulse self-start rounded-xl bg-zinc-800 sm:self-center" />
                </div>
            </div>
        </motion.div>
    );
}

export function ContinueLearning({ courses, notes, materials, tasks, loading }: ContinueLearningProps) {
    // Show skeleton while any of the required datasets is still loading
    if (loading) {
        return <ContinueLearningskeleton />;
    }

    // Select the recommended course (return type is Course | null — unchanged)
    const recommendedCourse = recommendCourse(courses, notes, materials, tasks);

    // No courses at all → empty state
    if (!recommendedCourse) {
        return (
            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
            >
                <div className="p-5 sm:p-6">
                    <EmptyState
                        icon={BookOpen}
                        title="No courses yet"
                        description="Create your first course to start learning."
                    />
                </div>
            </motion.div>
        );
    }

    // Derive real counts from already-available props — no additional queries
    const notesCount = notes.filter((n) => n.courseId === recommendedCourse.id).length;
    const materialsCount = materials.filter((m) => m.courseId === recommendedCourse.id).length;

    // Separate helper: derives why this course was recommended without touching
    // recommendCourse()'s return type
    const reason = getRecommendationReason(recommendedCourse, notes, materials, tasks);

    // Single navigation handler reused by both the card wrapper and the Continue button
    const handleNavigate = () => {
        window.location.hash = `#/dashboard/courses/${recommendedCourse.id}`;
    };

    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            onClick={handleNavigate}
            className="relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
        >
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-violet-500/[0.06] blur-3xl" />

            <div className="relative p-5 sm:p-6">
                {/* Header label */}
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
                        <BookOpen className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="text-[12px] font-medium tracking-wide text-text-muted uppercase">
                        Continue Learning
                    </span>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                        {/* Course name — primary heading */}
                        <h3 className="mb-1.5 text-lg font-semibold text-text-primary">
                            {recommendedCourse.name}
                        </h3>

                        {/* Subtitle: Code • Name — consistent with other dashboard widgets */}
                        <p className="text-[13px] text-text-muted">
                            {recommendedCourse.code} • {recommendedCourse.name}
                        </p>

                        {/* Real counts derived from props */}
                        <p className="mt-1 text-[12px] text-text-muted">
                            {notesCount} {notesCount === 1 ? "note" : "notes"} ·{" "}
                            {materialsCount} {materialsCount === 1 ? "material" : "materials"}
                        </p>

                        {/* Recommendation reason from the separate helper */}
                        <p className="mt-1.5 text-[11px] font-medium text-violet-400/80">
                            {reason}
                        </p>
                    </div>

                    {/* Continue button — calls the same handler; stopPropagation prevents
                     *  double-firing the parent card's onClick */}
                    <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate();
                        }}
                        className="group flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20 sm:self-center"
                    >
                        <BookOpen className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        Continue
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}