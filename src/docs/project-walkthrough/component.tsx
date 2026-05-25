"use client";

import { useState, useRef } from "react";
import {
  Lightbulb,
  Package,
  BarChart3,
  Layers,
  ArrowRight,
  Cpu,
  Database,
  Palette,
  Rocket,
  ShieldCheck,
  Server,
  Globe,
  Code2,
  KeyRound,
  GitBranch,
  Lock,
  Mail,
  Zap,
  Terminal,
  Monitor,
  Cloud,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Accent map (same shape as DOC_STYLE_GUIDE) ─────────────────────────────

const accentMap: Record<string, { border: string; bg: string; text: string; ring: string; chipBg: string }> = {
  violet: {
    border: "border-violet-300 dark:border-violet-700",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    ring: "ring-violet-400",
    chipBg: "bg-violet-100 dark:bg-violet-900/50",
  },
  rose: {
    border: "border-rose-300 dark:border-rose-700",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-400",
    chipBg: "bg-rose-100 dark:bg-rose-900/50",
  },
  emerald: {
    border: "border-emerald-300 dark:border-emerald-700",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-400",
    chipBg: "bg-emerald-100 dark:bg-emerald-900/50",
  },
  blue: {
    border: "border-blue-300 dark:border-blue-700",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    ring: "ring-blue-400",
    chipBg: "bg-blue-100 dark:bg-blue-900/50",
  },
  amber: {
    border: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-400",
    chipBg: "bg-amber-100 dark:bg-amber-900/50",
  },
  cyan: {
    border: "border-cyan-300 dark:border-cyan-700",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    ring: "ring-cyan-400",
    chipBg: "bg-cyan-100 dark:bg-cyan-900/50",
  },
};

type AccentKey = keyof typeof accentMap;
type TabId = "arch" | "stack" | "data" | "ui" | "deploy";

// ─── Root ───────────────────────────────────────────────────────────────────

export default function ProjectWalkthrough() {
  const [tab, setTab] = useState<TabId>("arch");

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
          Interactive Guide
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">
          MasteryDocs — Project Walkthrough
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          The same app you&apos;re reading right now, taken apart layer by layer.
        </p>
      </header>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-3 px-2">
        <Lightbulb className="inline h-3.5 w-3.5 mr-1 text-amber-500" aria-hidden />
        New to Next.js? Read the tabs left-to-right — each one builds on the vocabulary of the
        last.
      </p>

      <Tabs tab={tab} setTab={setTab} />

      <div className="mt-8 space-y-6">
        {tab === "arch" && <ArchTab />}
        {tab === "stack" && <StackTab />}
        {tab === "data" && <DataTab />}
        {tab === "ui" && <UiTab />}
        {tab === "deploy" && <DeployTab />}
      </div>
    </article>
  );
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; Icon: typeof Layers }[] = [
  { id: "arch", label: "Architecture", Icon: Cpu },
  { id: "stack", label: "Stack & Why", Icon: Layers },
  { id: "data", label: "Data & Auth", Icon: Database },
  { id: "ui", label: "UI System", Icon: Palette },
  { id: "deploy", label: "Deploy", Icon: Rocket },
];

function Tabs({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next =
        e.key === "ArrowRight" ? (idx + 1) % TABS.length : (idx - 1 + TABS.length) % TABS.length;
      tabsRef.current[next]?.focus();
      setTab(TABS[next].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Doc sections"
      className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
    >
      {TABS.map(({ id, label, Icon }, idx) => {
        const active = tab === id;
        return (
          <button
            key={id}
            ref={(el) => {
              tabsRef.current[idx] = el;
            }}
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            suppressHydrationWarning
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              active
                ? "bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Tab 1: Stack & Why ─────────────────────────────────────────────────────

const stackItems: {
  name: string;
  role: string;
  accent: AccentKey;
  why: string;
  alternative: string;
}[] = [
  {
    name: "Next.js 15 (App Router)",
    role: "Full-stack React framework",
    accent: "violet",
    why: "App Router gives us server components by default — most of the page renders on the server, sends plain HTML to the browser, and only ships JavaScript for the parts that need interactivity. That keeps bundles small. It also bundles routing, layouts, API routes, server actions, image optimization, and middleware in one place, so we don't have to glue separate libraries together.",
    alternative:
      "Vite + React Router would give faster local dev but no server components, no server actions, and we'd be building the whole API layer ourselves.",
  },
  {
    name: "React 19",
    role: "UI rendering",
    accent: "blue",
    why: "Next.js 15 ships with React 19, which adds first-class support for server actions and the use() hook. We rely on server actions heavily — the bookmark toggle, marking docs complete, saving notes — and React 19 makes them ergonomic.",
    alternative:
      "React 18 still works but you lose the streaming and action improvements; not worth it for a new project.",
  },
  {
    name: "TypeScript 5",
    role: "Type system",
    accent: "blue",
    why: "Catches a huge class of bugs before they hit production — typos in env vars, wrong shape passed to a function, forgetting to await a promise. With Prisma, the types flow all the way from the database into the UI.",
    alternative:
      "Plain JavaScript is shorter to write but compounds maintenance cost as the project grows.",
  },
  {
    name: "Tailwind CSS v4",
    role: "Styling",
    accent: "cyan",
    why: "Utility-first means we never invent CSS class names or fight specificity. v4 specifically is a rewrite — it uses CSS-native features (@theme, @custom-variant), is much faster than v3, and lets us define dark mode via [data-theme=dark] instead of the older .dark class.",
    alternative:
      "CSS Modules or styled-components both work but require maintaining a separate file per component. Tailwind keeps styles colocated with markup.",
  },
  {
    name: "Better Auth",
    role: "Authentication",
    accent: "emerald",
    why: "A modern auth library purpose-built for the Next.js App Router. Supports email/password, OAuth, magic links, email verification, password reset, and session management out of the box. The session is stored in our own database (not in a JWT), so we can invalidate sessions instantly.",
    alternative:
      "NextAuth/Auth.js works too but Better Auth's TypeScript ergonomics and built-in features like rate limiting feel newer and cleaner.",
  },
  {
    name: "Prisma 6",
    role: "ORM / database client",
    accent: "rose",
    why: "An ORM (Object-Relational Mapper) is the layer of code that turns database rows into TypeScript objects and back. Prisma is schema-first: you describe your tables in schema.prisma, run prisma generate, and Prisma builds a fully typed client. Auto-completes column names, catches type mismatches at compile time, and migrations are versioned.",
    alternative:
      "Drizzle is faster at runtime, raw SQL is faster still. Prisma trades a bit of raw speed for the best developer experience in TypeScript.",
  },
  {
    name: "Neon (PostgreSQL)",
    role: "Database",
    accent: "emerald",
    why: "Serverless Postgres. Scales to zero when idle (no cost when nobody's using the app), branches like git, and the free tier is generous. Postgres itself is the rock-solid default for any serious project.",
    alternative:
      "Supabase bundles auth + storage + DB but locks you in. Plain RDS is cheaper at scale but heavier to operate. Neon hits the sweet spot for early-stage projects.",
  },
  {
    name: "Zod",
    role: "Runtime validation",
    accent: "amber",
    why: "TypeScript types disappear at runtime. Zod adds a runtime guard for things that come from outside our code — environment variables, form input, URL params. If process.env.DATABASE_URL is missing, we crash at boot with a clear error instead of dying on the first DB query.",
    alternative:
      "Yup or Joi do similar things. Zod's TypeScript inference is the best of the three.",
  },
  {
    name: "Zustand",
    role: "Client state",
    accent: "amber",
    why: "We only need client state for one thing: the theme toggle (light/dark). Zustand is tiny (~1KB), has built-in persistence to localStorage, and doesn't require wrapping the app in a provider. Redux would be overkill.",
    alternative:
      "React's built-in useState + Context works but doesn't persist. Redux is too heavy for a single piece of state.",
  },
  {
    name: "Resend",
    role: "Transactional email",
    accent: "rose",
    why: "Modern email API with a great DX. Send verification and password-reset emails with a single fetch. Free tier covers 3,000 emails/month — plenty for a side project.",
    alternative:
      "SendGrid and Postmark both work but their APIs feel dated. Resend was built by people who clearly used the alternatives and got frustrated.",
  },
  {
    name: "Vercel",
    role: "Hosting",
    accent: "violet",
    why: "Built by the same team as Next.js, so the integration is seamless. Git push triggers a deploy. Server components, server actions, image optimization, edge middleware — all work without configuration. Free tier handles hobby projects.",
    alternative:
      "Cloudflare Pages, Netlify, or self-hosting all work. Vercel is the path of least resistance for a Next.js app.",
  },
  {
    name: "Lucide React",
    role: "Icon library",
    accent: "cyan",
    why: "Open-source fork of Feather Icons. Tree-shakeable — we only ship the icons we import, not the whole set. Consistent stroke weight across the whole catalog.",
    alternative:
      "Heroicons is also fine. Don't mix two icon sets — the stroke weights never match.",
  },
];

function StackTab() {
  return (
    <section id="panel-stack" role="tabpanel" aria-labelledby="tab-stack" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Every dependency in this project, what it does, and why we picked it over the alternatives.
      </p>

      <Callout tone="amber" icon={Lightbulb} title="The rule we followed">
        We never added a library &ldquo;just in case.&rdquo; Each piece on this list earned its
        spot by solving a specific problem the standard library or framework couldn&apos;t solve
        cleanly. If you can&apos;t articulate the &ldquo;why&rdquo; for a dependency, you
        probably don&apos;t need it.
      </Callout>

      <div className="space-y-3">
        {stackItems.map((item) => {
          const a = accentMap[item.accent];
          return (
            <div
              key={item.name}
              className={cn("rounded-xl border-2 p-5", a.border, a.bg)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className={cn("text-sm font-bold", a.text)}>{item.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                <strong className="text-slate-800 dark:text-slate-200">Why: </strong>
                {item.why}
              </p>
              <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
                  Alternative considered
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.alternative}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          The bundle, top to bottom
        </h3>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          {[
            { label: "Browser", color: "blue" as AccentKey },
            { label: "React 19", color: "blue" as AccentKey },
            { label: "Next.js 15", color: "violet" as AccentKey },
            { label: "Server Actions", color: "violet" as AccentKey },
            { label: "Better Auth", color: "emerald" as AccentKey },
            { label: "Prisma", color: "rose" as AccentKey },
            { label: "Neon Postgres", color: "emerald" as AccentKey },
          ].map((step, i, arr) => {
            const a = accentMap[step.color];
            return (
              <li key={step.label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold border",
                    a.chipBg,
                    a.text,
                    a.border
                  )}
                >
                  {step.label}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
          A click in the browser flows down this chain. A request travels from React (via a
          server action) into Next.js, which calls Better Auth to check the session, then Prisma
          to query Neon. The response flows back the other way.
        </p>
      </div>
    </section>
  );
}

// ─── Tab 2: Architecture ────────────────────────────────────────────────────

function ArchTab() {
  return (
    <section id="panel-arch" role="tabpanel" aria-labelledby="tab-arch" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        How the project is laid out on disk, why those choices, and what happens when you visit
        a page.
      </p>

      {/* Folder layout */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          The src/ folder, annotated
        </h3>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-300">src/</div>
          <div className="text-slate-300 pl-4">app/</div>
          <div className="text-slate-500 pl-4">{"// Next.js App Router. Each folder = a route."}</div>
          <div className="text-emerald-400 pl-8">(auth)/</div>
          <div className="text-slate-500 pl-8">{"// Route group: login, signup, verify, reset"}</div>
          <div className="text-emerald-400 pl-8">(protected)/</div>
          <div className="text-slate-500 pl-8">{"// Route group: requires a session"}</div>
          <div className="text-emerald-400 pl-8">api/auth/[...all]/</div>
          <div className="text-slate-500 pl-8">{"// Better Auth catch-all REST endpoints"}</div>
          <div className="text-emerald-400 pl-8">actions/</div>
          <div className="text-slate-500 pl-8">{"// Server actions (bookmarks, notes, etc.)"}</div>
          <div className="text-emerald-400 pl-4">middleware.ts</div>
          <div className="text-slate-500 pl-4">{"// Runs on every request, redirects unauth users"}</div>
          <div className="text-slate-300 pl-4">components/</div>
          <div className="text-slate-500 pl-4">{"// Reusable React: ui/, layout/, docs/"}</div>
          <div className="text-slate-300 pl-4">docs/</div>
          <div className="text-slate-500 pl-4">{"// Content. Each doc = folder with meta.ts + component.tsx"}</div>
          <div className="text-slate-300 pl-4">lib/</div>
          <div className="text-slate-500 pl-4">{"// Singletons: auth, db, env, utils"}</div>
          <div className="text-slate-300 pl-4">stores/</div>
          <div className="text-slate-500 pl-4">{"// Zustand stores (just theme.ts)"}</div>
          <div className="text-slate-300">prisma/schema.prisma</div>
          <div className="text-slate-500">{"// Database schema, source of truth"}</div>
        </div>
      </div>

      {/* Route groups concept */}
      <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5">
        <h3 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2">
          <GitBranch className="h-4 w-4" aria-hidden /> Route groups: <Code>(auth)</Code> and <Code>(protected)</Code>
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Folders wrapped in parentheses don&apos;t appear in the URL. <Code>(auth)/login/page.tsx</Code>{" "}
          becomes <Code>/login</Code>, not <Code>/(auth)/login</Code>. So why use them?
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          They let us share a layout across a group of routes without affecting the URL. All four
          auth pages (login, signup, verify, reset) share <Code>app/(auth)/layout.tsx</Code>{" "}
          — a minimal centered card with the logo. All app pages share{" "}
          <Code>app/(protected)/layout.tsx</Code> — which renders the sidebar and header AND
          checks the session before rendering anything else.
        </p>
        <Callout tone="amber" icon={Lightbulb} title="Why this matters">
          The session check lives in the layout, not in each page. That means we can never
          accidentally ship a protected page that forgot to check auth — it&apos;s impossible by
          structure.
        </Callout>
      </div>

      {/* Server vs Client */}
      <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5">
        <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
          <Server className="h-4 w-4" aria-hidden /> Server Components vs Client Components
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This is the single most important concept in modern Next.js — and the most confusing
          one for newcomers. Before comparing the two, we need to answer a more basic question:{" "}
          <em>what IS &ldquo;the server&rdquo;?</em>
        </p>

        {/* What IS the server */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-4 mb-4">
          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            First: what IS &ldquo;the server&rdquo;?
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            The server is a{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              separate computer running Node.js
            </strong>
            . It is NOT the user&apos;s browser. There are two places this Node.js process runs:
          </p>

          {/* In development */}
          <div className="rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              In development (on your own laptop)
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              When you run <Code>npm run dev</Code>, a Node.js process starts in your terminal on
              port 3000.{" "}
              <strong className="text-slate-800 dark:text-slate-200">That process IS the server.</strong>{" "}
              Even though both the server and your browser live on the same laptop, they are two
              separate programs that talk to each other over HTTP.
            </p>
            <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2.5 text-center">
                <Terminal className="h-4 w-4 mx-auto text-slate-500 dark:text-slate-400 mb-1" aria-hidden />
                <p className="text-[0.65rem] font-semibold text-slate-700 dark:text-slate-300">
                  Terminal: <Code>npm run dev</Code>
                </p>
                <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 mt-0.5">
                  Node.js on :3000
                </p>
                <p className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  = SERVER
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 mx-auto hidden sm:block" aria-hidden />
              <div className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2.5 text-center">
                <Monitor className="h-4 w-4 mx-auto text-slate-500 dark:text-slate-400 mb-1" aria-hidden />
                <p className="text-[0.65rem] font-semibold text-slate-700 dark:text-slate-300">
                  Chrome: <Code>localhost:3000</Code>
                </p>
                <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 mt-0.5">
                  React in the browser
                </p>
                <p className="text-[0.65rem] font-bold text-blue-600 dark:text-blue-400 mt-1">
                  = CLIENT
                </p>
              </div>
            </div>
          </div>

          {/* In production */}
          <div className="rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              In production (on Vercel&apos;s machines)
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              After you deploy, Vercel runs the Node.js process on{" "}
              <strong className="text-slate-800 dark:text-slate-200">their</strong> computers in
              their data centers. When a user&apos;s phone visits your URL, the request travels
              across the internet, hits a Vercel machine, your Server Component runs THERE, and
              only the finished HTML travels back to the phone. The phone never runs any of your
              server-side code.
            </p>
            <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2.5 text-center">
                <Cloud className="h-4 w-4 mx-auto text-slate-500 dark:text-slate-400 mb-1" aria-hidden />
                <p className="text-[0.65rem] font-semibold text-slate-700 dark:text-slate-300">
                  Vercel data center
                </p>
                <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 mt-0.5">
                  Node.js process
                </p>
                <p className="text-[0.65rem] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  = SERVER
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 mx-auto hidden sm:block" aria-hidden />
              <div className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 p-2.5 text-center">
                <Smartphone className="h-4 w-4 mx-auto text-slate-500 dark:text-slate-400 mb-1" aria-hidden />
                <p className="text-[0.65rem] font-semibold text-slate-700 dark:text-slate-300">
                  User&apos;s phone / laptop
                </p>
                <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 mt-0.5">
                  Browser reads HTML
                </p>
                <p className="text-[0.65rem] font-bold text-blue-600 dark:text-blue-400 mt-1">
                  = CLIENT
                </p>
              </div>
            </div>
          </div>

          <Callout tone="blue" icon={BarChart3} title="The key takeaway">
            &ldquo;Server&rdquo; doesn&apos;t mean &ldquo;a faraway computer&rdquo; specifically
            — it means <em>the Node.js process running your app, wherever that happens to be</em>.
            The same code runs on your laptop during development and on Vercel in production. The
            browser is always a separate program — even when it&apos;s on the same physical
            machine.
          </Callout>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Now the contrast makes sense.{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            By default, every file under <Code>app/</Code> is a Server Component
          </strong>{" "}
          — it runs in that Node.js process, has direct access to the database, and ships zero
          JavaScript to the browser for itself. Only when you add{" "}
          <Code>&ldquo;use client&rdquo;</Code> at the top does the file become a Client
          Component that runs in the browser.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-4">
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              ✓ Server Component (default)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                Can <Code>await</Code> a Prisma query directly
              </li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                Can read cookies and headers
              </li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                Ships HTML, not JS
              </li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                No useState, no useEffect, no event handlers
              </li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Examples in this project: <Code>app/(protected)/page.tsx</Code>,{" "}
              <Code>app/(protected)/docs/[slug]/page.tsx</Code>, the layouts.
            </p>
          </div>

          <div className="rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 p-4">
            <h4 className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">
              ⚙ Client Component (opt-in)
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                Needs <Code>&ldquo;use client&rdquo;</Code> directive at the top
              </li>
              <li className="pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                Can use hooks, state, event handlers
              </li>
              <li className="pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                Ships JS to the browser
              </li>
              <li className="pl-3 border-l-2 border-blue-300 dark:border-blue-700">
                Cannot directly query the database
              </li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Examples: <Code>DocViewer.tsx</Code> (toggles bookmarks),{" "}
              <Code>login/page.tsx</Code> (form state), <Code>ThemeToggle.tsx</Code>.
            </p>
          </div>
        </div>

        <Callout tone="amber" icon={Lightbulb} title="The pattern in this app" className="mt-4">
          Pages start as Server Components — they fetch data with Prisma, then pass it as props
          into a Client Component that handles the interactive bits. <Code>page.tsx</Code> queries
          the DB and renders <Code>&lt;DocViewer initialBookmarked=&#123;...&#125; /&gt;</Code>.
          DocViewer is <Code>&ldquo;use client&rdquo;</Code> and owns the bookmark toggle.
        </Callout>

        <Callout tone="emerald" icon={ShieldCheck} title="Why this matters for security" className="mt-4">
          Anything in a Server Component <strong className="text-slate-800 dark:text-slate-200">stays
          on the server</strong> — the browser never sees it. If you read{" "}
          <Code>process.env.DATABASE_URL</Code> or call <Code>prisma.user.findMany()</Code> inside
          a Server Component, both the password and the SQL query run inside the Node.js process.
          The browser only ever receives the rendered HTML. The same code in a Client Component
          would bundle the secret into a JavaScript file that ships to <em>every visitor&apos;s
          browser</em> — they could open DevTools and read it. Server Components prevent that
          leak by design.
        </Callout>
      </div>

      {/* Request flow */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          What happens when you visit <Code>/docs/dotnet-internals</Code>
        </h3>
        <ol className="space-y-3">
          {[
            {
              n: "1",
              title: "Browser sends a request",
              body: "GET https://your-app.vercel.app/docs/dotnet-internals. Cookies attached.",
              accent: "blue" as AccentKey,
            },
            {
              n: "2",
              title: "middleware.ts runs",
              body: "Checks if the path is public. /docs/* isn't — so it looks for the session cookie. If present, lets the request through. If not, redirects to /login?callbackUrl=/docs/dotnet-internals.",
              accent: "amber" as AccentKey,
            },
            {
              n: "3",
              title: "(protected)/layout.tsx runs on the server",
              body: "Calls auth.api.getSession() with the request headers. Fetches user's bookmarks. Renders the AppShell (sidebar + header) and passes children down.",
              accent: "violet" as AccentKey,
            },
            {
              n: "4",
              title: "docs/[slug]/page.tsx runs",
              body: "Looks up the doc by slug. Queries Prisma for the user's bookmark status, completion, and notes. All three queries fire in parallel via Promise.all.",
              accent: "rose" as AccentKey,
            },
            {
              n: "5",
              title: "DocViewer (client) hydrates",
              body: "The server-rendered HTML is already on screen, so the user can read it. Then React downloads its JS bundle and 'hydrates' — meaning it walks the existing HTML and attaches event handlers so the buttons become interactive. Hydration is React's word for 'wake up the static HTML and make it clickable.'",
              accent: "emerald" as AccentKey,
            },
            {
              n: "6",
              title: "recordDocVisit() server action fires",
              body: "useEffect in DocViewer calls a server action that upserts ReadingProgress and bumps the daily streak. Happens in the background — UI never blocks on it.",
              accent: "cyan" as AccentKey,
            },
          ].map((step) => {
            const a = accentMap[step.accent];
            return (
              <li key={step.n} className="flex gap-3">
                <span
                  className={cn(
                    "flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                    a.chipBg,
                    a.text
                  )}
                  aria-hidden
                >
                  {step.n}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className={cn("text-sm font-bold", a.text)}>{step.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ─── Tab 3: Data & Auth ─────────────────────────────────────────────────────

function DataTab() {
  return (
    <section id="panel-data" role="tabpanel" aria-labelledby="tab-data" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The database schema, how the auth flow works end-to-end, and the server-action pattern
        that keeps the client safe.
      </p>

      {/* Prisma vs Neon */}
      <div className="rounded-xl border-2 border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 p-5">
        <h3 className="text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-3 flex items-center gap-2">
          <Database className="h-4 w-4" aria-hidden /> Prisma vs Neon — two different things
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These names sound like alternatives but they aren&apos;t — they do completely different
          jobs and work <em>together</em>. Confusing them is the most common source of
          head-scratching when starting out.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 p-4">
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
              <Database className="h-4 w-4" aria-hidden /> Neon = the database itself
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              A <strong className="text-slate-800 dark:text-slate-200">PostgreSQL database</strong>{" "}
              hosted in the cloud. The actual rows of data — users, sessions, bookmarks, notes —
              physically live on Neon&apos;s servers in Frankfurt.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                It IS the storage — the source of truth
              </li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                Speaks SQL (the database query language)
              </li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                Survives if your app crashes
              </li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
                Swappable: AWS RDS or Supabase work too
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
              <Package className="h-4 w-4" aria-hidden /> Prisma = the tool to talk to the database
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              An <strong className="text-slate-800 dark:text-slate-200">npm library</strong> you
              install into your project. It translates between your TypeScript code and the
              database&apos;s SQL.
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mt-2">
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                It&apos;s code, not storage — lives in <Code>node_modules</Code>
              </li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                Generates a typed client from your schema
              </li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                Catches typos at compile time
              </li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                Swappable: Drizzle is an alternative
              </li>
            </ul>
          </div>
        </div>

        {/* Analogy */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
            Analogy
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-200">Neon is a warehouse</strong> —
            physical storage where goods sit on shelves.{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              Prisma is the warehouse-management software
            </strong>{" "}
            — what you use to track inventory, move things in and out, and find a specific item.
            You need both. You don&apos;t pick one OR the other.
          </p>
        </div>

        {/* Without vs with Prisma */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Without Prisma — raw SQL, no type safety
            </p>
            <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-amber-300">const r = await db.query(</div>
              <div className="text-amber-300 pl-4">
                &quot;SELECT * FROM bookmark WHERE user_id = $1&quot;,
              </div>
              <div className="text-amber-300 pl-4">[userId]</div>
              <div className="text-amber-300">);</div>
              <div className="text-slate-500">
                {"// r.rows[0]?.created_at — is that a Date or a string? Who knows."}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              With Prisma — typed TypeScript, auto-completed
            </p>
            <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-amber-300">
                const bookmark = await prisma.bookmark.findUnique(&#123;
              </div>
              <div className="text-amber-300 pl-4">
                where: &#123; userId_docSlug: &#123; userId, docSlug &#125; &#125;
              </div>
              <div className="text-amber-300">&#125;);</div>
              <div className="text-slate-500">
                {"// bookmark.createdAt — TypeScript KNOWS this is a Date"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schema */}
      <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5">
        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300 mb-3 flex items-center gap-2">
          <Database className="h-4 w-4" aria-hidden /> The Prisma schema
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tables fall into two groups: the four required by Better Auth, and the four owned by
          our app.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              Better Auth tables
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                <Code>user</Code> — id, email, name, emailVerified
              </li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                <Code>session</Code> — token, expiresAt, ipAddress
              </li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                <Code>account</Code> — password hash, OAuth tokens
              </li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">
                <Code>verification</Code> — email-verify and reset tokens
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 p-4">
            <h4 className="text-sm font-bold text-violet-700 dark:text-violet-400 mb-2">
              App tables
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="pl-3 border-l-2 border-violet-300 dark:border-violet-700">
                <Code>bookmark</Code> — user ↔ docSlug
              </li>
              <li className="pl-3 border-l-2 border-violet-300 dark:border-violet-700">
                <Code>reading_progress</Code> — last opened, completed, streak
              </li>
              <li className="pl-3 border-l-2 border-violet-300 dark:border-violet-700">
                <Code>note</Code> — markdown notes per doc
              </li>
              <li className="pl-3 border-l-2 border-violet-300 dark:border-violet-700">
                Streak fields on <Code>user</Code> (currentStreak, longestStreak)
              </li>
            </ul>
          </div>
        </div>

        <Callout tone="amber" icon={Lightbulb} title="The reason for @@unique([userId, docSlug])" className="mt-4">
          You can&apos;t bookmark the same doc twice. Instead of checking in code (which races),
          we tell the database directly via a composite unique index. The database refuses the
          duplicate at the storage layer. <Code>upsert</Code> in Prisma (short for
          &ldquo;update-or-insert&rdquo;) then becomes a safe one-shot &ldquo;create if missing,
          update if present&rdquo;.
        </Callout>
      </div>

      {/* How Prisma is wired in */}
      <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5">
        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300 mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" aria-hidden /> How Prisma is wired into the project
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prisma is just an <Code>npm</Code> package — but it has four moving parts that work
          together. Knowing where each one lives makes the rest of the data layer obvious.
        </p>

        <ol className="space-y-3">
          {/* 1. npm packages */}
          <li className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              <span className="opacity-60 mr-1">1.</span> Two npm packages in package.json
            </h4>
            <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-2">
              <div className="text-emerald-400">&quot;@prisma/client&quot;: &quot;^6.8.2&quot;</div>
              <div className="text-slate-500">
                {"// the runtime library — your app code imports from this"}
              </div>
              <div className="text-emerald-400 mt-2">&quot;prisma&quot;: &quot;^6.8.2&quot;</div>
              <div className="text-slate-500">
                {"// the CLI tool (devDependency, only used at dev time)"}
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Installed once with <Code>npm install</Code>. The runtime client is what your app
              uses; the CLI is what you run from the terminal to manage the schema.
            </p>
          </li>

          {/* 2. schema.prisma */}
          <li className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              <span className="opacity-60 mr-1">2.</span> The schema file — prisma/schema.prisma
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              The source of truth. You describe every table here using Prisma&apos;s simple DSL,
              and tell it which database to connect to via the <Code>DATABASE_URL</Code> env var.
            </p>
            <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-emerald-400">datasource db &#123;</div>
              <div className="text-slate-300 pl-4">provider = &quot;postgresql&quot;</div>
              <div className="text-slate-300 pl-4">url      = env(&quot;DATABASE_URL&quot;)</div>
              <div className="text-emerald-400">&#125;</div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 italic">
              That <Code>env(&quot;DATABASE_URL&quot;)</Code> is the bridge to Neon — it&apos;s
              just a connection string like{" "}
              <Code>postgresql://user:pass@ep-xxx.neon.tech/dbname</Code>.
            </p>
          </li>

          {/* 3. CLI commands */}
          <li className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              <span className="opacity-60 mr-1">3.</span> The CLI commands in package.json
            </h4>
            <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-2">
              <div className="text-amber-300">npm run db:push</div>
              <div className="text-slate-500 pl-4">
                {"// reads schema, creates/alters tables in Neon to match"}
              </div>
              <div className="text-amber-300 mt-2">npm run db:generate</div>
              <div className="text-slate-500 pl-4">
                {"// reads schema, builds typed client into node_modules"}
              </div>
              <div className="text-amber-300 mt-2">npm run db:studio</div>
              <div className="text-slate-500 pl-4">
                {"// opens a GUI in your browser to browse and edit data"}
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Change the schema → run <Code>db:push</Code> to sync the database, then{" "}
              <Code>db:generate</Code> to refresh the TypeScript types your code imports.
            </p>
          </li>

          {/* 4. singleton */}
          <li className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              <span className="opacity-60 mr-1">4.</span> The singleton client — lib/db.ts
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              One Prisma client, shared across the entire app. The <Code>globalThis</Code> trick
              is critical in development — without it, Next.js&apos;s hot-reload would create a
              new client every save and eventually exhaust Neon&apos;s connection pool.
            </p>
            <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-2">
              <div className="text-amber-300">
                import &#123; PrismaClient &#125; from &quot;@prisma/client&quot;;
              </div>
              <div className="text-slate-300">export const prisma =</div>
              <div className="text-slate-300 pl-4">
                globalForPrisma.prisma ?? new PrismaClient();
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Now you just <Code>import &#123; prisma &#125; from &quot;@/lib/db&quot;</Code>{" "}
              anywhere in the app — server actions, server components, route handlers — and the
              same connection is reused.
            </p>
          </li>
        </ol>

        <Callout tone="amber" icon={Lightbulb} title="If you copy nothing else from this codebase" className="mt-4">
          Copy <Code>lib/db.ts</Code>. The singleton pattern shows up in every serious Next.js +
          Prisma project. Skipping it works for ~10 minutes in dev, then your terminal fills with
          &ldquo;too many connections&rdquo; errors.
        </Callout>
      </div>

      {/* Auth flow */}
      <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5">
        <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" aria-hidden /> The Better Auth flow
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Better Auth is configured in <Code>lib/auth.ts</Code>. We tell it to use Prisma for
          storage, enable email/password, and wire two email callbacks: one for verification, one
          for password reset.
        </p>

        <ol className="space-y-3">
          {[
            {
              n: "1",
              title: "User signs up",
              body: "The client calls signUp.email() from auth-client. Better Auth hashes the password (using bcrypt — a one-way function so the plaintext can never be recovered from the database), creates a user + account row, and returns a session cookie.",
              icon: KeyRound,
              accent: "violet" as AccentKey,
            },
            {
              n: "2",
              title: "Verification email queued",
              body: "Better Auth calls our sendVerificationEmail callback in lib/email.ts. Resend ships an HTML email with a one-time URL containing a verification token.",
              icon: Mail,
              accent: "blue" as AccentKey,
            },
            {
              n: "3",
              title: "User clicks the link",
              body: "Link hits /verify-email?token=... which calls Better Auth's verify endpoint. The user.emailVerified flag flips to true.",
              icon: ArrowRight,
              accent: "emerald" as AccentKey,
            },
            {
              n: "4",
              title: "Session cookie travels on every request",
              body: "The browser includes the better-auth.session_token cookie automatically. Middleware checks for its presence; server components call auth.api.getSession() to load the full user object.",
              icon: Lock,
              accent: "rose" as AccentKey,
            },
            {
              n: "5",
              title: "Session expires or user logs out",
              body: "Sessions live 7 days, refresh if used in the last day. signOut() deletes the cookie AND the session row in the database, so it can't be replayed.",
              icon: Zap,
              accent: "amber" as AccentKey,
            },
          ].map((step) => {
            const a = accentMap[step.accent];
            const Icon = step.icon;
            return (
              <li key={step.n} className="flex gap-3">
                <span
                  className={cn(
                    "flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full",
                    a.chipBg,
                    a.text
                  )}
                  aria-hidden
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className={cn("text-sm font-bold", a.text)}>
                    <span className="opacity-60 mr-1">{step.n}.</span>
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <Callout tone="blue" icon={BarChart3} title="Two layers of protection" className="mt-4">
          The session cookie is checked twice. First by <Code>middleware.ts</Code> — a function
          that runs on every request before any page does (fast, just checks the cookie exists)
          so unauth users get redirected before any protected page even starts to render. Then
          by the layout&apos;s <Code>auth.api.getSession()</Code> call (a real DB lookup) so we
          have the actual user object. Defense in depth — even if middleware were misconfigured,
          the layout would still bail.
        </Callout>
      </div>

      {/* Server actions */}
      <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5">
        <h3 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2">
          <Code2 className="h-4 w-4" aria-hidden /> Server actions: the safer alternative to REST
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Look at <Code>app/actions/docs.ts</Code>. The file starts with{" "}
          <Code>&ldquo;use server&rdquo;</Code>. Every exported function from such a file becomes
          a <em>server action</em> — a function that <strong className="text-slate-800 dark:text-slate-200">runs
          on the server</strong> but can be called from a Client Component as if it were a local
          function. Next.js handles the network call for you behind the scenes (this pattern is
          called <em>RPC</em> — remote procedure call). No <Code>fetch()</Code>, no manual API
          endpoint, no JSON serialization in your code.
        </p>

        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-4 font-mono text-xs leading-relaxed overflow-x-auto mb-4">
          <div className="text-slate-500">{"// app/actions/docs.ts (server)"}</div>
          <div className="text-emerald-400">&ldquo;use server&rdquo;;</div>
          <div className="text-slate-300">export async function toggleBookmark(slug, add) &#123;</div>
          <div className="text-slate-300 pl-4">
            const userId = await getAuthenticatedUserId();
          </div>
          <div className="text-slate-300 pl-4">{"// ... Prisma call ..."}</div>
          <div className="text-slate-300">&#125;</div>
          <div className="text-slate-500 mt-3">{"// components/docs/DocViewer.tsx (client)"}</div>
          <div className="text-emerald-400">&ldquo;use client&rdquo;;</div>
          <div className="text-amber-300">import &#123; toggleBookmark &#125; from &quot;@/app/actions/docs&quot;;</div>
          <div className="text-slate-300">await toggleBookmark(slug, true);</div>
        </div>

        <Callout tone="blue" icon={BarChart3} title="Why this is safer than a REST endpoint">
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Every action re-checks the session — never trusts the client&apos;s claim of identity.</li>
            <li>Every action validates the slug against the registry before touching the DB.</li>
            <li>No public route to fuzz. The action is invoked by reference, not by URL guessing.</li>
            <li>Auto cache invalidation via <Code>revalidatePath()</Code> — the home page&apos;s bookmark counts update without a manual refetch.</li>
          </ul>
        </Callout>
      </div>

      {/* Env validation */}
      <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-5">
        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-3">
          Environment variables: validated, not hoped for
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          <Code>lib/env.ts</Code> defines a Zod schema for every server-side env var, then parses{" "}
          <Code>process.env</Code> against it at boot. Missing <Code>DATABASE_URL</Code>? The app
          throws a descriptive error on startup instead of crashing on the first query 30 seconds
          later. Throughout the app, we import <Code>&#123; env &#125;</Code> instead of reading{" "}
          <Code>process.env</Code> directly, so we always get typed values.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Public env vars (<Code>NEXT_PUBLIC_*</Code>) live separately in{" "}
          <Code>lib/public-env.ts</Code>. They&apos;re baked into the JS bundle at build time, so
          changing them requires a rebuild — a fact we&apos;ll come back to in the Deploy tab.
        </p>
      </div>

    </section>
  );
}

// ─── Tab 4: UI System ───────────────────────────────────────────────────────

function UiTab() {
  return (
    <section id="panel-ui" role="tabpanel" aria-labelledby="tab-ui" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        How the visual language stays consistent across 30+ components without a design system
        library.
      </p>

      {/* Tailwind v4 + dark mode */}
      <div className="rounded-xl border-2 border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 p-5">
        <h3 className="text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4" aria-hidden /> Tailwind v4 with data-attribute dark mode
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Tailwind v3 used a <Code>.dark</Code> class on <Code>&lt;html&gt;</Code> for dark mode.
          v4 lets us define custom variants. In <Code>app/globals.css</Code> we wrote:
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-3">
          <div className="text-emerald-400">@custom-variant dark (&amp;:where([data-theme=dark], [data-theme=dark] *));</div>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Now any class prefixed <Code>dark:</Code> activates when{" "}
          <Code>&lt;html data-theme=&quot;dark&quot;&gt;</Code>. Why an attribute instead of a
          class? Easier to inspect in DevTools, easier to set from inline scripts, and it
          composes with CSS attribute selectors for non-Tailwind styles like the toast theme.
        </p>
      </div>

      {/* Flash-free theme init */}
      <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-5">
        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" aria-hidden /> The flash-free theme trick
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          The theme lives in <Code>localStorage</Code> (managed by Zustand&apos;s persist
          middleware in <Code>stores/theme.ts</Code>). But there&apos;s a problem: when a dark-mode
          user reloads, the server has no idea what their preference is. It sends light-mode HTML
          by default. The page paints white, React hydrates, reads localStorage, applies dark mode
          — and the user sees a jarring white flash.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          The fix in <Code>app/layout.tsx</Code>: an inline <Code>&lt;script&gt;</Code> at the
          very top of <Code>&lt;body&gt;</Code> that runs <em>before</em> React hydrates. It reads
          localStorage and sets <Code>data-theme</Code> on <Code>&lt;html&gt;</Code>. By the time
          the browser paints the first pixel, the dark-mode classes are already active.
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-500">{"// Runs synchronously, blocks first paint"}</div>
          <div className="text-amber-300">const raw = localStorage.getItem(&apos;mastery-theme&apos;);</div>
          <div className="text-amber-300">const theme = raw ? JSON.parse(raw)?.state?.theme : null;</div>
          <div className="text-amber-300">document.documentElement.setAttribute(&apos;data-theme&apos;, theme || &apos;light&apos;);</div>
        </div>
        <Callout tone="amber" icon={Lightbulb} title="Why this is &ldquo;blocking&rdquo; on purpose" className="mt-4">
          Blocking scripts are usually bad — they delay paint. This one is intentional: we want
          paint delayed by ~2ms so it happens with the correct theme. A 2ms delay is invisible.
          A flash from white to dark is jarring.
        </Callout>
      </div>

      {/* Design system without a library */}
      <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5">
        <h3 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-3">
          The poor-man&apos;s design system
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Three pieces, no library:
        </p>
        <div className="space-y-3">
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 p-4">
            <h4 className="text-sm font-bold text-violet-700 dark:text-violet-400 mb-1">
              1. Design tokens in CSS
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <Code>globals.css</Code> defines colors and fonts as CSS variables inside Tailwind&apos;s{" "}
              <Code>@theme</Code> block. The brand purple <Code>#7c3aed</Code> only appears in
              one place; everywhere else uses <Code>var(--color-primary)</Code> or just{" "}
              <Code>violet-600</Code>.
            </p>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 p-4">
            <h4 className="text-sm font-bold text-violet-700 dark:text-violet-400 mb-1">
              2. accentMap object in every doc
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Each doc component defines an <Code>accentMap</Code> with six color keys (violet,
              rose, emerald, blue, amber, cyan). Each key maps to five Tailwind class strings
              (border, bg, text, ring, chipBg). The component then picks an accent by{" "}
              <em>semantic role</em> — &ldquo;rose for engines and hotspots, emerald for
              success.&rdquo; That keeps colors meaningful, not decorative.
            </p>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 p-4">
            <h4 className="text-sm font-bold text-violet-700 dark:text-violet-400 mb-1">
              3. DOC_STYLE_GUIDE.md
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A plain markdown file at <Code>src/docs/DOC_STYLE_GUIDE.md</Code> that codifies the
              rules: spacing scale, typography sizes, max-width discipline, when to use a chip vs
              a callout. Reads like a checklist. AI assistants and humans both consult it before
              writing a new doc.
            </p>
          </div>
        </div>
      </div>

      {/* cn helper */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          The <Code>cn()</Code> helper (3 lines, used everywhere)
        </h3>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-3">
          <div className="text-amber-300">import &#123; clsx &#125; from &quot;clsx&quot;;</div>
          <div className="text-amber-300">import &#123; twMerge &#125; from &quot;tailwind-merge&quot;;</div>
          <div className="text-slate-300">export const cn = (...inputs) =&gt; twMerge(clsx(inputs));</div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <Code>clsx</Code> handles conditional class strings (skips false/null). <Code>twMerge</Code>{" "}
          resolves Tailwind conflicts so the <em>last</em> class wins (e.g.{" "}
          <Code>cn(&quot;p-2&quot;, &quot;p-4&quot;)</Code> becomes <Code>p-4</Code>). Together
          they let us write{" "}
          <Code>cn(&quot;p-2&quot;, isActive &amp;&amp; &quot;bg-violet-500&quot;, customClass)</Code>{" "}
          without runtime surprises.
        </p>
      </div>

      {/* Accessibility */}
      <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5">
        <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
          Accessibility: built in, not bolted on
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
          Every interactive component meets these rules — they&apos;re in the style guide as a
          ship checklist:
        </p>
        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Visible focus rings on every button, link, tab (<Code>focus-visible:ring-2</Code>)
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Tabs implement <Code>role=&quot;tablist&quot;</Code> + arrow-key navigation
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Accordions use <Code>aria-expanded</Code> and <Code>aria-controls</Code>
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Decorative icons get <Code>aria-hidden</Code>; meaningful icons get text labels
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Color is never the only signal — pros/cons have ✓/⚠ glyphs alongside the green/red
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Semantic HTML: <Code>&lt;article&gt;</Code>, <Code>&lt;section&gt;</Code>,{" "}
            <Code>&lt;ol&gt;</Code>, <Code>&lt;h2&gt;</Code> hierarchy
          </li>
        </ul>
        <Callout tone="emerald" icon={Package} title="Why this matters even for a side project" className="mt-4">
          Keyboard-only navigation isn&apos;t a charity feature — it&apos;s how power users move.
          Once these rules are in place, the app feels professional. Skipping them now creates an
          accessibility-debt avalanche that&apos;s painful to fix later.
        </Callout>
      </div>
    </section>
  );
}

// ─── Tab 5: Deploy ──────────────────────────────────────────────────────────

function DeployTab() {
  return (
    <section id="panel-deploy" role="tabpanel" aria-labelledby="tab-deploy" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The deployment story — what worked first try, what broke, and the lessons from each
        stumble.
      </p>

      {/* Deploy steps */}
      <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5">
        <h3 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2">
          <Rocket className="h-4 w-4" aria-hidden /> The happy path
        </h3>
        <ol className="space-y-3">
          {[
            { n: "1", body: "Created a Neon Postgres database in the Frankfurt region (close to Vercel's default edge)." },
            { n: "2", body: "Wrote prisma/schema.prisma and ran prisma db push to create tables." },
            { n: "3", body: "Set up local .env.local with DATABASE_URL, BETTER_AUTH_SECRET, RESEND_API_KEY." },
            { n: "4", body: "Pushed the repo to GitHub." },
            { n: "5", body: "Imported the repo into Vercel. Auto-detected Next.js, accepted defaults." },
            { n: "6", body: "Added all 7 env vars in Vercel's Environment Variables panel before clicking Deploy." },
            { n: "7", body: "First deploy built and shipped." },
          ].map((step) => (
            <li key={step.n} className="flex gap-3">
              <span
                className="flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300"
                aria-hidden
              >
                {step.n}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* What broke */}
      <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5">
        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300 mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" aria-hidden /> What broke, and the lesson from each
        </h3>

        <div className="space-y-4">
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              Lesson 1 — ESLint blocks the build
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              First build failed because two <Code>{"//"}</Code> text strings inside JSX got flagged
              as comment-attempts by <Code>react/jsx-no-comment-textnodes</Code>. Three unused
              helper components (Note, H2, H3) also failed the unused-var rule.
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Lesson: </strong>
              Vercel runs <Code>next build</Code> which runs ESLint. Anything that prints a
              warning locally but doesn&apos;t error WILL error in production. Run{" "}
              <Code>npm run build</Code> locally before pushing.
            </p>
          </div>

          <div className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              Lesson 2 — Resend won&apos;t send to arbitrary emails
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              On free Resend, the testing sender <Code>onboarding@resend.dev</Code> only
              delivers to the email you signed up with. Signup to the app appeared to work but
              the verification email vanished.
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Lesson: </strong>
              For real users, verify a domain in Resend (add DNS records) and set{" "}
              <Code>RESEND_FROM_EMAIL</Code> to <Code>noreply@yourdomain.com</Code>. Until then,
              flip <Code>requireEmailVerification</Code> to <Code>false</Code> for testing.
            </p>
          </div>

          <div className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              Lesson 3 — CORS, deployment URLs, and BETTER_AUTH_URL
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              Vercel gives every deployment a unique preview URL like{" "}
              <Code>mastery-docs-igtgnqx0i-...vercel.app</Code> AND a stable production URL like{" "}
              <Code>mastery-docs.vercel.app</Code>. Better Auth&apos;s CORS only allows requests
              from the origin set in <Code>BETTER_AUTH_URL</Code>. Visiting via the preview URL
              while <Code>BETTER_AUTH_URL</Code> was the stable URL = CORS block.
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Lesson: </strong>
              Always navigate to your stable production URL. Preview URLs are for inspecting old
              builds — auth-using flows will fail on them by design.
            </p>
          </div>

          <div className="rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-4">
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              Lesson 4 — <Code>NEXT_PUBLIC_*</Code> is baked at build time
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              Any env var starting with <Code>NEXT_PUBLIC_</Code> gets embedded into the JS
              bundle at build time. Changing it in Vercel&apos;s panel does nothing until you
              redeploy.
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-800 dark:text-slate-200">Lesson: </strong>
              After changing any <Code>NEXT_PUBLIC_*</Code> var, trigger a new deploy. Server-side
              env vars (like <Code>DATABASE_URL</Code>) take effect on the next request — but
              public ones need a rebuild.
            </p>
          </div>
        </div>
      </div>

      {/* Security hygiene */}
      <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5">
        <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
          <Lock className="h-4 w-4" aria-hidden /> Security rules we never broke
        </h3>
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            <Code>.env</Code> and <Code>.env.local</Code> are in <Code>.gitignore</Code> from day
            one. Secrets never enter git history — once they&apos;re there, they&apos;re there
            forever, even after a rebase.
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Real secrets live only in Vercel&apos;s environment variables UI (encrypted at rest)
            and your local <Code>.env.local</Code> file.
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Git identity is configured per-repo, never <Code>--global</Code>. You don&apos;t want
            a side project to overwrite your work email on the machine.
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Pre-commit hooks are never skipped (<Code>--no-verify</Code> is forbidden). If a hook
            fails, fix the underlying issue.
          </li>
          <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
            Force-push to main is forbidden. Force-push to a feature branch only after explicit
            confirmation.
          </li>
        </ul>
      </div>

      {/* What's next */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-500" aria-hidden /> If you wanted to take this further
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          <li className="pl-3 border-l-2 border-slate-300 dark:border-slate-600">
            Add a custom domain in Vercel and verify it in Resend so verification emails ship
            from <Code>noreply@yourdomain.com</Code>.
          </li>
          <li className="pl-3 border-l-2 border-slate-300 dark:border-slate-600">
            Add OAuth providers (Google, GitHub) — Better Auth supports both with ~5 lines of
            config each.
          </li>
          <li className="pl-3 border-l-2 border-slate-300 dark:border-slate-600">
            Move from <Code>prisma db push</Code> to <Code>prisma migrate</Code> for versioned
            schema changes once the schema stabilizes.
          </li>
          <li className="pl-3 border-l-2 border-slate-300 dark:border-slate-600">
            Add Sentry or PostHog for production error tracking and product analytics.
          </li>
          <li className="pl-3 border-l-2 border-slate-300 dark:border-slate-600">
            Wire up Vitest tests for server actions — the boundary where business logic lives.
          </li>
        </ul>
      </div>

      <Callout tone="emerald" icon={Package} title="The final mental model">
        Next.js App Router + server components shift the default from &ldquo;everything in the
        browser&rdquo; back to &ldquo;render on the server, hydrate the interactive bits.&rdquo;
        Better Auth + Prisma + server actions give you a typed RPC layer with no boilerplate.
        Tailwind v4 gives you a styling system without a CSS file per component. Put them
        together and a full-stack app fits in one repo, one mental model, one deploy. That&apos;s
        what this project is — a working reference for that stack.
      </Callout>
    </section>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
      {children}
    </code>
  );
}

function Callout({
  tone,
  icon: Icon,
  title,
  children,
  className,
}: {
  tone: "amber" | "emerald" | "blue";
  icon: typeof Lightbulb;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    amber: {
      wrap: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60",
      icon: "text-amber-600 dark:text-amber-400",
      title: "text-amber-900 dark:text-amber-200",
    },
    emerald: {
      wrap: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60",
      icon: "text-emerald-600 dark:text-emerald-400",
      title: "text-emerald-900 dark:text-emerald-200",
    },
    blue: {
      wrap: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60",
      icon: "text-blue-600 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-200",
    },
  };
  const t = tones[tone];
  return (
    <div className={cn("rounded-lg border p-4 flex gap-3", t.wrap, className)}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", t.icon)} aria-hidden />
      <div className="min-w-0">
        {title && <p className={cn("text-sm font-bold mb-1", t.title)}>{title}</p>}
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
