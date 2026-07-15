import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    ListTodo,
    RotateCcw,
    Search as SearchIcon,
    Zap,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { EmptyState, SearchInput, StatCard, ConfirmDialog } from "@/components/common";
import { PlannerFilterTabs, TaskCard } from "@/components/planner";
import { courses } from "@/data/courses";
import { TODAY_ISO, WEEK_END_ISO, taskMatchesQuery } from "@/data/planner";
import { usePlanner } from "@/hooks/usePlanner";
import { useToast } from "@/hooks/useToast";
import type { PlannerFilterKey } from "@/types/planner";

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

export function PlannerPage() {
    const { tasks, toggleComplete, resetDemoData } = usePlanner();
    const { showToast } = useToast();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<PlannerFilterKey>("all");
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const summary = useMemo(() => {
        const todaysTasks = tasks.filter((t) => t.dueDateISO === TODAY_ISO && !t.completed).length;
        const dueThisWeek = tasks.filter(
            (t) => !t.completed && t.dueDateISO >= TODAY_ISO && t.dueDateISO <= WEEK_END_ISO,
        ).length;
        const completed = tasks.filter((t) => t.completed).length;
        const overdue = tasks.filter((t) => !t.completed && t.dueDateISO < TODAY_ISO).length;
        return { todaysTasks, dueThisWeek, completed, overdue };
    }, [tasks]);

    const counts: Record<PlannerFilterKey, number> = useMemo(
        () => ({
            all: tasks.length,
            today: tasks.filter((t) => t.dueDateISO === TODAY_ISO).length,
            upcoming: tasks.filter((t) => !t.completed && t.dueDateISO > TODAY_ISO).length,
            completed: tasks.filter((t) => t.completed).length,
            "high-priority": tasks.filter((t) => !t.completed && t.priority === "high").length,
            overdue: tasks.filter((t) => !t.completed && t.dueDateISO < TODAY_ISO).length,
        }),
        [tasks],
    );

    const filteredTasks = useMemo(() => {
        let result = tasks;

        if (filter === "today") result = result.filter((t) => t.dueDateISO === TODAY_ISO);
        else if (filter === "upcoming") result = result.filter((t) => !t.completed && t.dueDateISO > TODAY_ISO);
        else if (filter === "completed") result = result.filter((t) => t.completed);
        else if (filter === "high-priority") result = result.filter((t) => !t.completed && t.priority === "high");
        else if (filter === "overdue") result = result.filter((t) => !t.completed && t.dueDateISO < TODAY_ISO);

        if (search.trim() !== "") {
            result = result.filter((t) => taskMatchesQuery(t, search));
        }

        return [...result].sort((a, b) => a.dueDateISO.localeCompare(b.dueDateISO));
    }, [tasks, filter, search]);

    const emptyState = useMemo(() => {
        if (search.trim() !== "") {
            return {
                icon: SearchIcon,
                title: "No tasks found",
                description: "Try a different search term — search now also looks inside checklist items.",
            };
        }
        switch (filter) {
            case "today":
                return { icon: CalendarClock, title: "Nothing due today", description: "Tasks due today will show up here." };
            case "upcoming":
                return {
                    icon: CalendarDays,
                    title: "Nothing upcoming",
                    description: "Future tasks that aren't done yet will show up here.",
                };
            case "completed":
                return {
                    icon: CheckCircle2,
                    title: "No completed tasks yet",
                    description: "Check off a task to see it here.",
                };
            case "high-priority":
                return {
                    icon: Zap,
                    title: "No high priority tasks",
                    description: "Tasks marked high priority will show up here.",
                };
            case "overdue":
                return {
                    icon: AlertCircle,
                    title: "Nothing overdue",
                    description: "You're all caught up — overdue tasks will show up here.",
                };
            default:
                return { icon: ListTodo, title: "No tasks yet", description: "Tasks you add will show up here." };
        }
    }, [search, filter]);

    function handleResetConfirmed() {
        resetDemoData();
        setShowResetConfirm(false);
        showToast("Planner reset");
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
                        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Planner</h1>
                        <p className="mt-1.5 text-[15px] text-text-muted">
                            Keep track of what's due across every course, in one place.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[13px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reset Demo Data</span>
                    </button>
                </motion.div>

                {/* Summary cards */}
                <motion.div
                    className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
                    variants={gridStagger}
                    initial="hidden"
                    animate="visible"
                >
                    <StatCard
                        icon={ListTodo}
                        value={String(summary.todaysTasks)}
                        label="Today's Tasks"
                        color="from-violet-500 to-indigo-500"
                        compactOnMobile
                    />
                    <StatCard
                        icon={CalendarDays}
                        value={String(summary.dueThisWeek)}
                        label="Due This Week"
                        color="from-blue-500 to-cyan-500"
                        compactOnMobile
                    />
                    <StatCard
                        icon={CheckCircle2}
                        value={String(summary.completed)}
                        label="Completed"
                        color="from-emerald-500 to-teal-500"
                        compactOnMobile
                    />
                    <StatCard
                        icon={AlertCircle}
                        value={String(summary.overdue)}
                        label="Overdue"
                        color="from-rose-500 to-orange-500"
                        compactOnMobile
                    />
                </motion.div>

                {/* Search */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search tasks, descriptions, courses, or checklist items..."
                        ariaLabel="Search tasks"
                    />
                </motion.div>

                {/* Filter tabs */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <PlannerFilterTabs activeFilter={filter} onFilterChange={setFilter} counts={counts} />
                </motion.div>

                {/* Task list */}
                {filteredTasks.length > 0 ? (
                    <motion.div className="space-y-3" variants={gridStagger} initial="hidden" animate="visible">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                courseName={courses.find((c) => c.code === task.courseCode)?.name}
                                onToggleComplete={toggleComplete}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-800">
                        <EmptyState icon={emptyState.icon} title={emptyState.title} description={emptyState.description} />
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={showResetConfirm}
                title="Reset planner to demo data?"
                description="This clears any edits, checklist changes, or completions you've made and restores the original dummy tasks."
                confirmLabel="Reset planner"
                cancelLabel="Cancel"
                destructive
                onConfirm={handleResetConfirmed}
                onCancel={() => setShowResetConfirm(false)}
            />
        </DashboardLayout>
    );
}