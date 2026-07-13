import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    ClipboardList,
    Download,
    Eye,
    FileArchive,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileType2,
    FileVideo,
    Layers,
    Presentation,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { StatCard, SectionCard, ListRow, ProgressBar } from "@/components/common";
import { courses, getCourseMaterials, getCourseNotes } from "@/data/courses";
import type { CourseMaterial } from "@/types/courses";

interface CourseDetailPageProps {
    courseId: string;
}

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const materialIcon: Record<CourseMaterial["type"], LucideIcon> = {
    pdf: FileText,
    ppt: Presentation,
    doc: FileType2,
    xls: FileSpreadsheet,
    zip: FileArchive,
    image: FileImage,
    video: FileVideo,
};

const materialTypeLabel: Record<CourseMaterial["type"], string> = {
    pdf: "PDF",
    ppt: "PowerPoint",
    doc: "Word",
    xls: "Excel",
    zip: "ZIP",
    image: "Image",
    video: "Video",
};

const actionButtonClass =
    "flex h-7 items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 text-[11px] font-medium text-text-muted transition-colors hover:border-violet-500/30 hover:text-violet-400";

/**
 * Preview/Download pair for a single material row. Kept local to this file (not exported
 * to components/common) since it's a one-off composition of existing button styling used
 * only inside the Materials Library — extracting it to a shared file wasn't warranted.
 */
function MaterialActions({ material }: { material: CourseMaterial }) {
    return (
        <>
            <button type="button" aria-label={`Preview ${material.name}`} className={actionButtonClass}>
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Preview</span>
            </button>
            <button type="button" aria-label={`Download ${material.name}`} className={actionButtonClass}>
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">Download</span>
            </button>
        </>
    );
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                    <BookOpen className="h-8 w-8 text-text-muted" />
                    <p className="text-[14px] font-medium text-text-primary">Course not found</p>
                    <a
                        href="#/dashboard/courses"
                        className="text-[13px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                        Back to Courses
                    </a>
                </div>
            </DashboardLayout>
        );
    }

    const materials = getCourseMaterials(course);
    const notes = getCourseNotes(course);

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Back button */}
                <a
                    href="#/dashboard/courses"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Courses
                </a>

                {/* Course info */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} shadow-sm`}
                        >
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                                    {course.name}
                                </h1>
                                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-text-muted">
                                    {course.code}
                                </span>
                            </div>
                            <p className="mt-1.5 text-[13px] text-text-muted">
                                {course.lecturer} · {course.semester}
                            </p>
                            <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    <StatCard
                        icon={Layers}
                        value={String(course.materialsCount)}
                        label="Materials"
                        color="from-violet-500 to-indigo-500"
                    />
                    <StatCard
                        icon={FileText}
                        value={String(course.notesCount)}
                        label="Notes"
                        color="from-blue-500 to-cyan-500"
                    />
                    <StatCard
                        icon={ClipboardList}
                        value={String(course.assignmentsCount)}
                        label="Assignments"
                        color="from-amber-500 to-orange-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        value={`${course.progress}%`}
                        label="Progress"
                        color="from-emerald-500 to-teal-500"
                    />
                </motion.div>

                {/* Progress section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6"
                >
                    <div className="mb-4 flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-text-muted">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Course Progress
                    </div>
                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                        <span className="text-text-muted">Overall completion</span>
                        <span className="font-medium tabular-nums text-text-primary">{course.progress}%</span>
                    </div>
                    <ProgressBar progress={course.progress} delay={0.3} />
                </motion.div>

                {/* Materials Library */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                    <SectionCard icon={Layers} title="Materials Library">
                        {materials.length > 0 ? (
                            <div className="divide-y divide-zinc-800/60">
                                {materials.map((material) => (
                                    <ListRow
                                        key={material.id}
                                        icon={materialIcon[material.type]}
                                        title={material.name}
                                        subtitle={`${materialTypeLabel[material.type]} · ${material.size}`}
                                        trailing={material.updatedAt}
                                        actions={<MaterialActions material={material} />}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                                <Layers className="mb-3 h-6 w-6 text-text-muted" />
                                <p className="text-[13px] font-medium text-text-primary">No materials yet</p>
                                <p className="mt-1 text-[12px] text-text-muted">
                                    Materials for this course haven't been uploaded.
                                </p>
                            </div>
                        )}
                    </SectionCard>
                </motion.div>

                {/* Recent Notes */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                    <SectionCard icon={FileText} title="Recent Notes">
                        {notes.length > 0 ? (
                            <div className="divide-y divide-zinc-800/60">
                                {notes.map((note) => (
                                    <ListRow key={note.id} title={note.title} subtitle={course.code} trailing={note.updatedAt} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                                <FileText className="mb-3 h-6 w-6 text-text-muted" />
                                <p className="text-[13px] font-medium text-text-primary">No notes yet</p>
                                <p className="mt-1 text-[12px] text-text-muted">
                                    Notes for this course haven't been added.
                                </p>
                            </div>
                        )}
                    </SectionCard>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
