import { useState, useEffect } from "react";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";

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

  // Any hash starting with #/dashboard renders the dashboard
  if (hash.startsWith("#/dashboard")) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}