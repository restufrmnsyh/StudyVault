import type { PlannerTaskRecord } from "@/services/planner.service";

/**
 * Sprint 6.5.3 — Planner utility functions for dashboard widgets and task management.
 * Extracted for reusability across components.
 */

/**
 * Selects the most important tasks for "Today's Focus" based on priority rules:
 * 1. High priority tasks due today
 * 2. Any tasks due today
 * 3. Nearest upcoming tasks
 * 
 * @param tasks - All planner tasks (should be sorted by due date ascending)
 * @param maxCount - Maximum number of tasks to return (default: 3)
 * @returns Array of selected tasks for today's focus
 */
export function selectTodaysFocusTasks(
    tasks: PlannerTaskRecord[],
    maxCount: number = 3
): PlannerTaskRecord[] {
    const today = getStartOfDay(new Date());
    const tomorrow = getStartOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filter out completed tasks
    const activeTasks = tasks.filter((t) => !t.completed);

    if (activeTasks.length === 0) return [];

    // Get tasks due today
    const tasksToday = activeTasks.filter((t) => {
        const taskDate = new Date(t.dueDate);
        return taskDate >= today && taskDate < tomorrow;
    });

    // Rule 1: High priority tasks due today
    const highPriorityToday = tasksToday.filter((t) => t.priority === "high");
    if (highPriorityToday.length > 0) {
        return highPriorityToday.slice(0, maxCount);
    }

    // Rule 2: Any tasks due today
    if (tasksToday.length > 0) {
        return tasksToday.slice(0, maxCount);
    }

    // Rule 3: Nearest upcoming tasks (already sorted by due date)
    return activeTasks.slice(0, maxCount);
}

/**
 * Returns a new Date object set to the start of the day (00:00:00.000).
 * Used for clean date comparisons without time interference.
 */
export function getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Formats a due date string (ISO YYYY-MM-DD) into a human-readable format:
 * - "Due Today" if due today
 * - "Due Tomorrow" if due tomorrow
 * - "Due [Weekday]" if due within 7 days
 * - "Due [Month Day]" for dates beyond 7 days
 * 
 * @param dueDate - ISO date string (YYYY-MM-DD)
 * @returns Formatted due date string
 */
export function formatDueDate(dueDate: string): string {
    const taskDate = new Date(dueDate);
    const today = getStartOfDay(new Date());

    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Due Today";
    if (diffDays === 1) return "Due Tomorrow";
    if (diffDays > 0 && diffDays <= 7) {
        const dayName = taskDate.toLocaleDateString("en-US", { weekday: "long" });
        return `Due ${dayName}`;
    }
    
    // For dates beyond a week or overdue
    const monthDay = taskDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
    return `Due ${monthDay}`;
}

/**
 * Checks if a date is today.
 */
export function isToday(date: Date | string): boolean {
    const checkDate = typeof date === "string" ? new Date(date) : date;
    const today = getStartOfDay(new Date());
    const tomorrow = getStartOfDay(new Date());
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return checkDate >= today && checkDate < tomorrow;
}

/**
 * Gets the number of days between today and a target date.
 * Positive values = future, negative values = past.
 */
export function getDaysUntil(date: Date | string): number {
    const targetDate = typeof date === "string" ? new Date(date) : date;
    const today = getStartOfDay(new Date());
    const target = getStartOfDay(targetDate);
    
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Selects upcoming incomplete tasks for the Upcoming Deadlines widget.
 * 
 * Sprint 6.5.4 — Simple chronological selection of next deadlines.
 * 
 * Rules:
 * 1. Exclude completed tasks
 * 2. Sort by nearest due date (already sorted by service)
 * 3. Return maximum N tasks
 * 
 * @param tasks - All planner tasks (pre-sorted by due date ascending)
 * @param maxCount - Maximum number of tasks to return (default: 5)
 * @returns Array of upcoming incomplete tasks
 */
export function selectUpcomingDeadlines(
    tasks: PlannerTaskRecord[],
    maxCount: number = 5
): PlannerTaskRecord[] {
    return tasks
        .filter((t) => !t.completed)
        .slice(0, maxCount);
}
