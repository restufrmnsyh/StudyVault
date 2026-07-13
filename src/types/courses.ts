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

export interface CourseMaterial {
    id: string;
    title: string;
    type: "pdf" | "video" | "slides";
    /** File size ("2.4 MB") or duration ("18 min") depending on type */
    meta: string;
    updatedAt: string;
}

export interface CourseNote {
    id: string;
    title: string;
    updatedAt: string;
}
