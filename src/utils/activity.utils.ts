import type { NoteRecord } from "@/services/note.service";
import type { MaterialRecord } from "@/services/material.service";
import type { PlannerTaskRecord } from "@/services/planner.service";
import type { Course } from "@/types/courses";

/**
 * Sprint 6.5.5 — Activity aggregation utilities for Recent Activity widget.
 * Sprint 6.5.6 — Course recommendation utilities for Continue Learning widget.
 * Synthesizes an activity timeline from Notes, Materials, and Planner data.
 */

export type ActivityType = "created-note" | "uploaded-material" | "completed-task";

export interface ActivityItem {
    id: string;
    type: ActivityType;
    title: string;
    subtitle: string;
    timestamp: string;
    trailing: string;
}

/**
 * Formats an ISO timestamp into a human-readable relative time string.
 * 
 * Examples:
 * - "Just now" (< 1 minute)
 * - "5m ago" (< 1 hour)
 * - "2h ago" (< 24 hours)
 * - "3d ago" (< 7 days)
 * - "2w ago" (7+ days)
 * 
 * Generic utility that can be reused across the application.
 * 
 * @param isoTimestamp - ISO 8601 timestamp string
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(isoTimestamp: string): string {
    const now = Date.now();
    const then = new Date(isoTimestamp).getTime();
    const diffMs = now - then;
    
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${diffWeeks}w ago`;
}

/**
 * Maps a Note to an activity item.
 */
function mapNoteToActivity(note: NoteRecord, courses: Course[]): ActivityItem {
    const course = courses.find((c) => c.id === note.courseId);
    const courseName = course ? `${course.code} • ${course.name}` : "Unknown Course";
    
    return {
        id: `note-${note.id}`,
        type: "created-note",
        title: "Created Note",
        subtitle: `${note.title} — ${courseName}`,
        timestamp: note.createdAt,
        trailing: formatRelativeTime(note.createdAt),
    };
}

/**
 * Maps a Material to an activity item.
 */
function mapMaterialToActivity(material: MaterialRecord, courses: Course[]): ActivityItem {
    const course = courses.find((c) => c.id === material.courseId);
    const courseName = course ? `${course.code} • ${course.name}` : "Unknown Course";
    
    return {
        id: `material-${material.id}`,
        type: "uploaded-material",
        title: "Uploaded Material",
        subtitle: `${material.title} — ${courseName}`,
        timestamp: material.createdAt,
        trailing: formatRelativeTime(material.createdAt),
    };
}

/**
 * Maps a completed Planner task to an activity item.
 */
function mapTaskToActivity(task: PlannerTaskRecord, courses: Course[]): ActivityItem {
    const course = courses.find((c) => c.id === task.courseId);
    const courseName = course ? `${course.code} • ${course.name}` : "Unknown Course";
    
    return {
        id: `task-${task.id}`,
        type: "completed-task",
        title: "Completed Task",
        subtitle: `${task.title} — ${courseName}`,
        timestamp: task.updatedAt, // When it was completed
        trailing: formatRelativeTime(task.updatedAt),
    };
}

/**
 * Aggregates activities from Notes, Materials, and Planner tasks into a unified
 * timeline sorted by timestamp (newest first).
 * 
 * Activity types:
 * - Created Note (from note.createdAt)
 * - Uploaded Material (from material.createdAt)
 * - Completed Task (from task.updatedAt, where task.completed === true)
 * 
 * @param notes - All user notes
 * @param materials - All user materials
 * @param tasks - All user planner tasks
 * @param courses - All user courses (for course name lookup)
 * @param maxCount - Maximum number of activities to return (default: 4)
 * @returns Array of recent activities, sorted by timestamp descending
 */
export function aggregateActivities(
    notes: NoteRecord[],
    materials: MaterialRecord[],
    tasks: PlannerTaskRecord[],
    courses: Course[],
    maxCount: number = 4
): ActivityItem[] {
    const activities: ActivityItem[] = [];
    
    // Map notes → activities
    notes.forEach((note) => {
        activities.push(mapNoteToActivity(note, courses));
    });
    
    // Map materials → activities
    materials.forEach((material) => {
        activities.push(mapMaterialToActivity(material, courses));
    });
    
    // Map completed tasks → activities
    tasks
        .filter((task) => task.completed)
        .forEach((task) => {
            activities.push(mapTaskToActivity(task, courses));
        });
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Limit to maxCount
    return activities.slice(0, maxCount);
}

/**
 * Sprint 6.5.6 — Recommends a course for the Continue Learning widget.
 * 
 * Priority rules:
 * 1. Course with nearest active planner task
 * 2. Course with most recently created note
 * 3. Course with most recently uploaded material
 * 4. First available course
 * 5. null if no courses exist
 * 
 * @param courses - All user courses
 * @param notes - All user notes (sorted by created_at DESC)
 * @param materials - All user materials (sorted by created_at DESC)
 * @param tasks - All user planner tasks (sorted by due_date ASC)
 * @returns Recommended course or null if no courses
 */
export function recommendCourse(
    courses: Course[],
    notes: NoteRecord[],
    materials: MaterialRecord[],
    tasks: PlannerTaskRecord[]
): Course | null {
    if (courses.length === 0) return null;
    
    // Rule 1: Course with nearest active task
    const activeTasks = tasks.filter((t) => !t.completed);
    if (activeTasks.length > 0) {
        const course = courses.find((c) => c.id === activeTasks[0].courseId);
        if (course) return course;
    }
    
    // Rule 2: Course with most recent note
    if (notes.length > 0) {
        const course = courses.find((c) => c.id === notes[0].courseId);
        if (course) return course;
    }
    
    // Rule 3: Course with most recent material
    if (materials.length > 0) {
        const course = courses.find((c) => c.id === materials[0].courseId);
        if (course) return course;
    }
    
    // Rule 4: First available course
    return courses[0];
}
