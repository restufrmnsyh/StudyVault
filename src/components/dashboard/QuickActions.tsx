import { motion } from "framer-motion";
import { FolderPlus, StickyNote, CalendarDays, Upload, type LucideIcon } from "lucide-react";

interface QuickAction {
    icon: LucideIcon;
    label: string;
    color: string;
}

const quickActions: QuickAction[] = [
    { icon: FolderPlus, label: "Create Course", color: "from-violet-500 to-indigo-500" },
    { icon: StickyNote, label: "Create Note", color: "from-blue-500 to-cyan-500" },
    { icon: CalendarDays, label: "Open Planner", color: "from-amber-500 to-orange-500" },
    { icon: Upload, label: "Upload Material", color: "from-emerald-500 to-teal-500" },
];

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
};

const cardVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

/**
 * Entry points only. "Create Course" is wired to open CreateCourseModal (Sprint 4.4);
 * the other three stay intentionally non-interactive (no href, no onClick) — including
 * "Open Planner" even though that route already exists — since this sprint's scope is
 * just the one feature, not wiring every quick action.
 */
export function QuickActions({ onCreateCourse }: { onCreateCourse: () => void }) {
    return (
        <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
        >
            {quickActions.map((action) => (
                <motion.button
                    key={action.label}
                    type="button"
                    onClick={action.label === "Create Course" ? onCreateCourse : undefined}
                    variants={cardVariant}
                    whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-5 text-center transition-colors duration-300 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.04]"
                >
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                    >
                        <action.icon className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-[13px] font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                        {action.label}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
}