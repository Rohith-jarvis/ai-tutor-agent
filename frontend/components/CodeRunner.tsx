"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Code2, Play, Lightbulb, CheckCircle2, AlertTriangle, FileCode } from "lucide-react";
import { api } from "@/lib/api";

interface CodingProblem {
  id: number;
  title: string;
  language: string;
  difficulty: string;
  problem_statement: string;
  sample_input: string;
  sample_output: string;
  hints: string;
  solution_code: string;
  explanation: string;
}

interface CodeRunnerProps {
  problem: CodingProblem;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({ problem }) => {
  const [code, setCode] = useState<string>(problem.solution_code || "// Write your solution here");
  const [activeTab, setActiveTab] = useState<"problem" | "hints" | "solution">("problem");
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const handleRunCode = async () => {
    setRunning(true);
    setOutput(null);

    try {
      const res = await api.post("/coding/run", {
        problem_id: problem.id,
        language: problem.language,
        code: code
      });
      setOutput(res.data);
    } catch (err: any) {
      setOutput({
        passed: false,
        output: "Execution Error",
        expected_output: problem.sample_output,
        error: "Network error or compiler unavailable.",
        feedback: "Check backend connection."
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Problem Statement & Tabs */}
      <Card className="glass flex flex-col h-full border-border">
        <CardHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <Badge variant={problem.difficulty === "Easy" ? "success" : "warning"}>
              {problem.difficulty}
            </Badge>
            <span className="text-xs font-mono font-bold text-primary">{problem.language}</span>
          </div>
          <CardTitle className="text-xl font-bold mt-2">{problem.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1 space-y-4 text-sm overflow-y-auto">
          <div className="flex space-x-2 border-b border-border pb-2">
            <button
              onClick={() => setActiveTab("problem")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "problem" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("hints")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "hints" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hints 💡
            </button>
            <button
              onClick={() => setActiveTab("solution")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === "solution" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Solution Walkthrough
            </button>
          </div>

          {activeTab === "problem" && (
            <div className="space-y-4">
              <p className="text-foreground leading-relaxed">{problem.problem_statement}</p>
              
              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase text-muted-foreground">Sample Input</span>
                <pre className="p-3 rounded-xl bg-secondary font-mono text-xs text-foreground overflow-x-auto border border-border">
                  {problem.sample_input}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase text-muted-foreground">Sample Output</span>
                <pre className="p-3 rounded-xl bg-secondary font-mono text-xs text-emerald-500 font-bold overflow-x-auto border border-border">
                  {problem.sample_output}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "hints" && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 space-y-2">
              <div className="flex items-center space-x-2 font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Problem Hint</span>
              </div>
              <p className="text-xs">{problem.hints}</p>
            </div>
          )}

          {activeTab === "solution" && (
            <div className="space-y-4 text-xs">
              <p className="text-muted-foreground">{problem.explanation}</p>
              <pre className="p-4 rounded-xl bg-secondary font-mono text-foreground border border-border overflow-x-auto">
                {problem.solution_code}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Column: Code Editor & Console Output */}
      <Card className="glass flex flex-col h-full border-border">
        <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm">Code Editor ({problem.language})</span>
          </div>
          <Button variant="accent" size="sm" onClick={handleRunCode} disabled={running}>
            <Play className="w-3.5 h-3.5 mr-1.5" />
            {running ? "Compiling..." : "Run Code"}
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex-1 space-y-4 flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full min-h-[300px] p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary border border-slate-800 leading-relaxed resize-y"
            placeholder="Write your solution here..."
          />

          {output && (
            <div
              className={`p-4 rounded-xl border space-y-2 animate-fade-in ${
                output.passed ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30"
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-xs">
                {output.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">Test Cases Passed</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="text-rose-500">Execution Failed</span>
                  </>
                )}
              </div>
              <p className="text-xs text-foreground">{output.feedback}</p>
              <div className="font-mono text-xs space-y-1 pt-2 border-t border-border/50">
                <p><span className="text-muted-foreground">Output:</span> {output.output}</p>
                <p><span className="text-muted-foreground">Expected:</span> {output.expected_output}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
