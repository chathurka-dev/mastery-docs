"use client";

import { useState, useRef } from "react";
import {
  Package,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Wrench,
  GitBranch,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const accentMap: Record<string, { border: string; bg: string; text: string; ring: string; chipBg: string }> = {
  violet: { border: "border-violet-300 dark:border-violet-700", bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700 dark:text-violet-300", ring: "ring-violet-400", chipBg: "bg-violet-100 dark:bg-violet-900/50" },
  rose: { border: "border-rose-300 dark:border-rose-700", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-400", chipBg: "bg-rose-100 dark:bg-rose-900/50" },
  emerald: { border: "border-emerald-300 dark:border-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-400", chipBg: "bg-emerald-100 dark:bg-emerald-900/50" },
  blue: { border: "border-blue-300 dark:border-blue-700", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-400", chipBg: "bg-blue-100 dark:bg-blue-900/50" },
  amber: { border: "border-amber-300 dark:border-amber-700", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-400", chipBg: "bg-amber-100 dark:bg-amber-900/50" },
  cyan: { border: "border-cyan-300 dark:border-cyan-700", bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-700 dark:text-cyan-300", ring: "ring-cyan-400", chipBg: "bg-cyan-100 dark:bg-cyan-900/50" },
};

function Code({ children }: { children: React.ReactNode }) {
  return <code className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">{children}</code>;
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

type TabId = "net7" | "net8" | "net9" | "net10" | "migration";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "net7", label: ".NET 7", Icon: Zap },
  { id: "net8", label: ".NET 8 LTS", Icon: Sparkles },
  { id: "net9", label: ".NET 9", Icon: Layers },
  { id: "net10", label: ".NET 10", Icon: GitBranch },
  { id: "migration", label: "Migration Guide", Icon: RefreshCw },
];

export default function DotNetMasteryDay5() {
  const [tab, setTab] = useState<TabId>("net7");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") { const next = (index + 1) % TABS.length; tabRefs.current[next]?.focus(); setTab(TABS[next].id); }
    else if (e.key === "ArrowLeft") { const prev = (index - 1 + TABS.length) % TABS.length; tabRefs.current[prev]?.focus(); setTab(TABS[prev].id); }
  }

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Mastery Guide · Day 5 of 7</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">.NET 6 → 10 Version Deltas</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">What actually changed in each version — language features, runtime improvements, BCL additions, and breaking changes worth knowing.</p>
      </header>

      <div role="tablist" aria-label="Day 5 topics" className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, Icon }, i) => {
          const active = tab === id;
          return (
            <button key={id} id={`tab-d5-${id}`} role="tab" aria-selected={active} aria-controls={`panel-d5-${id}`}
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

      {tab === "net7" && <section id="panel-d5-net7" role="tabpanel" aria-labelledby="tab-d5-net7" className="space-y-6"><Net7Tab /></section>}
      {tab === "net8" && <section id="panel-d5-net8" role="tabpanel" aria-labelledby="tab-d5-net8" className="space-y-6"><Net8Tab /></section>}
      {tab === "net9" && <section id="panel-d5-net9" role="tabpanel" aria-labelledby="tab-d5-net9" className="space-y-6"><Net9Tab /></section>}
      {tab === "net10" && <section id="panel-d5-net10" role="tabpanel" aria-labelledby="tab-d5-net10" className="space-y-6"><Net10Tab /></section>}
      {tab === "migration" && <section id="panel-d5-migration" role="tabpanel" aria-labelledby="tab-d5-migration" className="space-y-6"><MigrationTab /></section>}
    </article>
  );
}

// ─── Shared feature card ──────────────────────────────────────────────────

function FeatureCard({ title, accent, desc, code }: { title: string; accent: string; desc: string; code?: string[] }) {
  const a = accentMap[accent];
  return (
    <div className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
      <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold border", a.chipBg, a.text, a.border)}>{title}</span>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
      {code && (
        <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
          {code.map((line, i) => <div key={i} className={line.startsWith("//") ? "text-slate-500" : line.trim() === "" ? "text-slate-400" : "text-slate-300"}>{line || " "}</div>)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// .NET 7
// ═══════════════════════════════════════════════════════════════════════════

function Net7Tab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        .NET 7 (Nov 2022, STS) — significant performance jump via Dynamic PGO, and two headline language features: required members and generic math.
      </p>
      <Net7Language />
      <Net7Runtime />
    </>
  );
}

function Net7Language() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        C# 11 — Language features
      </h3>
      <div className="space-y-3">
        <FeatureCard
          title="Required members"
          accent="violet"
          desc="required keyword on properties/fields — compiler error if not set in object initializer. Replaces constructor overloads for enforcing initialization."
          code={["public class Order", "{", "    public required int CustomerId { get; init; }", "    public required string Reference { get; init; }", "}", "", "var o = new Order { CustomerId = 1, Reference = \"ORD-001\" }; // ✓", "var bad = new Order(); // CS9035 — required member not set"]}
        />
        <FeatureCard
          title="Generic math (INumber<T>)"
          accent="blue"
          desc="Static abstract interface members allow generic algorithms over numeric types. Write Sum<T> once, works with int, double, decimal."
          code={["static T Sum<T>(IEnumerable<T> values) where T : INumber<T>", "    => values.Aggregate(T.Zero, (acc, v) => acc + v);", "", "Sum([1, 2, 3])       // 6 (int)", "Sum([1.1, 2.2])      // 3.3 (double)"]}
        />
        <FeatureCard
          title="Raw string literals"
          accent="emerald"
          desc='Triple-quoted strings preserve whitespace exactly, support interpolation, and eliminate escape sequences. Ideal for JSON, SQL, regex.'
          code={['var json = """', '    {', '        "id": 1,', '        "name": "test"', '    }', '    """;']}
        />
        <FeatureCard
          title="File-scoped types"
          accent="amber"
          desc="file access modifier restricts a type to the file it's declared in. Useful for source generator output and internal implementation helpers."
          code={["file class QueryHelper  // only visible in this .cs file", "{", "    public static string BuildSql() => \"SELECT 1\";", "}"]}
        />
      </div>
    </div>
  );
}

function Net7Runtime() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Zap className="h-4 w-4" aria-hidden />
        Runtime &amp; BCL improvements
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Dynamic PGO on by default", accent: "emerald", desc: "Profile-Guided Optimization now enabled by default. JIT instruments hot code in Tier 0, re-JITs with specializations in Tier 1. Up to 20% throughput gains." },
          { label: "Native AOT (preview)", accent: "violet", desc: "Compile to a self-contained native binary with no JIT. Tiny size, instant startup — but no dynamic code generation, limited reflection." },
          { label: "Regex source generator", accent: "blue", desc: "[GeneratedRegex] compiles regex at build time. Zero allocation, no runtime compilation overhead, fully AOT-compatible." },
          { label: "Rate limiting middleware", accent: "amber", desc: "Built-in RateLimiterMiddleware with fixed window, sliding window, token bucket, and concurrency limiters. No third-party package needed." },
        ].map(({ label, accent, desc }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-1", a.border)}>
              <p className={cn("text-xs font-bold", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// .NET 8 LTS
// ═══════════════════════════════════════════════════════════════════════════

function Net8Tab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        .NET 8 (Nov 2023, LTS — 3 years support) — the most impactful release since .NET 6. Primary constructors, collection expressions, frozen collections, and major ASP.NET Core improvements.
      </p>
      <Net8Language />
      <Net8Aspnet />
    </>
  );
}

function Net8Language() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        C# 12 — Language features
      </h3>
      <div className="space-y-3">
        <FeatureCard
          title="Primary constructors on classes"
          accent="violet"
          desc="Constructor parameters available throughout the class body. Eliminates boilerplate field declarations for DI. Available on all class types (not just records)."
          code={["public class OrderService(AppDbContext db, ILogger<OrderService> log)", "{", "    // db and log are in scope everywhere", "    public async Task<Order?> GetAsync(int id)", "        => await db.Orders.FindAsync(id);", "}"]}
        />
        <FeatureCard
          title="Collection expressions"
          accent="blue"
          desc="Unified syntax [a, b, c] works for arrays, List<T>, Span<T>, ImmutableArray<T>. Spread operator .. inlines one collection into another."
          code={["int[] odds = [1, 3, 5];", "int[] evens = [2, 4, 6];", "int[] all = [..odds, ..evens, 7];  // [1,3,5,2,4,6,7]", "", "// Works for List<T>, Span<T>, ImmutableArray<T>, etc.", "List<string> tags = [\"dotnet\", \"csharp\"];"]}
        />
        <FeatureCard
          title="Default lambda parameters"
          accent="emerald"
          desc="Lambda parameters can now have default values, matching the behavior of regular method parameters."
          code={["var greet = (string name, string prefix = \"Hello\") => $\"{prefix}, {name}!\";", "greet(\"Alice\");          // Hello, Alice!", "greet(\"Bob\", \"Hi\");      // Hi, Bob!"]}
        />
        <FeatureCard
          title="Alias any type"
          accent="amber"
          desc="using alias directives now work for tuples, arrays, and nullable types — not just named types."
          code={["using Point = (int X, int Y);", "using Matrix = int[][];", "Point origin = (0, 0);"]}
        />
      </div>
    </div>
  );
}

function Net8Aspnet() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Package className="h-4 w-4" aria-hidden />
        ASP.NET Core &amp; runtime highlights
      </h3>
      <div className="space-y-3">
        {[
          { label: "Keyed DI services", accent: "blue", desc: "AddKeyedScoped/Singleton/Transient + [FromKeyedServices(key)] attribute for resolving named implementations without factory methods.", code: ["services.AddKeyedScoped<ICache, RedisCache>(\"redis\");", "services.AddKeyedScoped<ICache, MemoryCache>(\"memory\");"] },
          { label: "FrozenDictionary / FrozenSet", accent: "emerald", desc: "Immutable collections optimized for read-heavy workloads. Build once at startup, look up fast. ~2–4× faster lookup than Dictionary for small-medium sizes.", code: ["var frozen = new Dictionary<string, int> { [\"a\"] = 1 }", "    .ToFrozenDictionary();  // build once", "var v = frozen[\"a\"];       // fast lookups forever"] },
          { label: "System.Text.Json source generation improvements", accent: "violet", desc: "JsonSerializerContext now supports more patterns, required properties, non-public members, and interface hierarchies. AOT-compatible JSON serialization." },
          { label: "Metrics with System.Diagnostics.Metrics", accent: "amber", desc: "First-class built-in metrics API aligned with OpenTelemetry. IMeterFactory is registered in DI. Meter, Counter<T>, Histogram<T> — no third-party required." },
        ].map(({ label, accent, desc, code }) => <FeatureCard key={label} title={label} accent={accent} desc={desc} code={code} />)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// .NET 9
// ═══════════════════════════════════════════════════════════════════════════

function Net9Tab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        .NET 9 (Nov 2024, STS) — LINQ gains, runtime improvements, Blazor enhancements, and C# 13 partial properties.
      </p>
      <Net9Language />
      <Net9Bcl />
    </>
  );
}

function Net9Language() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        C# 13 — Language features
      </h3>
      <div className="space-y-3">
        <FeatureCard
          title="Partial properties"
          accent="violet"
          desc="partial keyword extends to properties and indexers, not just methods. Source generators can now generate property implementations, not just method bodies."
          code={["// Declaration (in user code)", "public partial class MyEntity", "{", "    public partial string Name { get; set; }", "}", "", "// Implementation (generated or in another partial file)", "public partial class MyEntity", "{", "    private string _name = \"\";", "    public partial string Name", "    {", "        get => _name;", "        set => _name = value?.Trim() ?? \"\";", "    }", "}"]}
        />
        <FeatureCard
          title="params with IEnumerable<T>"
          accent="blue"
          desc="params now works with any type implementing IEnumerable<T> — not just arrays. Enables accepting spans, lists, or any collection without overloads."
          code={["void LogAll(params IEnumerable<string> messages)", "{", "    foreach (var m in messages) Console.WriteLine(m);", "}", "", "LogAll(\"a\", \"b\", \"c\");   // works", "LogAll([\"x\", \"y\"]);      // also works"]}
        />
        <FeatureCard
          title="Lock type (System.Threading.Lock)"
          accent="emerald"
          desc="New Lock class replaces the object-based lock pattern. Scoped via EnterScope() returning a ref struct — no accidental boxing, compiler-enforced disposal."
          code={["private readonly Lock _lock = new();", "", "using (_lock.EnterScope())  // ref struct — stack-only, no alloc", "{", "    _sharedState++;", "}"]}
        />
      </div>
    </div>
  );
}

function Net9Bcl() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Wrench className="h-4 w-4" aria-hidden />
        BCL &amp; runtime highlights
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "LINQ: CountBy, AggregateBy, Index", accent: "emerald", desc: "CountBy groups by key and returns counts. AggregateBy applies aggregation per key. Index yields (index, element) pairs — replaces Select((x, i) => ...)." },
          { label: "Task.WhenEach", accent: "blue", desc: "Returns an IAsyncEnumerable<Task<T>> that yields tasks as they complete — not in submission order. Replaces complex WhenAny polling loops." },
          { label: "SearchValues<string>", accent: "violet", desc: "Extended SearchValues to string sets for fast multi-string searching. Used internally by HttpClient headers, MIME parsing." },
          { label: "Tensor primitives", accent: "amber", desc: "System.Numerics.Tensors with SIMD-accelerated operations on float spans. Foundation for AI/ML workloads in .NET." },
        ].map(({ label, accent, desc }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-1", a.border)}>
              <p className={cn("text-xs font-bold", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// CountBy — replaces GroupBy().ToDictionary()"}</div>
        <div className="text-emerald-400">{"var counts = orders.CountBy(o => o.Status);"}</div>
        <div className="text-slate-500">{"// [KeyValuePair(\"Placed\", 42), KeyValuePair(\"Shipped\", 17), ...]"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Index — replaces Select((x, i) => ...)"}</div>
        <div className="text-emerald-400">{"foreach (var (i, order) in orders.Index())"}</div>
        <div className="text-slate-300">{"    Console.WriteLine($\"{i}: {order.Id}\");"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// .NET 10
// ═══════════════════════════════════════════════════════════════════════════

function Net10Tab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        .NET 10 (Nov 2025, LTS — 3 years support) — C# 14, nullable improvements, Blazor full-stack unification, and AI-native BCL additions.
      </p>
      <Net10Language />
      <Net10Highlights />
    </>
  );
}

function Net10Language() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        C# 14 — Key language features
      </h3>
      <div className="space-y-3">
        <FeatureCard
          title="Field keyword in auto-properties"
          accent="violet"
          desc="Access the compiler-generated backing field inside a property accessor using the contextual keyword field. Eliminates the manual backing field pattern for simple validation."
          code={["public string Name", "{", "    get;", "    set => field = value?.Trim() ?? throw new ArgumentNullException();", "}"]}
        />
        <FeatureCard
          title="Implicit span conversions"
          accent="blue"
          desc="string and T[] implicitly convert to ReadOnlySpan<char> and Span<T>/ReadOnlySpan<T>. Eliminates .AsSpan() calls in hot paths."
          code={["void Process(ReadOnlySpan<char> data) { }", "", "Process(\"hello\");        // ✓ implicit — no .AsSpan()", "Process(charArray);     // ✓ implicit — no casting"]}
        />
        <FeatureCard
          title="Null-conditional assignment"
          accent="emerald"
          desc="??= extended — null-conditional operators can now appear on the left side of compound assignments in certain patterns."
          code={["// Assign only if the target is non-null", "order?.Status = \"Shipped\";  // no-op if order is null"]}
        />
        <FeatureCard
          title="Extension members (full extension types)"
          accent="amber"
          desc="Full extension type syntax — not just extension methods. Define extension properties, static methods, and even extension events on types you don't own."
          code={["extension(string s)", "{", "    public bool IsEmail => s.Contains('@');", "    public string Truncate(int n) => s.Length <= n ? s : s[..n] + \"...\";", "}", "", "\"user@example.com\".IsEmail  // true — extension property"]}
        />
      </div>
    </div>
  );
}

function Net10Highlights() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Package className="h-4 w-4" aria-hidden />
        Platform highlights
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Microsoft.Extensions.AI stabilized", accent: "blue", desc: "The abstraction layer for AI models (IChatClient, IEmbeddingGenerator) is stable in .NET 10. Swap providers without changing application code." },
          { label: "Blazor full-stack (Web Forms successor)", accent: "violet", desc: "Blazor now supports per-component render modes (Static, Interactive Server, WebAssembly, Auto) in the same app. The migration path for Web Forms is Blazor." },
          { label: "LINQ: LeftJoin, RightJoin", accent: "emerald", desc: "Native LINQ operators for left and right outer joins — no more GroupJoin + SelectMany gymnastics." },
          { label: "UUID v7 built-in", accent: "amber", desc: "Guid.CreateVersion7() generates time-ordered UUIDs. Sequential on insert — eliminates the index fragmentation that random GUIDs cause in SQL." },
        ].map(({ label, accent, desc }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-1", a.border)}>
              <p className={cn("text-xs font-bold", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// LINQ LeftJoin — finally native"}</div>
        <div className="text-emerald-400">{"var result = orders.LeftJoin("}</div>
        <div className="pl-4 text-slate-300">{"    invoices,"}</div>
        <div className="pl-4 text-slate-300">{"    o => o.Id,"}</div>
        <div className="pl-4 text-slate-300">{"    i => i.OrderId,"}</div>
        <div className="pl-4 text-slate-300">{"    (order, invoice) => new { order.Id, Invoice = invoice });"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// UUID v7 — time-ordered, index-friendly"}</div>
        <div className="text-emerald-400">{"var id = Guid.CreateVersion7(); // sortable by creation time"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Migration Guide
// ═══════════════════════════════════════════════════════════════════════════

function MigrationTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Practical migration checklist — what to check, what to fix, and which breaking changes are most likely to bite you.
      </p>
      <MigrationChecklist />
      <BreakingChanges open={open} setOpen={setOpen} />
    </>
  );
}

function MigrationChecklist() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        Migration checklist — any .NET version bump
      </h3>
      <div className="space-y-2">
        {[
          { step: "Update target framework moniker", code: "<TargetFramework>net10.0</TargetFramework>", accent: "emerald" },
          { step: "Run dotnet-outdated to identify NuGet upgrades", code: "dotnet tool install -g dotnet-outdated-tool && dotnet-outdated", accent: "blue" },
          { step: "Check the Breaking Changes docs for your version range", code: "https://learn.microsoft.com/dotnet/core/compatibility", accent: "violet" },
          { step: "Run full test suite — watch for behavior changes in BCL methods", code: "dotnet test --configuration Release", accent: "amber" },
          { step: "Run dotnet publish + smoke test the binary", code: "dotnet publish -c Release -r linux-x64 --self-contained", accent: "cyan" },
        ].map(({ step, code, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={step} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-3 space-y-1", a.border)}>
              <p className={cn("text-xs font-bold", a.text)}>✓ {step}</p>
              <div className="font-mono text-xs text-emerald-400">{code}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BreakingChanges({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "nullability",
      title: "Nullability annotations tightened per release",
      accent: "amber",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Each release adds more <Code>[NotNull]</Code> / <Code>[MaybeNull]</Code> annotations to BCL APIs. If your project uses nullable reference types (<Code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</Code>), upgrading often produces new compiler warnings. Treat them as errors in CI to prevent regression.</p>
          <Callout tone="amber" icon={AlertTriangle}>
            The most common surprise: <Code>HttpContext.User.Identity</Code> became <Code>IIdentity?</Code> (nullable) in .NET 7. Code that accessed <Code>.Name</Code> without null check now gets a warning.
          </Callout>
        </div>
      ),
    },
    {
      id: "minimal",
      title: "Hosting model changes — minimal API defaults",
      accent: "rose",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The default <Code>WebApplication</Code> template changed in each version. The most impactful: in .NET 8, <Code>AddControllers()</Code> no longer registers <Code>IHttpContextAccessor</Code> automatically. If your code depended on that, add it explicitly.</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-slate-300">{"builder.Services.AddHttpContextAccessor(); // explicit in .NET 8+"}</div>
          </div>
        </div>
      ),
    },
    {
      id: "ef",
      title: "EF Core breaking changes per version",
      accent: "violet",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Notable EF Core breaking changes:</p>
          <ul className="space-y-2">
            {[
              { ver: "EF 7", change: "ExecuteUpdate/ExecuteDelete added — but they bypass interceptors. Review any audit code that depended on SaveChanges." },
              { ver: "EF 8", change: "Complex types (Owned types without keys) — JSON column mapping now supported. Migration generation changed for complex types." },
              { ver: "EF 9", change: "LINQ translation is stricter. Some LINQ expressions that silently client-evaluated now throw. Fix: move untranslatable logic to AsEnumerable() boundary." },
            ].map(({ ver, change }) => (
              <li key={ver} className="flex gap-2 text-xs">
                <span className="font-bold text-violet-700 dark:text-violet-300 shrink-0">{ver}:</span>
                <span className="text-slate-600 dark:text-slate-400">{change}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        Common breaking changes
      </h3>
      {items.map(({ id, title, accent, content }) => {
        const a = accentMap[accent];
        const isOpen = open === id;
        return (
          <div key={id} className="rounded-xl border-2 overflow-hidden border-slate-200 dark:border-slate-700">
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`mg-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500", isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`mg-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}
