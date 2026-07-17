import { useState, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilePlus, X } from "lucide-react";
import { NoteForm, type NoteFormErrors, type NoteFormValues } from "@/components/notes/NoteForm";
import type { Course } from "@/types/courses";
import type { CreateNoteInput } from "@/services/note.service";
import type { NoteRecord } from "@/services/note.service";
import { useToast } from "@/hooks/useToast";

interface CreateNoteModalProps {
    open: boolean;
    onClose: () => void;
    courses: Course[];
    onCreate: (input: CreateNoteInput) => Promise<NoteRecord>;
    defaultCourseId?: string;
}

const EMPTY_NOTE_FORM_VALUES: NoteFormValues = {
    courseId: "",
    title: "",
    content: "",
    tagsText: "",
    favorite: false,
    archived: false,
};

function validate(values: NoteFormValues): NoteFormErrors {
    const errors: NoteFormErrors = {};
    if (values.courseId.trim() === "") errors.courseId = "Course selection is required.";
    if (values.title.trim() === "") errors.title = "Note title is required.";
    if (values.content.trim() === "") errors.content = "Note content is required.";
    return errors;
}

export function CreateNoteModal({ open, onClose, courses, onCreate, defaultCourseId }: CreateNoteModalProps) {
    const { showToast } = useToast();
    const [values, setValues] = useState<NoteFormValues>(EMPTY_NOTE_FORM_VALUES);
    const [errors, setErrors] = useState<NoteFormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                setValues({
                    ...EMPTY_NOTE_FORM_VALUES,
                    courseId: defaultCourseId ?? "",
                });
                setErrors({});
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [open, defaultCourseId]);

    function handleClose() {
        if (submitting) return; // don't let the backdrop/X interrupt an in-flight request
        setValues(EMPTY_NOTE_FORM_VALUES);
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
            // Process tags into an array
            const tags = values.tagsText
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t !== "");

            await onCreate({
                courseId: values.courseId,
                title: values.title.trim(),
                content: values.content.trim(),
                tags,
                favorite: values.favorite,
                archived: values.archived,
            });
            showToast("Note created successfully.", "success");
            setValues(EMPTY_NOTE_FORM_VALUES);
            setErrors({});
            onClose();
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to create note.", "error");
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
                        aria-labelledby="create-note-title"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl shadow-black/40"
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4 sm:px-6">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                                    <FilePlus className="h-4 w-4" />
                                </div>
                                <div className="pt-0.5">
                                    <h2 id="create-note-title" className="text-[15px] font-semibold text-text-primary">
                                        Create Note
                                    </h2>
                                    <p className="mt-0.5 text-[12.5px] text-text-muted">Add a new note to your courses.</p>
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
                                <NoteForm
                                    values={values}
                                    errors={errors}
                                    courses={courses}
                                    onChange={setValues}
                                    disabled={submitting}
                                />
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
                                    {submitting ? "Creating…" : "Create Note"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
