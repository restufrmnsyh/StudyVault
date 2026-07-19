import { cn } from "@/lib/utils";
import { priorityLabel, priorityStyle } from "@/constants/priority";
import type { Course, AssignmentPriority } from "@/types/courses";

export interface TaskFormValues {
    courseId: string;
    title: string;
    /** ISO date string (YYYY-MM-DD), bound directly to <input type="date">. */
    dueDate: string;
    priority: AssignmentPriority;
    description: string;
}

export interface TaskFormErrors {
    courseId?: string;
    title?: string;
    dueDate?: string;
}


interface TaskFormProps {
    values: TaskFormValues;
    errors: TaskFormErrors;
    onChange: (values: TaskFormValues) => void;
    disabled?: boolean;
    /** Course list from useCourses() (Supabase) — used to populate the course selector. */
    courses: Course[];
}

/** Shared input chrome — matches the field style in TaskDetailPage Edit Mode. */
const fieldCls =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

/** Reusable controlled form-field set for creating a planner task.
 *  Follows the same prop shape as NoteForm / CourseForm so CreateTaskModal
 *  can wire it without any extra state management. */
export function TaskForm({ values, errors, onChange, disabled = false, courses }: TaskFormProps) {
    return (
        <div className="space-y-4">
            {/* Course */}
            <div>
                <label htmlFor="task-form-course" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Course <span className="text-rose-400">*</span>
                </label>
                <select
                    id="task-form-course"
                    value={values.courseId}
                    onChange={(e) => onChange({ ...values, courseId: e.target.value })}
                    disabled={disabled}
                    className={cn(fieldCls, values.courseId === "" && "text-text-muted")}
                >
                    <option value="">Select a course…</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.code} — {course.name}
                        </option>
                    ))}
                </select>
                {errors.courseId && <p className="mt-1 text-[11.5px] text-rose-400">{errors.courseId}</p>}
            </div>

            {/* Title */}
            <div>
                <label htmlFor="task-form-title" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Title <span className="text-rose-400">*</span>
                </label>
                <input
                    id="task-form-title"
                    type="text"
                    value={values.title}
                    onChange={(e) => onChange({ ...values, title: e.target.value })}
                    placeholder="e.g. Submit BST Assignment"
                    disabled={disabled}
                    className={fieldCls}
                />
                {errors.title && <p className="mt-1 text-[11.5px] text-rose-400">{errors.title}</p>}
            </div>

            {/* Due date + Priority */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="task-form-due-date" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                        Due date <span className="text-rose-400">*</span>
                    </label>
                    <input
                        id="task-form-due-date"
                        type="date"
                        value={values.dueDate}
                        onChange={(e) => onChange({ ...values, dueDate: e.target.value })}
                        disabled={disabled}
                        className={fieldCls}
                    />
                    {errors.dueDate && <p className="mt-1 text-[11.5px] text-rose-400">{errors.dueDate}</p>}
                </div>

                <div>
                    <span className="mb-1.5 block text-[12px] font-medium text-text-muted">Priority</span>
                    <div className="flex gap-2">
                        {(["high", "medium", "low"] as const).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onChange({ ...values, priority: p })}
                                aria-pressed={values.priority === p}
                                disabled={disabled}
                                className={cn(
                                    "flex-1 rounded-lg border px-2 py-2 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                                    values.priority === p
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

            {/* Description */}
            <div>
                <label htmlFor="task-form-description" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Description{" "}
                    <span className="text-[11px] text-text-muted/50">(optional)</span>
                </label>
                <textarea
                    id="task-form-description"
                    value={values.description}
                    onChange={(e) => onChange({ ...values, description: e.target.value })}
                    placeholder="Describe this task…"
                    rows={3}
                    disabled={disabled}
                    className={cn(fieldCls, "resize-y leading-relaxed")}
                />
            </div>
        </div>
    );
}
