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
}

export interface CourseNote {
    id: string;
    title: string;
    updatedAt: string;
}
