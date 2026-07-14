import { BookOpen } from "lucide-react";
import type { Course } from "@/types/courses";

interface RelatedCourseCardProps {
    course: Course;
}

export function RelatedCourseCard({ course }: RelatedCourseCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div
                className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} shadow-sm`}
            >
                <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-text-primary">{course.name}</p>
                <p className="mt-0.5 text-[12px] text-text-muted">{course.code}</p>
            </div>
            <a
                href={`#/dashboard/courses/${course.id}`}
                className="flex-shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:border-violet-500/30 hover:text-violet-400"
            >
                Open Course
            </a>
        </div>
    );
}