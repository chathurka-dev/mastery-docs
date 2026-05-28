"use client";

import { useState, useRef } from "react";
import {
  Lightbulb,
  Package,
  Layers,
  ArrowRight,
  Zap,
  Shield,
  Settings,
  GitMerge,
  Boxes,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Network,
  Lock,
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

// ─── Shared helpers ───────────────────────────────────────────────────────

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
      {children}
    </code>
  );
}

function Callout({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: "amber" | "emerald" | "blue";
  icon: React.ElementType;
  title?: string;
  children: React.ReactNode;
}) {
  const a = accentMap[tone];
  return (
    <div className={cn("rounded-lg border p-4 flex gap-3", a.border, a.bg)}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", a.text)} aria-hidden />
      <div>
        {title && (
          <p className={cn("text-sm font-bold mb-1", a.text)}>{title}</p>
        )}
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────

type TabId = "host" | "di" | "middleware" | "minimalapi" | "auth";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "host", label: "Host & Startup", Icon: Layers },
  { id: "di", label: "DI Deep Dive", Icon: Boxes },
  { id: "middleware", label: "Middleware", Icon: GitMerge },
  { id: "minimalapi", label: "Minimal APIs", Icon: Zap },
  { id: "auth", label: "Auth & Options", Icon: Shield },
];

// ─── Root component ───────────────────────────────────────────────────────

export default function DotNetMasteryDay2() {
  const [tab, setTab] = useState<TabId>("host");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") {
      const next = (index + 1) % TABS.length;
      tabRefs.current[next]?.focus();
      setTab(TABS[next].id);
    } else if (e.key === "ArrowLeft") {
      const prev = (index - 1 + TABS.length) % TABS.length;
      tabRefs.current[prev]?.focus();
      setTab(TABS[prev].id);
    }
  }

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
          Mastery Guide · Day 2 of 7
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">
          ASP.NET Core Deep Dive
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Generic Host internals, DI lifetimes, middleware pipeline, minimal APIs vs controllers, options pattern, and authentication architecture.
        </p>
      </header>

      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Day 2 topics"
        className="flex flex-wrap gap-2 mb-6"
      >
        {TABS.map(({ id, label, Icon }, i) => {
          const active = tab === id;
          return (
            <button
              key={id}
              id={`tab-d2-${id}`}
              role="tab"
              aria-selected={active}
              aria-controls={`panel-d2-${id}`}
              tabIndex={active ? 0 : -1}
              ref={(el) => { tabRefs.current[i] = el; }}
              onClick={() => setTab(id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                active
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {tab === "host" && (
        <section id="panel-d2-host" role="tabpanel" aria-labelledby="tab-d2-host" className="space-y-6">
          <HostTab />
        </section>
      )}
      {tab === "di" && (
        <section id="panel-d2-di" role="tabpanel" aria-labelledby="tab-d2-di" className="space-y-6">
          <DiTab />
        </section>
      )}
      {tab === "middleware" && (
        <section id="panel-d2-middleware" role="tabpanel" aria-labelledby="tab-d2-middleware" className="space-y-6">
          <MiddlewareTab />
        </section>
      )}
      {tab === "minimalapi" && (
        <section id="panel-d2-minimalapi" role="tabpanel" aria-labelledby="tab-d2-minimalapi" className="space-y-6">
          <MinimalApiTab />
        </section>
      )}
      {tab === "auth" && (
        <section id="panel-d2-auth" role="tabpanel" aria-labelledby="tab-d2-auth" className="space-y-6">
          <AuthTab />
        </section>
      )}
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1 — Host & Startup
// ═══════════════════════════════════════════════════════════════════════════

function HostTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The Generic Host is the backbone of every ASP.NET Core app — understanding its startup sequence explains <em>why</em> configuration, DI, and logging work the way they do.
      </p>

      <HostBootSequence />
      <WebApplicationBuilder />
      <EnvironmentSection />
      <HostedServicesSection />
    </>
  );
}

function HostBootSequence() {
  const steps = [
    {
      n: "1",
      label: "Create builder",
      code: "WebApplication.CreateBuilder(args)",
      detail: "Wires up default config sources, logging, DI container, and Kestrel. Returns a WebApplicationBuilder.",
      accent: "violet",
    },
    {
      n: "2",
      label: "Register services",
      code: "builder.Services.Add*()",
      detail: "All DI registrations happen here before the container is built. You cannot register services after Build() is called.",
      accent: "blue",
    },
    {
      n: "3",
      label: "Build the host",
      code: "var app = builder.Build()",
      detail: "The DI container is compiled (IServiceProvider sealed). Configuration is frozen. IHostedServices are resolved but not yet started.",
      accent: "emerald",
    },
    {
      n: "4",
      label: "Configure pipeline",
      code: "app.Use*()",
      detail: "Middleware is registered as a linked list. Order matters — each Use call prepends to the request pipeline.",
      accent: "amber",
    },
    {
      n: "5",
      label: "Run the host",
      code: "await app.RunAsync()",
      detail: "Starts IHostedServices, opens Kestrel ports, begins accepting requests. Blocks until shutdown signal (Ctrl+C / SIGTERM).",
      accent: "cyan",
    },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Layers className="h-4 w-4" aria-hidden />
        Host boot sequence — 5 phases
      </h3>
      <div className="space-y-3">
        {steps.map(({ n, label, code, detail, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={n} className="flex gap-3 items-start">
              <span className={cn("inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5", a.chipBg, a.text)}>
                {n}
              </span>
              <div className="flex-1 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-3 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</span>
                  <Code>{code}</Code>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WebApplicationBuilder() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Settings className="h-4 w-4" aria-hidden />
        What <Code>CreateBuilder</Code> wires up for free
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Configuration", detail: "appsettings.json → appsettings.{Env}.json → environment variables → command-line args. Each layer overrides the previous.", accent: "blue" },
          { label: "Logging", detail: "Console + Debug providers by default. ILogger<T> is registered automatically. Configure via appsettings or AddLogging().", accent: "emerald" },
          { label: "Kestrel / IIS", detail: "HTTP server auto-selected based on environment. Kestrel is the default cross-platform server; IIS Integration added via ANCM.", accent: "violet" },
          { label: "DI Container", detail: "Microsoft.Extensions.DependencyInjection is the default. Can be swapped for Autofac/Lamar via UseServiceProviderFactory.", accent: "amber" },
        ].map(({ label, detail, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 p-4 bg-white dark:bg-slate-900", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide mb-1", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{detail}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Minimal working app — ~5 lines"}</div>
        <div className="text-emerald-400">{"var builder = WebApplication.CreateBuilder(args);"}</div>
        <div className="text-slate-300">{"builder.Services.AddControllers();"}</div>
        <div className="text-slate-300">{"var app = builder.Build();"}</div>
        <div className="text-slate-300">{"app.MapControllers();"}</div>
        <div className="text-emerald-400">{"await app.RunAsync();"}</div>
      </div>
    </div>
  );
}

function EnvironmentSection() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Network className="h-4 w-4" aria-hidden />
        Environments — Development / Staging / Production
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        The <Code>ASPNETCORE_ENVIRONMENT</Code> (or <Code>DOTNET_ENVIRONMENT</Code>) env var controls which config file overlay is loaded and what <Code>app.Environment.IsDevelopment()</Code> returns.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Different behaviour per environment"}</div>
        <div className="text-emerald-400">{"if (app.Environment.IsDevelopment())"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"app.UseDeveloperExceptionPage();"}</div>
        <div className="pl-4 text-slate-300">{"app.UseSwagger();"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-emerald-400">{"else"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"app.UseExceptionHandler(\"/error\");"}</div>
        <div className="pl-4 text-slate-300">{"app.UseHsts();"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
      <Callout tone="amber" icon={Lightbulb} title="Secret tip">
        User Secrets (<Code>dotnet user-secrets</Code>) are loaded automatically in Development and override appsettings — keeping credentials out of source control without any extra code.
      </Callout>
    </div>
  );
}

function HostedServicesSection() {
  return (
    <div className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300">
        <Zap className="h-4 w-4" aria-hidden />
        IHostedService &amp; BackgroundService
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Long-running background work (queue processors, health-check pings, scheduled jobs) lives in a <Code>BackgroundService</Code>. The host starts all registered services before opening HTTP ports and stops them gracefully on shutdown.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-emerald-400">{"public class QueueWorker : BackgroundService"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"protected override async Task ExecuteAsync(CancellationToken stoppingToken)"}</div>
        <div className="pl-4 text-slate-300">{"{"}</div>
        <div className="pl-8 text-slate-300">{"await foreach (var msg in _queue.ReadAllAsync(stoppingToken))"}</div>
        <div className="pl-8 text-slate-300">{"{"}</div>
        <div className="pl-12 text-slate-300">{"await ProcessAsync(msg, stoppingToken);"}</div>
        <div className="pl-8 text-slate-300">{"}"}</div>
        <div className="pl-4 text-slate-300">{"}"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Register in DI"}</div>
        <div className="text-slate-300">{"builder.Services.AddHostedService<QueueWorker>();"}</div>
      </div>
      <Callout tone="emerald" icon={CheckCircle2} title="Graceful shutdown">
        The host sends <Code>CancellationToken</Code> cancellation on SIGTERM and waits up to <Code>HostOptions.ShutdownTimeout</Code> (default 5 s) before forcing exit. Always propagate the token.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2 — DI Deep Dive
// ═══════════════════════════════════════════════════════════════════════════

function DiTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The built-in DI container is intentionally minimal. Knowing its three lifetimes — and their failure modes — prevents entire categories of production bugs.
      </p>
      <DiLifetimesSection />
      <CaptiveDependencySection />
      <DiPatterns />
      <DiKeyed />
    </>
  );
}

function DiLifetimesSection() {
  const lifetimes = [
    {
      name: "Transient",
      badge: "New every time",
      accent: "blue",
      when: "Stateless services — formatters, validators, simple utilities.",
      risk: "If the service holds resources (DbContext, HttpClient), you'll get excessive allocations and possible connection exhaustion.",
      code: "services.AddTransient<IEmailSender, SmtpEmailSender>();",
    },
    {
      name: "Scoped",
      badge: "Once per request",
      accent: "emerald",
      when: "The default lifetime for DbContext, unit-of-work, per-request caches.",
      risk: "Injecting into a Singleton creates a captive dependency — the scoped service outlives the request it was designed for.",
      code: "services.AddScoped<AppDbContext>();",
    },
    {
      name: "Singleton",
      badge: "Once per app",
      accent: "violet",
      when: "Truly shared state — HttpClient factories, in-memory caches, configuration snapshots.",
      risk: "Must be thread-safe. Any mutable shared state becomes a potential race condition.",
      code: "services.AddSingleton<IMemoryCache, MemoryCache>();",
    },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Boxes className="h-4 w-4" aria-hidden />
        The three lifetimes
      </h3>
      <div className="space-y-3">
        {lifetimes.map(({ name, badge, accent, when, risk, code }) => {
          const a = accentMap[accent];
          return (
            <div key={name} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{name}</span>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border", a.chipBg, a.text, a.border)}>{badge}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400"><strong className="text-slate-800 dark:text-slate-200">Use when:</strong> {when}</p>
              <p className="text-xs text-amber-700 dark:text-amber-400"><strong>⚠ Risk:</strong> {risk}</p>
              <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs text-emerald-400 overflow-x-auto">
                {code}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CaptiveDependencySection() {
  return (
    <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        Captive dependency — the #1 DI bug
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        A <strong className="text-slate-800 dark:text-slate-200">captive dependency</strong> occurs when a longer-lived service holds a reference to a shorter-lived one. The shorter-lived service effectively becomes as long-lived as its consumer — silently breaking its contract.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// ❌ Captive dependency — DbContext captured in Singleton"}</div>
        <div className="text-emerald-400">{"public class BadCache(AppDbContext db) : ICache { }"}</div>
        <div className="text-slate-300">{"services.AddSingleton<ICache, BadCache>();  // db is Scoped!"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// ✓ Fix: inject IServiceScopeFactory and create a scope manually"}</div>
        <div className="text-emerald-400">{"public class GoodCache(IServiceScopeFactory factory) : ICache"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"public async Task RefreshAsync()"}</div>
        <div className="pl-4 text-slate-300">{"{"}</div>
        <div className="pl-8 text-emerald-400">{"await using var scope = factory.CreateAsyncScope();"}</div>
        <div className="pl-8 text-slate-300">{"var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();"}</div>
        <div className="pl-8 text-slate-300">{"// ... use db ..."}</div>
        <div className="pl-4 text-slate-300">{"}"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
      <Callout tone="amber" icon={Lightbulb} title="Detection">
        Set <Code>ValidateScopes = true</Code> in development (it is on by default in <Code>WebApplication</Code>). The container will throw on startup if it detects captive dependencies.
      </Callout>
    </div>
  );
}

function DiPatterns() {
  const patterns = [
    {
      title: "Factory registration",
      accent: "blue",
      desc: "Use a factory lambda when the service needs runtime data at construction time.",
      code: [
        'services.AddScoped<IRepo>(sp =>',
        '    new Repo(sp.GetRequiredService<Db>(),',
        '             Environment.GetEnvironmentVariable("SHARD")));',
      ],
    },
    {
      title: "Open generic registration",
      accent: "emerald",
      desc: "Register a generic type once — the container resolves the closed version on demand.",
      code: [
        "services.AddScoped(typeof(IRepository<>), typeof(Repository<>));",
        "// Resolves: IRepository<Order>, IRepository<Customer>, ...",
      ],
    },
    {
      title: "Multiple implementations",
      accent: "violet",
      desc: "Register the same interface twice to get IEnumerable<T> injected with all implementations.",
      code: [
        "services.AddScoped<INotifier, EmailNotifier>();",
        "services.AddScoped<INotifier, SmsNotifier>();",
        "// Inject IEnumerable<INotifier> to get both",
      ],
    },
  ];

  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Package className="h-4 w-4" aria-hidden />
        Advanced registration patterns
      </h3>
      <div className="space-y-3">
        {patterns.map(({ title, accent, desc, code }) => {
          const a = accentMap[accent];
          return (
            <div key={title} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>{title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
              <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
                {code.map((line, i) => (
                  <div key={i} className={line.startsWith("//") ? "text-slate-500" : "text-slate-300"}>{line}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiKeyed() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Keyed services (.NET 8+)
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Keyed services let you register the same interface multiple times under different string keys, then resolve a specific implementation by key — without needing a factory or service locator pattern.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Registration"}</div>
        <div className="text-slate-300">{"services.AddKeyedScoped<IStorageProvider, S3Provider>(\"s3\");"}</div>
        <div className="text-slate-300">{"services.AddKeyedScoped<IStorageProvider, BlobProvider>(\"blob\");"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Constructor injection"}</div>
        <div className="text-emerald-400">{"public class UploadService("}</div>
        <div className="pl-4 text-emerald-400">{"[FromKeyedServices(\"s3\")] IStorageProvider s3,"}</div>
        <div className="pl-4 text-emerald-400">{"[FromKeyedServices(\"blob\")] IStorageProvider blob)"}</div>
        <div className="text-slate-300">{"{ }"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3 — Middleware Pipeline
// ═══════════════════════════════════════════════════════════════════════════

function MiddlewareTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Middleware is a linked list of delegates. Every <Code>Use</Code>, <Code>Map</Code>, or <Code>Run</Code> call appends to that list. Order is not a preference — it is correctness.
      </p>
      <MiddlewarePipeline />
      <MiddlewareOrder />
      <MiddlewareAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function MiddlewarePipeline() {
  const steps = [
    { label: "HTTPS Redirection", accent: "cyan", note: "Redirect HTTP → HTTPS" },
    { label: "Static Files", accent: "blue", note: "Short-circuit for .css/.js" },
    { label: "Routing", accent: "violet", note: "Match URL to endpoint" },
    { label: "Authentication", accent: "amber", note: "Populate HttpContext.User" },
    { label: "Authorization", accent: "rose", note: "Enforce policies" },
    { label: "Endpoint", accent: "emerald", note: "Controller / minimal handler" },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <GitMerge className="h-4 w-4" aria-hidden />
        Request pipeline — canonical production order
      </h3>
      <div className="space-y-1">
        {steps.map(({ label, accent, note }, i) => {
          const a = accentMap[accent];
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={cn("flex-1 flex items-center justify-between rounded-lg border p-3 bg-white dark:bg-slate-900", a.border)}>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-bold w-5 text-center", a.text)}>{i + 1}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 italic">{note}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0 rotate-90" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
      <Callout tone="amber" icon={AlertTriangle} title="Order matters">
        Authorization before Routing = 404 on protected routes. Routing before Authentication = User is always anonymous in the routing layer. Get the order wrong and nothing throws — it just silently misbehaves.
      </Callout>
    </div>
  );
}

function MiddlewareOrder() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Use vs Map vs Run
      </h3>
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { name: "Use", desc: "Passes control to next middleware via await next(context). The most common — adds cross-cutting behavior before and after downstream.", accent: "blue" },
          { name: "Map", desc: "Branches the pipeline based on path prefix. The branch has its own middleware chain and does not rejoin the main pipeline.", accent: "violet" },
          { name: "Run", desc: "Terminal — never calls next. Use for the final handler. Anything registered after Run is unreachable dead code.", accent: "rose" },
        ].map(({ name, desc, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={name} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <p className={cn("text-sm font-bold", a.text)}><Code>app.{name}()</Code></p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Custom middleware — wraps the entire pipeline"}</div>
        <div className="text-emerald-400">{"app.Use(async (context, next) =>"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"var sw = Stopwatch.StartNew();"}</div>
        <div className="pl-4 text-emerald-400">{"await next(context);              // call downstream"}</div>
        <div className="pl-4 text-slate-300">{"context.Response.Headers[\"X-Duration\"] = sw.ElapsedMilliseconds + \"ms\";"}</div>
        <div className="text-slate-300">{"});"}</div>
      </div>
    </div>
  );
}

function MiddlewareAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "class",
      title: "Middleware as a class (IMiddleware)",
      accent: "emerald",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The convention-based middleware pattern requires a constructor taking <Code>RequestDelegate next</Code> and an <Code>InvokeAsync(HttpContext)</Code> method. The <Code>IMiddleware</Code> interface is cleaner — it supports DI via constructor injection and is testable.
          </p>
          <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-emerald-400">{"public class RequestLoggingMiddleware(ILogger<RequestLoggingMiddleware> log)"}</div>
            <div className="pl-4 text-emerald-400">{"    : IMiddleware"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-emerald-400">{"public async Task InvokeAsync(HttpContext ctx, RequestDelegate next)"}</div>
            <div className="pl-4 text-slate-300">{"{"}</div>
            <div className="pl-8 text-slate-300">{"log.LogInformation(\"{method} {path}\", ctx.Request.Method, ctx.Request.Path);"}</div>
            <div className="pl-8 text-emerald-400">{"await next(ctx);"}</div>
            <div className="pl-4 text-slate-300">{"}"}</div>
            <div className="text-slate-300">{"}"}</div>
            <div className="text-slate-400">{""}</div>
            <div className="text-slate-500">{"// Must register as a service too"}</div>
            <div className="text-slate-300">{"services.AddScoped<RequestLoggingMiddleware>();"}</div>
            <div className="text-slate-300">{"app.UseMiddleware<RequestLoggingMiddleware>();"}</div>
          </div>
        </div>
      ),
    },
    {
      id: "short",
      title: "Short-circuit — ending the pipeline early",
      accent: "rose",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Any middleware can short-circuit by writing a response directly and <em>not</em> calling <Code>next</Code>. This is how static files serve assets — they check if the file exists, stream it, and return without ever touching routing.
          </p>
          <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-emerald-400">{"app.Use(async (ctx, next) =>"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-slate-300">{"if (ctx.Request.Headers[\"X-ApiKey\"] != _key)"}</div>
            <div className="pl-4 text-slate-300">{"{"}</div>
            <div className="pl-8 text-slate-300">{"ctx.Response.StatusCode = 401;"}</div>
            <div className="pl-8 text-slate-300">{"await ctx.Response.WriteAsync(\"Unauthorized\");"}</div>
            <div className="pl-8 text-slate-300">{"return;                    // short-circuit"}</div>
            <div className="pl-4 text-slate-300">{"}"}</div>
            <div className="pl-4 text-emerald-400">{"await next(ctx);"}</div>
            <div className="text-slate-300">{"});"}</div>
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
            <button
              onClick={() => setOpen(isOpen ? null : id)}
              aria-expanded={isOpen}
              aria-controls={`mw-panel-${id}`}
              className={cn(
                "w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight
                className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div id={`mw-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                {content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4 — Minimal APIs
// ═══════════════════════════════════════════════════════════════════════════

function MinimalApiTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Minimal APIs trade ceremony for clarity — no controllers, no action filters, just route handlers. They are not a toy; they are faster, more testable, and recommended for new APIs.
      </p>
      <MinimalApiVsController />
      <MinimalApiFeatures />
      <MinimalApiAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function MinimalApiVsController() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Zap className="h-4 w-4" aria-hidden />
        Minimal API vs MVC Controllers
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-900 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-violet-700 dark:text-violet-300">Minimal API</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-emerald-400">{"app.MapGet(\"/orders/{id}\", async ("}</div>
            <div className="pl-4 text-emerald-400">{"    int id, AppDbContext db) =>"}</div>
            <div className="pl-4 text-emerald-400">{"    await db.Orders.FindAsync(id)"}</div>
            <div className="pl-4 text-slate-300">{"        is Order o ? Results.Ok(o)"}</div>
            <div className="pl-4 text-slate-300">{"        : Results.NotFound());"}</div>
          </div>
          <ul className="space-y-1">
            {["✓ No class boilerplate", "✓ DI via lambda parameters", "✓ TypedResults — compile-time safe", "✓ Route groups for shared prefix/auth"].map(t => (
              <li key={t} className="text-xs text-emerald-700 dark:text-emerald-400">{t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">MVC Controller</p>
          <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
            <div className="text-slate-300">{"[ApiController, Route(\"orders\")]"}</div>
            <div className="text-emerald-400">{"public class OrdersController(AppDbContext db)"}</div>
            <div className="pl-4 text-emerald-400">{"    : ControllerBase"}</div>
            <div className="text-slate-300">{"{"}</div>
            <div className="pl-4 text-slate-300">{"[HttpGet(\"{id}\")]"}</div>
            <div className="pl-4 text-emerald-400">{"public async Task<IActionResult> Get(int id)"}</div>
            <div className="pl-4 text-slate-300">{"    => await db.Orders.FindAsync(id)"}</div>
            <div className="pl-4 text-slate-300">{"        is Order o ? Ok(o) : NotFound();"}</div>
            <div className="text-slate-300">{"}"}</div>
          </div>
          <ul className="space-y-1">
            {["✓ Action filters for cross-cutting", "✓ Familiar to large teams", "✓ Better for complex input binding", "⚠ More ceremony per endpoint"].map(t => (
              <li key={t} className={cn("text-xs", t.startsWith("⚠") ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400")}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MinimalApiFeatures() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Package className="h-4 w-4" aria-hidden />
        Essential minimal API features
      </h3>
      <div className="space-y-3">
        {[
          {
            label: "Route groups",
            accent: "emerald",
            code: [
              'var orders = app.MapGroup("/orders").RequireAuthorization();',
              'orders.MapGet("/", GetAll);',
              'orders.MapGet("/{id}", GetById);',
              'orders.MapPost("/", Create);',
            ],
          },
          {
            label: "TypedResults — compile-time checked responses",
            accent: "blue",
            code: [
              "// Return type encodes all possible responses",
              "static async Task<Results<Ok<Order>, NotFound>>",
              "    GetOrder(int id, AppDbContext db) =>",
              "    await db.Orders.FindAsync(id) is Order o",
              "        ? TypedResults.Ok(o)",
              "        : TypedResults.NotFound();",
            ],
          },
          {
            label: "Filters — equivalent to action filters",
            accent: "violet",
            code: [
              "app.MapPost(\"/orders\", CreateOrder)",
              '   .AddEndpointFilter(async (ctx, next) =>',
              "   {",
              '       if (!ctx.HttpContext.User.Identity!.IsAuthenticated)',
              '           return Results.Unauthorized();',
              "       return await next(ctx);",
              "   });",
            ],
          },
        ].map(({ label, accent, code }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>{label}</p>
              <div className="rounded-md bg-slate-800 dark:bg-slate-900 border border-slate-700 p-2 font-mono text-xs overflow-x-auto">
                {code.map((line, i) => (
                  <div key={i} className={line.startsWith("//") ? "text-slate-500" : "text-slate-300"}>{line}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MinimalApiAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "binding",
      title: "Parameter binding rules",
      accent: "amber",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">The framework resolves handler parameters by convention — you rarely need attributes.</p>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Source</th>
                <th className="text-left py-2 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">When used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                ["Route segment", "Parameter name matches route template token, e.g. {id}"],
                ["Query string", "Simple type not in route and not complex"],
                ["Request body", "Complex type — bound from JSON body by default"],
                ["DI container", "Any type registered as a service (HttpContext, ILogger, DbContext)"],
                ["[FromHeader]", "Explicit binding from request header"],
                ["[AsParameters]", "Bind a struct/record from multiple sources at once"],
              ].map(([src, when]) => (
                <tr key={src}>
                  <td className="py-2 pr-4 font-mono text-emerald-400">{src}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <button
              onClick={() => setOpen(isOpen ? null : id)}
              aria-expanded={isOpen}
              aria-controls={`ma-panel-${id}`}
              className={cn(
                "w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && (
              <div id={`ma-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                {content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5 — Auth & Options
// ═══════════════════════════════════════════════════════════════════════════

function AuthTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Authentication answers <em>who are you</em>; authorization answers <em>what can you do</em>. They are separate middleware — and the separation is intentional.
      </p>
      <AuthArchitecture />
      <JwtSetup />
      <OptionsPattern open={open} setOpen={setOpen} />
    </>
  );
}

function AuthArchitecture() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Shield className="h-4 w-4" aria-hidden />
        Authentication &amp; Authorization architecture
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          {
            label: "Authentication",
            accent: "violet",
            points: [
              "Runs UseAuthentication() middleware",
              "Reads credentials (JWT, Cookie, API key)",
              "Populates HttpContext.User (ClaimsPrincipal)",
              "Multiple schemes can coexist — JwtBearer + Cookie",
              "DefaultAuthenticateScheme controls which runs first",
            ],
          },
          {
            label: "Authorization",
            accent: "rose",
            points: [
              "Runs UseAuthorization() after authentication",
              "Evaluates IAuthorizationRequirement policies",
              "Endpoint metadata ([Authorize], RequireAuthorization())",
              "Custom handlers for complex rules (ownership, tenancy)",
              "Returns 401 (no user) or 403 (no permission)",
            ],
          },
        ].map(({ label, accent, points }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-3", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>{label}</p>
              <ul className="space-y-1.5">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-1.5">
                    <span className={cn("text-xs mt-0.5", a.text)}>✓</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{p}</span>
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

function JwtSetup() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Lock className="h-4 w-4" aria-hidden />
        JWT Bearer — full setup with policy-based authorization
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Program.cs — service registration"}</div>
        <div className="text-slate-300">{"builder.Services"}</div>
        <div className="pl-4 text-slate-300">{".AddAuthentication(JwtBearerDefaults.AuthenticationScheme)"}</div>
        <div className="pl-4 text-slate-300">{".AddJwtBearer(o =>"}</div>
        <div className="pl-4 text-slate-300">{"{"}</div>
        <div className="pl-8 text-slate-300">{"o.TokenValidationParameters = new()"}</div>
        <div className="pl-8 text-slate-300">{"{"}</div>
        <div className="pl-12 text-slate-300">{"ValidateIssuer = true,"}</div>
        <div className="pl-12 text-slate-300">{"ValidIssuer = builder.Configuration[\"Jwt:Issuer\"],"}</div>
        <div className="pl-12 text-slate-300">{"ValidateAudience = true,"}</div>
        <div className="pl-12 text-slate-300">{"ValidAudience = builder.Configuration[\"Jwt:Audience\"],"}</div>
        <div className="pl-12 text-slate-300">{"ValidateIssuerSigningKey = true,"}</div>
        <div className="pl-12 text-slate-300">{"IssuerSigningKey = new SymmetricSecurityKey("}</div>
        <div className="pl-16 text-amber-300">{"    Encoding.UTF8.GetBytes(builder.Configuration[\"Jwt:Key\"]!))"}</div>
        <div className="pl-8 text-slate-300">{"};"}</div>
        <div className="pl-4 text-slate-300">{"});"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-300">{"builder.Services.AddAuthorizationBuilder()"}</div>
        <div className="pl-4 text-slate-300">{".AddPolicy(\"AdminOnly\", p => p.RequireRole(\"Admin\"))"}</div>
        <div className="pl-4 text-slate-300">{".AddPolicy(\"VerifiedUser\", p => p.RequireClaim(\"email_verified\", \"true\"));"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Middleware order (must be this way)"}</div>
        <div className="text-emerald-400">{"app.UseAuthentication();"}</div>
        <div className="text-emerald-400">{"app.UseAuthorization();"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Endpoint usage"}</div>
        <div className="text-slate-300">{"app.MapDelete(\"/admin/users/{id}\", DeleteUser)"}</div>
        <div className="pl-4 text-emerald-400">{'   .RequireAuthorization("AdminOnly");'}</div>
      </div>
    </div>
  );
}

function OptionsPattern({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "options",
      title: "IOptions<T> vs IOptionsSnapshot<T> vs IOptionsMonitor<T>",
      accent: "emerald",
      content: (
        <div className="space-y-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Interface</th>
                <th className="text-left py-2 pr-4 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lifetime</th>
                <th className="text-left py-2 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Reloads?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                ["IOptions<T>", "Singleton", "✗ No — snapshot at startup"],
                ["IOptionsSnapshot<T>", "Scoped", "✓ Per request — reads fresh config"],
                ["IOptionsMonitor<T>", "Singleton", "✓ Live — fires OnChange callback"],
              ].map(([iface, lt, reload]) => (
                <tr key={iface}>
                  <td className="py-2 pr-4 font-mono text-emerald-400">{iface}</td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{lt}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">{reload}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
            <div className="text-slate-500">{"// Bind a section, add validation"}</div>
            <div className="text-slate-300">{"builder.Services"}</div>
            <div className="pl-4 text-slate-300">{'.AddOptions<SmtpOptions>()'}</div>
            <div className="pl-4 text-slate-300">{'.BindConfiguration("Smtp")'}</div>
            <div className="pl-4 text-slate-300">{'.ValidateDataAnnotations()'}</div>
            <div className="pl-4 text-slate-300">{'.ValidateOnStart();'}</div>
          </div>
        </div>
      ),
    },
    {
      id: "problems",
      title: "Common auth pitfalls",
      accent: "rose",
      content: (
        <ul className="space-y-3">
          {[
            { prob: "UseAuthentication after UseAuthorization", fix: "Always authn before authz — authz reads HttpContext.User which authn populated." },
            { prob: "Missing [ApiController] on JWT-protected controller", fix: "Without it, model binding errors return 200 instead of 400 and auth claims aren't auto-validated." },
            { prob: "Storing JWT in localStorage", fix: "XSS-vulnerable. Use HttpOnly cookies or BFF pattern. In .NET, use cookie auth + secure SameSite=Strict." },
            { prob: "Missing ClockSkew = Zero on token validation", fix: "Default 5-min skew means expired tokens keep working for 5 extra minutes. Set it to Zero or a tight value." },
          ].map(({ prob, fix }) => (
            <li key={prob} className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400">⚠ {prob}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">{fix}</span>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
        <Settings className="h-4 w-4" aria-hidden />
        Options pattern &amp; auth pitfalls
      </h3>
      {items.map(({ id, title, accent, content }) => {
        const a = accentMap[accent];
        const isOpen = open === id;
        return (
          <div key={id} className="rounded-xl border-2 overflow-hidden border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setOpen(isOpen ? null : id)}
              aria-expanded={isOpen}
              aria-controls={`auth-panel-${id}`}
              className={cn(
                "w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && (
              <div id={`auth-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                {content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
