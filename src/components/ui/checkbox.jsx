import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react"; 

import { cn } from "@/lib/utils";


const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles
      "peer h-5 w-5 shrink-0 rounded-lg border border-gray-300 shadow-sm", 
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:ring-offset-0", 
      "disabled:cursor-not-allowed disabled:opacity-50", 
      "data-[state=checked]:border-orange-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-orange-600 data-[state=checked]:text-white", 
      "transition-colors duration-200 ease-in-out",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-current",
        "data-[state=checked]:text-white"
      )}
    >
      <CheckIcon className="h-4 w-4" /> 
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
