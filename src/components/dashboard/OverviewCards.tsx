import { motion } from "framer-motion";
import { BookMarked, FileText, Layers, ClipboardList } from "lucide-react";
import { StatCard } from "@/components/common";

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
  // Sprint 6.7.4B — Each card is now clickable and navigates to the section page
  const stats = [
    {
      label: "Courses",
      value: String(coursesCount),
      icon: BookMarked,
      color: "from-violet-500 to-indigo-500",
      href: "#/dashboard/courses",
    },
    {
      label: "Notes",
      value: String(notesCount),
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      href: "#/dashboard/notes",
    },
    {
      label: "Materials",
      value: String(materialsCount),
      icon: Layers,
      color: "from-emerald-500 to-teal-500",
      href: "#/dashboard/courses",
    },
    {
      label: "Tasks",
      value: String(tasksCount),
      icon: ClipboardList,
      color: "from-amber-500 to-orange-500",
      href: "#/dashboard/planner",
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
          onClick={() => { window.location.hash = stat.href; }}
        />
      ))}
    </motion.div>
  );
}
