"use client";

import { useState } from "react";
import {
  ChevronDown,
  Layers,
  Cpu,
  Database,
  Server,
  Rocket,
  Lightbulb,
  AlertTriangle,
  BarChart3,
  Zap,
  Boxes,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Code2,
  GitBranch,
  Sparkles,
  Gauge,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Accent system ─────────────────────────────────────────────────────────────

const ACCENT = {
  violet: {
    badge: "bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300",
    tab: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300",
    calloutBorder: "border-l-violet-400",
    calloutBg: "bg-violet-50 dark:bg-violet-950/40",
    calloutLabel: "text-violet-700 dark:text-violet-400",
  },
  blue: {
    badge: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
    tab: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
    calloutBorder: "border-l-blue-400",
    calloutBg: "bg-blue-50 dark:bg-blue-950/40",
    calloutLabel: "text-blue-700 dark:text-blue-400",
  },
  emerald: {
    badge: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
    tab: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
    calloutBorder: "border-l-emerald-400",
    calloutBg: "bg-emerald-50 dark:bg-emerald-950/40",
    calloutLabel: "text-emerald-700 dark:text-emerald-400",
  },
  amber: {
    badge: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
    tab: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
    calloutBorder: "border-l-amber-400",
    calloutBg: "bg-amber-50 dark:bg-amber-950/40",
    calloutLabel: "text-amber-700 dark:text-amber-400",
  },
  cyan: {
    badge: "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300",
    tab: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300",
    calloutBorder: "border-l-cyan-400",
    calloutBg: "bg-cyan-50 dark:bg-cyan-950/40",
    calloutLabel: "text-cyan-700 dark:text-cyan-400",
  },
  rose: {
    badge: "bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300",
    tab: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300",
    calloutBorder: "border-l-rose-400",
    calloutBg: "bg-rose-50 dark:bg-rose-950/40",
    calloutLabel: "text-rose-700 dark:text-rose-400",
  },
} as const;

type AccentKey = keyof typeof ACCENT;

// ─── Shared helpers ────────────────────────────────────────────────────────────

function IC({ children }: { children: string }) {
  return (
    <code className="font-mono text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const lines = code.split("\n");
  return (
    <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 my-4 overflow-x-auto">
      {label && (
        <div className="px-4 pt-3 pb-1.5 text-xs text-slate-500 font-mono border-b border-slate-700">{label}</div>
      )}
      <pre className="p-4 text-xs font-mono leading-relaxed">
        {lines.map((line, i) => (
          <span
            key={i}
            className={cn(
              "block",
              line.trimStart().startsWith("//") || line.trimStart().startsWith("#")
                ? "text-slate-500"
                : "text-slate-200"
            )}
          >
            {line || " "}
          </span>
        ))}
      </pre>
    </div>
  );
}


function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc list-outside ml-5 space-y-1.5 mb-3">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</li>
      ))}
    </ul>
  );
}

function OL({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-3">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item}</li>
      ))}
    </ol>
  );
}

function Pitfalls({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-5 my-6">
      <div className="flex items-center gap-2 mb-3">
        <span>⚠️</span>
        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">Pitfalls &amp; Production Lessons</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-rose-800 dark:text-rose-300">
            <span className="shrink-0 text-rose-400 dark:text-rose-600 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StressTest({ questions }: { questions: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden my-6">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
      >
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">🧠 Stress test yourself</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <ol className="px-5 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
          {questions.map((q, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 text-xs font-bold text-slate-400 dark:text-slate-500 w-4 mt-0.5">{i + 1}.</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{q}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Samples({ dir, files }: { dir: string; files: string[] }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 my-6">
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Code Samples</p>
      <p className="font-mono text-xs text-violet-700 dark:text-violet-400 mb-3">{dir}</p>
      <ul className="space-y-1.5">
        {files.map((f, i) => (
          <li key={i} className="flex items-start gap-2 font-mono text-xs text-slate-600 dark:text-slate-400">
            <span className="text-slate-300 dark:text-slate-600 shrink-0">·</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Day 1 — Enhanced UI helpers (scoped to Day 1) ────────────────────────────

const TONE = {
  violet: {
    border: "border-violet-300 dark:border-violet-700",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-300",
    softBg: "bg-violet-100 dark:bg-violet-900/50",
    ring: "ring-violet-400",
    accentLine: "bg-violet-500 dark:bg-violet-400",
  },
  emerald: {
    border: "border-emerald-300 dark:border-emerald-700",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    softBg: "bg-emerald-100 dark:bg-emerald-900/50",
    ring: "ring-emerald-400",
    accentLine: "bg-emerald-500 dark:bg-emerald-400",
  },
  amber: {
    border: "border-amber-300 dark:border-amber-700",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    softBg: "bg-amber-100 dark:bg-amber-900/50",
    ring: "ring-amber-400",
    accentLine: "bg-amber-500 dark:bg-amber-400",
  },
  rose: {
    border: "border-rose-300 dark:border-rose-700",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    softBg: "bg-rose-100 dark:bg-rose-900/50",
    ring: "ring-rose-400",
    accentLine: "bg-rose-500 dark:bg-rose-400",
  },
  blue: {
    border: "border-blue-300 dark:border-blue-700",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    softBg: "bg-blue-100 dark:bg-blue-900/50",
    ring: "ring-blue-400",
    accentLine: "bg-blue-500 dark:bg-blue-400",
  },
  cyan: {
    border: "border-cyan-300 dark:border-cyan-700",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-300",
    softBg: "bg-cyan-100 dark:bg-cyan-900/50",
    ring: "ring-cyan-400",
    accentLine: "bg-cyan-500 dark:bg-cyan-400",
  },
} as const;
type ToneKey = keyof typeof TONE;

function Section({
  num,
  title,
  kicker,
  icon: Icon,
  accent,
  children,
}: {
  num: string;
  title: string;
  kicker?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: ToneKey;
  children: React.ReactNode;
}) {
  const t = TONE[accent];
  return (
    <section className="mt-10 first:mt-6">
      <div className="flex items-start gap-4 mb-5">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2",
            t.border,
            t.bg,
            t.text
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className={cn("text-xs font-semibold uppercase tracking-[0.18em] mb-1", t.text)}>
            Section {num}{kicker ? ` · ${kicker}` : ""}
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
            {title}
          </h2>
        </div>
      </div>
      <div className="pl-0 sm:pl-[60px]">{children}</div>
    </section>
  );
}

function Callout({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: ToneKey;
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
  children: React.ReactNode;
}) {
  const t = TONE[tone];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4 my-4", t.border, t.bg)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", t.text)} aria-hidden />
      <div className="min-w-0">
        {title && <p className={cn("text-sm font-bold mb-1", t.text)}>{title}</p>}
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Chip({ tone, children }: { tone: ToneKey; children: React.ReactNode }) {
  const t = TONE[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border", t.border, t.softBg, t.text)}>
      {children}
    </span>
  );
}

function LayerStack({
  layers,
}: {
  layers: { name: string; tone: ToneKey; icon: React.ComponentType<{ className?: string }>; sub: string; body: React.ReactNode }[];
}) {
  return (
    <ol className="space-y-2 my-4">
      {layers.map((l, i) => {
        const t = TONE[l.tone];
        const Icon = l.icon;
        return (
          <li
            key={l.name}
            className={cn(
              "flex items-stretch rounded-xl border bg-white dark:bg-slate-900 overflow-hidden",
              t.border
            )}
          >
            <div className={cn("flex shrink-0 items-center justify-center w-12 sm:w-14", t.bg)}>
              <span className={cn("text-xs font-bold", t.text)}>{i + 1}</span>
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("h-4 w-4", t.text)} aria-hidden />
                <h4 className={cn("text-sm font-bold", t.text)}>{l.name}</h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{l.sub}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{l.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function CompareCard({
  title,
  tone,
  icon: Icon,
  badge,
  rows,
}: {
  title: string;
  tone: ToneKey;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  rows: { label: string; value: React.ReactNode }[];
}) {
  const t = TONE[tone];
  return (
    <div className={cn("rounded-xl border-2 bg-white dark:bg-slate-900 p-4", t.border)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", t.text)} aria-hidden />
          <h4 className={cn("text-sm font-bold", t.text)}>{title}</h4>
        </div>
        {badge && <Chip tone={tone}>{badge}</Chip>}
      </div>
      <dl className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{r.label}</dt>
            <dd className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ProsConsGrid({ pros, cons }: { pros: React.ReactNode[]; cons: React.ReactNode[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3 my-4">
      <div className={cn("rounded-xl border p-4", TONE.emerald.border, TONE.emerald.bg)}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <CheckCircle2 className={cn("h-4 w-4", TONE.emerald.text)} aria-hidden />
          <h4 className={cn("text-sm font-bold", TONE.emerald.text)}>Pros</h4>
        </div>
        <ul className="space-y-1.5">
          {pros.map((p, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-300 dark:border-emerald-700 leading-relaxed">
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <XCircle className={cn("h-4 w-4", TONE.rose.text)} aria-hidden />
          <h4 className={cn("text-sm font-bold", TONE.rose.text)}>Cons</h4>
        </div>
        <ul className="space-y-1.5">
          {cons.map((c, i) => (
            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-rose-300 dark:border-rose-700 leading-relaxed">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SubHeading({ children, accent }: { children: React.ReactNode; accent: ToneKey }) {
  const t = TONE[accent];
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2">
      <span className={cn("inline-block h-3.5 w-1 rounded-full", t.accentLine)} aria-hidden />
      {children}
    </h3>
  );
}

function GenLadder() {
  const gens = [
    { name: "Gen 0", tone: "emerald" as ToneKey, sub: "fresh", body: "Where every new allocation starts. Collections here are cheap and frequent." },
    { name: "Gen 1", tone: "amber" as ToneKey, sub: "survivor", body: "Objects that survived one Gen 0 collection. Buffer between fresh and long-lived." },
    { name: "Gen 2", tone: "rose" as ToneKey, sub: "long-lived", body: "Old objects. Full collection walks the whole reachable graph — expensive." },
  ];
  return (
    <div className="my-4 space-y-2">
      {gens.map((g, i) => {
        const t = TONE[g.tone];
        return (
          <div key={g.name} className={cn("flex items-center gap-3 rounded-lg border p-3", t.border, t.bg)}>
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold", t.softBg, t.text)}>{i}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className={cn("text-sm font-bold", t.text)}>{g.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 italic">{g.sub}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{g.body}</p>
            </div>
          </div>
        );
      })}
      <div className="grid sm:grid-cols-2 gap-2 pt-1">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">LOH · Large Object Heap</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">Objects ≥ 85,000 bytes. Rarely compacted.</p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-0.5">POH · Pinned Object Heap</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">.NET 5+. Pinned interop buffers, kept out of regular heap.</p>
        </div>
      </div>
    </div>
  );
}

function VersionRow({
  version,
  dotnet,
  tone,
  features,
}: {
  version: string;
  dotnet: string;
  tone: ToneKey;
  features: React.ReactNode[];
}) {
  const t = TONE[tone];
  return (
    <div className="flex gap-4 py-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <div className="w-24 sm:w-32 shrink-0">
        <div className={cn("inline-flex flex-col rounded-lg border px-3 py-2", t.border, t.bg)}>
          <span className={cn("text-xs font-bold", t.text)}>{version}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{dotnet}</span>
        </div>
      </div>
      <ul className="flex-1 space-y-1.5 pt-1">
        {features.map((f, i) => (
          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex gap-2">
            <span className={cn("shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full", t.accentLine)} aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TableOfContents({ items, accent }: { items: { num: string; title: string }[]; accent: ToneKey }) {
  const t = TONE[accent];
  return (
    <nav aria-label="Section contents" className="my-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">In this day</p>
      <ol className="space-y-1.5">
        {items.map((s) => (
          <li key={s.num} className="flex items-baseline gap-2 text-sm">
            <span className={cn("font-mono text-xs font-bold shrink-0", t.text)}>{s.num}</span>
            <span className="text-slate-700 dark:text-slate-300">{s.title}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Day 1 — Runtime & Language Internals ─────────────────────────────────────

function Day1() {
  const accent: ToneKey = "violet";
  return (
    <div>
      {/* Lead-in card */}
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.violet.border, TONE.violet.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.violet.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.violet.text)}>
              Why this day matters
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              The biggest gap most &quot;senior .NET&quot; devs have is not knowing what happens between <IC>dotnet run</IC> and code executing. Fixing that makes everything else easier — perf, async bugs, GC pressure, AOT.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "1.1", title: "The .NET stack, top to bottom" },
          { num: "1.2", title: "JIT, tiered compilation, R2R, and AOT" },
          { num: "1.3", title: "Memory & the garbage collector" },
          { num: "1.4", title: "Async/await — the mental model" },
          { num: "1.5", title: "Modern C# features (10 → 14)" },
          { num: "1.6", title: "Source generators" },
        ]}
      />

      {/* ── 1.1 ──────────────────────────────────────────────────────────── */}
      <Section num="1.1" kicker="Architecture" title="The .NET stack, top to bottom" icon={Layers} accent="violet">
        <P>When you ship a .NET app, four layers cooperate. The host calls into the runtime, the runtime loads your code, the BCL gives you the types to write against.</P>

        <LayerStack
          layers={[
            {
              name: "Host",
              tone: "violet",
              icon: Rocket,
              sub: "dotnet · apphost",
              body: <>The process that starts the CLR and hands it your <IC>Main</IC>.</>,
            },
            {
              name: "BCL / Runtime libraries",
              tone: "blue",
              icon: Boxes,
              sub: "System.*",
              body: <><IC>string</IC>, <IC>{"List<T>"}</IC>, <IC>Task</IC>, <IC>{"Span<T>"}</IC>, <IC>HttpClient</IC>. Implemented partly in C#, partly in C++ inside the runtime.</>,
            },
            {
              name: "CoreCLR",
              tone: "rose",
              icon: Cpu,
              sub: "the runtime",
              body: <>Loads assemblies, JIT-compiles IL to native code, runs the GC, manages threads, exceptions, P/Invoke, and security.</>,
            },
            {
              name: "Your IL",
              tone: "emerald",
              icon: Code2,
              sub: ".dll · CIL bytecode",
              body: <>Your C#/F#/VB compiled to platform-agnostic <strong>Intermediate Language</strong> bytecode and metadata, packaged in a managed assembly.</>,
            },
          ]}
        />

        <P>For ASP.NET Core, <strong className="text-slate-800 dark:text-slate-200">Kestrel + the Generic Host</strong> sit on top of this — but it&apos;s still just managed code running on CoreCLR.</P>

        <Callout tone="violet" icon={Lightbulb} title="Key insight">
          The <em>language</em> (C#) and the <em>runtime</em> (CLR) are independent. C# 12 features compile to IL that the .NET 6 runtime can run <em>if</em> they don&apos;t depend on new runtime features (e.g., <IC>static abstract</IC> interface members <em>do</em> require a new runtime).
        </Callout>
      </Section>

      {/* ── 1.2 ──────────────────────────────────────────────────────────── */}
      <Section num="1.2" kicker="Compilation" title="The JIT, tiered compilation, R2R, and AOT" icon={Zap} accent="violet">
        <SubHeading accent={accent}>JIT (just-in-time)</SubHeading>
        <P>When a method is first called, the CLR&apos;s JIT compiles its IL to native machine code, caches it, and from then on the native version runs. Compilation is <strong className="text-slate-800 dark:text-slate-200">per-method, lazy, and per-process</strong>.</P>

        <SubHeading accent={accent}>Tiered compilation (default since 3.0)</SubHeading>
        <P>Methods first get a <Chip tone="amber">Tier 0</Chip> compile — fast, unoptimized. Hot methods get re-compiled at <Chip tone="emerald">Tier 1</Chip> with full optimizations. Fast startup <em>and</em> good steady-state performance.</P>
        <Callout tone="blue" icon={BarChart3}>
          Set <IC>DOTNET_TieredCompilation=0</IC> to disable tiering when benchmarking — useful for isolating warm-up effects from steady-state.
        </Callout>

        <SubHeading accent={accent}>Three publish modes, compared</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard
            title="JIT (default)"
            tone="amber"
            icon={Gauge}
            badge="dev default"
            rows={[
              { label: "Startup", value: "Slowest — every hot method warms up" },
              { label: "Steady state", value: "Excellent (Tier 1 + PGO)" },
              { label: "Best for", value: "Local dev, long-lived servers" },
            ]}
          />
          <CompareCard
            title="ReadyToRun (R2R)"
            tone="blue"
            icon={Rocket}
            badge="prod default"
            rows={[
              { label: "Startup", value: <>Fast — pre-JIT&apos;d at publish</> },
              { label: "Steady state", value: "Excellent (re-JITs to Tier 1)" },
              { label: "Best for", value: "Production ASP.NET images" },
            ]}
          />
          <CompareCard
            title="Native AOT"
            tone="emerald"
            icon={Zap}
            badge=".NET 7+"
            rows={[
              { label: "Startup", value: "Tiny (~10 ms)" },
              { label: "Steady state", value: "Good — no JIT can&apos;t re-optimize" },
              { label: "Best for", value: "CLIs, serverless, gRPC, sidecars" },
            ]}
          />
        </div>
        <P>You enable R2R with <IC>{"<PublishReadyToRun>true</PublishReadyToRun>"}</IC>. Most production ASP.NET images should have it on.</P>

        <SubHeading accent={accent}>Native AOT trade-offs</SubHeading>
        <ProsConsGrid
          pros={[
            <>Tiny startup (~10 ms) and small memory footprint.</>,
            <>Single native binary — no runtime install needed.</>,
            <>No JIT spikes — flat, predictable latency.</>,
          ]}
          cons={[
            <>No runtime code generation. Reflection-heavy code breaks.</>,
            <>Some serializers, Castle DynamicProxy, EF Core lazy-loading proxies — all break or need source generators.</>,
            <>Not yet ideal for big EF Core / MVC apps (improving each release).</>,
          ]}
        />

        <SubHeading accent={accent}>Dynamic PGO — free perf</SubHeading>
        <Callout tone="emerald" icon={Sparkles} title="Enabled by default in .NET 8+">
          The JIT collects runtime stats during Tier 0 (which types flow through, which branches are hot) and uses them at Tier 1 to devirtualize calls and inline aggressively. Just upgrade — no code changes.
        </Callout>
      </Section>

      {/* ── 1.3 ──────────────────────────────────────────────────────────── */}
      <Section num="1.3" kicker="Memory" title="Memory & the garbage collector" icon={Database} accent="violet">
        <SubHeading accent={accent}>Stack vs heap — more nuanced than you think</SubHeading>
        <ul className="space-y-2 my-3">
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="emerald">value</Chip>
            <span>Can live on the stack, in a register, <em>or</em> inline inside a reference type on the heap.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="rose">ref</Chip>
            <span>Always lives on the GC heap; only the <em>reference</em> sits on the stack/in a register.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="amber">boxed</Chip>
            <span>A struct boxed via <IC>{"object o = myStruct;"}</IC> lives on the heap.</span>
          </li>
        </ul>
        <Callout tone="amber" icon={AlertTriangle}>
          So &quot;structs are on the stack&quot; is wrong in general — it depends on context.
        </Callout>

        <SubHeading accent={accent}>Generational GC</SubHeading>
        <P>The GC has 3 generations plus LOH and POH. Goal: <strong className="text-slate-800 dark:text-slate-200">keep allocations short-lived so they die in Gen 0</strong>.</P>
        <GenLadder />

        <SubHeading accent={accent}>Workstation vs Server GC</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="Workstation GC"
            tone="blue"
            icon={Cpu}
            badge="client default"
            rows={[
              { label: "Heaps", value: "One heap, one GC thread" },
              { label: "Latency", value: "Low pause times" },
              { label: "Best for", value: "Client apps, low-core machines, tools" },
            ]}
          />
          <CompareCard
            title="Server GC"
            tone="rose"
            icon={Server}
            badge="ASP.NET default"
            rows={[
              { label: "Heaps", value: "One heap per core, parallel GC threads" },
              { label: "Latency", value: "Higher throughput, more memory" },
              { label: "Best for", value: <>Hosted servers. <IC>{"<ServerGarbageCollection>true</ServerGarbageCollection>"}</IC></> },
            ]}
          />
        </div>

        <SubHeading accent={accent}>Allocation pitfalls you&apos;ve probably hit</SubHeading>
        <UL items={[
          <>LINQ chains in hot paths allocate enumerators and closures.</>,
          <><IC>string.Format</IC> and <IC>+</IC> allocate; interpolated strings since C# 10 use <IC>DefaultInterpolatedStringHandler</IC> and can avoid allocations in some sinks (like <IC>ILogger</IC>).</>,
          <><IC>async</IC> methods over a <IC>{"Task<T>"}</IC> allocate a state machine <em>on the heap</em> if they ever suspend. Use <IC>{"ValueTask<T>"}</IC> only when most calls complete synchronously.</>,
          <>Capturing <IC>this</IC> or locals in a lambda allocates a closure object.</>,
          <><IC>Enumerable.ToList()</IC> inside loops.</>,
        ]} />

        <SubHeading accent={accent}>{"Span<T>"} and {"Memory<T>"}</SubHeading>
        <P><IC>{"Span<T>"}</IC> is a <IC>ref struct</IC> representing a contiguous region of memory — heap, stack, or unmanaged. It lets you slice arrays/strings <strong className="text-slate-800 dark:text-slate-200">without allocating</strong>.</P>
        <CodeBlock label="// zero-allocation slicing" code={`ReadOnlySpan<char> s = "hello world";
var word = s[6..]; // "world", no allocation`} />
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="Span<T>"
            tone="emerald"
            icon={Zap}
            badge="stack-only"
            rows={[
              { label: "Type", value: <><IC>ref struct</IC> — compiler-enforced stack-only</> },
              { label: "Allocation", value: "Zero" },
              { label: "Limits", value: <>Can&apos;t be a class field, can&apos;t cross <IC>await</IC>, no boxing.</> },
            ]}
          />
          <CompareCard
            title="Memory<T>"
            tone="blue"
            icon={Boxes}
            badge="heap-friendly"
            rows={[
              { label: "Type", value: "Regular struct" },
              { label: "Allocation", value: "Small wrapper, but no element copy" },
              { label: "Limits", value: <>Use when you need to carry a buffer across <IC>await</IC>.</> },
            ]}
          />
        </div>
      </Section>

      {/* ── 1.4 ──────────────────────────────────────────────────────────── */}
      <Section num="1.4" kicker="Concurrency" title="Async/await — the mental model that fixes 80% of async bugs" icon={Workflow} accent="violet">
        <P><IC>async</IC>/<IC>await</IC> is <strong className="text-slate-800 dark:text-slate-200">not</strong> a thread-switching keyword. It&apos;s a <strong className="text-slate-800 dark:text-slate-200">state machine</strong> the compiler builds for you. When the compiler sees:</P>
        <CodeBlock label="// what you write" code={`public async Task<int> GetAsync()
{
    var data = await _http.GetStringAsync(url);
    return data.Length;
}`} />
        <P>It generates a struct/class implementing a state machine. The method body becomes a <IC>MoveNext</IC> with a switch over states. When an <IC>await</IC> hits an incomplete task, <IC>MoveNext</IC> returns; the awaited task&apos;s continuation is registered to call <IC>MoveNext</IC> again when ready.</P>

        <SubHeading accent={accent}>Three things to internalize</SubHeading>

        <div className="space-y-3 my-4">
          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={cn("font-mono text-xs font-bold px-2 py-0.5 rounded", TONE.rose.softBg, TONE.rose.text)}>1</span>
              <h4 className={cn("text-sm font-bold", TONE.rose.text)}><IC>async void</IC> is dangerous</h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Exceptions thrown in <IC>async void</IC> escape on the captured <IC>SynchronizationContext</IC> and can crash the process. Use only for event handlers.
            </p>
          </div>

          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={cn("font-mono text-xs font-bold px-2 py-0.5 rounded", TONE.amber.softBg, TONE.amber.text)}>2</span>
              <h4 className={cn("text-sm font-bold", TONE.amber.text)}>The <IC>SynchronizationContext</IC> decides who resumes you</h4>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <li className="pl-3 border-l-2 border-amber-300 dark:border-amber-700">
                <strong className="text-slate-800 dark:text-slate-200">ASP.NET Core:</strong> no sync context. Continuations resume on the thread-pool. So <IC>ConfigureAwait(false)</IC> is <em>meaningless</em> in controller/service code.
              </li>
              <li className="pl-3 border-l-2 border-amber-300 dark:border-amber-700">
                <strong className="text-slate-800 dark:text-slate-200">WPF / WinForms:</strong> there is one (the UI thread). Library code should use <IC>ConfigureAwait(false)</IC> to avoid forcing UI thread.
              </li>
            </ul>
          </div>

          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <div className="flex items-baseline gap-2 mb-2">
              <span className={cn("font-mono text-xs font-bold px-2 py-0.5 rounded", TONE.rose.softBg, TONE.rose.text)}>3</span>
              <h4 className={cn("text-sm font-bold", TONE.rose.text)}>Sync-over-async deadlocks</h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <IC>task.Result</IC> / <IC>task.Wait()</IC> in a UI app deadlocks because the continuation needs the UI thread that&apos;s blocked waiting. In ASP.NET Core it usually doesn&apos;t deadlock but ties up a thread-pool thread. <strong className="text-slate-800 dark:text-slate-200">Don&apos;t do it.</strong>
            </p>
          </div>
        </div>

        <SubHeading accent={accent}>Task vs {"ValueTask<T>"}</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="Task<T>"
            tone="blue"
            icon={Boxes}
            badge="class"
            rows={[
              { label: "Allocation", value: "Heap allocation on every async method that suspends" },
              { label: "Use", value: "Default. Reach for this 95% of the time." },
            ]}
          />
          <CompareCard
            title="ValueTask<T>"
            tone="emerald"
            icon={Zap}
            badge="struct"
            rows={[
              { label: "Allocation", value: <>Avoids the alloc when result is already available (cache hits, channels).</> },
              { label: "Use", value: <>Only when frequently synchronous. <strong>Never await twice.</strong></> },
            ]}
          />
        </div>

        <SubHeading accent={accent}>Cancellation</SubHeading>
        <P><IC>CancellationToken</IC> is the standard cooperative cancellation mechanism. Pass it through every async call.</P>
        <Callout tone="blue" icon={Lightbulb}>
          In ASP.NET Core, <IC>HttpContext.RequestAborted</IC> cancels when the client disconnects. Wire it into your downstream calls and DB queries to stop wasted work.
        </Callout>
      </Section>

      {/* ── 1.5 ──────────────────────────────────────────────────────────── */}
      <Section num="1.5" kicker="Language" title="Modern C# features you should be fluent in" icon={GitBranch} accent="violet">
        <P>Each C# version ships alongside a .NET version. A timeline view:</P>
        <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4">
          <VersionRow
            version="C# 10"
            dotnet=".NET 6"
            tone="violet"
            features={[
              <>File-scoped namespaces.</>,
              <>Global usings (<IC>{"global using System.Linq;"}</IC> once, used everywhere).</>,
              <>Record structs (<IC>{"public record struct Point(int X, int Y);"}</IC>).</>,
              <>Improved interpolated string handlers (skip allocations when log level is filtered out).</>,
            ]}
          />
          <VersionRow
            version="C# 11"
            dotnet=".NET 7"
            tone="blue"
            features={[
              <><IC>required</IC> members.</>,
              <>Raw string literals (<IC>{'"""..."""'}</IC>).</>,
              <>Generic math — <IC>static abstract</IC> interface members (runtime feature).</>,
              <>List patterns (<IC>{"is [1, 2, .., 5]"}</IC>).</>,
            ]}
          />
          <VersionRow
            version="C# 12"
            dotnet=".NET 8"
            tone="emerald"
            features={[
              <><strong className="text-slate-800 dark:text-slate-200">Primary constructors on classes</strong> (not just records).</>,
              <>Collection expressions (<IC>{"int[] x = [1, 2, 3];"}</IC>).</>,
              <>Type aliases for any type (<IC>{"using Point = (int X, int Y);"}</IC>).</>,
              <><IC>ref readonly</IC> parameters.</>,
            ]}
          />
          <VersionRow
            version="C# 13"
            dotnet=".NET 9"
            tone="amber"
            features={[
              <><IC>params</IC> collections — not just arrays (<IC>{"params ReadOnlySpan<int>"}</IC>).</>,
              <>New <IC>lock</IC> type (faster, contention-aware).</>,
              <>Implicit indexer access in object initializers.</>,
            ]}
          />
          <VersionRow
            version="C# 14"
            dotnet=".NET 10"
            tone="rose"
            features={[
              <>Field-backed properties (<IC>field</IC> keyword).</>,
              <>Extension members (extension properties + static extensions).</>,
              <>Null-conditional assignment.</>,
            ]}
          />
        </div>

        <SubHeading accent={accent}>Nullable reference types (NRT) — actually use them</SubHeading>
        <P>Turn on <IC>{"<Nullable>enable</Nullable>"}</IC> project-wide. NRT is a <em>compiler</em> feature — at runtime, all reference types are still nullable. The compiler tracks flow and tells you where null checks are missing.</P>
        <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Annotation</th>
                <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr><td className="py-2 px-3"><IC>string? name</IC></td><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Could be null.</td></tr>
              <tr><td className="py-2 px-3"><IC>string name</IC></td><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Promised non-null.</td></tr>
              <tr><td className="py-2 px-3"><IC>{"name!"}</IC></td><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Null-forgiving — &quot;trust me.&quot; Use sparingly.</td></tr>
              <tr><td className="py-2 px-3"><IC>{"[MemberNotNull(...)]"}</IC></td><td className="py-2 px-3 text-slate-700 dark:text-slate-300">For methods that initialize fields.</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 1.6 ──────────────────────────────────────────────────────────── */}
      <Section num="1.6" kicker="Tooling" title="Source generators — compile-time code gen" icon={Sparkles} accent="violet">
        <P>A source generator is a Roslyn analyzer that <strong className="text-slate-800 dark:text-slate-200">adds source files to your compilation at compile time</strong> based on what it sees in your code. They&apos;re the AOT-safe alternative to runtime reflection.</P>

        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <div className={cn("rounded-xl border p-4 bg-white dark:bg-slate-900", TONE.violet.border)}>
            <h4 className={cn("text-sm font-bold mb-1.5", TONE.violet.text)}>System.Text.Json</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Generates serializers at compile time — no reflection. Required for AOT.</p>
          </div>
          <div className={cn("rounded-xl border p-4 bg-white dark:bg-slate-900", TONE.blue.border)}>
            <h4 className={cn("text-sm font-bold mb-1.5", TONE.blue.text)}>LoggerMessage</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"><IC>{"[LoggerMessage(...)]"}</IC> generates the most efficient logging code.</p>
          </div>
          <div className={cn("rounded-xl border p-4 bg-white dark:bg-slate-900", TONE.emerald.border)}>
            <h4 className={cn("text-sm font-bold mb-1.5", TONE.emerald.text)}>RegexGenerator</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"><IC>{"[GeneratedRegex(...)]"}</IC> compiles patterns at build time.</p>
          </div>
        </div>

        <Callout tone="emerald" icon={Sparkles}>
          This is how the framework keeps eating reflection-heavy libraries. Expect more of your favourite libs to ship source-generator versions every release.
        </Callout>
      </Section>

      <Pitfalls items={[
        <>Configuring <IC>Server GC</IC> for tiny console apps wastes memory. Default to Workstation GC unless you&apos;re hosting a server.</>,
        <><IC>HttpClient</IC> should be reused (single instance / <IC>IHttpClientFactory</IC>). Creating new ones leaks socket handles via <IC>TIME_WAIT</IC>.</>,
        <><IC>Task.Run</IC> in ASP.NET Core controllers is almost always wrong. You&apos;re stealing thread-pool threads from request handling to run on… thread-pool threads.</>,
        <>Don&apos;t <IC>await</IC> inside <IC>lock</IC>. It&apos;s a compile error for a reason — you cannot release a lock from a different thread reliably.</>,
        <>Dispose async resources with <IC>await using</IC>. Implement <IC>IAsyncDisposable</IC> for things that hit I/O on cleanup.</>,
      ]} />

      <StressTest questions={[
        "Why does `async` without `await` still return a Task, and what does it do?",
        "What's the difference between Gen 1 and Gen 2 collection cost, and how do you keep things in Gen 0?",
        "When is ConfigureAwait(false) actually meaningful, and when is it noise?",
        "What can't you do with a Span<T> that you can do with a Memory<T>?",
        "Name three things Native AOT breaks and what the source-generator equivalent is.",
      ]} />

      <Samples dir="code-samples/Day1-Runtime/" files={[
        "01-value-vs-reference.cs — boxing, stack/heap behavior, `in` parameters",
        "02-async-internals.cs — manual state machine + ValueTask + cancellation",
        "03-spans.cs — zero-allocation parsing",
        "04-source-generators.cs — LoggerMessage + GeneratedRegex + JsonSerializerContext",
        "05-nrt-and-patterns.cs — modern C# features you should be reaching for",
      ]} />
    </div>
  );
}

// ─── Day 2 — ASP.NET Core Deep Dive ───────────────────────────────────────────

function Day2() {
  const accent: ToneKey = "blue";
  return (
    <div>
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.blue.border, TONE.blue.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.blue.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.blue.text)}>Why this day matters</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              You&apos;ve shipped Web APIs for years. The goal today is to know <em>exactly</em> what <IC>WebApplication.CreateBuilder(args)</IC> is doing and why.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "2.1", title: "The hosting model — Generic Host" },
          { num: "2.2", title: "Dependency Injection — really know it" },
          { num: "2.3", title: "Configuration & Options" },
          { num: "2.4", title: "The middleware pipeline" },
          { num: "2.5", title: "Minimal APIs vs Controllers" },
          { num: "2.6", title: "Model binding, validation, filters" },
          { num: "2.7", title: "Auth and authz" },
        ]}
      />

      {/* ── 2.1 ──────────────────────────────────────────────────────────── */}
      <Section num="2.1" kicker="Hosting" title="The hosting model — Generic Host" icon={Rocket} accent="blue">
        <P>Every modern .NET app (console, ASP.NET Core, worker service, background job) is built on <IC>IHost</IC>. <IC>WebApplication</IC> in .NET 6+ is a thin wrapper that wires up Kestrel and the HTTP pipeline.</P>
        <SubHeading accent={accent}>What CreateBuilder(args) does, in order</SubHeading>
        <LayerStack
          layers={[
            { name: "Build the builder", tone: "blue", icon: Boxes, sub: "step 1", body: <>Creates a <IC>WebApplicationBuilder</IC> instance.</> },
            { name: "Layered configuration", tone: "emerald", icon: Layers, sub: "step 2", body: <><IC>appsettings.json</IC> → <IC>{"appsettings.{Environment}.json"}</IC> → user secrets (Dev) → env vars → CLI args. Later sources override earlier ones.</> },
            { name: "Logging", tone: "amber", icon: BarChart3, sub: "step 3", body: <>Console + Debug providers wired by default.</> },
            { name: "DI container", tone: "violet", icon: Workflow, sub: "step 4", body: <>Registers <IC>Microsoft.Extensions.DependencyInjection</IC>.</> },
            { name: "Kestrel + HTTP defaults", tone: "rose", icon: Server, sub: "step 5", body: <>Adds the Kestrel server and HTTP feature defaults.</> },
          ]}
        />
        <Callout tone="amber" icon={AlertTriangle} title="Build() freezes everything">
          <IC>var app = builder.Build();</IC> freezes the service collection and produces the request pipeline builder. <strong className="text-slate-800 dark:text-slate-200">Anything that registers services must run before <IC>Build()</IC>.</strong> Anything that defines middleware or endpoints runs after.
        </Callout>
      </Section>

      {/* ── 2.2 ──────────────────────────────────────────────────────────── */}
      <Section num="2.2" kicker="DI" title="Dependency Injection — really know it" icon={Workflow} accent="blue">
        <SubHeading accent={accent}>Lifetimes</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard
            title="Transient"
            tone="violet"
            icon={Zap}
            badge="every resolve"
            rows={[
              { label: "Scope", value: "New instance every time" },
              { label: "Use for", value: "Stateless helpers, mappers, light services" },
              { label: "Watch out", value: "Confusing if it holds any state" },
            ]}
          />
          <CompareCard
            title="Scoped"
            tone="blue"
            icon={Workflow}
            badge="per request"
            rows={[
              { label: "Scope", value: "One per scope (HTTP request)" },
              { label: "Use for", value: <>DbContext, current user, unit-of-work</> },
              { label: "Watch out", value: <>Captured by singletons → captive bug</> },
            ]}
          />
          <CompareCard
            title="Singleton"
            tone="emerald"
            icon={Server}
            badge="forever"
            rows={[
              { label: "Scope", value: "One for the host lifetime" },
              { label: "Use for", value: "Caches, factories, stateless services" },
              { label: "Watch out", value: <>Must be thread-safe</> },
            ]}
          />
        </div>

        <SubHeading accent={accent}>Captive dependencies — the #1 DI bug</SubHeading>
        <P>A singleton that depends on a scoped service captures it forever — that scoped service never gets disposed and outlives every request. The container will throw in development if <IC>ValidateScopes</IC> is on (it is by default).</P>
        <CodeBlock label="// BAD: SingletonService holds DbContext forever" code={`builder.Services.AddSingleton<SingletonService>();
builder.Services.AddScoped<MyDbContext>();`} />

        <SubHeading accent={accent}>Keyed services (.NET 8)</SubHeading>
        <P>Register multiple implementations under a key:</P>
        <CodeBlock code={`services.AddKeyedScoped<INotifier, EmailNotifier>("email");
services.AddKeyedScoped<INotifier, SmsNotifier>("sms");

public class Handler([FromKeyedServices("email")] INotifier email) { ... }`} />

        <SubHeading accent={accent}>Scope creation outside HTTP</SubHeading>
        <P>In background services, you don&apos;t have an automatic request scope. Create one explicitly:</P>
        <CodeBlock code={`public class MyBackgroundService(IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            using var scope = scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
            // do work
            await Task.Delay(TimeSpan.FromMinutes(1), ct);
        }
    }
}`} />
      </Section>

      {/* ── 2.3 ──────────────────────────────────────────────────────────── */}
      <Section num="2.3" kicker="Config" title="Configuration & Options" icon={Boxes} accent="blue">
        <P><IC>IConfiguration</IC> is a layered key-value store. Keys are strings; values are strings. Sections nest via <IC>:</IC> (e.g., <IC>Logging:LogLevel:Default</IC>). Environment variables use <IC>__</IC> instead of <IC>:</IC> because Linux doesn&apos;t allow <IC>:</IC> in env var names.</P>

        <SubHeading accent={accent}>The Options pattern</SubHeading>
        <P>Bind a config section to a strongly typed POCO once, inject it everywhere:</P>
        <CodeBlock code={`builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));`} />

        <SubHeading accent={accent}>The three Options interfaces</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard
            title="IOptions<T>"
            tone="violet"
            icon={Boxes}
            badge="singleton"
            rows={[
              { label: "Lifetime", value: "Singleton snapshot" },
              { label: "Updates?", value: "Never re-reads" },
              { label: "Use in", value: "Stable, startup-bound config" },
            ]}
          />
          <CompareCard
            title="IOptionsSnapshot<T>"
            tone="blue"
            icon={Workflow}
            badge="scoped"
            rows={[
              { label: "Lifetime", value: "Per-request snapshot" },
              { label: "Updates?", value: "Re-reads if config changed" },
              { label: "Use in", value: "Scoped services" },
            ]}
          />
          <CompareCard
            title="IOptionsMonitor<T>"
            tone="emerald"
            icon={BarChart3}
            badge="singleton-safe"
            rows={[
              { label: "Lifetime", value: "Singleton-friendly" },
              { label: "Updates?", value: <>Exposes <IC>OnChange</IC> callback</> },
              { label: "Use in", value: "Long-lived background services" },
            ]}
          />
        </div>

        <Callout tone="emerald" icon={CheckCircle2} title="Validate on start">
          Add <IC>.ValidateDataAnnotations().ValidateOnStart()</IC> to your <IC>Configure&lt;T&gt;</IC> call. Bad config fails at startup, not at first use.
        </Callout>
      </Section>

      {/* ── 2.4 ──────────────────────────────────────────────────────────── */}
      <Section num="2.4" kicker="Pipeline" title="The middleware pipeline" icon={Layers} accent="blue">
        <P>Middleware is a function <IC>RequestDelegate -&gt; RequestDelegate</IC>. Each can inspect/modify <IC>HttpContext</IC>, call (or not call) <IC>next</IC>, and run code after <IC>next</IC> returns.</P>

        <SubHeading accent={accent}>Order matters — a lot</SubHeading>
        <CodeBlock label="// Program.cs — canonical pipeline order" code={`app.UseExceptionHandler("/error");   // outermost: catches exceptions from everything below
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();                     // populates the matched endpoint
app.UseCors();
app.UseAuthentication();              // must be after UseRouting, before UseAuthorization
app.UseAuthorization();
app.MapControllers();                 // terminal: invokes the endpoint`} />

        <SubHeading accent={accent}>Inline middleware</SubHeading>
        <CodeBlock code={`app.Use(async (ctx, next) =>
{
    var sw = Stopwatch.StartNew();
    await next();
    logger.LogInformation("{Path} took {Ms}ms", ctx.Request.Path, sw.ElapsedMilliseconds);
});`} />

        <SubHeading accent={accent}>Convention-based class middleware</SubHeading>
        <CodeBlock code={`public class TimingMiddleware
{
    private readonly RequestDelegate _next;
    public TimingMiddleware(RequestDelegate next) => _next = next;
    public async Task InvokeAsync(HttpContext ctx, ILogger<TimingMiddleware> logger)
    {
        var sw = Stopwatch.StartNew();
        await _next(ctx);
        logger.LogInformation("{Path} took {Ms}ms", ctx.Request.Path, sw.ElapsedMilliseconds);
    }
}
app.UseMiddleware<TimingMiddleware>();`} />
        <Callout tone="amber" icon={Lightbulb}>
          The convention class is instantiated <strong className="text-slate-800 dark:text-slate-200">once</strong> (singleton). <IC>InvokeAsync</IC> parameters beyond <IC>HttpContext</IC> are resolved from request services on each call.
        </Callout>
      </Section>

      {/* ── 2.5 ──────────────────────────────────────────────────────────── */}
      <Section num="2.5" kicker="API Style" title="Minimal APIs vs Controllers — when to use which" icon={GitBranch} accent="blue">
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="Minimal APIs"
            tone="emerald"
            icon={Zap}
            badge=".NET 6+"
            rows={[
              { label: "Style", value: <>Endpoints on <IC>app.MapGet/MapPost</IC></> },
              { label: "Strengths", value: "Tiny startup, AOT-friendly, no boilerplate" },
              { label: "Best for", value: "Microservices, small services" },
            ]}
          />
          <CompareCard
            title="MVC Controllers"
            tone="violet"
            icon={Boxes}
            badge="classic"
            rows={[
              { label: "Style", value: "Class-based with inheritance + filters" },
              { label: "Strengths", value: "Filters, conventions, big-app organization" },
              { label: "Best for", value: "Apps with heavy cross-cutting concerns" },
            ]}
          />
        </div>
        <P>Both share the same routing, model binding, and filter infrastructure. Pick by team familiarity and app size, not religion.</P>

        <SubHeading accent={accent}>Endpoint filters (minimal-API action filters)</SubHeading>
        <CodeBlock code={`app.MapPost("/orders", CreateOrder)
   .AddEndpointFilter(async (ctx, next) =>
   {
       // before
       var result = await next(ctx);
       // after
       return result;
   });`} />

        <SubHeading accent={accent}>TypedResults vs Results</SubHeading>
        <Callout tone="emerald" icon={CheckCircle2}>
          Use <IC>{"TypedResults.Ok(value)"}</IC> instead of <IC>{"Results.Ok(value)"}</IC> — compile-time return types, better OpenAPI, AOT-safe.
        </Callout>
      </Section>

      {/* ── 2.6 ──────────────────────────────────────────────────────────── */}
      <Section num="2.6" kicker="Binding" title="Model binding, validation, filters" icon={Code2} accent="blue">
        <SubHeading accent={accent}>Binding sources</SubHeading>
        <div className="flex flex-wrap gap-2 my-3">
          <Chip tone="blue">[FromQuery]</Chip>
          <Chip tone="blue">[FromRoute]</Chip>
          <Chip tone="blue">[FromHeader]</Chip>
          <Chip tone="emerald">[FromBody]</Chip>
          <Chip tone="emerald">[FromForm]</Chip>
          <Chip tone="violet">[FromServices]</Chip>
        </div>
        <P>Minimal APIs infer these from parameter types and route templates.</P>

        <SubHeading accent={accent}>Validation</SubHeading>
        <P>Built-in: DataAnnotations attributes. For complex rules, <strong className="text-slate-800 dark:text-slate-200">FluentValidation</strong> is the de-facto choice. .NET 8 introduced source-generated DataAnnotations validation for AOT.</P>

        <SubHeading accent={accent}>MVC filter pipeline</SubHeading>
        <ol className="flex flex-wrap items-center gap-2 my-3">
          {["Authorization", "Resource", "Action", "Exception", "Result"].map((f, i, arr) => (
            <li key={f} className="flex items-center gap-2">
              <Chip tone="amber">{f}</Chip>
              {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
            </li>
          ))}
        </ol>
        <P>Most of your filters should probably be middleware or endpoint filters.</P>
      </Section>

      {/* ── 2.7 ──────────────────────────────────────────────────────────── */}
      <Section num="2.7" kicker="Security" title="Auth and authz" icon={Server} accent="blue">
        <SubHeading accent={accent}>Authentication = &quot;who are you?&quot;</SubHeading>
        <P>JWT bearer is standard for APIs:</P>
        <CodeBlock code={`builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = config["Jwt:Issuer"],
            ValidAudience = config["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });`} />

        <SubHeading accent={accent}>Authorization = &quot;are you allowed?&quot;</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard
            title="Role-based"
            tone="amber"
            icon={Cpu}
            badge="simple"
            rows={[
              { label: "Pattern", value: <IC>{"[Authorize(Roles = \"Admin\")]"}</IC> },
              { label: "When", value: "Coarse, single-attribute checks" },
            ]}
          />
          <CompareCard
            title="Policy-based"
            tone="blue"
            icon={Workflow}
            badge="recommended"
            rows={[
              { label: "Pattern", value: "Define policies once, apply by name" },
              { label: "When", value: "Reusable rules across endpoints" },
            ]}
          />
          <CompareCard
            title="Requirement + handler"
            tone="rose"
            icon={Code2}
            badge="complex"
            rows={[
              { label: "Pattern", value: <><IC>IAuthorizationRequirement</IC> + handler</> },
              { label: "When", value: "Custom logic, multi-source checks" },
            ]}
          />
        </div>
        <CodeBlock label="// policy-based example" code={`builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OverEighteen", p => p.RequireClaim("age", "18", "19", "20"));
});
[Authorize(Policy = "OverEighteen")]`} />
      </Section>

      <Pitfalls items={[
        <><IC>UseRouting</IC> before <IC>UseAuthorization</IC>. Auth needs the endpoint metadata to know what policy applies.</>,
        <>Don&apos;t hide <IC>HttpClient</IC> behind your own static. Use <IC>IHttpClientFactory</IC> — it manages handlers, lifetimes, and integrates with Polly.</>,
        <>Returning <IC>IActionResult</IC> vs <IC>{"ActionResult<T>"}</IC> vs <IC>TypedResults</IC>. Prefer <IC>{"ActionResult<T>"}</IC> or <IC>{"Results<Ok<T>, NotFound>"}</IC> for correct OpenAPI types.</>,
        <>Accept a <IC>CancellationToken</IC> parameter in every action. ASP.NET binds it from <IC>HttpContext.RequestAborted</IC>. Pass it down.</>,
        <>Antiforgery for cookie-authed forms only. Pure bearer-token APIs don&apos;t need it.</>,
      ]} />

      <StressTest questions={[
        "What's the difference between IOptions<T>, IOptionsSnapshot<T>, and IOptionsMonitor<T>? When do you reach for each?",
        "Walk me through what WebApplication.CreateBuilder(args).Build().Run() does.",
        "Explain the order constraints for UseRouting, UseAuthentication, UseAuthorization, UseCors. Why?",
        "What's a captive dependency? How does the container help you catch it?",
        "When would you pick MVC controllers over minimal APIs, and vice versa?",
      ]} />

      <Samples dir="code-samples/Day2-AspNetCore/" files={[
        "01-minimal-api.cs — minimal API + TypedResults + endpoint filters",
        "02-di-lifetimes.cs — captive dependency demo + keyed services",
        "03-middleware.cs — convention + factory middleware + ordering",
        "04-options-pattern.cs — IOptions/Snapshot/Monitor + validation",
        "05-auth-jwt.cs — JWT setup + policy-based authorization",
      ]} />
    </div>
  );
}

// ─── Day 3 — EF Core & Data Access ────────────────────────────────────────────

function Day3() {
  const accent: ToneKey = "emerald";
  return (
    <div>
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.emerald.border, TONE.emerald.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.emerald.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.emerald.text)}>Why this day matters</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              You&apos;ve used EF Core. Today&apos;s goal: stop being surprised by its behavior.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "3.1", title: "The mental model" },
          { num: "3.2", title: "Tracking vs no-tracking" },
          { num: "3.3", title: "Query translation pitfalls" },
          { num: "3.4", title: "The N+1 problem" },
          { num: "3.5", title: "Performance: things that actually matter" },
          { num: "3.6", title: "Migrations strategies" },
          { num: "3.7", title: "Transactions, concurrency, resiliency" },
          { num: "3.8", title: "EF Core vs Dapper" },
        ]}
      />

      {/* ── 3.1 ──────────────────────────────────────────────────────────── */}
      <Section num="3.1" kicker="Concepts" title="The mental model" icon={Database} accent="emerald">
        <P><IC>DbContext</IC> is a <strong className="text-slate-800 dark:text-slate-200">unit of work + identity map + change tracker</strong> sitting on top of a <IC>DbConnection</IC>.</P>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard
            title="Unit of Work"
            tone="violet"
            icon={Workflow}
            badge="add → save"
            rows={[
              { label: "On Add", value: "Records as Added — nothing hits DB" },
              { label: "On SaveChanges", value: "Computes graph, opens tx, runs SQL, reads back IDs" },
            ]}
          />
          <CompareCard
            title="Identity Map"
            tone="blue"
            icon={Boxes}
            badge="first-level cache"
            rows={[
              { label: "Behavior", value: "Same row → same C# instance within a context" },
              { label: "Cost", value: "Tracked entries accumulate" },
            ]}
          />
          <CompareCard
            title="Change Tracker"
            tone="amber"
            icon={Gauge}
            badge="auto"
            rows={[
              { label: "Behavior", value: "Notices mutations on tracked entities" },
              { label: "Cost", value: "Expensive on big tracked sets" },
            ]}
          />
        </div>
        <Callout tone="amber" icon={AlertTriangle} title="Short-lived DbContext matters">
          A long-lived <IC>DbContext</IC> accumulates tracked entities (memory creep), re-uses a DB connection improperly (<strong className="text-slate-800 dark:text-slate-200">not thread-safe</strong>), and makes change tracking slow. Pattern: scoped <IC>DbContext</IC> per request, disposed at end.
        </Callout>
      </Section>

      {/* ── 3.2 ──────────────────────────────────────────────────────────── */}
      <Section num="3.2" kicker="Queries" title="Tracking vs no-tracking" icon={Zap} accent="emerald">
        <CodeBlock code={`// Tracked (default): can mutate, will save back
var user = db.Users.First(u => u.Id == id);

// No-tracking: read-only, ~30-40% faster, no identity map
var users = db.Users.AsNoTracking().Where(u => u.IsActive).ToList();

// No-tracking with identity resolution (so includes don't duplicate)
var users = db.Users.AsNoTrackingWithIdentityResolution().Include(u => u.Orders).ToList();`} />
        <Callout tone="emerald" icon={Lightbulb} title="The rule">
          Read-only queries (lists, reports, exports) → <IC>AsNoTracking</IC> always. &quot;Load, modify, save&quot; → tracked.
        </Callout>
      </Section>

      {/* ── 3.3 ──────────────────────────────────────────────────────────── */}
      <Section num="3.3" kicker="Translation" title="Query translation pitfalls" icon={AlertTriangle} accent="emerald">
        <P>EF translates <em>most</em> of LINQ to SQL — but not everything. EF 3.0+ throws for <IC>Where</IC> clauses that can&apos;t translate.</P>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <XCircle className={cn("h-4 w-4", TONE.rose.text)} aria-hidden />
              <h4 className={cn("text-sm font-bold", TONE.rose.text)}>Won&apos;t translate</h4>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">Your own static method inside <IC>Where</IC></li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700"><IC>string.Format</IC> + complex <IC>DateTime</IC> arithmetic</li>
              <li className="pl-3 border-l-2 border-rose-300 dark:border-rose-700">Anything reflection-based</li>
            </ul>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.emerald.border, TONE.emerald.bg)}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className={cn("h-4 w-4", TONE.emerald.text)} aria-hidden />
              <h4 className={cn("text-sm font-bold", TONE.emerald.text)}>Reach for instead</h4>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">Function mappings (<IC>HasDbFunction</IC>)</li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">Computed columns or scalar UDFs in DB</li>
              <li className="pl-3 border-l-2 border-emerald-300 dark:border-emerald-700"><IC>FromSqlInterpolated</IC> — parameter-safe raw SQL</li>
            </ul>
          </div>
        </div>
        <CodeBlock code={`var users = db.Users
    .FromSqlInterpolated($"SELECT * FROM Users WHERE Name LIKE {pattern}")
    .ToList();`} />
      </Section>

      {/* ── 3.4 ──────────────────────────────────────────────────────────── */}
      <Section num="3.4" kicker="Performance" title="The N+1 problem — still the #1 EF Core killer" icon={Gauge} accent="emerald">
        <CodeBlock label="// BAD: 1 + N queries" code={`var orders = db.Orders.ToList();
foreach (var o in orders)
    Console.WriteLine(o.Customer.Name); // lazy load fires per row`} />
        <SubHeading accent={accent}>Three fixes</SubHeading>
        <CodeBlock label="// 1. Eager load — explicit Include" code={`db.Orders.Include(o => o.Customer).ToList();`} />
        <CodeBlock label="// 2. Projection — best, only fetches what you need" code={`db.Orders.Select(o => new { o.Id, CustomerName = o.Customer.Name }).ToList();`} />
        <CodeBlock label="// 3. Split queries — when joins explode" code={`db.Orders.Include(o => o.Items).AsSplitQuery().ToList();`} />
        <Callout tone="rose" icon={AlertTriangle}>
          <strong className="text-slate-800 dark:text-slate-200">Disable lazy loading proxies in any serious app.</strong> Use explicit <IC>Include</IC> or projections.
        </Callout>
      </Section>

      {/* ── 3.5 ──────────────────────────────────────────────────────────── */}
      <Section num="3.5" kicker="Perf" title="Performance: things that actually matter" icon={Zap} accent="emerald">
        <SubHeading accent={accent}>Use projections aggressively</SubHeading>
        <P>Don&apos;t load 30 columns to show 3. <IC>Select</IC> into a DTO. EF generates the narrow <IC>SELECT</IC> and skips change tracking.</P>

        <SubHeading accent={accent}>Compiled queries</SubHeading>
        <P>For hot queries, eliminate per-call expression-tree compilation:</P>
        <CodeBlock code={`private static readonly Func<MyDbContext, int, Task<User?>> GetUserById =
    EF.CompileAsyncQuery((MyDbContext db, int id) =>
        db.Users.AsNoTracking().FirstOrDefault(u => u.Id == id));

var user = await GetUserById(db, 42);`} />

        <SubHeading accent={accent}>Bulk operations (EF Core 7+)</SubHeading>
        <P><IC>ExecuteUpdate</IC> and <IC>ExecuteDelete</IC> — set/delete without materializing:</P>
        <CodeBlock code={`await db.Orders
    .Where(o => o.CreatedAt < cutoff && o.Status == OrderStatus.Cancelled)
    .ExecuteDeleteAsync();

await db.Users
    .Where(u => !u.IsActive)
    .ExecuteUpdateAsync(s => s.SetProperty(u => u.Archived, true));`} />
        <Callout tone="blue" icon={Lightbulb}>
          These translate to a single <IC>DELETE</IC> / <IC>UPDATE</IC> statement. For really big bulk inserts, use <IC>SqlBulkCopy</IC> or <IC>EFCore.BulkExtensions</IC>.
        </Callout>
      </Section>

      {/* ── 3.6 ──────────────────────────────────────────────────────────── */}
      <Section num="3.6" kicker="Migrations" title="Migration strategies" icon={GitBranch} accent="emerald">
        <P><IC>dotnet ef migrations add InitialCreate</IC> diffs model against the last snapshot, generating a <IC>.cs</IC> migration with <IC>Up</IC> / <IC>Down</IC>.</P>
        <Callout tone="rose" icon={AlertTriangle} title="Don't run Database.Migrate() at app startup in multi-instance deploys">
          Two instances racing each other to apply the same migrations is fun for nobody.
        </Callout>
        <SubHeading accent={accent}>Better patterns</SubHeading>
        <LayerStack
          layers={[
            { name: "CI job runs migrations", tone: "emerald", icon: Workflow, sub: "option 1", body: <>Use <IC>dotnet ef migrations script --idempotent -o migration.sql</IC> before deploying instances.</> },
            { name: "Pre-deployment migration container", tone: "blue", icon: Boxes, sub: "option 2", body: <>Kubernetes Job runs the EF script, then app deploys.</> },
            { name: "Migration bundles (EF Core 7+)", tone: "violet", icon: Rocket, sub: "option 3", body: <><IC>dotnet ef migrations bundle</IC> produces a self-contained executable.</> },
          ]}
        />
        <Callout tone="amber" icon={Lightbulb} title="Backwards-compatible always">
          Add columns nullable first, deploy code, then make non-null in a follow-up. Two-phase deploys save you.
        </Callout>
      </Section>

      {/* ── 3.7 ──────────────────────────────────────────────────────────── */}
      <Section num="3.7" kicker="Reliability" title="Transactions, concurrency, and connection resiliency" icon={Server} accent="emerald">
        <SubHeading accent={accent}>Transactions</SubHeading>
        <P>Implicit on <IC>SaveChanges</IC> for a single context. Explicit when you span multiple operations:</P>
        <CodeBlock code={`await using var tx = await db.Database.BeginTransactionAsync();
// ... multiple ops
await tx.CommitAsync();`} />

        <SubHeading accent={accent}>Optimistic concurrency</SubHeading>
        <P>Add a <IC>{"[Timestamp]"}</IC> / <IC>rowversion</IC> column. EF generates <IC>UPDATE ... WHERE Id = @id AND RowVersion = @oldVersion</IC>. If 0 rows affected, throws <IC>DbUpdateConcurrencyException</IC>. Catch it, reload, decide.</P>

        <SubHeading accent={accent}>Connection resiliency</SubHeading>
        <Callout tone="blue" icon={Lightbulb}>
          <IC>{"UseSqlServer(..., o => o.EnableRetryOnFailure())"}</IC> retries transient failures. Combine with idempotent operations or saga-like patterns for safety.
        </Callout>
      </Section>

      {/* ── 3.8 ──────────────────────────────────────────────────────────── */}
      <Section num="3.8" kicker="Comparison" title="EF Core vs Dapper" icon={GitBranch} accent="emerald">
        <P>Dapper is a micro-ORM: maps a query result to objects, nothing else. No change tracking, no LINQ, no migrations.</P>
        <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Use case</th>
                <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">EF Core</th>
                <th className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">Dapper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Write-heavy domain logic</td><td className="py-2 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">Great</td><td className="py-2 px-3 text-slate-600 dark:text-slate-400">Needs hand-written SQL</td></tr>
              <tr><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Reports / read models</td><td className="py-2 px-3 text-slate-600 dark:text-slate-400">OK</td><td className="py-2 px-3 text-blue-700 dark:text-blue-400 font-semibold">Usually faster, simpler</td></tr>
              <tr><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Complex aggregates</td><td className="py-2 px-3 text-emerald-700 dark:text-emerald-400 font-semibold">Great with <IC>Select</IC></td><td className="py-2 px-3 text-slate-600 dark:text-slate-400">Manual joins</td></tr>
              <tr><td className="py-2 px-3 text-slate-700 dark:text-slate-300">Tight perf budgets</td><td className="py-2 px-3 text-slate-600 dark:text-slate-400">Compiled queries + ExecuteUpdate</td><td className="py-2 px-3 text-blue-700 dark:text-blue-400 font-semibold">Hard to beat</td></tr>
            </tbody>
          </table>
        </div>
        <Callout tone="emerald" icon={CheckCircle2}>
          Many serious systems use <strong className="text-slate-800 dark:text-slate-200">both</strong> — EF Core for the write/command side, Dapper for read models.
        </Callout>
      </Section>

      <Pitfalls items={[
        <>Sharing <IC>DbContext</IC> across threads. Will fail randomly. Always one DbContext per logical operation.</>,
        <><IC>Include</IC> chains explode result size. Two <IC>Include</IC>s with collections = cartesian product. Use <IC>AsSplitQuery</IC> or projections.</>,
        <><IC>SaveChanges</IC> inside a loop — batch instead.</>,
        <>Mass adding entities without <IC>AutoDetectChangesEnabled = false</IC>. The default does change detection on every Add. Toggling off + re-on around big inserts is a huge win.</>,
        <>EF migrations on dev DB pointing at prod. Belt and braces: prod runs scripts, not migrations.</>,
      ]} />

      <StressTest questions={[
        "Why is the default tracking behavior bad for read-heavy endpoints?",
        "What does AsSplitQuery solve and when is it the wrong choice?",
        "How does ExecuteUpdate differ from foreach (var x in q) { x.Y = z; } SaveChanges()?",
        "What's the correct production strategy for running EF Core migrations?",
        "Why do compiled queries help — and when is the gain negligible?",
      ]} />

      <Samples dir="code-samples/Day3-EFCore/" files={[
        "01-change-tracking.cs — tracked vs no-tracking + identity map",
        "02-query-pitfalls.cs — N+1, projections, split queries",
        "03-bulk-ops.cs — ExecuteUpdate, ExecuteDelete",
        "04-compiled-queries.cs — EF.CompileAsyncQuery patterns",
        "05-concurrency.cs — optimistic concurrency with rowversion",
      ]} />
    </div>
  );
}

// ─── Day 4 — Architecture & Patterns ──────────────────────────────────────────

function Day4() {
  const accent: ToneKey = "amber";
  return (
    <div>
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.amber.border, TONE.amber.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.amber.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.amber.text)}>Why this day matters</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              You&apos;ve already done architecture (your CV says &quot;made architectural decisions&quot;). This is the systematic version with the names and trade-offs.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "4.1", title: "Clean Architecture (no cargo cult)" },
          { num: "4.2", title: "CQRS and MediatR" },
          { num: "4.3", title: "DDD essentials" },
          { num: "4.4", title: "Resilience — Polly + HttpClientFactory" },
          { num: "4.5", title: "gRPC — when and why" },
          { num: "4.6", title: "Messaging & event-driven patterns" },
          { num: "4.7", title: "Microservices considerations" },
          { num: "4.8", title: "Cross-cutting concerns" },
        ]}
      />

      {/* ── 4.1 ──────────────────────────────────────────────────────────── */}
      <Section num="4.1" kicker="Layout" title="Clean Architecture in .NET (without the cargo cult)" icon={Layers} accent="amber">
        <P>The point: <strong className="text-slate-800 dark:text-slate-200">dependencies point inward.</strong> Outer layers depend on inner layers, never the reverse. Your domain doesn&apos;t know about EF Core, ASP.NET Core, or AWS.</P>
        <SubHeading accent={accent}>The four layers</SubHeading>
        <LayerStack
          layers={[
            { name: "MyApp.Api", tone: "blue", icon: Server, sub: "outer", body: <>ASP.NET Core, controllers, DI composition root. References everything below.</> },
            { name: "MyApp.Infrastructure", tone: "violet", icon: Boxes, sub: "adapters", body: <>EF Core, external APIs, message bus. Implements ports defined by Application.</> },
            { name: "MyApp.Application", tone: "amber", icon: Workflow, sub: "use cases", body: <>Command/query handlers, ports (interfaces). Depends only on Domain.</> },
            { name: "MyApp.Domain", tone: "emerald", icon: Sparkles, sub: "core", body: <>Entities, value objects, domain services. <strong className="text-slate-800 dark:text-slate-200">Zero references.</strong></> },
          ]}
        />
        <Callout tone="amber" icon={Lightbulb} title="The honest trade-off">
          Adds project-structure overhead. Worth it for medium+ systems with significant domain logic. Probably overkill for a CRUD admin tool with five endpoints.
        </Callout>
      </Section>

      {/* ── 4.2 ──────────────────────────────────────────────────────────── */}
      <Section num="4.2" kicker="Pattern" title="CQRS and MediatR" icon={GitBranch} accent="amber">
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="Commands"
            tone="rose"
            icon={Zap}
            badge="writes"
            rows={[
              { label: "Purpose", value: "Change state" },
              { label: "Returns", value: "Nothing meaningful (Id at most)" },
              { label: "Path", value: "Validate → mutate → save" },
            ]}
          />
          <CompareCard
            title="Queries"
            tone="emerald"
            icon={Database}
            badge="reads"
            rows={[
              { label: "Purpose", value: "Return data" },
              { label: "Returns", value: "DTOs shaped for the caller" },
              { label: "Path", value: "Project → optimize → cache" },
            ]}
          />
        </div>
        <P><strong className="text-slate-800 dark:text-slate-200">MediatR</strong> is a tiny library that gives you a single <IC>IMediator</IC> to dispatch requests to handlers:</P>
        <CodeBlock code={`public record CreateOrder(int CustomerId, List<Item> Items) : IRequest<int>;

public class CreateOrderHandler(MyDb db) : IRequestHandler<CreateOrder, int>
{
    public async Task<int> Handle(CreateOrder req, CancellationToken ct)
    {
        var order = new Order(req.CustomerId, req.Items);
        db.Orders.Add(order);
        await db.SaveChangesAsync(ct);
        return order.Id;
    }
}

// In your controller / minimal API:
var id = await mediator.Send(new CreateOrder(customerId, items));`} />
        <P>MediatR pipelines wrap every handler — perfect for logging, validation, transaction management:</P>
        <CodeBlock code={`public class TransactionBehavior<TReq, TRes> : IPipelineBehavior<TReq, TRes>
    where TReq : ICommand<TRes>
{
    public async Task<TRes> Handle(TReq req, RequestHandlerDelegate<TRes> next, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var result = await next();
        await tx.CommitAsync(ct);
        return result;
    }
}`} />
        <Callout tone="amber" icon={AlertTriangle} title="MediatR licensing (2024+)">
          MediatR 12.x moved to a commercial license for organizations above a revenue threshold. Many teams are migrating to <IC>Mediator</IC> (Martin Costello) or writing a 30-line <IC>ISender</IC> themselves.
        </Callout>
      </Section>

      {/* ── 4.3 ──────────────────────────────────────────────────────────── */}
      <Section num="4.3" kicker="Domain" title="DDD essentials — the parts that actually matter" icon={Boxes} accent="amber">
        <SubHeading accent={accent}>The 80/20</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="Entity"
            tone="blue"
            icon={Boxes}
            badge="has identity"
            rows={[
              { label: "Defined by", value: <>Identity that persists (<IC>Order</IC> with <IC>Id</IC>)</> },
              { label: "Equality", value: "By Id, not content" },
            ]}
          />
          <CompareCard
            title="Value object"
            tone="emerald"
            icon={Sparkles}
            badge="no identity"
            rows={[
              { label: "Defined by", value: <>Its values (<IC>Money(100, &quot;USD&quot;)</IC>)</> },
              { label: "Equality", value: <>By content. C# <IC>record</IC> is perfect.</> },
            ]}
          />
          <CompareCard
            title="Aggregate"
            tone="violet"
            icon={Layers}
            badge="boundary"
            rows={[
              { label: "What", value: "Cluster of entities/VOs loaded + saved as one" },
              { label: "Root", value: "Entry point — all changes go through it" },
            ]}
          />
          <CompareCard
            title="Domain event"
            tone="rose"
            icon={Zap}
            badge="something happened"
            rows={[
              { label: "What", value: <>Past-tense fact (<IC>OrderPlaced</IC>)</> },
              { label: "Where", value: <>Emit from aggregates, dispatch after <IC>SaveChanges</IC></> },
            ]}
          />
        </div>
        <SubHeading accent={accent}>Two practical rules</SubHeading>
        <div className="space-y-2 my-3">
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={cn("font-mono text-xs font-bold px-2 py-0.5 rounded", TONE.amber.softBg, TONE.amber.text)}>1</span>
              <h4 className={cn("text-sm font-bold", TONE.amber.text)}>One aggregate per transaction</h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">If your command needs to change two aggregates atomically, the boundaries are wrong — or you need an <em>eventually consistent</em> domain event between them.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={cn("font-mono text-xs font-bold px-2 py-0.5 rounded", TONE.amber.softBg, TONE.amber.text)}>2</span>
              <h4 className={cn("text-sm font-bold", TONE.amber.text)}>Aggregates protect invariants</h4>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Don&apos;t expose mutable collections; expose methods (<IC>order.AddItem(...)</IC>) that enforce rules.</p>
          </div>
        </div>
      </Section>

      {/* ── 4.4 ──────────────────────────────────────────────────────────── */}
      <Section num="4.4" kicker="Reliability" title="Resilience — Polly + HttpClientFactory" icon={Gauge} accent="amber">
        <P>Distributed systems fail. Three things you should wrap every external call in:</P>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard title="Timeout" tone="rose" icon={AlertTriangle} badge="fail fast" rows={[{ label: "Why", value: "Stop waiting on a hung dependency" }]} />
          <CompareCard title="Retry" tone="amber" icon={Workflow} badge="backoff + jitter" rows={[{ label: "Why", value: "Recover from transient failures" }]} />
          <CompareCard title="Circuit breaker" tone="violet" icon={Server} badge="protect" rows={[{ label: "Why", value: "Stop hammering a dead dependency" }]} />
        </div>
        <P>In .NET 8+, <IC>Microsoft.Extensions.Http.Resilience</IC> wraps Polly with sensible defaults:</P>
        <CodeBlock code={`builder.Services.AddHttpClient<PaymentsClient>(c => c.BaseAddress = new(config["Payments:BaseUrl"]!))
    .AddStandardResilienceHandler(); // timeout + retry + circuit breaker + rate limiter`} />
        <Callout tone="blue" icon={Lightbulb}>
          For custom pipelines, use Polly v8&apos;s <IC>ResiliencePipelineBuilder</IC>. The v8 API replaced policies with strategies — much cleaner.
        </Callout>
      </Section>

      {/* ── 4.5 ──────────────────────────────────────────────────────────── */}
      <Section num="4.5" kicker="Protocols" title="gRPC — when and why" icon={Workflow} accent="amber">
        <P>gRPC over HTTP/2 with Protobuf is .NET&apos;s preferred internal-service protocol:</P>
        <ul className="space-y-2 my-3">
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="emerald">contracts</Chip>
            <span>Strongly typed: <IC>.proto</IC> → generated client + server.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="blue">binary</Chip>
            <span>Smaller and faster than JSON.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="violet">streaming</Chip>
            <span>Server, client, and bidirectional.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="amber">interceptors</Chip>
            <span>Built-in for auth, logging, metrics.</span>
          </li>
        </ul>
        <Callout tone="amber" icon={Lightbulb}>
          Use gRPC for service-to-service. Stick to REST/JSON for browsers and external APIs (gRPC-Web exists but adds friction).
        </Callout>
      </Section>

      {/* ── 4.6 ──────────────────────────────────────────────────────────── */}
      <Section num="4.6" kicker="Eventing" title="Messaging & event-driven patterns" icon={Workflow} accent="amber">
        <P>For decoupled services, use a broker — RabbitMQ, Azure Service Bus, Kafka. Popular .NET abstractions:</P>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard title="MassTransit" tone="violet" icon={Rocket} badge="full-featured" rows={[{ label: "Strengths", value: "Sagas, broad broker support" }]} />
          <CompareCard title="NServiceBus" tone="blue" icon={Server} badge="enterprise" rows={[{ label: "Strengths", value: "Mature, paid support" }]} />
          <CompareCard title="Wolverine" tone="emerald" icon={Zap} badge="newer · lighter" rows={[{ label: "Strengths", value: "Modern, code-first, fast" }]} />
        </div>
        <SubHeading accent={accent}>Patterns you must know</SubHeading>
        <div className="space-y-2 my-3">
          <div className={cn("rounded-xl border p-4", TONE.emerald.border, TONE.emerald.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.emerald.text)}>Outbox pattern</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Write the domain change <em>and</em> outbound message to the same DB transaction; a background process publishes. Prevents the &quot;saved the order but never sent the event&quot; bug.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.blue.border, TONE.blue.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.blue.text)}>Idempotent consumers</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Every handler must safely handle the same message twice. Brokers redeliver — count on it.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.violet.border, TONE.violet.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.violet.text)}>Sagas</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Long-running workflows that coordinate multiple services with compensating actions on failure.</p>
          </div>
        </div>
      </Section>

      {/* ── 4.7 ──────────────────────────────────────────────────────────── */}
      <Section num="4.7" kicker="Scale" title="Microservices considerations (not &quot;do microservices&quot;)" icon={Server} accent="amber">
        <SubHeading accent={accent}>Three questions before splitting</SubHeading>
        <ol className="space-y-2 my-3">
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", TONE.amber.softBg, TONE.amber.text)}>1</span>
            <span>Do we have distinct <em>bounded contexts</em>?</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", TONE.amber.softBg, TONE.amber.text)}>2</span>
            <span>Do we need independent scaling / deployment per area?</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", TONE.amber.softBg, TONE.amber.text)}>3</span>
            <span>Can our team operate distributed systems (tracing, log aggregation, broker, on-call)?</span>
          </li>
        </ol>
        <Callout tone="emerald" icon={CheckCircle2} title="2026 default: modular monolith first">
          One solution, multiple feature modules, clean boundaries. Extract services only when you have a <em>specific</em> reason. .NET 8+ makes this easy.
        </Callout>
        <SubHeading accent={accent}>If you go distributed</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard title=".NET Aspire" tone="violet" icon={Rocket} badge=".NET 8+" rows={[{ label: "What", value: "Opinionated stack: orchestration, service discovery, telemetry, dashboards" }]} />
          <CompareCard title="OpenTelemetry" tone="blue" icon={BarChart3} badge="standard" rows={[{ label: "What", value: "Logs + metrics + traces via Microsoft.Extensions.Telemetry" }]} />
        </div>
      </Section>

      {/* ── 4.8 ──────────────────────────────────────────────────────────── */}
      <Section num="4.8" kicker="Observability" title="Cross-cutting: logging, telemetry, observability" icon={BarChart3} accent="amber">
        <P><IC>{"ILogger<T>"}</IC> is the entry point. Behind it: Console + Debug providers by default. Add <strong className="text-slate-800 dark:text-slate-200">Serilog</strong> or <strong className="text-slate-800 dark:text-slate-200">NLog</strong> for sinks (files, Seq, Splunk, Datadog).</P>
        <Callout tone="emerald" icon={Lightbulb} title="Structured logging">
          Pass values as parameters, not interpolation: <IC>{"logger.LogInformation(\"Order {OrderId} placed\", id);"}</IC> — preserves the structure for querying.
        </Callout>
        <Callout tone="blue" icon={BarChart3}>
          OpenTelemetry is now the standard. Add the SDK + exporters and you get distributed traces, metrics, and structured logs across services in one stack.
        </Callout>
      </Section>

      <Pitfalls items={[
        <>CQRS without a reason — splitting reads/writes when both are identical is just extra files.</>,
        <>DDD on a CRUD app — value objects for things that don&apos;t have invariants are theater.</>,
        <>Saga without an outbox — messages get lost on crash between DB commit and broker send.</>,
        <>Microservices for team org reasons — Conway&apos;s Law works the other way too: choose architecture, get the team.</>,
      ]} />

      <StressTest questions={[
        "Why does Clean Architecture put Application above Infrastructure? What does that prevent?",
        "When is CQRS justified? When is it overkill?",
        "What's the outbox pattern solving, and what does it cost?",
        "Why is 'one aggregate per transaction' a rule, and what do you do when you need to change two?",
        "What does AddStandardResilienceHandler give you, and when do you need to drop to a custom Polly pipeline?",
      ]} />

      <Samples dir="code-samples/Day4-Architecture/" files={[
        "01-clean-architecture-layout.md — project layout + sample CSPROJs",
        "02-cqrs-mediator.cs — command + query + pipeline behavior",
        "03-domain-events.cs — emit + dispatch after SaveChanges",
        "04-resilience-http.cs — AddStandardResilienceHandler + custom Polly v8 pipeline",
        "05-outbox-pattern.cs — outbox table + background publisher sketch",
      ]} />
    </div>
  );
}

// ─── Day 5 — What Changed from .NET 6 to .NET 10 ─────────────────────────────

function Day5() {
  const accent: ToneKey = "cyan";
  return (
    <div>
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.cyan.border, TONE.cyan.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.cyan.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.cyan.text)}>Why this day matters</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              This is the chronological &quot;what you missed&quot; tour. Read top to bottom.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "5.1", title: ".NET 7 (Nov 2022, STS)" },
          { num: "5.2", title: ".NET 8 (Nov 2023, LTS — floor for new projects)" },
          { num: "5.3", title: ".NET 9 (Nov 2024, STS)" },
          { num: "5.4", title: ".NET 10 (Nov 2025, LTS)" },
          { num: "5.5", title: "Migration order" },
        ]}
      />

      <SubHeading accent={accent}>Release timeline at a glance</SubHeading>
      <div className="my-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4">
        <VersionRow
          version=".NET 7"
          dotnet="Nov 2022 · STS"
          tone="amber"
          features={[
            <>Out of support — features carried forward into 8.</>,
            <>~1000 perf PRs, OSR, regex perf jump.</>,
            <>OutputCaching, RateLimiter, endpoint filters, TypedResults.</>,
          ]}
        />
        <VersionRow
          version=".NET 8"
          dotnet="Nov 2023 · LTS"
          tone="emerald"
          features={[
            <>Dynamic PGO on by default, keyed services, RDG.</>,
            <>EF Core complex types, primitive collections.</>,
            <>C# 12: primary constructors, collection expressions.</>,
          ]}
        />
        <VersionRow
          version=".NET 9"
          dotnet="Nov 2024 · STS"
          tone="blue"
          features={[
            <>Built-in OpenAPI, hybrid caching.</>,
            <>C# 13: <IC>params</IC> collections, new <IC>Lock</IC>.</>,
            <>First GA of <IC>Microsoft.Extensions.AI</IC>.</>,
          ]}
        />
        <VersionRow
          version=".NET 10"
          dotnet="Nov 2025 · LTS"
          tone="violet"
          features={[
            <>Mature AOT, mature M.E.AI, mature Aspire.</>,
            <>C# 14: <IC>field</IC> keyword, extension members.</>,
            <>ARM64 perf, more aggressive inlining.</>,
          ]}
        />
      </div>

      {/* ── 5.1 ──────────────────────────────────────────────────────────── */}
      <Section num="5.1" kicker=".NET 7" title=".NET 7 — perf marathon (Nov 2022, STS)" icon={Zap} accent="cyan">
        <SubHeading accent={accent}>Performance</SubHeading>
        <P>~1000 PRs labeled &quot;perf.&quot; On-stack replacement (OSR) — hot methods can be re-JIT-optimized <em>mid-execution</em>. Major regex perf jump.</P>

        <SubHeading accent={accent}>ASP.NET Core</SubHeading>
        <UL items={[
          <>Output caching middleware (<IC>AddOutputCache</IC>, <IC>{"[OutputCache]"}</IC>) — a proper replacement for the old ResponseCaching that wasn&apos;t HTTP-spec-compliant.</>,
          <>Rate limiting middleware (<IC>AddRateLimiter</IC>) — fixed window, sliding window, token bucket, concurrency.</>,
          <>Endpoint filters for minimal APIs.</>,
          <>Typed results (<IC>TypedResults</IC>).</>,
        ]} />

        <SubHeading accent={accent}>EF Core 7</SubHeading>
        <UL items={[
          <><IC>ExecuteUpdate</IC> / <IC>ExecuteDelete</IC> (huge — see Day 3).</>,
          <>JSON columns mapped to owned types.</>,
          <>Better bulk operations and entity splitting.</>,
        ]} />

        <SubHeading accent={accent}>C# 11</SubHeading>
        <UL items={[
          <><IC>required</IC> members.</>,
          <>Raw string literals.</>,
          <>Generic math (<IC>static abstract</IC> interface members) — first time C# generics could do <IC>T.MaxValue</IC>, <IC>+</IC>, etc.</>,
          <>File-scoped types. List patterns.</>,
        ]} />
        <Callout tone="amber" icon={Lightbulb}>
          Native AOT shipped as production-ready for console apps and certain ASP.NET workloads (still limited; better in 8 and 9).
        </Callout>
      </Section>

      {/* ── 5.2 ──────────────────────────────────────────────────────────── */}
      <Section num="5.2" kicker=".NET 8" title=".NET 8 — the floor for new projects (Nov 2023, LTS)" icon={Rocket} accent="cyan">
        <Callout tone="emerald" icon={Sparkles} title="The most important release for you">
          If you&apos;ve been on 6, jumping to 8 first is the sane move. Supported through Nov 2026.
        </Callout>

        <SubHeading accent={accent}>Runtime</SubHeading>
        <UL items={[
          <><strong className="text-slate-800 dark:text-slate-200">Dynamic PGO on by default</strong> — free 10-20% perf on most workloads.</>,
          <>Native AOT for ASP.NET Core minimal APIs (production-ready).</>,
          <>Improved tiered compilation.</>,
        ]} />

        <SubHeading accent={accent}>ASP.NET Core</SubHeading>
        <UL items={[
          <><strong className="text-slate-800 dark:text-slate-200">Keyed services</strong> in DI (see Day 2).</>,
          <><strong className="text-slate-800 dark:text-slate-200">Identity API endpoints</strong> — <IC>{"MapIdentityApi<TUser>()"}</IC> gives you registration/login/refresh endpoints with one line.</>,
          <><strong className="text-slate-800 dark:text-slate-200">Request Delegate Generator (RDG)</strong> — source-generates minimal API binding code, making it AOT-safe.</>,
          <><IC>IExceptionHandler</IC> interface — register exception handlers in DI instead of writing exception middleware by hand.</>,
          <>HTTP/3 generally available.</>,
          <><IC>TimeProvider</IC> abstraction — replaces <IC>DateTime.UtcNow</IC> for testable time.</>,
        ]} />

        <SubHeading accent={accent}>EF Core 8</SubHeading>
        <UL items={[
          <><strong className="text-slate-800 dark:text-slate-200">Complex types</strong> (value objects without their own identity, mapped inline).</>,
          <><strong className="text-slate-800 dark:text-slate-200">Primitive collections</strong> — <IC>{"List<int>"}</IC> mapped natively.</>,
          <>Raw SQL queries for unmapped types (<IC>{"db.Database.SqlQuery<DTO>(...)"}</IC>).</>,
        ]} />

        <SubHeading accent={accent}>C# 12 highlights</SubHeading>
        <P><strong className="text-slate-800 dark:text-slate-200">Primary constructors on classes</strong> (not just records):</P>
        <CodeBlock code={`public class UserService(MyDb db, ILogger<UserService> logger)
{
    public async Task<User?> GetAsync(int id) => await db.Users.FindAsync(id);
}`} />
        <P><strong className="text-slate-800 dark:text-slate-200">Collection expressions:</strong></P>
        <CodeBlock code={`int[] x = [1, 2, 3];
List<int> y = [1, 2, 3];
int[] z = [..a, ..b];`} />
        <P>Optional parameters in lambdas: <IC>{"Func<int, int> f = (x = 0) => x;"}</IC></P>
        <P>Type aliases for any type: <IC>{"using Point = (int X, int Y);"}</IC></P>
      </Section>

      {/* ── 5.3 ──────────────────────────────────────────────────────────── */}
      <Section num="5.3" kicker=".NET 9" title=".NET 9 — incremental polish (Nov 2024, STS)" icon={Sparkles} accent="cyan">
        <SubHeading accent={accent}>Runtime &amp; libraries</SubHeading>
        <UL items={[
          <>More PGO improvements; better loop optimizations.</>,
          <><IC>System.Text.Json</IC>: nullable reference type respect, more flexibility.</>,
          <>New <IC>{"Tensor<T>"}</IC> and <IC>System.Numerics</IC> work for AI workloads.</>,
        ]} />

        <SubHeading accent={accent}>ASP.NET Core</SubHeading>
        <UL items={[
          <><strong className="text-slate-800 dark:text-slate-200"><IC>Microsoft.AspNetCore.OpenApi</IC></strong> — built-in OpenAPI document generation (replaces adding Swashbuckle just for that).</>,
          <>Built-in support for <strong className="text-slate-800 dark:text-slate-200">hybrid caching</strong> (<IC>Microsoft.Extensions.Caching.Hybrid</IC>) — L1 memory + L2 distributed in one API.</>,
          <>More AOT-friendly bits.</>,
        ]} />

        <SubHeading accent={accent}>C# 13</SubHeading>
        <UL items={[
          <><IC>params</IC> collections (<IC>{"params ReadOnlySpan<int>"}</IC>, <IC>{"params IEnumerable<int>"}</IC> — no more <IC>{"params T[]"}</IC> allocations).</>,
          <>New <IC>System.Threading.Lock</IC> type — faster.</>,
          <>Implicit indexer in object initializers.</>,
        ]} />
        <Callout tone="rose" icon={Sparkles} title="AI lands">
          <IC>Microsoft.Extensions.AI</IC> — first GA shape. The unified <IC>IChatClient</IC> abstraction across providers landed here.
        </Callout>
      </Section>

      {/* ── 5.4 ──────────────────────────────────────────────────────────── */}
      <Section num="5.4" kicker=".NET 10" title=".NET 10 — the mature LTS (Nov 2025)" icon={Rocket} accent="cyan">
        <Callout tone="violet" icon={Sparkles} title="The big themes">
          Native AOT got dramatically better, <IC>Microsoft.Extensions.AI</IC> is mature, .NET Aspire matured, C# 14 adds long-requested language features.
        </Callout>

        <SubHeading accent={accent}>Runtime</SubHeading>
        <UL items={[
          <>Improved devirtualization, more aggressive inlining.</>,
          <>AOT now works for a much larger fraction of ASP.NET Core scenarios.</>,
          <>ARM64 perf improvements.</>,
        ]} />

        <SubHeading accent={accent}>C# 14</SubHeading>
        <P><strong className="text-slate-800 dark:text-slate-200"><IC>field</IC> keyword</strong> stable — write property logic without backing-field boilerplate:</P>
        <CodeBlock code={`public string Name
{
    get => field;
    set => field = value?.Trim() ?? throw new ArgumentNullException();
}`} />
        <P><strong className="text-slate-800 dark:text-slate-200">Extension members</strong> — extension <em>properties</em> and <em>static</em> extensions, not just methods.</P>
        <P><strong className="text-slate-800 dark:text-slate-200">Null-conditional assignment</strong> — <IC>{"customer?.Name = \"x\""}</IC>.</P>
        <P>Partial constructors and events.</P>
      </Section>

      {/* ── 5.5 ──────────────────────────────────────────────────────────── */}
      <Section num="5.5" kicker="Strategy" title="Migration order — if you're on .NET 6 today" icon={GitBranch} accent="cyan">
        <LayerStack
          layers={[
            { name: "Upgrade to .NET 8 (LTS)", tone: "emerald", icon: Rocket, sub: "step 1", body: <>Most of the meaningful runtime/EF/ASP.NET improvements you want are here. Supported through Nov 2026.</> },
            { name: "Audit dependencies for AOT (optional)", tone: "amber", icon: AlertTriangle, sub: "step 2", body: <>Only if you actually want AOT — most apps don&apos;t need it.</> },
            { name: "Jump to .NET 10 (LTS)", tone: "violet", icon: Sparkles, sub: "step 3", body: <>Skipping 9 is fine since 9 is STS.</> },
          ]}
        />
        <SubHeading accent={accent}>Key steps regardless of target</SubHeading>
        <UL items={[
          <>Update <IC>{"<TargetFramework>"}</IC>.</>,
          <>Update <IC>Microsoft.AspNetCore.*</IC> and <IC>Microsoft.EntityFrameworkCore.*</IC> to matching majors.</>,
          <>Run <IC>dotnet outdated</IC>.</>,
          <>Re-test serialization and EF queries.</>,
          <>Turn on Nullable and enable analyzers.</>,
        ]} />
      </Section>

      <StressTest questions={[
        "What does Dynamic PGO actually do, and why is it free perf?",
        "When would you reach for keyed services vs a factory pattern?",
        "What's the difference between Output Caching and Response Caching?",
        "Why was EF Core's ExecuteUpdate a big deal compared to 'load, mutate, SaveChanges'?",
        "What does .NET 10's Native AOT support unlock, and what does it still break?",
      ]} />

      <Samples dir="code-samples/Day5-Deltas/" files={[
        "01-net8-keyed-di.cs",
        "02-net8-output-cache-ratelimit.cs",
        "03-net8-primary-constructors.cs",
        "04-net9-openapi-builtin.cs",
        "05-net10-field-and-extensions.cs",
      ]} />
    </div>
  );
}

// ─── Day 6 — AI Foundations in .NET ──────────────────────────────────────────

function Day6() {
  const accent: ToneKey = "rose";
  return (
    <div>
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.rose.border, TONE.rose.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.rose.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.rose.text)}>Why this day matters</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              Today is the building side of AI in .NET; tomorrow is evaluation.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "6.1", title: "Three layers of LLM work in .NET" },
          { num: "6.2", title: "The simple shape — calling an LLM" },
          { num: "6.3", title: "The Microsoft.Extensions.AI abstraction" },
          { num: "6.4", title: "Streaming" },
          { num: "6.5", title: "Tool / function calling" },
          { num: "6.6", title: "Embeddings & RAG" },
          { num: "6.7", title: "Semantic Kernel — when to step up" },
          { num: "6.8", title: "Where ML.NET fits" },
          { num: "6.9", title: "Production concerns" },
        ]}
      />

      {/* ── 6.1 ──────────────────────────────────────────────────────────── */}
      <Section num="6.1" kicker="Stack" title="The three layers of LLM work in .NET" icon={Layers} accent="rose">
        <LayerStack
          layers={[
            { name: "Semantic Kernel", tone: "violet", icon: Workflow, sub: "orchestration", body: <>Planners, plugins, agents, memory. Sits <em>on top of</em> <IC>Microsoft.Extensions.AI</IC>.</> },
            { name: "Microsoft.Extensions.AI", tone: "rose", icon: Boxes, sub: "abstraction", body: <><IC>IChatClient</IC>, <IC>IEmbeddingGenerator</IC>. Swap providers, stack middleware. <strong className="text-slate-800 dark:text-slate-200">Microsoft is investing here heavily.</strong></> },
            { name: "Direct provider SDK", tone: "blue", icon: Cpu, sub: "raw", body: <>Anthropic SDK, official OpenAI (<IC>OpenAI</IC> NuGet), Azure OpenAI. Best when you only target one provider.</> },
          ]}
        />
        <Callout tone="rose" icon={Lightbulb}>
          You want all three in your head. Build day-to-day on <IC>Microsoft.Extensions.AI</IC>; reach for Semantic Kernel when you need agentic orchestration.
        </Callout>
      </Section>

      {/* ── 6.2 ──────────────────────────────────────────────────────────── */}
      <Section num="6.2" kicker="Basics" title="The simple shape — calling an LLM" icon={Zap} accent="rose">
        <P>The mental model: send a list of messages, get a message back, maybe with tool calls.</P>
        <CodeBlock code={`using Microsoft.Extensions.AI;
using OpenAI;

IChatClient client = new OpenAIClient(apiKey)
    .GetChatClient("gpt-4o-mini")
    .AsIChatClient();

var response = await client.GetResponseAsync(
    [new ChatMessage(ChatRole.User, "Summarize this in one sentence: ...")]);

Console.WriteLine(response.Text);`} />
        <Callout tone="blue" icon={Lightbulb}>
          For Anthropic (Claude) on .NET, use the <IC>Anthropic.SDK</IC> NuGet or call the REST API via a typed <IC>HttpClient</IC>. The <IC>Microsoft.Extensions.AI</IC> ecosystem has third-party <IC>IChatClient</IC> adapters for Anthropic too.
        </Callout>
      </Section>

      {/* ── 6.3 ──────────────────────────────────────────────────────────── */}
      <Section num="6.3" kicker="Pipeline" title="The Microsoft.Extensions.AI abstraction" icon={Workflow} accent="rose">
        <SubHeading accent={accent}>Core interfaces</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard
            title="IChatClient"
            tone="rose"
            icon={Workflow}
            badge="chat"
            rows={[
              { label: "Methods", value: <><IC>GetResponseAsync</IC> + <IC>GetStreamingResponseAsync</IC></> },
              { label: "Use for", value: "Any chat-style interaction" },
            ]}
          />
          <CompareCard
            title="IEmbeddingGenerator<string, Embedding<float>>"
            tone="violet"
            icon={Boxes}
            badge="vectors"
            rows={[
              { label: "Methods", value: <><IC>GenerateAsync(IEnumerable&lt;string&gt;)</IC></> },
              { label: "Use for", value: "RAG, semantic search, classification" },
            ]}
          />
        </div>
        <P>Wrapping clients gives you a <strong className="text-slate-800 dark:text-slate-200">middleware-like pipeline</strong> — logging, telemetry, caching, function-calling, retries:</P>
        <CodeBlock code={`builder.Services.AddChatClient(svc =>
    new OpenAIClient(config["OpenAI:Key"]!).GetChatClient("gpt-4o-mini").AsIChatClient())
    .UseLogging()
    .UseFunctionInvocation()
    .UseOpenTelemetry()
    .UseDistributedCache();`} />
        <Callout tone="emerald" icon={CheckCircle2}>
          Each <IC>Use*</IC> wraps the inner client — same idea as ASP.NET middleware. Composable cross-cutting concerns.
        </Callout>
      </Section>

      {/* ── 6.4 ──────────────────────────────────────────────────────────── */}
      <Section num="6.4" kicker="UX" title="Streaming" icon={Zap} accent="rose">
        <P>Stream tokens to the user for any latency-sensitive UX.</P>
        <CodeBlock code={`await foreach (var update in client.GetStreamingResponseAsync(messages, ct: ct))
{
    foreach (var part in update.Contents)
        if (part is TextContent text)
            await response.WriteAsync(text.Text, ct);
}`} />
        <Callout tone="blue" icon={Lightbulb}>
          In ASP.NET Core, expose this as a <IC>text/event-stream</IC> (SSE) endpoint or use a WebSocket / SignalR.
        </Callout>
      </Section>

      {/* ── 6.5 ──────────────────────────────────────────────────────────── */}
      <Section num="6.5" kicker="Tools" title="Tool / function calling" icon={Code2} accent="rose">
        <P>You give the model a list of tool definitions; it returns &quot;call this tool with these args&quot;; you execute and feed the result back. <IC>Microsoft.Extensions.AI</IC> automates the loop:</P>
        <CodeBlock code={`[Description("Get current weather for a city.")]
static string GetWeather(string city)
    => $"{city}: 18°C, partly cloudy";

var options = new ChatOptions
{
    Tools = [AIFunctionFactory.Create(GetWeather)]
};

var response = await client.GetResponseAsync(
    [new ChatMessage(ChatRole.User, "What's the weather in Helsinki?")],
    options);`} />
        <Callout tone="emerald" icon={Sparkles}>
          With <IC>.UseFunctionInvocation()</IC> in the pipeline, the framework auto-executes the function and round-trips back to the model.
        </Callout>
      </Section>

      {/* ── 6.6 ──────────────────────────────────────────────────────────── */}
      <Section num="6.6" kicker="Retrieval" title="Embeddings & RAG" icon={Database} accent="rose">
        <P><strong className="text-slate-800 dark:text-slate-200">RAG</strong> (Retrieval-Augmented Generation): when the user asks a question, retrieve relevant chunks from your data, stuff them in the prompt, ask the model.</P>

        <SubHeading accent={accent}>The pipeline</SubHeading>
        <ol className="flex flex-wrap items-center gap-2 my-4">
          <li className="flex items-center gap-2">
            <Chip tone="violet">1. Ingest</Chip>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          </li>
          <li className="flex items-center gap-2">
            <Chip tone="blue">2. Query-time retrieval</Chip>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
          </li>
          <li className="flex items-center gap-2">
            <Chip tone="emerald">3. Generate</Chip>
          </li>
        </ol>
        <LayerStack
          layers={[
            { name: "Ingest", tone: "violet", icon: Boxes, sub: "offline", body: <>Chunk documents, embed each chunk, store (text, embedding, metadata) in a vector store.</> },
            { name: "Query-time retrieval", tone: "blue", icon: Database, sub: "online", body: <>Embed the user&apos;s question, do a vector similarity search, take top K chunks, format them into the prompt.</> },
            { name: "Generate", tone: "emerald", icon: Sparkles, sub: "online", body: <>Call the LLM with the augmented prompt.</> },
          ]}
        />
        <CodeBlock code={`IEmbeddingGenerator<string, Embedding<float>> embeddings = ...;

var docVectors = await embeddings.GenerateAsync(documents.Select(d => d.Text));
// store (doc, vector) in your vector DB

// at query time
var queryVec = (await embeddings.GenerateAsync([question])).First();
var top = vectorStore.SearchTopK(queryVec, k: 5);
var prompt = $"""
    Answer the question using only the context below.

    Context:
    {string.Join("\\n---\\n", top.Select(t => t.Text))}

    Question: {question}
    """;
var answer = await chatClient.GetResponseAsync([new ChatMessage(ChatRole.User, prompt)]);`} />

        <SubHeading accent={accent}>Vector stores on .NET (mid-2026)</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard title="SQL Server 2025 vector" tone="blue" icon={Database} badge="if you have SQL" rows={[{ label: "What", value: <><IC>vector(n)</IC> + <IC>VECTOR_DISTANCE</IC>. Simplest path if you&apos;re already on SQL Server.</> }]} />
          <CompareCard title="Postgres + pgvector" tone="emerald" icon={Database} badge="open" rows={[{ label: "What", value: "Great open option. Npgsql + EF Core 9/10 support." }]} />
          <CompareCard title="Azure AI Search" tone="violet" icon={Server} badge="managed" rows={[{ label: "What", value: "Managed, hybrid (vector + keyword) search." }]} />
          <CompareCard title="Qdrant / Milvus / Weaviate" tone="amber" icon={Boxes} badge="dedicated" rows={[{ label: "What", value: "Dedicated vector DBs, all have .NET clients." }]} />
        </div>
      </Section>

      {/* ── 6.7 ──────────────────────────────────────────────────────────── */}
      <Section num="6.7" kicker="Orchestration" title="Semantic Kernel — when to step up" icon={Workflow} accent="rose">
        <SubHeading accent={accent}>What SK gives you</SubHeading>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <CompareCard title="Plugins" tone="violet" icon={Boxes} badge="functions" rows={[{ label: "What", value: "Collections of functions the kernel knows about." }]} />
          <CompareCard title="Planners" tone="blue" icon={Workflow} badge="autonomy" rows={[{ label: "What", value: "Let the model figure out which plugin functions to chain." }]} />
          <CompareCard title="Memory" tone="emerald" icon={Database} badge="built-in RAG" rows={[{ label: "What", value: "Out-of-the-box RAG with vector stores." }]} />
          <CompareCard title="Agents" tone="rose" icon={Cpu} badge="multi-persona" rows={[{ label: "What", value: "Multiple specialized personas cooperating with handoff and group chat." }]} />
        </div>
        <Callout tone="amber" icon={Lightbulb} title="The choice">
          Use SK when building an agent or a multi-step workflow over tools. Stick to plain <IC>Microsoft.Extensions.AI</IC> when you&apos;re just calling a model with tools.
        </Callout>
      </Section>

      {/* ── 6.8 ──────────────────────────────────────────────────────────── */}
      <Section num="6.8" kicker="Classical ML" title="Where ML.NET fits" icon={Cpu} accent="rose">
        <P>ML.NET is for <strong className="text-slate-800 dark:text-slate-200">classical ML in C#</strong> — regression, classification, recommendation, anomaly detection. It also hosts ONNX models, so you can run a converted model (BERT, ResNet, even smaller LLMs) locally.</P>
        <Callout tone="blue" icon={Lightbulb}>
          For most &quot;AI in .NET&quot; work today you&apos;ll use LLM APIs and embeddings, not ML.NET. Reach for ML.NET for tabular ML in-process (fraud scoring, propensity models) or for running an ONNX model offline / on-device.
        </Callout>
      </Section>

      {/* ── 6.9 ──────────────────────────────────────────────────────────── */}
      <Section num="6.9" kicker="Ship it" title="Production concerns" icon={Server} accent="rose">
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.rose.text)}>Secrets</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Use <IC>IConfiguration</IC> + Azure Key Vault or env vars; never check keys in.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.amber.text)}>Rate limiting</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Wrap calls. OpenAI/Anthropic return 429s.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.blue.border, TONE.blue.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.blue.text)}>Token budgets</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Count tokens before sending; truncate aggressively. <IC>Microsoft.ML.Tokenizers</IC> ships official tokenizers for GPT-4o etc.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.emerald.border, TONE.emerald.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.emerald.text)}>Caching</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">For deterministic queries, cache responses (key by prompt hash). <IC>UseDistributedCache()</IC> in the pipeline.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.violet.border, TONE.violet.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.violet.text)}>Observability</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"><IC>UseOpenTelemetry()</IC> emits semantic-conventions traces (model, tokens in/out, latency). Wire to your APM.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.cyan.border, TONE.cyan.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.cyan.text)}>Cost tracking</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Log token usage per request; aggregate by user/feature.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.rose.text)}>Streaming + cancellation</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Propagate <IC>HttpContext.RequestAborted</IC> into the LLM call; if the user closes the tab, stop generating.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.amber.text)}>PII</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Consider client-side redaction before sending.</p>
          </div>
        </div>
      </Section>

      <Pitfalls items={[
        <>Storing chat history forever — context window costs grow per turn. Summarize old turns, or keep only the last N + a running summary.</>,
        <>Naïve RAG retrieval — pure vector search misses keyword matches. Use hybrid (vector + BM25) when possible.</>,
        <>Tool-calling infinite loops — the model keeps asking for tool calls. Cap iterations (<IC>MaxOutputItems</IC>) and have a fallback.</>,
        <>Treating LLMs as deterministic — they aren&apos;t. Tomorrow&apos;s lesson exists for a reason.</>,
      ]} />

      <StressTest questions={[
        "Why is IChatClient a better starting point than OpenAIClient directly?",
        "What does .UseFunctionInvocation() do, and what would you have to write without it?",
        "Sketch a RAG pipeline. Where does each component live in your project?",
        "What does Semantic Kernel give you that raw Microsoft.Extensions.AI doesn't?",
        "Three things you must do before shipping an LLM feature to production.",
      ]} />

      <Samples dir="code-samples/Day6-AI/" files={[
        "01-openai-direct.cs — raw OpenAI SDK call",
        "02-extensions-ai.cs — IChatClient + pipeline",
        "03-tool-calling.cs — AIFunctionFactory + auto-invocation",
        "04-rag-pipeline.cs — chunking, embedding, retrieval, generation end-to-end",
        "05-semantic-kernel.cs — kernel + plugin + planner",
      ]} />
    </div>
  );
}

// ─── Day 7 — AI Evaluation in .NET ───────────────────────────────────────────

function Day7() {
  const accent: ToneKey = "violet";
  return (
    <div>
      <div className={cn("rounded-2xl border-2 p-5 my-2", TONE.violet.border, TONE.violet.bg)}>
        <div className="flex items-start gap-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.violet.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em] mb-1", TONE.violet.text)}>Why this day matters</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              This is what most teams skip and then regret. Models are non-deterministic. Without evals, you have no idea whether your last prompt change made things better or worse.
            </p>
          </div>
        </div>
      </div>

      <TableOfContents
        accent={accent}
        items={[
          { num: "7.1", title: "Why evals" },
          { num: "7.2", title: "The three flavors of eval" },
          { num: "7.3", title: "Golden datasets" },
          { num: "7.4", title: "Microsoft.Extensions.AI.Evaluation" },
          { num: "7.5", title: "Building your own evaluator" },
          { num: "7.6", title: "LLM-as-judge done well" },
          { num: "7.7", title: "RAG-specific metrics" },
          { num: "7.8", title: "Wiring evals into CI" },
          { num: "7.9", title: "Production monitoring" },
        ]}
      />

      {/* ── 7.1 ──────────────────────────────────────────────────────────── */}
      <Section num="7.1" kicker="Foundation" title="Why evals" icon={BarChart3} accent="violet">
        <Callout tone="rose" icon={AlertTriangle} title="The headline">
          You wouldn&apos;t ship a backend refactor without unit tests. <strong className="text-slate-800 dark:text-slate-200">Don&apos;t ship LLM features without evals.</strong>
        </Callout>
        <SubHeading accent={accent}>What can change underneath you</SubHeading>
        <ul className="space-y-2 my-3">
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="rose">provider</Chip>
            <span>Model version upgrades (provider-side).</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="amber">prompt</Chip>
            <span>Your prompt template tweaks.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="blue">pipeline</Chip>
            <span>Retrieval / embedding pipeline changes.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="violet">tools</Chip>
            <span>Tool implementations and parameters.</span>
          </li>
          <li className="flex gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Chip tone="emerald">config</Chip>
            <span>Model temperature, max tokens, sampling.</span>
          </li>
        </ul>
        <P>Any of those can degrade output silently. <strong className="text-slate-800 dark:text-slate-200">Evals = automated regression tests for AI behavior.</strong></P>
      </Section>

      {/* ── 7.2 ──────────────────────────────────────────────────────────── */}
      <Section num="7.2" kicker="Flavors" title="The three flavors of eval" icon={Layers} accent="violet">
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard
            title="Code-based metrics"
            tone="emerald"
            icon={Code2}
            badge="deterministic"
            rows={[
              { label: "What", value: "Compute a number from output" },
              { label: "Examples", value: "JSON schema, BLEU, ROUGE, exact match, latency, tokens, recall@k" },
              { label: "Best for", value: "Fast feedback in CI" },
            ]}
          />
          <CompareCard
            title="LLM-as-judge"
            tone="violet"
            icon={Sparkles}
            badge="model grades model"
            rows={[
              { label: "What", value: "Stronger model grades output" },
              { label: "Examples", value: "Faithfulness, relevance, coherence, pairwise A vs B" },
              { label: "Best for", value: "Nuanced quality at scale" },
            ]}
          />
          <CompareCard
            title="Human review"
            tone="rose"
            icon={Cpu}
            badge="ground truth"
            rows={[
              { label: "What", value: "People grade" },
              { label: "Examples", value: "Golden-set creation, spot checks" },
              { label: "Best for", value: "The actual truth" },
            ]}
          />
        </div>
        <Callout tone="amber" icon={Lightbulb}>
          You want all three. Code-based for fast CI; LLM-as-judge for nuanced quality; human review for the truth.
        </Callout>
      </Section>

      {/* ── 7.3 ──────────────────────────────────────────────────────────── */}
      <Section num="7.3" kicker="Datasets" title="Golden datasets" icon={Database} accent="violet">
        <P>A <strong className="text-slate-800 dark:text-slate-200">golden set</strong> is a curated list of <IC>(input, expected_output_or_criteria, metadata)</IC> you evaluate against. Build it from real user queries (anonymized), hand-crafted edge cases, and past production bugs.</P>
        <SubHeading accent={accent}>Aim for</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard title="Coverage" tone="emerald" icon={CheckCircle2} badge="breadth" rows={[{ label: "What", value: "Happy paths + edge cases + known failure modes" }]} />
          <CompareCard title="Stratification" tone="blue" icon={Layers} badge="dimensions" rows={[{ label: "What", value: "By use case, language, complexity" }]} />
          <CompareCard title="Maintenance" tone="amber" icon={GitBranch} badge="ongoing" rows={[{ label: "What", value: "Review quarterly; remove stale cases" }]} />
        </div>
      </Section>

      {/* ── 7.4 ──────────────────────────────────────────────────────────── */}
      <Section num="7.4" kicker="Library" title="Microsoft.Extensions.AI.Evaluation" icon={Boxes} accent="violet">
        <P>Microsoft&apos;s official library on the <IC>Microsoft.Extensions.AI</IC> stack. Use it to define metrics, run evals, and produce reports.</P>
        <CodeBlock code={`using Microsoft.Extensions.AI;
using Microsoft.Extensions.AI.Evaluation;
using Microsoft.Extensions.AI.Evaluation.Quality;

// Set up evaluators backed by an "LLM-judge" client
IChatClient judge = new OpenAIClient(key).GetChatClient("gpt-4o").AsIChatClient();
ChatConfiguration chatConfig = new(judge);

var evaluator = new CompositeEvaluator(
    new CoherenceEvaluator(),
    new RelevanceEvaluator(),
    new GroundednessEvaluator());

// For each input, run your app, then evaluate
foreach (var test in goldenSet)
{
    var answer = await yourApp.AnswerAsync(test.Question);
    var result = await evaluator.EvaluateAsync(
        messages: [new ChatMessage(ChatRole.User, test.Question)],
        modelResponse: new ChatResponse(new ChatMessage(ChatRole.Assistant, answer)),
        chatConfig);

    foreach (var metric in result.Metrics.Values)
        Console.WriteLine($"{metric.Name}: {metric.Interpretation?.Rating} — {metric.Reason}");
}`} />
        <Callout tone="emerald" icon={CheckCircle2}>
          The library has reporting helpers that emit HTML reports you can publish from CI.
        </Callout>
      </Section>

      {/* ── 7.5 ──────────────────────────────────────────────────────────── */}
      <Section num="7.5" kicker="Custom" title="Building your own evaluator (the pattern)" icon={Code2} accent="violet">
        <CodeBlock code={`public class JsonSchemaEvaluator : IEvaluator
{
    public string Name => "JsonSchemaConformance";

    public ValueTask<EvaluationResult> EvaluateAsync(
        IEnumerable<ChatMessage> messages,
        ChatResponse modelResponse,
        ChatConfiguration? chatConfig,
        IEnumerable<EvaluationContext>? additionalContext = null,
        CancellationToken ct = default)
    {
        var text = modelResponse.Text ?? "";
        bool valid;
        string? reason = null;
        try { JsonDocument.Parse(text); valid = true; }
        catch (JsonException ex) { valid = false; reason = ex.Message; }

        var metric = new BooleanMetric(Name, valid) { Reason = reason };
        return ValueTask.FromResult(new EvaluationResult(metric));
    }
}`} />
        <P>Combine with the built-ins in a <IC>CompositeEvaluator</IC>.</P>
      </Section>

      {/* ── 7.6 ──────────────────────────────────────────────────────────── */}
      <Section num="7.6" kicker="Judging" title="LLM-as-judge done well" icon={Sparkles} accent="violet">
        <SubHeading accent={accent}>Pitfalls and mitigations</SubHeading>
        <div className="space-y-2 my-3">
          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.rose.text)}>Position bias</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Judges prefer the first option in pairwise prompts. <strong className="text-slate-800 dark:text-slate-200">Fix:</strong> randomize order, or evaluate both orders and average.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.amber.text)}>Length bias</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Judges prefer longer answers. <strong className="text-slate-800 dark:text-slate-200">Fix:</strong> tell the judge to ignore length.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.rose.border, TONE.rose.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.rose.text)}>Self-preference</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">A model judging itself rates itself higher. <strong className="text-slate-800 dark:text-slate-200">Fix:</strong> use a <em>different</em>, stronger model as judge.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.amber.text)}>Inconsistency</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Temperature noise. <strong className="text-slate-800 dark:text-slate-200">Fix:</strong> run the judge multiple times and majority-vote, or set temperature low.</p>
          </div>
        </div>
        <SubHeading accent={accent}>Useful judge patterns</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard title="Rubric-based" tone="blue" icon={CheckCircle2} badge="checklist" rows={[{ label: "How", value: "Judge sees a checklist, scores each item" }]} />
          <CompareCard title="Reference-based" tone="emerald" icon={GitBranch} badge="vs gold" rows={[{ label: "How", value: <>Judge sees a reference &quot;good answer&quot; and grades similarity</> }]} />
          <CompareCard title="Pairwise" tone="violet" icon={Workflow} badge="A vs B" rows={[{ label: "How", value: "Judge picks A vs B vs Tie" }]} />
        </div>
      </Section>

      {/* ── 7.7 ──────────────────────────────────────────────────────────── */}
      <Section num="7.7" kicker="RAG" title="RAG-specific metrics" icon={Database} accent="violet">
        <P>If you&apos;re building RAG, evaluate three things <strong className="text-slate-800 dark:text-slate-200">separately</strong>:</P>
        <LayerStack
          layers={[
            { name: "Retrieval quality", tone: "blue", icon: Database, sub: "step 1", body: <>Did we get the right chunks? Precision@k, Recall@k against a labeled set.</> },
            { name: "Groundedness / faithfulness", tone: "amber", icon: CheckCircle2, sub: "step 2", body: <>Does the answer cite only what&apos;s in the context? LLM-as-judge or rule-based.</> },
            { name: "Answer quality", tone: "emerald", icon: Sparkles, sub: "step 3", body: <>Relevance, completeness, factual correctness.</> },
          ]}
        />
        <Callout tone="amber" icon={Lightbulb}>
          Optimizing one metric at a time is more sane than chasing a single composite score.
        </Callout>
      </Section>

      {/* ── 7.8 ──────────────────────────────────────────────────────────── */}
      <Section num="7.8" kicker="CI" title="Wiring evals into CI" icon={Workflow} accent="violet">
        <SubHeading accent={accent}>The mature three-tier pattern</SubHeading>
        <div className="grid sm:grid-cols-3 gap-3 my-4">
          <CompareCard title="Smoke evals on PR" tone="emerald" icon={Zap} badge="< 2 min" rows={[{ label: "Scope", value: "20–50 case golden set" }, { label: "Action", value: "Blocks PR on threshold breach" }]} />
          <CompareCard title="Full eval nightly" tone="blue" icon={BarChart3} badge="full set" rows={[{ label: "Scope", value: "Entire golden set" }, { label: "Action", value: "Posted to Slack / dashboard" }]} />
          <CompareCard title="Production sampling" tone="violet" icon={Server} badge="continuous" rows={[{ label: "Scope", value: "Sample real responses" }, { label: "Action", value: "Grade periodically, feed failures back" }]} />
        </div>
        <CodeBlock label="// xUnit example: a 'smoke eval' test" code={`[Fact]
public async Task SupportBot_meets_quality_bar_on_smoke_set()
{
    var failures = new List<string>();
    foreach (var test in SmokeSet.Load())
    {
        var answer = await _app.AnswerAsync(test.Q);
        var result = await _evaluator.EvaluateAsync(test, answer);
        if (result.Score < test.Threshold)
            failures.Add($"{test.Id}: {result.Score} < {test.Threshold} — {result.Reason}");
    }
    Assert.Empty(failures); // dump all failures, not just first
}`} />
      </Section>

      {/* ── 7.9 ──────────────────────────────────────────────────────────── */}
      <Section num="7.9" kicker="Observability" title="Production monitoring" icon={BarChart3} accent="violet">
        <P>Logs alone aren&apos;t enough. You want:</P>
        <div className="grid sm:grid-cols-2 gap-3 my-4">
          <div className={cn("rounded-xl border p-4", TONE.violet.border, TONE.violet.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.violet.text)}>Per-call telemetry</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Model, tokens in/out, latency, cost, tool calls, error class. <IC>Microsoft.Extensions.AI.UseOpenTelemetry()</IC> emits this via OTel semantic conventions for GenAI.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.blue.border, TONE.blue.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.blue.text)}>Sampling for offline grading</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Store full prompt + response for 1–5% of traffic for later eval.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.emerald.border, TONE.emerald.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.emerald.text)}>Live shadow evals</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Pass real traffic through a stronger judge async; alert if a daily rolling average drops.</p>
          </div>
          <div className={cn("rounded-xl border p-4", TONE.amber.border, TONE.amber.bg)}>
            <h4 className={cn("text-sm font-bold mb-1", TONE.amber.text)}>User feedback signals</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">Thumbs up/down, copy/abandon, follow-up message rates.</p>
          </div>
        </div>
      </Section>

      <Pitfalls items={[
        <>No eval at all. The worst state. Even 20 hand-graded cases beat zero.</>,
        <>Single composite score. Hides where quality is shifting. Track multiple metrics.</>,
        <>Judge model never updated. When the judge gets dumber than your main model, evals get noisy.</>,
        <>Drift in your golden set. As your product evolves, old cases become irrelevant — prune.</>,
        <>Manual eval that never happens. Anything not in CI rots. Automate or accept it&apos;ll lapse.</>,
      ]} />

      <StressTest questions={[
        "Name three eval flavors and one strength of each.",
        "What's a golden set, and what makes a good one?",
        "What's position bias in LLM-as-judge, and how do you mitigate it?",
        "For a RAG app, what's the difference between retrieval quality and answer quality, and why must you measure them separately?",
        "Sketch a CI strategy with three eval tiers and what each one does.",
      ]} />

      <Samples dir="code-samples/Day7-Evaluation/" files={[
        "01-golden-set.cs — load + structure a golden set",
        "02-code-metrics.cs — schema check, latency, retrieval@k",
        "03-llm-judge.cs — rubric judge with position-bias mitigation",
        "04-extensions-ai-evaluation.cs — using the official lib",
        "05-ci-smoke-eval.cs — xUnit-style smoke test for PRs",
      ]} />

      <div className={cn("mt-10 rounded-2xl border-2 p-5", TONE.violet.border, TONE.violet.bg)}>
        <div className="flex items-start gap-3 mb-3">
          <Sparkles className={cn("h-5 w-5 shrink-0 mt-0.5", TONE.violet.text)} aria-hidden />
          <div>
            <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", TONE.violet.text)}>Final notes — keeping it stuck</p>
          </div>
        </div>
        <OL items={[
          <>After day 7, build a small RAG app (a chatbot over your old project documentation) with evals. The combination of all 7 days will become muscle memory in a way reading never will.</>,
          <>Read the runtime team&apos;s blog. <IC>devblogs.microsoft.com/dotnet</IC> is the single best source for &quot;what changed and why.&quot;</>,
          <>Read source. <IC>dotnet/runtime</IC> and <IC>dotnet/aspnetcore</IC> on GitHub are unusually readable. When you wonder &quot;what does AddScoped <em>do</em>?&quot; — go read it. It&apos;s 60 lines.</>,
          <>Keep this guide. Re-read sections when you hit them in real work.</>,
        ]} />
      </div>
    </div>
  );
}

// ─── Day config ────────────────────────────────────────────────────────────────

const DAY_COMPONENTS = [Day1, Day2, Day3, Day4, Day5, Day6, Day7];

const DAYS = [
  { num: 1, shortLabel: "Runtime", label: "Runtime & Language Internals", icon: "⚙️", accent: "violet" as AccentKey },
  { num: 2, shortLabel: "ASP.NET", label: "ASP.NET Core Deep Dive", icon: "🌐", accent: "blue" as AccentKey },
  { num: 3, shortLabel: "EF Core", label: "EF Core & Data Access", icon: "🗄️", accent: "emerald" as AccentKey },
  { num: 4, shortLabel: "Arch.", label: "Architecture & Patterns", icon: "🏗️", accent: "amber" as AccentKey },
  { num: 5, shortLabel: "Updates", label: ".NET 6 → 10 Deltas", icon: "🔄", accent: "cyan" as AccentKey },
  { num: 6, shortLabel: "AI Build", label: "AI Foundations in .NET", icon: "🤖", accent: "rose" as AccentKey },
  { num: 7, shortLabel: "AI Eval", label: "AI Evaluation in .NET", icon: "📊", accent: "violet" as AccentKey },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function DotNetMasteryGuide() {
  const [active, setActive] = useState(0);
  const day = DAYS[active];
  const DayComponent = DAY_COMPONENTS[active];

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      {/* How to use */}
      <div className="mb-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">How to use this guide</p>
        <ul className="space-y-1">
          {[
            "Read one day per sitting. Don't rush.",
            "After reading, open the code samples folder and run / step through them in your IDE.",
            "At the end of each day, expand the Stress test and answer the questions out loud before moving on.",
            "Keep this as a long-term reference — every section is self-contained.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="text-slate-300 dark:text-slate-600 shrink-0">·</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Day tabs */}
      <div role="tablist" aria-label="Days" className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {DAYS.map((d, i) => (
          <button
            key={d.num}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap",
              i === active
                ? cn("shadow-sm border", ACCENT[d.accent].tab)
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <span>{d.icon}</span>
            <span className="hidden sm:inline">Day {d.num} · {d.shortLabel}</span>
            <span className="sm:hidden">D{d.num}</span>
          </button>
        ))}
      </div>

      {/* Day header */}
      <div className="mb-6 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded", ACCENT[day.accent].badge)}>Day {day.num}</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{day.label}</h2>
      </div>

      {/* Content */}
      <div role="tabpanel">
        <DayComponent />
      </div>
    </article>
  );
}
