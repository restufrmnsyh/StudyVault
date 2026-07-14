import type { AssignmentPriority } from "@/types/courses";

export interface PlannerTask {
    id: string;
    title: string;
    description: string;
    courseCode: string;
    /** Display string, e.g. "Jul 16, 2026" */
    dueDate: string;
    /** Sortable ISO date (YYYY-MM-DD), used for the Today/Upcoming/Overdue groupings */
    dueDateISO: string;
    priority: AssignmentPriority;
    /** 0–100 */
    progress: number;
    completed: boolean;
}

export type PlannerFilterKey = "all" | "today" | "upcoming" | "completed";

/** Derived from a task's completed flag + due date, not stored — see getTaskStatus(). */
export type TaskStatus = "completed" | "overdue" | "due-today" | "upcoming";

export interface ChecklistItem {
    id: string;
    label: string;
    done: boolean;
}
