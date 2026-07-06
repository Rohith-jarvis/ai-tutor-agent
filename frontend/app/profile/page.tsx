"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Mail, Flame, Target, Calendar, CheckCircle2 } from "lucide-react";
import { getUser, User, setAuthSession } from "@/lib/auth";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [goalMins, setGoalMins] = useState(30);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const current = getUser();
    if (current) {
      setUser(current);
      setName(current.name);
      setGoalMins(current.daily_study_goal_minutes || 30);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.put("/auth/profile", {
        name: name,
        daily_study_goal_minutes: Number(goalMins)
      });
      setUser(res.data);
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("tutor_token") || "";
        setAuthSession(token, res.data);
      }
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Student Profile</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Manage your account information, daily study targets, and preference settings.</p>
          </div>

          <Card className="glass border-border shadow-xl">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4 border-b border-border">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                {user?.name?.charAt(0) || "S"}
              </div>
              <div>
                <CardTitle className="text-xl font-bold flex items-center space-x-2">
                  <span>{user?.name}</span>
                  {user?.is_admin && <Badge variant="primary">Admin</Badge>}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center space-x-1 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {message && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center space-x-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{message}</span>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Daily Study Goal (Minutes)"
                  type="number"
                  value={goalMins}
                  onChange={(e) => setGoalMins(Number(e.target.value))}
                  required
                />
                <Button type="submit" variant="accent" disabled={loading}>
                  {loading ? "Saving Changes..." : "Save Profile"}
                </Button>
              </form>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="p-4 rounded-2xl bg-secondary border border-border">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Streak</span>
                  <span className="text-xl font-bold text-amber-500">{user?.streak_days || 1} Days 🔥</span>
                </div>
                <div className="p-4 rounded-2xl bg-secondary border border-border">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Joined Date</span>
                  <span className="text-sm font-semibold text-foreground">{formatDate(user?.created_at || "")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
