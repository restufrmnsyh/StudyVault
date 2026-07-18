import { motion } from "framer-motion";
import { BookMarked, FileText, Layers, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/common";
import type { StatCard as StatCardType } from "@/types/dashboard";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

interface OverviewCardsProps {
  coursesCount: number;
  notesCount: number;
  materialsCount: number;
  tasksCount: number;
}

export function OverviewCards({ coursesCount, notesCount, materialsCount, tasksCount }: OverviewCardsProps) {
  // Sprint 6.5.2 — Dynamic statistics from Supabase
  // Replaced Study Hours and Streak with Materials and Tasks
  const stats: StatCardType[] = [
    {
      label: "Courses",
      value: String(coursesCount),
      icon: BookMarked,
      color: "from-violet-500 to-indigo-500",
    },
    {
      label: "Notes",
      value: String(notesCount),
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Materials",
      value: String(materialsCount),
      icon: Layers,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Tasks",
      value: String(tasksCount),
      icon: ClipboardList,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          compact
        />
      ))}
    </motion.div>
  );
}
