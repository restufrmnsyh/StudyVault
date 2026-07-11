import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  LayoutDashboard,
  Settings,
  Bell,
  GraduationCap,
  Clock,
  Flame,
  Target,
  BookMarked,
} from "lucide-react";
import { Section, Container } from "@/components/common";
import { PREVIEW } from "@/constants/landing";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
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

const stats = [
  { label: "Courses", value: "6", icon: BookMarked, color: "from-violet-500 to-indigo-500" },
  { label: "Notes", value: "142", icon: FileText, color: "from-blue-500 to-cyan-500" },
  { label: "Study Hours", value: "38h", icon: Clock, color: "from-emerald-500 to-teal-500" },
  { label: "Streak", value: "12 days", icon: Flame, color: "from-amber-500 to-orange-500" },
];

const recentNotes = [
  { title: "Binary Search Trees", course: "CS201", time: "2h ago" },
  { title: "Eigenvalues & Eigenvectors", course: "MATH301", time: "5h ago" },
  { title: "Neural Network Backprop", course: "CS401", time: "1d ago" },
  { title: "SQL Query Optimization", course: "CS302", time: "2d ago" },
];

const courses = [
  { name: "Data Structures", code: "CS201", progress: 78, color: "from-violet-500 to-indigo-500" },
  { name: "Linear Algebra", code: "MATH301", progress: 65, color: "from-blue-500 to-cyan-500" },
  { name: "Machine Learning", code: "CS401", progress: 42, color: "from-emerald-500 to-teal-500" },
  { name: "Database Systems", code: "CS302", progress: 91, color: "from-amber-500 to-orange-500" },
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
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.span variants={fadeInUp} className="mb-4 inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-400">
            {PREVIEW.badge}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="mb-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {PREVIEW.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-text-secondary">
            {PREVIEW.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={scaleIn}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-b from-violet-500/10 via-transparent to-indigo-500/5 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0f] shadow-2xl shadow-black/40">
            <div className="flex min-h-[520px]">
              {/* Sidebar */}
              <div className="hidden w-52 flex-shrink-0 border-r border-white/[0.04] bg-[#0a0a0d] md:block">
                <div className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-3.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
                    <GraduationCap className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-[13px] font-semibold text-text-primary">StudyVault</span>
                </div>
                <nav className="space-y-0.5 p-2">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] transition-colors ${
                        item.active
                          ? "bg-violet-500/10 font-medium text-violet-400"
                          : "text-text-muted"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main content */}
              <div className="flex-1 overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-2.5">
                  <div className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5 text-[12px] text-text-muted">
                    <Search className="h-3 w-3" />
                    <span>Search notes, courses...</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/[0.04]">
                      <Bell className="h-3.5 w-3.5" />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-violet-500" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />
                  </div>
                </div>

                <div className="p-5">
                  {/* Stats row */}
                  <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="mb-2 flex items-center gap-1.5">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br ${stat.color}`}>
                            <stat.icon className="h-2.5 w-2.5 text-white" />
                          </div>
                          <span className="text-[10px] text-text-muted">{stat.label}</span>
                        </div>
                        <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    {/* Course progress — left column */}
                    <div className="lg:col-span-3">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-[13px] font-semibold text-text-primary">Course Progress</h4>
                        <span className="text-[11px] text-text-muted">Fall 2026</span>
                      </div>
                      <div className="space-y-2.5">
                        {courses.map((course) => (
                          <div key={course.code} className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-text-muted" />
                                <span className="text-[12px] font-medium text-text-primary">{course.name}</span>
                              </div>
                              <span className="text-[11px] font-medium text-text-muted">{course.progress}%</span>
                            </div>
                            <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                              <div className={`h-full rounded-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent notes — right column */}
                    <div className="lg:col-span-2">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-[13px] font-semibold text-text-primary">Recent Notes</h4>
                        <span className="text-[11px] text-violet-400">View all</span>
                      </div>
                      <div className="space-y-1.5">
                        {recentNotes.map((note) => (
                          <div key={note.title} className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-2.5">
                            <p className="mb-0.5 truncate text-[12px] font-medium text-text-primary">{note.title}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-violet-400/70">{note.course}</span>
                              <span className="text-[10px] text-text-muted">{note.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
