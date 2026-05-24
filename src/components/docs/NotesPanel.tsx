"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, Check, X, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { saveNote, deleteNote } from "@/app/actions/docs";

export interface NoteItem {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesPanelProps {
  docSlug: string;
  initialNotes: NoteItem[];
}

export function NotesPanel({ docSlug, initialNotes }: NotesPanelProps) {
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [newText, setNewText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAdd = async () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      const note = await saveNote(docSlug, trimmed);
      setNotes((prev) => [note, ...prev]);
      setNewText("");
      setIsAdding(false);
      toast.success("Note saved");
    } catch {
      toast.error("Could not save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      const updated = await saveNote(docSlug, trimmed, id);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setEditingId(null);
      toast.success("Note updated");
    } catch {
      toast.error("Could not update note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
      toast.success("Note deleted");
    } catch {
      // Restore on failure
      setNotes(initialNotes);
      toast.error("Could not delete note");
    }
  };

  const startEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setEditText(note.content);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            My Notes
          </h2>
          {notes.length > 0 && (
            <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-0.5">
              {notes.length}
            </span>
          )}
        </div>
        {!isAdding && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsAdding(true);
              setTimeout(() => textareaRef.current?.focus(), 50);
            }}
          >
            <Plus className="h-4 w-4" />
            Add note
          </Button>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* New note form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 mb-3">
                <textarea
                  ref={textareaRef}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Write your note here…"
                  rows={3}
                  className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
                    if (e.key === "Escape") { setIsAdding(false); setNewText(""); }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">⌘↵ to save · Esc to cancel</span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setIsAdding(false); setNewText(""); }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAdd}
                      disabled={isSaving || !newText.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes list */}
        {notes.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No notes yet</p>
            <p className="text-xs mt-0.5">Add a note to capture your thoughts on this doc.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3"
              >
                {editingId === note.id ? (
                  <>
                    <textarea
                      ref={textareaRef}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-200 resize-none outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleEdit(note.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        onClick={cancelEdit}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label="Cancel edit"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(note.id)}
                        disabled={isSaving || !editText.trim()}
                        className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-40"
                        aria-label="Save edit"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(note)}
                        className="p-1 rounded text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                        aria-label="Edit note"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
