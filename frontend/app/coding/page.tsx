"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CodeRunner } from "@/components/CodeRunner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function CodingPracticePage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [languageFilter, setLanguageFilter] = useState("All");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get("/coding/problems");
      setProblems(res.data);
      if (res.data.length > 0) setSelectedProblem(res.data[0]);
    } catch (err) {
      console.error("Coding problems fetch error:", err);
      // Fallback
      const fallback = [
        {
          id: 1,
          title: "Two Sum Problem",
          language: "Python",
          difficulty: "Easy",
          problem_statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
          sample_input: "nums = [2, 7, 11, 15], target = 9",
          sample_output: "[0, 1]",
          hints: "Use a hash map to store seen numbers and their indices.",
          solution_code: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
          explanation: "Iterates through list keeping track of seen numbers."
        },
        {
          id: 2,
          title: "Reverse String in Java",
          language: "Java",
          difficulty: "Easy",
          problem_statement: "Write a Java method to reverse a given string.",
          sample_input: "\"AI Tutor\"",
          sample_output: "\"rotuT IA\"",
          hints: "Use StringBuilder reverse method.",
          solution_code: "public class Solution {\n    public static String reverseString(String str) {\n        return new StringBuilder(str).reverse().toString();\n    }\n}",
          explanation: "Reverses character sequence in linear time."
        },
        {
          id: 3,
          title: "Maximum Element in C",
          language: "C",
          difficulty: "Medium",
          problem_statement: "Write a C function to find maximum element in array.",
          sample_input: "arr = {12, 45, 67, 23, 89}, N = 5",
          sample_output: "89",
          hints: "Compare each element against max.",
          solution_code: "#include <stdio.h>\nint findMax(int arr[], int n) {\n    int max = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > max) max = arr[i];\n    }\n    return max;\n}",
          explanation: "Linear scan through array."
        }
      ];
      setProblems(fallback);
      setSelectedProblem(fallback[0]);
    }
  };

  const filteredProblems = languageFilter === "All"
    ? problems
    : problems.filter((p) => p.language.toLowerCase() === languageFilter.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">Online Coding Practice Arena</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Select a problem, choose your programming language (Java, Python, C), and verify your solution.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              {["All", "Python", "Java", "C"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguageFilter(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    languageFilter === lang
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Selector Bar */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {filteredProblems.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProblem(p)}
                className={`px-4 py-3 rounded-2xl border text-xs text-left whitespace-nowrap transition-all flex items-center space-x-3 ${
                  selectedProblem?.id === p.id
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-md"
                    : "border-border bg-card text-foreground hover:bg-secondary"
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>{p.title}</span>
                <Badge variant={p.difficulty === "Easy" ? "success" : "warning"} className="text-[10px]">
                  {p.difficulty}
                </Badge>
              </button>
            ))}
          </div>

          {/* Code Runner IDE */}
          {selectedProblem && <CodeRunner problem={selectedProblem} />}
        </main>
      </div>
    </div>
  );
}
