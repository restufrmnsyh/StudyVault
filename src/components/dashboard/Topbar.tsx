import { Search, Bell, Menu, GraduationCap, ArrowLeftToLine } from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { useProfile } from "@/hooks/queries/useProfile";

interface TopbarProps {
  onMenuToggle: () => void;
  onSearchOpen: () => void;
}

export function Topbar({ onMenuToggle, onSearchOpen }: TopbarProps) {
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();

  // Derive display name and initials — mirrors Sidebar.tsx
  let displayName = "Student";
  if (profile?.fullName) {
    displayName = profile.fullName;
  } else if (user?.email) {
    displayName = user.email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  const initials = (() => {
    const parts = displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  async function handleBackToSite() {
    await signOut();
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
        <button
          onClick={onSearchOpen}
          className="group hidden items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[13px] text-text-muted ring-violet-500/15 transition-all duration-200 hover:border-violet-500/30 hover:bg-white/[0.04] focus-visible:border-violet-500/30 focus-visible:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-4 md:flex"
          aria-label="Open search"
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200 group-hover:text-violet-400" />
          <span className="w-44 text-left text-text-secondary lg:w-64 xl:w-72">
            Search notes, courses...
          </span>
          <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-text-muted">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Back to site (mobile only \u2014 desktop uses the sidebar button) */}
        <button
          onClick={() => void handleBackToSite()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary md:hidden"
          aria-label="Sign out"
          title="Sign out"
        >
          <ArrowLeftToLine className="h-4 w-4" />
        </button>

        {/* Mobile search */}
        <button
          onClick={onSearchOpen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary md:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <button
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-[11px] font-bold text-white transition-shadow hover:shadow-md hover:shadow-violet-500/20"
          aria-label={`${displayName} account menu`}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
