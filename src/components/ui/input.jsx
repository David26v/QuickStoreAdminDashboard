import * as React from "react";
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  size = "md",
  variant = "default",
  ...props
}) {
  const sizeClasses = {
    sm: "h-8 text-sm px-2.5 py-1",
    md: "h-10 text-sm px-3 py-2",
    lg: "h-11 text-base px-4 py-2.5",
    xl: "h-12 text-lg px-4 py-3",
  };

  const variantClasses = {
    default: [
      // Base styling matching QuickStore theme
      "bg-white border-gray-200",
      "text-gray-800 placeholder:text-gray-500",
      // QuickStore orange focus states
      "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
      "hover:border-orange-300 hover:shadow-sm",
      // Enhanced shadow on focus
      "focus:shadow-[0_0_0_0px_rgba(249,115,22,0.1),0_1px_3px_0_rgba(0,0,0,0.1)]",
    ],
    filled: [
      // Filled variant with QuickStore styling
      "bg-gray-50 border-gray-200",
      "text-gray-800 placeholder:text-gray-500",
      "focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
      "hover:bg-gray-100 hover:border-orange-300",
    ],
    outlined: [
      // Strong border variant
      "bg-transparent border-2 border-gray-300",
      "text-gray-800 placeholder:text-gray-500",
      "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
      "hover:border-orange-400",
    ],
    gradient: [
      // Subtle gradient border (premium look)
      "bg-white border-transparent",
      "text-gray-800 placeholder:text-gray-500",
      "shadow-[inset_0_0_0_1px_rgba(156,163,175,0.3)]",
      "focus:shadow-[inset_0_0_0_1px_rgba(249,115,22,0.8),0_0_0_2px_rgba(249,115,22,0.2)]",
      "hover:shadow-[inset_0_0_0_1px_rgba(249,115,22,0.5)]",
    ]
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base input styling
        "flex w-full min-w-0 rounded-xl border transition-all duration-200 ease-in-out",
        "font-medium selection:bg-orange-500 selection:text-white",
        "outline-none appearance-none",
        
        // File input specific styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-700",
        "file:mr-3 file:px-3 file:py-1 file:rounded-lg file:bg-gray-100",
        "file:hover:bg-orange-50 file:hover:text-orange-700",
        
        // Disabled states
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400",
        
        // Size classes
        sizeClasses[size],
        
        // Variant classes
        variantClasses[variant],
        
        // Custom className override
        className
      )}
      {...props}
    />
  );
}

// Enhanced Input with QuickStore branding elements
function InputWithIcon({
  className,
  icon: Icon,
  iconPosition = "left",
  size = "md",
  variant = "default",
  ...props
}) {
  const sizeClasses = {
    sm: { input: "h-8 text-sm", padding: iconPosition === "left" ? "pl-8 pr-3" : "pl-3 pr-8", icon: "w-4 h-4" },
    md: { input: "h-10 text-sm", padding: iconPosition === "left" ? "pl-10 pr-3" : "pl-3 pr-10", icon: "w-5 h-5" },
    lg: { input: "h-11 text-base", padding: iconPosition === "left" ? "pl-11 pr-4" : "pl-4 pr-11", icon: "w-5 h-5" },
    xl: { input: "h-12 text-lg", padding: iconPosition === "left" ? "pl-12 pr-4" : "pl-4 pr-12", icon: "w-6 h-6" },
  };

  const iconPositionClasses = {
    left: iconPosition === "left" ? "left-3" : "right-3",
  };

  return (
    <div className="relative">
      <Input
        className={cn(
          sizeClasses[size].input,
          sizeClasses[size].padding,
          className
        )}
        size={size}
        variant={variant}
        {...props}
      />
      {Icon && (
        <Icon
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-colors duration-200",
            iconPosition === "left" ? "left-3" : "right-3",
            sizeClasses[size].icon,
            // Icon color changes on focus (you'd need to handle this with state)
            "peer-focus:text-orange-500"
          )}
        />
      )}
    </div>
  );
}

// Search Input variant with QuickStore styling
function SearchInput({ className, ...props }) {
  return (
    <div className="relative">
      <Input
        type="search"
        className={cn(
          "pl-10 pr-4",
          // Custom search input styling
          "bg-gray-50 border-gray-200",
          "focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
          "hover:bg-white hover:border-orange-300",
          className
        )}
        variant="filled"
        {...props}
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z"
        />
      </svg>
    </div>
  );
}

export { Input, InputWithIcon, SearchInput };