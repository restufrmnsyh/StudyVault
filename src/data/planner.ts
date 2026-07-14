import type { ChecklistItem, PlannerTask, TaskStatus } from "@/types/planner";

function toISODate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function addDays(base: Date, days: number): Date {
    const next = new Date(base);
    next.setDate(next.getDate() + days);
    return next;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

/** Every task's dueDate/dueDateISO is generated relative to today, so "Today's Tasks",
 *  "Due This Week", and "Overdue" always line up with whenever this demo is opened. */
function relativeDate(offsetDays: number) {
    const date = addDays(today, offsetDays);
    return { iso: toISODate(date), display: formatDisplayDate(date) };
}

export const TODAY_ISO = toISODate(today);
export const WEEK_END_ISO = toISODate(addDays(today, 6));

const overdue3 = relativeDate(-3);
const overdue1 = relativeDate(-1);
const dueToday = relativeDate(0);
const tomorrow = relativeDate(1);
const in3 = relativeDate(3);
const in5 = relativeDate(5);
const in6 = relativeDate(6);
const in10 = relativeDate(10);
const in14 = relativeDate(14);
const past7 = relativeDate(-7);

export const tasks: PlannerTask[] = [
    {
        id: "1",
        title: "Submit BST Assignment",
        description: "Implement insertion, deletion, and in-order traversal with test cases.",
        courseCode: "CS201",
        dueDate: dueToday.display,
        dueDateISO: dueToday.iso,
        priority: "high",
        progress: 70,
        completed: false,
    },
    {
        id: "2",
        title: "Review Eigenvalue Problem Set",
        description: "Go through the practice problems before the next quiz.",
        courseCode: "MATH301",
        dueDate: dueToday.display,
        dueDateISO: dueToday.iso,
        priority: "medium",
        progress: 40,
        completed: false,
    },
    {
        id: "3",
        title: "Backpropagation Lab Report",
        description: "Write up results from the 2-layer network gradient experiment.",
        courseCode: "CS401",
        dueDate: tomorrow.display,
        dueDateISO: tomorrow.iso,
        priority: "high",
        progress: 20,
        completed: false,
    },
    {
        id: "4",
        title: "SQL Optimization Exercise",
        description: "Rewrite the three slow queries from lecture using proper indexes.",
        courseCode: "CS302",
        dueDate: in3.display,
        dueDateISO: in3.iso,
        priority: "medium",
        progress: 0,
        completed: false,
    },
    {
        id: "5",
        title: "Graph Traversal Practice Set",
        description: "Solve the BFS/DFS problem set and time each approach.",
        courseCode: "CS201",
        dueDate: in5.display,
        dueDateISO: in5.iso,
        priority: "low",
        progress: 10,
        completed: false,
    },
    {
        id: "6",
        title: "Discrete Math Final Prep",
        description: "Condense lecture notes into a one-page cheat sheet.",
        courseCode: "MATH201",
        dueDate: in6.display,
        dueDateISO: in6.iso,
        priority: "medium",
        progress: 55,
        completed: false,
    },
    {
        id: "7",
        title: "OS Scheduling Simulation",
        description: "Compare round robin vs priority scheduling on the sample workload.",
        courseCode: "CS305",
        dueDate: in10.display,
        dueDateISO: in10.iso,
        priority: "low",
        progress: 0,
        completed: false,
    },
    {
        id: "8",
        title: "Design Patterns Presentation",
        description: "Prepare slides covering three patterns used in the team project.",
        courseCode: "CS310",
        dueDate: in14.display,
        dueDateISO: in14.iso,
        priority: "low",
        progress: 5,
        completed: false,
    },
    {
        id: "9",
        title: "Probability Homework 4",
        description: "Problems covering binomial and Poisson distributions.",
        courseCode: "MATH210",
        dueDate: overdue1.display,
        dueDateISO: overdue1.iso,
        priority: "high",
        progress: 60,
        completed: false,
    },
    {
        id: "10",
        title: "CS201 Reading Reflection",
        description: "Short reflection on the assigned tree-balancing paper.",
        courseCode: "CS201",
        dueDate: overdue3.display,
        dueDateISO: overdue3.iso,
        priority: "medium",
        progress: 30,
        completed: false,
    },
    {
        id: "11",
        title: "Neural Net Quiz Prep",
        description: "Review chain rule examples ahead of the quiz.",
        courseCode: "CS401",
        dueDate: past7.display,
        dueDateISO: past7.iso,
        priority: "medium",
        progress: 100,
        completed: true,
    },
    {
        id: "12",
        title: "SQL Indexing Worksheet",
        description: "Practice worksheet on composite index tradeoffs.",
        courseCode: "CS302",
        dueDate: overdue1.display,
        dueDateISO: overdue1.iso,
        priority: "low",
        progress: 100,
        completed: true,
    },
    {
        id: "13",
        title: "Eigenvector Warm-up Set",
        description: "Five short warm-up problems before the review session.",
        courseCode: "MATH301",
        dueDate: dueToday.display,
        dueDateISO: dueToday.iso,
        priority: "low",
        progress: 100,
        completed: true,
    },
];

export function taskMatchesQuery(task: PlannerTask, query: string): boolean {
    const q = query.trim().toLowerCase();
    if (q === "") return true;

    return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.courseCode.toLowerCase().includes(q)
    );
}

/** Derives a status label from completed + due date — nothing about status is stored directly. */
export function getTaskStatus(task: PlannerTask): TaskStatus {
    if (task.completed) return "completed";
    if (task.dueDateISO < TODAY_ISO) return "overdue";
    if (task.dueDateISO === TODAY_ISO) return "due-today";
    return "upcoming";
}

/** "Today" / "Tomorrow" / "In 5 days" / "3 days ago", relative to the same `today` anchor
 *  used to generate the dummy due dates above. */
export function getRelativeDateLabel(dueDateISO: string): string {
    const due = new Date(`${dueDateISO}T00:00:00`);
    const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
}

/** One shared template, cycled by how far along the task's progress is — same approach
 *  as getNoteContent in data/notes.ts: generic dummy content rather than unique per task,
 *  since there's no real checklist authoring yet. */
const checklistTemplates = [
    "Review lecture notes and slides",
    "Draft an initial outline or solution",
    "Cross-check edge cases against course material",
    "Proofread and finalize before submitting",
];

export function getTaskChecklist(task: PlannerTask): ChecklistItem[] {
    const doneCount = task.completed
        ? checklistTemplates.length
        : Math.round((task.progress / 100) * checklistTemplates.length);

    return checklistTemplates.map((label, i) => ({
        id: `${task.id}-checklist-${i + 1}`,
        label,
        done: i < doneCount,
    }));
}