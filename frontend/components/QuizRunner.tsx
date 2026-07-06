"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle2, XCircle, Award, RotateCcw, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "@/lib/api";

interface Question {
  id?: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: string;
  question_type: string;
}

interface QuizRunnerProps {
  subject: string;
  questions: Question[];
  onFinish?: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ subject, questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 minute per question
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submitted || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, questions]);

  const handleSelectOption = (option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleSubmitQuiz = async () => {
    if (submitted) return;
    setLoading(true);

    const answersList = questions.map((q, idx) => ({
      question_id: q.id,
      user_answer: selectedAnswers[idx] || "",
      question: q.question,
      correct_answer: q.answer
    }));

    try {
      const res = await api.post("/quizzes/submit", {
        subject: subject,
        answers: answersList,
        total_time_seconds: questions.length * 60 - timeLeft
      });
      setResult(res.data);
      setSubmitted(true);

      if (res.data.score_percentage >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      // Fallback calculation client-side
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.answer) correct++;
      });
      const pct = roundPct((correct / questions.length) * 100);
      setResult({
        total_questions: questions.length,
        correct_count: correct,
        score_percentage: pct,
        feedback: pct >= 80 ? "Great job!" : "Keep practicing!",
        details: questions.map((q, idx) => ({
          question: q.question,
          user_answer: selectedAnswers[idx] || "None",
          correct_answer: q.answer,
          is_correct: selectedAnswers[idx] === q.answer,
          explanation: q.explanation
        }))
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const roundPct = (num: number) => Math.round(num * 100) / 100;

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (submitted && result) {
    return (
      <Card className="max-w-2xl mx-auto border-primary/30 shadow-2xl glass animate-fade-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-lg mb-3">
            <Award className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">Quiz Results: {subject}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{result.feedback}</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-secondary border border-border">
              <span className="block text-xs font-semibold text-muted-foreground uppercase">Score</span>
              <span className="text-2xl font-black text-primary">{result.score_percentage}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary border border-border">
              <span className="block text-xs font-semibold text-muted-foreground uppercase">Correct</span>
              <span className="text-2xl font-black text-emerald-500">{result.correct_count} / {result.total_questions}</span>
            </div>
            <div className="p-4 rounded-2xl bg-secondary border border-border">
              <span className="block text-xs font-semibold text-muted-foreground uppercase">Time Spent</span>
              <span className="text-2xl font-black text-foreground">{Math.floor((questions.length * 60 - timeLeft) / 60)}m {(questions.length * 60 - timeLeft) % 60}s</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Answer Explanations</h4>
            {result.details.map((d: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  d.is_correct ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
                }`}
              >
                <div className="flex items-start justify-between space-x-2">
                  <p className="text-sm font-semibold text-foreground">
                    Q{idx + 1}. {d.question}
                  </p>
                  {d.is_correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  )}
                </div>
                <div className="mt-2 text-xs space-y-1">
                  <p>
                    <span className="font-semibold text-muted-foreground">Your Answer:</span>{" "}
                    <span className={d.is_correct ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                      {d.user_answer || "Not Answered"}
                    </span>
                  </p>
                  {!d.is_correct && (
                    <p>
                      <span className="font-semibold text-muted-foreground">Correct Answer:</span>{" "}
                      <span className="text-emerald-500 font-bold">{d.correct_answer}</span>
                    </p>
                  )}
                  <p className="text-muted-foreground mt-2 italic">💡 {d.explanation}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            {onFinish && (
              <Button variant="outline" onClick={onFinish}>
                Return to Hub
              </Button>
            )}
            <Button
              variant="accent"
              onClick={() => {
                setSubmitted(false);
                setResult(null);
                setCurrentIndex(0);
                setSelectedAnswers({});
                setTimeLeft(questions.length * 60);
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQ) return null;

  return (
    <Card className="max-w-2xl mx-auto glass shadow-xl border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="primary" className="text-xs">
            {subject} • Question {currentIndex + 1} of {questions.length}
          </Badge>
          <div className="flex items-center space-x-1 text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="mt-3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold text-foreground leading-relaxed">{currentQ.question}</h3>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentIndex] === opt;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border-border bg-background hover:bg-secondary text-foreground"
                }`}
              >
                <span>{opt}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                    isSelected ? "border-primary bg-primary text-white" : "border-border"
                  }`}
                >
                  {isSelected && "✓"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
          >
            Previous
          </Button>

          {currentIndex === questions.length - 1 ? (
            <Button variant="accent" onClick={handleSubmitQuiz} disabled={loading}>
              {loading ? "Evaluating..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setCurrentIndex((prev) => prev + 1)}>
              Next Question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
