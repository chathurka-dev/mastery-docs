"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import type { DocMeta } from "@/docs/registry";

interface SidebarProps {
  docs: DocMeta[];
  bookmarkedSlugs: string[];
}

export function Sidebar({ docs, bookmarkedSlugs }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>(["languages"]);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const categoriesWithDocs = CATEGORIES.filter((cat) => docs.some((d) => d.category === cat.id));
  const bookmarkedDocs = docs.filter((d) => bookmarkedSlugs.includes(d.slug));

  return (
    <aside className="flex h-full flex-col overflow-y-auto bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand shadow-sm">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight">MasteryDocs</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
            pathname === "/"
              ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          <BookOpen className="h-4 w-4" />
          All Documents
        </Link>

        {bookmarkedDocs.length > 0 && (
          <Link
            href="/bookmarks"
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
              pathname === "/bookmarks"
                ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
            )}
          >
            <Bookmark className="h-4 w-4" />
            Bookmarks
            <span className="ml-auto text-xs bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300 rounded-full px-2 py-0.5 font-semibold">
              {bookmarkedDocs.length}
            </span>
          </Link>
        )}

        <div className="pt-2 pb-1 px-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">Categories</p>
        </div>

        {categoriesWithDocs.map((cat) => {
          const catDocs = docs.filter((d) => d.category === cat.id);
          const isOpen = expanded.includes(cat.id);

          return (
            <div key={cat.id}>
              <button
                suppressHydrationWarning
                onClick={() => toggle(cat.id)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
              >
                <span className="text-base">{cat.icon}</span>
                <span className="flex-1 text-left truncate">{cat.label}</span>
                <span className="text-xs text-slate-400 dark:text-slate-600 mr-1">{catDocs.length}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 pl-3">
                      {catDocs.map((doc) => {
                        const isActive = pathname === `/docs/${doc.slug}`;
                        return (
                          <Link
                            key={doc.slug}
                            href={`/docs/${doc.slug}`}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-150",
                              isActive
                                ? "bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-semibold"
                                : "text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                          >
                            <span className="truncate">{doc.title}</span>
                            {bookmarkedSlugs.includes(doc.slug) && (
                              <Bookmark className="ml-auto h-3 w-3 text-violet-400 flex-shrink-0" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
