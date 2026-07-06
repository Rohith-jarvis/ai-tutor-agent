"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser, User } from "@/lib/auth";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  HelpCircle,
  Code2,
  Calendar,
  BarChart3,
  FileText,
  FileSearch,
  Shield,
  User as UserIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Subjects", href: "/subjects", icon: BookOpen },
    { label: "AI Tutor Studio", href: "/ai-tutor", icon: Bot },
    { label: "Quiz Arena", href: "/quiz", icon: HelpCircle },
    { label: "Coding Practice", href: "/coding", icon: Code2 },
    { label: "Study Planner", href: "/planner", icon: Calendar },
    { label: "Progress Tracker", href: "/progress", icon: BarChart3 },
    { label: "AI Notes & Flashcards", href: "/notes", icon: FileText },
    { label: "PDF Summarizer", href: "/pdf-learning", icon: FileSearch },
  ];

  if (user?.is_admin) {
    navItems.push({ label: "Admin Panel", href: "/admin", icon: Shield });
  }

  navItems.push(
    { label: "Profile", href: "/profile", icon: UserIcon },
    { label: "Settings", href: "/settings", icon: SettingsIcon }
  );

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-card/60 glass transition-all duration-300 min-h-[calc(100vh-65px)] z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md hover:bg-secondary"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
