"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Mail, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { setAuthSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      setAuthSession(res.data.access_token, res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(demoEmail === "admin@tutor.ai" ? "admin123" : "password123");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-border shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-xs text-muted-foreground">Sign in to continue your personalized AI learning journey</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </Button>
            </form>

            <div className="pt-2 text-center space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Or Quick Login As</p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleQuickDemo("demo@tutor.ai")}>
                  Demo Student
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickDemo("admin@tutor.ai")}>
                  Demo Admin
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Register Free
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
