import { cn } from "@/lib/utils";
import type { Course } from "@/types/courses";

export interface NoteFormValues {
    courseId: string;
    title: string;
    content: string;
    tagsText: string;
    favorite: boolean;
    archived: boolean;
}

export type NoteFormErrors = Partial<Record<"courseId" | "title" | "content", string>>;

interface NoteFormProps {
    values: NoteFormValues;
    errors: NoteFormErrors;
    courses: Course[];
    onChange: (values: NoteFormValues) => void;
    disabled?: boolean;
}

const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60";

const errorFieldClassName = "border-rose-500/40 focus:border-rose-500/50 focus:ring-rose-500/15";

export function NoteForm({ values, errors, courses, onChange, disabled = false }: NoteFormProps) {
    function set<K extends keyof NoteFormValues>(key: K, value: NoteFormValues[K]) {
        onChange({ ...values, [key]: value });
    }

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="note-course" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Course <span className="text-rose-400">*</span>
                </label>
                <select
                    id="note-course"
                    value={values.courseId}
                    onChange={(e) => set("courseId", e.target.value)}
                    disabled={disabled}
                    className={cn(fieldClassName, errors.courseId && errorFieldClassName)}
                >
                    <option value="" disabled className="bg-zinc-900 text-white">
                        Select course
                    </option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id} className="bg-zinc-900 text-white">
                            {course.code} — {course.name}
                        </option>
                    ))}
                </select>
                {errors.courseId && <p className="mt-1.5 text-[12px] text-rose-400">{errors.courseId}</p>}
            </div>

            <div>
                <label htmlFor="note-title" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Title <span className="text-rose-400">*</span>
                </label>
                <input
                    id="note-title"
                    type="text"
                    value={values.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Binary Search Trees — Insertion"
                    disabled={disabled}
                    className={cn(fieldClassName, errors.title && errorFieldClassName)}
                />
                {errors.title && <p className="mt-1.5 text-[12px] text-rose-400">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="note-content" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Content <span className="text-rose-400">*</span>
                </label>
                <textarea
                    id="note-content"
                    value={values.content}
                    onChange={(e) => set("content", e.target.value)}
                    placeholder="Write your note body content here..."
                    rows={6}
                    disabled={disabled}
                    className={cn(fieldClassName, "resize-y", errors.content && errorFieldClassName)}
                />
                {errors.content && <p className="mt-1.5 text-[12px] text-rose-400">{errors.content}</p>}
            </div>

            <div>
                <label htmlFor="note-tags" className="mb-1.5 block text-[12px] font-medium text-text-muted">
                    Tags <span className="text-[11px] text-text-muted font-normal">(comma-separated)</span>
                </label>
                <input
                    id="note-tags"
                    type="text"
                    value={values.tagsText}
                    onChange={(e) => set("tagsText", e.target.value)}
                    placeholder="e.g. algorithms, study-guide, math"
                    disabled={disabled}
                    className={fieldClassName}
                />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input
                        type="checkbox"
                        checked={values.favorite}
                        onChange={(e) => set("favorite", e.target.checked)}
                        disabled={disabled}
                        className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600 peer-checked:after:bg-white peer-checked:after:border-white" />
                    <span className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        Mark as Favorite
                    </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input
                        type="checkbox"
                        checked={values.archived}
                        onChange={(e) => set("archived", e.target.checked)}
                        disabled={disabled}
                        className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-zinc-800 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-500/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600 peer-checked:after:bg-white peer-checked:after:border-white" />
                    <span className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        Archive immediately
                    </span>
                </label>
            </div>
        </div>
    );
}
