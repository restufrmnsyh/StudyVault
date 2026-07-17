import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { SectionCard, ListRow } from "@/components/common";
import { useNotes } from "@/hooks/queries/useNotes";
import { useCourses } from "@/hooks/queries/useCourses";

const containerVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.3 },
  },
};

const listVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.45 },
  },
};

const rowVariant = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "1d ago";
  } else {
    return `${diffDays}d ago`;
  }
}

export function RecentNotes() {
  const { data: notes, loading: notesLoading } = useNotes();
  const { data: courses, loading: coursesLoading } = useCourses();

  const recentNotes = notes
    .filter((note) => !note.archived)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const isLoading = notesLoading || coursesLoading;

  return (
    <motion.div variants={containerVariant} initial="hidden" animate="visible">
      <SectionCard
        icon={FileText}
        title="Recent Notes"
        action={{
          label: "View All",
          onClick: () => {
            window.location.hash = "#/dashboard/notes";
          },
        }}
      >
        <motion.div
          className="divide-y divide-zinc-800/60"
          variants={listVariant}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <div className="px-5 py-4 text-[13px] text-text-muted">Loading...</div>
          ) : recentNotes.length === 0 ? (
            <div className="px-5 py-4 text-[13px] text-text-muted">No recent notes</div>
          ) : (
            recentNotes.map((note) => {
              const course = courses.find((c) => c.id === note.courseId);
              const courseCode = course ? course.code : "";
              const timeStr = formatRelativeTime(note.updatedAt);
              return (
                <motion.div key={note.id} variants={rowVariant}>
                  <ListRow
                    title={note.title}
                    subtitle={courseCode}
                    trailing={timeStr}
                    onClick={() => {
                      window.location.hash = `#/dashboard/notes/${note.id}`;
                    }}
                  />
                </motion.div>
              );
            })
          )}
        </motion.div>
      </SectionCard>
    </motion.div>
  );
}

