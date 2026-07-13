import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const statCardVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

interface StatCardProps {
    icon: LucideIcon;
    value: string;
    label: string;
    /** Tailwind gradient stops, e.g. "from-violet-500 to-indigo-500" */
    color: string;
    trend?: string;
}

export function StatCard({ icon: Icon, value, label, color, trend }: StatCardProps) {
    return (
        <motion.div
            variants={statCardVariant}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-300 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.04]"
        >
            <div className="mb-4 flex items-center justify-between">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-sm transition-transform duration-300 group-hover:scale-105`}
                >
                    <Icon className="h-4 w-4 text-white" />
                </div>
                {trend && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold tabular-nums text-text-primary">{value}</p>
            <p className="mt-1 text-[13px] text-text-muted">{label}</p>
        </motion.div>
    );
}