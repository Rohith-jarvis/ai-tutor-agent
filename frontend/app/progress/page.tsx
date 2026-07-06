"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ProgressCharts } from "@/components/ProgressCharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Award, Flame, Clock } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Progress Tracker & Performance Analytics</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Detailed visual charts of your weekly performance, quiz scores, and subject mastery percentage.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Average Score</span>
                  <span className="text-2xl font-black text-foreground">88.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Learning Streak</span>
                  <span className="text-2xl font-black text-foreground">5 Days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Total Study Time</span>
                  <span className="text-2xl font-black text-foreground">14.2 Hours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <ProgressCharts />
        </main>
      </div>
    </div>
  );
}
