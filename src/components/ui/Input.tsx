import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            suppressHydrationWarning
          className={cn(
              "h-11 w-full rounded-xl border bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              error
                ? "border-rose-400 focus:ring-rose-400 focus:border-rose-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose-500">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
