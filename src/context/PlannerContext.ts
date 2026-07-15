import { createContext } from "react";
import type { PlannerTask } from "@/types/planner";

export interface PlannerContextValue {
    tasks: PlannerTask[];
    toggleComplete: (id: string) => void;
    toggleChecklistItem: (taskId: string, itemId: string) => void;
    updateTask: (
        id: string,
        changes: Partial<Pick<PlannerTask, "title" | "description" | "dueDate" | "dueDateISO" | "priority" | "progress" | "checklist">>,
    ) => void;
    resetDemoData: () => void;
}

export const PlannerContext = createContext<PlannerContextValue | null>(null);