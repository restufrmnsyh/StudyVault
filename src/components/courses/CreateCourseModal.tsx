import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookPlus, X } from "lucide-react";
import { CourseForm, type CourseFormErrors, type CourseFormValues } from "@/components/courses/CourseForm";
import { EMPTY_COURSE_FORM_VALUES } from "@/constants/courses";
import type { CreateCourseInput } from "@/services/course.service";
import type { Course } from "@/types/courses";
import { useToast } from "@/hooks/useToast";

interface CreateCourseModalProps {
    open: boolean;
    onClose: () => void;
    /** Passed in rather than calling useCourses() internally — the modal is opened from
     *  the Dashboard, which already owns one useCourses() instance (shared with Hero's
     *  stat count), so create must go through that same instance for the count to
     *  update live. A second internal instance here would update state nobody reads. */
    onCreate: (input: CreateCourseInput) => Promise<Course>;
}

function validate(values: CourseFormValues): CourseFormErrors {
    const errors: CourseFormErrors = {};
    if (values.name.trim() === "") errors.name = "Course name is required.";
    if (values.code.trim() === "") errors.code = "Course code is required.";
    if (values.semester === "") errors.semester = "Semester is required.";
    return errors;
}

export function CreateCourseModal({ open, onClose, onCreate }: CreateCourseModalProps) {
    const { showToast } = useToast();
    const [values, setValues] = useState<CourseFormValues>(EMPTY_COURSE_FORM_VALUES);
    const [errors, setErrors] = useState<CourseFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    function handleClose() {
        if (submitting) return; // don't let the backdrop/X interrupt an in-flight request
        setValues(EMPTY_COURSE_FORM_VALUES);
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
            const course = await onCreate({
                name: values.name.trim(),
                code: values.code.trim(),
                lecturer: values.lecturer.trim(),
                semester: Number(values.semester),
                description: values.description.trim(),
                color: values.color,
            });
            showToast(`"${course.name}" was created.`, "success");
            setValues(EMPTY_COURSE_FORM_VALUES);
            setErrors({});
            onClose();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to create course.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-course-title"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                                    <BookPlus className="h-4 w-4" />
                                </div>
                                <div className="pt-0.5">
                                    <h2 id="create-course-title" className="text-[15px] font-semibold text-text-primary">
                                        Create Course
                                    </h2>
                                    <p className="mt-0.5 text-[12.5px] text-text-muted">Add a new course to your workspace.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close"
                                disabled={submitting}
                                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                                <CourseForm values={values} errors={errors} onChange={setValues} disabled={submitting} />
                            </div>

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
                                    {submitting ? "Creating…" : "Create Course"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}