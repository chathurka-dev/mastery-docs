# .NET Mastery Guide — From .NET 6 to .NET 10, Plus AI

A 7-day deep-dive written for an experienced engineer who has *used* .NET 6 for years but wants to **understand** it. We will go past surface syntax into runtime mechanics, framework internals, performance traps, modern patterns, every meaningful change from .NET 6 to .NET 10, and finally building and **evaluating** AI features on .NET.

Each day has:

1. Core concepts (the "why")
2. Internals you should know
3. Pitfalls / production lessons
4. A pointer to runnable samples in `code-samples/DayN-*/`

---

## How to use this guide

- Read one day per sitting. Don't rush.
- For each day, after reading, open the code samples folder and run / step through them in your IDE.
- At the end of each day, try the **"Stress test yourself"** questions. If you can answer them out loud, move on.
- Keep this doc as a long-term reference — every section is self-contained.

---

# Day 1 — Runtime & Language Internals

The biggest gap most "senior .NET" devs have is not knowing what happens between `dotnet run` and code executing. Fixing that makes everything else easier — perf, async bugs, GC pressure, AOT.

## 1.1 The .NET stack, top to bottom

When you ship a .NET app, four layers cooperate:

1. **Your IL** — your C#/F#/VB code compiled to platform-agnostic **Intermediate Language** (CIL) bytecode and metadata, packaged in a managed assembly (`.dll`).
2. **CoreCLR** — the runtime. It loads assemblies, JIT-compiles IL to native code, runs the **GC**, manages threads, exceptions, P/Invoke, and security.
3. **BCL / runtime libraries** — `System.*` types (`string`, `List<T>`, `Task`, `Span<T>`, `HttpClient`, etc.). Implemented partly in C#, partly in C++ inside the runtime.
4. **Host** — `dotnet` (or your app's apphost) starts the CLR and hands it your `Main`.

For ASP.NET Core, **Kestrel + the Generic Host** sit on top of this, but it's still just managed code running on CoreCLR.

> Key idea: the *language* (C#) and the *runtime* (CLR) are independent. C# 12 features compile to IL that the .NET 6 runtime can run *if* they don't depend on new runtime features (e.g., `static abstract` interface members do require a new runtime).

## 1.2 The JIT, tiered compilation, R2R, and AOT

### JIT (just-in-time)
When a method is first called, the CLR's JIT compiles its IL to native machine code, caches it, and from then on the native version runs. Compilation is **per-method, lazy, and per-process**.

### Tiered compilation (default since 3.0)
Methods first get a **Tier 0** compile — fast, unoptimized. Hot methods get re-compiled at **Tier 1** with full optimizations. This gives fast startup *and* good steady-state performance.

You can see it: set `DOTNET_TieredCompilation=0` and your app's startup gets slower but steady state may look slightly different — useful for benchmarking.

### ReadyToRun (R2R / "crossgen2")
You can pre-JIT assemblies during publish (`<PublishReadyToRun>true</PublishReadyToRun>`). The first call still goes through Tier 0/1 logic, but the cold-start cost is much lower. Most production ASP.NET images should enable R2R.

### Native AOT (.NET 7+)
Compiles the **entire app** ahead of time to a single native binary. No JIT at runtime. Trade-offs:

- Pros: tiny startup (~10ms), small memory, single binary, no JIT spikes.
- Cons: no runtime code generation (so reflection-heavy code, some serialization, Castle DynamicProxy, EF Core proxy-based lazy loading, etc. break or require source generators).

Use Native AOT for: CLI tools, serverless, gRPC microservices, sidecars. **Not** typically for big EF Core/MVC apps yet — though support has improved each release (more on this in Day 5).

### Dynamic PGO (Profile-Guided Optimization)
Enabled by default in .NET 8+. The JIT collects runtime stats during Tier 0 (which types flow through a method, which branches are hot) and uses them at Tier 1 to devirtualize calls and inline aggressively. Free perf — just upgrade.

## 1.3 Memory & the garbage collector

### Stack vs heap (it's more nuanced than you think)
- **Value types** can live on the stack, in a register, *or* inline inside a reference type on the heap.
- **Reference types** always live on the GC heap; only the *reference* sits on the stack/in a register.
- A struct boxed via `object o = myStruct;` lives on the heap.

So "structs are on the stack" is wrong in general — it depends on context.

### Generational GC
The GC has 3 generations (0, 1, 2) plus a **Large Object Heap (LOH)** for objects ≥ 85,000 bytes, plus a **Pinned Object Heap (POH)**:

- New objects → Gen 0.
- Survive a collection → promoted to Gen 1, then Gen 2.
- LOH: large arrays, big strings. Expensive to compact (only does so opt-in / occasionally).
- POH (.NET 5+): for objects you pin for interop. Keeps pinning out of the regular heap.

Gen 0 collections are *cheap* (small region, fast). Gen 2 collections walk the whole reachable graph and are expensive. **Your goal: keep allocations short-lived so they die in Gen 0.**

### Workstation vs Server GC
- **Workstation GC**: one heap, one GC thread. Better for client apps / low-core machines.
- **Server GC**: one heap *per core*, parallel GC threads. The default for ASP.NET Core. Higher throughput, more memory used. Enable explicitly with `<ServerGarbageCollection>true</ServerGarbageCollection>`.

### Allocation pitfalls you've probably hit without noticing
- LINQ chains in hot paths allocate enumerators and closures.
- `string.Format` and `+` allocate; interpolated strings since C# 10 use `DefaultInterpolatedStringHandler` and can avoid allocations in some sinks (like `ILogger`).
- `async` methods over a `Task<T>` allocate a state machine *on the heap* if they ever suspend. Use `ValueTask<T>` only when most calls complete synchronously.
- Capturing `this` or locals in a lambda allocates a closure object.
- `Enumerable.ToList()` inside loops.

### Span<T> and Memory<T>
`Span<T>` is a `ref struct` that represents a contiguous region of memory — could be on the heap, the stack, or unmanaged. It lets you slice arrays/strings **without allocating**.

```csharp
ReadOnlySpan<char> s = "hello world";
var word = s[6..]; // "world", no allocation
```

Because `Span<T>` is a `ref struct`, it can't escape to the heap (no boxing, can't be a field of a class, can't be used across `await`). That's the whole point — it makes "stack-only" guarantees a compiler-enforced rule.

`Memory<T>` is the heap-friendly cousin you use when you need to carry a buffer across `await` boundaries.

Real example: parsing HTTP headers in Kestrel uses spans end-to-end — zero allocations for the parse itself.

## 1.4 Async/await: the mental model that fixes 80% of async bugs

`async`/`await` is **not** a thread-switching keyword. It's a **state machine** the compiler builds for you.

When the compiler sees:

```csharp
public async Task<int> GetAsync()
{
    var data = await _http.GetStringAsync(url);
    return data.Length;
}
```

It generates a struct/class implementing a state machine. The method body becomes a `MoveNext` with a switch over states. When an `await` hits an incomplete task, `MoveNext` returns; the awaited task's continuation is registered to call `MoveNext` again when ready.

### Three things to internalize

**1. `async void` is dangerous.** Exceptions thrown in `async void` escape on the captured `SynchronizationContext` and can crash the process. Use only for event handlers.

**2. The `SynchronizationContext` decides who resumes you.**
- In ASP.NET Core: there *is no* sync context. Continuations resume on the thread-pool. So `ConfigureAwait(false)` is *meaningless* in ASP.NET Core controller/service code.
- In WPF/WinForms: there is one (the UI thread). Library code should use `ConfigureAwait(false)` to avoid forcing UI thread.

**3. Sync-over-async deadlocks.** `task.Result` / `task.Wait()` in a UI app deadlocks because the continuation needs the UI thread that's blocked waiting. In ASP.NET Core it usually doesn't deadlock but it ties up a thread-pool thread. **Don't do it.**

### `Task` vs `ValueTask<T>`
- `Task<T>` is a class — heap allocation on every async method that suspends.
- `ValueTask<T>` is a struct that can wrap *either* a `T` or a `Task<T>`. Avoids the allocation when the result is already available (e.g., cache hits, single-call channels).
- Rule: use `ValueTask` only when the operation is *frequently synchronous*, and never `.Result` a `ValueTask` twice (it's designed to be awaited once).

### Cancellation
`CancellationToken` is the standard cooperative cancellation mechanism. Pass it through every async call. In ASP.NET Core, the request's `HttpContext.RequestAborted` token cancels when the client disconnects — wire it into your downstream calls and DB queries to stop wasted work.

## 1.5 Modern C# features you should be fluent in (C# 10 → 13)

Even on .NET 6 you can target C# 10. Per release:

**C# 10 (with .NET 6):**
- File-scoped namespaces.
- Global usings (`global using System.Linq;` once, used everywhere).
- Record structs (`public record struct Point(int X, int Y);`).
- Improved interpolated string handlers (lets logging frameworks skip allocations when log level is filtered out).

**C# 11 (with .NET 7):**
- `required` members.
- Raw string literals (`"""..."""`).
- Generic math (`static abstract` interface members — runtime feature).
- List patterns (`is [1, 2, .., 5]`).

**C# 12 (with .NET 8):**
- **Primary constructors on classes** (not just records).
- Collection expressions (`int[] x = [1, 2, 3];`).
- Type aliases for any type (`using Point = (int X, int Y);`).
- `ref readonly` parameters.

**C# 13 (with .NET 9):**
- `params` collections (not just arrays — `params ReadOnlySpan<int>`).
- New `lock` type (faster, contention-aware).
- Implicit indexer access in object initializers.

**C# 14 (with .NET 10):** field-backed properties (`field` keyword), extension members (extension properties + static extensions), null-conditional assignment.

### Nullable reference types (NRT) — actually use them

Turn on `<Nullable>enable</Nullable>` project-wide. NRT is a *compiler* feature — at runtime, all reference types are still nullable. But the compiler tracks flow and tells you where you're forgetting null checks. It catches a real class of bugs and is essentially free.

Patterns:
- `string? name` — could be null.
- `string name` (no `?`) — promised non-null.
- `name!` — null-forgiving operator; tells the compiler "trust me." Use sparingly.
- `[MemberNotNull(nameof(_field))]` attribute — for methods that initialize fields.

## 1.6 Source generators — compile-time code gen

A source generator is a Roslyn analyzer that **adds source files to your compilation at compile time** based on what it sees in your code. Examples in the BCL:

- `System.Text.Json` source generator — generates serializers at compile time so you don't need reflection. Required for AOT.
- `LoggerMessage` source generator — `[LoggerMessage(...)]` generates the most efficient logging code.
- `RegexGenerator` — `[GeneratedRegex(...)]` compiles regex patterns at build time.

Why care? They are the AOT-safe alternative to runtime reflection, and they're how the framework keeps eating reflection-heavy libraries (`Microsoft.Extensions.AI` and EF Core 8+ are increasingly source-gen friendly).

## 1.7 Pitfalls and lessons

- **Configuring `Server GC` for tiny console apps wastes memory.** Default to Workstation GC unless you're hosting a server.
- **`HttpClient` should be reused** (single instance / `IHttpClientFactory`). Creating new ones leaks socket handles via `TIME_WAIT`.
- **`Task.Run` in ASP.NET Core controllers is almost always wrong.** You're stealing thread-pool threads from request handling to run on… thread-pool threads.
- **Don't `await` inside `lock`.** It's a compile error for a reason — you cannot release a lock from a different thread reliably.
- **`Dispose` async resources with `await using`**. Implement `IAsyncDisposable` for things that hit I/O on cleanup.

## 1.8 Stress test yourself

1. Why does `async` *without* `await` still return a `Task`, and what does it do?
2. What's the difference between Gen 1 and Gen 2 collection cost, and how do you keep things in Gen 0?
3. When is `ConfigureAwait(false)` actually meaningful, and when is it noise?
4. What can't you do with a `Span<T>` that you can do with a `Memory<T>`?
5. Name three things Native AOT breaks and what the source-generator equivalent is.

## 1.9 Samples

See `code-samples/Day1-Runtime/`:

- `01-value-vs-reference.cs` — boxing, stack/heap behavior, `in` parameters.
- `02-async-internals.cs` — manual state machine + ValueTask + cancellation.
- `03-spans.cs` — zero-allocation parsing.
- `04-source-generators.cs` — `LoggerMessage` + `GeneratedRegex` + `JsonSerializerContext`.
- `05-nrt-and-patterns.cs` — modern C# features you should be reaching for.

---

# Day 2 — ASP.NET Core Deep Dive

You've shipped Web APIs for years. The goal today is to know *exactly* what `WebApplication.CreateBuilder(args)` is doing and why.

## 2.1 The hosting model — Generic Host

Every modern .NET app (console, ASP.NET Core, worker service, background job) is built on `IHost`. `WebApplication` in .NET 6+ is a thin wrapper that wires up Kestrel and the HTTP pipeline.

`WebApplication.CreateBuilder(args)` does, in order:

1. Creates a `WebApplicationBuilder`.
2. Sets up **Configuration** from a layered set of sources: `appsettings.json` → `appsettings.{Environment}.json` → user secrets (Dev) → environment variables → command-line args. Later sources override earlier ones.
3. Sets up **Logging** (console + debug by default).
4. Registers the **DI container** (Microsoft.Extensions.DependencyInjection).
5. Adds the Kestrel server and HTTP feature defaults.

Then you call `var app = builder.Build();` which **freezes** the service collection and produces the request pipeline builder. **Anything that registers services must run before `Build()`.** Anything that defines middleware/endpoints runs after.

This is why you sometimes see "can't add service after host is built" errors — you tried to mutate the container after `Build()`.

## 2.2 Dependency Injection — really know it

### Lifetimes
- **Transient** — new instance every resolution. Cheap, but be careful: if a transient holds state, you'll be confused.
- **Scoped** — one per scope. In ASP.NET Core, the scope is the HTTP request. Use for things that should "live as long as the request" — DbContext, the per-request user, unit-of-work.
- **Singleton** — one for the lifetime of the host. Must be thread-safe.

### Captive dependencies (the #1 DI bug)
A singleton that depends on a scoped service captures it forever — that scoped service never gets disposed and outlives every request. The container will throw in development if `ValidateScopes` is on (it is by default). Don't turn that off.

```csharp
// BAD: SingletonService holds DbContext forever
builder.Services.AddSingleton<SingletonService>();
builder.Services.AddScoped<MyDbContext>();
```

### Service descriptors and the resolution algorithm
When you `AddScoped<IFoo, Foo>()`, you register a `ServiceDescriptor`. At resolution:
1. Container looks up the most recent registration for `IFoo`.
2. Walks Foo's constructor, resolves each parameter recursively.
3. Caches the resulting instance for the appropriate lifetime.

`IEnumerable<IFoo>` resolves *all* registrations of `IFoo` (powerful for plugin patterns).

### Keyed services (.NET 8)
You can now register multiple implementations under a key:

```csharp
services.AddKeyedScoped<INotifier, EmailNotifier>("email");
services.AddKeyedScoped<INotifier, SmsNotifier>("sms");

public class Handler([FromKeyedServices("email")] INotifier email) { ... }
```

Before .NET 8 you had to roll a factory by hand.

### Scope creation outside HTTP
In background services or hosted services, you don't have an automatic request scope. Create one:

```csharp
public class MyBackgroundService(IServiceScopeFactory scopeFactory) : BackgroundService
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
}
```

## 2.3 Configuration & Options

### `IConfiguration` is a layered key-value store
Keys are strings, values are strings. Sections are nested via `:` (e.g., `Logging:LogLevel:Default`). Environment variables use `__` instead of `:` because Linux doesn't allow `:` in env var names.

### The Options pattern
Bind a config section to a strongly typed POCO once, inject it everywhere:

```csharp
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
```

Three options interfaces:
- `IOptions<T>` — singleton snapshot, never updates.
- `IOptionsSnapshot<T>` — per-request, re-reads if config changed (use in scoped services).
- `IOptionsMonitor<T>` — singleton-friendly, exposes `OnChange` callback; ideal for long-lived services.

Add `.ValidateDataAnnotations().ValidateOnStart()` to catch bad config at startup, not at first use.

## 2.4 The middleware pipeline

Middleware is a function `RequestDelegate -> RequestDelegate`. Each middleware can:
- Inspect/modify `HttpContext`.
- Call (or not call) `next` to pass control downstream.
- Run code after `next` returns (response side).

Order matters — a lot:

```csharp
app.UseExceptionHandler("/error");   // outermost: catches exceptions from everything below
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();                     // populates the matched endpoint
app.UseCors();
app.UseAuthentication();              // must be after UseRouting, before UseAuthorization
app.UseAuthorization();
app.MapControllers();                 // terminal: invokes the endpoint
```

Two ways to write middleware:

**Inline:**
```csharp
app.Use(async (ctx, next) =>
{
    var sw = Stopwatch.StartNew();
    await next();
    logger.LogInformation("{Path} took {Ms}ms", ctx.Request.Path, sw.ElapsedMilliseconds);
});
```

**Convention-based class:**
```csharp
public class TimingMiddleware
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
app.UseMiddleware<TimingMiddleware>();
```

The convention class is instantiated **once** (singleton). `InvokeAsync` parameters beyond `HttpContext` are resolved from request services on each call.

## 2.5 Minimal APIs vs Controllers — when to use which

**Minimal APIs** (introduced .NET 6, hardened .NET 7-9):
- Define endpoints directly on `app.MapGet/MapPost/...`.
- Smaller startup, no controller class boilerplate.
- AOT-friendly via the Request Delegate Generator (RDG, .NET 8).
- Good for microservices, small services, gateways.

**MVC Controllers:**
- Class-based, inheritance, filters, model binding feel familiar.
- Better for big apps with lots of cross-cutting concerns expressed as filters.
- Still fully supported; not deprecated.

Both share the same routing, model binding, and filter infrastructure under the hood. Pick by team familiarity and app size, not religion.

### Endpoint filters (the "minimal API equivalent of action filters")
```csharp
app.MapPost("/orders", CreateOrder)
   .AddEndpointFilter(async (ctx, next) =>
   {
       // before
       var result = await next(ctx);
       // after
       return result;
   });
```

### TypedResults vs Results
Use `TypedResults.Ok(value)` instead of `Results.Ok(value)` — gives compile-time return types, better OpenAPI, and is AOT-safe.

## 2.6 Model binding, validation, filters

### Binding sources
`[FromQuery]`, `[FromRoute]`, `[FromHeader]`, `[FromBody]`, `[FromForm]`, `[FromServices]`. Minimal APIs infer these from parameter types and route templates.

In .NET 7+, you can implement `IBindableFromHttpContext<T>` to teach minimal APIs how to bind a custom type.

### Validation
Built-in: DataAnnotations attributes (`[Required]`, `[StringLength]`, etc.). For complex rules, **FluentValidation** is the de-facto choice — register validators in DI and wire them to a filter.

.NET 8 introduced source-generated DataAnnotations validation for AOT.

### Filters (MVC)
- **Authorization filters** — first to run.
- **Resource filters** — wrap model binding (used for caching).
- **Action filters** — before/after the action.
- **Exception filters** — handle exceptions from actions.
- **Result filters** — wrap the result execution.

Most of your filters should *probably* be middleware or endpoint filters. MVC filters are still right when you need MVC-aware features like `ActionExecutingContext`.

## 2.7 Auth and authz

### Authentication = "who are you?"
JWT bearer is standard for APIs:

```csharp
builder.Services.AddAuthentication("Bearer")
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
    });
```

For interactive apps, use OpenID Connect (Microsoft.Identity.Web for Entra ID / B2C).

### Authorization = "are you allowed?"
Three styles:

**Role-based:** `[Authorize(Roles = "Admin")]`. Simple but coarse.

**Policy-based:** define policies once, apply by name.
```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OverEighteen", p => p.RequireClaim("age", "18", "19", "20"));
});
[Authorize(Policy = "OverEighteen")]
```

**Requirement + handler:** for complex logic. Define an `IAuthorizationRequirement` and an `AuthorizationHandler<T>`.

In .NET 7+, use the `IAuthorizationBuilder` extensions and `AddPolicy(name, callback)` with `RequireAssertion(ctx => ...)` for one-off checks.

## 2.8 Pitfalls and lessons

- **`UseRouting` before `UseAuthorization`.** Auth needs the endpoint metadata to know what policy applies.
- **Don't hide `HttpClient` behind your own static.** Use `IHttpClientFactory` (`builder.Services.AddHttpClient("named", c => ...)`) — it manages handlers, lifetimes, and integrates with Polly.
- **Returning `IActionResult` vs `ActionResult<T>` vs `TypedResults`.** Prefer `ActionResult<T>` (or `Results<Ok<T>, NotFound>` in minimal APIs) for correct OpenAPI types.
- **Cancellation:** accept a `CancellationToken` parameter in every action. ASP.NET binds it from `HttpContext.RequestAborted`. Pass it down.
- **Antiforgery for cookie-authed forms only.** Pure bearer-token APIs don't need it.

## 2.9 Stress test yourself

1. What's the difference between `IOptions<T>`, `IOptionsSnapshot<T>`, and `IOptionsMonitor<T>`? When do you reach for each?
2. Walk me through what `WebApplication.CreateBuilder(args).Build().Run()` does.
3. Explain the order constraints for `UseRouting`, `UseAuthentication`, `UseAuthorization`, `UseCors`. Why?
4. What's a captive dependency? How does the container help you catch it?
5. When would you pick MVC controllers over minimal APIs, and vice versa?

## 2.10 Samples

`code-samples/Day2-AspNetCore/`:

- `01-minimal-api.cs` — minimal API + TypedResults + endpoint filters.
- `02-di-lifetimes.cs` — captive dependency demo + keyed services.
- `03-middleware.cs` — convention + factory middleware + ordering.
- `04-options-pattern.cs` — IOptions/Snapshot/Monitor + validation.
- `05-auth-jwt.cs` — JWT setup + policy-based authorization.

---

# Day 3 — EF Core & Data Access

You've used EF Core. Today's goal: stop being surprised by its behavior.

## 3.1 The mental model

`DbContext` is a **unit of work + identity map + change tracker** sitting on top of a `DbConnection`.

When you `db.Users.Add(user)`:
- The change tracker records `user` as `Added`.
- `user.Id` is still default (unless you set it).
- Nothing has hit the DB.

On `SaveChanges()`:
- The change tracker computes a graph of inserts/updates/deletes.
- EF generates SQL, opens a transaction, runs it, reads back generated IDs, **detaches updates** to keep tracked entities in sync.

On a query:
- Your `IQueryable` is a tree of expression trees.
- The query provider (the SQL Server provider, Npgsql, Sqlite…) translates it to SQL.
- Materialization populates entity instances *and* attaches them to the change tracker — that's expensive if you don't need it.

### Identity map / first-level cache
Within one `DbContext` instance, a row is materialized into the same instance once. Querying the same `Id` twice returns the *same* C# object. The change tracker also notices when you mutate a tracked entity.

### Why short-lived `DbContext` matters
A long-lived `DbContext`:
- Accumulates tracked entities indefinitely → memory creep.
- Re-uses one DB connection improperly across requests/threads (it's **not thread-safe**).
- Makes change tracking slow because every `SaveChanges` walks all tracked entities.

Standard pattern: scoped `DbContext` per request, disposed at the end.

## 3.2 Tracking vs no-tracking

```csharp
// Tracked (default): can mutate, will save back
var user = db.Users.First(u => u.Id == id);

// No-tracking: read-only, ~30-40% faster, no identity map
var users = db.Users.AsNoTracking().Where(u => u.IsActive).ToList();

// No-tracking with identity resolution (so includes don't duplicate)
var users = db.Users.AsNoTrackingWithIdentityResolution().Include(u => u.Orders).ToList();
```

Rule: for read-only queries (lists, reports, exports) → always `AsNoTracking`. For "load, modify, save" → tracked.

## 3.3 Query translation pitfalls

EF translates *most* of LINQ to SQL, but not everything. When it can't, two failure modes:

1. **Client evaluation** — older EF Core silently materialized and finished in memory. **EF 3.0+ throws** for `Where`/etc. that can't translate. `Select` projections still can mix server + client evaluation, but predicates can't.
2. **Slow translation** — generates a query that runs but isn't ideal.

Common things that won't translate:
- Calling your own static method inside a `Where`.
- `string.Format`, complex `DateTime` arithmetic with custom logic.
- Anything reflection-based.

What you should reach for:
- **Function mappings** (`HasDbFunction`) when you need a SQL function.
- **Computed columns** or **scalar UDFs** in the DB itself.
- `FromSqlInterpolated` for ad-hoc raw SQL with parameter safety:
  ```csharp
  var users = db.Users
      .FromSqlInterpolated($"SELECT * FROM Users WHERE Name LIKE {pattern}")
      .ToList();
  ```

## 3.4 The N+1 problem (still the #1 EF Core killer)

```csharp
// BAD: 1 + N queries
var orders = db.Orders.ToList();
foreach (var o in orders)
    Console.WriteLine(o.Customer.Name); // lazy load fires per row
```

Fixes:

```csharp
// Eager load
db.Orders.Include(o => o.Customer).ToList();

// Projection (best — only fetches columns you need)
db.Orders.Select(o => new { o.Id, CustomerName = o.Customer.Name }).ToList();

// Split queries (when joins are too big)
db.Orders.Include(o => o.Items).AsSplitQuery().ToList();
```

**Disable lazy loading proxies in any serious app.** Use explicit `Include` or projections.

## 3.5 Performance: things that actually matter

### Use projections aggressively
Don't load 30 columns to show 3. `Select` into a DTO. EF will generate the narrow `SELECT` and skip change tracking.

### Compiled queries
For hot queries, eliminate the per-call expression tree compilation:

```csharp
private static readonly Func<MyDbContext, int, Task<User?>> GetUserById =
    EF.CompileAsyncQuery((MyDbContext db, int id) =>
        db.Users.AsNoTracking().FirstOrDefault(u => u.Id == id));

var user = await GetUserById(db, 42);
```

EF Core 8+ does **query cache** automatically for parameterized queries, but compiled queries still skip more overhead in tight loops.

### Bulk operations (EF Core 7+)
`ExecuteUpdate` and `ExecuteDelete` — set/delete without materializing:

```csharp
await db.Orders
    .Where(o => o.CreatedAt < cutoff && o.Status == OrderStatus.Cancelled)
    .ExecuteDeleteAsync();

await db.Users
    .Where(u => !u.IsActive)
    .ExecuteUpdateAsync(s => s.SetProperty(u => u.Archived, true));
```

These translate to a single `DELETE` / `UPDATE` statement.

For inserts, EF Core uses MERGE/multi-VALUES batching automatically. For *really* big bulk inserts, use `SqlBulkCopy` or `EFCore.BulkExtensions`.

### `AsNoTracking` for reports
Always.

### Indexes & query plans
EF won't write indexes for you. Use `HasIndex` in `OnModelCreating`, and check actual query plans periodically (SQL Server: SET STATISTICS IO, Activity Monitor; Postgres: `EXPLAIN ANALYZE`).

## 3.6 Migrations strategies

### Code-first migrations
`dotnet ef migrations add InitialCreate` → diff between model and last snapshot → generates a `.cs` migration with `Up` / `Down`.

For production: **don't run `Database.Migrate()` at app startup in a multi-instance deployment.** Two instances racing each other is fun for nobody.

Better patterns:

1. **CI job runs migrations** before deploying app instances. Use `dotnet ef migrations script --idempotent -o migration.sql` to produce a SQL script and run it via your DB tool.
2. **Pre-deployment migration container** (Kubernetes Job that runs the EF script, then app deploys).
3. **Migration bundles** (EF Core 7+): `dotnet ef migrations bundle` produces a self-contained executable.

Always plan for **backwards-compatible migrations** — add columns nullable first, deploy code, then make non-null in a follow-up. Don't drop columns the running app still references.

## 3.7 Transactions, concurrency, and connection resiliency

### Transactions
Implicit on `SaveChanges` for a single context. Explicit when you span multiple operations:

```csharp
await using var tx = await db.Database.BeginTransactionAsync();
// ... multiple ops
await tx.CommitAsync();
```

### Optimistic concurrency
Add a `[Timestamp]` / `rowversion` column. EF generates `UPDATE ... WHERE Id = @id AND RowVersion = @oldVersion`. If 0 rows affected, throws `DbUpdateConcurrencyException`. Catch it, reload, decide.

### Connection resiliency
`UseSqlServer(..., o => o.EnableRetryOnFailure())` retries transient failures. Combine with idempotent operations or saga-like patterns for safety.

## 3.8 EF Core vs Dapper

Dapper is a micro-ORM: maps a query result to objects, nothing else. No change tracking, no LINQ, no migrations.

| Use case | EF Core | Dapper |
|---|---|---|
| Write-heavy domain logic | ✓ | needs hand-written SQL |
| Reports / read models | ok | usually faster, simpler |
| Complex aggregates | great with `Select` | manual joins |
| Tight perf budgets | with compiled queries + ExecuteUpdate | hard to beat |

Many serious systems use **both** — EF Core for the write/command side, Dapper for read models. EF Core's perf has closed the gap a lot since 6.0, especially with `ExecuteUpdate` and AOT-friendly query compilation.

## 3.9 Pitfalls

- **Sharing `DbContext` across threads.** Will fail randomly. Always one DbContext per logical operation.
- **`Include` chains explode result size.** Two `Include`s with collections = cartesian product. Use `AsSplitQuery` or projections.
- **`SaveChanges` inside a loop** — batch instead.
- **Mass adding entities without `AutoDetectChangesEnabled = false`.** The default does change detection on every Add. Toggling off + re-on around big inserts is a huge win.
- **EF migrations on dev DB pointing at prod.** Not even joking — `EFCore__ConnectionString` env-var typos have broken companies. Belt and braces: prod runs scripts, not migrations.

## 3.10 Stress test yourself

1. Why is the default tracking behavior bad for read-heavy endpoints?
2. What does `AsSplitQuery` solve and when is it the wrong choice?
3. How does `ExecuteUpdate` differ from `foreach (var x in q) { x.Y = z; } SaveChanges()`?
4. What's the correct production strategy for running EF Core migrations?
5. Why do compiled queries help — and when is the gain negligible?

## 3.11 Samples

`code-samples/Day3-EFCore/`:

- `01-change-tracking.cs` — tracked vs no-tracking + identity map.
- `02-query-pitfalls.cs` — N+1, projections, split queries.
- `03-bulk-ops.cs` — `ExecuteUpdate`, `ExecuteDelete`.
- `04-compiled-queries.cs` — `EF.CompileAsyncQuery` patterns.
- `05-concurrency.cs` — optimistic concurrency with rowversion.

---

# Day 4 — Architecture & Patterns

You've already done architecture (CV says "made architectural decisions"). This is the systematic version with the names and trade-offs.

## 4.1 Clean Architecture in .NET (without the cargo cult)

The point: **dependencies point inward.** Outer layers depend on inner layers, never the reverse. So your domain doesn't know about EF Core, ASP.NET Core, or AWS.

Typical layout:

```
src/
  MyApp.Domain/          // entities, value objects, domain services. No dependencies.
  MyApp.Application/     // use cases, command/query handlers, ports (interfaces). Depends only on Domain.
  MyApp.Infrastructure/  // EF Core, external APIs, message bus, file system. Implements ports.
  MyApp.Api/             // ASP.NET Core, controllers, DI composition root.
```

Domain has **zero references**. Application references Domain. Infrastructure references Application (to implement interfaces). API references all.

The honest trade-off: it adds project structure overhead. Worth it for medium+ systems with significant domain logic. Probably overkill for a CRUD admin tool with five endpoints.

## 4.2 CQRS and MediatR

**CQRS** = separate the *write* model from the *read* model. Commands change state; queries return data. They don't need to share types.

It pays off when reads and writes have very different shapes (e.g., write to normalized tables, read from a denormalized view), or when you want to scale them independently. It's overkill for symmetric CRUD.

**MediatR** is a tiny library that gives you a single `IMediator` to dispatch requests to handlers:

```csharp
public record CreateOrder(int CustomerId, List<Item> Items) : IRequest<int>;

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
var id = await mediator.Send(new CreateOrder(customerId, items));
```

MediatR pipelines wrap every handler — perfect for logging, validation, transaction management:

```csharp
public class TransactionBehavior<TReq, TRes> : IPipelineBehavior<TReq, TRes>
    where TReq : ICommand<TRes>
{
    public async Task<TRes> Handle(TReq req, RequestHandlerDelegate<TRes> next, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var result = await next();
        await tx.CommitAsync(ct);
        return result;
    }
}
```

**As of MediatR 12.x, the library moved to a commercial license** for organizations above a revenue threshold. Many teams are migrating to `Mediator` (martin costello) or just writing a 30-line `ISender` themselves. Worth knowing.

## 4.3 DDD essentials (the parts that actually matter)

You don't need to memorize the blue book. The 80/20:

- **Entity** — has identity that persists over time (`Order` with `Id`).
- **Value object** — defined by its values, no identity (`Money(100, "USD")`). Implement `Equals`/`GetHashCode` by content. C# `record` is perfect.
- **Aggregate** — a cluster of entities/value objects you load and save as one unit. **Aggregate root** is the entry point — all changes go through it.
- **Domain event** — something that happened in the domain (`OrderPlaced`). Emit them from aggregates, dispatch after `SaveChanges`.

Two practical rules:
1. **One aggregate per transaction.** If your command needs to change two aggregates atomically, it's a sign the boundaries are wrong, or you need an *eventually consistent* domain event between them.
2. **Aggregates protect invariants.** Don't expose mutable collections; expose methods (`order.AddItem(...)`) that enforce rules.

## 4.4 Resilience — Polly + HttpClientFactory

Distributed systems fail. Three things you should wrap every external call in:

- **Timeout** — never block forever.
- **Retry** — handle transient failures with exponential backoff + jitter.
- **Circuit breaker** — stop hammering a dead dependency.

In .NET 8+, `Microsoft.Extensions.Http.Resilience` wraps Polly with sensible defaults:

```csharp
builder.Services.AddHttpClient<PaymentsClient>(c => c.BaseAddress = new(config["Payments:BaseUrl"]!))
    .AddStandardResilienceHandler(); // timeout + retry + circuit breaker + rate limiter
```

For custom pipelines, use Polly v8's `ResiliencePipelineBuilder` (the v8 API replaced policies with strategies — much cleaner).

## 4.5 gRPC, when and why

gRPC over HTTP/2 with Protobuf is .NET's preferred internal-service protocol:
- Strongly typed contracts (.proto → generated client + server).
- Binary, smaller and faster than JSON.
- Streaming (server, client, bidi).
- Built-in interceptors for auth, logging, metrics.

Use gRPC for service-to-service. Stick to REST/JSON for browsers and external APIs (gRPC-Web exists but adds friction).

## 4.6 Messaging & event-driven patterns

For decoupled services, use a broker — RabbitMQ, Azure Service Bus, Kafka.

In .NET, the popular abstractions are:
- **MassTransit** — full-featured, supports sagas, schedulers.
- **NServiceBus** — older, very enterprise.
- **Wolverine** — newer, lighter.

Patterns to know:
- **Outbox pattern** — write the domain change *and* the outbound message to the same DB transaction, then a background process publishes. Prevents the "saved the order but never sent the event" bug.
- **Idempotent consumers** — every handler must safely handle the same message twice (message brokers all redeliver).
- **Sagas** — long-running workflows that coordinate multiple services with compensating actions on failure.

## 4.7 Microservices considerations (not "do microservices")

If you're considering microservices, ask:

- Do we have distinct *bounded contexts*? If everything is "the app," monolith.
- Do we need independent scaling/deployment per area? If no, monolith.
- Can our team operate distributed systems? (Tracing, log aggregation, broker, on-call.)

The default 2026 advice is **modular monolith first**, extract services only when you have a *specific* reason. .NET 8+ makes this easy: one solution, multiple feature modules, clean boundaries.

Tooling worth knowing if you go distributed:
- **.NET Aspire** (.NET 8+) — opinionated stack for distributed apps: orchestration, service discovery, telemetry wiring, dashboards. Great DX.
- **OpenTelemetry** — instrument everything. Logs + metrics + traces from `Microsoft.Extensions.Telemetry` and `OpenTelemetry.*` packages.

## 4.8 Cross-cutting: logging, telemetry, observability

`ILogger<T>` is the entry point. Behind it:
- Console + debug providers by default.
- Add `Serilog` or `NLog` for sinks (files, Seq, Splunk, Datadog).
- Structured logging — pass values as parameters, not interpolation: `logger.LogInformation("Order {OrderId} placed", id);` — preserves the structure for querying.

OpenTelemetry is now the standard. Add the SDK + exporters and you get distributed traces across services, metrics, and structured logs in one stack.

## 4.9 Pitfalls

- **CQRS without a reason** — splitting reads/writes when both are identical is just extra files.
- **DDD on a CRUD app** — value objects for things that don't have invariants are theater.
- **Saga without an outbox** — messages get lost on crash between DB commit and broker send.
- **Microservices for team org reasons** — Conway's Law works the other way too: choose architecture, get the team.

## 4.10 Stress test yourself

1. Why does Clean Architecture put Application above Infrastructure? What does that prevent?
2. When is CQRS justified? When is it overkill?
3. What's the outbox pattern solving, and what does it cost?
4. Why is "one aggregate per transaction" a rule, and what do you do when you need to change two?
5. What does `AddStandardResilienceHandler` give you, and when do you need to drop to a custom Polly pipeline?

## 4.11 Samples

`code-samples/Day4-Architecture/`:

- `01-clean-architecture-layout.md` — project layout + sample CSPROJs.
- `02-cqrs-mediator.cs` — command + query + pipeline behavior.
- `03-domain-events.cs` — emit + dispatch after SaveChanges.
- `04-resilience-http.cs` — `AddStandardResilienceHandler` + custom Polly v8 pipeline.
- `05-outbox-pattern.cs` — outbox table + background publisher sketch.

---

# Day 5 — What Changed from .NET 6 to .NET 10

This is the chronological "what you missed" tour. Read top to bottom.

## 5.1 .NET 7 (Nov 2022, STS — out of support, but features carried forward)

**Performance:** ~1000 PRs labeled "perf." On-stack replacement (OSR) — hot methods can be re-JIT-optimized *mid-execution*. Major regex perf jump.

**ASP.NET Core:**
- Output caching middleware (`AddOutputCache`, `[OutputCache]`) — a proper replacement for the old ResponseCaching that wasn't HTTP-spec-compliant.
- Rate limiting middleware (`AddRateLimiter`) — fixed window, sliding window, token bucket, concurrency.
- Endpoint filters for minimal APIs.
- Typed results (`TypedResults`).

**EF Core 7:**
- `ExecuteUpdate` / `ExecuteDelete` (huge — see Day 3).
- JSON columns mapped to owned types.
- Better bulk operations and entity splitting.

**C# 11:**
- `required` members.
- Raw string literals.
- Generic math (`static abstract` interface members) — first time C# generics could do `T.MaxValue`, `+`, etc.
- File-scoped types.
- List patterns.

**Native AOT** shipped as production-ready for console apps and certain ASP.NET workloads (still limited; better in 8 and 9).

## 5.2 .NET 8 (Nov 2023, LTS — this is the floor for new projects)

**This is probably the most important release for you.** If you've been on 6, jumping to 8 first is the sane move.

**Runtime:**
- **Dynamic PGO on by default** — free 10-20% perf on most workloads.
- Native AOT for ASP.NET Core minimal APIs (production-ready).
- Improved tiered compilation.

**ASP.NET Core:**
- **Keyed services** in DI (see Day 2).
- **Identity API endpoints** — `MapIdentityApi<TUser>()` gives you registration/login/refresh endpoints with one line.
- **Request Delegate Generator (RDG)** — source-generates minimal API binding code, making it AOT-safe.
- Form binding in minimal APIs.
- `IExceptionHandler` interface — register exception handlers in DI instead of writing exception middleware by hand.
- HTTP/3 generally available.
- `TimeProvider` abstraction — replaces `DateTime.UtcNow` for testable time.

**EF Core 8:**
- **Complex types** (value objects without their own identity, mapped inline).
- **Primitive collections** — `List<int>` mapped natively (to a SQL Server `json` column, or Postgres array).
- Raw SQL queries for unmapped types (`db.Database.SqlQuery<DTO>(...)`).
- Better bulk insert.

**C# 12:**
- **Primary constructors on classes** (not just records):
  ```csharp
  public class UserService(MyDb db, ILogger<UserService> logger)
  {
      public async Task<User?> GetAsync(int id) => await db.Users.FindAsync(id);
  }
  ```
- **Collection expressions:** `int[] x = [1, 2, 3];` `List<int> y = [1, 2, 3];` `int[] z = [..a, ..b];`
- Optional parameters in lambdas: `Func<int, int> f = (x = 0) => x;`
- Type aliases for any type: `using Point = (int X, int Y);`
- `ref readonly` parameters, `inline arrays`.

**Microsoft.Extensions.AI** — first preview, but matured in 9.

## 5.3 .NET 9 (Nov 2024, STS)

**Runtime & libraries:**
- More PGO improvements; better loop optimizations.
- `System.Text.Json`: nullable reference type respect, more flexibility.
- New `Tensor<T>` and `System.Numerics` work for AI workloads.

**ASP.NET Core:**
- **`Microsoft.AspNetCore.OpenApi`** — built-in OpenAPI document generation (replaces having to add Swashbuckle just for that). Swashbuckle is still around for the UI.
- Built-in support for **hybrid caching** (`Microsoft.Extensions.Caching.Hybrid`) — L1 memory + L2 distributed in one API.
- More AOT-friendly bits.
- Better static files perf.

**EF Core 9:**
- Better JSON support.
- Improved AOT support and precompiled queries.
- `HasIndex` for complex types.

**C# 13:**
- `params` collections (`params ReadOnlySpan<int>`, `params IEnumerable<int>` — no more `params T[]` allocations).
- New `System.Threading.Lock` type — implicit conversion from `lock(myLock)`, faster.
- Implicit indexer in object initializers.
- `field` keyword (preview).

**Microsoft.Extensions.AI** — first GA shape (more on Day 6/7). The unified `IChatClient` abstraction across providers landed here.

## 5.4 .NET 10 (Nov 2025, LTS)

**The big themes**: Native AOT got dramatically better, Microsoft.Extensions.AI is mature, .NET Aspire matured, C# 14 adds long-requested language features.

**Runtime:**
- Improved devirtualization, more aggressive inlining.
- AOT now works for a much larger fraction of ASP.NET Core scenarios.
- ARM64 perf improvements.

**ASP.NET Core:**
- More Minimal API enhancements: validation source generators, better OpenAPI defaults.
- Better Native AOT story for full ASP.NET Core (not just minimal APIs).
- Improvements in `Microsoft.AspNetCore.OpenApi`.

**EF Core 10:**
- More compiled-model and AOT improvements.
- Continued JSON / vector data type work (this matters for AI — see Day 6).

**C# 14:**
- **`field` keyword** stable — write property logic without backing-field boilerplate:
  ```csharp
  public string Name
  {
      get => field;
      set => field = value?.Trim() ?? throw new ArgumentNullException();
  }
  ```
- **Extension members** — extension *properties* and *static* extensions, not just methods.
- **Null-conditional assignment** — `customer?.Name = "x"`.
- Partial constructors and events.

**Microsoft.Extensions.AI**: production-grade, `IChatClient`-based, with `Microsoft.Extensions.AI.Evaluation` (Day 7).

## 5.5 Migration order

If you're on .NET 6 today:

1. **Upgrade to .NET 8 (LTS).** Most of the meaningful runtime/EF/AS.NET improvements you want are here, and it's supported through Nov 2026.
2. Audit dependencies for AOT-readiness (only if you actually want AOT — most apps don't need it).
3. **Then jump to .NET 10 (LTS).** Skipping 9 is fine since 9 is STS.

Key migration steps regardless of target:
- Update `<TargetFramework>net8.0</TargetFramework>` (then `net10.0`).
- Update `Microsoft.AspNetCore.*` and `Microsoft.EntityFrameworkCore.*` to matching majors.
- Run `dotnet outdated` (a tool) or use NuGet's "consolidate" view in the IDE.
- Re-test: serialization, EF queries that used to evaluate client-side, any reflection-heavy code.
- Turn on Nullable, run analyzers, enable `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` for new warnings only.

## 5.6 Stress test yourself

1. What does Dynamic PGO actually do, and why is it free perf?
2. When would you reach for keyed services vs a factory pattern?
3. What's the difference between Output Caching and Response Caching?
4. Why was EF Core's `ExecuteUpdate` a big deal compared to "load, mutate, SaveChanges"?
5. What does .NET 10's Native AOT support unlock, and what does it still break?

## 5.7 Samples

`code-samples/Day5-Deltas/`:

- `01-net8-keyed-di.cs`
- `02-net8-output-cache-ratelimit.cs`
- `03-net8-primary-constructors.cs`
- `04-net9-openapi-builtin.cs`
- `05-net10-field-and-extensions.cs`

---

# Day 6 — AI Foundations in .NET

You said your goal is full knowledge of .NET *plus* AI integration with evaluation. Today is the building side; tomorrow is evaluation.

## 6.1 The three layers of LLM work in .NET

1. **Direct SDK** — Anthropic SDK, official OpenAI SDK (`OpenAI` NuGet), Azure OpenAI SDK. Best when you only target one provider.
2. **`Microsoft.Extensions.AI`** — abstraction layer (`IChatClient`, `IEmbeddingGenerator`) so you can swap providers and stack middleware. **This is the path Microsoft is investing in heavily.**
3. **Semantic Kernel** — higher-level orchestration: planners, plugins, agents, memory. Sits *on top of* `Microsoft.Extensions.AI`.

You want all three in your head. Build day-to-day on `Microsoft.Extensions.AI`; reach for Semantic Kernel when you need agentic orchestration.

## 6.2 The simple shape — calling an LLM

The mental model: send a list of messages, get a message back, maybe with tool calls.

```csharp
using Microsoft.Extensions.AI;
using OpenAI;

IChatClient client = new OpenAIClient(apiKey)
    .GetChatClient("gpt-4o-mini")
    .AsIChatClient();

var response = await client.GetResponseAsync(
    [new ChatMessage(ChatRole.User, "Summarize this in one sentence: ...")]);

Console.WriteLine(response.Text);
```

For Anthropic (Claude) on .NET, use the `Anthropic.SDK` NuGet (`Anthropic.SDK`) or call the REST API via a typed `HttpClient`. As of mid-2026, the `Microsoft.Extensions.AI` ecosystem has third-party `IChatClient` adapters for Anthropic too.

## 6.3 The `Microsoft.Extensions.AI` abstraction

The core interfaces:

- `IChatClient` — chat completion, with `GetResponseAsync` and `GetStreamingResponseAsync`.
- `IEmbeddingGenerator<TInput, TEmbedding>` — typically `IEmbeddingGenerator<string, Embedding<float>>`.

Wrapping clients gives you a **middleware-like pipeline** — logging, telemetry, caching, function-calling, retries:

```csharp
builder.Services.AddChatClient(svc =>
    new OpenAIClient(config["OpenAI:Key"]!).GetChatClient("gpt-4o-mini").AsIChatClient())
    .UseLogging()
    .UseFunctionInvocation()
    .UseOpenTelemetry()
    .UseDistributedCache();
```

Each `Use*` wraps the inner client. Same idea as ASP.NET middleware — composable cross-cutting concerns.

## 6.4 Streaming

You want to stream tokens to the user for any latency-sensitive UX.

```csharp
await foreach (var update in client.GetStreamingResponseAsync(messages, ct: ct))
{
    foreach (var part in update.Contents)
        if (part is TextContent text)
            await response.WriteAsync(text.Text, ct);
}
```

In ASP.NET Core, expose this as a `text/event-stream` (SSE) endpoint or use a WebSocket / SignalR.

## 6.5 Tool / function calling

You give the model a list of tool definitions; it returns "call this tool with these args"; you execute and feed the result back. `Microsoft.Extensions.AI` automates the loop:

```csharp
[Description("Get current weather for a city.")]
static string GetWeather(string city)
    => $"{city}: 18°C, partly cloudy";

var options = new ChatOptions
{
    Tools = [AIFunctionFactory.Create(GetWeather)]
};

var response = await client.GetResponseAsync(
    [new ChatMessage(ChatRole.User, "What's the weather in Helsinki?")],
    options);
```

With `.UseFunctionInvocation()` in the pipeline, the framework auto-executes the function and round-trips back to the model.

## 6.6 Embeddings & RAG

**RAG** (Retrieval-Augmented Generation): when the user asks a question, retrieve relevant chunks from your data, stuff them in the prompt, ask the model.

Pipeline:

1. **Ingest:** chunk documents, embed each chunk, store `(text, embedding, metadata)` in a vector store.
2. **Query time:** embed the user's question, do a vector similarity search, take top K chunks, format them into the prompt.
3. **Generate:** call the LLM with the augmented prompt.

```csharp
IEmbeddingGenerator<string, Embedding<float>> embeddings = ...; // OpenAI or Azure

var docVectors = await embeddings.GenerateAsync(documents.Select(d => d.Text));
// store (doc, vector) in your vector DB

// at query time
var queryVec = (await embeddings.GenerateAsync([question])).First();
var top = vectorStore.SearchTopK(queryVec, k: 5);
var prompt = $"""
    Answer the question using only the context below.

    Context:
    {string.Join("\n---\n", top.Select(t => t.Text))}

    Question: {question}
    """;
var answer = await chatClient.GetResponseAsync([new ChatMessage(ChatRole.User, prompt)]);
```

**Vector stores on .NET (mid-2026):**
- **SQL Server 2025 vector type** (`vector(n)`) + `VECTOR_DISTANCE` — if you're already on SQL Server, simplest path.
- **Postgres + pgvector** — great open option, Npgsql + EF Core 9/10 support.
- **Azure AI Search** — managed, hybrid (vector + keyword) search.
- **Qdrant / Milvus / Weaviate** — dedicated vector DBs, all have .NET clients.
- **In-memory** for prototyping (`Microsoft.SemanticKernel.Memory` has providers).

`Microsoft.Extensions.VectorData` (preview through 9, GA in 10 trajectory) is a vector-store abstraction analogous to `Microsoft.Extensions.AI` — same swap-providers idea.

## 6.7 Semantic Kernel — when to step up

SK gives you:
- **Plugins** — collections of functions (native C# or prompt templates) the kernel knows about.
- **Planners** — let the model figure out which plugin functions to chain.
- **Memory** — out-of-the-box RAG with vector stores.
- **Agents** — multiple specialized "personas" cooperating, with handoff and group chat patterns.

Use SK when:
- You're building an agent or a multi-step workflow over tools.
- You need a memory abstraction without writing your own.

Stick to plain `Microsoft.Extensions.AI` when you're just calling a model with tools — less surface area.

## 6.8 Where ML.NET fits

ML.NET is for **classical ML in C#** — regression, classification, recommendation, anomaly detection. It also hosts ONNX models, so you can run a converted model (BERT, ResNet, even smaller LLMs) locally.

For most "AI in .NET" work today, you'll use LLM APIs and embeddings, not ML.NET. Reach for ML.NET specifically for:
- Tabular ML you want to do in-process (fraud scoring, propensity models).
- Running an ONNX model offline / on-device.

## 6.9 Production concerns

- **Secrets:** use `IConfiguration` + Azure Key Vault or env vars; never check keys in.
- **Rate limiting:** wrap calls. OpenAI/Anthropic return 429s.
- **Token budgets:** count tokens before sending; truncate aggressively. `Microsoft.ML.Tokenizers` ships official tokenizers for GPT-4o etc.
- **Caching:** for deterministic queries, cache responses (key by prompt hash). `UseDistributedCache()` in the pipeline.
- **Observability:** `UseOpenTelemetry()` emits semantic-conventions traces (model, tokens in/out, latency). Wire to your APM.
- **Cost tracking:** log token usage per request; aggregate by user/feature.
- **Streaming + cancellation:** propagate `HttpContext.RequestAborted` into the LLM call; if the user closes the tab, stop generating.
- **PII:** consider client-side redaction before sending. Some providers have specific compliance regions.

## 6.10 Pitfalls

- **Storing chat history forever** — context window costs grow per turn. Summarize old turns, or keep only the last N + a running summary.
- **Naïve RAG retrieval** — pure vector search misses keyword matches. Use hybrid (vector + BM25) when possible.
- **Tool-calling infinite loops** — the model keeps asking for tool calls. Cap iterations (`MaxOutputItems`) and have a fallback.
- **Treating LLMs as deterministic** — they aren't. Tomorrow's lesson exists for a reason.

## 6.11 Stress test yourself

1. Why is `IChatClient` a better starting point than `OpenAIClient` directly?
2. What does `.UseFunctionInvocation()` do, and what would you have to write without it?
3. Sketch a RAG pipeline. Where does each component live in your project?
4. What does Semantic Kernel give you that raw `Microsoft.Extensions.AI` doesn't?
5. Three things you must do before shipping an LLM feature to production.

## 6.12 Samples

`code-samples/Day6-AI/`:

- `01-openai-direct.cs` — raw OpenAI SDK call.
- `02-extensions-ai.cs` — `IChatClient` + pipeline.
- `03-tool-calling.cs` — `AIFunctionFactory` + auto-invocation.
- `04-rag-pipeline.cs` — chunking, embedding, retrieval, generation end-to-end.
- `05-semantic-kernel.cs` — kernel + plugin + planner.

---

# Day 7 — AI Evaluation in .NET

This is what most teams skip and then regret. Models are non-deterministic. If you don't have evals, you have no idea whether your last prompt change made things better or worse.

## 7.1 Why evals

You wouldn't ship a backend refactor without unit tests. **Don't ship LLM features without evals.**

What can change underneath you:
- Model version upgrades (provider-side).
- Your prompt template.
- Your retrieval/embedding pipeline.
- Tool implementations.
- Model temperature.

Any of those can degrade output silently. Evals = automated regression tests for AI behavior.

## 7.2 The three flavors of eval

**1. Code-based metrics.** Deterministic — given an output, compute a number.
- Format checks (is it valid JSON? Does it match the schema?).
- BLEU, ROUGE, exact match, fuzzy match.
- Latency, token counts, cost.
- Retrieval recall@k (did the correct chunk appear in top-K?).

**2. LLM-as-judge.** Use a stronger model to grade.
- Faithfulness — does the answer rely only on provided context (RAG)?
- Relevance — is the answer relevant to the question?
- Coherence, completeness, harmfulness.
- Pairwise preference — given output A and B, which is better?

**3. Human review.** Expensive but irreplaceable for nuanced quality. Used for golden-set creation and periodic spot checks.

You want all three in your toolbox. Code-based for fast feedback in CI; LLM-as-judge for nuanced quality; human review for the truth.

## 7.3 Golden datasets

A **golden set** is a curated list of `(input, expected_output_or_criteria, metadata)` you evaluate against. Build it from:

- Real user queries (anonymized).
- Hand-crafted edge cases.
- Past production bugs ("model used to fail on this").

Versioned in your repo or a data store. Treated like test data — when you make a fix, you add the failing case to the golden set so you don't regress.

Aim for:
- **Coverage** — happy paths + edge cases + known failure modes.
- **Stratification** — by use case, language, complexity.
- **Maintenance** — review quarterly; remove stale cases.

## 7.4 `Microsoft.Extensions.AI.Evaluation`

Microsoft's official library on the `Microsoft.Extensions.AI` stack. Use it to define metrics, run evals, and produce reports.

Conceptual shape:

```csharp
using Microsoft.Extensions.AI;
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
}
```

(API surface evolves between previews; consult the `Microsoft.Extensions.AI.Evaluation` docs in your `.csproj` targeted version. The shape above reflects the GA direction.)

The library has reporting helpers that emit HTML reports you can publish from CI.

## 7.5 Building your own evaluator (the pattern)

When the built-ins don't cover what you need, the pattern is small:

```csharp
public class JsonSchemaEvaluator : IEvaluator
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
}
```

Combine with the built-ins in a `CompositeEvaluator`.

## 7.6 LLM-as-judge done well

Pitfalls of LLM-judges (and how to avoid them):

- **Position bias** — judges prefer the first option in pairwise prompts. Randomize order or evaluate both orders and average.
- **Length bias** — judges prefer longer answers. Tell the judge to ignore length.
- **Self-preference** — a model judging itself rates itself higher. Use a *different*, stronger model as judge.
- **Inconsistency** — temperature noise. Run the judge multiple times and majority-vote, or set temperature low.

Useful judge patterns:
- **Rubric-based** — judge sees a checklist (1. correct? 2. complete? 3. safe?), scores each.
- **Reference-based** — judge sees a reference "good answer" and grades similarity.
- **Pairwise** — judge picks A vs B vs Tie.

## 7.7 RAG-specific metrics

If you're building RAG, evaluate three things separately:

1. **Retrieval quality** — did we get the right chunks?
   - Precision@k, Recall@k against a labeled set.
2. **Groundedness / faithfulness** — does the answer cite only what's in the context?
   - LLM-as-judge or rule-based ("every claim in the answer must overlap with context").
3. **Answer quality** — relevance, completeness, factual correctness.

Optimizing one metric at a time is more sane than chasing a single composite score.

## 7.8 Wiring evals into CI

The mature pattern:

1. **Smoke evals on PR** — a small (20-50 case) golden set. Runs in < 2 minutes. Blocks PR if quality drops > threshold.
2. **Full eval nightly** — the full golden set, posted to Slack / a dashboard.
3. **Production sampling** — log a sample of real production responses, periodically grade them (LLM-judge + human review), feed failures back into the golden set.

```csharp
// xUnit example: a "smoke eval" test
[Fact]
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
}
```

## 7.9 Production monitoring

Logs alone aren't enough. You want:

- **Per-call telemetry** — model, tokens in/out, latency, cost, tool calls, error class. `Microsoft.Extensions.AI.UseOpenTelemetry()` emits this via OTel semantic conventions for GenAI.
- **Sampling for offline grading** — store full prompt + response for 1-5% of traffic for later eval.
- **Live "shadow" evals** — pass real traffic through a stronger judge async; alert if a daily rolling average drops.
- **User feedback signals** — thumbs up/down, copy/abandon, follow-up message rates.

## 7.10 Pitfalls

- **No eval at all.** The worst state. Even 20 hand-graded cases beat zero.
- **Single composite score.** Hides where quality is shifting. Track multiple metrics.
- **Judge model never updated.** When the judge gets dumber than your main model, evals get noisy.
- **Drift in your golden set.** As your product evolves, old cases become irrelevant — prune.
- **Manual eval that never happens.** Anything not in CI rots. Automate or accept it'll lapse.

## 7.11 Stress test yourself

1. Name three eval flavors and one strength of each.
2. What's a golden set, and what makes a good one?
3. What's position bias in LLM-as-judge, and how do you mitigate?
4. For a RAG app, what's the difference between retrieval quality and answer quality, and why must you measure them separately?
5. Sketch a CI strategy with three eval tiers and what each one does.

## 7.12 Samples

`code-samples/Day7-Evaluation/`:

- `01-golden-set.cs` — load + structure a golden set.
- `02-code-metrics.cs` — schema check, latency, retrieval@k.
- `03-llm-judge.cs` — rubric judge with position-bias mitigation.
- `04-extensions-ai-evaluation.cs` — using the official lib.
- `05-ci-smoke-eval.cs` — xUnit-style smoke test for PRs.

---

# Final notes — keeping it stuck

1. **One project end-to-end.** After day 7, build a small RAG app (a chatbot over your old project documentation) with evals. The combination of all 7 days will become muscle memory in a way reading never will.
2. **Read the runtime team's blog.** `https://devblogs.microsoft.com/dotnet/` is the single best source for "what changed and why."
3. **Read source.** `dotnet/runtime` and `dotnet/aspnetcore` on GitHub are unusually readable. When you wonder "what does `AddScoped` *do*?" — go read it. It's 60 lines.
4. **Keep this guide.** Re-read sections when you hit them in real work.

Good luck, Chinthaka. You already have the experience — this is just naming what you know and filling the gaps.
