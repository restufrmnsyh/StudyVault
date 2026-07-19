import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { SectionCard, ListRow, EmptyState } from "@/components/common";
import { selectUpcomingDeadlines, formatDueDate } from "@/utils/planner.utils";
import type { PlannerTaskRecord } from "@/services/planner.service";
import type { Course } from "@/types/courses";

interface UpcomingDeadlinesProps {
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

export function UpcomingDeadlines({ tasks, loading, courses }: UpcomingDeadlinesProps) {
    // Select up to 5 upcoming incomplete tasks
    const deadlines = selectUpcomingDeadlines(tasks, 5);

    // Map course ID to "Code • Name" subtitle
    const getCourseName = (courseId: string): string => {
        const course = courses.find((c) => c.id === courseId);
        return course ? `${course.code} • ${course.name}` : "Unknown Course";
    };

    return (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <SectionCard icon={CalendarClock} title="Upcoming Deadlines">
                {!loading && deadlines.length === 0 ? (
                    <div className="px-5 py-8">
                        <EmptyState
                            icon={CalendarClock}
                            title="No upcoming deadlines"
                            description="You're all caught up! Create a new task to get started."
                        />
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-800/60">
                        {deadlines.map((task) => (
                            <ListRow
                                key={task.id}
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