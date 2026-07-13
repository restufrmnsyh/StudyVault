import { motion } from "framer-motion";
import {
    ArrowLeft,
    BarChart3,
    BookOpen,
    CalendarClock,
    ClipboardList,
    Clock,
    Download,
    Eye,
    FileArchive,
    FileImage,
    FilePlus,
    FileSpreadsheet,
    FileText,
    FileType2,
    FileVideo,
    Layers,
    Pencil,
    PlayCircle,
    Presentation,
    StickyNote,
    TrendingUp,
    Upload,
    Zap,
    type LucideIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { StatCard, SectionCard, ListRow, ProgressBar, EmptyState } from "@/components/common";
import { courses, getCourseMaterials, getCourseNotes, getCourseAssignments, getCourseActivity } from "@/data/courses";
import type { CourseMaterial, CourseAssignment, CourseActivity } from "@/types/courses";
import { cn } from "@/lib/utils";

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

const priorityStyle: Record<CourseAssignment["priority"], string> = {
    high: "bg-rose-500/10 text-rose-400",
    medium: "bg-amber-500/10 text-amber-400",
    low: "bg-emerald-500/10 text-emerald-400",
};
const priorityLabel: Record<CourseAssignment["priority"], string> = {
    high: "High",
    medium: "Medium",
    low: "Low",
};
const statusStyle: Record<CourseAssignment["status"], string> = {
    pending: "bg-white/[0.05] text-text-muted",
    "in-progress": "bg-blue-500/10 text-blue-400",
    submitted: "bg-emerald-500/10 text-emerald-400",
};
const statusLabel: Record<CourseAssignment["status"], string> = {
    pending: "Pending",
    "in-progress": "In Progress",
    submitted: "Submitted",
};

/** Priority + status pill pair, reusing the exact badge style already used for stat trends. */
function AssignmentBadges({ assignment }: { assignment: CourseAssignment }) {
    return (
        <>
            <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", priorityStyle[assignment.priority])}>
                {priorityLabel[assignment.priority]}
            </span>
            <span className={cn("hidden rounded-md px-2 py-0.5 text-[11px] font-medium sm:inline-block", statusStyle[assignment.status])}>
                {statusLabel[assignment.status]}
            </span>
        </>
    );
}

const activityIcon: Record<CourseActivity["type"], LucideIcon> = {
    viewed: Eye,
    edited: Pencil,
    downloaded: Download,
    uploaded: Upload,
    created: FilePlus,
};

interface QuickAction {
    icon: LucideIcon;
    label: string;
    color: string;
}

const quickActions: QuickAction[] = [
    { icon: StickyNote, label: "Create Note", color: "from-violet-500 to-indigo-500" },
    { icon: Upload, label: "Upload Material", color: "from-blue-500 to-cyan-500" },
    { icon: ClipboardList, label: "View Assignments", color: "from-amber-500 to-orange-500" },
    { icon: PlayCircle, label: "Start Study Session", color: "from-emerald-500 to-teal-500" },
];

/**
 * Clickable icon+label action tile. New (not in components/common yet) because no existing
 * component covers this shape — StatCard shows a value, ListRow shows list data, neither
 * fits a standalone dummy action button. Kept local since it's only used here so far.
 */
function QuickActionButton({ icon: Icon, label, color }: QuickAction) {
    return (
        <button
            type="button"
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-center transition-colors duration-200 hover:border-violet-500/25 hover:bg-white/[0.02]"
        >
            <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-sm transition-transform duration-300 group-hover:scale-105`}
            >
                <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-[12px] font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                {label}
            </span>
        </button>
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
    const assignments = getCourseAssignments(course);
    const activity = getCourseActivity(course);

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

                {/* Statistics */}
                <div>
                    <div className="mb-3 flex items-center gap-2 text-[12px] font-medium uppercase tracking-wide text-text-muted">
                        <BarChart3 className="h-3.5 w-3.5" />
                        Overview
                    </div>
                    <motion.div
                        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                    >
                        <StatCard
                            icon={Layers}
                            value={String(course.materialsCount)}
                            label="Materials"
                            color="from-violet-500 to-indigo-500"
                            compactOnMobile
                        />
                        <StatCard
                            icon={FileText}
                            value={String(course.notesCount)}
                            label="Notes"
                            color="from-blue-500 to-cyan-500"
                            compactOnMobile
                        />
                        <StatCard
                            icon={ClipboardList}
                            value={String(course.assignmentsCount)}
                            label="Assignments"
                            color="from-amber-500 to-orange-500"
                            compactOnMobile
                        />
                        <StatCard
                            icon={TrendingUp}
                            value={`${course.progress}%`}
                            label="Progress"
                            color="from-emerald-500 to-teal-500"
                            compactOnMobile
                        />
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                    <SectionCard icon={Zap} title="Quick Actions">
                        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                            {quickActions.map((action) => (
                                <QuickActionButton key={action.label} {...action} />
                            ))}
                        </div>
                    </SectionCard>
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
                            <EmptyState
                                icon={Layers}
                                title="No materials yet"
                                description="Materials for this course haven't been uploaded."
                            />
                        )}
                    </SectionCard>
                </motion.div>

                {/* Upcoming Assignments + Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.25 }}>
                        <SectionCard icon={CalendarClock} title="Upcoming Assignments">
                            {assignments.length > 0 ? (
                                <div className="divide-y divide-zinc-800/60">
                                    {assignments.map((assignment) => (
                                        <ListRow
                                            key={assignment.id}
                                            icon={ClipboardList}
                                            title={assignment.title}
                                            subtitle={`Due ${assignment.dueDate}`}
                                            actions={<AssignmentBadges assignment={assignment} />}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={CalendarClock}
                                    title="No assignments due"
                                    description="You're all caught up for this course."
                                />
                            )}
                        </SectionCard>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                        <SectionCard icon={Clock} title="Recent Activity">
                            {activity.length > 0 ? (
                                <div className="divide-y divide-zinc-800/60">
                                    {activity.map((item) => (
                                        <ListRow
                                            key={item.id}
                                            icon={activityIcon[item.type]}
                                            title={item.description}
                                            subtitle={course.code}
                                            trailing={item.updatedAt}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Clock}
                                    title="No activity yet"
                                    description="Your recent actions in this course will show up here."
                                />
                            )}
                        </SectionCard>
                    </motion.div>
                </div>

                {/* Recent Notes */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.35 }}>
                    <SectionCard icon={FileText} title="Recent Notes">
                        {notes.length > 0 ? (
                            <div className="divide-y divide-zinc-800/60">
                                {notes.map((note) => (
                                    <ListRow key={note.id} title={note.title} subtitle={course.code} trailing={note.updatedAt} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={FileText}
                                title="No notes yet"
                                description="Notes for this course haven't been added."
                            />
                        )}
                    </SectionCard>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
