import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/notes";

interface NoteCardProps {
    note: Note;
    onToggleFavorite?: (id: string) => void;
}

const cardVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function NoteCard({ note, onToggleFavorite }: NoteCardProps) {
    return (
        <motion.a
            href={`#/dashboard/notes/${note.id}`}
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-300 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.04]"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                    {note.courseCode}
                </span>
                <button
                    type="button"
                    onClick={(e) => {
                        // Stop this click from bubbling to the parent <a> and navigating away —
                        // favoriting should happen in place, right from the Notes grid.
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleFavorite?.(note.id);
                    }}
                    aria-label={note.favorite ? "Remove from favorites" : "Add to favorites"}
                    aria-pressed={note.favorite}
                    className="flex-shrink-0 rounded-md p-0.5 transition-transform duration-200 hover:scale-110"
                >
                    <Star
                        className={cn(
                            "h-4 w-4 transition-colors",
                            note.favorite ? "fill-amber-400 text-amber-400" : "text-text-muted hover:text-text-secondary",
                        )}
                    />
                </button>
            </div>

            <h3 className="mb-1.5 text-[15px] font-semibold text-text-primary">{note.title}</h3>
            <p className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-text-muted">{note.preview}</p>

            {note.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-text-muted"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <p className="mt-auto text-[11px] text-text-muted">Edited {note.lastEdited}</p>
        </motion.a>
    );
}