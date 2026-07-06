"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Bot,
  HelpCircle,
  Code2,
  Calendar,
  BarChart3,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  Shield,
  BookOpen
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      title: "Interactive AI Tutor",
      description: "Ask questions, get line-by-line code breakdowns, and real-life analogies tailored to Beginner, Intermediate, or Advanced level.",
      icon: Bot,
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Smart Quiz Generator",
      description: "Generate MCQs, True/False, Fill in blanks, and Coding questions with instant evaluation, timer, and detailed explanations.",
      icon: HelpCircle,
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Online Coding Practice",
      description: "Solve hand-crafted coding challenges in Java, Python, and C with sample test cases, hints, and automated feedback.",
      icon: Code2,
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "AI Study Planner",
      description: "Set daily/weekly study goals while AI schedules your next lessons, revision topics, and practice timetable.",
      icon: Calendar,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Progress Tracker & Analytics",
      description: "Visualize weekly performance charts, track study streaks, identify weak topics, and celebrate learning milestones.",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "PDF & Notes AI Learning",
      description: "Upload study material PDFs or raw notes. AI extracts executive summaries, key concepts, and generates custom revision quizzes.",
      icon: FileSearch,
      color: "from-purple-500 to-indigo-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 space-y-20 py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8 max-w-4xl mx-auto">
          <Badge variant="primary" className="py-1 px-4 text-xs md:text-sm rounded-full shadow-sm animate-bounce">
            ✨ Powered by OpenAI & Next.js 15
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
            Master Technical Subjects with Your Personal <span className="gradient-text">AI Tutor Agent</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Accelerate your computer science and programming journey with instant 24/7 AI tutoring, dynamic quizzes, interactive coding practice, and intelligent study recommendations.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button variant="accent" size="lg" className="shadow-lg shadow-purple-500/25">
                Start Learning Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Explore Demo Account
              </Button>
            </Link>
          </div>
        </section>

        {/* Subjects Banner */}
        <section className="p-8 rounded-3xl border border-border bg-card/60 glass text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">13 Comprehensive Subjects Included</h2>
            <p className="text-sm text-muted-foreground">From core programming languages to interview preparation & quantitative aptitude.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Java", "Python", "C Programming", "Data Structures",
              "HTML", "CSS", "JavaScript", "SQL", "DBMS",
              "Operating System", "Computer Networks", "Aptitude", "Interview Preparation"
            ].map((subj, idx) => (
              <span key={idx} className="px-4 py-2 rounded-2xl bg-secondary border border-border text-xs font-semibold text-foreground hover:border-primary transition-colors">
                {subj}
              </span>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need To Excel</h2>
            <p className="text-sm text-muted-foreground">Built with production-ready AI capabilities to support your full learning lifecycle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} className="glass hover:scale-[1.02] transition-transform border-border">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-bold">{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Box */}
        <section className="p-10 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-pink-900/40 border border-purple-500/30 text-center space-y-6 glass">
          <h2 className="text-3xl font-extrabold text-foreground">Ready to Supercharge Your Study Habits?</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Join thousands of students building strong technical foundations with personalized AI guidance.
          </p>
          <Link href="/register">
            <Button variant="accent" size="lg">
              Get Started Now <Sparkles className="w-4 h-4 ml-2 animate-spin" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6 px-8 text-center text-xs text-muted-foreground">
        <p>© 2026 AI Personal Tutor Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
