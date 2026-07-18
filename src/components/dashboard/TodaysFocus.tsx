import { motion } from "framer-motion";
import { ClipboardCheck, Target } from "lucide-react";
import { SectionCard, ListRow, EmptyState } from "@/components/common";
import { selectTodaysFocusTasks, formatDueDate } from "@/utils/planner.utils";
import type { PlannerTaskRecord } from "@/services/planner.service";
import type { Course } from "@/types/courses";

interface TodaysFocusProps {
    tasks: PlannerTaskRecord[];
    loading: boolean;
    courses: Course[];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function TodaysFocus({ tasks, loading, courses }: TodaysFocusProps) {
    // Select top 3 priority tasks for today's focus
    const focusTasks = selectTodaysFocusTasks(tasks, 3);

    // Map course ID to "Code • Name" subtitle
    const getCourseName = (courseId: string): string => {
        const course = courses.find((c) => c.id === courseId);
        return course ? `${course.code} • ${course.name}` : "Unknown Course";
    };

    return (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <SectionCard icon={Target} title="Today's Focus">
                {loading ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-sm text-text-muted">Loading tasks...</p>
                    </div>
                ) : focusTasks.length === 0 ? (
                    <div className="px-5 py-8">
                        <EmptyState
                            icon={Target}
                            title="No tasks today"
                            description="You're all caught up! Create a new task or check your planner."
                        />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800/60">
                        {focusTasks.map((task) => (
                            <ListRow
                                key={task.id}
                                icon={ClipboardCheck}
                                title={task.title}
                                subtitle={getCourseName(task.courseId)}
                                trailing={formatDueDate(task.dueDate)}
                            />
                        ))}
                    </div>
                )}
            </SectionCard>
        </motion.div>
    );
}