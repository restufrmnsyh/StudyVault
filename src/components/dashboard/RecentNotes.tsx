import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { SectionCard, ListRow } from "@/components/common";

const recentNotes = [
  { id: "1", title: "Binary Search Trees — Insertion & Deletion", course: "CS201", time: "2h ago" },
  { id: "2", title: "Eigenvalues & Eigenvectors Review", course: "MATH301", time: "5h ago" },
  { id: "3", title: "Neural Network Backpropagation", course: "CS401", time: "1d ago" },
  { id: "4", title: "SQL Query Optimization Techniques", course: "CS302", time: "2d ago" },
  { id: "5", title: "Graph Traversal: BFS vs DFS", course: "CS201", time: "3d ago" },
];

const containerVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.3 },
  },
};

const listVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.45 },
  },
};

const rowVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function RecentNotes() {
  return (
    <motion.div variants={containerVariant} initial="hidden" animate="visible">
      <SectionCard icon={FileText} title="Recent Notes" action={{ label: "View All" }}>
        <motion.div
          className="divide-y divide-zinc-800/60"
          variants={listVariant}
          initial="hidden"
          animate="visible"
        >
          {recentNotes.map((note) => (
            <motion.div key={note.id} variants={rowVariant}>
              <ListRow title={note.title} subtitle={note.course} trailing={note.time} />
            </motion.div>
          ))}
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}
