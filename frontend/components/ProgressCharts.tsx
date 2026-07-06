"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

const weeklyData = [
  { day: "Mon", score: 85, hours: 1.5 },
  { day: "Tue", score: 90, hours: 2.0 },
  { day: "Wed", score: 78, hours: 1.0 },
  { day: "Thu", score: 95, hours: 2.5 },
  { day: "Fri", score: 88, hours: 1.8 },
  { day: "Sat", score: 92, hours: 3.0 },
  { day: "Sun", score: 96, hours: 2.2 }
];

const subjectBreakdown = [
  { subject: "Python", score: 95 },
  { subject: "Java", score: 88 },
  { subject: "C Lang", score: 62 },
  { subject: "Data Struct", score: 78 },
  { subject: "SQL", score: 92 },
  { subject: "OS", score: 70 }
];

export const ProgressCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Performance Bar Chart */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Weekly Performance & Study Hours</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", borderRadius: "12px", border: "1px solid #374151", color: "#fff" }}
              />
              <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} name="Quiz Score %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Mastery Breakdown */}
      <Card className="glass border-border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Subject Mastery Scores (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis type="number" domain={[0, 100]} stroke="#888888" fontSize={12} />
              <YAxis dataKey="subject" type="category" stroke="#888888" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", borderRadius: "12px", border: "1px solid #374151", color: "#fff" }}
              />
              <Bar dataKey="score" fill="#ec4899" radius={[0, 6, 6, 0]} name="Score %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
