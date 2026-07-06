"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Settings as SettingsIcon, Bell, Moon, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">App Preferences & Settings</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Customize UI themes, notification preferences, and AI tutor default parameters.</p>
            </div>
          </div>

          <Card className="glass border-border space-y-6 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-amber-400" />
                  <span>Theme Preference</span>
                </h3>
                <p className="text-xs text-muted-foreground">Switch between sleek dark mode and bright light mode.</p>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-indigo-500" />
                  <span>Daily Reminders & Push Notifications</span>
                </h3>
                <p className="text-xs text-muted-foreground">Receive daily study goal reminders and streak alerts.</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary rounded cursor-pointer" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Secure JWT Authentication</span>
                </h3>
                <p className="text-xs text-muted-foreground">7-Day token expiration enabled.</p>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl">Active</span>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
