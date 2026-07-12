import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  currentPath: string;
}

const mobileItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
  { icon: FileText, label: "Notes", href: "/dashboard/notes" },
  { icon: Calendar, label: "Planner", href: "/dashboard/planner" },
  { icon: MoreHorizontal, label: "More", href: "/dashboard/settings" },
];

export function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.06] bg-[#0a0a0d]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {mobileItems.map((item) => {
          const isActive = currentPath === item.href ||
            (item.href === "/dashboard" && currentPath === "/dashboard");
          return (
            <a
              key={item.label}
              href={`#${item.href}`}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors duration-200",
                isActive
                  ? "font-medium text-violet-400"
                  : "text-text-muted",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-violet-400")} />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
