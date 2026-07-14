import type { AssignmentPriority } from "@/types/courses";

export const priorityStyle: Record<AssignmentPriority, string> = {
    high: "bg-rose-500/10 text-rose-400",
    medium: "bg-amber-500/10 text-amber-400",
    low: "bg-emerald-500/10 text-emerald-400",
};

export const priorityLabel: Record<AssignmentPriority, string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
};