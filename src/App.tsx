import { useState, useEffect } from "react";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { CourseDetailPage } from "@/pages/CourseDetailPage";
import { NotesPage } from "@/pages/NotesPage";
import { NoteDetailPage } from "@/pages/NoteDetailPage";
import { NotesProvider } from "@/context/NotesProvider";
import { ToastProvider } from "@/context/ToastProvider";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    function onHashChange() {
      setHash(window.location.hash);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}

function Router() {
  const hash = useHashRoute();

  const courseDetailMatch = hash.match(/^#\/dashboard\/courses\/([^/]+)/);
  if (courseDetailMatch) {
    return <CourseDetailPage courseId={courseDetailMatch[1]} />;
  }

  if (hash.startsWith("#/dashboard/courses")) {
    return <CoursesPage />;
  }

  const noteDetailMatch = hash.match(/^#\/dashboard\/notes\/([^/]+)/);
  if (noteDetailMatch) {
    return <NoteDetailPage noteId={noteDetailMatch[1]} />;
  }

  if (hash.startsWith("#/dashboard/notes")) {
    return <NotesPage />;
  }

  // Any other hash starting with #/dashboard renders the dashboard overview
  if (hash.startsWith("#/dashboard")) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <ToastProvider>
      <NotesProvider>
        <Router />
      </NotesProvider>
    </ToastProvider>
  );
}