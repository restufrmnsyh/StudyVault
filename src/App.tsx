import { useState, useEffect } from "react";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { CourseDetailPage } from "@/pages/CourseDetailPage";
import { NotesPage } from "@/pages/NotesPage";
import { NoteDetailPage } from "@/pages/NoteDetailPage";
import { PlannerPage } from "@/pages/PlannerPage";
import { TaskDetailPage } from "@/pages/TaskDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { NotesProvider } from "@/context/NotesProvider";
import { PlannerProvider } from "@/context/PlannerProvider";
import { ToastProvider } from "@/context/ToastProvider";
import { AuthProvider } from "@/auth/AuthProvider";
import { ProtectedRoute, GuestOnlyRoute } from "@/auth/ProtectedRoute";

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

  // Public auth routes
  if (hash.startsWith("#/login")) {
    return (
      <GuestOnlyRoute>
        <LoginPage />
      </GuestOnlyRoute>
    );
  }

  if (hash.startsWith("#/register")) {
    return (
      <GuestOnlyRoute>
        <RegisterPage />
      </GuestOnlyRoute>
    );
  }

  if (hash.startsWith("#/forgot-password")) {
    // Intentionally not a GuestOnlyRoute: spec lists this as public regardless of auth
    // state (only /login and /register redirect an already-signed-in user away).
    return <ForgotPasswordPage />;
  }

  // Protected app routes
  const courseDetailMatch = hash.match(/^#\/dashboard\/courses\/([^/]+)/);
  if (courseDetailMatch) {
    return (
      <ProtectedRoute>
        <CourseDetailPage courseId={courseDetailMatch[1]} />
      </ProtectedRoute>
    );
  }

  if (hash.startsWith("#/dashboard/courses")) {
    return (
      <ProtectedRoute>
        <CoursesPage />
      </ProtectedRoute>
    );
  }

  const noteDetailMatch = hash.match(/^#\/dashboard\/notes\/([^/]+)/);
  if (noteDetailMatch) {
    return (
      <ProtectedRoute>
        <NoteDetailPage noteId={noteDetailMatch[1]} />
      </ProtectedRoute>
    );
  }

  if (hash.startsWith("#/dashboard/notes")) {
    return (
      <ProtectedRoute>
        <NotesPage />
      </ProtectedRoute>
    );
  }

  const taskDetailMatch = hash.match(/^#\/dashboard\/planner\/([^/]+)/);
  if (taskDetailMatch) {
    return (
      <ProtectedRoute>
        <TaskDetailPage taskId={taskDetailMatch[1]} />
      </ProtectedRoute>
    );
  }

  if (hash.startsWith("#/dashboard/planner")) {
    return (
      <ProtectedRoute>
        <PlannerPage />
      </ProtectedRoute>
    );
  }

  // Any other hash starting with #/dashboard renders the dashboard overview
  // (this also covers #/dashboard/settings — there's no Settings page yet, so it falls
  // through to the overview once authenticated, same as it did before this sprint).
  if (hash.startsWith("#/dashboard")) {
    return (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    );
  }

  return <LandingPage />;
}

export default function App() {
  // AuthProvider sits outermost — routing and every guard below it reads auth state,
  // and it has no dependency on the other providers.
  return (
    <AuthProvider>
      <ToastProvider>
        <NotesProvider>
          <PlannerProvider>
            <Router />
          </PlannerProvider>
        </NotesProvider>
      </ToastProvider>
    </AuthProvider>
  );
}