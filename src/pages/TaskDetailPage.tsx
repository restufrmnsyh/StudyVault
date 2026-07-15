import { useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, ArrowLeft, ListTodo, Pencil, Save, TrendingUp, X } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard, ProgressBar, ConfirmDialog } from "@/components/common";
import { TaskDetailHeader, ChecklistSection, RelatedResources } from "@/components/planner";
import { formatDateFromISO } from "@/data/planner";
import { courses } from "@/data/courses";
import { notes } from "@/data/notes";
import { priorityLabel, priorityStyle } from "@/constants/priority";
import { usePlanner } from "@/hooks/usePlanner";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types/planner";
import type { AssignmentPriority } from "@/types/courses";

interface TaskDetailPageProps {
    taskId: string;
}

type TaskDetailMode = "view" | "edit";

/** Draft values bound to the Edit Mode form fields, plus a separate checklist draft so
 *  Cancel can revert structural edits (add/remove/rename) without touching the store. */
interface TaskFieldsForm {
    title: string;
    description: string;
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

/** Shared input/textarea chrome — matches Note Edit Mode's fields rather than a new
 *  visual language for forms. */
const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

function buildFormFromTask(task: { title: string; description: string; dueDateISO: string; priority: AssignmentPriority; progress: number }): TaskFieldsForm {
    return {
        title: task.title,
        description: task.description,
        dueDateISO: task.dueDateISO,
        priority: task.priority,
        progress: task.progress,
    };
}

function checklistEqual(a: ChecklistItem[], b: ChecklistItem[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function TaskDetailPage({ taskId }: TaskDetailPageProps) {
    const { tasks, toggleChecklistItem, updateTask } = usePlanner();
    const { showToast } = useToast();
    const task = tasks.find((t) => t.id === taskId);

    // Edit Mode state only — the committed task now lives in PlannerContext (backed by
    // localStorage), so Planner Overview stays in sync the instant Save is pressed. This
    // mirrors NoteDetailPage's `form` + `useNotes()` split from the Notes module.
    const [mode, setMode] = useState<TaskDetailMode>("view");
    const [form, setForm] = useState<TaskFieldsForm | null>(null);
    const [draftChecklist, setDraftChecklist] = useState<ChecklistItem[] | null>(null);
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

    if (!task) {
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

    const isEditing = mode === "edit" && form !== null && draftChecklist !== null;

    const isDirty =
        isEditing &&
        form !== null &&
        draftChecklist !== null &&
        (form.title.trim() !== task.title ||
            form.description.trim() !== task.description ||
            form.dueDateISO !== task.dueDateISO ||
            form.priority !== task.priority ||
            form.progress !== task.progress ||
            !checklistEqual(draftChecklist, task.checklist));

    function startEdit() {
        setForm(buildFormFromTask(task!));
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

    function handleSave() {
        if (!form || !draftChecklist || form.title.trim() === "") return;
        updateTask(task!.id, {
            title: form.title.trim(),
            description: form.description.trim(),
            dueDateISO: form.dueDateISO,
            dueDate: formatDateFromISO(form.dueDateISO),
            priority: form.priority,
            progress: form.progress,
            checklist: draftChecklist,
        });
        exitEditMode();
        showToast("Task saved locally");
    }

    // View-mode checklist toggle dispatches straight to PlannerContext (synced + persisted
    // immediately). Edit-mode toggle mutates the local draft instead, so Cancel can revert it.
    function toggleChecklistItemHandler(id: string) {
        if (isEditing && draftChecklist) {
            setDraftChecklist((prev) => prev!.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
        } else {
            toggleChecklistItem(task!.id, id);
        }
    }

    function renameChecklistItem(id: string, label: string) {
        setDraftChecklist((prev) => (prev ? prev.map((item) => (item.id === id ? { ...item, label } : item)) : prev));
    }

    function addChecklistItem(label: string) {
        setDraftChecklist((prev) =>
            prev ? [...prev, { id: `${task!.id}-checklist-new-${Date.now()}`, label, done: false }] : prev,
        );
    }

    function removeChecklistItem(id: string) {
        setDraftChecklist((prev) => (prev ? prev.filter((item) => item.id !== id) : prev));
    }

    const relatedCourse = courses.find((c) => c.code === task.courseCode);
    const relatedNotes = notes.filter((n) => n.courseCode === task.courseCode && !n.archived).slice(0, 3);

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Back button */}
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
                                {relatedCourse?.name ?? task.courseCode}
                            </span>

                            <div className="mt-2.5">
                                <label htmlFor="task-title" className="sr-only">
                                    Task title
                                </label>
                                <input
                                    id="task-title"
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Task title"
                                    className={cn(fieldClassName, "text-xl font-bold tracking-tight sm:text-2xl")}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="task-due-date" className="mb-1.5 block text-[11px] font-medium text-text-muted">
                                        Due date
                                    </label>
                                    <input
                                        id="task-due-date"
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
                                className="absolute top-5 right-5 flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[12px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400 sm:top-6 sm:right-6"
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
                                    <label htmlFor="task-description" className="sr-only">
                                        Task description
                                    </label>
                                    <textarea
                                        id="task-description"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        placeholder="Describe this task..."
                                        rows={4}
                                        className={cn(fieldClassName, "resize-y text-[14px] leading-relaxed")}
                                    />
                                </>
                            ) : (
                                <p className="text-[14px] leading-relaxed text-text-secondary">{task.description}</p>
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
                                        <label htmlFor="task-progress" className="text-text-muted">
                                            Drag to update progress
                                        </label>
                                        <span className="font-medium tabular-nums text-text-primary">{form.progress}%</span>
                                    </div>
                                    <input
                                        id="task-progress"
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
                    <RelatedResources course={relatedCourse} relatedNotes={relatedNotes} />
                </motion.div>

                {/* Footer actions — only shown while editing; "Edit Task" itself lives in the header */}
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
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary"
                        >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={form?.title.trim() === ""}
                            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                            <Save className="h-3.5 w-3.5" />
                            Save Changes
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