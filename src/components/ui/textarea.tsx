import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[110px] w-full rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm shadow-inner ring-offset-background backdrop-blur placeholder:text-slate-400 transition focus-visible:border-[hsl(var(--commerce-green))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--commerce-green))] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
