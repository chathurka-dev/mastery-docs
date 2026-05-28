"use client";

import { useState, useRef } from "react";
import {
  Lightbulb,
  Package,
  BarChart3,
  Zap,
  Layers,
  Cpu,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Code2,
  HardDrive,
  Wrench,
  GitBranch,
  Boxes,
  Recycle,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Accent map (per DOC_STYLE_GUIDE §3) ──────────────────────────────────

const accentMap: Record<
  string,
  { border: string; bg: string; text: string; ring: string; chipBg: string }
> = {
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

// ─── Tab definitions ──────────────────────────────────────────────────────

type TabId = "stack" | "memory" | "async" | "modern" | "pitfalls";

const TABS: { id: TabId; label: string; Icon: typeof Layers }[] = [
  { id: "stack", label: "Stack & Compile", Icon: Layers },
  { id: "memory", label: "Memory & GC", Icon: HardDrive },
  { id: "async", label: "Async", Icon: Zap },
  { id: "modern", label: "Modern C#", Icon: Sparkles },
  { id: "pitfalls", label: "Pitfalls & Practice", Icon: AlertTriangle },
];

// ─── Root component ───────────────────────────────────────────────────────

export default function DotNetMasteryDay1() {
  const [tab, setTab] = useState<TabId>("stack");

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
          Mastery Guide · Day 1 of 7
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">
          Runtime &amp; Language Internals
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          The &ldquo;why&rdquo; behind what you&apos;ve been shipping for years.
        </p>
      </header>

      <Tabs tab={tab} setTab={setTab} />

      <div className="mt-8 space-y-6">
        {tab === "stack" && <StackTab />}
        {tab === "memory" && <MemoryTab />}
        {tab === "async" && <AsyncTab />}
        {tab === "modern" && <ModernCsTab />}
        {tab === "pitfalls" && <PitfallsTab />}
      </div>
    </article>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────

function Tabs({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next =
        e.key === "ArrowRight"
          ? (idx + 1) % TABS.length
          : (idx - 1 + TABS.length) % TABS.length;
      tabsRef.current[next]?.focus();
      setTab(TABS[next].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Day 1 sections"
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
              "flex-1 flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all",
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

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1 — STACK & COMPILE
// ═══════════════════════════════════════════════════════════════════════════

type LayerId = "host" | "clr" | "bcl" | "code";

const stackLayers: {
  id: LayerId;
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  body: string[];
  analogy: string;
}[] = [
  {
    id: "code",
    number: "4",
    title: "Your Code",
    subtitle: "C# / F# / VB → IL (.dll)",
    accent: "blue",
    body: [
      "You write C# (or F#/VB). Roslyn compiles it to CIL — Common Intermediate Language — and packages it into a managed assembly: a .dll containing IL bytecode plus metadata describing types, methods, attributes.",
      "CIL is platform-agnostic. The same .dll runs on Windows, Linux, macOS, x64, ARM64. It can&apos;t run as-is — it needs the CLR to turn it into machine code at runtime.",
    ],
    analogy:
      "Think of IL as a recipe written in standard English — it&apos;s portable, but a real chef has to read it and cook with whatever stove they have.",
  },
  {
    id: "bcl",
    number: "3",
    title: "BCL / Runtime Libraries",
    subtitle: "System.* types you use every day",
    accent: "emerald",
    body: [
      "string, List<T>, Task, Span<T>, HttpClient, Dictionary<K,V>, DateTime, JsonSerializer, all of System.Text.* and System.IO.* — these all live here. Implemented partly in C# and partly in C++ inside the runtime itself.",
      "100% open source at github.com/dotnet/runtime. When you wonder &lsquo;what does Task.Run actually do?&rsquo; you can go read it — usually clearer than a blog post.",
    ],
    analogy:
      "Think of the BCL as the standard kitchen toolkit that comes with the engine — pots, pans, knives. You don&apos;t bring your own; they&apos;re part of the platform.",
  },
  {
    id: "clr",
    number: "2",
    title: "CoreCLR",
    subtitle: "The runtime — written in C++",
    accent: "rose",
    body: [
      "The engine. CoreCLR loads your assemblies, JIT-compiles IL to native machine code, runs the garbage collector, manages threads, handles exceptions, performs P/Invoke calls into native code, and enforces type safety.",
      "Without CoreCLR, your .dll is inert bytecode. Without your .dll, CoreCLR has nothing to run. They&apos;re inseparable at runtime.",
    ],
    analogy:
      "Think of CoreCLR as the engine block — it does the actual mechanical work of running your program.",
  },
  {
    id: "host",
    number: "1",
    title: "Host",
    subtitle: "dotnet CLI / your app's apphost.exe",
    accent: "violet",
    body: [
      "The entry point. The dotnet command (or your published .exe) starts CoreCLR, points it at your assembly, and calls Main().",
      "For ASP.NET Core, this is also where the Generic Host + Kestrel boot up — but those are just managed code running on top of CoreCLR like any other library.",
    ],
    analogy:
      "Think of the host as the ignition key — it starts the engine and hands off control.",
  },
];

function StackTab() {
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);

  return (
    <section
      id="panel-stack"
      role="tabpanel"
      aria-labelledby="tab-stack"
      className="space-y-6"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Click any layer to dive in. Your code sits on top; the host sits at the
        bottom. The CLR connects them.
      </p>

      {/* The 4-layer stack — accordion */}
      <div className="space-y-1.5">
        {stackLayers.map((layer) => {
          const open = activeLayer === layer.id;
          const a = accentMap[layer.accent];
          return (
            <div key={layer.id} className="rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveLayer(open ? null : layer.id)}
                aria-expanded={open}
                aria-controls={`layer-${layer.id}`}
                className={cn(
                  "w-full flex items-center justify-between gap-4 px-4 py-3.5 border-2 rounded-xl transition-all text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800",
                  a.border,
                  a.ring,
                  open
                    ? a.bg
                    : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold",
                      a.chipBg,
                      a.text
                    )}
                    aria-hidden
                  >
                    {layer.number}
                  </span>
                  <div className="min-w-0">
                    <div className={cn("text-sm font-bold", a.text)}>
                      {layer.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {layer.subtitle}
                    </div>
                  </div>
                </div>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform flex-shrink-0",
                    a.text,
                    open ? "rotate-90" : "rotate-0"
                  )}
                  aria-hidden
                />
              </button>
              {open && (
                <div
                  id={`layer-${layer.id}`}
                  className={cn(
                    "px-5 py-4 mt-1.5 rounded-xl border-2",
                    a.border,
                    a.bg
                  )}
                >
                  <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {layer.body.map((p, i) => (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: p }}
                      />
                    ))}
                  </div>
                  <Callout tone="amber" icon={Lightbulb} className="mt-4">
                    <span
                      dangerouslySetInnerHTML={{ __html: layer.analogy }}
                    />
                  </Callout>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compilation pipeline */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          How C# becomes running CPU instructions
        </h3>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {[
            { label: "C# source", color: "violet" },
            { label: "Roslyn compiler", color: "blue" },
            { label: "IL bytecode (.dll)", color: "emerald" },
            { label: "JIT (CoreCLR)", color: "rose" },
            { label: "Native x64 / ARM64", color: "amber" },
            { label: "CPU executes", color: "blue" },
          ].map((step, i, arr) => {
            const a = accentMap[step.color];
            return (
              <li key={step.label} className="flex items-center gap-2">
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
                  <ArrowRight
                    className="h-3.5 w-3.5 text-slate-400"
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          The first three steps happen on{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            your machine
          </strong>{" "}
          (build time). The JIT step happens on{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            the server
          </strong>{" "}
          (runtime). R2R and AOT, below, move the JIT step earlier — at the cost
          of a bigger binary.
        </p>
      </div>

      {/* C# ≠ CLR — the most important slide of Day 1 */}
      <Callout
        tone="amber"
        icon={Lightbulb}
        title="C# ≠ CLR — they evolve independently"
      >
        <p>
          C# is a <strong>language</strong>; CLR is the <strong>runtime</strong>.
          New C# features fall into two buckets:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside marker:text-slate-400">
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">
              Compiler sugar
            </strong>{" "}
            — records, primary constructors, collection expressions. Bump{" "}
            <Code>LangVersion</Code> in your .csproj, target old .NET, still
            works.
          </li>
          <li>
            <strong className="text-rose-700 dark:text-rose-400">
              Runtime features
            </strong>{" "}
            — <Code>static abstract</Code> interface members, the new{" "}
            <Code>System.Threading.Lock</Code> type. Need a matching .NET
            version.
          </li>
        </ul>
      </Callout>

      {/* JIT tiering */}
      <JitTieringSection />

      {/* Method call lifecycle */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          Method call lifecycle — what really happens
        </h3>
        <ol className="space-y-3">
          {[
            {
              phase: "1st call",
              accent: "amber",
              desc: "Not compiled yet → JIT Tier 0 (fast, unoptimized) → cache native code → execute. You see a small spike.",
            },
            {
              phase: "2nd → Nth call",
              accent: "emerald",
              desc: "Already compiled → look up cached native code → execute. Steady-state fast.",
            },
            {
              phase: "Gets hot",
              accent: "rose",
              desc: "CLR re-JITs in background at Tier 1 with full inlining, devirtualization, vectorization. Atomic swap when ready.",
            },
            {
              phase: "Dynamic PGO (.NET 8+)",
              accent: "violet",
              desc: "Tier 0 secretly records type-flow and branch probabilities. Tier 1 uses that real data instead of guesses. Free 10–20% perf.",
            },
            {
              phase: "OSR (On-Stack Replacement)",
              accent: "blue",
              desc: "If a long-running loop is mid-execution, the JIT can swap the running stack frame from Tier 0 to Tier 1 without restarting the method. .NET 7+.",
            },
          ].map(({ phase, accent, desc }) => {
            const a = accentMap[accent];
            return (
              <li
                key={phase}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3"
              >
                <span
                  className={cn(
                    "self-start px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap border",
                    a.chipBg,
                    a.text,
                    a.border
                  )}
                >
                  {phase}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {desc}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Compile modes — the three deployment options */}
      <CompileModesSection />

      {/* Decision guide */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          Quick decision guide
        </h3>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {[
            {
              scenario: "Big ASP.NET Core / EF Core app",
              choice: "JIT + R2R",
              accent: "emerald",
            },
            {
              scenario: "Serverless / Lambda / Azure Functions",
              choice: "Native AOT or R2R",
              accent: "amber",
            },
            {
              scenario: "CLI tool / sidecar / small gRPC service",
              choice: "Native AOT",
              accent: "rose",
            },
            {
              scenario: "App with lots of reflection / dynamic plugins",
              choice: "JIT only",
              accent: "blue",
            },
            {
              scenario: "Container with cold-start budget < 200ms",
              choice: "Native AOT",
              accent: "violet",
            },
            {
              scenario: "Dev / test on your laptop",
              choice: "JIT (don&apos;t bother with R2R)",
              accent: "cyan",
            },
          ].map(({ scenario, choice, accent }) => {
            const a = accentMap[accent];
            return (
              <li
                key={scenario}
                className="py-3 flex items-center justify-between gap-3"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {scenario}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap",
                    a.chipBg,
                    a.text,
                    a.border
                  )}
                  dangerouslySetInnerHTML={{ __html: choice }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const jitStages = [
  {
    id: "t0",
    label: "Tier 0",
    accent: "amber",
    Icon: Zap,
    desc: "First call to a method — JIT compiles it FAST with minimal optimization. Code is correct, just unoptimized. App starts up quickly because no method is over-engineered before it&apos;s proven hot.",
    bullet: "Goal: get running fast.",
  },
  {
    id: "t1",
    label: "Tier 1",
    accent: "rose",
    Icon: Zap,
    desc: "Methods called frequently get re-compiled with full optimizations: inlining, devirtualization, loop unrolling, SIMD/vectorization. The CPU code emitted at Tier 1 is what hits steady-state perf benchmarks.",
    bullet: "Goal: peak performance for code that matters.",
  },
  {
    id: "pgo",
    label: "Dynamic PGO",
    accent: "violet",
    Icon: BarChart3,
    desc: "Default in .NET 8+. Tier 0 silently records runtime data — which types flow through a method, which branches are hot, which calls actually have one concrete target. Tier 1 uses that real-world data to make even better optimization decisions.",
    bullet: "Goal: optimize for YOUR workload, not a generic guess.",
  },
];

function JitTieringSection() {
  return (
    <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5 space-y-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
        <Zap className="h-4 w-4" aria-hidden />
        JIT tiering — three stages, not one
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        Older .NET (pre-Core 3.0) compiled every method once, with full
        optimizations. Result: slow startup. Modern .NET&apos;s answer is{" "}
        <strong>tiered compilation</strong> — methods first compile fast and
        cheap, then a select few get a second pass with the full optimizer.
      </p>

      {/* Tier cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {jitStages.map((stage) => {
          const a = accentMap[stage.accent];
          return (
            <div
              key={stage.id}
              className={cn(
                "rounded-xl border-2 p-4 bg-white dark:bg-slate-900",
                a.border
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full",
                    a.chipBg
                  )}
                >
                  <stage.Icon
                    className={cn("h-4 w-4", a.text)}
                    aria-hidden
                  />
                </span>
                <h4 className={cn("text-sm font-bold", a.text)}>
                  {stage.label}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                {stage.desc}
              </p>
              <p className={cn("text-xs italic", a.text)}>{stage.bullet}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const compileModes = [
  {
    id: "jit",
    label: "JIT (default)",
    accent: "blue",
    icon: Zap,
    startup: "Slow",
    startupNote: "JIT spike on first method calls",
    memory: "Moderate",
    memoryNote: "JIT engine resident in memory",
    perf: "Excellent",
    perfNote: "Tier 1 + dynamic PGO optimizations",
    pros: [
      "Full reflection support",
      "Dynamic code generation / Roslyn scripting",
      "Best compatibility with every library",
    ],
    cons: [
      "Slower cold start (200–800ms typical)",
      "Larger memory footprint (JIT engine + IL)",
      "Visible perf wobbles as Tier 0 → Tier 1 transitions happen",
    ],
    useFor:
      "Most production apps — web APIs, desktop, worker services, anything with reflection-heavy libraries",
  },
  {
    id: "r2r",
    label: "ReadyToRun",
    accent: "emerald",
    icon: Package,
    startup: "Fast",
    startupNote: "Pre-compiled native code ships with the .dll",
    memory: "Moderate",
    memoryNote: "JIT still loaded as fallback for hot paths",
    perf: "Excellent",
    perfNote: "Tier 1 still kicks in for hot methods",
    pros: [
      "Cold start drops 3–10× vs pure JIT",
      "Still supports reflection — IL is preserved alongside native",
      "JIT remains available as fallback (safe)",
      "No code changes needed",
    ],
    cons: [
      "Larger binary on disk (~30–50% bigger)",
      "Slightly slower publish step",
    ],
    useFor:
      "Production ASP.NET Core. Enable with <PublishReadyToRun>true</PublishReadyToRun>.",
  },
  {
    id: "aot",
    label: "Native AOT",
    accent: "amber",
    icon: Wrench,
    startup: "Instant",
    startupNote: "~10ms cold start, zero JIT warm-up",
    memory: "Tiny",
    memoryNote: "No JIT engine, no IL in memory",
    perf: "Very good",
    perfNote: "Slightly below JIT Tier 1 — no runtime re-optimization",
    pros: [
      "~10ms startup, single native binary",
      "Tiny memory footprint",
      "No JIT spikes, predictable latency",
      "Strips IL entirely → smaller attack surface",
    ],
    cons: [
      "No runtime code generation",
      "Reflection severely limited (compile-time analysis only)",
      "Breaks EF Core lazy-load proxies, Castle DynamicProxy",
      "System.Text.Json needs source generators",
    ],
    useFor:
      "CLI tools, serverless, gRPC microservices, sidecars, container-first workloads",
  },
];

function CompileModesSection() {
  const [activeMode, setActiveMode] = useState("jit");
  const mode = compileModes.find((m) => m.id === activeMode)!;
  const a = accentMap[mode.accent];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Three ways to ship .NET code
      </h3>

      {/* Mode selector */}
      <div
        className="grid grid-cols-3 gap-2"
        role="radiogroup"
        aria-label="Compile mode"
      >
        {compileModes.map((m) => {
          const ma = accentMap[m.accent];
          const active = activeMode === m.id;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={active}
              onClick={() => setActiveMode(m.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800",
                active
                  ? cn(ma.border, ma.bg, ma.text, ma.ring)
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <m.icon className="h-5 w-5" aria-hidden />
              <span className="text-xs sm:text-sm font-bold">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active mode panel */}
      <div
        className={cn(
          "rounded-xl border-2 p-5 bg-white dark:bg-slate-900",
          a.border
        )}
      >
        <dl className="space-y-3 mb-5">
          <Metric
            label="Startup"
            value={mode.startup}
            note={mode.startupNote}
          />
          <Metric label="Memory" value={mode.memory} note={mode.memoryNote} />
          <Metric
            label="Peak throughput"
            value={mode.perf}
            note={mode.perfNote}
          />
        </dl>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              ✓ Pros
            </h4>
            <ul className="space-y-1.5">
              {mode.pros.map((p) => (
                <li
                  key={p}
                  className="text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-300 dark:border-emerald-700"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">
              ⚠ Cons
            </h4>
            <ul className="space-y-1.5">
              {mode.cons.map((c) => (
                <li
                  key={c}
                  className="text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-rose-300 dark:border-rose-700"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={cn("rounded-lg px-4 py-3 border", a.border, a.bg)}
        >
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              a.text
            )}
          >
            Use for:{" "}
          </span>
          <span
            className="text-sm text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: mode.useFor }}
          />
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 w-32 flex-shrink-0">
        {label}
      </dt>
      <dd className="flex-1">
        <span className="text-base font-bold text-slate-900 dark:text-slate-100">
          {value}
        </span>
        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
          — {note}
        </span>
      </dd>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2 — MEMORY & GC
// ═══════════════════════════════════════════════════════════════════════════

function MemoryTab() {
  return (
    <section
      id="panel-memory"
      role="tabpanel"
      aria-labelledby="tab-memory"
      className="space-y-6"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Almost every .NET perf surprise traces back to allocations and the
        garbage collector. Lock this section in and the rest of the platform
        clicks into place.
      </p>

      <StackVsHeapSection />
      <BoxingDemoSection />
      <GcGenerationsSection />
      <ServerVsWorkstationGcSection />
      <AllocationPitfallsSection />
      <SpanVsMemorySection />
    </section>
  );
}

function StackVsHeapSection() {
  return (
    <div className="rounded-xl border-2 border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-3">
        <HardDrive className="h-4 w-4" aria-hidden />
        Stack vs heap — &ldquo;structs are on the stack&rdquo; is half-right
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        Where a value <em>actually</em> lives depends on{" "}
        <strong>context</strong>, not just whether it&apos;s a struct or class.
        Here are the five scenarios that cover everything.
      </p>
      <ul className="space-y-2">
        {[
          {
            kind: "Value type as a local variable",
            where: "Stack — or, if the JIT decides, a CPU register",
            note: "Includes int, double, bool, DateTime, your own structs.",
            accent: "emerald",
          },
          {
            kind: "Value type as a field of a class",
            where: "Inline on the heap, inside the containing object",
            note: "The struct doesn&apos;t get its own heap allocation — it lives within the class instance.",
            accent: "blue",
          },
          {
            kind: "Value type boxed to object / interface",
            where: "Heap (a fresh allocation per box)",
            note: "object o = 42; — that 42 just got a heap box. Unboxing copies it back to the stack.",
            accent: "rose",
          },
          {
            kind: "Reference type instance",
            where: "Always heap. The variable just holds a pointer.",
            note: "string, arrays, List<T>, your own classes — the object lives on the heap, the variable holds a 4 or 8 byte reference to it.",
            accent: "amber",
          },
          {
            kind: "ref struct (Span<T>, ReadOnlySpan<T>)",
            where: "Stack only — compiler enforces it cannot escape",
            note: "Can&apos;t be a field of a class, can&apos;t be boxed, can&apos;t cross an await. Those restrictions are exactly what makes it allocation-free.",
            accent: "violet",
          },
        ].map((row) => {
          const a = accentMap[row.accent];
          return (
            <li
              key={row.kind}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-1 rounded border whitespace-nowrap",
                    a.chipBg,
                    a.text,
                    a.border
                  )}
                >
                  {row.kind}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-slate-400"
                  aria-hidden
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {row.where}
                </span>
              </div>
              <p
                className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: row.note }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BoxingDemoSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
        Boxing — the invisible allocation
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        When you assign a value type to an <Code>object</Code> or interface
        variable, the runtime <strong>boxes</strong> it: copies the value to a
        fresh heap allocation and gives you a reference. It&apos;s easy to miss
        in code; it&apos;s painful in hot loops.
      </p>

      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-4 font-mono text-xs leading-relaxed overflow-x-auto mb-4">
        <div className="text-slate-500">{"// Boxing — 10 million heap allocations"}</div>
        <div className="text-slate-300">{"long sum = 0;"}</div>
        <div className="text-slate-300">{"for (int i = 0; i < 10_000_000; i++)"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-amber-300">{"    object boxed = i;        // alloc"}</div>
        <div className="pl-4 text-amber-300">{"    sum += (int)boxed;        // unbox + copy"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-500 mt-3">{"// No boxing — zero allocations"}</div>
        <div className="text-slate-300">{"long sum = 0;"}</div>
        <div className="text-slate-300">{"for (int i = 0; i < 10_000_000; i++)"}</div>
        <div className="pl-4 text-emerald-400">{"    sum += i;"}</div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
        Watch for: <Code>ArrayList</Code> (boxes every value type),{" "}
        <Code>object.Equals</Code> on structs, calling{" "}
        <Code>ToString()</Code> on a struct through an{" "}
        <Code>object</Code> reference, and LINQ <Code>Cast</Code>/
        <Code>OfType</Code> on value-type sequences.
      </p>
    </div>
  );
}

function GcGenerationsSection() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Recycle className="h-4 w-4" aria-hidden />
        The generational GC — five regions, three collection types
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        .NET&apos;s GC bets that <strong>most objects die young</strong>. So it
        sorts the heap into generations and collects the youngest aggressively;
        survivors get promoted and collected less often.
      </p>

      {/* 5 region cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {(
          [
            {
              gen: "Gen 0",
              desc: "Fresh allocations land here. Tiny region (a few MB). Collected very frequently — milliseconds. If your object dies here, it&apos;s essentially free.",
              cost: "~1 ms",
              color: "emerald",
            },
            {
              gen: "Gen 1",
              desc: "Objects that survive a Gen 0 collection get promoted here. Buffer zone between short and long-lived. Collections happen less often, still cheap.",
              cost: "~5 ms",
              color: "blue",
            },
            {
              gen: "Gen 2",
              desc: "The long-lived heap. Static caches, singletons, EF Core change tracker contents on a long request. A Gen 2 collection walks the WHOLE reachable graph.",
              cost: "10–100+ ms",
              color: "rose",
            },
            {
              gen: "LOH",
              desc: "Large Object Heap. Anything ≥ 85,000 bytes. Big arrays, big strings, big byte buffers. Compacted only when you opt in — fragments easily.",
              cost: "Expensive",
              color: "amber",
            },
            {
              gen: "POH (.NET 5+)",
              desc: "Pinned Object Heap. For objects you pin for unmanaged interop. Keeps pinning out of the regular heap where it would block compaction.",
              cost: "Special",
              color: "violet",
            },
          ] as const
        ).map(({ gen, desc, cost, color }) => {
          const a = accentMap[color];
          return (
            <div
              key={gen}
              className={cn(
                "rounded-lg border-2 p-3 bg-white dark:bg-slate-900",
                a.border
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={cn("text-sm font-bold", a.text)}>{gen}</div>
                <span
                  className={cn(
                    "text-[0.65rem] font-mono font-bold px-1.5 py-0.5 rounded",
                    a.chipBg,
                    a.text
                  )}
                >
                  {cost}
                </span>
              </div>
              <p
                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: desc }}
              />
            </div>
          );
        })}
      </div>

      {/* Promotion flow */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Promotion flow — objects move &ldquo;up&rdquo; if they keep surviving
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {(
            [
              { label: "Allocated", color: "emerald" },
              { label: "Gen 0", color: "emerald" },
              { label: "Gen 1", color: "blue" },
              { label: "Gen 2", color: "rose" },
              { label: "Stays in Gen 2", color: "rose" },
            ] as const
          ).map((step, i, arr) => {
            const a = accentMap[step.color];
            return (
              <div key={step.label} className="flex items-center gap-2">
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
                  <ArrowRight
                    className="h-3.5 w-3.5 text-slate-400"
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Callout tone="amber" icon={Lightbulb} title="The cardinal rule">
        Keep allocations short-lived so they die in Gen 0.{" "}
        <strong>The cheapest collection is one that finds nothing alive.</strong>{" "}
        Caches and long-lived collections (the change tracker on a long EF
        operation, big in-memory arrays) push objects into Gen 2 — and Gen 2
        collections are the ones that show up in latency tail.
      </Callout>
    </div>
  );
}

function ServerVsWorkstationGcSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
        Workstation vs Server GC — pick the right one
      </h3>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {(
          [
            {
              mode: "Workstation",
              use: "Client apps, low-core machines, tools, sidecars",
              detail:
                "One heap, one GC thread. Concurrent (background) GC by default. Lower memory footprint, lower throughput, lower pause times.",
              color: "blue",
            },
            {
              mode: "Server (default for ASP.NET Core)",
              use: "ASP.NET Core, worker services, anything on multi-core boxes",
              detail:
                "One heap per logical processor, parallel GC threads. Higher throughput at the cost of more memory. Slightly longer (but parallel) pauses.",
              color: "emerald",
            },
          ] as const
        ).map(({ mode, use, detail, color }) => {
          const a = accentMap[color];
          return (
            <div
              key={mode}
              className={cn("rounded-lg border-2 p-3", a.border, a.bg)}
            >
              <div className={cn("text-sm font-bold mb-1.5", a.text)}>
                {mode}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                {use}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                {detail}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
        Configure in your .csproj
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-300">{"<PropertyGroup>"}</div>
        <div className="pl-4 text-emerald-400">
          {"  <ServerGarbageCollection>true</ServerGarbageCollection>"}
        </div>
        <div className="pl-4 text-emerald-400">
          {"  <ConcurrentGarbageCollection>true</ConcurrentGarbageCollection>"}
        </div>
        <div className="text-slate-300">{"</PropertyGroup>"}</div>
      </div>
    </div>
  );
}

function AllocationPitfallsSection() {
  const items = [
    {
      id: "linq",
      title: "LINQ chains in hot paths",
      symptom:
        "Each query operator allocates: an enumerator, lambda closures (if you capture locals), and any intermediate result. Looks harmless, adds up under load.",
      fix: "In hot loops, hand-roll the loop or use Span<T>. For occasional code, LINQ is fine. .NET 9 added Enumerable optimizations that reduce some allocations, but the rule still holds.",
      code: [
        "// BAD in a hot loop — alloc per query",
        "var found = items.Where(x => x.IsActive).FirstOrDefault();",
        "",
        "// GOOD",
        "Item? found = null;",
        "foreach (var x in items)",
        "    if (x.IsActive) { found = x; break; }",
      ],
      accent: "rose",
    },
    {
      id: "string",
      title: "string.Format and + concatenation",
      symptom:
        "Every concatenation allocates a new string. Looks small, but in logging or templating paths it dominates.",
      fix: "Use string interpolation (C# 10+ uses DefaultInterpolatedStringHandler — can avoid allocations when the sink supports it, e.g. ILogger). For many appends use StringBuilder. For zero-alloc formatting use Span<char> + TryFormat.",
      code: [
        "// AVOID",
        "logger.LogInformation(\"Order \" + id + \" placed by \" + user);",
        "",
        "// GOOD — interpolation, ILogger skips work if disabled",
        "logger.LogInformation(\"Order {Id} placed by {User}\", id, user);",
      ],
      accent: "amber",
    },
    {
      id: "async",
      title: "async Task<T> that almost always suspends",
      symptom:
        "Every async method that suspends allocates a state machine (boxed) AND a Task<T> on the heap. Adds up in tight pipelines.",
      fix: "If a method is FREQUENTLY synchronous (cache hits, fast paths), return ValueTask<T>. ValueTask wraps a T directly when synchronous and avoids the allocation. Don&apos;t use ValueTask universally — it has rules.",
      code: [
        "// Cache-friendly read — usually synchronous",
        "public ValueTask<User?> GetAsync(int id)",
        "{",
        "    if (_cache.TryGetValue(id, out var u))",
        "        return new ValueTask<User?>(u);   // zero alloc",
        "    return new ValueTask<User?>(LoadAsync(id));",
        "}",
      ],
      accent: "blue",
    },
    {
      id: "closure",
      title: "Closures over this or locals",
      symptom:
        "A lambda that captures locals or `this` allocates a closure object every time the enclosing method runs.",
      fix: "Use static lambdas (`static () => ...`) when the function doesn&apos;t need state. Pass state explicitly when you need to.",
      code: [
        "// Allocates a closure every call",
        "items.Where(x => x.OwnerId == this.UserId);",
        "",
        "// Pass state — static lambda, no closure",
        "int userId = this.UserId;",
        "items.Where(static (x, id) => x.OwnerId == id, userId); // .NET 9+",
      ],
      accent: "violet",
    },
    {
      id: "tolist",
      title: "ToList() / ToArray() in the wrong place",
      symptom:
        "Each call allocates the full List<T> plus its backing array. Loops that call ToList multiple times bleed memory.",
      fix: "Materialize ONCE outside the loop. If you only need a count, use Count or Length on the source. If you need iteration, foreach the IEnumerable directly.",
      code: [
        "// WRONG — allocates each iteration",
        "for (int i = 0; i < days; i++) {",
        "    var todays = orders.Where(o => o.Date == day).ToList();",
        "    Process(todays);",
        "}",
        "",
        "// RIGHT — group once",
        "var byDay = orders.GroupBy(o => o.Date).ToList();",
      ],
      accent: "emerald",
    },
    {
      id: "concat",
      title: "Enumerable.Concat in a loop",
      symptom:
        "Each Concat creates a new enumerable that traverses both sides. Stacking N concats turns into an N-level deep traversal tree.",
      fix: "Build a List<T> with AddRange, or use [..a, ..b] collection expressions (C# 12+) which compile to efficient code.",
      code: [
        "// AVOID",
        "var result = Enumerable.Empty<int>();",
        "foreach (var batch in batches) result = result.Concat(batch);",
        "",
        "// GOOD",
        "var result = new List<int>();",
        "foreach (var batch in batches) result.AddRange(batch);",
      ],
      accent: "cyan",
    },
    {
      id: "boxing-interface",
      title: "Passing a struct as IDisposable / IEquatable / etc",
      symptom:
        "Calling an interface method on a struct via the interface type BOXES the struct.",
      fix: "Use a generic constraint where T : IInterface — the JIT can devirtualize and avoid boxing. Use `in` parameters or `ref` if you want to avoid copies too.",
      code: [
        "// Boxes the struct each call",
        "void Use(IDisposable d) => d.Dispose();",
        "Use(myStruct);   // box!",
        "",
        "// No box — generic constraint",
        "void Use<T>(T d) where T : IDisposable => d.Dispose();",
        "Use(myStruct);   // no box",
      ],
      accent: "rose",
    },
  ] as const;

  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
        Allocation pitfalls — the seven you&apos;ve probably hit
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">
        Click any row to see the symptom, the fix, and a code sample.
      </p>
      <div className="space-y-1.5">
        {items.map((item) => {
          const a = accentMap[item.accent];
          const isOpen = open === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`pitfall-${item.id}`}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-xl transition-all text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800",
                  a.border,
                  a.ring,
                  isOpen
                    ? a.bg
                    : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AlertTriangle
                    className={cn("h-4 w-4 flex-shrink-0", a.text)}
                    aria-hidden
                  />
                  <span className={cn("text-sm font-bold truncate", a.text)}>
                    {item.title}
                  </span>
                </div>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform flex-shrink-0",
                    a.text,
                    isOpen ? "rotate-90" : "rotate-0"
                  )}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <div
                  id={`pitfall-${item.id}`}
                  className={cn(
                    "px-5 py-4 mt-1.5 rounded-xl border-2 space-y-3",
                    a.border,
                    a.bg
                  )}
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300 mb-1">
                      Symptom
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.symptom}
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-1">
                      Fix
                    </div>
                    <p
                      className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.fix }}
                    />
                  </div>
                  <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
                    {item.code.map((line, i) => (
                      <div
                        key={i}
                        className={
                          line.startsWith("//")
                            ? "text-slate-500"
                            : line.startsWith("// BAD") ||
                              line.startsWith("// AVOID") ||
                              line.startsWith("// WRONG")
                            ? "text-rose-400"
                            : line.startsWith("// GOOD") ||
                              line.startsWith("// RIGHT")
                            ? "text-emerald-400"
                            : "text-slate-300"
                        }
                      >
                        {line || " "}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpanVsMemorySection() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Boxes className="h-4 w-4" aria-hidden />
        Span&lt;T&gt; and Memory&lt;T&gt; — the zero-allocation primitives
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        These types let you treat any contiguous chunk of memory — a heap array,
        a stack buffer, even unmanaged memory — as a uniform thing you can
        slice, parse, and pass around <strong>without copying</strong>.
      </p>

      {/* Span vs Memory cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {(
          [
            {
              name: "Span<T>",
              prop: "ref struct — stack-only",
              what: "A view over a contiguous region. The pinnacle of allocation-free code: slicing produces another Span, no copy.",
              rules:
                "Can&apos;t be a field of a class, can&apos;t cross await, can&apos;t be boxed, can&apos;t be captured by a lambda. Compiler enforces all of it.",
              color: "violet",
            },
            {
              name: "Memory<T>",
              prop: "regular struct — heap-friendly",
              what: "Wraps an array (or owned memory). Slower than Span (one extra indirection), but it can cross async boundaries.",
              rules: "Use when Span&apos;s restrictions get in your way — async, fields, lambdas.",
              color: "blue",
            },
          ] as const
        ).map(({ name, prop, what, rules, color }) => {
          const a = accentMap[color];
          return (
            <div
              key={name}
              className={cn(
                "rounded-lg border-2 p-4 bg-white dark:bg-slate-900",
                a.border
              )}
            >
              <div className={cn("text-sm font-bold mb-0.5", a.text)}>
                {name}
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                {prop}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                {what}
              </p>
              <p
                className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed"
                dangerouslySetInnerHTML={{ __html: rules }}
              />
            </div>
          );
        })}
      </div>

      {/* Code: zero-alloc CSV parse */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Zero-allocation CSV parse with Span&lt;char&gt;
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-500">
            {"// No substrings allocated — purely slicing"}
          </div>
          <div className="text-emerald-400">
            {"static int SumCsv(ReadOnlySpan<char> line)"}
          </div>
          <div className="text-slate-300">{"{"}</div>
          <div className="pl-4 text-slate-300">{"int sum = 0;"}</div>
          <div className="pl-4 text-slate-300">{"while (!line.IsEmpty)"}</div>
          <div className="pl-4 text-slate-300">{"{"}</div>
          <div className="pl-8 text-slate-300">
            {"int comma = line.IndexOf(',');"}
          </div>
          <div className="pl-8 text-slate-300">
            {"var token = comma < 0 ? line : line[..comma];"}
          </div>
          <div className="pl-8 text-slate-300">{"sum += int.Parse(token);"}</div>
          <div className="pl-8 text-slate-300">
            {"line = comma < 0 ? default : line[(comma + 1)..];"}
          </div>
          <div className="pl-4 text-slate-300">{"}"}</div>
          <div className="pl-4 text-slate-300">{"return sum;"}</div>
          <div className="text-slate-300">{"}"}</div>
        </div>
      </div>

      {/* stackalloc */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          stackalloc — short-lived buffers without touching the heap
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-3">
          <div className="text-slate-500">
            {"// Allocates on the stack, no GC pressure"}
          </div>
          <div className="text-slate-300">
            {"Span<byte> buffer = stackalloc byte[256];"}
          </div>
          <div className="text-slate-300">
            {"int written = Encoding.UTF8.GetBytes(input, buffer);"}
          </div>
          <div className="text-slate-300">
            {"socket.Send(buffer[..written]);"}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Only safe for <strong>small</strong> sizes (typically &lt; 1 KB). The
          stack is finite — overflowing it is fatal. For bigger or
          dynamically-sized buffers, use <Code>ArrayPool&lt;T&gt;.Shared</Code>.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3 — ASYNC
// ═══════════════════════════════════════════════════════════════════════════

function AsyncTab() {
  return (
    <section
      id="panel-async"
      role="tabpanel"
      aria-labelledby="tab-async"
      className="space-y-6"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        <Code>async</Code>/<Code>await</Code> is not a thread-switching keyword.
        It&apos;s a compile-time <strong>state machine</strong> transform. Fix
        this mental model and 80% of async bugs evaporate.
      </p>

      <StateMachineSection />
      <SyncContextSection />
      <ThreeAsyncRulesSection />
      <TaskVsValueTaskSection />
      <CancellationSection />
      <AsyncDisposeAndStreamsSection />
    </section>
  );
}

function StateMachineSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
        What the compiler actually generates
      </h3>

      <ol className="space-y-3 mb-5">
        {[
          {
            n: "1",
            title: "Method body → state machine",
            desc: "The compiler rewrites your async method into a struct (or class for debuggability) implementing IAsyncStateMachine, with a MoveNext() containing a switch over states (one per await).",
            color: "violet",
          },
          {
            n: "2",
            title: "await on an incomplete task → return",
            desc: "MoveNext() yields control back to the caller. It registers a continuation on the awaited task so that task&apos;s completion will call MoveNext() again.",
            color: "blue",
          },
          {
            n: "3",
            title: "Task completes → resume",
            desc: "The continuation invokes MoveNext(), which jumps to the next switch case. From your perspective, code continues after the await — possibly on a different thread.",
            color: "emerald",
          },
        ].map(({ n, title, desc, color }) => {
          const a = accentMap[color];
          return (
            <li key={n} className="flex items-start gap-3">
              <span
                className={cn(
                  "flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold",
                  a.chipBg,
                  a.text
                )}
                aria-hidden
              >
                {n}
              </span>
              <div className="min-w-0">
                <div className={cn("text-sm font-bold mb-0.5", a.text)}>
                  {title}
                </div>
                <p
                  className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
        What you write
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mb-4">
        <div className="text-emerald-400">
          {"public async Task<int> GetLengthAsync(string url)"}
        </div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">
          {"var data = await _http.GetStringAsync(url);"}
        </div>
        <div className="pl-4 text-slate-300">{"return data.Length;"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
        What the compiler emits (simplified)
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-emerald-400">{"private struct StateMachine"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"public int _state;"}</div>
        <div className="pl-4 text-slate-300">
          {"public AsyncTaskMethodBuilder<int> _builder;"}
        </div>
        <div className="pl-4 text-slate-300">
          {"public TaskAwaiter<string> _awaiter;"}
        </div>
        <div className="pl-4 text-slate-300">{"public string _url;"}</div>
        <div className="mt-2 pl-4 text-emerald-400">
          {"public void MoveNext()"}
        </div>
        <div className="pl-4 text-slate-300">{"{"}</div>
        <div className="pl-8 text-slate-300">{"switch (_state) {"}</div>
        <div className="pl-12 text-amber-300">{"case 0:"}</div>
        <div className="pl-14 text-slate-300">
          {"_awaiter = _http.GetStringAsync(_url).GetAwaiter();"}
        </div>
        <div className="pl-14 text-slate-300">{"if (!_awaiter.IsCompleted) {"}</div>
        <div className="pl-16 text-slate-300">{"_state = 1;"}</div>
        <div className="pl-16 text-slate-300">{"_builder.AwaitUnsafeOnCompleted(ref _awaiter, ref this);"}</div>
        <div className="pl-16 text-slate-300">{"return;"}</div>
        <div className="pl-14 text-slate-300">{"}"}</div>
        <div className="pl-14 text-slate-300">{"goto case 1;"}</div>
        <div className="pl-12 text-amber-300">{"case 1:"}</div>
        <div className="pl-14 text-slate-300">
          {"string data = _awaiter.GetResult();"}
        </div>
        <div className="pl-14 text-slate-300">{"_builder.SetResult(data.Length);"}</div>
        <div className="pl-12 text-slate-300">{"}"}</div>
        <div className="pl-4 text-slate-300">{"}"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-3 leading-relaxed">
        Every <Code>await</Code> becomes a state. Every local that&apos;s
        accessed across an <Code>await</Code> becomes a field of the state
        machine — that&apos;s why captured locals survive the suspension.
      </p>
    </div>
  );
}

function SyncContextSection() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5">
      <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">
        SynchronizationContext — who resumes your continuation?
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        When a task you&apos;re awaiting completes, .NET needs to decide which
        thread runs the code after the await. That decision is made by the
        captured <Code>SynchronizationContext</Code> (or{" "}
        <Code>TaskScheduler</Code>). It varies wildly by framework.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {(
          [
            {
              fw: "ASP.NET Core",
              ctx: "No SynchronizationContext",
              behavior:
                "Continuations resume on the thread pool. ConfigureAwait(false) is a no-op here.",
              color: "emerald",
            },
            {
              fw: "WPF / WinForms / MAUI",
              ctx: "UI SynchronizationContext",
              behavior:
                "Continuations resume on the UI thread. Library code MUST ConfigureAwait(false) to avoid deadlocks.",
              color: "rose",
            },
            {
              fw: "Console / Worker",
              ctx: "No SynchronizationContext",
              behavior:
                "Like ASP.NET Core — thread pool. Don&apos;t bother with ConfigureAwait.",
              color: "blue",
            },
            {
              fw: "Unit tests (xUnit)",
              ctx: "No SynchronizationContext by default",
              behavior:
                "Tests are essentially console apps. Older xUnit had its own context — that&apos;s gone.",
              color: "amber",
            },
          ] as const
        ).map(({ fw, ctx, behavior, color }) => {
          const a = accentMap[color];
          return (
            <div
              key={fw}
              className={cn(
                "rounded-lg border-2 p-3 bg-white dark:bg-slate-900",
                a.border
              )}
            >
              <div className={cn("text-sm font-bold mb-1", a.text)}>{fw}</div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                {ctx}
              </div>
              <p
                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: behavior }}
              />
            </div>
          );
        })}
      </div>
      <Callout tone="amber" icon={Lightbulb}>
        <strong>If you&apos;re writing a LIBRARY</strong> that might be consumed
        from WPF, always <Code>ConfigureAwait(false)</Code>. If you&apos;re
        writing an ASP.NET Core <strong>app</strong>, don&apos;t — it&apos;s
        noise.
      </Callout>
    </div>
  );
}

function ThreeAsyncRulesSection() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Three rules to live by
      </h3>

      <Callout
        tone="amber"
        icon={AlertTriangle}
        title="1. async void is dangerous"
      >
        <p>
          Exceptions thrown in an <Code>async void</Code> method escape on the
          captured SynchronizationContext. In ASP.NET Core they bubble to the
          thread pool — which means an unhandled <strong>process crash</strong>.
        </p>
        <p>Only use it for event handlers, where the framework expects void.</p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto mt-2">
          <div className="text-rose-400">{"// BAD — crash if anything throws"}</div>
          <div className="text-slate-300">
            {"public async void RunLater() { await DoWorkAsync(); }"}
          </div>
          <div className="mt-2 text-emerald-400">{"// GOOD — return Task"}</div>
          <div className="text-slate-300">
            {"public async Task RunLaterAsync() { await DoWorkAsync(); }"}
          </div>
        </div>
      </Callout>

      <Callout
        tone="amber"
        icon={AlertTriangle}
        title="2. Sync-over-async deadlocks UI apps and starves servers"
      >
        <p>
          <Code>task.Result</Code> / <Code>task.Wait()</Code> in WPF / WinForms{" "}
          <strong>deadlocks</strong>: the continuation needs the UI thread
          you&apos;re blocking on.
        </p>
        <p>
          In ASP.NET Core it usually doesn&apos;t deadlock, but it ties up
          thread-pool threads — under load, the pool runs out and your app
          stops responding.
        </p>
        <p>The fix is always the same: <strong>just await it.</strong></p>
      </Callout>

      <Callout
        tone="blue"
        icon={BarChart3}
        title="3. Never await inside a lock"
      >
        <p>
          The compiler will error if you try. A lock requires the same thread
          that acquired it to release it — but an <Code>await</Code> can resume
          on a different thread.
        </p>
        <p>
          If you need async-safe mutual exclusion, use{" "}
          <Code>SemaphoreSlim</Code> with <Code>WaitAsync()</Code> and{" "}
          <Code>Release()</Code>.
        </p>
      </Callout>
    </div>
  );
}

function TaskVsValueTaskSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Task&lt;T&gt; vs ValueTask&lt;T&gt;
      </h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {(
          [
            {
              t: "Task<T>",
              one: "Reference type. Heap allocation per suspended await.",
              two: "Awaitable any number of times. Safe to fan out.",
              three: "Use for: most APIs you write.",
              color: "blue",
            },
            {
              t: "ValueTask<T>",
              one: "Struct. Avoids the allocation when the result is already available.",
              two: "Single-await ONLY. Awaiting twice is undefined behavior.",
              three: "Use for: methods that are FREQUENTLY synchronous (cache hits, fast paths).",
              color: "emerald",
            },
          ] as const
        ).map(({ t, one, two, three, color }) => {
          const a = accentMap[color];
          return (
            <div
              key={t}
              className={cn(
                "rounded-lg border-2 p-3 bg-white dark:bg-slate-900",
                a.border
              )}
            >
              <div className={cn("text-sm font-bold mb-2", a.text)}>{t}</div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{one}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span>{two}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400">•</span>
                  <span className="italic">{three}</span>
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      <Callout tone="amber" icon={Lightbulb} title="ValueTask rules">
        <ul className="space-y-1 list-disc list-inside marker:text-slate-400">
          <li>Don&apos;t await the same ValueTask twice.</li>
          <li>Don&apos;t store ValueTask in a field — convert to Task if needed.</li>
          <li>
            Don&apos;t call <Code>.Result</Code> / <Code>.GetAwaiter().GetResult()</Code>{" "}
            on a not-yet-completed ValueTask.
          </li>
          <li>
            If you&apos;re unsure: <strong>return Task</strong>. The allocation
            is small.
          </li>
        </ul>
      </Callout>
    </div>
  );
}

function CancellationSection() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        Cancellation — cooperative, never preemptive
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        .NET cancellation is <strong>cooperative</strong>: nobody can force a
        running method to stop. You pass a <Code>CancellationToken</Code> down,
        and well-behaved methods check it periodically. ASP.NET Core gives you{" "}
        <Code>HttpContext.RequestAborted</Code> — when the client disconnects,
        that token fires.
      </p>

      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">
          {"// ASP.NET Core minimal API — `ct` is auto-bound from HttpContext.RequestAborted"}
        </div>
        <div className="text-emerald-400">
          {'app.MapGet("/orders/{id:int}", async ('}
        </div>
        <div className="pl-4 text-slate-300">{"int id,"}</div>
        <div className="pl-4 text-slate-300">{"AppDb db,"}</div>
        <div className="pl-4 text-amber-300">{"CancellationToken ct"}</div>
        <div className="text-slate-300">{") =>"}</div>
        <div className="pl-4 text-slate-300">
          {"await db.Orders.FirstOrDefaultAsync(o => o.Id == id, ct));"}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Two ways to check the token
        </p>
        <ul className="space-y-2">
          {[
            {
              api: "ct.ThrowIfCancellationRequested()",
              when: "Best default — throws OperationCanceledException up the call stack. Honored by every framework piece.",
              color: "blue",
            },
            {
              api: "ct.IsCancellationRequested",
              when: "When you need to break out of a loop cleanly and return a partial result without an exception.",
              color: "emerald",
            },
          ].map(({ api, when, color }) => {
            const a = accentMap[color];
            return (
              <li key={api} className="flex items-start gap-3">
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-2 py-1 rounded border whitespace-nowrap flex-shrink-0",
                    a.chipBg,
                    a.text,
                    a.border
                  )}
                >
                  {api}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {when}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Linked tokens — combine request abort + timeout
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-500">
            {"// Cancel when EITHER the request is aborted OR 5 seconds elapse"}
          </div>
          <div className="text-slate-300">
            {"using var linked = CancellationTokenSource.CreateLinkedTokenSource(ct);"}
          </div>
          <div className="text-slate-300">
            {"linked.CancelAfter(TimeSpan.FromSeconds(5));"}
          </div>
          <div className="text-slate-300">
            {"var result = await heavyOperation.RunAsync(linked.Token);"}
          </div>
        </div>
      </div>
    </div>
  );
}

function AsyncDisposeAndStreamsSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
        Async patterns you should be using
      </h3>

      {/* await using */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          await using — IAsyncDisposable
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          When a resource needs to do async I/O on cleanup (closing a network
          stream, flushing a DB transaction), the sync <Code>Dispose()</Code>{" "}
          blocks the thread. <Code>IAsyncDisposable</Code> +{" "}
          <Code>await using</Code> avoids that.
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-300">
            {"await using var stream = File.OpenRead(\"big.dat\");"}
          </div>
          <div className="text-slate-300">{"await stream.ReadAsync(buffer);"}</div>
          <div className="text-slate-500">
            {"// at end of scope: stream.DisposeAsync() awaited automatically"}
          </div>
        </div>
      </div>

      {/* IAsyncEnumerable */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          IAsyncEnumerable&lt;T&gt; — async streams
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          Use when results arrive over time (streaming a query, paginating an
          API, reading from a queue). Each iteration can await.
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-emerald-400">
            {"async IAsyncEnumerable<Order> StreamOrdersAsync("}
          </div>
          <div className="pl-4 text-amber-300">
            {"[EnumeratorCancellation] CancellationToken ct = default)"}
          </div>
          <div className="text-slate-300">{"{"}</div>
          <div className="pl-4 text-slate-300">
            {"await foreach (var batch in source.ReadBatchesAsync(ct))"}
          </div>
          <div className="pl-8 text-slate-300">{"foreach (var o in batch) yield return o;"}</div>
          <div className="text-slate-300">{"}"}</div>
          <div className="mt-2 text-slate-500">{"// consumer:"}</div>
          <div className="text-slate-300">
            {"await foreach (var o in StreamOrdersAsync(ct)) Process(o);"}
          </div>
        </div>
      </div>

      {/* Channels */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
          Channels — high-throughput producer/consumer
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          <Code>System.Threading.Channels</Code> gives you a lock-free
          producer/consumer queue with async write/read. Faster than{" "}
          <Code>BlockingCollection</Code>, async-friendly, and the right answer
          for in-process pipelines.
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-300">
            {"var ch = Channel.CreateBounded<Job>(1000);"}
          </div>
          <div className="mt-2 text-slate-500">{"// producer"}</div>
          <div className="text-slate-300">{"await ch.Writer.WriteAsync(job, ct);"}</div>
          <div className="mt-2 text-slate-500">{"// consumer(s)"}</div>
          <div className="text-slate-300">
            {"await foreach (var job in ch.Reader.ReadAllAsync(ct)) await Process(job);"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4 — MODERN C# & SOURCE GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

function ModernCsTab() {
  return (
    <section
      id="panel-modern"
      role="tabpanel"
      aria-labelledby="tab-modern"
      className="space-y-6"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The language has moved fast since C# 10. Here&apos;s what landed in
        each version, plus the two everyday tools that punch above their
        weight: NRT and source generators.
      </p>

      <VersionTimelineSection />
      <NrtSection />
      <SourceGeneratorsSection />
    </section>
  );
}

function VersionTimelineSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
        C# 10 → 14, version by version
      </h3>

      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {(
          [
            { label: "C# 10 · .NET 6", color: "blue" },
            { label: "C# 11 · .NET 7", color: "emerald" },
            { label: "C# 12 · .NET 8", color: "violet" },
            { label: "C# 13 · .NET 9", color: "amber" },
            { label: "C# 14 · .NET 10", color: "rose" },
          ] as const
        ).map((v, i, arr) => {
          const a = accentMap[v.color];
          return (
            <li key={v.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap",
                  a.chipBg,
                  a.text,
                  a.border
                )}
              >
                {v.label}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight
                  className="h-3.5 w-3.5 text-slate-400"
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      <VersionAccordion />
    </div>
  );
}

function VersionAccordion() {
  const versions = [
    {
      id: "cs10",
      label: "C# 10 · .NET 6",
      accent: "blue",
      features: [
        {
          name: "File-scoped namespaces",
          desc: "Drop the braces, one less indent level for the whole file.",
          code: ["namespace MyApp.Services;", "", "public class OrderService { ... }"],
        },
        {
          name: "Global usings",
          desc: "Declare common usings once for the whole project in a single file.",
          code: [
            "// in GlobalUsings.cs",
            "global using System;",
            "global using System.Linq;",
            "global using Microsoft.Extensions.Logging;",
          ],
        },
        {
          name: "Record structs",
          desc: "Value-type records with built-in equality and `with`-expressions.",
          code: ["public record struct Point(int X, int Y);"],
        },
        {
          name: "DefaultInterpolatedStringHandler",
          desc: "Interpolation can skip allocations entirely when the sink (e.g. ILogger) is disabled at runtime.",
          code: ["logger.LogDebug($\"Heavy computed value: {Compute()}\"); // Compute() not called if Debug off"],
        },
      ],
    },
    {
      id: "cs11",
      label: "C# 11 · .NET 7",
      accent: "emerald",
      features: [
        {
          name: "required members",
          desc: "Compiler enforces that the property is set during construction.",
          code: [
            "public class User",
            "{",
            "    public required string Name { get; init; }",
            "}",
            "",
            "var u = new User { Name = \"Chinthaka\" };  // OK",
            "var u = new User();                         // compile error",
          ],
        },
        {
          name: "Raw string literals",
          desc: "Multi-line strings without escapes. Quotes inside are easy.",
          code: [
            "var json = \"\"\"",
            "  {",
            "    \"name\": \"Chinthaka\",",
            "    \"role\": \"engineer\"",
            "  }",
            "  \"\"\";",
          ],
        },
        {
          name: "Generic math (static abstract members)",
          desc: "Interfaces can declare static members. Lets generic code call T.MaxValue, T.Zero, T + T.",
          code: [
            "T Sum<T>(IEnumerable<T> xs) where T : INumber<T>",
            "{",
            "    T total = T.Zero;",
            "    foreach (var x in xs) total += x;",
            "    return total;",
            "}",
          ],
        },
        {
          name: "List patterns",
          desc: "Match arrays and lists by shape.",
          code: [
            "string Describe(int[] xs) => xs switch {",
            "    []           => \"empty\",",
            "    [var only]   => $\"one: {only}\",",
            "    [_, _, ..]   => \"two or more\",",
            "};",
          ],
        },
      ],
    },
    {
      id: "cs12",
      label: "C# 12 · .NET 8",
      accent: "violet",
      features: [
        {
          name: "Primary constructors on classes",
          desc: "Cut the boilerplate of assigning constructor parameters to private fields.",
          code: [
            "public class OrderService(IOrderRepo repo, ILogger<OrderService> log)",
            "{",
            "    public Task<int> CreateAsync()",
            "    {",
            "        log.LogInformation(\"creating\");",
            "        return repo.CreateAsync();",
            "    }",
            "}",
          ],
        },
        {
          name: "Collection expressions",
          desc: "Uniform syntax across array, List, Span, ReadOnlySpan, and any type with [CollectionBuilder].",
          code: [
            "int[]      arr  = [1, 2, 3];",
            "List<int>  list = [1, 2, 3, ..arr];   // spread",
            "Span<int>  span = [10, 20, 30];",
          ],
        },
        {
          name: "Type aliases for any type",
          desc: "using-aliases now work for tuples, generics, anything.",
          code: ["using Point = (int X, int Y);", "", "Point p = (1, 2);"],
        },
        {
          name: "ref readonly parameters & inline arrays",
          desc: "Lower-level perf primitives. Inline arrays let value types hold fixed-size buffers without unsafe.",
          code: [
            "[System.Runtime.CompilerServices.InlineArray(10)]",
            "public struct Buffer10 { private int _0; }",
          ],
        },
      ],
    },
    {
      id: "cs13",
      label: "C# 13 · .NET 9",
      accent: "amber",
      features: [
        {
          name: "params collections",
          desc: "params can now take ReadOnlySpan, IEnumerable, etc — not just arrays. No allocation when caller passes a span.",
          code: [
            "void Log(params ReadOnlySpan<string> args)",
            "{",
            "    foreach (var a in args) Console.WriteLine(a);",
            "}",
          ],
        },
        {
          name: "New System.Threading.Lock type",
          desc: "First-class lock object — faster, contention-aware, no risk of locking the wrong thing.",
          code: [
            "private readonly Lock _lock = new();",
            "",
            "lock (_lock) { ... }    // compiles to Lock.Enter/Exit",
          ],
        },
        {
          name: "Implicit indexer in object initializers",
          desc: "Use indexers (incl. ^ from-end) when constructing collections.",
          code: [
            "var buf = new int[5] { [0]=1, [^1]=99 };  // buf = [1,0,0,0,99]",
          ],
        },
        {
          name: "field keyword (preview)",
          desc: "Refer to the implicit backing field of a property by `field` — preview of C# 14&apos;s stable feature.",
          code: ["public string Name { get; set => field = value?.Trim(); }"],
        },
      ],
    },
    {
      id: "cs14",
      label: "C# 14 · .NET 10",
      accent: "rose",
      features: [
        {
          name: "field keyword stable",
          desc: "Write property logic without an explicit backing field.",
          code: [
            "public string Name",
            "{",
            "    get => field;",
            "    set => field = value?.Trim() ?? throw new ArgumentNullException();",
            "}",
          ],
        },
        {
          name: "Extension members",
          desc: "Extension properties and static extensions, not just instance methods.",
          code: [
            "public static class StringExtras",
            "{",
            "    extension(string s)",
            "    {",
            "        public bool IsBlank => string.IsNullOrWhiteSpace(s);",
            "    }",
            "}",
          ],
        },
        {
          name: "Null-conditional assignment",
          desc: "customer?.Name = \"x\" — no-op if customer is null instead of throwing.",
          code: ["customer?.Name = \"updated\";   // safe even if customer is null"],
        },
        {
          name: "Partial constructors & events",
          desc: "Better source-generator interop — generators can complete partial constructors instead of emitting whole types.",
          code: [
            "public partial class Vm",
            "{",
            "    public partial Vm(IService service);   // generator implements",
            "}",
          ],
        },
      ],
    },
  ] as const;

  const [open, setOpen] = useState<string | null>("cs12");

  return (
    <div className="space-y-1.5">
      {versions.map((v) => {
        const a = accentMap[v.accent];
        const isOpen = open === v.id;
        return (
          <div key={v.id}>
            <button
              onClick={() => setOpen(isOpen ? null : v.id)}
              aria-expanded={isOpen}
              aria-controls={`ver-${v.id}`}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-xl transition-all text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800",
                a.border,
                a.ring,
                isOpen
                  ? a.bg
                  : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <span className={cn("text-sm font-bold", a.text)}>{v.label}</span>
              <ArrowRight
                className={cn(
                  "h-4 w-4 transition-transform flex-shrink-0",
                  a.text,
                  isOpen ? "rotate-90" : "rotate-0"
                )}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div
                id={`ver-${v.id}`}
                className={cn(
                  "px-5 py-4 mt-1.5 rounded-xl border-2 space-y-4",
                  a.border,
                  a.bg
                )}
              >
                {v.features.map((f) => (
                  <div key={f.name}>
                    <div className={cn("text-sm font-bold mb-1", a.text)}>
                      {f.name}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                      {f.desc}
                    </p>
                    <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
                      {f.code.map((line, i) => (
                        <div
                          key={i}
                          className={
                            line.startsWith("//")
                              ? "text-slate-500"
                              : "text-slate-300"
                          }
                        >
                          {line || " "}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function NrtSection() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300">
        Nullable Reference Types — turn it on, leave it on
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        NRT is a <strong>compiler</strong> feature. At runtime, every reference
        is still nullable — nothing changes. But the compiler tracks
        null-flow through your code and warns where you forget a check. It
        catches a real class of bugs essentially for free.
      </p>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Enable in your .csproj
        </p>
        <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
          <div className="text-slate-300">{"<PropertyGroup>"}</div>
          <div className="pl-4 text-emerald-400">{"  <Nullable>enable</Nullable>"}</div>
          <div className="text-slate-300">{"</PropertyGroup>"}</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Syntax you should be fluent in
        </p>
        <ul className="space-y-2">
          {[
            {
              code: "string? name",
              meaning: "Could be null. Compiler tracks flow.",
              color: "amber",
            },
            {
              code: "string name",
              meaning: "Promised non-null. Compiler warns if you assign null.",
              color: "emerald",
            },
            {
              code: "name!",
              meaning: "Null-forgiving operator — tells the compiler \"trust me.\" Use sparingly; treat as a code smell.",
              color: "rose",
            },
            {
              code: "name ??= LoadDefault()",
              meaning: "Assign only if null. C# 8+.",
              color: "blue",
            },
          ].map(({ code, meaning, color }) => {
            const a = accentMap[color];
            return (
              <li key={code} className="flex items-start gap-3 text-xs">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded border font-mono font-semibold flex-shrink-0 min-w-[140px]",
                    a.chipBg,
                    a.text,
                    a.border
                  )}
                >
                  {code}
                </span>
                <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {meaning}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
          Flow attributes — teach the compiler about your APIs
        </p>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            {
              attr: "[NotNullWhen(true)]",
              what: "On a bool-returning method, says: when this returns true, the corresponding parameter is non-null.",
            },
            {
              attr: "[MaybeNull]",
              what: "On a generic T return, says: T might be null even if T isn&apos;t T?.",
            },
            {
              attr: "[MemberNotNull(nameof(_field))]",
              what: "On a method that initializes fields, says: after this call, these fields are non-null.",
            },
            {
              attr: "[NotNull] / [AllowNull]",
              what: "Asymmetric: parameter accepts null but the method guarantees non-null after, or vice versa.",
            },
          ].map(({ attr, what }) => (
            <li key={attr} className="py-2 flex items-start gap-3">
              <Code>{attr}</Code>
              <span
                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: what }}
              />
            </li>
          ))}
        </ul>
      </div>

      <Callout tone="amber" icon={Lightbulb} title="Migration strategy">
        Don&apos;t flip <Code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</Code> on
        a big legacy codebase all at once. Use{" "}
        <Code>&lt;Nullable&gt;warnings&lt;/Nullable&gt;</Code> to enable the
        analysis but not the syntax, file by file, then convert{" "}
        <Code>#nullable enable</Code> per-file as you refactor.
      </Callout>
    </div>
  );
}

function SourceGeneratorsSection() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        Source generators — the AOT-safe answer to reflection
      </h3>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        A source generator is a Roslyn analyzer that <strong>adds source files
        to your compilation</strong> based on what it sees. It runs at build
        time, so the generated code is just regular C# — no reflection, no IL
        emit, AOT-safe.
      </p>

      {/* Three BCL generators */}
      <div className="space-y-3">
        {(
          [
            {
              name: "LoggerMessage",
              attr: "[LoggerMessage(EventId = 1, Level = LogLevel.Info, Message = \"...\")]",
              what: "Generates a zero-allocation log method. Skips formatting entirely if the log level is filtered out.",
              code: [
                "public static partial class Log",
                "{",
                "    [LoggerMessage(EventId = 1001, Level = LogLevel.Information,",
                "                   Message = \"Order {OrderId} placed by {UserId}\")]",
                "    public static partial void OrderPlaced(ILogger logger, int orderId, string userId);",
                "}",
                "",
                "// usage:",
                "Log.OrderPlaced(logger, 42, \"chinthaka\");",
              ],
              color: "blue",
            },
            {
              name: "GeneratedRegex (.NET 7+)",
              attr: "[GeneratedRegex(@\"^...$\")]",
              what: "Regex compiles to source at build time, not at first call. Significantly faster cold path.",
              code: [
                "public partial class Patterns",
                "{",
                "    [GeneratedRegex(@\"\\b[A-Z]{2,}\\b\")]",
                "    public static partial Regex Acronyms();",
                "}",
                "",
                "foreach (Match m in Patterns.Acronyms().Matches(text))",
                "    Console.WriteLine(m.Value);",
              ],
              color: "violet",
            },
            {
              name: "System.Text.Json source gen",
              attr: "[JsonSerializable(typeof(Order))]",
              what: "Pre-generates serializers at build time. No reflection at runtime — required for Native AOT.",
              code: [
                "[JsonSerializable(typeof(Order))]",
                "[JsonSerializable(typeof(List<Order>))]",
                "[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]",
                "public partial class OrderJsonContext : JsonSerializerContext { }",
                "",
                "// usage:",
                "var json = JsonSerializer.Serialize(order, OrderJsonContext.Default.Order);",
              ],
              color: "amber",
            },
          ] as const
        ).map(({ name, attr, what, code, color }) => {
          const a = accentMap[color];
          return (
            <div
              key={name}
              className={cn(
                "rounded-lg border-2 p-4 bg-white dark:bg-slate-900",
                a.border
              )}
            >
              <div className={cn("text-sm font-bold mb-1", a.text)}>{name}</div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 break-all">
                {attr}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                {what}
              </p>
              <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
                {code.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.startsWith("//")
                        ? "text-slate-500"
                        : line.startsWith("[")
                        ? "text-emerald-400"
                        : "text-slate-300"
                    }
                  >
                    {line || " "}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Callout tone="emerald" icon={Package} title="Why this matters">
        Every Native AOT-friendly app is built on source generators. Anywhere
        the BCL used to use reflection — JSON, logging, regex, dependency
        injection registration, configuration binding — there&apos;s now a
        source-gen alternative that emits regular code at compile time.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5 — PITFALLS & PRACTICE
// ═══════════════════════════════════════════════════════════════════════════

function PitfallsTab() {
  return (
    <section
      id="panel-pitfalls"
      role="tabpanel"
      aria-labelledby="tab-pitfalls"
      className="space-y-6"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Production lessons and a self-quiz. If you can answer the five
        questions at the bottom out loud, you&apos;ve got Day 1.
      </p>

      <ProductionLessonsSection />
      <StressTest />
      <BuildToLockInSection />
      <SamplesReferenceSection />
    </section>
  );
}

function ProductionLessonsSection() {
  const lessons = [
    {
      dont: "new HttpClient() inside a method",
      fix: "Reuse one. Use IHttpClientFactory in DI — it manages handler lifetime, integrates with Polly, and avoids socket exhaustion via TIME_WAIT.",
      severity: "high",
    },
    {
      dont: "Task.Run in ASP.NET Core controllers",
      fix: "You&apos;re stealing thread-pool threads to run on... thread-pool threads. Often a sign you wanted ConfigureAwait, or just shouldn&apos;t be there at all.",
      severity: "high",
    },
    {
      dont: "Sync-over-async: .Result / .Wait()",
      fix: "Deadlocks UI apps, starves servers. If you can&apos;t await, restructure the call chain.",
      severity: "high",
    },
    {
      dont: "Long-lived DbContext (singleton or static)",
      fix: "DbContext isn&apos;t thread-safe and accumulates tracked entities. Use scoped (per request) and let DI dispose it.",
      severity: "high",
    },
    {
      dont: "Server GC for a small CLI tool",
      fix: "Wastes memory. Workstation GC is the default for a reason.",
      severity: "medium",
    },
    {
      dont: "using on async resources",
      fix: "Use await using. Sync Dispose() on an async resource blocks the thread doing I/O.",
      severity: "medium",
    },
    {
      dont: "Catch (Exception ex) {}",
      fix: "Empty catch swallows bugs. Catch specifics, or rethrow with `throw;` (not `throw ex;` — that resets the stack trace).",
      severity: "medium",
    },
    {
      dont: "Capturing CancellationToken in a lambda but never passing it",
      fix: "The captured token does nothing unless you actually pass it into downstream calls.",
      severity: "medium",
    },
    {
      dont: "Pinning every byte[] for interop",
      fix: "Pinned objects can&apos;t move during compaction. Use the Pinned Object Heap (POH) via GC.AllocateArray(..., pinned: true).",
      severity: "low",
    },
    {
      dont: "Triggering full GC manually with GC.Collect()",
      fix: "Almost always wrong outside of benchmark teardown. The GC is smarter than you about when to collect.",
      severity: "low",
    },
  ] as const;

  return (
    <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300 mb-4">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        Production lessons — ten things you&apos;ll see in code reviews
      </h3>
      <ul className="divide-y divide-rose-200 dark:divide-rose-800/60 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-800/60">
        {lessons.map(({ dont, fix, severity }) => {
          const sev =
            severity === "high"
              ? accentMap.rose
              : severity === "medium"
              ? accentMap.amber
              : accentMap.blue;
          return (
            <li
              key={dont}
              className="px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:w-60 flex-shrink-0">
                <span
                  className={cn(
                    "text-[0.65rem] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border",
                    sev.chipBg,
                    sev.text,
                    sev.border
                  )}
                >
                  {severity}
                </span>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
                  ✗ {dont}
                </span>
              </div>
              <span
                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fix }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StressTest() {
  const questions = [
    {
      id: "q1",
      q: "Why does an async method without an await still return a Task, and what does it do?",
      a: "The compiler still emits a state machine, but since there&apos;s no await it never suspends — it completes synchronously and returns Task.CompletedTask (or Task.FromResult(value)). You pay a small struct/Task allocation but the actual work is synchronous. The compiler will warn (CS1998) so you can decide whether the method should really be async.",
      accent: "blue",
    },
    {
      id: "q2",
      q: "What&apos;s the difference between Gen 1 and Gen 2 collection cost, and how do you keep things in Gen 0?",
      a: "Gen 2 collections walk the full reachable graph and are by far the most expensive — they&apos;re what show up in your p99 latency. Gen 1 is moderate. Gen 0 is essentially free. Stay in Gen 0 by: keeping allocations short-lived, avoiding holding references in long-lived caches without TTL, preferring Span/stackalloc for transient buffers, not capturing large objects in lambdas that live forever, and being thoughtful about event handler subscriptions (they keep targets alive).",
      accent: "rose",
    },
    {
      id: "q3",
      q: "When is ConfigureAwait(false) actually meaningful, and when is it noise?",
      a: "Only meaningful when there IS a SynchronizationContext to escape — WPF, WinForms, MAUI library code. There you ConfigureAwait(false) to avoid forcing continuations back onto the UI thread. In ASP.NET Core, console apps, worker services, and modern xUnit there&apos;s no sync context, so ConfigureAwait(false) is a no-op. It&apos;s cargo-cult code there — clean it up.",
      accent: "emerald",
    },
    {
      id: "q4",
      q: "What can&apos;t you do with a Span<T> that you can do with a Memory<T>, and why?",
      a: "Span is a ref struct — the compiler refuses to let it (1) be a field of a class, (2) cross an await, (3) be boxed, or (4) be captured by a lambda. Those restrictions are exactly what makes Span stack-only and allocation-free. Memory<T> is a regular struct that wraps memory by reference and lives on the heap, so it can do all of those at the cost of one extra indirection. Use Span by default; reach for Memory only when its restrictions are blocking you.",
      accent: "violet",
    },
    {
      id: "q5",
      q: "Name three things Native AOT breaks and what the source-gen equivalent is.",
      a: "(1) System.Text.Json reflection-based serialization → use [JsonSerializable] source gen. (2) ILogger.LogInformation with format-string reflection → use [LoggerMessage] source gen. (3) Runtime-compiled regex → use [GeneratedRegex]. Also: EF Core lazy-loading proxies, Castle DynamicProxy interception, Newtonsoft.Json reflection-based serialization, and any library doing IL emit. The trend across the BCL is to ship a source-gen alternative for everything that used to use reflection — that&apos;s the AOT story.",
      accent: "amber",
    },
  ] as const;

  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300 mb-1">
        <Cpu className="h-4 w-4" aria-hidden />
        Stress test yourself
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">
        Answer out loud first, then click to reveal the model answer.
      </p>

      <div className="space-y-1.5">
        {questions.map((q, i) => {
          const a = accentMap[q.accent];
          const isOpen = open === q.id;
          return (
            <div key={q.id}>
              <button
                onClick={() => setOpen(isOpen ? null : q.id)}
                aria-expanded={isOpen}
                aria-controls={`q-${q.id}`}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 border-2 rounded-xl transition-all text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800",
                  a.border,
                  a.ring,
                  isOpen
                    ? a.bg
                    : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold mt-0.5",
                      a.chipBg,
                      a.text
                    )}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug"
                    dangerouslySetInnerHTML={{ __html: q.q }}
                  />
                </div>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform flex-shrink-0 mt-1",
                    a.text,
                    isOpen ? "rotate-90" : "rotate-0"
                  )}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <div
                  id={`q-${q.id}`}
                  className={cn(
                    "px-5 py-4 mt-1.5 rounded-xl border-2",
                    a.border,
                    a.bg
                  )}
                >
                  <p
                    className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: q.a }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BuildToLockInSection() {
  return (
    <div className="rounded-xl border-2 border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-cyan-700 dark:text-cyan-300 mb-3">
        <GitBranch className="h-4 w-4" aria-hidden />
        Build this to lock Day 1 in
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        Reading consolidates ideas; building consolidates skills. Spend 60–90
        minutes on a small console app that exercises everything you saw
        today.
      </p>
      <ol className="space-y-3">
        {[
          {
            n: "1",
            title: "Allocation visualizer",
            desc: "Write a benchmark with BenchmarkDotNet that compares string.Concat, StringBuilder, and Span<char>+TryFormat over a 1 KB string. Read the Gen 0 column. Confirm what you expected.",
            color: "emerald",
          },
          {
            n: "2",
            title: "Async state machine reveal",
            desc: "Write an async method, build in Release, and inspect the generated IL with `dotnet ildasm` or sharplab.io. Find the compiler-generated state machine and the MoveNext switch.",
            color: "blue",
          },
          {
            n: "3",
            title: "Cancellation chain",
            desc: "Build a minimal API endpoint that calls an HttpClient with a CancellationToken. Stop a curl mid-request; verify in logs the downstream request was aborted.",
            color: "violet",
          },
          {
            n: "4",
            title: "Source generator wired up",
            desc: "Add a LoggerMessage source-gen log method to your app. Confirm the generated source (in obj/) exists. Profile to confirm zero allocation per call.",
            color: "amber",
          },
          {
            n: "5",
            title: "AOT trial",
            desc: "Run dotnet publish -r linux-x64 -c Release /p:PublishAot=true on the same app. Notice the errors — those are the AOT incompatibilities. Fix them or note them for later.",
            color: "rose",
          },
        ].map(({ n, title, desc, color }) => {
          const a = accentMap[color];
          return (
            <li key={n} className="flex items-start gap-3">
              <span
                className={cn(
                  "flex-shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold",
                  a.chipBg,
                  a.text
                )}
                aria-hidden
              >
                {n}
              </span>
              <div className="min-w-0">
                <div className={cn("text-sm font-bold mb-0.5", a.text)}>
                  {title}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SamplesReferenceSection() {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
        <Code2 className="h-4 w-4 text-slate-400" aria-hidden />
        Runnable samples
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        The companion repo includes a Day 1 folder with five C# files matching
        the sections above. Open them in your IDE, paste each into a fresh
        console project, and run.
      </p>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        {[
          {
            file: "01-value-vs-reference.cs",
            what: "Boxing benchmark, struct mutation semantics, `in` parameters.",
          },
          {
            file: "02-async-internals.cs",
            what: "ValueTask cache hits, cancellation, ConfigureAwait demo.",
          },
          {
            file: "03-spans.cs",
            what: "Zero-allocation CSV parse vs string.Split, stackalloc.",
          },
          {
            file: "04-source-generators.cs",
            what: "LoggerMessage, GeneratedRegex, and System.Text.Json source gen all in one program.",
          },
          {
            file: "05-nrt-and-patterns.cs",
            what: "NRT flow attributes, list patterns, records with `with`.",
          },
        ].map(({ file, what }) => (
          <li
            key={file}
            className="px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
          >
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 sm:w-56 flex-shrink-0">
              {file}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {what}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS (per DOC_STYLE_GUIDE §4.4–4.5)
// ═══════════════════════════════════════════════════════════════════════════

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
  }[tone];

  return (
    <aside className={cn("rounded-xl border p-4", tones.wrap, className)}>
      <div className="flex gap-3">
        <Icon
          className={cn("h-5 w-5 flex-shrink-0 mt-0.5", tones.icon)}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn("text-sm font-bold mb-1.5", tones.title)}>
              {title}
            </h4>
          )}
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
