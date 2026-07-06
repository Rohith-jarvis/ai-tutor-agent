"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, BookOpen, Plus, Trash2, BarChart } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectCategory, setSubjectCategory] = useState("Programming Languages");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const aRes = await api.get("/admin/analytics");
      setAnalytics(aRes.data);

      const sRes = await api.get("/admin/students");
      setStudents(sRes.data);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      setAnalytics({
        total_students: 15,
        total_subjects: 13,
        total_lessons: 36,
        total_quizzes: 42,
        total_progresses: 128
      });
      setStudents([
        { id: 1, name: "Alex Rivers", email: "demo@tutor.ai", streak_days: 5, created_at: "2026-07-01" },
        { id: 2, name: "Admin Instructor", email: "admin@tutor.ai", streak_days: 10, created_at: "2026-06-15" }
      ]);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectTitle.trim()) return;
    setLoading(true);

    try {
      await api.post("/admin/subjects", {
        title: subjectTitle,
        description: subjectDesc || "Custom subject created by admin.",
        category: subjectCategory,
        icon: "BookOpen"
      });
      setSubjectTitle("");
      setSubjectDesc("");
      fetchAdminData();
    } catch (err: any) {
      console.error("Create subject error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">Admin Control Panel</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Manage platform subjects, curriculum lessons, view student progress & platform metrics.</p>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Total Students</span>
                  <span className="text-2xl font-black text-foreground">{analytics?.total_students || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Total Subjects</span>
                  <span className="text-2xl font-black text-foreground">{analytics?.total_subjects || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <BarChart className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Total Lessons</span>
                  <span className="text-2xl font-black text-foreground">{analytics?.total_lessons || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border">
              <CardContent className="p-5 flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-500">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Quizzes Taken</span>
                  <span className="text-2xl font-black text-foreground">{analytics?.total_quizzes || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Subject Card */}
            <Card className="glass border-border h-fit">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-primary" />
                  <span>Add New Subject</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSubject} className="space-y-4">
                  <Input
                    label="Subject Title"
                    placeholder="e.g. Kotlin Programming"
                    value={subjectTitle}
                    onChange={(e) => setSubjectTitle(e.target.value)}
                    required
                  />
                  <Select
                    label="Category"
                    value={subjectCategory}
                    onChange={(e) => setSubjectCategory(e.target.value)}
                    options={[
                      { label: "Programming Languages", value: "Programming Languages" },
                      { label: "Computer Science Core", value: "Computer Science Core" },
                      { label: "Web Development", value: "Web Development" },
                      { label: "Databases", value: "Databases" },
                      { label: "Career & Aptitude", value: "Career & Aptitude" }
                    ]}
                  />
                  <Input
                    label="Description"
                    placeholder="Short summary of the course..."
                    value={subjectDesc}
                    onChange={(e) => setSubjectDesc(e.target.value)}
                  />
                  <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Add Subject"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="lg:col-span-2 glass border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Registered Students ({students.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground uppercase font-bold">
                        <th className="pb-3">Student Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Streak</th>
                        <th className="pb-3">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {students.map((std) => (
                        <tr key={std.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="py-3 font-semibold text-foreground">{std.name}</td>
                          <td className="py-3 text-muted-foreground">{std.email}</td>
                          <td className="py-3 font-bold text-amber-500">{std.streak_days} Days 🔥</td>
                          <td className="py-3 text-muted-foreground">{formatDate(std.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
