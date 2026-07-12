import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  role: string;
}

export interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

export interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
}
