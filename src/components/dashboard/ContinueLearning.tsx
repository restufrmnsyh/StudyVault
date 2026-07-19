import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/common";
import { recommendCourse } from "@/utils/activity.utils";
import type { Course } from "@/types/courses";
import type { NoteRecord } from "@/services/note.service";
import type { MaterialRecord } from "@/services/material.service";
import type { PlannerTaskRecord } from "@/services/planner.service";

interface ContinueLearningProps {
  courses: Course[];
  notes: NoteRecord[];
  materials: MaterialRecord[];
  tasks: PlannerTaskRecord[];
  loading: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.2 },
  },
};

export function ContinueLearning({ courses, notes, materials, tasks, loading }: ContinueLearningProps) {
  // Recommend a course based on activity
  const recommendedCourse = recommendCourse(courses, notes, materials, tasks);

  // Show empty state if no courses
  if (!loading && !recommendedCourse) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
      >
        <div className="p-5 sm:p-6">
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Create your first course to start learning."
          />
        </div>
      </motion.div>
    );
  }

  // Don't render during loading or if no recommendation
  if (!recommendedCourse) return null;

  const handleClick = () => {
    window.location.hash = `#/dashboard/courses/${recommendedCourse.id}`;
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      onClick={handleClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-violet-500/[0.06] blur-3xl" />

      <div className="relative p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
            <BookOpen className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[12px] font-medium tracking-wide text-text-muted uppercase">Continue Learning</span>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="mb-1.5 text-lg font-semibold text-text-primary">
              {recommendedCourse.name}
            </h3>
            <p className="text-[13px] text-text-muted">
              {recommendedCourse.code} • {recommendedCourse.name}
            </p>
            <p className="mt-1 text-[12px] text-text-muted">
              {recommendedCourse.notesCount} notes · {recommendedCourse.materialsCount} materials
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20 sm:self-center"
          >
            <BookOpen className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}