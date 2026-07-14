import { CalendarDays, Clock } from "lucide-react";
import { getRelativeDateLabel, getTaskStatus } from "@/data/planner";
import { priorityLabel, priorityStyle } from "@/constants/priority";
import { cn } from "@/lib/utils";
import type { PlannerTask, TaskStatus } from "@/types/planner";

interface TaskDetailHeaderProps {
    task: PlannerTask;
    /** Full course name, resolved from task.courseCode by the page — falls back to the code if not found. */
    courseName?: string;
}

const statusStyle: Record<TaskStatus, string> = {
    completed: "bg-emerald-500/10 text-emerald-400",
    overdue: "bg-rose-500/10 text-rose-400",
    "due-today": "bg-amber-500/10 text-amber-400",
    upcoming: "bg-blue-500/10 text-blue-400",
};

const statusLabel: Record<TaskStatus, string> = {
    completed: "Completed",
    overdue: "Overdue",
    "due-today": "Due Today",
    upcoming: "Upcoming",
};

export function TaskDetailHeader({ task, courseName }: TaskDetailHeaderProps) {
    const status = getTaskStatus(task);

    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                    {courseName ?? task.courseCode}
                </span>
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", priorityStyle[task.priority])}>
                    {priorityLabel[task.priority]} priority
                </span>
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", statusStyle[status])}>
                    {statusLabel[status]}
                </span>
            </div>

            <h1
                className={cn(
                    "mt-2.5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl",
                    task.completed && "text-text-muted line-through",
                )}
            >
                {task.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-text-muted">
                <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {getRelativeDateLabel(task.dueDateISO)}
                </span>
                <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {task.dueDate}
                </span>
            </div>
        </div>
    );
}