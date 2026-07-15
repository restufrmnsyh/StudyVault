import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { tasks as dummyTasks } from "@/data/planner";
import type { PlannerTask } from "@/types/planner";
import { PlannerContext, type PlannerContextValue } from "@/context/PlannerContext";

const STORAGE_KEY = "studyvault:planner";

type PlannerAction =
    | { type: "TOGGLE_COMPLETE"; id: string }
    | { type: "TOGGLE_CHECKLIST_ITEM"; taskId: string; itemId: string }
    | {
        type: "UPDATE_TASK";
        id: string;
        changes: Partial<
            Pick<PlannerTask, "title" | "description" | "dueDate" | "dueDateISO" | "priority" | "progress" | "checklist">
        >;
    }
    | { type: "RESET" };

function plannerReducer(state: PlannerTask[], action: PlannerAction): PlannerTask[] {
    switch (action.type) {
        case "TOGGLE_COMPLETE":
            return state.map((task) => (task.id === action.id ? { ...task, completed: !task.completed } : task));

        case "TOGGLE_CHECKLIST_ITEM":
            return state.map((task) =>
                task.id === action.taskId
                    ? {
                        ...task,
                        checklist: task.checklist.map((item) =>
                            item.id === action.itemId ? { ...item, done: !item.done } : item,
                        ),
                    }
                    : task,
            );

        case "UPDATE_TASK":
            return state.map((task) => (task.id === action.id ? { ...task, ...action.changes } : task));

        case "RESET":
            return dummyTasks;

        default:
            return state;
    }
}

/** Reads the persisted tasks on first mount, falling back to the dummy set if
 *  localStorage is empty, corrupted, or unavailable (e.g. private browsing) — same
 *  fallback strategy as NotesProvider's loadInitialNotes. */
function loadInitialTasks(): PlannerTask[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as PlannerTask[];
    } catch {
        // Corrupted JSON or inaccessible storage — fall through to the dummy dataset.
    }
    return dummyTasks;
}

export function PlannerProvider({ children }: { children: ReactNode }) {
    const [tasks, dispatch] = useReducer(plannerReducer, undefined, loadInitialTasks);

    // Persist on every change, including the very first render — this is what makes
    // "on first load, initialize from dummy data" and "subsequent loads restore
    // localStorage" both true without any special-casing.
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch {
            // Storage full or unavailable — edits still work for this session, they just
            // won't survive a refresh. Not worth surfacing as an error for a demo app.
        }
    }, [tasks]);

    const value = useMemo<PlannerContextValue>(
        () => ({
            tasks,
            toggleComplete: (id) => dispatch({ type: "TOGGLE_COMPLETE", id }),
            toggleChecklistItem: (taskId, itemId) => dispatch({ type: "TOGGLE_CHECKLIST_ITEM", taskId, itemId }),
            updateTask: (id, changes) => dispatch({ type: "UPDATE_TASK", id, changes }),
            resetDemoData: () => dispatch({ type: "RESET" }),
        }),
        [tasks],
    );

    return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}