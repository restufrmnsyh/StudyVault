import { motion } from "framer-motion";
import { BookOpen, FileText } from "lucide-react";
import { ProgressBar } from "@/components/common";
import type { Course } from "@/types/courses";

interface CourseCardProps {
    course: Course;
    /** Position in the (filtered) list, used only to stagger the progress-bar fill-in */
    index?: number;
}

const cardVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function CourseCard({ course, index = 0 }: CourseCardProps) {
    return (
        <motion.div
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-300 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.04]"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                >
                    <BookOpen className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                    {course.code}
                </span>
            </div>

            <h3 className="mb-1 text-[15px] font-semibold text-text-primary">{course.name}</h3>
            <p className="mb-4 truncate text-[12px] text-text-muted">
                {course.lecturer} · {course.semester}
            </p>

            <div className="mt-auto space-y-2.5">
                <div className="flex items-center justify-between text-[12px]">
                    <span className="flex items-center gap-1.5 text-text-muted">
                        <FileText className="h-3.5 w-3.5" />
                        {course.notesCount} notes
                    </span>
                    <span className="font-medium tabular-nums text-text-primary">{course.progress}%</span>
                </div>
                <ProgressBar progress={course.progress} delay={0.1 + Math.min(index, 8) * 0.03} />
            </div>
        </motion.div>
    );
}
