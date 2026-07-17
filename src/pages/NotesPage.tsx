import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive, Clock, FileText, Plus, Search as SearchIcon, Star, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SearchInput, EmptyState } from "@/components/common";
import { NoteCard, NotesFilterSidebar, CreateNoteModal } from "@/components/notes";
import { useNotes } from "@/hooks/queries/useNotes";
import { useCourses } from "@/hooks/queries/useCourses";
import { useToast } from "@/hooks/useToast";
import type { NoteFilterKey } from "@/types/notes";
import type { NoteRecord } from "@/services/note.service";
import type { Course } from "@/types/courses";

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const gridStagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
};

const RECENT_THRESHOLD_DAYS = 3;

function getEditedDaysAgo(updatedAt: string): number {
    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function noteRecordMatchesQuery(note: NoteRecord, query: string, courses: Course[]): boolean {
    const q = query.trim().toLowerCase();
    if (q === "") return true;

    const course = courses.find((c) => c.id === note.courseId);
    const courseCode = course ? course.code.toLowerCase() : "";
    const courseName = course ? course.name.toLowerCase() : "";

    return (
        note.title.toLowerCase().includes(q) ||
        (note.preview ?? "").toLowerCase().includes(q) ||
        courseCode.includes(q) ||
        courseName.includes(q) ||
        note.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        note.content.some((block) => {
            if (block.kind === "heading" || block.kind === "paragraph" || block.kind === "quote") {
                return block.text.toLowerCase().includes(q);
            } else if (block.kind === "bullet-list" || block.kind === "numbered-list") {
                return block.items.some((item) => item.toLowerCase().includes(q));
            } else if (block.kind === "code") {
                return block.code.toLowerCase().includes(q);
            }
            return false;
        })
    );
}

export function NotesPage() {
    const { data: allNotes, loading: notesLoading, error: notesError, createNote, updateNote } = useNotes();
    const { data: courses, loading: coursesLoading } = useCourses();
    const { showToast } = useToast();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<NoteFilterKey>("all");
    const [createModalOpen, setCreateModalOpen] = useState(false);

    async function handleToggleFavorite(id: string) {
        const note = allNotes.find((n) => n.id === id);
        if (!note) return;
        try {
            await updateNote(id, { favorite: !note.favorite });
            showToast(note.favorite ? "Removed from Favorites." : "Added to Favorites.", "success");
        } catch {
            showToast("Failed to update Favorite.", "error");
        }
    }

    const counts: Record<NoteFilterKey, number> = useMemo(
        () => ({
            all: allNotes.filter((n) => !n.archived).length,
            favorites: allNotes.filter((n) => n.favorite && !n.archived).length,
            recent: allNotes.filter((n) => !n.archived && getEditedDaysAgo(n.updatedAt) <= RECENT_THRESHOLD_DAYS).length,
            archived: allNotes.filter((n) => n.archived).length,
        }),
        [allNotes],
    );

    const filteredNotes = useMemo(() => {
        let result = allNotes;

        if (filter === "favorites") result = result.filter((n) => n.favorite && !n.archived);
        else if (filter === "recent")
            result = result.filter((n) => !n.archived && getEditedDaysAgo(n.updatedAt) <= RECENT_THRESHOLD_DAYS);
        else if (filter === "archived") result = result.filter((n) => n.archived);
        else result = result.filter((n) => !n.archived);

        if (search.trim() !== "") {
            result = result.filter((n) => noteRecordMatchesQuery(n, search, courses));
        }

        if (filter === "recent") {
            result = [...result].sort((a, b) => getEditedDaysAgo(a.updatedAt) - getEditedDaysAgo(b.updatedAt));
        }

        return result;
    }, [allNotes, filter, search, courses]);

    const emptyState = useMemo(() => {
        if (search.trim() !== "") {
            return {
                icon: SearchIcon,
                title: "No notes found",
                description: "Try a different search term — search now also looks inside note content.",
            };
        }
        switch (filter) {
            case "favorites":
                return { icon: Star, title: "No favorites yet", description: "Star a note to see it here." };
            case "recent":
                return {
                    icon: Clock,
                    title: "Nothing recent",
                    description: "Notes edited in the last few days will show up here.",
                };
            case "archived":
                return { icon: Archive, title: "No archived notes", description: "Notes you archive will show up here." };
            default:
                return { icon: FileText, title: "No notes yet", description: "Notes you create will show up here." };
        }
    }, [search, filter]);

    const loading = notesLoading || coursesLoading;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-[50vh] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                </div>
            </DashboardLayout>
        );
    }

    if (notesError) {
        return (
            <DashboardLayout>
                <div className="flex h-[50vh] flex-col items-center justify-center gap-3 text-center">
                    <p className="text-[14px] font-medium text-text-primary">Failed to load notes: {notesError}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Notes</h1>
                        <p className="mt-1.5 text-[15px] text-text-muted">
                            {counts.all} notes across your courses.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCreateModalOpen(true)}
                            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20"
                        >
                            <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
                            New Note
                        </button>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search notes, courses, tags, or content..."
                        ariaLabel="Search notes"
                    />
                </motion.div>

                {/* Filters + Grid */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                        <NotesFilterSidebar activeFilter={filter} onFilterChange={setFilter} counts={counts} />
                    </motion.div>

                    <div className="min-w-0 flex-1">
                        {filteredNotes.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                                variants={gridStagger}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredNotes.map((note) => {
                                    const course = courses.find((c) => c.id === note.courseId);
                                    const courseCode = course ? course.code : "";
                                    return (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            courseCode={courseCode}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-zinc-800">
                                <EmptyState icon={emptyState.icon} title={emptyState.title} description={emptyState.description} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CreateNoteModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                courses={courses}
                onCreate={createNote}
            />
        </DashboardLayout>
    );
}