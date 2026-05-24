"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, Menu, X } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { ThemeToggle } from "./ThemeToggle";
import type { DocMeta } from "@/docs/registry";

interface HeaderProps {
  docs: DocMeta[];
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function Header({ docs, onMenuToggle, menuOpen }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const profileWrapperRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 1
    ? docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  // Outside-click for both dropdowns
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Global keyboard shortcuts: `/` and `⌘K` focus search, `Escape` clears
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !inField)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === "Escape") {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
          setShowResults(false);
        }
        setShowProfile(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const goTo = (slug: string) => {
    setShowResults(false);
    setQuery("");
    router.push(`/docs/${slug}`);
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(results[activeIdx].slug);
    }
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Search */}
      <div ref={searchWrapperRef} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden />
        <input
          ref={searchInputRef}
          type="text"
          role="combobox"
          aria-expanded={showResults && results.length > 0}
          aria-controls="search-results"
          aria-autocomplete="list"
          placeholder="Search docs..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); setActiveIdx(0); }}
          onFocus={() => setShowResults(true)}
          onKeyDown={onSearchKeyDown}
          suppressHydrationWarning
          className="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-12 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:bg-white dark:focus:bg-slate-700 transition-all"
        />
        <kbd
          aria-hidden
          className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60"
        >
          /
        </kbd>

        {showResults && results.length > 0 && (
          <ul
            id="search-results"
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {results.map((doc, i) => (
              <li key={doc.slug} role="option" aria-selected={i === activeIdx}>
                <button
                  onMouseDown={(e) => { e.preventDefault(); goTo(doc.slug); }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={
                    "flex items-start gap-3 w-full px-4 py-3 text-left transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 " +
                    (i === activeIdx
                      ? "bg-violet-50 dark:bg-slate-700"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50")
                  }
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{doc.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{doc.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0">{doc.readTime}m</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {showResults && query.trim().length > 1 && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl px-4 py-3 z-50">
            <p className="text-sm text-slate-500 dark:text-slate-400">No docs match &quot;{query}&quot;</p>
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        {/* Profile dropdown */}
        <div ref={profileWrapperRef} className="relative">
          <button
            onClick={() => setShowProfile((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={showProfile}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-brand text-white text-xs font-bold">
              {initials}
            </div>
            <span className="hidden sm:block font-medium max-w-[120px] truncate">
              {session?.user?.name ?? "Account"}
            </span>
          </button>

          {showProfile && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{session?.user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.user?.email}</p>
              </div>
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors focus-visible:outline-none focus-visible:bg-rose-50 dark:focus-visible:bg-rose-950/50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
