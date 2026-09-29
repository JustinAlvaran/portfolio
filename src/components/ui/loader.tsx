"use client";

import { cn } from "@/lib/utils";

export interface LoaderProps {
  variant?: "typing" | "terminal" | "text-shimmer" | "loading-dots";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function TypingLoader({ className, size = "md" }: Omit<LoaderProps, "variant" | "text">) {
  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-1.5 w-1.5",
    lg: "h-2 w-2",
  };

  return (
    <div className={cn("flex h-5 items-center space-x-1", className)}>
      {[0, 1, 2].map((index) => (
        <div
          className={cn("animate-[typing_1s_infinite] rounded-full bg-primary", dotSizes[size])}
          key={index}
          style={{ animationDelay: `${index * 250}ms` }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TerminalLoader({ className, size = "md" }: Omit<LoaderProps, "variant" | "text">) {
  const cursorSizes = {
    sm: "h-3 w-1.5",
    md: "h-4 w-2",
    lg: "h-5 w-2.5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex h-5 items-center space-x-1", className)}>
      <span className={cn("font-mono text-primary", textSizes[size])}>{">"}</span>
      <div className={cn("animate-[blink_1s_step-end_infinite] bg-primary", cursorSizes[size])} />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextShimmerLoader({
  text = "Thinking",
  className,
  size = "md",
}: Omit<LoaderProps, "variant">) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={cn(
        "animate-[shimmer_4s_infinite_linear] bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)] bg-[length:200%_auto] bg-clip-text font-medium text-transparent",
        textSizes[size],
        className,
      )}
    >
      {text}
    </div>
  );
}

export function TextDotsLoader({
  className,
  text = "Thinking",
  size = "md",
}: Omit<LoaderProps, "variant">) {
  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("inline-flex items-center", className)}>
      <span className={cn("font-medium text-primary", textSizes[size])}>{text}</span>
      <span className="inline-flex">
        <span className="animate-[loading-dots_1.4s_infinite_0.2s] text-primary">.</span>
        <span className="animate-[loading-dots_1.4s_infinite_0.4s] text-primary">.</span>
        <span className="animate-[loading-dots_1.4s_infinite_0.6s] text-primary">.</span>
      </span>
    </div>
  );
}

export function Loader({
  variant = "typing",
  size = "md",
  text,
  className,
}: LoaderProps) {
  switch (variant) {
    case "terminal":
      return <TerminalLoader className={className} size={size} />;
    case "text-shimmer":
      return <TextShimmerLoader className={className} size={size} text={text} />;
    case "loading-dots":
      return <TextDotsLoader className={className} size={size} text={text} />;
    case "typing":
    default:
      return <TypingLoader className={className} size={size} />;
  }
}
