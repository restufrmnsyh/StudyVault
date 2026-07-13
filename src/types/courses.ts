export interface Course {
    id: string;
    name: string;
    code: string;
    lecturer: string;
    semester: string;
    notesCount: number;
    /** 0–100 */
    progress: number;
    /** Tailwind gradient stops, e.g. "from-violet-500 to-indigo-500" */
    color: string;
}
