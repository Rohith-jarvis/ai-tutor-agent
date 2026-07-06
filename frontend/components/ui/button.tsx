import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
      primary: "bg-primary text-white hover:bg-primary-600 shadow-md shadow-primary/20",
      secondary: "bg-secondary text-secondary-foreground hover:bg-slate-200 dark:hover:bg-slate-700",
      outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
      ghost: "bg-transparent text-foreground hover:bg-secondary",
      danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-500/20",
      accent: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-md shadow-purple-500/20"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
