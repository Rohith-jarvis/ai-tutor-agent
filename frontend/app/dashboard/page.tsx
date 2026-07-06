"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target
} from "lucide-react";
import { api } from "@/lib/api";
import { getUser, User } from "@/lib/auth";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/progress/dashboard");
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      // Fallback state
      setDashboardData({
        streak_days: 5,
        daily_goal_minutes: 30,
        lessons_completed: 12,
        avg_quiz_score: 84.5,
        completed_subjects: ["Python", "HTML"],
        weak_topics: ["Pointer Arithmetic in C", "Dynamic Programming Logic"],
        strong_topics: ["Python Syntax & Basics", "HTML5 & Semantic Markup"],
        study_time_hours: 6.5,
        ai_recommendations: [
          "Complete Chapter 2 of Java OOP Principles to improve foundational score.",
          "Solve 1 coding challenge in Python using HashMaps.",
          "Revise weak topic 'Pointer Arithmetic in C' via AI Tutor Studio."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-indigo-500/30 glass">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Welcome back, {user?.name || "Student"}! 👋
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                You are on a <span className="text-amber-500 font-bold">{dashboardData?.streak_days || 1} day learning streak</span>. Keep it up!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/ai-tutor">
                <Button variant="accent" size="sm">
                  <Sparkles className="w-4 h-4 mr-2" /> Open AI Tutor Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Current Streak</span>
                  <span className="text-2xl font-black text-foreground">{dashboardData?.streak_days || 1} Days</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Lessons Done</span>
                  <span className="text-2xl font-black text-foreground">{dashboardData?.lessons_completed || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Avg Quiz Score</span>
                  <span className="text-2xl font-black text-foreground">{dashboardData?.avg_quiz_score || 0}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-500">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Time Studied</span>
                  <span className="text-2xl font-black text-foreground">{dashboardData?.study_time_hours || 0} hrs</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Goal & AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Goal Card */}
            <Card className="glass border-border space-y-4">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base font-bold">Today's Study Goal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Target: {dashboardData?.daily_goal_minutes || 30} mins</span>
                    <span className="text-primary font-bold">18 / 30 mins (60%)</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="p-3 rounded-xl bg-secondary text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">Next Action:</p>
                  <p>Study 12 more minutes in Java Object-Oriented Principles.</p>
                </div>
                <Link href="/subjects">
                  <Button variant="outline" className="w-full text-xs">
                    Continue Learning <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="lg:col-span-2 glass border-border space-y-4">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                  <CardTitle className="text-base font-bold">AI Recommendations for You</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboardData?.ai_recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-secondary/80 border border-border text-xs leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{rec}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Weak & Strong Topics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-bold flex items-center space-x-2 text-rose-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Weak Topics to Revise</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboardData?.weak_topics.map((wt: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs">
                    <span className="font-semibold text-foreground">{wt}</span>
                    <Link href={`/ai-tutor`}>
                      <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600">
                        Ask AI Tutor
                      </Button>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-bold flex items-center space-x-2 text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strong Topics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboardData?.strong_topics.map((st: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                    <span className="font-semibold text-foreground">{st}</span>
                    <Badge variant="success">Mastered</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
