"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TopProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTicking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    stopTicking();
    setVisible(true);
    setProgress(15);
    // Asymptotic tick toward 90% — never completes until route actually loads
    intervalRef.current = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.max(0.5, (90 - p) * 0.08)));
    }, 180);
  };

  const finish = () => {
    stopTicking();
    setProgress(100);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
  };

  // When route changes, finish the bar
  useEffect(() => {
    if (visible) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept internal link clicks anywhere in the document
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      // External link?
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        // Same path + same search — no navigation will happen
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      } catch {
        return;
      }
      start();
    };

    // Also catch back/forward navigation
    const onPopState = () => start();

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      stopTicking();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
    // Listeners register once on mount; `start` is stable enough by closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[100] h-0.5 pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms ease-out" }}
    >
      <div
        className="h-full bg-gradient-to-r from-violet-500 via-violet-400 to-indigo-500 shadow-[0_0_8px_rgba(124,58,237,0.6)]"
        style={{
          width: `${progress}%`,
          transition: "width 200ms ease-out",
        }}
      />
    </div>
  );
}

export function TopProgressBar() {
  // useSearchParams must be inside Suspense per Next.js 15 rules
  return (
    <Suspense fallback={null}>
      <TopProgressBarInner />
    </Suspense>
  );
}
