"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 text-white shadow-2xl animate-float">
          <Sparkles className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-black gradient-text tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Oops! The learning page or resource you are looking for does not exist or has been moved.
        </p>

        <div className="flex justify-center space-x-3 pt-4">
          <Link href="/dashboard">
            <Button variant="accent">
              <Home className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
