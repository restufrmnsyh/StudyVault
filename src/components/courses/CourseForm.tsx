import { Check } from "lucide-react";
import { courseAccentColors, semesterOptions } from "@/constants/courses";
import { cn } from "@/lib/utils";

export interface CourseFormValues {
    name: string;
    code: string;
    lecturer: string;
    /** "" means "not selected yet" — kept as a string since that's what a <select>
     *  element works with; parsed to a number by the caller on submit. */
    semester: string;
    description: string;
    color: string;
}

export type CourseFormErrors = Partial<Record<"name" | "code" | "semester", string>>;

interface CourseFormProps {
    values: CourseFormValues;
    errors: CourseFormErrors;
    onChange: (values: CourseFormValues) => void;
    disabled?: boolean;
}

/** Matches the exact input/textarea chrome already established in Note/Task Edit Mode
 *  (see pages/TaskDetailPage.tsx's fieldClassName), so this form doesn't introduce a
 *  visually distinct third style for the same kind of control. */
const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

const errorFieldClassName = "border-rose-500/40 focus:border-rose-500/50 focus:ring-rose-500/15";

/**
 * Reusable field set for creating (and, later, editing) a course. Deliberately has no
 * knowledge of Supabase, modals, or submit handling — it just renders controlled inputs
 * and reports changes upward, so CreateCourseModal owns all of that instead.
 */
export function CourseForm({ values, errors, onChange, disabled = false }: CourseFormProps) {
    function set<K extends keyof CourseFormValues>(key: K, value: CourseFormValues[K]) {
        onChange({ ...values, [key]: value });
    }

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="course-name" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Course Name <span className="text-rose-400">*</span>
                </label>
                <input
                    id="course-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                    disabled={disabled}
                    className={cn(fieldClassName, errors.name && errorFieldClassName)}
                />
                {errors.name && <p className="mt-1.5 text-[12px] text-rose-400">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="course-code" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                        Course Code <span className="text-rose-400">*</span>
                    </label>
                    <input
                        id="course-code"
                        type="text"
                        value={values.code}
                        onChange={(e) => set("code", e.target.value)}
                        placeholder="e.g. CS201"
                        disabled={disabled}
                        className={cn(fieldClassName, errors.code && errorFieldClassName)}
                    />
                    {errors.code && <p className="mt-1.5 text-[12px] text-rose-400">{errors.code}</p>}
                </div>

                <div>
                    <label htmlFor="course-semester" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                        Semester <span className="text-rose-400">*</span>
                    </label>
                    <select
                        id="course-semester"
                        value={values.semester}
                        onChange={(e) => set("semester", e.target.value)}
                        disabled={disabled}
                        className={cn(fieldClassName, errors.semester && errorFieldClassName)}
                    >
                        <option
                            value=""
                            disabled
                            className="bg-zinc-900 text-white"
                        >
                            Select semester
                        </option>

                        {semesterOptions.map((n) => (
                            <option
                                key={n}
                                value={n}
                                className="bg-zinc-900 text-white"
                            >
                                Semester {n}
                            </option>
                        ))}
                    </select>
                    {errors.semester && <p className="mt-1.5 text-[12px] text-rose-400">{errors.semester}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="course-lecturer" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Lecturer
                </label>
                <input
                    id="course-lecturer"
                    type="text"
                    value={values.lecturer}
                    onChange={(e) => set("lecturer", e.target.value)}
                    placeholder="e.g. Dr. Sarah Johnson"
                    disabled={disabled}
                    className={fieldClassName}
                />
            </div>

            <div>
                <label htmlFor="course-description" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Description
                </label>
                <textarea
                    id="course-description"
                    value={values.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="What this course covers..."
                    rows={3}
                    disabled={disabled}
                    className={cn(fieldClassName, "resize-y")}
                />
            </div>

            <div>
                <span className="mb-1.5 block text-[12px] font-medium text-text-muted">Accent Color</span>
                <div className="flex flex-wrap gap-2.5">
                    {courseAccentColors.map((color) => {
                        const selected = values.color === color;
                        return (
                            <button
                                key={color}
                                type="button"
                                disabled={disabled}
                                onClick={() => set("color", color)}
                                aria-label={`Accent color ${color}`}
                                aria-pressed={selected}
                                className={cn(
                                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-sm transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                                    color,
                                    selected ? "scale-110 ring-2 ring-white/70 ring-offset-2 ring-offset-zinc-900" : "hover:scale-105",
                                )}
                            >
                                {selected && <Check className="h-3.5 w-3.5 text-white" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}