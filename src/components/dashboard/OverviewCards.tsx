import { motion } from "framer-motion";
import { dashboardStats } from "@/data/dashboard";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
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
        <motion.div
          key={stat.label}
          variants={cardVariant}
          whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
          whileTap={{ scale: 0.98 }}
          className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-300 hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.04]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-sm transition-transform duration-300 group-hover:scale-105`}
            >
              <stat.icon className="h-4 w-4 text-white" />
            </div>
            {stat.trend && (
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                {stat.trend}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold tabular-nums text-text-primary">{stat.value}</p>
          <p className="mt-1 text-[13px] text-text-muted">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
