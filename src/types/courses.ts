export interface Course {
    id: string;
    name: string;
    code: string;
    lecturer: string;
    semester: string;
    description: string;
    notesCount: number;
    materialsCount: number;
    assignmentsCount: number;
    /** 0–100 */
    progress: number;
    /** Tailwind gradient stops, e.g. "from-violet-500 to-indigo-500" */
    color: string;
}

export type MaterialType = "pdf" | "ppt" | "doc" | "xls" | "zip" | "image" | "video";

export interface CourseMaterial {
    id: string;
    name: string;
    type: MaterialType;
    size: string;
    updatedAt: string;
    /** Present for real (Supabase-backed) materials; absent for dummy/generated ones.
     *  Needed by CourseDetailPage's Preview/Download actions (Sprint 6.3). */
    fileUrl?: string;
    mimeType?: string;
}

export interface CourseNote {
    id: string;
    title: string;
    updatedAt: string;
}

export type AssignmentPriority = "high" | "medium" | "low";
export type AssignmentStatus = "pending" | "in-progress" | "submitted";

export interface CourseAssignment {
    id: string;
    title: string;
    dueDate: string;
    priority: AssignmentPriority;
    status: AssignmentStatus;
}

export type ActivityType = "viewed" | "edited" | "downloaded" | "uploaded" | "created";

export interface CourseActivity {
    id: string;
    type: ActivityType;
    description: string;
    updatedAt: string;
}