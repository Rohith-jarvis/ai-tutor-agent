"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, getUser, logout } from "@/lib/auth";
import { ThemeToggle } from "./ui/theme-toggle";
import { Flame, Bell, LogOut, Sparkles, BookOpen, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 glass px-4 md:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground tracking-tight">AI Personal Tutor</span>
            <span className="hidden sm:block text-[10px] text-muted-foreground font-medium">Production AI Learning Platform</span>
          </div>
        </Link>

        <div className="flex items-center space-x-3 md:space-x-4">
          {user && (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs md:text-sm shadow-sm">
              <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
              <span>{user.streak_days} Day Streak</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border border-border bg-secondary text-foreground hover:bg-card transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border bg-card p-4 shadow-xl glass z-50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Daily Reminders</h4>
                <div className="space-y-2.5 text-xs text-foreground">
                  <div className="p-2.5 rounded-xl bg-secondary/80 border border-border">
                    <p className="font-semibold text-primary">🎯 Study Goal Reminder</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">Complete 15 minutes of Java lesson today.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary/80 border border-border">
                    <p className="font-semibold text-emerald-500">💡 Daily Quiz Ready</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">Take a 5-question Python quiz now.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-secondary hover:bg-border transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline text-xs font-medium text-foreground">{user.name}</span>
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} title="Logout">
                <LogOut className="w-4 h-4 text-rose-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
