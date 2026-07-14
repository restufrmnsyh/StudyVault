import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PlannerFilterKey } from "@/types/planner";

interface PlannerFilterTabsProps {
    activeFilter: PlannerFilterKey;
    onFilterChange: (filter: PlannerFilterKey) => void;
    counts: Record<PlannerFilterKey, number>;
}

const tabs: Array<{ key: PlannerFilterKey; label: string }> = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
];

export function PlannerFilterTabs({ activeFilter, onFilterChange, counts }: PlannerFilterTabsProps) {
    return (
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-1">
            {tabs.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onFilterChange(tab.key)}
                        aria-pressed={isActive}
                        className={cn(
                            "relative flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors duration-200",
                            isActive ? "text-white" : "text-text-muted hover:text-text-secondary",
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="planner-tab-active-pill"
                                className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-500"
                                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                        <span
                            className={cn(
                                "relative z-10 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                                isActive ? "bg-white/15 text-white" : "bg-white/[0.04] text-text-muted",
                            )}
                        >
                            {counts[tab.key]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}