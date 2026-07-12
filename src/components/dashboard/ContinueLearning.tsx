import { motion } from "framer-motion";
import { Play, BookOpen } from "lucide-react";

const featuredCourse = {
  title: "Data Structures & Algorithms",
  code: "CS201",
  progress: 78,
  lastTopic: "Binary Search Trees",
  totalNotes: 24,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.2 },
  },
};

export function ContinueLearning() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
    >
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-[13px] font-medium text-text-muted">
          <BookOpen className="h-3.5 w-3.5" />
          Continue Learning
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-lg font-semibold text-text-primary">
              {featuredCourse.title}
            </h3>
            <p className="text-[13px] text-text-muted">
              {featuredCourse.code} · Last: {featuredCourse.lastTopic} · {featuredCourse.totalNotes} notes
            </p>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="text-text-muted">Progress</span>
                <span className="font-medium text-text-primary">{featuredCourse.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
                  style={{ width: `${featuredCourse.progress}%` }}
                />
              </div>
            </div>
          </div>

          <button className="group flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20 sm:self-center">
            <Play className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
}
