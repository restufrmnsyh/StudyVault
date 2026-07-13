import { useState, useEffect } from "react";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { CoursesPage } from "@/pages/CoursesPage";
import { CourseDetailPage } from "@/pages/CourseDetailPage";

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

export default function App() {
  const hash = useHashRoute();

  const courseDetailMatch = hash.match(/^#\/dashboard\/courses\/([^/]+)/);
  if (courseDetailMatch) {
    return <CourseDetailPage courseId={courseDetailMatch[1]} />;
  }

  if (hash.startsWith("#/dashboard/courses")) {
    return <CoursesPage />;
  }

  // Any other hash starting with #/dashboard renders the dashboard overview
  if (hash.startsWith("#/dashboard")) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}