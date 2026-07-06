import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0 - 100
  className?: string;
  barColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className, barColor = "bg-primary" }) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full bg-secondary h-2.5 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all duration-500 rounded-full", barColor)}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
};
