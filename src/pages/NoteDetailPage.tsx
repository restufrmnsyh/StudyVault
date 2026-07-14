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
    MoreHorizontal,
    Pencil,
    Star,
    Trash2,
    type LucideIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard, ListRow, EmptyState } from "@/components/common";
import { NoteContentBlocks, RelatedCourseCard } from "@/components/notes";
import { materialIcon, materialTypeLabel } from "@/constants/materialIcons";
import { notes, getNoteContent, getRelatedMaterials, getNoteActivity } from "@/data/notes";
import { courses } from "@/data/courses";
import type { NoteActivityType } from "@/types/notes";
import { cn } from "@/lib/utils";

interface NoteDetailPageProps {
    noteId: string;
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

    const content = getNoteContent(note);
    const materials = getRelatedMaterials(note);
    const activity = getNoteActivity(note);
    const relatedCourse = courses.find((c) => c.code === note.courseCode);

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
                            <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                {note.courseCode}
                            </span>
                            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                                {note.title}
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
                        </div>

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
                    </div>
                </motion.div>

                {/* Note content */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <SectionCard icon={FileText} title="Note Content">
                        <div className="p-5 sm:p-6">
                            <NoteContentBlocks blocks={content} />
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
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/[0.03] px-5 py-2.5 text-[13px] font-semibold text-rose-400 transition-colors hover:bg-rose-500/[0.08]"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Note
                    </button>
                    <button
                        type="button"
                        className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Note
                    </button>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}