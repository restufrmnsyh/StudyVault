import { useState } from "react";
import {
  DashboardLayout,
  Hero,
  QuickActions,
  TodaysFocus,
  ContinueLearning,
  UpcomingDeadlines,
  RecentActivity,
  RecentNotes,
  OverviewCards,
} from "@/components/dashboard";
import { CreateCourseModal } from "@/components/courses";
import { CreateNoteModal } from "@/components/notes";
import { useCourses } from "@/hooks/queries/useCourses";
import { useNotes } from "@/hooks/queries/useNotes";

export function DashboardPage() {
  // Owned here (not inside Hero) so Hero's stat count and CreateCourseModal's create
  // action share the exact same list — creating a course updates the visible count
  // immediately, with no page reload and no second fetch.
  const { data: courses, loading: coursesLoading, createCourse } = useCourses();
  const { data: notes, loading: notesLoading, createNote } = useNotes();
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <Hero
          courses={courses}
          coursesLoading={coursesLoading}
          notes={notes}
          notesLoading={notesLoading}
          onCreateCourse={() => setCreateCourseOpen(true)}
          onCreateNote={() => setCreateNoteOpen(true)}
        />
        <QuickActions
          onCreateCourse={() => setCreateCourseOpen(true)}
          onCreateNote={() => setCreateNoteOpen(true)}
        />
        <TodaysFocus />
        <ContinueLearning />
        <UpcomingDeadlines />
        <RecentActivity />
        <RecentNotes notes={notes} loading={notesLoading} />
        <OverviewCards />
      </div>

      <CreateCourseModal
        open={createCourseOpen}
        onClose={() => setCreateCourseOpen(false)}
        onCreate={createCourse}
      />

      <CreateNoteModal
        open={createNoteOpen}
        onClose={() => setCreateNoteOpen(false)}
        courses={courses}
        onCreate={createNote}
      />
    </DashboardLayout>
  );
}
