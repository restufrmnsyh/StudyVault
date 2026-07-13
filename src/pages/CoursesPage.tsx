import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard";
import { CourseCard, CoursesToolbar } from "@/components/courses";
import { courses } from "@/data/courses";

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
    const [search, setSearch] = useState("");
    const [semester, setSemester] = useState("All Semesters");

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
    }, [search, semester]);

    return (
        <DashboardLayout>
            <div className="space-y-6 lg:space-y-8">
                <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                        Courses
                    </h1>
                    <p className="mt-1.5 text-[15px] text-text-muted">
                        {courses.length} courses across your academic journey.
                    </p>
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

                {filteredCourses.length > 0 ? (
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
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 py-16 text-center">
                        <BookOpen className="mb-3 h-8 w-8 text-text-muted" />
                        <p className="text-[14px] font-medium text-text-primary">No courses found</p>
                        <p className="mt-1 text-[13px] text-text-muted">
                            Try a different search term or semester.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
