"use client";

import { useState, useRef } from "react";
import {
  Package,
  BarChart3,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Wrench,
  Sparkles,
  Network,
  Database,
  Search,
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

type TabId = "openai" | "meai" | "toolcalling" | "rag" | "sk";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "openai", label: "OpenAI SDK", Icon: Sparkles },
  { id: "meai", label: "Extensions.AI", Icon: Layers },
  { id: "toolcalling", label: "Tool Calling", Icon: Wrench },
  { id: "rag", label: "RAG", Icon: Database },
  { id: "sk", label: "Semantic Kernel", Icon: Network },
];

export default function DotNetMasteryDay6() {
  const [tab, setTab] = useState<TabId>("openai");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") { const next = (index + 1) % TABS.length; tabRefs.current[next]?.focus(); setTab(TABS[next].id); }
    else if (e.key === "ArrowLeft") { const prev = (index - 1 + TABS.length) % TABS.length; tabRefs.current[prev]?.focus(); setTab(TABS[prev].id); }
  }

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Mastery Guide · Day 6 of 7</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">AI Foundations in .NET</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">OpenAI SDK, Microsoft.Extensions.AI abstractions, tool calling, RAG pipelines, and Semantic Kernel — practical AI integration without the hype.</p>
      </header>

      <div role="tablist" aria-label="Day 6 topics" className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, Icon }, i) => {
          const active = tab === id;
          return (
            <button key={id} id={`tab-d6-${id}`} role="tab" aria-selected={active} aria-controls={`panel-d6-${id}`}
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

      {tab === "openai" && <section id="panel-d6-openai" role="tabpanel" aria-labelledby="tab-d6-openai" className="space-y-6"><OpenAiTab /></section>}
      {tab === "meai" && <section id="panel-d6-meai" role="tabpanel" aria-labelledby="tab-d6-meai" className="space-y-6"><MeAiTab /></section>}
      {tab === "toolcalling" && <section id="panel-d6-toolcalling" role="tabpanel" aria-labelledby="tab-d6-toolcalling" className="space-y-6"><ToolCallingTab /></section>}
      {tab === "rag" && <section id="panel-d6-rag" role="tabpanel" aria-labelledby="tab-d6-rag" className="space-y-6"><RagTab /></section>}
      {tab === "sk" && <section id="panel-d6-sk" role="tabpanel" aria-labelledby="tab-d6-sk" className="space-y-6"><SkTab /></section>}
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1 — OpenAI SDK
// ═══════════════════════════════════════════════════════════════════════════

function OpenAiTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        The official <Code>OpenAI</Code> NuGet package (v2+) is the direct way to call GPT-4o, GPT-4o-mini, and embeddings models. It targets the same OpenAI-compatible API that Azure OpenAI, Ollama, and others implement.
      </p>
      <OpenAiSetup />
      <OpenAiStreaming />
      <OpenAiEmbeddings />
    </>
  );
}

function OpenAiSetup() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        Setup &amp; basic chat completion
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// dotnet add package OpenAI"}</div>
        <div className="text-slate-300">{"using OpenAI.Chat;"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Register in DI (Program.cs)"}</div>
        <div className="text-slate-300">{"builder.Services.AddSingleton(new ChatClient("}</div>
        <div className="pl-4 text-amber-300">{"    model: \"gpt-4o-mini\","}</div>
        <div className="pl-4 text-slate-300">{"    apiKey: builder.Configuration[\"OpenAI:ApiKey\"]));"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// In a handler"}</div>
        <div className="text-emerald-400">{"var response = await chatClient.CompleteChatAsync("}</div>
        <div className="pl-4 text-slate-300">{"["}</div>
        <div className="pl-8 text-slate-300">{"new SystemChatMessage(\"You are a helpful .NET assistant.\"),"}</div>
        <div className="pl-8 text-slate-300">{"new UserChatMessage(userQuery),"}</div>
        <div className="pl-4 text-slate-300">{"],"}</div>
        <div className="pl-4 text-slate-300">{"new ChatCompletionOptions { MaxOutputTokenCount = 500 });"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-300">{"Console.WriteLine(response.Value.Content[0].Text);"}</div>
      </div>
      <Callout tone="blue" icon={BarChart3} title="Azure OpenAI — same SDK">
        Replace <Code>new ChatClient(model, apiKey)</Code> with an <Code>AzureOpenAIClient</Code> from the <Code>Azure.AI.OpenAI</Code> package. The ChatClient interface is identical — no application code changes.
      </Callout>
    </div>
  );
}

function OpenAiStreaming() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Zap className="h-4 w-4" aria-hidden />
        Streaming responses — token by token
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Streaming via <Code>CompleteChatStreamingAsync</Code> returns an <Code>IAsyncEnumerable</Code> of token chunks. Wire it directly to an SSE endpoint so the browser renders text as it arrives.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// ASP.NET Core SSE endpoint"}</div>
        <div className="text-emerald-400">{"app.MapGet(\"/chat\", async (string query, ChatClient client, HttpResponse http) =>"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"http.Headers.ContentType = \"text/event-stream\";"}</div>
        <div className="pl-4 text-emerald-400">{"await foreach (var update in client.CompleteChatStreamingAsync(["}</div>
        <div className="pl-8 text-slate-300">{"new UserChatMessage(query)]))"}</div>
        <div className="pl-4 text-slate-300">{"{"}</div>
        <div className="pl-8 text-emerald-400">{"foreach (var part in update.ContentUpdate)"}</div>
        <div className="pl-8 text-slate-300">{"{"}</div>
        <div className="pl-12 text-slate-300">{"await http.WriteAsync($\"data: {part.Text}\\n\\n\");"}</div>
        <div className="pl-12 text-emerald-400">{"await http.Body.FlushAsync();"}</div>
        <div className="pl-8 text-slate-300">{"}"}</div>
        <div className="pl-4 text-slate-300">{"}"}</div>
        <div className="text-slate-300">{"});"}</div>
      </div>
    </div>
  );
}

function OpenAiEmbeddings() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Database className="h-4 w-4" aria-hidden />
        Embeddings — turning text into vectors
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Embeddings are dense float vectors that capture semantic meaning. Similar texts produce similar vectors. They are the foundation of semantic search, RAG, and clustering.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-300">{"using OpenAI.Embeddings;"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-300">{"var embClient = new EmbeddingClient(\"text-embedding-3-small\", apiKey);"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Generate embedding for a document chunk"}</div>
        <div className="text-emerald-400">{"var result = await embClient.GenerateEmbeddingAsync(chunkText);"}</div>
        <div className="text-slate-300">{"float[] vector = result.Value.ToFloats().ToArray(); // 1536 floats"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Cosine similarity (higher = more semantically similar)"}</div>
        <div className="text-emerald-400">{"static float CosineSim(float[] a, float[] b)"}</div>
        <div className="text-slate-300">{"    => a.Zip(b, (x, y) => x * y).Sum()"}</div>
        <div className="text-slate-300">{"    / (MathF.Sqrt(a.Sum(x => x * x)) * MathF.Sqrt(b.Sum(y => y * y)));"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2 — Microsoft.Extensions.AI
// ═══════════════════════════════════════════════════════════════════════════

function MeAiTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        <Code>Microsoft.Extensions.AI</Code> provides provider-agnostic abstractions — <Code>IChatClient</Code> and <Code>IEmbeddingGenerator&lt;string, Embedding&lt;float&gt;&gt;</Code>. Write once, swap providers (OpenAI, Azure, Ollama, Anthropic) without changing application code.
      </p>
      <MeAiAbstractions />
      <MeAiMiddleware />
    </>
  );
}

function MeAiAbstractions() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Layers className="h-4 w-4" aria-hidden />
        IChatClient — provider-agnostic chat
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// dotnet add package Microsoft.Extensions.AI.OpenAI"}</div>
        <div className="text-slate-500">{"// Register — swap this line to change provider"}</div>
        <div className="text-slate-300">{"builder.Services.AddChatClient("}</div>
        <div className="pl-4 text-slate-300">{"new OpenAIClient(apiKey).AsChatClient(\"gpt-4o-mini\"));"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Ollama (local): same interface, different registration"}</div>
        <div className="text-slate-500">{"// new OllamaApiClient(\"http://localhost:11434\").AsChatClient(\"llama3\")"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// In your service — inject IChatClient, not OpenAIClient"}</div>
        <div className="text-emerald-400">{"public class SummaryService(IChatClient chat)"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"    public async Task<string> SummarizeAsync(string text)"}</div>
        <div className="pl-4 text-slate-300">{"    {"}</div>
        <div className="pl-8 text-slate-300">{"        var response = await chat.GetResponseAsync("}</div>
        <div className="pl-12 text-amber-300">{"            $\"Summarize in 3 bullets: {text}\");"}</div>
        <div className="pl-8 text-slate-300">{"        return response.Text;"}</div>
        <div className="pl-4 text-slate-300">{"    }"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
      <Callout tone="emerald" icon={CheckCircle2} title="Testability">
        Because your services depend on <Code>IChatClient</Code>, you can mock it in tests without HTTP calls. <Code>Microsoft.Extensions.AI.Testing</Code> provides a <Code>FakeChatClient</Code> that returns preset responses.
      </Callout>
    </div>
  );
}

function MeAiMiddleware() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Middleware pipeline — caching, logging, retry
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <Code>IChatClient</Code> supports a builder-style middleware pipeline similar to ASP.NET Core. Stack caching, logging, and retry without touching your application code.
      </p>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-300">{"builder.Services.AddChatClient(inner =>"}</div>
        <div className="pl-4 text-emerald-400">{"    inner"}</div>
        <div className="pl-8 text-slate-500">{"// 1. Distributed cache — identical prompts return cached response"}</div>
        <div className="pl-8 text-slate-300">{".UseDistributedCache()"}</div>
        <div className="pl-8 text-slate-500">{"// 2. OpenTelemetry tracing for every call"}</div>
        <div className="pl-8 text-slate-300">{".UseOpenTelemetry()"}</div>
        <div className="pl-8 text-slate-500">{"// 3. Structured logging"}</div>
        <div className="pl-8 text-slate-300">{".UseLogging()"}</div>
        <div className="pl-8 text-slate-500">{"// 4. The actual provider"}</div>
        <div className="pl-8 text-slate-300">{".Use(new OpenAIClient(apiKey).AsChatClient(\"gpt-4o-mini\")));"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3 — Tool Calling
// ═══════════════════════════════════════════════════════════════════════════

function ToolCallingTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Tool calling (function calling) lets the model request execution of a C# method. You provide the schema, the model decides when to call it, you execute it, and you send the result back. This is how agents act on the world.
      </p>
      <ToolCallingFlow />
      <ToolCallingCode />
    </>
  );
}

function ToolCallingFlow() {
  const steps = [
    { n: "1", label: "Define tools", desc: "Describe each tool as a JSON schema (name, description, parameters). Send with the chat request.", accent: "violet" },
    { n: "2", label: "Model responds with tool call", desc: "Instead of a text answer, the model returns a ToolCallUpdate with the function name and JSON arguments.", accent: "blue" },
    { n: "3", label: "Execute the function", desc: "Your code receives the arguments, executes the real function (DB query, API call, computation), gets the result.", accent: "emerald" },
    { n: "4", label: "Send result back", desc: "Add a ToolChatMessage with the result to the conversation history. The model uses it to compose the final answer.", accent: "amber" },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Tool calling loop — 4 steps
      </h3>
      <div className="space-y-3">
        {steps.map(({ n, label, desc, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={n} className="flex gap-3 items-start">
              <span className={cn("inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5", a.chipBg, a.text)}>{n}</span>
              <div className="flex-1 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 p-3 space-y-0.5">
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

function ToolCallingCode() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Package className="h-4 w-4" aria-hidden />
        Tool calling with Microsoft.Extensions.AI
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// 1. Define the tool as a C# method with XML docs"}</div>
        <div className="text-emerald-400">{"[Description(\"Get the current price of a product by its SKU.\")]"}</div>
        <div className="text-emerald-400">{"static async Task<decimal> GetPrice("}</div>
        <div className="pl-4 text-emerald-400">{"    [Description(\"The product SKU\")] string sku,"}</div>
        <div className="pl-4 text-emerald-400">{"    PricingService svc)"}</div>
        <div className="pl-4 text-emerald-400">{"    => await svc.GetPriceAsync(sku);"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// 2. Register tool via AIFunction.Create (auto-generates JSON schema)"}</div>
        <div className="text-slate-300">{"var tools = new[] { AIFunction.Create(GetPrice) };"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// 3. Chat with tools enabled — Extensions.AI handles the loop"}</div>
        <div className="text-emerald-400">{"var response = await chatClient.GetResponseAsync("}</div>
        <div className="pl-4 text-slate-300">{"messages,"}</div>
        <div className="pl-4 text-slate-300">{"new ChatOptions { Tools = tools, ToolMode = ChatToolMode.Auto });"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-300">{"Console.WriteLine(response.Text); // Final answer using tool results"}</div>
      </div>
      <Callout tone="amber" icon={AlertTriangle} title="Security: validate tool arguments">
        The model generates the arguments — treat them as untrusted user input. Validate, sanitize, and scope permissions before executing any tool. Never give a tool access to DELETE endpoints without confirmation.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4 — RAG
// ═══════════════════════════════════════════════════════════════════════════

function RagTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Retrieval-Augmented Generation (RAG) grounds LLM answers in your actual data — documents, databases, knowledge bases — rather than training cutoff knowledge. It is the correct answer to 90% of &ldquo;how do I add AI to our product?&rdquo; questions.
      </p>
      <RagArchitecture />
      <RagImplementation />
    </>
  );
}

function RagArchitecture() {
  const phases = [
    {
      label: "Indexing phase (offline)", accent: "blue", steps: [
        "Split documents into chunks (e.g. 512 tokens, 50 token overlap)",
        "Generate embedding vector for each chunk via embeddings model",
        "Store chunk text + vector in a vector database (pgvector, Azure AI Search, Qdrant)",
      ]
    },
    {
      label: "Query phase (online, per request)", accent: "emerald", steps: [
        "Embed the user's question into a vector",
        "Vector-search the DB for top-K most similar chunks (cosine similarity)",
        "Inject retrieved chunks as context into the system prompt",
        "LLM answers using the injected context — cites sources, stays grounded",
      ]
    },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Search className="h-4 w-4" aria-hidden />
        RAG architecture — two phases
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {phases.map(({ label, accent, steps }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-3", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>{label}</p>
              <ol className="space-y-2">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className={cn("font-bold shrink-0", a.text)}>{i + 1}.</span>{s}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RagImplementation() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Database className="h-4 w-4" aria-hidden />
        Minimal RAG with pgvector
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// EF Core entity — pgvector extension"}</div>
        <div className="text-emerald-400">{"public class DocumentChunk"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"public int Id { get; set; }"}</div>
        <div className="pl-4 text-slate-300">{"public string Text { get; set; } = \"\";"}</div>
        <div className="pl-4 text-slate-300">{"public Vector Embedding { get; set; } = default!; // Pgvector.EntityFrameworkCore"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Query: embed the question, find top-5 similar chunks"}</div>
        <div className="text-emerald-400">{"var qEmbedding = await embClient.GenerateEmbeddingAsync(question);"}</div>
        <div className="text-slate-300">{"var qVector = new Vector(qEmbedding.Value.ToFloats().ToArray());"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-emerald-400">{"var chunks = await db.DocumentChunks"}</div>
        <div className="pl-4 text-slate-300">{".OrderBy(c => c.Embedding.CosineDistance(qVector))"}</div>
        <div className="pl-4 text-slate-300">{".Take(5)"}</div>
        <div className="pl-4 text-slate-300">{".Select(c => c.Text)"}</div>
        <div className="pl-4 text-slate-300">{".ToListAsync();"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Build grounded prompt"}</div>
        <div className="text-slate-300">{"var context = string.Join(\"\\n\\n\", chunks);"}</div>
        <div className="text-emerald-400">{"var answer = await chatClient.GetResponseAsync("}</div>
        <div className="pl-4 text-slate-300">{"["}</div>
        <div className="pl-8 text-slate-300">{"new SystemChatMessage($\"Answer using ONLY this context:\\n{context}\"),"}</div>
        <div className="pl-8 text-slate-300">{"new UserChatMessage(question)"}</div>
        <div className="pl-4 text-slate-300">{"]);"}</div>
      </div>
      <Callout tone="emerald" icon={CheckCircle2} title="Vector store options">
        pgvector (PostgreSQL extension) is the lowest-friction option — same DB, same migrations, SQL joins. For large scale, Azure AI Search, Qdrant, or Weaviate offer dedicated ANN indexes. Semantic Kernel and Extensions.AI both abstract the store behind a common interface.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5 — Semantic Kernel
// ═══════════════════════════════════════════════════════════════════════════

function SkTab() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Semantic Kernel is Microsoft&apos;s orchestration SDK for building AI agents. It wraps LLM calls, tool calling, memory, and planning into a composable framework built on top of the same <Code>IChatClient</Code> abstractions.
      </p>
      <SkConcepts />
      <SkPlugins />
      <SkAccordion open={open} setOpen={setOpen} />
    </>
  );
}

function SkConcepts() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Network className="h-4 w-4" aria-hidden />
        Core concepts
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Kernel", accent: "violet", desc: "The central object. Holds DI services, registered plugins, and AI services. Pass it wherever orchestration happens." },
          { label: "Plugin", accent: "blue", desc: "A class with [KernelFunction] methods. Functions have names, descriptions, and parameter descriptions — auto-exported as tool schemas to the LLM." },
          { label: "Prompt template", accent: "emerald", desc: "YAML or string templates with Handlebars-style {{$variable}} placeholders. SK compiles them to chat messages with type-safe argument passing." },
          { label: "Planner / Agent", accent: "amber", desc: "Higher-level orchestration — the model decides which plugins to call in what order to achieve a goal. OpenAI Assistant API or custom agentic loops." },
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

function SkPlugins() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Defining a plugin and invoking it
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// dotnet add package Microsoft.SemanticKernel"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Plugin class"}</div>
        <div className="text-emerald-400">{"public class OrderPlugin(AppDbContext db)"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-emerald-400">{"    [KernelFunction, Description(\"Get order status by order ID\")]"}</div>
        <div className="pl-4 text-emerald-400">{"    public async Task<string> GetOrderStatusAsync("}</div>
        <div className="pl-8 text-emerald-400">{"        [Description(\"The order ID\")] int orderId)"}</div>
        <div className="pl-4 text-slate-300">{"    {"}</div>
        <div className="pl-8 text-slate-300">{"        var order = await db.Orders.FindAsync(orderId);"}</div>
        <div className="pl-8 text-slate-300">{"        return order?.Status ?? \"not found\";"}</div>
        <div className="pl-4 text-slate-300">{"    }"}</div>
        <div className="text-slate-300">{"}"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Kernel setup"}</div>
        <div className="text-slate-300">{"var kernel = Kernel.CreateBuilder()"}</div>
        <div className="pl-4 text-slate-300">{".AddOpenAIChatCompletion(\"gpt-4o-mini\", apiKey)"}</div>
        <div className="pl-4 text-slate-300">{".Build();"}</div>
        <div className="text-slate-300">{"kernel.Plugins.AddFromObject(new OrderPlugin(db), \"Orders\");"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Auto-invoke — SK calls plugins as needed"}</div>
        <div className="text-slate-300">{"var settings = new OpenAIPromptExecutionSettings { ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions };"}</div>
        <div className="text-emerald-400">{"var result = await kernel.InvokePromptAsync("}</div>
        <div className="pl-4 text-amber-300">{"    \"What is the status of order 42?\","}</div>
        <div className="pl-4 text-slate-300">{"    new KernelArguments(settings));"}</div>
      </div>
    </div>
  );
}

function SkAccordion({ open, setOpen }: { open: string | null; setOpen: (v: string | null) => void }) {
  const items = [
    {
      id: "when",
      title: "When to use Semantic Kernel vs raw Extensions.AI",
      accent: "amber",
      content: (
        <div className="space-y-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Use case</th>
                <th className="text-left py-2 font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                ["Simple summarization / classification", "Raw IChatClient — no orchestration needed"],
                ["One LLM call with tools", "Extensions.AI with AIFunction.Create"],
                ["Multi-step agent with memory", "Semantic Kernel — planner + memory store"],
                ["RAG with structured retrieval", "Extensions.AI + your own vector store query"],
                ["Complex workflows, step sequencing", "Semantic Kernel Processes (new in v1.20+)"],
              ].map(([use, rec]) => (
                <tr key={use}>
                  <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{use}</td>
                  <td className="py-2 text-emerald-700 dark:text-emerald-400 font-medium">{rec}</td>
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
            <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`sk-panel-${id}`}
              className={cn("w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left transition-all", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500", isOpen ? cn(a.bg) : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50")}>
              <span className={cn("text-sm font-bold", a.text)}>{title}</span>
              <ArrowRight className={cn("h-4 w-4 shrink-0 transition-transform", a.text, isOpen ? "rotate-90" : "rotate-0")} aria-hidden />
            </button>
            {isOpen && <div id={`sk-panel-${id}`} className="px-4 pb-4 pt-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">{content}</div>}
          </div>
        );
      })}
    </div>
  );
}
