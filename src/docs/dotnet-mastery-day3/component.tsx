"use client";

import { useState, useRef } from "react";
import {
  Package,
  BarChart3,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Database,
  GitBranch,
  Layers,
  Wrench,
  RefreshCw,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Accent map ───────────────────────────────────────────────────────────

const accentMap: Record<
  string,
  { border: string; bg: string; text: string; ring: string; chipBg: string }
> = {
  violet: { border: "border-violet-300 dark:border-violet-700", bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700 dark:text-violet-300", ring: "ring-violet-400", chipBg: "bg-violet-100 dark:bg-violet-900/50" },
  rose: { border: "border-rose-300 dark:border-rose-700", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-400", chipBg: "bg-rose-100 dark:bg-rose-900/50" },
  emerald: { border: "border-emerald-300 dark:border-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-400", chipBg: "bg-emerald-100 dark:bg-emerald-900/50" },
  blue: { border: "border-blue-300 dark:border-blue-700", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-400", chipBg: "bg-blue-100 dark:bg-blue-900/50" },
  amber: { border: "border-amber-300 dark:border-amber-700", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-400", chipBg: "bg-amber-100 dark:bg-amber-900/50" },
  cyan: { border: "border-cyan-300 dark:border-cyan-700", bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-700 dark:text-cyan-300", ring: "ring-cyan-400", chipBg: "bg-cyan-100 dark:bg-cyan-900/50" },
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
      {children}
    </code>
  );
}

function Callout({ tone, icon: Icon, title, children }: { tone: "amber" | "emerald" | "blue"; icon: React.ElementType; title?: string; children: React.ReactNode }) {
  const a = accentMap[tone];
  return (
    <div className={cn("rounded-lg border p-4 flex gap-3", a.border, a.bg)}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", a.text)} aria-hidden />
      <div>
        {title && <p className={cn("text-sm font-bold mb-1", a.text)}>{title}</p>}
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────

type TabId = "tracking" | "queries" | "performance" | "migrations" | "advanced";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "tracking", label: "Tracking & Context", Icon: Database },
  { id: "queries", label: "Query Translation", Icon: Search },
  { id: "performance", label: "Performance", Icon: Zap },
  { id: "migrations", label: "Migrations", Icon: GitBranch },
  { id: "advanced", label: "Advanced Patterns", Icon: Layers },
];

export default function DotNetMasteryDay3() {
  const [tab, setTab] = useState<TabId>("tracking");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") { const next = (index + 1) % TABS.length; tabRefs.current[next]?.focus(); setTab(TABS[next].id); }
    else if (e.key === "ArrowLeft") { const prev = (index - 1 + TABS.length) % TABS.length; tabRefs.current[prev]?.focus(); setTab(TABS[prev].id); }
  }

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Mastery Guide · Day 3 of 7</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">EF Core Deep Dive</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">Change tracking internals, query translation, N+1 detection, projections, bulk operations, concurrency, and migrations.</p>
      </header>

      <div role="tablist" aria-label="Day 3 topics" className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, Icon }, i) => {
          const active = tab === id;
          return (
            <button key={id} id={`tab-d3-${id}`} role="tab" aria-selected={active} aria-controls={`panel-d3-${id}`}
              tabIndex={active ? 0 : -1} ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => setTab(id)} onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                active ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700")}>
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      {tab === "tracking" && <section id="panel-d3-tracking" role="tabpanel" aria-labelledby="tab-d3-tracking" className="space-y-6"><TrackingTab /></section>}
      {tab === "queries" && <section id="panel-d3-queries" role="tabpanel" aria-labelledby="tab-d3-queries" className="space-y-6"><QueriesTab /></section>}
      {tab === "performance" && <section id="panel-d3-performance" role="tabpanel" aria-labelledby="tab-d3-performance" className="space-y-6"><PerformanceTab /></section>}
      {tab === "migrations" && <section id="panel-d3-migrations" role="tabpanel" aria-labelledby="tab-d3-migrations" className="space-y-6"><MigrationsTab /></section>}
      {tab === "advanced" && <section id="panel-d3-advanced" role="tabpanel" aria-labelledby="tab-d3-advanced" className="space-y-6"><AdvancedTab /></section>}
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1 — Tracking & Context
// ═══════════════════════════════════════════════════════════════════════════

function TrackingTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The <Code>DbContext</Code> is a unit-of-work and identity map combined. Every entity it tracks has a state — understanding those states is the foundation of correct EF Core usage.
      </p>
      <EntityStates />
      <ChangeTrackerInternals />
      <TrackingAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function EntityStates() {
  const states = [
    { state: "Detached", accent: "cyan", desc: "Not known to the context. Default for new objects created outside EF.", example: "var o = new Order(); // Detached" },
    { state: "Added", accent: "emerald", desc: "Will be INSERT-ed on SaveChanges. Set when you call context.Add() or context.Orders.Add().", example: "context.Orders.Add(order); // Added" },
    { state: "Unchanged", accent: "blue", desc: "Loaded from DB, no modifications detected. SaveChanges is a no-op for these.", example: "var o = await db.Orders.FindAsync(1); // Unchanged" },
    { state: "Modified", accent: "amber", desc: "A tracked property was changed. Will generate an UPDATE on SaveChanges.", example: "order.Status = \"Shipped\"; // Modified" },
    { state: "Deleted", accent: "rose", desc: "Will be DELETE-d on SaveChanges. Set via context.Remove().", example: "context.Orders.Remove(order); // Deleted" },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Database className="h-4 w-4" aria-hidden />
        Entity state machine — 5 states
      </h3>
      <div className="space-y-2">
        {states.map(({ state, accent, desc, example }) => {
          const a = accentMap[accent];
          return (
            <div key={state} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-3 flex gap-3 items-start", a.border)}>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 mt-0.5", a.chipBg, a.text, a.border)}>{state}</span>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                <div className="font-mono text-xs text-emerald-400">{example}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChangeTrackerInternals() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <RefreshCw className="h-4 w-4" aria-hidden />
        How change tracking works internally
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        When EF loads an entity, it stores a <strong className="text-slate-800 dark:text-slate-200">snapshot</strong> of the original property values in the <Code>ChangeTracker</Code>. On <Code>SaveChanges()</Code>, it compares current values to the snapshot. Any difference → Modified state → UPDATE SQL. This is <em>snapshot tracking</em>.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Snapshot tracking (default)", desc: "EF stores a copy of all original values. Detects changes on SaveChanges by comparing. Higher memory cost but automatic.", accent: "blue" },
          { label: "Proxy change tracking", desc: "EF generates a derived proxy class with overridden property setters that mark the entity Modified immediately. Faster detection, requires virtual properties.", accent: "violet" },
        ].map(({ label, desc, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-1", a.border)}>
              <p className={cn("text-xs font-bold", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
      <Callout tone="emerald" icon={CheckCircle2} title="AsNoTracking() — always use for reads">
        For read-only queries, add <Code>.AsNoTracking()</Code>. EF skips the snapshot copy entirely — less memory, faster materialization, no identity map lookup. Rule: if you will not call SaveChanges with these entities, use AsNoTracking.
      </Callout>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Inspect tracking state at any time"}</div>
        <div className="text-emerald-400">{"foreach (var entry in context.ChangeTracker.Entries())"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"Console.WriteLine($\"{entry.Entity.GetType().Name}: {entry.State}\");"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
    </div>
  );
}

function TrackingAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "attach",
      title: "Attach vs Update vs Entry — reconnecting detached entities",
      accent: "amber",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">In disconnected scenarios (web APIs), entities arrive detached. You must tell EF what state they should be in before calling SaveChanges.</p>
          <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-slate-500">{"// context.Attach — marks Unchanged, only changed props → Modified"}</div>
            <div className="text-slate-300">{"context.Attach(dto);"}</div>
            <div className="text-slate-300">{"context.Entry(dto).Property(x => x.Name).IsModified = true;"}</div>
            <div className="text-slate-400">{""}</div>
            <div className="text-slate-500">{"// context.Update — marks ALL properties Modified (full UPDATE)"}</div>
            <div className="text-slate-300">{"context.Update(dto);   // avoid — sends unnecessary columns"}</div>
            <div className="text-slate-400">{""}</div>
            <div className="text-slate-500">{"// Best pattern: load → apply changes → SaveChanges"}</div>
            <div className="text-emerald-400">{"var order = await context.Orders.FindAsync(dto.Id);"}</div>
            <div className="text-slate-300">{"order!.Status = dto.Status;"}</div>
            <div className="text-emerald-400">{"await context.SaveChangesAsync();"}</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {items.map(({ id, title, accent, content }) => {
        const a = accentMap[accent];
        const isOpen = open === id;
        return (
          <div key={id} className="rounded-xl border-2 overflow-hidden border-slate-200 dark:border-slate-700">
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`tr-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`tr-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2 — Query Translation
// ═══════════════════════════════════════════════════════════════════════════

function QueriesTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        EF translates LINQ to SQL at runtime using an expression tree pipeline. Understanding when translation succeeds — and when it silently client-evaluates — prevents N+1 bugs and expensive full-table scans.
      </p>
      <QueryPipeline />
      <NPlus1Section />
      <ProjectionSection />
    </>
  );
}

function QueryPipeline() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Search className="h-4 w-4" aria-hidden />
        LINQ → SQL translation pipeline
      </h3>
      <div className="space-y-2">
        {[
          { n: "1", label: "Expression tree built", desc: "LINQ operators (Where, Select, OrderBy) build an in-memory expression tree. No SQL yet, no DB round-trip.", accent: "violet" },
          { n: "2", label: "Query compilation", desc: "EF compiles the expression tree to a RelationalQueryExpression, then optimizes joins, predicates, and projections.", accent: "blue" },
          { n: "3", label: "SQL generation", desc: "The query model is turned into parameterized SQL. EF caches the compiled plan by query shape (not by parameter values).", accent: "emerald" },
          { n: "4", label: "Execution + materialization", desc: "ADO.NET sends the SQL. EF reads the DbDataReader row-by-row, constructs entity objects, and registers them in the identity map.", accent: "amber" },
        ].map(({ n, label, desc, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={n} className="flex gap-3 items-start">
              <span className={cn("inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5", a.chipBg, a.text)}>{n}</span>
              <div className="flex-1 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-3 space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Callout tone="amber" icon={AlertTriangle} title="Client evaluation trap">
        If EF cannot translate a LINQ operator to SQL (e.g. a custom C# method), it throws in strict mode. In older versions it silently fetched all rows and filtered in memory — a full table scan hidden in clean-looking C# code.
      </Callout>
    </div>
  );
}

function NPlus1Section() {
  return (
    <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        N+1 queries — the silent performance killer
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        N+1 happens when you load N entities then access a navigation property in a loop — EF issues 1 query for the parent list and N more for the children. With 1000 orders, that is 1001 round-trips.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border-2 border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">⚠ N+1 bug</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-slate-500">{"// 1 query → loads orders"}</div>
            <div className="text-slate-300">{"var orders = await db.Orders.ToListAsync();"}</div>
            <div className="text-slate-500">{"// N queries — one per order!"}</div>
            <div className="text-emerald-400">{"foreach (var o in orders)"}</div>
            <div className="text-slate-300">{"    Console.WriteLine(o.Customer.Name);"}</div>
          </div>
        </div>
        <div className="rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">✓ Fix: eager load</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-slate-500">{"// Single JOIN query"}</div>
            <div className="text-emerald-400">{"var orders = await db.Orders"}</div>
            <div className="pl-4 text-emerald-400">{"    .Include(o => o.Customer)"}</div>
            <div className="pl-4 text-slate-300">{"    .ToListAsync();"}</div>
            <div className="text-slate-500">{"// No extra queries in the loop"}</div>
            <div className="text-slate-300">{"foreach (var o in orders)"}</div>
            <div className="text-slate-300">{"    Console.WriteLine(o.Customer.Name);"}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Better fix: project, don&apos;t include</p>
        <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
          <div className="text-slate-500">{"// Include loads the full entity — projection loads only what you need"}</div>
          <div className="text-emerald-400">{"var rows = await db.Orders.Select(o => new"}</div>
          <div className="pl-4 text-slate-300">{"{"}</div>
          <div className="pl-8 text-slate-300">{"o.Id, o.Total, CustomerName = o.Customer.Name"}</div>
          <div className="pl-4 text-slate-300">{"}).ToListAsync();"}</div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">EF translates the anonymous type Select into a SQL JOIN with only those three columns — no navigation property load required.</p>
      </div>
    </div>
  );
}

function ProjectionSection() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Package className="h-4 w-4" aria-hidden />
        Projections — the correct default for reads
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Projecting into a DTO or anonymous type means EF generates a <Code>SELECT col1, col2</Code> rather than <Code>SELECT *</Code>. Fewer bytes over the wire, no entity materialization cost, no change tracking overhead.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Projection into a record DTO — fully translated to SQL"}</div>
        <div className="text-emerald-400">{"var summaries = await db.Orders"}</div>
        <div className="pl-4 text-slate-300">{".Where(o => o.PlacedAt >= cutoff)"}</div>
        <div className="pl-4 text-slate-300">{".OrderByDescending(o => o.PlacedAt)"}</div>
        <div className="pl-4 text-slate-300">{".Take(50)"}</div>
        <div className="pl-4 text-slate-300">{".Select(o => new OrderSummaryDto("}</div>
        <div className="pl-8 text-slate-300">{"o.Id, o.Total, o.Customer.Name, o.Status))"}</div>
        <div className="pl-4 text-slate-300">{".ToListAsync();"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Generated SQL:"}</div>
        <div className="text-amber-300">{"// SELECT TOP(50) o.Id, o.Total, c.Name, o.Status"}</div>
        <div className="text-amber-300">{"// FROM Orders o JOIN Customers c ON o.CustomerId = c.Id"}</div>
        <div className="text-amber-300">{"// WHERE o.PlacedAt >= @cutoff ORDER BY o.PlacedAt DESC"}</div>
      </div>
      <Callout tone="blue" icon={BarChart3} title="Split queries for cartesian explosion">
        When <Code>Include</Code> loads a collection with many items, the JOIN multiplies rows (cartesian explosion). Use <Code>.AsSplitQuery()</Code> to issue separate queries per collection — EF assembles the graph in memory.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3 — Performance
// ═══════════════════════════════════════════════════════════════════════════

function PerformanceTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        EF Core is fast — when you use it correctly. These patterns cover the most impactful performance gains available without leaving EF.
      </p>
      <BulkOps />
      <CompiledQueries />
      <PerfAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function BulkOps() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Zap className="h-4 w-4" aria-hidden />
        ExecuteUpdate &amp; ExecuteDelete (.NET 7+) — bulk operations without loading entities
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        These methods translate directly to <Code>UPDATE</Code> and <Code>DELETE</Code> SQL without loading any entities into memory. No change tracking, no <Code>SaveChanges()</Code>, one round-trip.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border-2 border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 p-4 space-y-2">
          <p className="text-xs font-bold text-rose-700 dark:text-rose-300">⚠ Old way — N round-trips</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-slate-300">{"var orders = await db.Orders"}</div>
            <div className="pl-4 text-slate-300">{".Where(o => o.Status == \"Pending\")"}</div>
            <div className="pl-4 text-slate-300">{".ToListAsync();"}</div>
            <div className="text-emerald-400">{"foreach (var o in orders)"}</div>
            <div className="text-slate-300">{"    o.Status = \"Cancelled\";"}</div>
            <div className="text-slate-300">{"await db.SaveChangesAsync();"}</div>
          </div>
        </div>
        <div className="rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 p-4 space-y-2">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">✓ New way — 1 SQL UPDATE</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"await db.Orders"}</div>
            <div className="pl-4 text-slate-300">{".Where(o => o.Status == \"Pending\")"}</div>
            <div className="pl-4 text-emerald-400">{".ExecuteUpdateAsync(s => s"}</div>
            <div className="pl-8 text-slate-300">{".SetProperty(o => o.Status, \"Cancelled\"));"}</div>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// ExecuteDelete — generated: DELETE FROM Orders WHERE ..."}</div>
        <div className="text-emerald-400">{"await db.Orders"}</div>
        <div className="pl-4 text-slate-300">{".Where(o => o.ArchivedAt < DateTime.UtcNow.AddYears(-2))"}</div>
        <div className="pl-4 text-emerald-400">{".ExecuteDeleteAsync();"}</div>
      </div>
      <Callout tone="amber" icon={AlertTriangle} title="No cascade, no interceptors">
        ExecuteUpdate/Delete bypass EF&apos;s change tracking pipeline — cascade deletes, interceptors, and domain events do not fire. Use raw SQL for bulk ops only when those concerns don&apos;t apply.
      </Callout>
    </div>
  );
}

function CompiledQueries() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Zap className="h-4 w-4" aria-hidden />
        Compiled queries — eliminate per-call translation overhead
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        EF caches query plans automatically, but the cache lookup still involves expression tree hashing on every call. <Code>EF.CompileAsyncQuery</Code> compiles once at app startup and gives you a delegate — zero translation overhead per call.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Define at class/module level — compiled once"}</div>
        <div className="text-emerald-400">{"private static readonly Func<AppDbContext, int, Task<Order?>>"}</div>
        <div className="pl-4 text-emerald-400">{"    GetOrderById = EF.CompileAsyncQuery("}</div>
        <div className="pl-8 text-slate-300">{"(AppDbContext db, int id) =>"}</div>
        <div className="pl-8 text-slate-300">{"    db.Orders.Where(o => o.Id == id).FirstOrDefault());"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Use like a normal async method"}</div>
        <div className="text-slate-300">{"var order = await GetOrderById(db, orderId);"}</div>
      </div>
      <Callout tone="blue" icon={BarChart3} title="When it matters">
        Compiled queries matter most for high-frequency, hot-path queries (authentication lookups, per-request tenant resolution). For typical CRUD endpoints the automatic plan cache is sufficient.
      </Callout>
    </div>
  );
}

function PerfAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "notrack",
      title: "AsNoTrackingWithIdentityResolution — the best of both worlds",
      accent: "emerald",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <Code>.AsNoTracking()</Code> is fast but can return duplicate objects when the same entity appears via multiple joins. <Code>.AsNoTrackingWithIdentityResolution()</Code> skips change tracking but still deduplicates — useful for projections with includes.
          </p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"var orders = await db.Orders"}</div>
            <div className="pl-4 text-slate-300">{".Include(o => o.Items)"}</div>
            <div className="pl-4 text-slate-300">{".AsNoTrackingWithIdentityResolution()"}</div>
            <div className="pl-4 text-slate-300">{".ToListAsync();"}</div>
          </div>
        </div>
      ),
    },
    {
      id: "chunking",
      title: "Chunking large result sets with Chunk()",
      accent: "amber",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Processing millions of rows by loading them all at once causes memory pressure. Use <Code>.Chunk(size)</Code> to page the DB results in batches, or stream with <Code>IAsyncEnumerable</Code> to process row-by-row.
          </p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-slate-500">{"// Chunk — loads 500 rows at a time"}</div>
            <div className="text-emerald-400">{"await foreach (var batch in db.Events.Chunk(500))"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-slate-300">{"await ProcessBatchAsync(batch);"}</div>
            <div className="text-slate-300">{"}"}</div>
            <div className="text-slate-400">{""}</div>
            <div className="text-slate-500">{"// Stream — IAsyncEnumerable, one row at a time"}</div>
            <div className="text-emerald-400">{"await foreach (var row in db.Events.AsAsyncEnumerable())"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-slate-300">{"await HandleRowAsync(row);"}</div>
            <div className="text-slate-300">{"}"}</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {items.map(({ id, title, accent, content }) => {
        const a = accentMap[accent];
        const isOpen = open === id;
        return (
          <div key={id} className="rounded-xl border-2 overflow-hidden border-slate-200 dark:border-slate-700">
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`perf-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`perf-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4 — Migrations
// ═══════════════════════════════════════════════════════════════════════════

function MigrationsTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Migrations are snapshots of your model delta — not live schema introspection. Every migration stores an <Code>Up()</Code> and a <Code>Down()</Code> so schema changes are reversible.
      </p>
      <MigrationWorkflow />
      <MigrationPitfalls />
    </>
  );
}

function MigrationWorkflow() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <GitBranch className="h-4 w-4" aria-hidden />
        Migration workflow — daily commands
      </h3>
      <div className="space-y-2">
        {[
          { cmd: "dotnet ef migrations add AddOrderIndex", desc: "Compares current model to last migration snapshot → generates Migration.cs with Up/Down methods.", accent: "emerald" },
          { cmd: "dotnet ef database update", desc: "Applies all pending migrations to the target DB. Records applied migrations in __EFMigrationsHistory.", accent: "blue" },
          { cmd: "dotnet ef migrations remove", desc: "Removes the last migration — ONLY if it has not been applied to the DB.", accent: "amber" },
          { cmd: "dotnet ef migrations script", desc: "Generates a SQL script from migration history — use this for production deploys instead of dotnet ef database update.", accent: "violet" },
          { cmd: "dotnet ef database update 0", desc: "Rolls all migrations back to empty. Useful in dev; catastrophic in prod.", accent: "rose" },
        ].map(({ cmd, desc, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={cmd} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-3 space-y-1", a.border)}>
              <div className="font-mono text-xs text-emerald-400">{cmd}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MigrationPitfalls() {
  return (
    <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        Production migration pitfalls
      </h3>
      <div className="space-y-3">
        {[
          { title: "NOT NULL column without default", fix: "Adding a NOT NULL column to an existing table fails if rows exist. Always set a default via HasDefaultValue or in the migration SQL, then remove it later after backfilling.", accent: "rose" },
          { title: "Renaming a column vs drop + add", fix: "EF generates drop+add when you rename a property. Use .HasColumnName() in fluent API or manually edit the migration to use RenameColumn — otherwise you lose data.", accent: "amber" },
          { title: "Running database update in production", fix: "Use dotnet ef migrations script --idempotent to generate SQL then execute via your deployment pipeline with proper review. Never run migrations from app startup in production.", accent: "violet" },
          { title: "Large table index migrations holding locks", fix: "SQL Server and PostgreSQL support online index builds. Customize the migration with raw SQL: EXEC sp_executesql N'CREATE INDEX ... WITH (ONLINE=ON)'.", accent: "blue" },
        ].map(({ title, fix, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={title} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>⚠ {title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{fix}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5 — Advanced Patterns
// ═══════════════════════════════════════════════════════════════════════════

function AdvancedTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Concurrency control, global query filters, owned types, and interceptors — the patterns that separate fluent EF Core from accidental EF Core.
      </p>
      <ConcurrencySection />
      <AdvancedAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function ConcurrencySection() {
  return (
    <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Optimistic concurrency — rowversion tokens
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        EF supports optimistic concurrency via a concurrency token. On SaveChanges, EF adds a WHERE clause matching the token — if the row was updated by another actor, the token won&apos;t match, zero rows are updated, and EF throws <Code>DbUpdateConcurrencyException</Code>.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Entity with rowversion token"}</div>
        <div className="text-emerald-400">{"public class Order"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"public int Id { get; set; }"}</div>
        <div className="pl-4 text-slate-300">{"public string Status { get; set; } = \"\";"}</div>
        <div className="pl-4 text-slate-500">{"// SQL Server: rowversion; PostgreSQL: xmin column"}</div>
        <div className="pl-4 text-emerald-400">{"[Timestamp]"}</div>
        <div className="pl-4 text-slate-300">{"public byte[] RowVersion { get; set; } = [];"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Handle the conflict"}</div>
        <div className="text-emerald-400">{"try { await db.SaveChangesAsync(); }"}</div>
        <div className="text-emerald-400">{"catch (DbUpdateConcurrencyException ex)"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"var entry = ex.Entries.Single();"}</div>
        <div className="pl-4 text-slate-300">{"await entry.ReloadAsync(); // get current DB values"}</div>
        <div className="pl-4 text-slate-300">{"// merge / retry / return 409 Conflict to client"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
    </div>
  );
}

function AdvancedAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "filter",
      title: "Global query filters — automatic multi-tenancy & soft delete",
      accent: "violet",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Global filters are predicates applied to every query for an entity type — automatically, without remembering to add a Where clause everywhere.</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"protected override void OnModelCreating(ModelBuilder model)"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-slate-500">{"// Soft delete: IsDeleted = false on every query"}</div>
            <div className="pl-4 text-slate-300">{"model.Entity<Order>()"}</div>
            <div className="pl-8 text-slate-300">{".HasQueryFilter(o => !o.IsDeleted);"}</div>
            <div className="pl-4 text-slate-500">{"// Multi-tenant: only current tenant's rows"}</div>
            <div className="pl-4 text-slate-300">{"model.Entity<Invoice>()"}</div>
            <div className="pl-8 text-slate-300">{".HasQueryFilter(i => i.TenantId == _tenantId);"}</div>
            <div className="text-slate-300">{"}"}</div>
            <div className="text-slate-400">{""}</div>
            <div className="text-slate-500">{"// Bypass the filter when needed"}</div>
            <div className="text-slate-300">{"db.Orders.IgnoreQueryFilters().Where(...);"}</div>
          </div>
        </div>
      ),
    },
    {
      id: "owned",
      title: "Owned entity types — value objects in DDD",
      accent: "emerald",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Owned entities let you map a value object (Address, Money, DateRange) to columns in the owner&apos;s table without a separate table or foreign key.</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"public record Address(string Street, string City, string Zip);"}</div>
            <div className="text-slate-400">{""}</div>
            <div className="text-slate-500">{"// In OnModelCreating"}</div>
            <div className="text-slate-300">{"model.Entity<Customer>()"}</div>
            <div className="pl-4 text-slate-300">{".OwnsOne(c => c.BillingAddress, a =>"}</div>
            <div className="pl-4 text-slate-300">{"{"}</div>
            <div className="pl-8 text-slate-300">{"a.Property(x => x.Street).HasColumnName(\"BillingStreet\");"}</div>
            <div className="pl-8 text-slate-300">{"a.Property(x => x.City).HasColumnName(\"BillingCity\");"}</div>
            <div className="pl-4 text-slate-300">{"});"}</div>
            <div className="text-slate-500">{"// Result: columns BillingStreet, BillingCity, BillingZip on Customers table"}</div>
          </div>
        </div>
      ),
    },
    {
      id: "interceptors",
      title: "Interceptors — audit log without touching entities",
      accent: "blue",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Interceptors hook into EF&apos;s pipeline — before/after commands, before/after SaveChanges, connection events. Perfect for audit logging, soft-delete enforcement, and domain event dispatching.</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"public class AuditInterceptor : SaveChangesInterceptor"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-emerald-400">{"public override ValueTask<InterceptionResult<int>> SavingChangesAsync("}</div>
            <div className="pl-8 text-emerald-400">{"    DbContextEventData data, InterceptionResult<int> result,"}</div>
            <div className="pl-8 text-emerald-400">{"    CancellationToken ct)"}</div>
            <div className="pl-4 text-slate-300">{"{"}</div>
            <div className="pl-8 text-slate-300">{"foreach (var entry in data.Context!.ChangeTracker.Entries<IAuditable>())"}</div>
            <div className="pl-8 text-slate-300">{"    entry.Entity.UpdatedAt = DateTime.UtcNow;"}</div>
            <div className="pl-8 text-emerald-400">{"    return base.SavingChangesAsync(data, result, ct);"}</div>
            <div className="pl-4 text-slate-300">{"}"}</div>
            <div className="text-slate-300">{"}"}</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {items.map(({ id, title, accent, content }) => {
        const a = accentMap[accent];
        const isOpen = open === id;
        return (
          <div key={id} className="rounded-xl border-2 overflow-hidden border-slate-200 dark:border-slate-700">
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`adv-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`adv-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}
