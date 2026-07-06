"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";
import { Bot, Send, Sparkles, User, Code, Lightbulb } from "lucide-react";
import { api } from "@/lib/api";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface ChatWindowProps {
  initialSubject?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ initialSubject = "Java" }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello! I am your **AI Personal Tutor**. How can I help you learn ${initialSubject} today? Ask me to explain a concept, break down code line by line, or give real-world analogies!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [subject, setSubject] = useState(initialSubject);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const messageToSend = customText || input;
    if (!messageToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setLoading(true);

    try {
      const res = await api.post("/ai/chat", {
        message: messageToSend,
        subject: subject,
        level: level
      });

      const aiMsg: Message = {
        sender: "ai",
        text: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `I'm currently running in local mode. Let's break down **${messageToSend}**:\n\n1. **Concept**: In ${subject}, this refers to a fundamental building block.\n2. **Analogy**: Imagine a structured blueprint.\n3. **Line-by-Line Code**:\n\`\`\`python\n# Example code for ${messageToSend}\ndef solve():\n    return "Mastered!"\n\`\`\`\n\nAsk me more questions!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    `Explain ${subject} concepts simply with an analogy`,
    `Explain code line by line`,
    `Give a real-world example of ${subject}`
  ];

  return (
    <Card className="glass flex flex-col h-[650px] border-border shadow-2xl max-w-4xl mx-auto">
      {/* Header & Controls */}
      <CardHeader className="border-b border-border py-3 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold flex items-center space-x-2">
              <span>AI Tutor Studio</span>
              <Badge variant="primary" className="text-[10px]">{level} Level</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Subject: {subject}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            options={[
              { label: "Beginner", value: "Beginner" },
              { label: "Intermediate", value: "Intermediate" },
              { label: "Advanced", value: "Advanced" }
            ]}
            className="w-32 h-8 text-xs"
          />
        </div>
      </CardHeader>

      {/* Messages Window */}
      <CardContent className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === "user" ? "bg-primary text-white" : "bg-purple-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-secondary text-foreground border border-border"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
              <span
                className={`block text-[10px] mt-2 ${
                  msg.sender === "user" ? "text-indigo-200 text-right" : "text-muted-foreground"
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground italic pl-11">
            <Sparkles className="w-4 h-4 animate-spin text-primary" />
            <span>AI Tutor is thinking and generating explanation...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Chips & Input Footer */}
      <div className="p-4 border-t border-border bg-card/40 space-y-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full border border-border bg-secondary hover:bg-card text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors flex items-center space-x-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask AI Tutor anything about ${subject}...`}
            className="flex-1"
          />
          <Button type="submit" variant="accent" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
