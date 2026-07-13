import { motion } from "framer-motion";
import { dashboardStats } from "@/data/dashboard";
import { StatCard } from "@/components/common";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export function OverviewCards() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {dashboardStats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          trend={stat.trend}
        />
      ))}
    </motion.div>
  );
}
