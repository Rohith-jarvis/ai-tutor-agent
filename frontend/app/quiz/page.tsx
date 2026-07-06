"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { QuizRunner } from "@/components/QuizRunner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { HelpCircle, Sparkles, Sliders } from "lucide-react";
import { api } from "@/lib/api";

export default function QuizPage() {
  const [subject, setSubject] = useState("Java");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionType, setQuestionType] = useState("MCQ");
  const [numQuestions, setNumQuestions] = useState(5);

  const [questions, setQuestions] = useState<any[]>([]);
  const [quizActive, setQuizActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.post("/quizzes/generate", {
        subject: subject,
        topic: "General",
        num_questions: numQuestions,
        difficulty: difficulty,
        question_type: questionType
      });
      setQuestions(res.data);
      setQuizActive(true);
    } catch (err) {
      console.error("Quiz generate error:", err);
      // Fallback mock questions
      setQuestions([
        {
          id: 1,
          question: `What is the primary feature of ${subject}?`,
          options: ["Object-Oriented Design", "Assembly conversion", "No variables allowed", "Single line execution"],
          answer: "Object-Oriented Design",
          explanation: `${subject} strongly emphasizes object-oriented principles.`,
          difficulty: difficulty,
          question_type: questionType
        },
        {
          id: 2,
          question: `How are exceptions handled in ${subject}?`,
          options: ["try-catch blocks", "if-else checks only", "Ignore runtime errors", "OS reboot"],
          answer: "try-catch blocks",
          explanation: "try-catch blocks catch runtime exceptions and prevent crash.",
          difficulty: difficulty,
          question_type: questionType
        }
      ]);
      setQuizActive(true);
    } finally {
      setLoading(false);
    }
  };

  const subjectOptions = [
    { label: "Java", value: "Java" },
    { label: "Python", value: "Python" },
    { label: "C Programming", value: "C Programming" },
    { label: "Data Structures", value: "Data Structures" },
    { label: "HTML", value: "HTML" },
    { label: "CSS", value: "CSS" },
    { label: "JavaScript", value: "JavaScript" },
    { label: "SQL", value: "SQL" },
    { label: "DBMS", value: "DBMS" },
    { label: "Operating System", value: "Operating System" },
    { label: "Computer Networks", value: "Computer Networks" },
    { label: "Aptitude", value: "Aptitude" },
    { label: "Interview Preparation", value: "Interview Preparation" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {!quizActive ? (
            <Card className="max-w-2xl mx-auto glass border-border shadow-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white shadow-lg mb-2">
                  <HelpCircle className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold">AI Quiz Generator & Practice Hub</CardTitle>
                <p className="text-xs text-muted-foreground">Select your target subject, difficulty, and question type to launch an AI quiz.</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <Select
                  label="Select Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  options={subjectOptions}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Difficulty Level"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    options={[
                      { label: "Easy", value: "Easy" },
                      { label: "Medium", value: "Medium" },
                      { label: "Hard", value: "Hard" }
                    ]}
                  />

                  <Select
                    label="Question Type"
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    options={[
                      { label: "Multiple Choice (MCQ)", value: "MCQ" },
                      { label: "True or False", value: "TrueFalse" },
                      { label: "Fill in the Blanks", value: "FillBlank" },
                      { label: "Coding Logic", value: "Coding" }
                    ]}
                  />
                </div>

                <Button variant="accent" className="w-full" size="lg" onClick={handleGenerateQuiz} disabled={loading}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {loading ? "AI is generating quiz questions..." : "Generate AI Quiz"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuizRunner
              subject={subject}
              questions={questions}
              onFinish={() => setQuizActive(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
