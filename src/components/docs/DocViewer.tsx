"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, CheckCircle, ChevronLeft, Clock, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CATEGORY_STYLES, CATEGORIES } from "@/lib/constants";
import { toggleBookmark, markCompleted, unmarkCompleted, recordDocVisit } from "@/app/actions/docs";
import { NotesPanel } from "@/components/docs/NotesPanel";
import type { NoteItem } from "@/components/docs/NotesPanel";
import type { DocMeta } from "@/docs/registry";

const DIFFICULTY_STYLES = {
  beginner: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  intermediate: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  advanced: "bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
};

interface DocViewerProps {
  meta: DocMeta;
  component: React.ComponentType;
  isBookmarked: boolean;
  isCompleted: boolean;
  initialNotes: NoteItem[];
}

export function DocViewer({ meta, component: DocComponent, isBookmarked: initialBookmarked, isCompleted: initialCompleted, initialNotes }: DocViewerProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [completed, setCompleted] = useState(initialCompleted);
  const [showNotes, setShowNotes] = useState(false);
  const [isPending, startTransition] = useTransition();
  const catStyle = CATEGORY_STYLES[meta.category];
  const catLabel = CATEGORIES.find((c) => c.id === meta.category)?.label ?? meta.category;

  useEffect(() => {
    recordDocVisit(meta.slug).catch(() => {});
  }, [meta.slug]);

  const handleBookmark = () => {
    startTransition(async () => {
      const next = !bookmarked;
      setBookmarked(next);
      try {
        await toggleBookmark(meta.slug, next);
        toast.success(next ? "Bookmarked" : "Bookmark removed");
      } catch {
        setBookmarked(!next);
        toast.error("Could not update bookmark.");
      }
    });
  };

  const handleComplete = () => {
    startTransition(async () => {
      const next = !completed;
      setCompleted(next);
      try {
        if (next) {
          await markCompleted(meta.slug);
          toast.success("Marked as completed");
        } else {
          await unmarkCompleted(meta.slug);
          toast.success("Marked as incomplete");
        }
      } catch {
        setCompleted(!next);
        toast.error("Could not update progress.");
      }
    });
  };

  return (
    <div className="min-h-full px-4 py-6 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to library
        </Link>

        {/* Doc header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 mb-4"
        >
          {/* Category + difficulty + completed */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: catStyle?.color }}
            >
              <span aria-hidden>{catStyle?.icon}</span>
              {catLabel}
            </span>
            <span className={cn("text-xs font-semibold px-3 py-1 rounded-full border capitalize", DIFFICULTY_STYLES[meta.difficulty])}>
              {meta.difficulty}
            </span>
            {completed && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
            {meta.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-4">
            {meta.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {meta.readTime} min read
            </span>
            <span aria-hidden className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex flex-wrap gap-1.5">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleBookmark}
              disabled={isPending}
              aria-pressed={bookmarked}
              className={cn(bookmarked && "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300")}
            >
              {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button
              variant={completed ? "secondary" : "outline"}
              size="sm"
              onClick={handleComplete}
              disabled={isPending}
              aria-pressed={completed}
              className={cn(
                completed &&
                  "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
              )}
            >
              <CheckCircle className="h-4 w-4" />
              {completed ? "Completed" : "Mark as completed"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowNotes((v) => !v)}
              aria-pressed={showNotes}
              className={cn(showNotes && "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300")}
            >
              <StickyNote className="h-4 w-4" />
              Notes
              {initialNotes.length > 0 && (
                <span className="ml-0.5 text-xs font-bold opacity-75">({initialNotes.length})</span>
              )}
            </Button>
          </div>
        </motion.header>

        {/* The doc component */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          <DocComponent />
        </motion.div>

        {/* Notes panel */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NotesPanel docSlug={meta.slug} initialNotes={initialNotes} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
