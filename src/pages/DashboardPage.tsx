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
import { CreateCourseModal, UploadMaterialModal } from "@/components/courses";
import { CreateNoteModal } from "@/components/notes";
import { CreateTaskModal } from "@/components/planner";
import { useCourses } from "@/hooks/queries/useCourses";
import { useNotes } from "@/hooks/queries/useNotes";
import { useProfile } from "@/hooks/queries/useProfile";
import { usePlanner } from "@/hooks/queries/usePlanner";
import { useAllMaterials } from "@/hooks/queries/useAllMaterials";
import { uploadMaterialFile, createMaterial } from "@/services/material.service";

export function DashboardPage() {
  // Owned here (not inside Hero) so Hero's stat count and CreateCourseModal's create
  // action share the exact same list — creating a course updates the visible count
  // immediately, with no page reload and no second fetch.
  const { data: courses, loading: coursesLoading, createCourse } = useCourses();
  const { data: notes, loading: notesLoading, createNote } = useNotes();
  const { data: profile } = useProfile();
  const { data: tasks, loading: tasksLoading, createTask } = usePlanner();
  const { data: materials, loading: materialsLoading } = useAllMaterials();
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [uploadMaterialOpen, setUploadMaterialOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        <Hero
          courses={courses}
          coursesLoading={coursesLoading}
          notes={notes}
          notesLoading={notesLoading}
          profile={profile}
          onCreateCourse={() => setCreateCourseOpen(true)}
          onCreateNote={() => setCreateNoteOpen(true)}
        />
        <QuickActions
          onCreateCourse={() => setCreateCourseOpen(true)}
          onCreateNote={() => setCreateNoteOpen(true)}
          onUploadMaterial={() => setUploadMaterialOpen(true)}
        />
        <TodaysFocus tasks={tasks} loading={tasksLoading} courses={courses} />
        <ContinueLearning
          courses={courses}
          notes={notes}
          materials={materials}
          tasks={tasks}
          loading={coursesLoading}
          onCreateCourse={() => setCreateCourseOpen(true)}
        />
        <UpcomingDeadlines tasks={tasks} loading={tasksLoading} courses={courses} onCreateTask={() => setCreateTaskOpen(true)} />
        <RecentActivity
          notes={notes}
          materials={materials}
          tasks={tasks}
          courses={courses}
          loading={notesLoading || materialsLoading || tasksLoading}
        />
        <RecentNotes notes={notes} loading={notesLoading} onCreateNote={() => setCreateNoteOpen(true)} />
        <OverviewCards
          coursesCount={coursesLoading ? 0 : courses.length}
          notesCount={notesLoading ? 0 : notes.length}
          materialsCount={materialsLoading ? 0 : materials.length}
          tasksCount={tasksLoading ? 0 : tasks.length}
        />
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

      <CreateTaskModal
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        onCreate={createTask}
        courses={courses}
      />

      {/* Upload Material — multi-course mode: user picks the target course from the
          dropdown inside the modal. The onUpload handler calls the same two service
          functions that useMaterials.uploadMaterial uses internally; there is no hook
          that accepts a dynamic courseId, so this is the canonical approach. */}
      <UploadMaterialModal
        open={uploadMaterialOpen}
        onClose={() => setUploadMaterialOpen(false)}
        courses={courses}
        onUpload={async (title, description, file, courseId) => {
          const fileUrl = await uploadMaterialFile(courseId, file);
          return createMaterial({
            courseId,
            title,
            description,
            fileName: file.name,
            fileUrl,
            mimeType: file.type || "application/octet-stream",
            fileSize: file.size,
          });
        }}
      />
    </DashboardLayout>
  );
}
