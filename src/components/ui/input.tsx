import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-slate-200/70 bg-white/70 px-4 py-2 text-base shadow-inner ring-offset-background backdrop-blur placeholder:text-slate-400 transition focus-visible:border-[hsl(var(--commerce-green))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--commerce-green))] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
