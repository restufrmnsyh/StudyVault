import { useState } from "react";
import {
  DashboardLayout,
  Hero,
  QuickActions,
  TodaysFocus,
  ContinueLearning,
  UpcomingDeadlines,
  RecentActivity,
  OverviewCards,
} from "@/components/dashboard";
import { CreateCourseModal } from "@/components/courses";
import { useCourses } from "@/hooks/queries/useCourses";

export function DashboardPage() {
  // Owned here (not inside Hero) so Hero's stat count and CreateCourseModal's create
  // action share the exact same list — creating a course updates the visible count
  // immediately, with no page reload and no second fetch.
  const { data: courses, loading: coursesLoading, createCourse } = useCourses();
  const [createCourseOpen, setCreateCourseOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <Hero
          courses={courses}
          coursesLoading={coursesLoading}
          onCreateCourse={() => setCreateCourseOpen(true)}
        />
        <QuickActions onCreateCourse={() => setCreateCourseOpen(true)} />
        <TodaysFocus />
        <ContinueLearning />
        <UpcomingDeadlines />
        <RecentActivity />
        <OverviewCards />
      </div>

      <CreateCourseModal
        open={createCourseOpen}
        onClose={() => setCreateCourseOpen(false)}
        onCreate={createCourse}
      />
    </DashboardLayout>
  );
}
