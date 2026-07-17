import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import { SectionCard, ListRow } from "@/components/common";

const deadlines = [
    { id: "1", title: "Database Quiz", subtitle: "CS302", trailing: "Tomorrow" },
    { id: "2", title: "Operating System Lab", subtitle: "CS305", trailing: "Friday" },
    { id: "3", title: "Linear Algebra Problem Set", subtitle: "MATH301", trailing: "Next Monday" },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function UpcomingDeadlines() {
    return (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <SectionCard icon={CalendarClock} title="Upcoming Deadlines">
                <div className="divide-y divide-zinc-800/60">
                    {deadlines.map((item) => (
                        <ListRow key={item.id} title={item.title} subtitle={item.subtitle} trailing={item.trailing} />
                    ))}
                </div>
            </SectionCard>
        </motion.div>
    );
}