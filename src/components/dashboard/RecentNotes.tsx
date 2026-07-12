import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const recentNotes = [
  { id: "1", title: "Binary Search Trees — Insertion & Deletion", course: "CS201", time: "2h ago" },
  { id: "2", title: "Eigenvalues & Eigenvectors Review", course: "MATH301", time: "5h ago" },
  { id: "3", title: "Neural Network Backpropagation", course: "CS401", time: "1d ago" },
  { id: "4", title: "SQL Query Optimization Techniques", course: "CS302", time: "2d ago" },
  { id: "5", title: "Graph Traversal: BFS vs DFS", course: "CS201", time: "3d ago" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.3 },
  },
};

export function RecentNotes() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl border border-zinc-800 bg-zinc-900"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-[13px] font-medium text-text-muted">
          <FileText className="h-3.5 w-3.5" />
          Recent Notes
        </div>
        <button className="text-[12px] font-medium text-violet-400 transition-colors hover:text-violet-300">
          View All
        </button>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {recentNotes.map((note) => (
          <button
            key={note.id}
            className="group flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors duration-200 hover:bg-white/[0.02]"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-text-primary transition-colors group-hover:text-violet-400">
                {note.title}
              </p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                {note.course}
              </p>
            </div>
            <span className="ml-4 flex-shrink-0 text-[11px] text-text-muted">
              {note.time}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
