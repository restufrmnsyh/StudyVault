import type { Course, CourseMaterial, CourseNote } from "@/types/courses";

export const semesters: string[] = [
    "All Semesters",
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
];

export const courses: Course[] = [
    {
        id: "1",
        name: "Data Structures & Algorithms",
        code: "CS201",
        lecturer: "Dr. Sarah Mitchell",
        semester: "Semester 3",
        description:
            "Covers core data structures (trees, graphs, hash tables) and algorithm design techniques, with an emphasis on complexity analysis and problem-solving.",
        notesCount: 24,
        materialsCount: 7,
        assignmentsCount: 5,
        progress: 78,
        color: "from-violet-500 to-indigo-500",
    },
    {
        id: "2",
        name: "Linear Algebra & Eigenvalues",
        code: "MATH301",
        lecturer: "Prof. David Kim",
        semester: "Semester 3",
        description:
            "An in-depth study of vector spaces, linear transformations, eigenvalues, and eigenvectors, with applications to engineering and data science.",
        notesCount: 18,
        materialsCount: 4,
        assignmentsCount: 3,
        progress: 62,
        color: "from-blue-500 to-cyan-500",
    },
    {
        id: "3",
        name: "Introduction to Neural Networks",
        code: "CS401",
        lecturer: "Dr. Amara Osei",
        semester: "Semester 4",
        description:
            "Introduces the fundamentals of neural networks, including backpropagation, activation functions, and an overview of modern deep learning architectures.",
        notesCount: 15,
        materialsCount: 5,
        assignmentsCount: 4,
        progress: 41,
        color: "from-emerald-500 to-teal-500",
    },
    {
        id: "4",
        name: "Database Systems & SQL",
        code: "CS302",
        lecturer: "Prof. Michael Tan",
        semester: "Semester 3",
        description:
            "Explores relational database design, normalization, query optimization, and hands-on SQL practice with real-world datasets.",
        notesCount: 21,
        materialsCount: 6,
        assignmentsCount: 6,
        progress: 90,
        color: "from-amber-500 to-orange-500",
    },
    {
        id: "5",
        name: "Discrete Mathematics",
        code: "MATH201",
        lecturer: "Dr. Elena Novak",
        semester: "Semester 2",
        description:
            "Foundational course covering logic, set theory, combinatorics, and graph theory — the mathematical backbone of computer science.",
        notesCount: 30,
        materialsCount: 3,
        assignmentsCount: 5,
        progress: 100,
        color: "from-pink-500 to-rose-500",
    },
    {
        id: "6",
        name: "Operating Systems",
        code: "CS305",
        lecturer: "Prof. James Ortiz",
        semester: "Semester 4",
        description:
            "Covers process management, memory management, file systems, and concurrency in modern operating systems. Course materials are still being uploaded.",
        notesCount: 9,
        materialsCount: 0,
        assignmentsCount: 2,
        progress: 25,
        color: "from-indigo-500 to-purple-500",
    },
    {
        id: "7",
        name: "Software Engineering Principles",
        code: "CS310",
        lecturer: "Dr. Priya Nair",
        semester: "Semester 4",
        description:
            "Focuses on software design patterns, testing strategies, version control workflows, and agile development practices.",
        notesCount: 12,
        materialsCount: 4,
        assignmentsCount: 3,
        progress: 55,
        color: "from-cyan-500 to-blue-500",
    },
    {
        id: "8",
        name: "Probability & Statistics",
        code: "MATH210",
        lecturer: "Prof. Laura Bennett",
        semester: "Semester 2",
        description:
            "Introduces probability theory, random variables, and statistical inference, with applications to experimental design and data analysis.",
        notesCount: 17,
        materialsCount: 2,
        assignmentsCount: 4,
        progress: 34,
        color: "from-orange-500 to-red-500",
    },
];

/** Reusable templates cycled per-course to synthesize a materials library without a backend. */
const materialTemplates: Array<{ name: string; type: CourseMaterial["type"]; size: string }> = [
    { name: "Lecture-Slides-Week1.pptx", type: "ppt", size: "3.1 MB" },
    { name: "Course-Syllabus.pdf", type: "pdf", size: "420 KB" },
    { name: "Assignment-Brief.docx", type: "doc", size: "180 KB" },
    { name: "Grade-Tracker.xlsx", type: "xls", size: "96 KB" },
    { name: "Reference-Diagrams.zip", type: "zip", size: "12.4 MB" },
    { name: "Whiteboard-Photo.jpg", type: "image", size: "2.8 MB" },
    { name: "Lecture-Recording-Week1.mp4", type: "video", size: "245 MB" },
];

export function getCourseMaterials(course: Course): CourseMaterial[] {
    const count = Math.min(course.materialsCount, materialTemplates.length);
    return materialTemplates.slice(0, count).map((tpl, i) => ({
        id: `${course.id}-material-${i + 1}`,
        name: tpl.name,
        type: tpl.type,
        size: tpl.size,
        updatedAt: `${i + 1}d ago`,
    }));
}

const noteTemplates = [
    "Key concepts summary",
    "In-class discussion notes",
    "Exam prep review",
    "Chapter highlights",
    "Study group notes",
];

/** Mirrors the Dashboard's "Recent Notes" — capped at a handful of most-recent items, regardless of total notesCount. */
export function getCourseNotes(course: Course): CourseNote[] {
    const count = course.notesCount > 0 ? noteTemplates.length : 0;
    return noteTemplates.slice(0, count).map((title, i) => ({
        id: `${course.id}-note-${i + 1}`,
        title: `${title} — ${course.code}`,
        updatedAt: `${i + 1}d ago`,
    }));
}
