"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Bot, HelpCircle, ArrowLeft, Code, FileText, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function LessonViewPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id;
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await api.get(`/lessons/${lessonId}`);
      setLesson(res.data);
    } catch (err) {
      console.error("Lesson fetch error:", err);
      // Fallback
      setLesson({
        id: lessonId,
        title: "Object-Oriented Programming (OOP) Principles",
        chapter: "Chapter 2: OOP Concepts",
        subject_id: 1,
        content: "Object-Oriented Programming (OOP) in Java relies on four fundamental pillars:\n\n1. **Encapsulation**: Wrapping data variables and code acting on data into a single unit.\n2. **Inheritance**: Mechanisms by which one class acquires properties of another.\n3. **Polymorphism**: Ability of a method or object to take on many forms.\n4. **Abstraction**: Hiding implementation complexity while showing only functionality.",
        examples: "class Animal {\n    void sound() { System.out.println(\"Animal makes a sound\"); }\n}\nclass Dog extends Animal {\n    void sound() { System.out.println(\"Dog barks\"); }\n}",
        exercises: "Create a BankAccount class implementing encapsulation with private balance variable and public deposit()/withdraw() methods."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await api.post("/progress/lesson-complete", null, {
        params: {
          lesson_id: lesson.id,
          subject_name: "Java",
          time_spent_seconds: 300
        }
      });
      setCompleted(true);
    } catch (err) {
      setCompleted(true);
    }
  };

  if (!lesson) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <Link href={`/subjects/${lesson.subject_id || 1}`} className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Subject
          </Link>

          {/* Lesson Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900/20 to-card border border-border glass">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{lesson.chapter}</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mt-1">{lesson.title}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant={completed ? "secondary" : "accent"}
                size="sm"
                onClick={handleMarkComplete}
                disabled={completed}
              >
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                {completed ? "Lesson Completed! 🎉" : "Mark as Complete"}
              </Button>
            </div>
          </div>

          {/* Lesson Body Content */}
          <Card className="glass border-border p-6 space-y-6">
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap text-foreground">
              {lesson.content}
            </div>

            {lesson.examples && (
              <div className="space-y-2 pt-4 border-t border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center space-x-2">
                  <Code className="w-4 h-4 text-primary" />
                  <span>Code Example</span>
                </h3>
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                  {lesson.examples}
                </pre>
              </div>
            )}

            {lesson.exercises && (
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-2">
                <span className="font-bold text-primary block uppercase">Practice Exercise</span>
                <p className="text-foreground">{lesson.exercises}</p>
              </div>
            )}
          </Card>

          {/* AI Assistance Quick Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Link href={`/ai-tutor?message=${encodeURIComponent(`Explain ${lesson.title} line by line`)}`}>
              <Card className="glass hover:border-primary/50 transition-all cursor-pointer p-4 text-center space-y-2">
                <Bot className="w-6 h-6 text-primary mx-auto" />
                <h4 className="text-xs font-bold">Line-by-Line Explainer</h4>
                <p className="text-[11px] text-muted-foreground">Ask AI Tutor to explain code line by line</p>
              </Card>
            </Link>

            <Link href={`/notes?topic=${encodeURIComponent(lesson.title)}`}>
              <Card className="glass hover:border-primary/50 transition-all cursor-pointer p-4 text-center space-y-2">
                <FileText className="w-6 h-6 text-purple-500 mx-auto" />
                <h4 className="text-xs font-bold">Generate AI Study Notes</h4>
                <p className="text-[11px] text-muted-foreground">Create revision flashcards & PDF notes</p>
              </Card>
            </Link>

            <Link href={`/quiz?subject=Java`}>
              <Card className="glass hover:border-primary/50 transition-all cursor-pointer p-4 text-center space-y-2">
                <HelpCircle className="w-6 h-6 text-pink-500 mx-auto" />
                <h4 className="text-xs font-bold">Take Lesson Quiz</h4>
                <p className="text-[11px] text-muted-foreground">Test your understanding with 5 questions</p>
              </Card>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
