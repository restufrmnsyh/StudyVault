/** Fixed dropdown options for the Courses semester filter — UI chrome, not course
 *  row data, so it lives here rather than in a per-record data or service file. */
export const semesters: string[] = ["All Semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4"];

/** Numeric options for the Create Course form's semester field — matches the `smallint`
 *  column in migration.sql (no CHECK constraint, but the app only ever shows 1–8). */
export const semesterOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

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