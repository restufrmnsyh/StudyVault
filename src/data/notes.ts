import type { Note, NoteActivityItem, NoteContentBlock, NoteMaterial } from "@/types/notes";

export const notes: Note[] = [
    {
        id: "1",
        title: "Binary Search Trees — Insertion & Deletion",
        courseCode: "CS201",
        tags: ["algorithms", "trees"],
        lastEdited: "2h ago",
        editedDaysAgo: 0,
        preview:
            "Covers rotation cases during insertion and the three deletion scenarios (leaf, one child, two children).",
        favorite: true,
        archived: false,
        createdDate: "May 12, 2026",
    },
    {
        id: "2",
        title: "Eigenvalues & Eigenvectors Review",
        courseCode: "MATH301",
        tags: ["exam-prep"],
        lastEdited: "5h ago",
        editedDaysAgo: 0,
        preview: "Characteristic polynomial derivation, diagonalization, and worked examples for the midterm.",
        favorite: false,
        archived: false,
        createdDate: "Apr 28, 2026",
    },
    {
        id: "3",
        title: "Neural Network Backpropagation",
        courseCode: "CS401",
        tags: ["deep-learning", "math"],
        lastEdited: "1d ago",
        editedDaysAgo: 1,
        preview: "Chain rule walkthrough for gradient computation across hidden layers, with a worked 2-layer example.",
        favorite: true,
        archived: false,
        createdDate: "Jun 20, 2026",
    },
    {
        id: "4",
        title: "SQL Query Optimization Techniques",
        courseCode: "CS302",
        tags: ["database"],
        lastEdited: "2d ago",
        editedDaysAgo: 2,
        preview: "Index usage, query plans, and when a join reorder actually helps performance.",
        favorite: false,
        archived: false,
        createdDate: "May 30, 2026",
    },
    {
        id: "5",
        title: "Graph Traversal: BFS vs DFS",
        courseCode: "CS201",
        tags: ["algorithms"],
        lastEdited: "3d ago",
        editedDaysAgo: 3,
        preview: "Side-by-side comparison of traversal order, use cases, and time/space complexity.",
        favorite: false,
        archived: false,
        createdDate: "May 15, 2026",
    },
    {
        id: "6",
        title: "Discrete Math Final Review",
        courseCode: "MATH201",
        tags: ["exam-prep", "review"],
        lastEdited: "4d ago",
        editedDaysAgo: 4,
        preview: "Condensed summary of logic, combinatorics, and graph theory topics likely on the final.",
        favorite: true,
        archived: false,
        createdDate: "Mar 10, 2026",
    },
    {
        id: "7",
        title: "OS Process Scheduling Notes",
        courseCode: "CS305",
        tags: ["operating-systems"],
        lastEdited: "6d ago",
        editedDaysAgo: 6,
        preview: "Round robin, priority scheduling, and a comparison of starvation risks between algorithms.",
        favorite: false,
        archived: false,
        createdDate: "Jun 25, 2026",
    },
    {
        id: "8",
        title: "Design Patterns Cheat Sheet",
        courseCode: "CS310",
        tags: ["patterns", "reference"],
        lastEdited: "1w ago",
        editedDaysAgo: 7,
        preview: "Quick-reference summary of the Gang of Four patterns covered so far this semester.",
        favorite: false,
        archived: true,
        createdDate: "Feb 18, 2026",
    },
    {
        id: "9",
        title: "Probability Distributions Summary",
        courseCode: "MATH210",
        tags: ["statistics"],
        lastEdited: "2w ago",
        editedDaysAgo: 10,
        preview: "Binomial, Poisson, and normal distributions with when-to-use guidance and formulas.",
        favorite: false,
        archived: true,
        createdDate: "Jan 22, 2026",
    },
    {
        id: "10",
        title: "Old CS201 Lecture 1 Notes",
        courseCode: "CS201",
        tags: ["archive"],
        lastEdited: "1mo ago",
        editedDaysAgo: 30,
        preview: "Introductory notes from the first week — superseded by later, more complete material.",
        favorite: false,
        archived: true,
        createdDate: "Jan 5, 2026",
    },
];

/**
 * Structured dummy body for the Note Detail page. One shared template covering every
 * required block type (headings, paragraphs, both list types, a code block, a quote) —
 * intentionally generic rather than unique per note, since there is no editor yet to
 * author real per-note content. Swapping this for persisted content later only means
 * changing what this function returns, not how NoteContentBlocks renders it.
 */
export function getNoteContent(note: Note): NoteContentBlock[] {
    return [
        { kind: "heading", level: 2, text: "Overview" },
        { kind: "paragraph", text: note.preview },
        { kind: "heading", level: 2, text: "Key concepts" },
        {
            kind: "bullet-list",
            items: [
                "Definitions and notation used throughout this topic",
                "The core assumptions the standard approach relies on",
                "Common edge cases that trip people up in practice",
            ],
        },
        { kind: "heading", level: 3, text: "Step-by-step walkthrough" },
        {
            kind: "numbered-list",
            items: [
                "Identify the inputs and what the expected output looks like",
                "Apply the core technique covered in lecture",
                "Check the result against a small worked example",
            ],
        },
        { kind: "heading", level: 3, text: "Reference snippet" },
        {
            kind: "code",
            language: "python",
            code: "def solve(input_data):\n    # Placeholder illustrating the general shape\n    # of the approach discussed above.\n    result = process(input_data)\n    return result",
        },
        {
            kind: "quote",
            text: "\"Understanding why an approach works matters more than memorizing the steps.\" — lecture takeaway",
        },
        { kind: "paragraph", text: `Tagged under ${note.tags.map((t) => `#${t}`).join(", ")} for quick filtering later.` },
    ];
}

/** Cycled per-note so different notes show a slightly different mix of file types. */
const noteMaterialTemplates: Array<{ name: string; type: NoteMaterial["type"] }> = [
    { name: "Week 4 Slides.pdf", type: "pdf" },
    { name: "BST.pdf", type: "pdf" },
    { name: "Lecture Notes.docx", type: "doc" },
    { name: "Practice Problems.pdf", type: "pdf" },
    { name: "Diagram Reference.png", type: "image" },
];

export function getRelatedMaterials(note: Note): NoteMaterial[] {
    const count = 2 + (Number(note.id) % 2); // deterministic 2 or 3 items per note
    return noteMaterialTemplates.slice(0, count).map((tpl, i) => ({
        id: `${note.id}-material-${i + 1}`,
        ...tpl,
    }));
}

/** Timeline shown in the Recent Activity section. "favorited" only appears for notes
 *  currently favorited — mirrors how getCourseActivity conditionally omits entries. */
export function getNoteActivity(note: Note): NoteActivityItem[] {
    const activity: NoteActivityItem[] = [
        { id: `${note.id}-activity-created`, type: "created", updatedAt: note.createdDate },
        { id: `${note.id}-activity-edited`, type: "edited", updatedAt: note.lastEdited },
        { id: `${note.id}-activity-viewed`, type: "viewed", updatedAt: "1h ago" },
    ];

    if (note.favorite) {
        activity.push({ id: `${note.id}-activity-favorited`, type: "favorited", updatedAt: note.lastEdited });
    }

    return activity;
}
