import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    CalendarClock,
    CalendarDays,
    CheckCircle2,
    ListTodo,
    Search as SearchIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { EmptyState, SearchInput, StatCard } from "@/components/common";
import { PlannerFilterTabs, TaskCard } from "@/components/planner";
import { courses } from "@/data/courses";
import { TODAY_ISO, WEEK_END_ISO, taskMatchesQuery, tasks as initialTasks } from "@/data/planner";
import type { PlannerFilterKey, PlannerTask } from "@/types/planner";

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
    // Local-only state for this sprint — checking a task off updates the UI but isn't
    // persisted (no localStorage, no backend yet). Resets on reload, same as the dummy
    // data it started from.
    const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<PlannerFilterKey>("all");

    function toggleComplete(id: string) {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }

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
        }),
        [tasks],
    );

    const filteredTasks = useMemo(() => {
        let result = tasks;

        if (filter === "today") result = result.filter((t) => t.dueDateISO === TODAY_ISO);
        else if (filter === "upcoming") result = result.filter((t) => !t.completed && t.dueDateISO > TODAY_ISO);
        else if (filter === "completed") result = result.filter((t) => t.completed);

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
                description: "Try a different search term.",
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
            default:
                return { icon: ListTodo, title: "No tasks yet", description: "Tasks you add will show up here." };
        }
    }, [search, filter]);

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Header */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Planner</h1>
                    <p className="mt-1.5 text-[15px] text-text-muted">
                        Keep track of what's due across every course, in one place.
                    </p>
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
                        placeholder="Search tasks, descriptions, or courses..."
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
        </DashboardLayout>
    );
}