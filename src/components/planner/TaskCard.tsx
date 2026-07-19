import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ProgressBar } from "@/components/common";
import { priorityLabel, priorityStyle } from "@/constants/priority";
import { formatDateFromISO } from "@/data/planner";
import { cn } from "@/lib/utils";
import type { PlannerTaskRecord } from "@/services/planner.service";

interface TaskCardProps {
    task: PlannerTaskRecord;
    /** Full course name, resolved from task.courseId by the page via useCourses(). */
    courseName?: string;
    /** When omitted the completion checkbox is rendered as disabled — Supabase-backed
     *  toggle is a follow-up sprint; see Sprint 6.7.1 out-of-scope notes. */
    onToggleComplete?: (id: string) => void;
}

const cardVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function TaskCard({ task, courseName, onToggleComplete }: TaskCardProps) {
    return (
        <motion.a
            href={`#/dashboard/planner/${task.id}`}
            variants={cardVariant}
            className={cn(
                "flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors duration-300 sm:items-center sm:gap-4 sm:p-5",
                task.completed ? "opacity-60" : "hover:border-violet-500/25",
            )}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleComplete?.(task.id);
                }}
                disabled={!onToggleComplete}
                aria-label={
                    task.completed ? `Mark "${task.title}" as not completed` : `Mark "${task.title}" as completed`
                }
                aria-pressed={task.completed}
                className={cn(
                    "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors duration-200 sm:mt-0",
                    !onToggleComplete && "cursor-not-allowed opacity-40",
                    task.completed ? "border-violet-500 bg-violet-500" : "border-zinc-700 hover:border-violet-500/60",
                )}
            >
                {task.completed && <Check className="h-3 w-3 text-white" />}
            </button>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p
                        className={cn(
                            "text-[14px] font-semibold text-text-primary",
                            task.completed && "text-text-muted line-through",
                        )}
                    >
                        {task.title}
                    </p>
                    <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", priorityStyle[task.priority])}>
                        {priorityLabel[task.priority]}
                    </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-muted">
                    <span>{courseName ?? task.courseId}</span>
                    {/* task.dueDate is an ISO string (YYYY-MM-DD) — format for display */}
                    <span>Due {formatDateFromISO(task.dueDate)}</span>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                    <ProgressBar progress={task.progress} className="flex-1" />
                    <span className="w-9 flex-shrink-0 text-right text-[11px] tabular-nums text-text-muted">
                        {task.progress}%
                    </span>
                </div>
            </div>
        </motion.a>
    );
}