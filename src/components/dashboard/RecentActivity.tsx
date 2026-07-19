import { motion } from "framer-motion";
import { CheckCircle2, FilePlus, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionCard, ListRow, EmptyState } from "@/components/common";
import { aggregateActivities, type ActivityItem, type ActivityType } from "@/utils/activity.utils";
import type { NoteRecord } from "@/services/note.service";
import type { MaterialRecord } from "@/services/material.service";
import type { PlannerTaskRecord } from "@/services/planner.service";
import type { Course } from "@/types/courses";

interface RecentActivityProps {
    notes: NoteRecord[];
    materials: MaterialRecord[];
    tasks: PlannerTaskRecord[];
    courses: Course[];
    loading: boolean;
}

const containerVariant = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const listVariant = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
};

const rowVariant = {
    hidden: { opacity: 0, x: -8 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const activityIcon: Record<ActivityType, LucideIcon> = {
    "created-note": FilePlus,
    "uploaded-material": Upload,
    "completed-task": CheckCircle2,
};

export function RecentActivity({ notes, materials, tasks, courses, loading }: RecentActivityProps) {
    // Aggregate activities from all sources
    const activities = aggregateActivities(notes, materials, tasks, courses, 4);

    return (
        <motion.div variants={containerVariant} initial="hidden" animate="visible">
            <SectionCard icon={CheckCircle2} title="Recent Activity">
                {!loading && activities.length === 0 ? (
                    <div className="px-5 py-8">
                        <EmptyState
                            icon={CheckCircle2}
                            title="No recent activity"
                            description="Your activities will appear here. Create a note, upload a material, or complete a task to get started."
                        />
                    </div>
                ) : (
                    <motion.div
                        className="divide-y divide-zinc-800/60"
                        variants={listVariant}
                        initial="hidden"
                        animate="visible"
                    >
                        {activities.map((activity: ActivityItem) => (
                            <motion.div key={activity.id} variants={rowVariant}>
                                <ListRow
                                    icon={activityIcon[activity.type]}
                                    title={activity.title}
                                    subtitle={activity.subtitle}
                                    trailing={activity.trailing}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </SectionCard>
        </motion.div>
    );
}