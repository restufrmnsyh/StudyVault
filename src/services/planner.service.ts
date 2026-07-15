import { supabase } from "@/lib/supabase";
import type { AssignmentPriority } from "@/types/courses";

/** Raw shape of a `task_checklist` row (migration.sql section 2.5). */
interface ChecklistItemRow {
    id: string;
    user_id: string;
    task_id: string;
    label: string;
    done: boolean;
    position: number;
    created_at: string;
    updated_at: string;
}

/** Raw shape of a `planner_tasks` row, with its checklist embedded via a nested
 *  select (`task_checklist(*)`) rather than a second round trip per task. */
interface PlannerTaskRow {
    id: string;
    user_id: string;
    course_id: string;
    title: string;
    description: string | null;
    due_date: string;
    priority: AssignmentPriority;
    progress: number;
    completed: boolean;
    created_at: string;
    updated_at: string;
    task_checklist: ChecklistItemRow[];
}

export interface ChecklistItemRecord {
    id: string;
    label: string;
    done: boolean;
    position: number;
}

export interface PlannerTaskRecord {
    id: string;
    courseId: string;
    title: string;
    description: string | null;
    /** ISO date string (YYYY-MM-DD), as stored — display formatting stays a frontend
     *  concern, same convention the migration's column comment calls out. */
    dueDate: string;
    priority: AssignmentPriority;
    progress: number;
    completed: boolean;
    checklist: ChecklistItemRecord[];
    createdAt: string;
    updatedAt: string;
}

function mapChecklistItem(row: ChecklistItemRow): ChecklistItemRecord {
    return {
        id: row.id,
        label: row.label,
        done: row.done,
        position: row.position,
    };
}

function mapPlannerTask(row: PlannerTaskRow): PlannerTaskRecord {
    return {
        id: row.id,
        courseId: row.course_id,
        title: row.title,
        description: row.description,
        dueDate: row.due_date,
        priority: row.priority,
        progress: row.progress,
        completed: row.completed,
        checklist: (row.task_checklist ?? []).map(mapChecklistItem),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const TASK_SELECT_WITH_CHECKLIST = "*, task_checklist(*)";

/** Fetches every planner task owned by the signed-in user, due date ascending, each
 *  with its checklist items embedded (ordered by their explicit `position`). RLS scopes
 *  this to the caller — see course.service.ts for why no user_id filter is needed. */
export async function getPlannerTasks(): Promise<PlannerTaskRecord[]> {
    const { data, error } = await supabase
        .from("planner_tasks")
        .select(TASK_SELECT_WITH_CHECKLIST)
        .order("due_date", { ascending: true })
        .order("position", { referencedTable: "task_checklist", ascending: true })
        .returns<PlannerTaskRow[]>();

    if (error) {
        throw new Error(error.message);
    }

    return (data ?? []).map(mapPlannerTask);
}

/** Fetches a single planner task by id, checklist included. Returns null if it
 *  doesn't exist or isn't owned by the signed-in user. */
export async function getPlannerTaskById(id: string): Promise<PlannerTaskRecord | null> {
    const { data, error } = await supabase
        .from("planner_tasks")
        .select(TASK_SELECT_WITH_CHECKLIST)
        .eq("id", id)
        .order("position", { referencedTable: "task_checklist", ascending: true })
        .maybeSingle<PlannerTaskRow>();

    if (error) {
        throw new Error(error.message);
    }

    return data ? mapPlannerTask(data) : null;
}