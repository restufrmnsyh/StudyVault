import { useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, ArrowLeft, ListTodo, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { SectionCard, ProgressBar } from "@/components/common";
import { TaskDetailHeader, ChecklistSection, RelatedResources } from "@/components/planner";
import { tasks, getTaskChecklist } from "@/data/planner";
import { courses } from "@/data/courses";
import { notes } from "@/data/notes";
import type { ChecklistItem } from "@/types/planner";

interface TaskDetailPageProps {
    taskId: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

export function TaskDetailPage({ taskId }: TaskDetailPageProps) {
    const task = tasks.find((t) => t.id === taskId);

    // Checklist toggling is local component state only — no persistence, per this
    // sprint's scope. Re-derived from the task whenever this page is freshly mounted.
    const [checklist, setChecklist] = useState<ChecklistItem[]>(() => (task ? getTaskChecklist(task) : []));

    if (!task) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                    <ListTodo className="h-8 w-8 text-text-muted" />
                    <p className="text-[14px] font-medium text-text-primary">Task not found</p>
                    <a
                        href="#/dashboard/planner"
                        className="text-[13px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                        Back to Planner
                    </a>
                </div>
            </DashboardLayout>
        );
    }

    function toggleChecklistItem(id: string) {
        setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
    }

    const relatedCourse = courses.find((c) => c.code === task.courseCode);
    const relatedNotes = notes.filter((n) => n.courseCode === task.courseCode && !n.archived).slice(0, 3);

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Back button */}
                <a
                    href="#/dashboard/planner"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Planner
                </a>

                {/* Header (title, course, priority, status, due date) */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                    <TaskDetailHeader task={task} courseName={relatedCourse?.name} />
                </motion.div>

                {/* Description */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
                    <SectionCard icon={AlignLeft} title="Description">
                        <div className="p-5 sm:p-6">
                            <p className="text-[14px] leading-relaxed text-text-secondary">{task.description}</p>
                        </div>
                    </SectionCard>
                </motion.div>

                {/* Progress */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <SectionCard icon={TrendingUp} title="Progress">
                        <div className="p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <ProgressBar progress={task.progress} className="flex-1" />
                                <span className="w-10 flex-shrink-0 text-right text-[13px] font-semibold tabular-nums text-text-primary">
                                    {task.progress}%
                                </span>
                            </div>
                        </div>
                    </SectionCard>
                </motion.div>

                {/* Checklist */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
                    <ChecklistSection items={checklist} onToggle={toggleChecklistItem} />
                </motion.div>

                {/* Related Course, Related Notes, Attachments */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <RelatedResources course={relatedCourse} relatedNotes={relatedNotes} />
                </motion.div>
            </div>
        </DashboardLayout>
    );
}