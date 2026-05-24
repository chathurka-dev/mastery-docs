import { cn } from "@/lib/utils";
import { CATEGORY_STYLES } from "@/lib/constants";

interface BadgeProps {
  children: React.ReactNode;
  category?: string;
  className?: string;
  size?: "sm" | "md";
}

export function Badge({ children, category, className, size = "sm" }: BadgeProps) {
  const style = category ? CATEGORY_STYLES[category] : null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        style
          ? `text-white`
          : "bg-slate-100 text-slate-600",
        className
      )}
      style={style ? { backgroundColor: style.color, color: "#fff" } : undefined}
    >
      {children}
    </span>
  );
}
