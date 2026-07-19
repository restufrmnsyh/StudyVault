import { useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, ArrowLeft, ListTodo, Loader2, Pencil, Save, TrendingUp, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard, ProgressBar, ConfirmDialog } from "@/components/common";
import { TaskDetailHeader, ChecklistSection, RelatedResources } from "@/components/planner";
import { usePlannerTask } from "@/hooks/queries/usePlannerTask";
import { useCourses } from "@/hooks/queries/useCourses";
import { useNotes } from "@/hooks/queries/useNotes";
import { replaceTaskChecklist } from "@/services/planner.service";
import { useToast } from "@/hooks/useToast";
import { priorityLabel, priorityStyle } from "@/constants/priority";
import { cn } from "@/lib/utils";
import type { ChecklistItemRecord } from "@/services/planner.service";
import type { AssignmentPriority } from "@/types/courses";

interface TaskDetailPageProps {
    taskId: string;
}

type TaskDetailMode = "view" | "edit";

/** Draft values bound to the Edit Mode form fields. Keeps `dueDateISO` as the local
 *  key name (matching the <input type="date"> binding) and maps to `dueDate` on save. */
interface TaskFieldsForm {
    title: string;
    description: string;
    /** ISO date (YYYY-MM-DD) — maps to UpdatePlannerTaskInput.dueDate on save. */
    dueDateISO: string;
    priority: AssignmentPriority;
    progress: number;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

/** Shared input/textarea chrome — unchanged from the original TaskDetailPage. */
const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

function checklistEqual(a: ChecklistItemRecord[], b: ChecklistItemRecord[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function TaskDetailPage({ taskId }: TaskDetailPageProps) {
    const { data: task, loading, error, refresh, updateTask, toggleChecklistItem } = usePlannerTask(taskId);
    const { data: courses } = useCourses();
    const { data: allNotes } = useNotes();
    const { showToast } = useToast();

    const [mode, setMode] = useState<TaskDetailMode>("view");
    const [form, setForm] = useState<TaskFieldsForm | null>(null);
    const [draftChecklist, setDraftChecklist] = useState<ChecklistItemRecord[] | null>(null);
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    // ── Loading / not-found states ────────────────────────────────────────────

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                </div>
            </DashboardLayout>
        );
    }

    if (error || !task) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                    <ListTodo className="h-8 w-8 text-text-muted" />
                    <p className="text-[14px] font-medium text-text-primary">Task not found</p>
                    <a
                        href="#/dashboard/planner"
                        className="text-[13px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                        Back to Planner
                    </a>
                </div>
            </DashboardLayout>
        );
    }

    // ── Derived data ──────────────────────────────────────────────────────────

    const relatedCourse = courses.find((c) => c.id === task.courseId);
    const relatedNotes = allNotes.filter((n) => n.courseId === task.courseId).slice(0, 3);

    // ── Edit mode helpers ─────────────────────────────────────────────────────

    const isEditing = mode === "edit" && form !== null && draftChecklist !== null;

    const isDirty =
        isEditing &&
        form !== null &&
        draftChecklist !== null &&
        (form.title.trim() !== task.title ||
            form.description.trim() !== (task.description ?? "") ||
            form.dueDateISO !== task.dueDate ||
            form.priority !== task.priority ||
            form.progress !== task.progress ||
            !checklistEqual(draftChecklist, task.checklist));

    function startEdit() {
        setForm({
            title: task!.title,
            description: task!.description ?? "",
            dueDateISO: task!.dueDate, // PlannerTaskRecord.dueDate is the ISO field
            priority: task!.priority,
            progress: task!.progress,
        });
        setDraftChecklist([...task!.checklist]);
        setMode("edit");
    }

    function exitEditMode() {
        setForm(null);
        setDraftChecklist(null);
        setMode("view");
        setShowDiscardConfirm(false);
    }

    function handleCancel() {
        if (isDirty) {
            setShowDiscardConfirm(true);
        } else {
            exitEditMode();
        }
    }

    async function handleSave() {
        if (!form || !draftChecklist || form.title.trim() === "" || saving) return;

        setSaving(true);
        try {
            // 1. Save scalar fields — updateTask() replaces hook data with the returned record.
            await updateTask({
                title: form.title.trim(),
                description: form.description.trim() || null,
                dueDate: form.dueDateISO,
                priority: form.priority,
                progress: form.progress,
            });

            // 2. Save checklist structure if it changed — separate table (task_checklist).
            if (!checklistEqual(draftChecklist, task!.checklist)) {
                await replaceTaskChecklist(task!.id, draftChecklist);
            }

            // 3. Re-fetch so hook data reflects the final persisted state (especially
            //    the rebuilt checklist positions after replaceTaskChecklist).
            await refresh();

            exitEditMode();
            showToast("Task saved.");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to save task.", "error");
        } finally {
            setSaving(false);
        }
    }

    // View-mode toggle dispatches to Supabase via usePlannerTask (optimistic).
    // Edit-mode toggle mutates the local draft so Cancel can revert structural edits.
    function toggleChecklistItemHandler(id: string) {
        if (isEditing && draftChecklist) {
            setDraftChecklist((prev) => prev!.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
        } else {
            void toggleChecklistItem(id);
        }
    }

    function renameChecklistItem(id: string, label: string) {
        setDraftChecklist((prev) => (prev ? prev.map((item) => (item.id === id ? { ...item, label } : item)) : prev));
    }

    function addChecklistItem(label: string) {
        setDraftChecklist((prev) =>
            prev
                ? [
                    ...prev,
                    {
                        id: `${task!.id}-checklist-new-${Date.now()}`,
                        label,
                        done: false,
                        position: prev.length,
                    },
                ]
                : prev,
        );
    }

    function removeChecklistItem(id: string) {
        setDraftChecklist((prev) => (prev ? prev.filter((item) => item.id !== id) : prev));
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Back link */}
                <a
                    href="#/dashboard/planner"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Planner
                </a>

                {/* Header (title, course, priority, status, due date) */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="relative">
                    {isEditing && form ? (
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
                            <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                {relatedCourse?.name ?? task.courseId}
                            </span>

                            <div className="mt-2.5">
                                <label htmlFor="task-edit-title" className="sr-only">
                                    Task title
                                </label>
                                <input
                                    id="task-edit-title"
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Task title"
                                    className={cn(fieldClassName, "text-xl font-bold tracking-tight sm:text-2xl")}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="task-edit-due-date"
                                        className="mb-1.5 block text-[11px] font-medium text-text-muted"
                                    >
                                        Due date
                                    </label>
                                    <input
                                        id="task-edit-due-date"
                                        type="date"
                                        value={form.dueDateISO}
                                        onChange={(e) => setForm({ ...form, dueDateISO: e.target.value })}
                                        className={cn(fieldClassName, "text-[13px]")}
                                    />
                                </div>
                                <div>
                                    <span className="mb-1.5 block text-[11px] font-medium text-text-muted">Priority</span>
                                    <div className="flex gap-2">
                                        {(["high", "medium", "low"] as const).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setForm({ ...form, priority: p })}
                                                aria-pressed={form.priority === p}
                                                className={cn(
                                                    "flex-1 rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors",
                                                    form.priority === p
                                                        ? cn("border-transparent", priorityStyle[p])
                                                        : "border-white/[0.06] bg-white/[0.02] text-text-muted hover:border-white/[0.1]",
                                                )}
                                            >
                                                {priorityLabel[p]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <TaskDetailHeader task={task} courseName={relatedCourse?.name} />
                            <button
                                type="button"
                                onClick={startEdit}
                                className="
        mt-4
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-white/[0.06]
        bg-white/[0.02]
        px-4
        py-2.5
        text-[13px]
        font-medium
        text-text-muted
        transition-colors
        hover:border-violet-500/30
        hover:text-violet-400

        lg:absolute
        lg:top-6
        lg:right-6
        lg:mt-0
        lg:w-auto
        lg:px-3
        lg:py-2
"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Task
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Description */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                    <SectionCard icon={AlignLeft} title={isEditing ? "Edit Description" : "Description"}>
                        <div className="p-5 sm:p-6">
                            {isEditing && form ? (
                                <>
                                    <label htmlFor="task-edit-description" className="sr-only">
                                        Task description
                                    </label>
                                    <textarea
                                        id="task-edit-description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Describe this task..."
                                        rows={4}
                                        className={cn(fieldClassName, "resize-y text-[14px] leading-relaxed")}
                                    />
                                </>
                            ) : (
                                <p className="text-[14px] leading-relaxed text-text-secondary">
                                    {task.description ?? "No description provided."}
                                </p>
                            )}
                        </div>
                    </SectionCard>
                </motion.div>

                {/* Progress */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <SectionCard icon={TrendingUp} title={isEditing ? "Edit Progress" : "Progress"}>
                        <div className="p-5 sm:p-6">
                            {isEditing && form ? (
                                <>
                                    <div className="mb-2 flex items-center justify-between text-[12px]">
                                        <label htmlFor="task-edit-progress" className="text-text-muted">
                                            Drag to update progress
                                        </label>
                                        <span className="font-medium tabular-nums text-text-primary">{form.progress}%</span>
                                    </div>
                                    <input
                                        id="task-edit-progress"
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={5}
                                        value={form.progress}
                                        onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                                        className="w-full accent-violet-500"
                                    />
                                    <ProgressBar progress={form.progress} className="mt-3" />
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <ProgressBar progress={task.progress} className="flex-1" />
                                    <span className="w-10 flex-shrink-0 text-right text-[13px] font-semibold tabular-nums text-text-primary">
                                        {task.progress}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </SectionCard>
                </motion.div>

                {/* Checklist */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
                    <ChecklistSection
                        items={isEditing && draftChecklist ? draftChecklist : task.checklist}
                        onToggle={toggleChecklistItemHandler}
                        editable={isEditing}
                        onRename={renameChecklistItem}
                        onAdd={addChecklistItem}
                        onRemove={removeChecklistItem}
                    />
                </motion.div>

                {/* Related Course, Related Notes, Attachments */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <RelatedResources course={relatedCourse} relatedNotes={relatedNotes} courses={courses} />
                </motion.div>

                {/* Footer actions — shown only while editing */}
                {isEditing && (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.25 }}
                        className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-end"
                    >
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleSave()}
                            disabled={form?.title.trim() === "" || saving}
                            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                            {saving ? (
                                <span className="h-3.5 w-3.5 flex-shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <Save className="h-3.5 w-3.5" />
                            )}
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </motion.div>
                )}
            </div>

            <ConfirmDialog
                open={showDiscardConfirm}
                title="Discard unsaved changes?"
                description="You have unsaved edits to this task. Discarding will return to the last saved content."
                confirmLabel="Discard changes"
                cancelLabel="Keep editing"
                destructive
                onConfirm={exitEditMode}
                onCancel={() => setShowDiscardConfirm(false)}
            />
        </DashboardLayout>
    );
}