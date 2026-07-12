import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  BookMarked,
  Clock,
  Flame,
} from "lucide-react";
import type { SidebarItem, UserProfile, Notification, StatCard } from "@/types/dashboard";

export const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#/dashboard" },
  { icon: BookOpen, label: "Courses", href: "#/dashboard/courses" },
  { icon: FileText, label: "Notes", href: "#/dashboard/notes" },
  { icon: Calendar, label: "Planner", href: "#/dashboard/planner" },
  { icon: Users, label: "Groups", href: "#/dashboard/groups" },
  { icon: TrendingUp, label: "Progress", href: "#/dashboard/progress" },
  { icon: Settings, label: "Settings", href: "#/dashboard/settings" },
];

export const currentUser: UserProfile = {
  name: "Alex Chen",
  email: "alex.chen@university.edu",
  initials: "AC",
  role: "Computer Science · Year 3",
};

export const notifications: Notification[] = [
  { id: "1", title: "New note shared in CS201 group", time: "2m ago", read: false },
  { id: "2", title: "Planner reminder: MATH301 exam", time: "1h ago", read: false },
  { id: "3", title: "AI summary ready for ML lecture", time: "3h ago", read: true },
];

export const dashboardStats: StatCard[] = [
  { label: "Courses", value: "6", icon: BookMarked, color: "from-violet-500 to-indigo-500", trend: "+1" },
  { label: "Notes", value: "142", icon: FileText, color: "from-blue-500 to-cyan-500", trend: "+8" },
  { label: "Study Hours", value: "38h", icon: Clock, color: "from-emerald-500 to-teal-500", trend: "+4h" },
  { label: "Streak", value: "12 days", icon: Flame, color: "from-amber-500 to-orange-500" },
];
