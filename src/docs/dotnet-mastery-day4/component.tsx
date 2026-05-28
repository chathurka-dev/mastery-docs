"use client";

import { useState, useRef } from "react";
import {
  Package,
  BarChart3,
  ArrowRight,
  Layers,
  Shield,
  GitBranch,
  Boxes,
  Wrench,
  AlertTriangle,
  Network,
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

type TabId = "clean" | "cqrs" | "ddd" | "resilience" | "outbox";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "clean", label: "Clean Architecture", Icon: Layers },
  { id: "cqrs", label: "CQRS & MediatR", Icon: GitBranch },
  { id: "ddd", label: "DDD Essentials", Icon: Boxes },
  { id: "resilience", label: "Resilience", Icon: Shield },
  { id: "outbox", label: "Outbox Pattern", Icon: Network },
];

export default function DotNetMasteryDay4() {
  const [tab, setTab] = useState<TabId>("clean");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") { const next = (index + 1) % TABS.length; tabRefs.current[next]?.focus(); setTab(TABS[next].id); }
    else if (e.key === "ArrowLeft") { const prev = (index - 1 + TABS.length) % TABS.length; tabRefs.current[prev]?.focus(); setTab(TABS[prev].id); }
  }

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Mastery Guide · Day 4 of 7</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">Architecture Patterns</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">Clean Architecture, CQRS with MediatR, DDD tactical patterns, Polly v8 resilience pipelines, and the Outbox pattern.</p>
      </header>

      <div role="tablist" aria-label="Day 4 topics" className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, Icon }, i) => {
          const active = tab === id;
          return (
            <button key={id} id={`tab-d4-${id}`} role="tab" aria-selected={active} aria-controls={`panel-d4-${id}`}
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

      {tab === "clean" && <section id="panel-d4-clean" role="tabpanel" aria-labelledby="tab-d4-clean" className="space-y-6"><CleanTab /></section>}
      {tab === "cqrs" && <section id="panel-d4-cqrs" role="tabpanel" aria-labelledby="tab-d4-cqrs" className="space-y-6"><CqrsTab /></section>}
      {tab === "ddd" && <section id="panel-d4-ddd" role="tabpanel" aria-labelledby="tab-d4-ddd" className="space-y-6"><DddTab /></section>}
      {tab === "resilience" && <section id="panel-d4-resilience" role="tabpanel" aria-labelledby="tab-d4-resilience" className="space-y-6"><ResilienceTab /></section>}
      {tab === "outbox" && <section id="panel-d4-outbox" role="tabpanel" aria-labelledby="tab-d4-outbox" className="space-y-6"><OutboxTab /></section>}
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1 — Clean Architecture
// ═══════════════════════════════════════════════════════════════════════════

function CleanTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Clean Architecture is not a folder structure — it is a <strong className="text-slate-800 dark:text-slate-200">dependency rule</strong>: source code dependencies only point inward. The domain knows nothing about infrastructure.
      </p>
      <CleanLayers />
      <CleanDependencyRule />
      <CleanAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function CleanLayers() {
  const layers = [
    { n: "1 (innermost)", label: "Domain", accent: "violet", items: ["Entities, Value Objects, Domain Events", "Business rules as methods on entities", "Repository interfaces (not implementations)", "No NuGet dependencies — pure C#"] },
    { n: "2", label: "Application", accent: "blue", items: ["Use cases — one class per command/query", "Orchestrates domain objects", "Interfaces for external services (IEmailSender, IFileStorage)", "No UI, no DB, no framework knowledge"] },
    { n: "3", label: "Infrastructure", accent: "amber", items: ["EF Core DbContext + Migrations", "Email/SMS/storage implementations", "External API clients", "Depends on Application — never on Presentation"] },
    { n: "4 (outermost)", label: "Presentation", accent: "emerald", items: ["ASP.NET Core controllers / minimal APIs", "Razor Pages, Blazor, gRPC", "Depends on Application only", "Wires DI container in Program.cs"] },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Layers className="h-4 w-4" aria-hidden />
        The four layers &amp; their responsibilities
      </h3>
      <div className="space-y-3">
        {layers.map(({ n, label, accent, items }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <div className="flex items-center gap-2">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border", a.chipBg, a.text, a.border)}>Layer {n}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</span>
              </div>
              <ul className="space-y-0.5">
                {items.map(item => (
                  <li key={item} className="text-xs text-slate-600 dark:text-slate-400 flex gap-1.5 items-start">
                    <span className={cn("mt-0.5 text-xs", a.text)}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CleanDependencyRule() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <ArrowRight className="h-4 w-4" aria-hidden />
        Enforcing the dependency rule with project references
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"# Solution structure (csproj references enforce the rule)"}</div>
        <div className="text-emerald-400">{"MyApp.Domain          # no project references"}</div>
        <div className="text-slate-300">{"MyApp.Application     # → Domain"}</div>
        <div className="text-slate-300">{"MyApp.Infrastructure  # → Application, Domain"}</div>
        <div className="text-slate-300">{"MyApp.Api             # → Application (NOT Infrastructure)"}</div>
        <div className="text-slate-500">{"#                       Infrastructure is wired in DI at startup"}</div>
      </div>
      <Callout tone="blue" icon={BarChart3} title="The key insight">
        Infrastructure implements Application interfaces — <Code>IOrderRepository</Code> is defined in Application, <Code>EfOrderRepository</Code> lives in Infrastructure. The Api project references Application only; Infrastructure is registered in DI and injected at runtime.
      </Callout>
    </div>
  );
}

function CleanAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "shared",
      title: "Shared Kernel vs separate bounded contexts",
      accent: "amber",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">A Shared Kernel is code shared between bounded contexts — Value Objects like Money, Address, or UserId. Keep it tiny. Each bounded context is its own Clean Architecture slice with its own DB schema if needed.</p>
          <Callout tone="amber" icon={AlertTriangle}>
            Sharing domain entities across contexts creates tight coupling. Prefer integration events or an anti-corruption layer to translate between context models.
          </Callout>
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
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`cl-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500", isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`cl-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2 — CQRS & MediatR
// ═══════════════════════════════════════════════════════════════════════════

function CqrsTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        CQRS separates writes (Commands that change state) from reads (Queries that return data). MediatR is the in-process bus that routes messages to handlers — keeping controllers thin and use-cases cohesive.
      </p>
      <CqrsSplit />
      <MediatRSetup />
      <MediatRPipeline />
    </>
  );
}

function CqrsSplit() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <GitBranch className="h-4 w-4" aria-hidden />
        Command vs Query — the fundamental split
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            label: "Commands", accent: "violet", points: [
              "Change state — create, update, delete",
              "Return void or a minimal result (new ID)",
              "Go through full domain model: validate → apply → persist → publish events",
              "Use tracked EF queries so SaveChanges captures changes",
            ]
          },
          {
            label: "Queries", accent: "blue", points: [
              "Read-only — never modify state",
              "Return DTOs or projections, never entities",
              "Use AsNoTracking() for speed",
              "Can bypass domain model entirely — raw SQL or Dapper for complex reporting",
            ]
          },
        ].map(({ label, accent, points }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-3", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>{label}</p>
              <ul className="space-y-1.5">
                {points.map(p => <li key={p} className="text-xs text-slate-600 dark:text-slate-400 flex gap-1.5 items-start"><span className={cn("mt-0.5", a.text)}>✓</span>{p}</li>)}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MediatRSetup() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Package className="h-4 w-4" aria-hidden />
        MediatR — command + handler + controller
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// 1. Define the command (Application layer)"}</div>
        <div className="text-emerald-400">{"public record PlaceOrderCommand(int CustomerId, List<OrderItem> Items)"}</div>
        <div className="pl-4 text-emerald-400">{"    : IRequest<int>;"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// 2. Handle it"}</div>
        <div className="text-emerald-400">{"public class PlaceOrderHandler(AppDbContext db)"}</div>
        <div className="pl-4 text-emerald-400">{"    : IRequestHandler<PlaceOrderCommand, int>"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"    public async Task<int> Handle(PlaceOrderCommand cmd, CancellationToken ct)"}</div>
        <div className="pl-4 text-slate-300">{"    {"}</div>
        <div className="pl-8 text-slate-300">{"        var order = Order.Place(cmd.CustomerId, cmd.Items);"}</div>
        <div className="pl-8 text-slate-300">{"        db.Orders.Add(order);"}</div>
        <div className="pl-8 text-emerald-400">{"        await db.SaveChangesAsync(ct);"}</div>
        <div className="pl-8 text-slate-300">{"        return order.Id;"}</div>
        <div className="pl-4 text-slate-300">{"    }"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// 3. Slim controller — just dispatch"}</div>
        <div className="text-emerald-400">{"app.MapPost(\"/orders\", async (PlaceOrderCommand cmd, IMediator m)"}</div>
        <div className="pl-4 text-slate-300">{"    => Results.Ok(await m.Send(cmd)));"}</div>
      </div>
    </div>
  );
}

function MediatRPipeline() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Layers className="h-4 w-4" aria-hidden />
        Pipeline behaviors — cross-cutting without boilerplate
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <Code>IPipelineBehavior&lt;TRequest, TResponse&gt;</Code> wraps every command/query that flows through MediatR. Stack them for logging, validation, caching, and transaction management — all in one place, applied to every handler automatically.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Validation behavior — runs FluentValidation before every command"}</div>
        <div className="text-emerald-400">{"public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators)"}</div>
        <div className="pl-4 text-emerald-400">{"    : IPipelineBehavior<TRequest, TResponse>"}</div>
        <div className="pl-4 text-emerald-400">{"    where TRequest : IRequest<TResponse>"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"    public async Task<TResponse> Handle(TRequest req, RequestHandlerDelegate<TResponse> next, CancellationToken ct)"}</div>
        <div className="pl-4 text-slate-300">{"    {"}</div>
        <div className="pl-8 text-slate-300">{"        var results = await Task.WhenAll(validators.Select(v => v.ValidateAsync(req, ct)));"}</div>
        <div className="pl-8 text-slate-300">{"        var failures = results.SelectMany(r => r.Errors).Where(e => e != null).ToList();"}</div>
        <div className="pl-8 text-emerald-400">{"        if (failures.Count > 0) throw new ValidationException(failures);"}</div>
        <div className="pl-8 text-emerald-400">{"        return await next();"}</div>
        <div className="pl-4 text-slate-300">{"    }"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Register (order matters — first registered = outermost wrapper)"}</div>
        <div className="text-slate-300">{"services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));"}</div>
        <div className="text-slate-300">{"services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));"}</div>
        <div className="text-slate-300">{"services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3 — DDD Essentials
// ═══════════════════════════════════════════════════════════════════════════

function DddTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        DDD tactical patterns give your domain model structure — Entities own identity, Value Objects own equality, Aggregates own consistency boundaries, Domain Events communicate what happened.
      </p>
      <DddPatterns />
      <DddAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function DddPatterns() {
  const patterns = [
    {
      label: "Entity", accent: "violet",
      desc: "Has an identity (Id) that persists across state changes. Two entities with the same Id are the same entity even if all other properties differ.",
      code: ["public class Order : Entity<int>", "{", "    public OrderStatus Status { get; private set; }", "    public void Ship() => Status = OrderStatus.Shipped;", "}"],
    },
    {
      label: "Value Object", accent: "blue",
      desc: "Defined by its values, not its identity. Immutable. Equality is structural — two Money(10, USD) are identical. Use record for free structural equality.",
      code: ["public record Money(decimal Amount, string Currency)", "{", "    public Money Add(Money other) =>", "        Currency == other.Currency", "            ? this with { Amount = Amount + other.Amount }", "            : throw new InvalidOperationException();", "}"],
    },
    {
      label: "Aggregate Root", accent: "emerald",
      desc: "A cluster of entities and value objects with a single root entity. External code may only reference the root — not the children directly. The root enforces all invariants.",
      code: ["public class Order : AggregateRoot<int>  // root", "{", "    private readonly List<OrderLine> _lines = [];", "    public IReadOnlyList<OrderLine> Lines => _lines;", "    public void AddLine(Product p, int qty)", "    {", "        Guard.Against.Negative(qty);", "        _lines.Add(new OrderLine(p.Id, qty, p.Price));", "    }", "}"],
    },
    {
      label: "Domain Event", accent: "amber",
      desc: "Something that happened in the domain — past tense, immutable. Published by the aggregate after a state change. Handlers in Application layer react (send email, update read model).",
      code: ["public record OrderPlaced(int OrderId, DateTime PlacedAt)", "    : IDomainEvent;", "", "// Raise inside the aggregate", "public void Place()", "{", "    Status = OrderStatus.Placed;", "    AddDomainEvent(new OrderPlaced(Id, DateTime.UtcNow));", "}"],
    },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Boxes className="h-4 w-4" aria-hidden />
        The four tactical building blocks
      </h3>
      <div className="space-y-3">
        {patterns.map(({ label, accent, desc, code }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold border", a.chipBg, a.text, a.border)}>{label}</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
                {code.map((line, i) => (
                  <div key={i} className={line.startsWith("//") ? "text-slate-500" : line.trim() === "" ? "text-slate-400" : "text-slate-300"}>{line || " "}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DddAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "events",
      title: "Dispatching domain events after SaveChanges",
      accent: "emerald",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Domain events should be dispatched <em>after</em> the DB transaction commits — not during. Otherwise a failed event handler could leave the DB rolled back but the event handler partially executed.</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"public class AppDbContext(IPublisher publisher) : DbContext"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-emerald-400">{"    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)"}</div>
            <div className="pl-4 text-slate-300">{"    {"}</div>
            <div className="pl-8 text-slate-300">{"        var events = ChangeTracker.Entries<AggregateRoot>()"}</div>
            <div className="pl-8 text-slate-300">{"            .SelectMany(e => e.Entity.PopDomainEvents()).ToList();"}</div>
            <div className="pl-8 text-slate-300">{"        var result = await base.SaveChangesAsync(ct);"}</div>
            <div className="pl-8 text-slate-500">{"        // Dispatch AFTER commit"}</div>
            <div className="pl-8 text-emerald-400">{"        foreach (var e in events) await publisher.Publish(e, ct);"}</div>
            <div className="pl-8 text-slate-300">{"        return result;"}</div>
            <div className="pl-4 text-slate-300">{"    }"}</div>
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
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`ddd-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500", isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`ddd-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4 — Resilience (Polly v8)
// ═══════════════════════════════════════════════════════════════════════════

function ResilienceTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Polly v8 introduced a new fluent pipeline API. Strategies compose: retry wraps circuit breaker wraps timeout — applied in registration order, outermost first.
      </p>
      <PollyStrategies />
      <PollyPipeline />
    </>
  );
}

function PollyStrategies() {
  const strategies = [
    { name: "Retry", accent: "blue", when: "Transient faults — network blips, 429, 503.", code: ["new RetryStrategyOptions", "{", "    MaxRetryAttempts = 3,", "    Delay = TimeSpan.FromMilliseconds(200),", "    BackoffType = DelayBackoffType.Exponential,", "    UseJitter = true,", "}"] },
    { name: "Circuit Breaker", accent: "amber", when: "Sustained failures — stop hammering a dead service.", code: ["new CircuitBreakerStrategyOptions", "{", "    FailureRatio = 0.5,", "    MinimumThroughput = 10,", "    SamplingDuration = TimeSpan.FromSeconds(30),", "    BreakDuration = TimeSpan.FromSeconds(15),", "}"] },
    { name: "Timeout", accent: "rose", when: "Downstream taking too long — fail fast.", code: ["new TimeoutStrategyOptions", "{", "    Timeout = TimeSpan.FromSeconds(5),", "}"] },
    { name: "Hedging", accent: "violet", when: "Latency-sensitive reads — fire parallel request if first is slow.", code: ["new HedgingStrategyOptions<HttpResponseMessage>", "{", "    MaxHedgedAttempts = 2,", "    Delay = TimeSpan.FromMilliseconds(300),", "}"] },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Shield className="h-4 w-4" aria-hidden />
        Polly v8 strategies
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {strategies.map(({ name, accent, when, code }) => {
          const a = accentMap[accent];
          return (
            <div key={name} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <div className="flex items-center gap-2">
                <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold border", a.chipBg, a.text, a.border)}>{name}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{when}</p>
              <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
                {code.map((line, i) => <div key={i} className={line.startsWith("//") ? "text-slate-500" : "text-slate-300"}>{line}</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PollyPipeline() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Composing strategies with AddResilienceHandler
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Register on IHttpClientBuilder"}</div>
        <div className="text-slate-300">{"builder.Services.AddHttpClient<PaymentClient>()"}</div>
        <div className="pl-4 text-emerald-400">{"    .AddResilienceHandler(\"payment\", pipeline =>"}</div>
        <div className="pl-4 text-slate-300">{"    {"}</div>
        <div className="pl-8 text-slate-500">{"        // Outermost: timeout the whole attempt"}</div>
        <div className="pl-8 text-slate-300">{"        pipeline.AddTimeout(TimeSpan.FromSeconds(10));"}</div>
        <div className="pl-8 text-slate-500">{"        // Middle: open circuit after sustained failures"}</div>
        <div className="pl-8 text-slate-300">{"        pipeline.AddCircuitBreaker(new()"}</div>
        <div className="pl-8 text-slate-300">{"        {"}</div>
        <div className="pl-12 text-slate-300">{"            FailureRatio = 0.5, MinimumThroughput = 10,"}</div>
        <div className="pl-12 text-slate-300">{"            BreakDuration = TimeSpan.FromSeconds(30)"}</div>
        <div className="pl-8 text-slate-300">{"        });"}</div>
        <div className="pl-8 text-slate-500">{"        // Innermost: retry individual transient faults"}</div>
        <div className="pl-8 text-slate-300">{"        pipeline.AddRetry(new()"}</div>
        <div className="pl-8 text-slate-300">{"        {"}</div>
        <div className="pl-12 text-slate-300">{"            MaxRetryAttempts = 3,"}</div>
        <div className="pl-12 text-slate-300">{"            BackoffType = DelayBackoffType.Exponential,"}</div>
        <div className="pl-12 text-slate-300">{"            UseJitter = true"}</div>
        <div className="pl-8 text-slate-300">{"        });"}</div>
        <div className="pl-4 text-slate-300">{"    });"}</div>
      </div>
      <Callout tone="amber" icon={AlertTriangle} title="Strategy ordering">
        Strategies are applied from top to bottom in execution order. Timeout should be outermost so it caps the entire operation including retries. Retry should be innermost so each retry attempt benefits from the circuit breaker check.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5 — Outbox Pattern
// ═══════════════════════════════════════════════════════════════════════════

function OutboxTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The Outbox pattern solves the dual-write problem: saving to the DB and publishing a message are two separate I/O operations — either can fail. The Outbox makes them atomic by storing the message in the same DB transaction.
      </p>
      <OutboxArchitecture />
      <OutboxImplementation />
    </>
  );
}

function OutboxArchitecture() {
  const steps = [
    { n: "1", label: "Write + store message", desc: "The command handler saves domain changes AND an OutboxMessage row in the same EF SaveChanges transaction. If either fails, both roll back.", accent: "violet" },
    { n: "2", label: "Polling worker reads outbox", desc: "A BackgroundService queries for unprocessed OutboxMessage rows on a short interval (e.g. every 5 s).", accent: "blue" },
    { n: "3", label: "Publish to message broker", desc: "The worker publishes each message to RabbitMQ / Azure Service Bus / MassTransit. On success, marks the row ProcessedAt.", accent: "emerald" },
    { n: "4", label: "At-least-once delivery", desc: "If the worker crashes after publish but before marking processed, it will republish on restart. Consumers must be idempotent.", accent: "amber" },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Network className="h-4 w-4" aria-hidden />
        Outbox flow — 4 steps
      </h3>
      <div className="space-y-3">
        {steps.map(({ n, label, desc, accent }) => {
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
    </div>
  );
}

function OutboxImplementation() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Minimal implementation with EF Core
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// OutboxMessage entity"}</div>
        <div className="text-emerald-400">{"public class OutboxMessage"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"public Guid Id { get; init; } = Guid.NewGuid();"}</div>
        <div className="pl-4 text-slate-300">{"public string Type { get; init; } = \"\";"}</div>
        <div className="pl-4 text-slate-300">{"public string Payload { get; init; } = \"\";"}</div>
        <div className="pl-4 text-slate-300">{"public DateTime CreatedAt { get; init; } = DateTime.UtcNow;"}</div>
        <div className="pl-4 text-slate-300">{"public DateTime? ProcessedAt { get; set; }"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Store during SaveChanges (via interceptor or override)"}</div>
        <div className="text-slate-300">{"var payload = JsonSerializer.Serialize(domainEvent);"}</div>
        <div className="text-slate-300">{"db.OutboxMessages.Add(new OutboxMessage"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"Type = domainEvent.GetType().AssemblyQualifiedName!,"}</div>
        <div className="pl-4 text-slate-300">{"Payload = payload,"}</div>
        <div className="text-slate-300">{"});"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Worker — polls every 5 s"}</div>
        <div className="text-emerald-400">{"protected override async Task ExecuteAsync(CancellationToken ct)"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"    while (!ct.IsCancellationRequested)"}</div>
        <div className="pl-4 text-slate-300">{"    {"}</div>
        <div className="pl-8 text-slate-300">{"        await ProcessPendingMessagesAsync(ct);"}</div>
        <div className="pl-8 text-emerald-400">{"        await Task.Delay(TimeSpan.FromSeconds(5), ct);"}</div>
        <div className="pl-4 text-slate-300">{"    }"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
      <Callout tone="blue" icon={BarChart3} title="Production libraries">
        Consider <strong className="text-slate-800 dark:text-slate-200">Wolverine</strong> or <strong className="text-slate-800 dark:text-slate-200">MassTransit Outbox</strong> for production use — they handle idempotency keys, dead-letter queues, and distributed locks out of the box.
      </Callout>
    </div>
  );
}
