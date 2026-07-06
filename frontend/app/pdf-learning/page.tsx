"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { PdfSummarizer } from "@/components/PdfSummarizer";

export default function PdfLearningPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <PdfSummarizer />
        </main>
      </div>
    </div>
  );
}
