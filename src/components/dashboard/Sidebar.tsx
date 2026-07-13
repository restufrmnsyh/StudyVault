import { useCallback } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ChevronsLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarItems, currentUser } from "@/data/dashboard";

interface SidebarProps {
  currentPath: string;
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export function Sidebar({ currentPath, collapsed, onToggle, onClose }: SidebarProps) {
  const handleNavClick = useCallback(
    (href: string) => {
      window.location.hash = href.replace("#", "");
      onClose?.();
    },
    [onClose],
  );

  const handleBackToSite = useCallback(() => {
    window.location.hash = "";
    onClose?.();
  }, [onClose]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/[0.04] bg-[#0a0a0d] transition-all duration-300",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo + collapse toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-3">
        <a
          href="#/dashboard"
          className={cn("flex items-center gap-2 overflow-hidden", collapsed && "justify-center")}
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
            <GraduationCap className="h-3.5 w-3.5 text-white" />
          </div>
          {!collapsed && (
            <span className="truncate text-[14px] font-semibold text-text-primary">
              StudyVault
            </span>
          )}
        </a>
        <button
          onClick={onToggle}
          className={cn(
            "hidden items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary md:flex",
            collapsed ? "h-7 w-7" : "h-6 w-6",
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronsLeft
            className={cn("h-3.5 w-3.5 transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {sidebarItems.map((item) => {
          const isActive = currentPath === item.href.replace("#", "") ||
            (item.href === "#/dashboard" && currentPath === "/dashboard");
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-200",
                isActive
                  ? "font-medium text-violet-400"
                  : "text-text-muted hover:bg-white/[0.04] hover:text-text-secondary",
                collapsed && "justify-center px-0",
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-lg bg-violet-500/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-white/[0.04] p-2">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2",
            collapsed && "justify-center px-0",
          )}
        >
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-[11px] font-bold text-white">
            {currentUser.initials}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-text-primary">
                {currentUser.name}
              </p>
              <p className="truncate text-[11px] text-text-muted">
                {currentUser.role}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleBackToSite}
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary"
              aria-label="Back to site"
              title="Back to site"
            >
              <LogOut className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
