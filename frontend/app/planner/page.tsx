"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function StudyPlannerPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [goalText, setGoalText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [targetType, setTargetType] = useState("Daily");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error("Goals fetch error:", err);
      setGoals([
        { id: 1, goal: "Complete 2 lessons in Data Structures", deadline: "2026-07-10", target_type: "Daily", status: "In Progress" },
        { id: 2, goal: "Achieve 85%+ on SQL join practice quiz", deadline: "2026-07-15", target_type: "Weekly", status: "Pending" }
      ]);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim() || !deadline) return;
    setLoading(true);

    try {
      await api.post("/goals", {
        goal: goalText,
        deadline: deadline,
        target_type: targetType
      });
      setGoalText("");
      setDeadline("");
      fetchGoals();
    } catch (err) {
      console.error("Create goal error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Delete goal error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">AI Study Planner & Target Goals</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Define daily, weekly, or monthly goals. AI will organize your study timetable and revision targets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create Goal Form */}
            <Card className="glass border-border h-fit">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-primary" />
                  <span>Set New Study Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleCreateGoal} className="space-y-4">
                  <Input
                    label="Study Goal / Task"
                    placeholder="e.g. Master Linked Lists"
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    required
                  />
                  <Input
                    label="Deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                  <Select
                    label="Target Type"
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    options={[
                      { label: "Daily Goal", value: "Daily" },
                      { label: "Weekly Target", value: "Weekly" },
                      { label: "Monthly Milestone", value: "Monthly" }
                    ]}
                  />
                  <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                    {loading ? "Adding Goal..." : "Add Goal"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Goals List & AI Schedule */}
            <div className="md:col-span-2 space-y-6">
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Your Learning Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-secondary border border-border text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="primary" className="text-[10px]">{goal.target_type}</Badge>
                          <span className="font-bold text-foreground text-sm">{goal.goal}</span>
                        </div>
                        <p className="text-muted-foreground flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>Deadline: {formatDate(goal.deadline)}</span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge variant={goal.status === "Completed" ? "success" : "warning"}>
                          {goal.status}
                        </Badge>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Recommended Timetable */}
              <Card className="glass border-primary/30">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center space-x-2 text-purple-400">
                    <Sparkles className="w-4 h-4 animate-spin text-purple-500" />
                    <span>AI Recommended Practice Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-foreground leading-relaxed">
                    <p className="font-bold mb-1">📅 Tomorrow's Suggested Timetable:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>09:00 AM - 09:30 AM: Java OOP Principles (Chapter 2 Lesson)</li>
                      <li>02:00 PM - 02:20 PM: 5-Question MCQ Quiz on Data Structures</li>
                      <li>07:00 PM - 07:30 PM: Coding Practice - Solve "Two Sum" in Python</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
