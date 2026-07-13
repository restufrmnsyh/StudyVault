import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    /**
     * Tighter padding/gaps below the `sm` breakpoint (<640px), for dense mobile grids
     * like Course Detail's 2-column stats. Tablet and desktop appearance is byte-for-byte
     * unchanged either way — this only affects the base (mobile) utility classes.
     * Defaults to false so existing call sites (e.g. the Dashboard) are unaffected.
     */
    compactOnMobile?: boolean;
}

export function StatCard({
    icon: Icon,
    value,
    label,
    color,
    trend,
    compactOnMobile = false,
}: StatCardProps) {
    return (
        <motion.div
            variants={statCardVariant}
            whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group rounded-2xl border border-zinc-800 bg-zinc-900 transition-colors duration-300 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.04]",
                compactOnMobile ? "p-3 sm:p-5" : "p-5",
            )}
        >
            <div
                className={cn(
                    "flex items-center justify-between",
                    compactOnMobile ? "mb-2 sm:mb-4" : "mb-4",
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform duration-300 group-hover:scale-105",
                        color,
                        compactOnMobile ? "h-8 w-8 sm:h-9 sm:w-9" : "h-9 w-9",
                    )}
                >
                    <Icon className="h-4 w-4 text-white" />
                </div>
                {trend && (
                    <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                        {trend}
                    </span>
                )}
            </div>
            <p
                className={cn(
                    "font-bold tabular-nums text-text-primary",
                    compactOnMobile ? "text-xl sm:text-2xl" : "text-2xl",
                )}
            >
                {value}
            </p>
            <p
                className={cn(
                    "text-text-muted",
                    compactOnMobile ? "mt-0.5 text-[12px] sm:mt-1 sm:text-[13px]" : "mt-1 text-[13px]",
                )}
            >
                {label}
            </p>
        </motion.div>
    );
}
