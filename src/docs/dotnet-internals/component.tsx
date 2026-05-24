"use client";

import { useState, useRef } from "react";
import { Lightbulb, Package, BarChart3, Zap, Wrench, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LayerId = "host" | "clr" | "bcl" | "code";

const layers: {
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
      "You write C#, F#, or VB. The compiler (Roslyn for C#) turns it into CIL — Intermediate Language — stored in a .dll managed assembly.",
      "CIL is platform-agnostic bytecode, like JVM bytecode. The same .dll runs on Windows, Linux, macOS, x64, ARM64.",
    ],
    analogy: "Think of it as your blueprint — platform-neutral until the CLR compiles it for the actual CPU.",
  },
  {
    id: "bcl",
    number: "3",
    title: "BCL / Runtime Libraries",
    subtitle: "System.* types",
    accent: "emerald",
    body: [
      "All the built-in types you use every day: string, List<T>, Task, Span<T>, HttpClient, DateTime, Dictionary<K,V>... Implemented partly in C#, partly in C++ inside the runtime.",
      "Fully open source at github.com/dotnet/runtime.",
    ],
    analogy: "Think of it as the standard toolkit that comes with the engine.",
  },
  {
    id: "clr",
    number: "2",
    title: "CoreCLR",
    subtitle: "The Runtime Engine",
    accent: "rose",
    body: [
      "The heart of .NET, written in C++. It loads your assemblies, JIT-compiles IL into native machine code, runs the garbage collector, manages threads, handles exceptions, and bridges P/Invoke calls.",
      "Without CoreCLR, your .dll is just inert bytecode.",
    ],
    analogy: "Think of it as the engine — it does the actual work of running your code.",
  },
  {
    id: "host",
    number: "1",
    title: "Host",
    subtitle: "dotnet CLI / apphost .exe",
    accent: "violet",
    body: [
      "The entry point. The dotnet command (or your app's native .exe) boots up, starts the CLR, loads your assembly, and calls Main().",
      "For ASP.NET Core this is where the Generic Host + Kestrel also spin up — but it's still just managed code on top of CoreCLR.",
    ],
    analogy: "Think of it as the ignition key that starts the engine.",
  },
];

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

const compileModes = [
  {
    id: "jit",
    label: "JIT (default)",
    accent: "blue",
    icon: Zap,
    startup: "Slow",
    startupNote: "JIT spike on first calls",
    memory: "Moderate",
    memoryNote: "JIT engine resident in memory",
    perf: "Excellent",
    perfNote: "Tier 1 + PGO optimizations",
    pros: ["Full reflection support", "Dynamic code generation", "Best compatibility"],
    cons: ["Slower cold start", "JIT spike on first calls", "Larger memory for JIT engine"],
    useFor: "Most apps — web APIs, desktop, worker services",
  },
  {
    id: "r2r",
    label: "ReadyToRun",
    accent: "emerald",
    icon: Package,
    startup: "Fast",
    startupNote: "Pre-compiled at publish time",
    memory: "Moderate",
    memoryNote: "JIT still loaded as fallback",
    perf: "Excellent",
    perfNote: "Re-JIT for hot paths at Tier 1",
    pros: ["Much faster cold start", "Still supports reflection", "JIT still available as fallback"],
    cons: ["Larger binary on disk", "Slightly more complex publish"],
    useFor: "Production ASP.NET Core — enable with <PublishReadyToRun>true</PublishReadyToRun>",
  },
  {
    id: "aot",
    label: "Native AOT",
    accent: "amber",
    icon: Wrench,
    startup: "Instant",
    startupNote: "~10ms cold start, no JIT warm-up",
    memory: "Tiny",
    memoryNote: "No JIT engine, no IL in memory",
    perf: "Very good",
    perfNote: "Slightly below JIT Tier 1 — no runtime re-optimization",
    pros: ["~10ms startup", "Tiny memory footprint", "Single native binary", "No JIT spikes"],
    cons: ["No runtime code gen", "Reflection limited", "No EF Core proxies", "No Castle DynamicProxy"],
    useFor: "CLI tools, serverless, gRPC microservices, sidecars",
  },
];

const jitStages = [
  {
    id: "t0",
    label: "Tier 0",
    accent: "amber",
    Icon: Zap,
    desc: "First call to a method — JIT compiles it fast with minimal optimization so the app starts quickly. The code is correct, just not fully optimized yet.",
  },
  {
    id: "t1",
    label: "Tier 1",
    accent: "rose",
    Icon: Zap,
    desc: "Hot methods (called frequently) get recompiled with full optimizations: inlining, vectorization, devirtualization. Great steady-state performance.",
  },
  {
    id: "pgo",
    label: "Dynamic PGO",
    accent: "violet",
    Icon: BarChart3,
    desc: "New in .NET 8+. Tier 0 silently records runtime data — which types flow through, which branches are hot — and Tier 1 uses that real-world data to optimize even better.",
  },
];

type TabId = "stack" | "jit" | "compile";

export default function DotNetExplainer() {
  const [tab, setTab] = useState<TabId>("stack");
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);
  const [activeMode, setActiveMode] = useState("jit");
  const mode = compileModes.find((m) => m.id === activeMode)!;

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
          Interactive Guide
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">.NET Internals</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Click anything to explore. How your C# code becomes running instructions.
        </p>
      </header>

      <Tabs tab={tab} setTab={setTab} />

      <div className="mt-8 space-y-6">
        {tab === "stack" && (
          <StackTab activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
        )}
        {tab === "jit" && <JitTab />}
        {tab === "compile" && (
          <CompileTab activeMode={activeMode} setActiveMode={setActiveMode} mode={mode} />
        )}
      </div>
    </article>
  );
}

// ─── Tabs ──────────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; Icon: typeof Layers }[] = [
  { id: "stack", label: "The Stack", Icon: Layers },
  { id: "jit", label: "JIT & Tiering", Icon: Zap },
  { id: "compile", label: "Compile Modes", Icon: Wrench },
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
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              active
                ? "bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Stack Tab ─────────────────────────────────────────────────────────────

function StackTab({
  activeLayer,
  setActiveLayer,
}: {
  activeLayer: LayerId | null;
  setActiveLayer: (l: LayerId | null) => void;
}) {
  return (
    <section id="panel-stack" role="tabpanel" aria-labelledby="tab-stack" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Click a layer to learn more. Your code sits on top; the host sits at the bottom.
      </p>

      {/* Stack layers */}
      <div className="space-y-1.5">
        {layers.map((layer) => {
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
                  open ? a.bg : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
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
                    <div className={cn("text-sm font-bold", a.text)}>{layer.title}</div>
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
                />
              </button>
              {open && (
                <div
                  id={`layer-${layer.id}`}
                  className={cn("px-5 py-4 mt-1.5 rounded-xl border-2", a.border, a.bg)}
                >
                  <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {layer.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <Callout tone="amber" icon={Lightbulb} className="mt-4">
                    {layer.analogy}
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
          How your code becomes running instructions
        </h3>
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {[
            { label: "C# source", color: "violet" },
            { label: "Roslyn compiler", color: "blue" },
            { label: "IL bytecode (.dll)", color: "emerald" },
            { label: "JIT (CoreCLR)", color: "rose" },
            { label: "Native x64/ARM64", color: "amber" },
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
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* What is native machine code? */}
      <div className="rounded-xl border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50 dark:bg-cyan-950/30 p-5">
        <h3 className="text-sm font-bold text-cyan-900 dark:text-cyan-200 mb-3">
          What is &ldquo;Native x64/ARM64&rdquo; (machine code)?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Machine code is the{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            lowest level a program can be
          </strong>{" "}
          — raw binary numbers (0s and 1s) that the CPU executes directly. No more translation
          needed. The CPU just runs it.
        </p>

        {/* Abstraction ladder */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3">
            Abstraction ladder — top is human-friendly, bottom is CPU-friendly
          </p>
          <div className="flex flex-col gap-1">
            {(
              [
                { label: "C#", note: "human-friendly, readable", color: "blue", level: "HIGH" },
                {
                  label: "IL",
                  note: "simplified, platform-agnostic instructions",
                  color: "emerald",
                  level: "MID",
                },
                {
                  label: "Machine code",
                  note: "raw binary your CPU executes directly",
                  color: "amber",
                  level: "LOW",
                },
              ] as const
            ).map((row, i, arr) => {
              const a = accentMap[row.color];
              return (
                <div key={row.label}>
                  <div
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg border text-xs",
                      a.chipBg,
                      a.border
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("font-bold min-w-[80px]", a.text)}>{row.label}</span>
                      <span className="text-slate-500 dark:text-slate-400">{row.note}</span>
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[0.65rem] font-semibold">
                      {row.level}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-start ml-10 my-0.5">
                      <ArrowRight className="h-3 w-3 text-slate-400 rotate-90" aria-hidden />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* x64 vs ARM64 */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          Each CPU architecture has its{" "}
          <strong className="text-slate-800 dark:text-slate-200">own</strong> machine code language —
          they are completely different binary formats:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {(
            [
              {
                arch: "x64",
                chips: "Intel / AMD processors",
                examples: "Your Windows/Linux laptop or server",
                color: "blue",
              },
              {
                arch: "ARM64",
                chips: "Apple M1/M2, phone chips, ARM servers",
                examples: "Macs, phones, some cloud VMs",
                color: "violet",
              },
            ] as const
          ).map(({ arch, chips, examples, color }) => {
            const a = accentMap[color];
            return (
              <div key={arch} className={cn("rounded-lg border p-3", a.border, a.bg)}>
                <div className={cn("text-sm font-bold mb-1", a.text)}>{arch}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{chips}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{examples}</div>
              </div>
            );
          })}
        </div>

        <Callout tone="amber" icon={Lightbulb}>
          x64 machine code <strong>cannot run</strong> on ARM64 and vice versa — this is exactly why
          IL is valuable. Your <Code>.dll</Code> ships as neutral IL, and the JIT/crossgen2 translates
          it to whichever machine code the current CPU speaks.
          <br />
          <br />
          In normal JIT mode, machine code is{" "}
          <strong>never saved to disk</strong> — it lives in RAM, generated fresh each time your app
          starts. With R2R or AOT, it <em>is</em> saved, which is why startup is faster.
        </Callout>
      </div>

      {/* C# ≠ CLR */}
      <Callout tone="amber" icon={Lightbulb} title="C# ≠ CLR — they're independent!">
        <p>
          C# is a <strong>language</strong>. CLR is the <strong>runtime</strong>. A C# 12 feature can
          run on the .NET 6 runtime if it doesn&apos;t need new runtime APIs.
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside marker:text-slate-400">
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">record types</strong> — pure
            compiler sugar, works on older runtimes
          </li>
          <li>
            <strong className="text-rose-700 dark:text-rose-400">
              static abstract interface members
            </strong>{" "}
            — needs new CLR support, requires .NET 7+
          </li>
        </ul>
      </Callout>
    </section>
  );
}

// ─── JIT Tab ───────────────────────────────────────────────────────────────

function JitTab() {
  return (
    <section id="panel-jit" role="tabpanel" aria-labelledby="tab-jit" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        .NET doesn&apos;t compile everything upfront. It compiles each method lazily, then
        re-compiles hot ones better.
      </p>

      {/* Tier cards */}
      <div className="grid sm:grid-cols-3 gap-3">
        {jitStages.map((stage) => {
          const a = accentMap[stage.accent];
          return (
            <div
              key={stage.id}
              className={cn("rounded-xl border-2 p-4 bg-white dark:bg-slate-900", a.border)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full",
                    a.chipBg
                  )}
                >
                  <stage.Icon className={cn("h-4 w-4", a.text)} aria-hidden />
                </span>
                <h3 className={cn("text-sm font-bold", a.text)}>{stage.label}</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {stage.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Method lifecycle */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          Method call lifecycle
        </h3>
        <ol className="space-y-3">
          {[
            {
              phase: "1st call",
              accent: "amber",
              desc: "CLR sees it's not compiled → Tier 0 JIT (fast, unoptimized) → cache result → run",
            },
            {
              phase: "2nd–Nth calls",
              accent: "emerald",
              desc: "Already compiled → run the cached Tier 0 native code directly (fast)",
            },
            {
              phase: "Gets hot",
              accent: "rose",
              desc: "CLR re-JITs at Tier 1 with full optimizations in background → swap atomically",
            },
            {
              phase: "With PGO (.NET 8+)",
              accent: "violet",
              desc: "Tier 0 secretly records type flows & branch probabilities → Tier 1 uses real data",
            },
          ].map(({ phase, accent, desc }) => {
            const a = accentMap[accent];
            return (
              <li key={phase} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
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

      {/* ReadyToRun — large section containing SDK, pre-compile, crossgen2 */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 p-5 space-y-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">
          <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
          ReadyToRun (R2R) — pre-JIT at publish time
        </h3>

        {/* What is the SDK? */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
            What is &ldquo;the SDK&rdquo;?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            The <strong className="text-slate-800 dark:text-slate-200">.NET SDK</strong> is the
            toolchain you install on your dev machine. It includes the <Code>dotnet</Code> CLI, the
            Roslyn compiler, MSBuild, and crossgen2. When you run <Code>dotnet publish</Code>,
            you&apos;re invoking the SDK.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {(
              [
                {
                  name: ".NET SDK",
                  what: "Build tools + CLI + compilers",
                  who: "Developers on their machine",
                  color: "emerald",
                },
                {
                  name: ".NET Runtime (CoreCLR)",
                  what: "What actually runs your app",
                  who: "Servers / end-user machines",
                  color: "rose",
                },
              ] as const
            ).map(({ name, what, who, color }) => {
              const a = accentMap[color];
              return (
                <div key={name} className={cn("rounded-lg border p-3", a.border, a.bg)}>
                  <div className={cn("text-sm font-bold mb-2", a.text)}>{name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-300">What:</strong> {what}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-700 dark:text-slate-300">Who installs:</strong>{" "}
                    {who}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 italic mb-4">
            Production servers only need the Runtime — no SDK required to run your app.
          </p>

          {/* MSBuild */}
          <div className="rounded-lg border border-violet-200 dark:border-violet-800/60 bg-violet-50 dark:bg-violet-950/30 p-4">
            <h5 className="text-sm font-bold text-violet-900 dark:text-violet-200 mb-2">
              What is MSBuild?
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              MSBuild is Microsoft&apos;s{" "}
              <strong className="text-slate-800 dark:text-slate-200">build engine</strong> — it
              orchestrates the whole build process when you run <Code>dotnet build</Code> or{" "}
              <Code>dotnet publish</Code>. You never call it directly — the dotnet CLI calls it for
              you.
            </p>

            {/* dotnet build flow */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-4">
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                What happens when you type dotnet build
              </div>
              <ol className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { step: "dotnet build", note: "you type this", color: "violet" },
                  { step: "MSBuild reads your .csproj", note: "orchestrator wakes up", color: "violet" },
                  { step: "calls Roslyn → C# to IL", note: "step 1", color: "blue" },
                  { step: "copies output files", note: "step 2", color: "emerald" },
                  { step: "runs crossgen2 (if R2R)", note: "step 3 (optional)", color: "amber" },
                  { step: "bundles publish folder", note: "step 4", color: "cyan" },
                ].map(({ step, note, color }, i) => {
                  const a = accentMap[color];
                  return (
                    <li key={step} className="flex items-center gap-3 px-3 py-2.5">
                      <span
                        className={cn(
                          "flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold",
                          a.chipBg,
                          a.text
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex-1">
                        {step}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 italic">// {note}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* .csproj is MSBuild */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Your <Code>.csproj</Code> file is actually{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                an MSBuild file in disguise
              </strong>
              . Every property you write in it is an MSBuild instruction:
            </p>
            <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-4 font-mono text-xs leading-relaxed overflow-x-auto mb-4">
              <div className="text-slate-300">{`<PropertyGroup>`}</div>
              <div className="pl-4 text-emerald-400">{`<TargetFramework>net8.0</TargetFramework>`}</div>
              <div className="pl-4 text-emerald-400">
                {`<PublishReadyToRun>true</PublishReadyToRun>`}
                <span className="text-slate-500 ml-2">{"← MSBuild property"}</span>
              </div>
              <div className="text-slate-300">{`</PropertyGroup>`}</div>
            </div>

            {/* Tool roles table */}
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              Each tool&apos;s role
            </p>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { tool: "dotnet CLI", role: "Your entry point — the front door", color: "cyan" },
                {
                  tool: "MSBuild",
                  role: "Orchestrates all build steps — the project manager",
                  color: "violet",
                },
                { tool: "Roslyn", role: "Converts C# → IL — the translator", color: "blue" },
                {
                  tool: "crossgen2",
                  role: "Converts IL → native (R2R) — the pre-compiler",
                  color: "emerald",
                },
              ].map(({ tool, role, color }) => {
                const a = accentMap[color];
                return (
                  <li key={tool} className="flex items-center gap-3 py-2">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0",
                        a.chipBg,
                        a.text,
                        a.border
                      )}
                    >
                      {tool}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{role}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* What does pre-compile mean? */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
            What does &ldquo;pre-compile&rdquo; mean?
          </h4>

          <div className="mb-4">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
              Without R2R (normal JIT):
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {[
                ".dll ships (IL only)",
                "→",
                "1st method call at runtime",
                "→",
                "JIT compiles on server",
                "→",
                "runs",
              ].map((t, i) =>
                t === "→" ? (
                  <ArrowRight key={i} className="h-3 w-3 text-slate-400" aria-hidden />
                ) : (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Compilation happens on the user&apos;s/server&apos;s machine, at runtime.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              With R2R (pre-compiled):
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {[
                "crossgen2 runs at publish",
                "→",
                ".dll ships (IL + native)",
                "→",
                "1st method call",
                "→",
                "uses pre-built native",
                "→",
                "runs",
              ].map((t, i) =>
                t === "→" ? (
                  <ArrowRight key={i} className="h-3 w-3 text-slate-400" aria-hidden />
                ) : (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Compilation happens on your machine, before you ship. &ldquo;Pre&rdquo; = before the
              app runs.
            </p>
          </div>

          <Callout tone="amber" icon={Lightbulb}>
            R2R still keeps the IL in the <Code>.dll</Code> alongside the native code. If the native
            code doesn&apos;t match the target machine, CoreCLR falls back to JIT-compiling the IL.
            That&apos;s why R2R is safer than Native AOT (which strips IL out entirely).
          </Callout>
        </div>

        {/* What is crossgen2? */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
            What is crossgen2?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            crossgen2 is a tool bundled inside the .NET SDK —{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              essentially a JIT compiler that runs at build time instead of runtime
            </strong>
            . It reads your IL and produces native code, the same job the JIT does, but done early
            on your machine rather than lazily on the server.
          </p>

          {/* crossgen2 flow */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {[
              { label: ".dll (IL only)", color: "blue" },
              { label: "crossgen2", color: "emerald" },
              { label: ".dll (IL + native)", color: "emerald" },
            ].map((node, i, arr) => {
              const a = accentMap[node.color];
              return (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-lg border font-semibold",
                      a.chipBg,
                      a.text,
                      a.border
                    )}
                  >
                    {node.label}
                  </span>
                  {i < arr.length - 1 && (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                  )}
                </div>
              );
            })}
          </div>

          {/* Etymology */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Why &ldquo;crossgen2&rdquo;?
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {[
                { part: "cross", meaning: "can cross-compile (build on x64 Windows, target ARM64 Linux)" },
                { part: "gen", meaning: "code generation" },
                {
                  part: "2",
                  meaning: 'second version; the original "crossgen" (v1) was older and less capable',
                },
              ].map(({ part, meaning }) => (
                <li key={part} className="flex gap-2">
                  <Code>{part}</Code>
                  <span>{meaning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How to enable */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Enable with <Code>&lt;PublishReadyToRun&gt;true&lt;/PublishReadyToRun&gt;</Code> in your{" "}
          <Code>.csproj</Code> — <Code>dotnet publish</Code> invokes crossgen2 automatically. You
          never call crossgen2 directly.
          <br />
          <br />
          At runtime, the CLR uses the pre-compiled native code —{" "}
          <strong className="text-emerald-700 dark:text-emerald-300">much faster cold start</strong>.
          JIT is still available as fallback, and Tier 1 can still kick in for hot paths.
        </p>
      </div>

      {/* Benchmarking */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/30 p-5 space-y-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-blue-900 dark:text-blue-200">
          <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden />
          Benchmarking & DOTNET_TieredCompilation=0
        </h3>

        {/* What is benchmarking? */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">
            What is benchmarking?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Benchmarking means{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              measuring how fast your code runs
            </strong>
            . You run a piece of code thousands of times and record how long it takes. The problem in
            .NET is tiered compilation makes timing tricky:
          </p>

          <ul className="space-y-2 mb-4">
            {[
              {
                when: "1st call",
                what: "Tier 0 — slow, unoptimized",
                danger: "measure here → looks SLOW",
                color: "amber",
              },
              { when: "...warming up...", what: "JIT collecting data", danger: "", color: "slate" },
              {
                when: "1000th call",
                what: "Tier 1 kicks in — optimized",
                danger: "measure here → looks FAST",
                color: "emerald",
              },
            ].map(({ when, what, danger, color }) => {
              const a = color === "slate" ? null : accentMap[color];
              return (
                <li key={when} className="flex items-center gap-3 text-xs">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full border font-bold whitespace-nowrap min-w-[90px] text-center flex-shrink-0",
                      a ? cn(a.chipBg, a.text, a.border) : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                    )}
                  >
                    {when}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 flex-1">{what}</span>
                  {danger && (
                    <span className={cn("italic flex-shrink-0", a ? a.text : "")}>
                      {danger}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
            If your benchmark runs only a few times, you might accidentally measure Tier 0 and think
            your code is slower than it really is — or get inconsistent results because you caught the
            Tier 0→1 transition mid-flight.
          </p>
        </div>

        {/* DOTNET_TieredCompilation=0 */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">
            Setting DOTNET_TieredCompilation=0
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            This is an{" "}
            <strong className="text-slate-800 dark:text-slate-200">environment variable</strong> — you
            set it in your terminal before running your app. It disables tiering so all methods compile
            at Tier 1 from the start, giving consistent measurements. Only use this for testing — never
            in production.
          </p>
          <div className="space-y-2">
            {[
              {
                label: "Windows (cmd)",
                cmd: "set DOTNET_TieredCompilation=0\ndotnet run",
                color: "blue",
              },
              {
                label: "PowerShell",
                cmd: "$env:DOTNET_TieredCompilation=0\ndotnet run",
                color: "violet",
              },
              {
                label: "Mac / Linux",
                cmd: "export DOTNET_TieredCompilation=0\ndotnet run",
                color: "emerald",
              },
            ].map(({ label, cmd, color }) => {
              const a = accentMap[color];
              return (
                <div key={label} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <div
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold border-b",
                      a.chipBg,
                      a.text,
                      a.border
                    )}
                  >
                    {label}
                  </div>
                  <pre className="bg-slate-800 dark:bg-slate-900 px-3 py-2 font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto m-0">
                    {cmd}
                  </pre>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
            Only affects that terminal session — close the terminal and it&apos;s gone.
          </p>
        </div>

        {/* BenchmarkDotNet */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3">
            BenchmarkDotNet — the proper way
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            BenchmarkDotNet is the standard .NET benchmarking library. It handles all the pitfalls
            automatically — warmup, tiering, statistics. You just mark methods with{" "}
            <Code>[Benchmark]</Code> and it does the rest.
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                Step 1 — Add the package
              </p>
              <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 px-3 py-2 font-mono text-xs text-amber-300 overflow-x-auto">
                dotnet add package BenchmarkDotNet
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                Step 2 — Write a benchmark
              </p>
              <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
                <div className="text-slate-500">{"// using BenchmarkDotNet.Attributes;"}</div>
                <div className="text-slate-500">{"// using BenchmarkDotNet.Running;"}</div>
                <div className="text-slate-300 mt-2">{"public class MyBenchmarks"}</div>
                <div className="text-slate-300">{"{"}</div>
                <div className="pl-4 text-emerald-400">{"[Benchmark]"}</div>
                <div className="pl-4 text-slate-300">{"public void WithPlus()"}</div>
                <div className="pl-4 text-slate-300">{"{"}</div>
                <div className="pl-8 text-slate-300">
                  {'var s = "hello" + " " + "world";'}
                </div>
                <div className="pl-4 text-slate-300">{"}"}</div>
                <div className="mt-2 pl-4 text-emerald-400">{"[Benchmark]"}</div>
                <div className="pl-4 text-slate-300">{"public void WithBuilder()"}</div>
                <div className="pl-4 text-slate-300">{"{"}</div>
                <div className="pl-8 text-slate-300">{"var sb = new StringBuilder();"}</div>
                <div className="pl-8 text-slate-300">{'sb.Append("hello ");'}</div>
                <div className="pl-8 text-slate-300">{'sb.Append("world");'}</div>
                <div className="pl-4 text-slate-300">{"}"}</div>
                <div className="text-slate-300">{"}"}</div>
                <div className="mt-2 text-slate-500">{"// In Main():"}</div>
                <div className="text-slate-300">
                  {"BenchmarkRunner.Run<MyBenchmarks>();"}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                Step 3 — Run in Release mode
              </p>
              <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 px-3 py-2 font-mono text-xs text-amber-300 overflow-x-auto">
                dotnet run -c Release
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                ⚠ Debug mode gives meaningless numbers — always use -c Release
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                Step 4 — Reading the results
              </p>
              <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs overflow-x-auto mb-3">
                <div className="text-slate-500 mb-2">// BenchmarkDotNet output</div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left text-slate-400 font-semibold py-1.5 pr-6">Method</th>
                      <th className="text-right text-slate-400 font-semibold py-1.5 px-3">Mean</th>
                      <th className="text-right text-slate-400 font-semibold py-1.5 px-3">Error</th>
                      <th className="text-right text-slate-400 font-semibold py-1.5 pl-3">StdDev</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-emerald-400 py-1.5 pr-6">WithPlus</td>
                      <td className="text-right text-amber-300 py-1.5 px-3">12.3 ns</td>
                      <td className="text-right text-amber-300 py-1.5 px-3">0.1 ns</td>
                      <td className="text-right text-amber-300 py-1.5 pl-3">0.1 ns</td>
                    </tr>
                    <tr>
                      <td className="text-emerald-400 py-1.5 pr-6">WithBuilder</td>
                      <td className="text-right text-amber-300 py-1.5 px-3">45.6 ns</td>
                      <td className="text-right text-amber-300 py-1.5 px-3">0.3 ns</td>
                      <td className="text-right text-amber-300 py-1.5 pl-3">0.2 ns</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="space-y-2">
                {[
                  {
                    term: "Mean",
                    desc: "Average time per call — the main number you care about",
                    color: "blue",
                  },
                  {
                    term: "Error",
                    desc: "Margin of uncertainty in the measurement",
                    color: "amber",
                  },
                  {
                    term: "StdDev",
                    desc: "How consistent results were — low = stable & trustworthy",
                    color: "emerald",
                  },
                ].map(({ term, desc, color }) => {
                  const a = accentMap[color];
                  return (
                    <li key={term} className="flex items-center gap-2 text-xs">
                      <span
                        className={cn(
                          "font-bold px-2 py-0.5 rounded border flex-shrink-0 min-w-[60px] text-center",
                          a.chipBg,
                          a.text,
                          a.border
                        )}
                      >
                        {term}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Key rules */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            Key rules to remember
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {[
              {
                rule: "Always -c Release",
                why: "Debug builds have no JIT optimizations — results are meaningless",
              },
              {
                rule: "Never use the IDE run button",
                why: "It usually runs Debug mode by default",
              },
              {
                rule: "Let it finish fully",
                why: "It runs warmup + many iterations — don't interrupt it",
              },
              {
                rule: "Separate project",
                why: "Don't benchmark inside your main app project",
              },
            ].map(({ rule, why }) => (
              <li key={rule} className="px-3 py-2.5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 text-xs">
                <span className="font-semibold text-blue-700 dark:text-blue-300 sm:w-52 flex-shrink-0">
                  ✓ {rule}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Compile Modes Tab ─────────────────────────────────────────────────────

type Mode = (typeof compileModes)[number];

function CompileTab({
  activeMode,
  setActiveMode,
  mode,
}: {
  activeMode: string;
  setActiveMode: (id: string) => void;
  mode: Mode;
}) {
  const a = accentMap[mode.accent];

  return (
    <section id="panel-compile" role="tabpanel" aria-labelledby="tab-compile" className="space-y-6">
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Three ways to ship .NET code. Each has real trade-offs.
      </p>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Compile mode">
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
      <div className={cn("rounded-xl border-2 p-5 bg-white dark:bg-slate-900", a.border)}>
        <dl className="space-y-3 mb-5">
          <Metric label="Startup" value={mode.startup} note={mode.startupNote} />
          <Metric label="Memory" value={mode.memory} note={mode.memoryNote} />
          <Metric label="Peak throughput" value={mode.perf} note={mode.perfNote} />
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
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">⚠ Cons</h4>
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

        <div className={cn("rounded-lg px-4 py-3 border", a.border, a.bg)}>
          <span className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>
            Use for:{" "}
          </span>
          <span className="text-sm text-slate-700 dark:text-slate-300">{mode.useFor}</span>
        </div>
      </div>

      {/* Decision guide */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          Quick decision guide
        </h3>
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { scenario: "Big ASP.NET Core / EF Core app", choice: "JIT + R2R", accent: "emerald" },
            {
              scenario: "Serverless / Lambda / Azure Functions",
              choice: "Native AOT or R2R",
              accent: "amber",
            },
            {
              scenario: "CLI tool / sidecar / gRPC microservice",
              choice: "Native AOT",
              accent: "rose",
            },
            {
              scenario: "App with lots of reflection / plugins",
              choice: "JIT only",
              accent: "blue",
            },
          ].map(({ scenario, choice, accent }) => {
            const cAcc = accentMap[accent];
            return (
              <li key={scenario} className="py-3 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-700 dark:text-slate-300">{scenario}</span>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap",
                    cAcc.chipBg,
                    cAcc.text,
                    cAcc.border
                  )}
                >
                  {choice}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 w-32 flex-shrink-0">
        {label}
      </dt>
      <dd className="flex-1">
        <span className="text-base font-bold text-slate-900 dark:text-slate-100">{value}</span>
        <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">— {note}</span>
      </dd>
    </div>
  );
}

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
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", tones.icon)} aria-hidden />
        <div className="flex-1 min-w-0">
          {title && <h4 className={cn("text-sm font-bold mb-1.5", tones.title)}>{title}</h4>}
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
}
