"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { DocMeta } from "@/docs/registry";

interface AppShellProps {
  children: React.ReactNode;
  docs: DocMeta[];
  bookmarkedSlugs: string[];
}

export function AppShell({ children, docs, bookmarkedSlugs }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:flex-shrink-0">
        <Sidebar docs={docs} bookmarkedSlugs={bookmarkedSlugs} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col lg:hidden"
            >
              <Sidebar docs={docs} bookmarkedSlugs={bookmarkedSlugs} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header
          docs={docs}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
          menuOpen={mobileMenuOpen}
        />
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
