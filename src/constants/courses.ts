export const semesterOptions = [1, 2, 3, 4, 5, 6, 7, 8];

export const semesters = [
    "All Semesters",
    ...semesterOptions.map((n) => `Semester ${n}`),
];

/** Accent color choices for the Create Course form — the exact same gradients
 *  data/courses.ts's dummy fixtures already use, so a newly created course fits the
 *  established palette instead of introducing new colors. */
export const courseAccentColors: string[] = [
    "from-violet-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-purple-500",
    "from-cyan-500 to-blue-500",
    "from-orange-500 to-red-500",
];

/** Initial/reset state for the Create Course form. Lives here (not in CourseForm.tsx)
 *  because a component file exporting a plain value trips
 *  react-hooks/react-refresh's only-export-components rule. */
export const EMPTY_COURSE_FORM_VALUES = {
    name: "",
    code: "",
    lecturer: "",
    semester: "",
    description: "",
    color: courseAccentColors[0],
};