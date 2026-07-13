import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive, Clock, FileText, Plus, Search as SearchIcon, Star } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SearchInput, EmptyState } from "@/components/common";
import { NoteCard, NotesFilterSidebar } from "@/components/notes";
import { notes as initialNotes } from "@/data/notes";
import type { Note, NoteFilterKey } from "@/types/notes";

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

export function NotesPage() {
    const [allNotes, setAllNotes] = useState<Note[]>(initialNotes);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<NoteFilterKey>("all");

    const toggleFavorite = (id: string) => {
        setAllNotes((prev) => prev.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)));
    };

    const counts: Record<NoteFilterKey, number> = useMemo(
        () => ({
            all: allNotes.filter((n) => !n.archived).length,
            favorites: allNotes.filter((n) => n.favorite && !n.archived).length,
            recent: allNotes.filter((n) => !n.archived && n.editedDaysAgo <= RECENT_THRESHOLD_DAYS).length,
            archived: allNotes.filter((n) => n.archived).length,
        }),
        [allNotes],
    );

    const filteredNotes = useMemo(() => {
        let result = allNotes;

        if (filter === "favorites") result = result.filter((n) => n.favorite && !n.archived);
        else if (filter === "recent")
            result = result.filter((n) => !n.archived && n.editedDaysAgo <= RECENT_THRESHOLD_DAYS);
        else if (filter === "archived") result = result.filter((n) => n.archived);
        else result = result.filter((n) => !n.archived);

        const query = search.trim().toLowerCase();
        if (query) {
            result = result.filter(
                (n) =>
                    n.title.toLowerCase().includes(query) ||
                    n.courseCode.toLowerCase().includes(query) ||
                    n.tags.some((tag) => tag.toLowerCase().includes(query)),
            );
        }

        if (filter === "recent") {
            result = [...result].sort((a, b) => a.editedDaysAgo - b.editedDaysAgo);
        }

        return result;
    }, [allNotes, filter, search]);

    const emptyState = useMemo(() => {
        if (search.trim() !== "") {
            return { icon: SearchIcon, title: "No notes found", description: "Try a different search term or filter." };
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
                    <button
                        type="button"
                        className="group flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20"
                    >
                        <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
                        New Note
                    </button>
                </motion.div>

                {/* Search */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search notes, courses, or tags..."
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
                                {filteredNotes.map((note) => (
                                    <NoteCard key={note.id} note={note} onToggleFavorite={toggleFavorite} />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-zinc-800">
                                <EmptyState icon={emptyState.icon} title={emptyState.title} description={emptyState.description} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}