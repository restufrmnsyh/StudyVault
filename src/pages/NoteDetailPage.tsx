import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Copy,
    Eye,
    FilePlus,
    FileText,
    Layers,
    Lock,
    MoreHorizontal,
    Pencil,
    Save,
    Star,
    Trash2,
    X,
    type LucideIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard, ListRow, EmptyState, ConfirmDialog } from "@/components/common";
import { NoteContentBlocks, RelatedCourseCard } from "@/components/notes";
import { materialIcon, materialTypeLabel } from "@/constants/materialIcons";
import {
    notes,
    getNoteContent,
    getRelatedMaterials,
    getNoteActivity,
    noteContentToPlainText,
    plainTextToNoteContent,
} from "@/data/notes";
import { courses } from "@/data/courses";
import type { NoteActivityType, NoteContentBlock } from "@/types/notes";
import { cn } from "@/lib/utils";

interface NoteDetailPageProps {
    noteId: string;
}

type NoteDetailMode = "view" | "edit";

/** Session-only edit overrides. Never written back to `data/notes.ts` — Sprint 3.4C is
 *  explicitly local-state-only, no persistence and no backend. */
interface NoteOverride {
    title: string;
    tags: string[];
    content: NoteContentBlock[];
}

/** Draft values bound to the Edit Mode form fields. Kept as its own shape (raw text for
 *  tags/content) rather than reusing NoteOverride directly, since form inputs need plain
 *  strings while the committed override needs parsed tags/blocks. */
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

const activityIcon: Record<NoteActivityType, LucideIcon> = {
    created: FilePlus,
    edited: Pencil,
    viewed: Eye,
    favorited: Star,
};

const activityLabel: Record<NoteActivityType, string> = {
    created: "Created this note",
    edited: "Edited this note",
    viewed: "Viewed this note",
    favorited: "Favorited this note",
};

/** Shared input/textarea chrome so Edit Mode fields match SearchInput's focus styling
 *  instead of introducing a second visual language for form controls. */
const fieldClassName =
    "w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-text-primary outline-none ring-violet-500/15 transition-all duration-200 placeholder:text-text-muted focus:border-violet-500/30 focus:bg-white/[0.04] focus:ring-4";

/**
 * "More actions" menu for the header. New (not in components/common yet) because it's
 * the first dropdown-style menu in the app — every item here is a dummy placeholder for
 * a future sprint (duplicate, move, export), so it isn't worth generalizing into a shared
 * component until a second real use case shows up.
 */
function MoreActionsMenu() {
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
                <div className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-lg shadow-black/20">
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
    const note = notes.find((n) => n.id === noteId);
    const [favorite, setFavorite] = useState(note?.favorite ?? false);

    // Edit Mode state. `override` holds the last *saved* (session-only) edits; `form`
    // holds the in-progress draft while `mode === "edit"` and is discarded on Cancel.
    const [mode, setMode] = useState<NoteDetailMode>("view");
    const [override, setOverride] = useState<NoteOverride | null>(null);
    const [form, setForm] = useState<EditForm | null>(null);
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

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

    // Effective values: the override if this session has saved an edit, otherwise the
    // original dummy data. Every view below reads through these, never `note.*` directly,
    // so Edit Mode and View Mode never fall out of sync with each other.
    const displayTitle = override?.title ?? note.title;
    const displayTags = override?.tags ?? note.tags;
    const displayContent = override?.content ?? getNoteContent(note);

    const materials = getRelatedMaterials(note);
    const activity = getNoteActivity(note);
    const relatedCourse = courses.find((c) => c.code === note.courseCode);

    const isDirty =
        form !== null &&
        (form.title.trim() !== displayTitle ||
            form.tagsText.trim() !== displayTags.join(", ") ||
            form.contentText.trim() !== noteContentToPlainText(displayContent).trim());

    function startEdit() {
        setForm({
            title: displayTitle,
            tagsText: displayTags.join(", "),
            contentText: noteContentToPlainText(displayContent),
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

    function handleSave() {
        if (!form || form.title.trim() === "") return;
        setOverride({
            title: form.title.trim(),
            tags: form.tagsText
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            content: plainTextToNoteContent(form.contentText),
        });
        exitEditMode();
    }

    const isEditing = mode === "edit" && form !== null;

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
                            <span
                                title="Course is read-only in Edit Mode"
                                className="inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted"
                            >
                                {isEditing && <Lock className="h-2.5 w-2.5" />}
                                {note.courseCode}
                            </span>

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
                                        {displayTitle}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-text-muted">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            Edited {note.lastEdited}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            Created {note.createdDate}
                                        </span>
                                    </div>

                                    {displayTags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {displayTags.map((tag) => (
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
                                    onClick={() => setFavorite((v) => !v)}
                                    aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                                    aria-pressed={favorite}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-violet-500/30"
                                >
                                    <Star
                                        className={cn(
                                            "h-4 w-4 transition-colors",
                                            favorite ? "fill-amber-400 text-amber-400" : "text-text-muted",
                                        )}
                                    />
                                </button>
                                <MoreActionsMenu />
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
                                <NoteContentBlocks blocks={displayContent} />
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
                            {materials.length > 0 ? (
                                <div className="divide-y divide-zinc-800/60">
                                    {materials.map((material) => (
                                        <ListRow
                                            key={material.id}
                                            icon={materialIcon[material.type]}
                                            title={material.name}
                                            subtitle={materialTypeLabel[material.type]}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Layers}
                                    title="No related materials"
                                    description="Files attached to this note will show up here."
                                />
                            )}
                        </SectionCard>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }}>
                        <SectionCard icon={Clock} title="Recent Activity">
                            {activity.length > 0 ? (
                                <div className="divide-y divide-zinc-800/60">
                                    {activity.map((item) => (
                                        <ListRow
                                            key={item.id}
                                            icon={activityIcon[item.type]}
                                            title={activityLabel[item.type]}
                                            subtitle={note.courseCode}
                                            trailing={item.updatedAt}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Clock}
                                    title="No activity yet"
                                    description="Actions on this note will show up here."
                                />
                            )}
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
        </DashboardLayout>
    );
}
