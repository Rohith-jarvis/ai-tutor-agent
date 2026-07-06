"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Coffee,
  Code,
  Cpu,
  Layers,
  FileCode,
  Palette,
  Zap,
  Database,
  HardDrive,
  Monitor,
  Network,
  Award,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

const iconMap: Record<string, any> = {
  Coffee,
  Code,
  Cpu,
  Layers,
  FileCode,
  Palette,
  Zap,
  Database,
  HardDrive,
  Monitor,
  Network,
  Award,
  UserCheck,
  BookOpen
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (err) {
      console.error("Subjects fetch error:", err);
      // Fallback 13 subjects list
      setSubjects([
        { id: 1, title: "Java", category: "Programming Languages", icon: "Coffee", description: "Object-oriented language for enterprise & Android development." },
        { id: 2, title: "Python", category: "Programming Languages", icon: "Code", description: "High-level language for AI/ML, web backends, and scripting." },
        { id: 3, title: "C Programming", category: "Programming Languages", icon: "Cpu", description: "Procedural language focusing on low-level memory allocation & pointers." },
        { id: 4, title: "Data Structures", category: "Computer Science Core", icon: "Layers", description: "Linear & non-linear structures including Lists, Stacks, Queues, Trees, Graphs." },
        { id: 5, title: "HTML", category: "Web Development", icon: "FileCode", description: "Semantic markup language for structuring web pages." },
        { id: 6, title: "CSS", category: "Web Development", icon: "Palette", description: "Styling, Flexbox, CSS Grid layouts, and responsive UI design." },
        { id: 7, title: "JavaScript", category: "Web Development", icon: "Zap", description: "Modern ES6+, async/await, DOM manipulation, and frontend logic." },
        { id: 8, title: "SQL", category: "Databases", icon: "Database", description: "Structured query language for querying relational databases." },
        { id: 9, title: "DBMS", category: "Databases", icon: "HardDrive", description: "Database management concepts, ER diagrams, Normalization, ACID properties." },
        { id: 10, title: "Operating System", category: "Computer Science Core", icon: "Monitor", description: "OS principles, process management, scheduling, virtual memory, deadlocks." },
        { id: 11, title: "Computer Networks", category: "Computer Science Core", icon: "Network", description: "OSI & TCP/IP models, routing protocols, subnetting, network security." },
        { id: 12, title: "Aptitude", category: "Career & Aptitude", icon: "Award", description: "Quantitative reasoning, speed math shortcuts, time & work, probability." },
        { id: 13, title: "Interview Preparation", category: "Career & Aptitude", icon: "UserCheck", description: "System design patterns, behavioral STAR method, coding interview strategies." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Programming Languages", "Computer Science Core", "Web Development", "Databases", "Career & Aptitude"];

  const filteredSubjects = selectedCategory === "All"
    ? subjects
    : subjects.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground">Curriculum Subjects</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Select a subject to view chapters, detailed lessons, code examples, and practice exercises.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredSubjects.map((subject) => {
              const Icon = iconMap[subject.icon] || BookOpen;
              return (
                <Card key={subject.id} className="glass hover:border-primary/50 transition-all flex flex-col justify-between group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{subject.category}</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold mt-3 text-foreground">{subject.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{subject.description}</p>
                    
                    <Link href={`/subjects/${subject.id}`}>
                      <Button variant="outline" className="w-full justify-between text-xs group-hover:bg-primary group-hover:text-white">
                        <span>Explore Lessons</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
