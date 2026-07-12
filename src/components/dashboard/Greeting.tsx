import { motion } from "framer-motion";
import { currentUser } from "@/data/dashboard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export function Greeting() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-6"
    >
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
        {getGreeting()} 👋
      </h1>
      <p className="mt-1 text-[15px] text-text-muted">
        Welcome back, {currentUser.name.split(" ")[0]}.
      </p>
    </motion.div>
  );
}
