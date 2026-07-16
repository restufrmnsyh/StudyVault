import { motion } from "framer-motion";
import { CheckCircle2, FilePlus, FolderPlus, Star } from "lucide-react";
import { SectionCard, ListRow } from "@/components/common";

const activities = [
    { id: "1", icon: FilePlus, title: "Created Note", subtitle: "Binary Search Trees — CS201", trailing: "2h ago" },
    { id: "2", icon: CheckCircle2, title: "Completed Planner Task", subtitle: "Problem Set 4", trailing: "5h ago" },
    { id: "3", icon: FolderPlus, title: "Added Course", subtitle: "Introduction to Neural Networks", trailing: "1d ago" },
    { id: "4", icon: Star, title: "Favorited Note", subtitle: "Eigenvalues & Eigenvectors Review", trailing: "2d ago" },
];

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

export function RecentActivity() {
    return (
        <motion.div variants={containerVariant} initial="hidden" animate="visible">
            <SectionCard icon={CheckCircle2} title="Recent Activity">
                <motion.div
                    className="divide-y divide-zinc-800/60"
                    variants={listVariant}
                    initial="hidden"
                    animate="visible"
                >
                    {activities.map((activity) => (
                        <motion.div key={activity.id} variants={rowVariant}>
                            <ListRow
                                icon={activity.icon}
                                title={activity.title}
                                subtitle={activity.subtitle}
                                trailing={activity.trailing}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </SectionCard>
        </motion.div>
    );
}