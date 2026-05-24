"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Bookmark, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocMeta } from "@/docs/registry";

const DIFFICULTY_STYLES = {
  beginner: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
  intermediate: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  advanced: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400",
};

interface DocCardProps {
  doc: DocMeta;
  isBookmarked: boolean;
  isCompleted: boolean;
  categoryColor: string;
}

export function DocCard({ doc, isBookmarked, isCompleted, categoryColor }: DocCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link href={`/docs/${doc.slug}`} className="group block h-full">
        <div className="relative h-full flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-shadow duration-200 group-hover:shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-600">
          {/* Top color strip */}
          <div className="h-1.5 w-full" style={{ background: categoryColor }} />

          <div className="flex flex-col flex-1 p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <span
                className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", DIFFICULTY_STYLES[doc.difficulty])}
              >
                {doc.difficulty}
              </span>
              <div className="flex items-center gap-1.5">
                {isCompleted && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                {isBookmarked && <Bookmark className="h-4 w-4 text-violet-500 fill-violet-500" />}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
              {doc.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
              {doc.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {doc.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                <span>{doc.readTime} min read</span>
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-violet-600 dark:text-violet-400 transition-transform group-hover:translate-x-0.5">
                Read <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
