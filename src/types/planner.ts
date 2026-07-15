import type { AssignmentPriority } from "@/types/courses";

export interface ChecklistItem {
    id: string;
    label: string;
    done: boolean;
}

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
    /** Lives on the task itself (not derived) so edits persist and sync everywhere,
     *  the same way Note.content moved onto Note in the Notes module. */
    checklist: ChecklistItem[];
}

export type PlannerFilterKey = "all" | "today" | "upcoming" | "completed" | "high-priority" | "overdue";

/** Derived from a task's completed flag + due date, not stored — see getTaskStatus(). */
export type TaskStatus = "completed" | "overdue" | "due-today" | "upcoming";