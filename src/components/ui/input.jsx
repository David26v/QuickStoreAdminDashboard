import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  size = "md",
  ...props
}) {
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-9 text-base",
    xl: "h-12 text-lg",
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        sizeClasses[size],
        // Updated gradient border and ring on focus and hover
        "focus:border-transparent focus:ring-[3px] focus:ring-blue-500/40 focus:outline-none",
        "hover:border-transparent hover:ring-[2px] hover:ring-violet-500/40",
        "focus:shadow-[0_0_0_2px_rgba(99,102,241,0.4),0_0_0_4px_rgba(168,85,247,0.4)]", // blue-violet layered ring
        className
      )}
      {...props}
    />
  );
}

export { Input };
