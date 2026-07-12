import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.replace("#", "") || "/dashboard",
  );

  useEffect(() => {
    function onHashChange() {
      setCurrentPath(window.location.hash.replace("#", "") || "/dashboard");
      setMobileMenuOpen(false);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Desktop / tablet sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          currentPath={currentPath}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar
              currentPath={currentPath}
              collapsed={false}
              onToggle={closeMobileMenu}
              onClose={closeMobileMenu}
            />
          </div>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuToggle={toggleMobileMenu} />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="mx-auto w-full max-w-[1400px] p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav currentPath={currentPath} />
    </div>
  );
}
