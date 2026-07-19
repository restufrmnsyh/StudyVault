import { FileText, Layers, Paperclip } from "lucide-react";
import { SectionCard, EmptyState, RelatedCourseCard } from "@/components/common";
import type { Course } from "@/types/courses";
import type { NoteRecord } from "@/services/note.service";

interface RelatedResourcesProps {
    course?: Course;
    /** Notes filtered to this task's course, from useNotes() (Supabase). */
    relatedNotes: NoteRecord[];
    /** Full course list from useCourses() — used to resolve note.courseId → code. */
    courses: Course[];
}

function RelatedNoteRow({ note, courses }: { note: NoteRecord; courses: Course[] }) {
    const course = courses.find((c) => c.id === note.courseId);
    return (
        <div className="flex items-center gap-3 px-5 py-3.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-text-muted">
                <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-text-primary">{note.title}</p>
                {course && (
                    <p className="mt-1 truncate text-[11px] text-text-muted">{course.code}</p>
                )}
            </div>
            <a
                href={`#/dashboard/notes/${note.id}`}
                className="flex-shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:border-violet-500/30 hover:text-violet-400"
            >
                Open Note
            </a>
        </div>
    );
}

export function RelatedResources({ course, relatedNotes, courses }: RelatedResourcesProps) {
    return (
        <div className="space-y-6">
            <div>
                <div className="mb-3 text-[12px] font-medium uppercase tracking-wide text-text-muted">
                    Related Course
                </div>
                {course ? (
                    <RelatedCourseCard course={course} />
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-800">
                        <EmptyState
                            icon={Layers}
                            title="No linked course"
                            description="This task isn't linked to a course."
                        />
                    </div>
                )}
            </div>

            <SectionCard icon={FileText} title="Related Notes">
                {relatedNotes.length > 0 ? (
                    <div className="divide-y divide-zinc-800/60">
                        {relatedNotes.map((note) => (
                            <RelatedNoteRow key={note.id} note={note} courses={courses} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={FileText}
                        title="No related notes"
                        description="Notes from this course will show up here."
                    />
                )}
            </SectionCard>

            <SectionCard icon={Paperclip} title="Attachments">
                <EmptyState
                    icon={Paperclip}
                    title="No attachments yet"
                    description="File uploads aren't available yet — coming in a future sprint."
                />
            </SectionCard>
        </div>
    );
}