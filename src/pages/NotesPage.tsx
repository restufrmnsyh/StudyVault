import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive, Clock, FileText, Plus, RotateCcw, Search as SearchIcon, Star } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SearchInput, EmptyState, ConfirmDialog } from "@/components/common";
import { NoteCard, NotesFilterSidebar } from "@/components/notes";
import { noteMatchesQuery } from "@/data/notes";
import { useNotes } from "@/hooks/useNotes";
import { useToast } from "@/hooks/useToast";
import type { NoteFilterKey } from "@/types/notes";

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
    const { notes: allNotes, toggleFavorite, resetDemoData } = useNotes();
    const { showToast } = useToast();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<NoteFilterKey>("all");
    const [showResetConfirm, setShowResetConfirm] = useState(false);

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

        if (search.trim() !== "") {
            result = result.filter((n) => noteMatchesQuery(n, search));
        }

        if (filter === "recent") {
            result = [...result].sort((a, b) => a.editedDaysAgo - b.editedDaysAgo);
        }

        return result;
    }, [allNotes, filter, search]);

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

    function handleResetConfirmed() {
        resetDemoData();
        setShowResetConfirm(false);
        showToast("Demo data restored");
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
                            onClick={() => setShowResetConfirm(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[13px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Reset Demo Data</span>
                        </button>
                        <button
                            type="button"
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

            <ConfirmDialog
                open={showResetConfirm}
                icon={RotateCcw}
                title="Reset demo data?"
                description="This clears any local edits, favorites, and archived notes, and restores the original dummy notes."
                confirmLabel="Reset data"
                cancelLabel="Cancel"
                destructive
                onConfirm={handleResetConfirmed}
                onCancel={() => setShowResetConfirm(false)}
            />
        </DashboardLayout>
    );
}