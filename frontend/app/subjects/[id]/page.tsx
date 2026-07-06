"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, HelpCircle, Bot, ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = params.id;
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectDetail();
  }, [subjectId]);

  const fetchSubjectDetail = async () => {
    try {
      const res = await api.get(`/subjects/${subjectId}`);
      setSubject(res.data);
    } catch (err) {
      console.error("Subject detail fetch error:", err);
      // Fallback
      setSubject({
        id: subjectId,
        title: "Java Programming Masterclass",
        category: "Programming Languages",
        description: "Comprehensive guide covering syntax, Object-Oriented Principles, JVM internals, and multithreading.",
        lessons: [
          { id: 1, title: "Introduction to Java & JVM Architecture", chapter: "Chapter 1: Fundamentals", order: 1 },
          { id: 2, title: "Object-Oriented Programming (OOP) Principles", chapter: "Chapter 2: OOP Concepts", order: 2 },
          { id: 3, title: "Exception Handling & Collections Framework", chapter: "Chapter 3: Advanced Concepts", order: 3 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (!subject) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <Link href="/subjects" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to All Subjects
          </Link>

          {/* Header Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-card border border-primary/30 glass space-y-4">
            <div className="flex items-center space-x-3">
              <Badge variant="primary">{subject.category}</Badge>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground">{subject.title}</h1>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">{subject.description}</p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/quiz?subject=${encodeURIComponent(subject.title)}`}>
                <Button variant="accent" size="sm">
                  <HelpCircle className="w-4 h-4 mr-2" /> Practice Quiz
                </Button>
              </Link>
              <Link href={`/ai-tutor?subject=${encodeURIComponent(subject.title)}`}>
                <Button variant="outline" size="sm">
                  <Bot className="w-4 h-4 mr-2" /> Ask AI Tutor
                </Button>
              </Link>
            </div>
          </div>

          {/* Lessons Tree */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-foreground">Course Lessons & Modules</h2>

            <div className="space-y-3">
              {subject.lessons?.map((lesson: any, idx: number) => (
                <Card key={lesson.id} className="glass hover:border-primary/50 transition-all border-border">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{lesson.chapter}</span>
                        <h3 className="text-base font-semibold text-foreground mt-0.5">{lesson.title}</h3>
                      </div>
                    </div>

                    <Link href={`/lessons/${lesson.id}`}>
                      <Button variant="primary" size="sm">
                        <PlayCircle className="w-4 h-4 mr-1.5" /> Start Lesson
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
