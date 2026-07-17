import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Archive,
    ArchiveRestore,
    ArrowLeft,
    CalendarDays,
    Clock,
    Copy,
    FileText,
    Layers,
    MoreHorizontal,
    Pencil,
    Save,
    Star,
    Trash2,
    X,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard, EmptyState, ConfirmDialog, RelatedCourseCard } from "@/components/common";
import { NoteContentBlocks } from "@/components/notes";
import { useNote } from "@/hooks/queries/useNote";
import { getCourseById, toCourse } from "@/services/course.service";
import { useToast } from "@/hooks/useToast";
import type { NoteContentBlock } from "@/types/notes";
import type { Course } from "@/types/courses";
import type { NoteRecord } from "@/services/note.service";
import { cn } from "@/lib/utils";

interface NoteDetailPageProps {
    noteId: string;
}

type NoteDetailMode = "view" | "edit";

interface EditForm {
    title: string;
    tagsText: string;
    contentText: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

function noteContentToPlainText(blocks: NoteContentBlock[]): string {
    return blocks
        .map((block) => {
            switch (block.kind) {
                case "heading":
                case "paragraph":
                case "quote":
                    return block.text;
                case "bullet-list":
                    return block.items.map((item) => `- ${item}`).join("\n");
                case "numbered-list":
                    return block.items.map((item, i) => `${i + 1}. ${item}`).join("\n");
                case "code":
                    return block.code;
                default:
                    return "";
            }
        })
        .join("\n\n");
}

function plainTextToNoteContent(text: string): NoteContentBlock[] {
    return text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph) => ({ kind: "paragraph", text: paragraph.replace(/\s*\n\s*/g, " ") }));
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
        return "just now";
    } else if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays === 1) {
        return "1d ago";
    } else {
        return `${diffDays}d ago`;
    }
}

function formatCalendarDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function MoreActionsMenu({ note, onToggleArchive }: { note: NoteRecord; onToggleArchive: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="More actions"
                aria-expanded={open}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>
            {open && (
                <div className="absolute right-0 top-9 z-10 w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-lg shadow-black/20">
                    <button
                        type="button"
                        onClick={() => {
                            onToggleArchive();
                            setOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                    >
                        {note.archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                        {note.archived ? "Unarchive note" : "Archive note"}
                    </button>
                    <div className="my-1 border-t border-zinc-800" />
                    {[
                        { icon: Copy, label: "Duplicate note" },
                        { icon: Layers, label: "Move to course" },
                        { icon: FileText, label: "Export as PDF" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => setOpen(false)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
                        >
                            <item.icon className="h-3.5 w-3.5" />
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function NoteDetailPage({ noteId }: NoteDetailPageProps) {
    const { data: note, loading, error, refresh, updateNote, deleteNote } = useNote(noteId);
    const { showToast } = useToast();

    const [mode, setMode] = useState<NoteDetailMode>("view");
    const [form, setForm] = useState<EditForm | null>(null);
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [relatedCourse, setRelatedCourse] = useState<Course | null>(null);

    useEffect(() => {
        if (!note?.courseId) return;
        let active = true;
        getCourseById(note.courseId)
            .then((record) => {
                if (active && record) {
                    setRelatedCourse(toCourse(record));
                }
            })
            .catch(() => {
                // Fail silently for details panel Course lookup
            });
        return () => {
            active = false;
        };
    }, [note?.courseId]);

    if (loading || deleting) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
                    <p className="text-[14px] font-medium text-text-primary">
                        {deleting ? "Deleting note…" : "Loading note…"}
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-500/20 py-20 text-center">
                    <AlertTriangle className="h-8 w-8 text-rose-400" />
                    <p className="text-[14px] font-medium text-text-primary">Couldn't load this note</p>
                    <p className="max-w-sm text-[13px] text-text-muted">{error}</p>
                    <button
                        type="button"
                        onClick={() => void refresh()}
                        className="mt-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-violet-500/30 hover:text-violet-400"
                    >
                        Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (!note) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                    <FileText className="h-8 w-8 text-text-muted" />
                    <p className="text-[14px] font-medium text-text-primary">Note not found</p>
                    <a
                        href="#/dashboard/notes"
                        className="text-[13px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                        Back to Notes
                    </a>
                </div>
            </DashboardLayout>
        );
    }

    const isDirty =
        form !== null &&
        (form.title.trim() !== note.title ||
            form.tagsText.trim() !== note.tags.join(", ") ||
            form.contentText.trim() !== noteContentToPlainText(note.content).trim());

    function startEdit() {
        setForm({
            title: note!.title,
            tagsText: note!.tags.join(", "),
            contentText: noteContentToPlainText(note!.content),
        });
        setMode("edit");
    }

    function exitEditMode() {
        setForm(null);
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
        if (!form || form.title.trim() === "") return;
        try {
            const tags = form.tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
            const content = plainTextToNoteContent(form.contentText);
            const preview = form.contentText.length > 150 ? form.contentText.slice(0, 150) + "..." : form.contentText;

            await updateNote({
                title: form.title.trim(),
                tags,
                content,
                preview,
            });
            exitEditMode();
            showToast("Note saved successfully", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to save note", "error");
        }
    }

    async function handleToggleFavorite() {
        if (!note) return;
        try {
            await updateNote({ favorite: !note.favorite });
            showToast(note.favorite ? "Removed from favorites" : "Added to favorites", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update favorite status", "error");
        }
    }

    async function handleToggleArchive() {
        if (!note) return;
        try {
            await updateNote({ archived: !note.archived });
            showToast(note.archived ? "Note unarchived" : "Note archived", "success");
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to update archive status", "error");
        }
    }

    async function handleDeleteConfirmed() {
        setDeleteConfirmOpen(false);
        setDeleting(true);
        try {
            await deleteNote();
            showToast("Note deleted successfully", "success");
            window.location.hash = "#/dashboard/notes";
        } catch (err) {
            showToast(err instanceof Error ? err.message : "Failed to delete note", "error");
            setDeleting(false);
        }
    }

    const isEditing = mode === "edit" && form !== null;
    const courseCode = relatedCourse ? relatedCourse.code : "";
    const relativeTime = formatRelativeTime(note.updatedAt);
    const calendarDate = formatCalendarDate(note.createdAt);

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Back button */}
                <a
                    href="#/dashboard/notes"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Notes
                </a>

                {/* Note info */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                    {courseCode}
                                </span>
                                {note.archived && (
                                    <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                        <Archive className="h-2.5 w-2.5" />
                                        Archived
                                    </span>
                                )}
                            </div>

                            {isEditing && form ? (
                                <div className="mt-2.5 space-y-3">
                                    <div>
                                        <label htmlFor="note-title" className="sr-only">
                                            Note title
                                        </label>
                                        <input
                                            id="note-title"
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            placeholder="Note title"
                                            className={cn(fieldClassName, "text-xl font-bold tracking-tight sm:text-2xl")}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="note-tags" className="mb-1.5 block text-[11px] font-medium text-text-muted">
                                            Tags <span className="font-normal">(comma-separated)</span>
                                        </label>
                                        <input
                                            id="note-tags"
                                            type="text"
                                            value={form.tagsText}
                                            onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                                            placeholder="algorithms, exam-prep"
                                            className={cn(fieldClassName, "text-[13px]")}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                                        {note.title}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            Edited {relativeTime}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            Created {calendarDate}
                                        </span>
                                    </div>

                                    {note.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {note.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-text-muted"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="flex flex-shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleToggleFavorite}
                                    aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
                                    aria-pressed={note.favorite}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-violet-500/30"
                                >
                                    <Star
                                        className={cn(
                                            "h-4 w-4 transition-colors",
                                            note.favorite ? "fill-amber-400 text-amber-400" : "text-text-muted",
                                        )}
                                    />
                                </button>
                                <MoreActionsMenu note={note} onToggleArchive={handleToggleArchive} />
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Note content */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <SectionCard icon={FileText} title={isEditing ? "Edit Content" : "Note Content"}>
                        <div className="p-5 sm:p-6">
                            {isEditing && form ? (
                                <div>
                                    <label htmlFor="note-content" className="sr-only">
                                        Note content
                                    </label>
                                    <textarea
                                        id="note-content"
                                        value={form.contentText}
                                        onChange={(e) => setForm({ ...form, contentText: e.target.value })}
                                        placeholder="Write your note..."
                                        rows={14}
                                        className={cn(fieldClassName, "resize-y text-[14px] leading-relaxed")}
                                    />
                                    <p className="mt-2 text-[11.5px] text-text-muted">
                                        Plain text only — leave a blank line between paragraphs.
                                    </p>
                                </div>
                            ) : (
                                <NoteContentBlocks blocks={note.content} />
                            )}
                        </div>
                    </SectionCard>
                </motion.div>

                {/* Related course */}
                {relatedCourse && (
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
                        <div className="mb-3 flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-text-muted">
                            Related Course
                        </div>
                        <RelatedCourseCard course={relatedCourse} />
                    </motion.div>
                )}

                {/* Related Materials + Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                        <SectionCard icon={Layers} title="Related Materials">
                            <EmptyState
                                icon={Layers}
                                title="No related materials"
                                description="Files attached to this note will show up here."
                            />
                        </SectionCard>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }}>
                        <SectionCard icon={Clock} title="Recent Activity">
                            <EmptyState
                                icon={Clock}
                                title="No activity yet"
                                description="Actions on this note will show up here."
                            />
                        </SectionCard>
                    </motion.div>
                </div>

                {/* Footer actions */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between"
                >
                    {isEditing ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmOpen(true)}
                                className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/[0.03] px-5 py-2.5 text-[13px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/[0.08]"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Note
                            </button>
                            <button
                                type="button"
                                onClick={startEdit}
                                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Note
                            </button>
                        </>
                    )}
                </motion.div>
            </div>

            <ConfirmDialog
                open={showDiscardConfirm}
                title="Discard unsaved changes?"
                description="You have unsaved edits to this note. Discarding will return to the original content."
                confirmLabel="Discard changes"
                cancelLabel="Keep editing"
                destructive
                onConfirm={exitEditMode}
                onCancel={() => setShowDiscardConfirm(false)}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                icon={Trash2}
                title="Delete note?"
                description="Are you sure you want to delete this note? This action cannot be undone."
                confirmLabel="Delete Note"
                cancelLabel="Cancel"
                destructive
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setDeleteConfirmOpen(false)}
            />
        </DashboardLayout>
    );
}
