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

// ─── Sprint 6.7.1 — Write operations ─────────────────────────────────────────

export interface CreatePlannerTaskInput {
    courseId: string;
    title: string;
    description: string;
    /** ISO date string (YYYY-MM-DD). */
    dueDate: string;
    priority: AssignmentPriority;
}

export interface UpdatePlannerTaskInput {
    title?: string;
    description?: string | null;
    /** ISO date string (YYYY-MM-DD). */
    dueDate?: string;
    priority?: AssignmentPriority;
    /** 0–100 */
    progress?: number;
    completed?: boolean;
}

/** Inserts a new task for the signed-in user and returns the full record (with
 *  an empty checklist — structural checklist edits go through replaceTaskChecklist). */
export async function createPlannerTask(input: CreatePlannerTaskInput): Promise<PlannerTaskRecord> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated.");

    const { data, error } = await supabase
        .from("planner_tasks")
        .insert({
            user_id: user.id,
            course_id: input.courseId,
            title: input.title,
            description: input.description || null,
            due_date: input.dueDate,
            priority: input.priority,
            progress: 0,
            completed: false,
        })
        .select(TASK_SELECT_WITH_CHECKLIST)
        .single<PlannerTaskRow>();

    if (error) throw new Error(error.message);
    return mapPlannerTask(data);
}

/** Updates scalar fields on an existing task and returns the refreshed record
 *  (including its current checklist). Only the fields present in `input` are written. */
export async function updatePlannerTask(id: string, input: UpdatePlannerTaskInput): Promise<PlannerTaskRecord> {
    const changes: Record<string, unknown> = {};
    if (input.title !== undefined) changes.title = input.title;
    if (input.description !== undefined) changes.description = input.description;
    if (input.dueDate !== undefined) changes.due_date = input.dueDate;
    if (input.priority !== undefined) changes.priority = input.priority;
    if (input.progress !== undefined) changes.progress = input.progress;
    if (input.completed !== undefined) changes.completed = input.completed;

    const { data, error } = await supabase
        .from("planner_tasks")
        .update(changes)
        .eq("id", id)
        .select(TASK_SELECT_WITH_CHECKLIST)
        .single<PlannerTaskRow>();

    if (error) throw new Error(error.message);
    return mapPlannerTask(data);
}

/** Replaces all checklist items for a task with the provided list.
 *  Performs a delete-then-insert pair; positions are derived from the array index.
 *  Use this when the user saves structural checklist edits (add/remove/rename) from
 *  Task Edit Mode — `toggleChecklistItemDone` handles single-item done toggles. */
export async function replaceTaskChecklist(taskId: string, items: ChecklistItemRecord[]): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated.");

    const { error: deleteError } = await supabase.from("task_checklist").delete().eq("task_id", taskId);
    if (deleteError) throw new Error(deleteError.message);

    if (items.length === 0) return;

    const { error: insertError } = await supabase.from("task_checklist").insert(
        items.map((item, index) => ({
            user_id: user.id,
            task_id: taskId,
            label: item.label,
            done: item.done,
            position: index,
        })),
    );
    if (insertError) throw new Error(insertError.message);
}

/** Flips the `done` flag on a single checklist item — used by view-mode checklist
 *  toggles in TaskDetailPage without requiring a full checklist replace. */
export async function toggleChecklistItemDone(itemId: string, newDone: boolean): Promise<void> {
    const { error } = await supabase.from("task_checklist").update({ done: newDone }).eq("id", itemId);
    if (error) throw new Error(error.message);
}