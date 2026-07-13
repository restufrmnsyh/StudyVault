import { Search, Bell, Menu, GraduationCap, ArrowLeftToLine } from "lucide-react";
import { currentUser, notifications } from "@/data/dashboard";

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleBackToSite() {
    window.location.hash = "";
  }

  return (
    <header className="flex h-13 items-center justify-between border-b border-white/[0.04] bg-[#0a0a0d]/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Left: mobile menu + logo / desktop search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Mobile logo */}
        <a href="#/dashboard" className="flex items-center gap-2 md:hidden">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-500">
            <GraduationCap className="h-3 w-3 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-text-primary">StudyVault</span>
        </a>

        {/* Desktop search */}
        <div className="group hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[13px] text-text-muted ring-violet-500/15 transition-all duration-200 focus-within:border-violet-500/30 focus-within:bg-white/[0.04] focus-within:ring-4 md:flex">
          <Search className="h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200 group-focus-within:text-violet-400" />
          <input
            type="text"
            placeholder="Search notes, courses..."
            className="w-44 bg-transparent text-text-secondary outline-none placeholder:text-text-muted lg:w-64 xl:w-72"
          />
          <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-text-muted">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Back to site (mobile only \u2014 desktop uses the sidebar button) */}
        <button
          onClick={handleBackToSite}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary md:hidden"
          aria-label="Back to site"
          title="Back to site"
        >
          <ArrowLeftToLine className="h-4 w-4" />
        </button>

        {/* Mobile search */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary"
          aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <button
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-[11px] font-bold text-white transition-shadow hover:shadow-md hover:shadow-violet-500/20"
          aria-label={`${currentUser.name} account menu`}
        >
          {currentUser.initials}
        </button>
      </div>
    </header>
  );
}
