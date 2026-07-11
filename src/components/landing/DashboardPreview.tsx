import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  FolderOpen,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Section, Container } from "@/components/common";
import { PREVIEW } from "@/constants/landing";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "Courses" },
  { icon: FileText, label: "Notes" },
  { icon: Calendar, label: "Planner" },
  { icon: Users, label: "Groups" },
  { icon: TrendingUp, label: "Progress" },
  { icon: Settings, label: "Settings" },
];

const courses = [
  {
    name: "Data Structures & Algorithms",
    code: "CS201",
    progress: 78,
    color: "from-violet-500 to-indigo-500",
    notes: 24,
  },
  {
    name: "Linear Algebra",
    code: "MATH301",
    progress: 65,
    color: "from-blue-500 to-cyan-500",
    notes: 18,
  },
  {
    name: "Machine Learning",
    code: "CS401",
    progress: 42,
    color: "from-emerald-500 to-teal-500",
    notes: 12,
  },
  {
    name: "Database Systems",
    code: "CS302",
    progress: 91,
    color: "from-amber-500 to-orange-500",
    notes: 31,
  },
];

export function DashboardPreview() {
  return (
    <Section id="preview">
      <Container>
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.span
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400"
          >
            {PREVIEW.badge}
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          >
            {PREVIEW.title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-text-secondary"
          >
            {PREVIEW.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={scaleIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glow-strong overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div className="flex min-h-[480px]">
            {/* Sidebar */}
            <div className="hidden w-56 flex-shrink-0 border-r border-border-subtle bg-background p-4 md:block">
              <div className="mb-6 flex items-center gap-2 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gradient-from to-gradient-to">
                  <FolderOpen className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  StudyVault
                </span>
              </div>

              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      item.active
                        ? "bg-violet-500/10 font-medium text-violet-400"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              {/* Top bar */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    My Courses
                  </h3>
                  <p className="text-sm text-text-muted">
                    Fall 2026 Semester
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-muted">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search notes...</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gradient-from to-gradient-to" />
                </div>
              </div>

              {/* Course cards grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {courses.map((course) => (
                  <div
                    key={course.code}
                    className="rounded-xl border border-border-subtle bg-background p-4 transition-colors hover:border-border"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {course.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {course.code}
                        </p>
                      </div>
                      <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400">
                        {course.notes} notes
                      </span>
                    </div>

                    <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border-subtle">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
