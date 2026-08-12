import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, Loader2, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { CourseCard, CoursesToolbar, CreateCourseModal } from "@/components/courses";
import { EmptyState } from "@/components/common";
import { useCourses } from "@/hooks/queries/useCourses";

const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
    },
};

const gridStagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
};

export function CoursesPage() {
    const { data: courses, loading, error, refresh, createCourse } = useCourses();
    const [search, setSearch] = useState("");
    const [semester, setSemester] = useState("All Semesters");
    const [createCourseOpen, setCreateCourseOpen] = useState(false);

    const filteredCourses = useMemo(() => {
        const query = search.trim().toLowerCase();
        return courses.filter((course) => {
            const matchesSearch =
                query === "" ||
                course.name.toLowerCase().includes(query) ||
                course.lecturer.toLowerCase().includes(query) ||
                course.code.toLowerCase().includes(query);
            const matchesSemester = semester === "All Semesters" || course.semester === semester;
            return matchesSearch && matchesSemester;
        });
    }, [courses, search, semester]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
                    <p className="text-[14px] font-medium text-text-primary">Loading courses…</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-500/20 py-20 text-center">
                    <AlertTriangle className="h-8 w-8 text-rose-400" />
                    <p className="text-[14px] font-medium text-text-primary">Couldn't load courses</p>
                    <p className="max-w-sm text-[13px] text-text-muted">{error}</p>
                    <button
                        type="button"
                        onClick={() => void refresh()}
                        className="mt-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[13px] font-medium text-text-secondary transition-colors hover:border-violet-500/30 hover:text-violet-400"
                    >
                        Try again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                {/* Header */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
                >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                            Courses
                        </h1>
                        <p className="mt-1.5 text-[15px] text-text-muted">
                            {courses.length} course{courses.length !== 1 ? "s" : ""} across your academic journey.
                        </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCreateCourseOpen(true)}
                            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-violet-500/20"
                        >
                            <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
                            New Course
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                >
                    <CoursesToolbar
                        searchValue={search}
                        onSearchChange={setSearch}
                        selectedSemester={semester}
                        onSemesterChange={setSemester}
                    />
                </motion.div>

                {/* Empty state: no courses exist at all */}
                {courses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-800">
                        <EmptyState
                            icon={BookOpen}
                            title="No courses yet"
                            description="Add your first course to get started."
                            action={{ label: "Create Course", onClick: () => setCreateCourseOpen(true) }}
                        />
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
                        variants={gridStagger}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredCourses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    /* No match for current search/filter */
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
                        <BookOpen className="mb-3 h-8 w-8 text-text-muted" />
                        <p className="text-[14px] font-medium text-text-primary">No courses found</p>
                        <p className="mt-1 text-[13px] text-text-muted">
                            Try a different search term or semester.
                        </p>
                    </div>
                )}
            </div>

            <CreateCourseModal
                open={createCourseOpen}
                onClose={() => setCreateCourseOpen(false)}
                onCreate={createCourse}
            />
        </DashboardLayout>
    );
}
