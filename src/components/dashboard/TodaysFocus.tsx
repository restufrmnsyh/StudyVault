import { motion } from "framer-motion";
import { ClipboardCheck, Play, Sparkles, Target } from "lucide-react";
import { SectionCard, ListRow } from "@/components/common";

const focusItems = [
    { id: "1", icon: ClipboardCheck, title: "AI Assignment", subtitle: "CS401 · Neural Networks", trailing: "Due Tomorrow" },
    { id: "2", icon: Play, title: "Continue Learning", subtitle: "Data Structures & Algorithms", trailing: "78%" },
    { id: "3", icon: Sparkles, title: "Review Flashcards", subtitle: "MATH301 · Eigenvalues", trailing: "15 min" },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function TodaysFocus() {
    return (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <SectionCard icon={Target} title="Today's Focus">
                <div className="divide-y divide-zinc-800/60">
                    {focusItems.map((item) => (
                        <ListRow
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            subtitle={item.subtitle}
                            trailing={item.trailing}
                        />
                    ))}
                </div>
            </SectionCard>
        </motion.div>
    );
}