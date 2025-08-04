import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        // --- Default variant: Matches the primary orange from ClientPage ---
        default:
          "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm hover:from-orange-600 hover:to-orange-700", 

        // --- Secondary variant: Subtle background, good for counts/tags ---
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700", 

        // --- Destructive variant: Clear error/warning state ---
        destructive:
          "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50 dark:border-red-800/50",

     
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",


        active:
          "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30", 
    
        inactive:
          "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30", 

      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      data-slot="badge" 
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants }
