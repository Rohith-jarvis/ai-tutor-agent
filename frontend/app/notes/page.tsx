"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Sparkles, Download, Layers, RotateCcw } from "lucide-react";
import { api } from "@/lib/api";
import { jsPDF } from "jspdf";

export default function NotesPage() {
  const [topic, setTopic] = useState("Object-Oriented Programming");
  const [subject, setSubject] = useState("Java");
  const [loading, setLoading] = useState(false);
  const [notesResult, setNotesResult] = useState<any>(null);
  const [savedNotes, setSavedNotes] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchSavedNotes();
  }, []);

  const fetchSavedNotes = async () => {
    try {
      const res = await api.get("/ai/notes-list");
      setSavedNotes(res.data);
    } catch (err) {
      console.error("Fetch notes error:", err);
    }
  };

  const handleGenerateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await api.post("/ai/notes", {
        topic: topic,
        subject: subject,
        detail_level: "Standard"
      });
      setNotesResult(res.data);
      fetchSavedNotes();
    } catch (err) {
      console.error("Notes generate error:", err);
      setNotesResult({
        topic: topic,
        subject: subject,
        notes_markdown: `# Study Notes: ${topic} (${subject})\n\n## Executive Summary\n${topic} is a core principle in ${subject}.\n\n## Key Concepts\n- Concept 1: Structural organization.\n- Concept 2: Reusability and encapsulation.`,
        flashcards: [
          { front: `What is ${topic}?`, back: `A key concept in ${subject} for modular structure.` },
          { front: `Why use ${topic}?`, back: "Improves maintainability and reduces code duplication." }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!notesResult) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`AI Notes: ${notesResult.topic} (${notesResult.subject})`, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(notesResult.notes_markdown, 180);
    doc.text(splitText, 14, 30);

    doc.save(`${notesResult.subject}_${notesResult.topic}_Notes.pdf`);
  };

  const toggleFlashcard = (idx: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">AI Study Notes & Flashcards Generator</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Generate structured revision notes and interactive flashcards. Download notes as PDF.</p>
          </div>

          {/* Generator Form */}
          <Card className="glass border-border">
            <CardContent className="p-6">
              <form onSubmit={handleGenerateNotes} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input
                  label="Topic / Keyword"
                  placeholder="e.g. Memory Pointers"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
                <Select
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  options={[
                    { label: "Java", value: "Java" },
                    { label: "Python", value: "Python" },
                    { label: "C Programming", value: "C Programming" },
                    { label: "Data Structures", value: "Data Structures" },
                    { label: "SQL", value: "SQL" },
                    { label: "Operating System", value: "Operating System" }
                  ]}
                />
                <Button type="submit" variant="accent" disabled={loading}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {loading ? "Generating Notes..." : "Generate AI Notes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Generated Notes Display */}
          {notesResult && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <Badge variant="primary" className="text-sm py-1 px-3">
                  {notesResult.subject} • {notesResult.topic}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2 text-primary" /> Download PDF Notes
                </Button>
              </div>

              <Card className="glass border-border p-6">
                <div className="prose dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {notesResult.notes_markdown}
                </div>
              </Card>

              {/* Flashcards */}
              {notesResult.flashcards?.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-bold flex items-center space-x-2 text-foreground">
                    <Layers className="w-5 h-5 text-pink-500" />
                    <span>Interactive Flashcards (Click to Flip)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {notesResult.flashcards.map((fc: any, idx: number) => {
                      const isFlipped = flippedCards[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleFlashcard(idx)}
                          className={`p-6 rounded-2xl border cursor-pointer transition-all min-h-[140px] flex flex-col justify-between ${
                            isFlipped
                              ? "bg-purple-600/10 border-purple-500/30 text-purple-400"
                              : "bg-card border-border hover:border-primary text-foreground"
                          }`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {isFlipped ? "Answer (Back)" : "Question (Front)"}
                          </span>
                          <p className="text-sm font-semibold text-center my-auto">
                            {isFlipped ? fc.back : fc.front}
                          </p>
                          <span className="text-[10px] text-muted-foreground text-right">Click to flip 🔄</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
