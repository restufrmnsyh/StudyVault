import { useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, X } from "lucide-react";
import { TaskForm, type TaskFormValues, type TaskFormErrors } from "@/components/planner/TaskForm";
import { useToast } from "@/hooks/useToast";
import type { Course } from "@/types/courses";
import type { CreatePlannerTaskInput, PlannerTaskRecord } from "@/services/planner.service";

interface CreateTaskModalProps {
    open: boolean;
    onClose: () => void;
    /** Passed from PlannerPage — sourced from usePlanner().createTask so the list
     *  updates optimistically without a second source of truth. */
    onCreate: (input: CreatePlannerTaskInput) => Promise<PlannerTaskRecord>;
    /** Passed from PlannerPage — sourced from useCourses().data (Supabase). */
    courses: Course[];
}

const INITIAL_VALUES: TaskFormValues = {
    courseId: "",
    title: "",
    dueDate: "",
    priority: "medium",
    description: "",
};

function validate(values: TaskFormValues): TaskFormErrors {
    const errors: TaskFormErrors = {};
    if (values.courseId.trim() === "") errors.courseId = "Course selection is required.";
    if (values.title.trim() === "") errors.title = "Task title is required.";
    if (values.dueDate.trim() === "") errors.dueDate = "Due date is required.";
    return errors;
}

export function CreateTaskModal({ open, onClose, onCreate, courses }: CreateTaskModalProps) {
    const { showToast } = useToast();
    const [values, setValues] = useState<TaskFormValues>(INITIAL_VALUES);
    const [errors, setErrors] = useState<TaskFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    // Reset form state whenever the modal opens — mirrors CreateNoteModal's pattern
    // of deferring the reset by one tick so exit animations don't see a blank form.
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setValues(INITIAL_VALUES);
                setErrors({});
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [open]);

    function handleClose() {
        if (submitting) return;
        setValues(INITIAL_VALUES);
        setErrors({});
        onClose();
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitting(true);
        try {
            await onCreate({
                courseId: values.courseId,
                title: values.title.trim(),
                description: values.description.trim(),
                dueDate: values.dueDate,
                priority: values.priority,
            });
            showToast("Task created.", "success");
            setValues(INITIAL_VALUES);
            setErrors({});
            onClose();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to create task.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Dialog panel */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-task-modal-title"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                                    <ListTodo className="h-4 w-4" />
                                </div>
                                <div className="pt-0.5">
                                    <h2 id="create-task-modal-title" className="text-[15px] font-semibold text-text-primary">
                                        Create Task
                                    </h2>
                                    <p className="mt-0.5 text-[12.5px] text-text-muted">Add a new task to your planner.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close dialog"
                                disabled={submitting}
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                                <TaskForm
                                    values={values}
                                    errors={errors}
                                    onChange={setValues}
                                    disabled={submitting}
                                    courses={courses}
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2.5 border-t border-zinc-800 px-5 py-4 sm:px-6">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={submitting}
                                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-4 py-2 text-[13px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
                                >
                                    {submitting && (
                                        <span className="h-3.5 w-3.5 flex-shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    )}
                                    {submitting ? "Creating…" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
