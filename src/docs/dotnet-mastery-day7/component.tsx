"use client";

import { useState, useRef } from "react";
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  GitBranch,
  Database,
  ListChecks,
  Scale,
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

type TabId = "golden" | "metrics" | "judge" | "meaeval" | "ci";

const TABS: { id: TabId; label: string; Icon: React.ElementType }[] = [
  { id: "golden", label: "Golden Sets", Icon: Database },
  { id: "metrics", label: "Code Metrics", Icon: BarChart3 },
  { id: "judge", label: "LLM-as-Judge", Icon: Scale },
  { id: "meaeval", label: "Extensions.AI.Eval", Icon: ListChecks },
  { id: "ci", label: "CI Strategy", Icon: GitBranch },
];

export default function DotNetMasteryDay7() {
  const [tab, setTab] = useState<TabId>("golden");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight") { const next = (index + 1) % TABS.length; tabRefs.current[next]?.focus(); setTab(TABS[next].id); }
    else if (e.key === "ArrowLeft") { const prev = (index - 1 + TABS.length) % TABS.length; tabRefs.current[prev]?.focus(); setTab(TABS[prev].id); }
  }

  return (
    <article className="px-5 py-6 sm:px-7 sm:py-8">
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">Mastery Guide · Day 7 of 7</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">AI Evaluation</h2>
        <p className="text-base text-slate-600 dark:text-slate-400">Golden dataset design, deterministic code metrics, LLM-as-judge with bias mitigation, Microsoft.Extensions.AI.Evaluation, and a 3-tier CI strategy.</p>
      </header>

      <div role="tablist" aria-label="Day 7 topics" className="flex flex-wrap gap-2 mb-6">
        {TABS.map(({ id, label, Icon }, i) => {
          const active = tab === id;
          return (
            <button key={id} id={`tab-d7-${id}`} role="tab" aria-selected={active} aria-controls={`panel-d7-${id}`}
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

      {tab === "golden" && <section id="panel-d7-golden" role="tabpanel" aria-labelledby="tab-d7-golden" className="space-y-6"><GoldenTab /></section>}
      {tab === "metrics" && <section id="panel-d7-metrics" role="tabpanel" aria-labelledby="tab-d7-metrics" className="space-y-6"><MetricsTab /></section>}
      {tab === "judge" && <section id="panel-d7-judge" role="tabpanel" aria-labelledby="tab-d7-judge" className="space-y-6"><JudgeTab /></section>}
      {tab === "meaeval" && <section id="panel-d7-meaeval" role="tabpanel" aria-labelledby="tab-d7-meaeval" className="space-y-6"><MeaEvalTab /></section>}
      {tab === "ci" && <section id="panel-d7-ci" role="tabpanel" aria-labelledby="tab-d7-ci" className="space-y-6"><CiTab /></section>}
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1 — Golden Sets
// ═══════════════════════════════════════════════════════════════════════════

function GoldenTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        A golden dataset is a curated set of (input, expected output, evaluation criteria) triples. It is the ground truth for your AI system — without it, &ldquo;does the AI work?&rdquo; is unanswerable.
      </p>
      <GoldenDesign />
      <GoldenSchema />
    </>
  );
}

function GoldenDesign() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Database className="h-4 w-4" aria-hidden />
        Designing a representative golden set
      </h3>
      <div className="space-y-3">
        {[
          { label: "Cover your taxonomy of inputs", accent: "violet", desc: "Group user intents into categories (factual lookup, summarization, comparison, edge case). Sample proportionally — don't over-index on easy cases." },
          { label: "Include adversarial examples", accent: "rose", desc: "Ambiguous questions, context-free questions, inputs that should produce refusals, inputs with deliberate typos. These expose failure modes before production does." },
          { label: "Add regression cases from production", accent: "blue", desc: "Every time a user reports a bad answer, add that input + the expected good answer to the golden set. Prevents the same regression forever." },
          { label: "Human-label expected answers", accent: "emerald", desc: "Domain experts label the ideal answer (or rubric) for each case. AI-generated labels create circular evaluation — don't let the model grade its own homework." },
          { label: "Version and diff the dataset", accent: "amber", desc: "Store the golden set in version control (JSON/YAML/CSV). Review additions in PRs. Track coverage metrics — questions × categories × difficulty." },
        ].map(({ label, accent, desc }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-1", a.border)}>
              <p className={cn("text-xs font-bold", a.text)}>✓ {label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GoldenSchema() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Golden case schema in C#
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-emerald-400">{"public record GoldenCase("}</div>
        <div className="pl-4 text-slate-300">{"string Id,                    // unique, stable across dataset versions"}</div>
        <div className="pl-4 text-slate-300">{"string Category,              // e.g. \"product-lookup\", \"refusal\""}</div>
        <div className="pl-4 text-slate-300">{"string Difficulty,            // \"easy\" | \"medium\" | \"hard\""}</div>
        <div className="pl-4 text-slate-300">{"string Input,                 // the user message or prompt"}</div>
        <div className="pl-4 text-slate-300">{"string[] RequiredPhrases,       // must appear in output (case-insensitive)"}</div>
        <div className="pl-4 text-slate-300">{"string[] ForbiddenPhrases,    // must NOT appear (hallucination markers)"}</div>
        <div className="pl-4 text-slate-300">{"string? IdealAnswer,          // optional — for similarity comparison"}</div>
        <div className="pl-4 text-slate-300">{"string[] EvaluationRubric     // bullet criteria for LLM-judge"}</div>
        <div className="text-emerald-400">{");"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-500">{"// Load from JSON file in tests"}</div>
        <div className="text-emerald-400">{"var cases = JsonSerializer.Deserialize<GoldenCase[]>("}</div>
        <div className="pl-4 text-slate-300">{"File.ReadAllText(\"golden-set.json\"))!;"}</div>
      </div>
      <Callout tone="emerald" icon={CheckCircle2} title="Start small">
        50 well-designed golden cases beat 500 auto-generated ones. Start with the 10 most important user intents × 5 difficulty variants. Grow as you find real failure cases in production.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2 — Code Metrics
// ═══════════════════════════════════════════════════════════════════════════

function MetricsTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        Deterministic metrics run instantly, cost nothing, and catch obvious failures. Always run them first — only escalate to LLM-based evaluation for cases that pass deterministic checks.
      </p>
      <DeterministicMetrics />
      <SimilarityMetrics />
    </>
  );
}

function DeterministicMetrics() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <ListChecks className="h-4 w-4" aria-hidden />
        Deterministic checks — fast, free, reliable
      </h3>
      <div className="space-y-3">
        {[
          { label: "Required phrase presence", accent: "emerald", desc: "Assert that specific product names, policy numbers, or factual strings appear in the output. Zero false negatives for factual grounding.", code: ["foreach (var phrase in golden.RequiredPhrases)", "    Assert.Contains(phrase, response, StringComparison.OrdinalIgnoreCase);"] },
          { label: "Forbidden phrase absence", accent: "rose", desc: "Catch hallucinations by checking that invented terms, competitor names, or deprecated policy versions are absent.", code: ["foreach (var phrase in golden.ForbiddenPhrases)", "    Assert.DoesNotContain(phrase, response, StringComparison.OrdinalIgnoreCase);"] },
          { label: "Structural validity", accent: "blue", desc: "If the output should be JSON, assert it parses. If it should have 3 bullet points, assert the count. Structure failures are cheap to catch deterministically.", code: ["var doc = JsonDocument.Parse(response); // throws if invalid", "var bullets = response.Split('\\n').Count(l => l.TrimStart().StartsWith(\"-\"));", "Assert.Equal(3, bullets);"] },
          { label: "Latency & token budget", accent: "amber", desc: "Assert P95 latency and output token count. Regressions in speed or verbosity often signal prompt drift or model degradation.", code: ["Assert.True(elapsed.TotalSeconds < 5, $\"Too slow: {elapsed}\");", "Assert.True(tokenCount < 500, $\"Too verbose: {tokenCount} tokens\");"] },
        ].map(({ label, accent, desc, code }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
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

function SimilarityMetrics() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <BarChart3 className="h-4 w-4" aria-hidden />
        Lightweight similarity metrics
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "Cosine similarity (embedding-based)", accent: "blue", desc: "Embed both the actual and ideal answer. Cosine distance > 0.85 → semantically equivalent. Fast, but misses factual errors in similar-sounding answers." },
          { label: "ROUGE-L (longest common subsequence)", accent: "violet", desc: "Classic NLP metric. Measures recall of reference phrases in the generated output. Good for summarization tasks where coverage matters." },
          { label: "Exact match (EM)", accent: "emerald", desc: "After normalization (lowercase, strip punctuation), check for exact match. High precision, low recall — useful for closed-domain factual lookups." },
          { label: "Token F1", accent: "amber", desc: "Precision and recall at the token level between actual and ideal. Useful for QA tasks where the answer is a short span." },
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
      <Callout tone="amber" icon={AlertTriangle} title="No single metric is sufficient">
        ROUGE misses factual errors. Cosine similarity misses hallucinated details. Token F1 misses structure failures. Always combine 2–3 metrics with different error profiles. LLM-as-judge covers the rest.
      </Callout>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3 — LLM-as-Judge
// ═══════════════════════════════════════════════════════════════════════════

function JudgeTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        LLM-as-judge uses a strong model (GPT-4o, Claude) to evaluate outputs against a rubric. It correlates well with human judgment for nuanced criteria — but it has systematic biases you must mitigate.
      </p>
      <JudgeBiases />
      <JudgePrompt />
    </>
  );
}

function JudgeBiases() {
  return (
    <div className="rounded-xl border-2 border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
        <AlertTriangle className="h-4 w-4" aria-hidden />
        Known biases — and how to mitigate them
      </h3>
      <div className="space-y-3">
        {[
          { bias: "Position bias", mitigation: "The model favors answers listed first. Run each evaluation twice with A/B order swapped. Only count cases where the winner is consistent across both orderings.", accent: "rose" },
          { bias: "Verbosity bias", mitigation: "Longer, more detailed answers are rated higher even when wrong. Add an explicit rubric item: 'Penalize unnecessary length. Conciseness is a virtue.' Include token count in the prompt.", accent: "amber" },
          { bias: "Self-preference bias", mitigation: "GPT-4o judges tend to favor GPT-4o outputs. Use a different model family as judge than the one generating answers (e.g. Claude as judge for GPT outputs).", accent: "violet" },
          { bias: "Sycophancy", mitigation: "If you tell the judge 'the expected answer is X', it will rate answers closer to X higher. Provide the rubric, not the expected answer, in the evaluation prompt.", accent: "blue" },
        ].map(({ bias, mitigation, accent }) => {
          const a = accentMap[accent];
          return (
            <div key={bias} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-2", a.border)}>
              <p className={cn("text-xs font-bold uppercase tracking-wide", a.text)}>⚠ {bias}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{mitigation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JudgePrompt() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <Scale className="h-4 w-4" aria-hidden />
        Structured judge prompt — returning structured scores
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// Judge prompt template — returns JSON score"}</div>
        <div className="text-emerald-400">{"const string judgeSystemPrompt = \"\"\""}</div>
        <div className="pl-4 text-amber-300">{"You are an impartial evaluator. Score the ANSWER against each CRITERION."}</div>
        <div className="pl-4 text-amber-300">{"Return ONLY valid JSON in this exact shape:"}</div>
        <div className="pl-4 text-amber-300">{"{\"scores\": [{\"criterion\": \"...\", \"score\": 0-5, \"reason\": \"...\"}],"}</div>
        <div className="pl-4 text-amber-300">{" \"overall\": 0-5, \"summary\": \"one sentence\"}"}</div>
        <div className="pl-4 text-amber-300">{"Do not add commentary outside the JSON."}</div>
        <div className="text-emerald-400">{"\"\"\";"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-emerald-400">{"var userPrompt = $\"\"\""}</div>
        <div className="pl-4 text-amber-300">{"QUESTION: {golden.Input}"}</div>
        <div className="pl-4 text-amber-300">{"ANSWER: {actualResponse}"}</div>
        <div className="pl-4 text-amber-300">{"CRITERIA:"}</div>
        <div className="pl-4 text-amber-300">{"{string.Join(\"\\n\", golden.EvaluationRubric.Select((r, i) => $\"{i+1}. {r}\"))}"}</div>
        <div className="text-emerald-400">{"\"\"\";"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-slate-300">{"var judgeResponse = await judgeClient.GetResponseAsync("}</div>
        <div className="pl-4 text-slate-300">{"[new SystemChatMessage(judgeSystemPrompt),"}</div>
        <div className="pl-4 text-slate-300">{" new UserChatMessage(userPrompt)]);"}</div>
        <div className="text-slate-300">{"var result = JsonSerializer.Deserialize<JudgeResult>(judgeResponse.Text)!;"}</div>
        <div className="text-emerald-400">{"Assert.True(result.Overall >= 4, $\"Judge score too low: {result.Summary}\");"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 4 — Microsoft.Extensions.AI.Evaluation
// ═══════════════════════════════════════════════════════════════════════════

function MeaEvalTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        <Code>Microsoft.Extensions.AI.Evaluation</Code> (GA in .NET 10, preview in .NET 8/9) provides built-in evaluators for coherence, groundedness, relevance, and fluency — pluggable into your test suite.
      </p>
      <MeaEvalBuiltIn />
      <MeaEvalCustom />
    </>
  );
}

function MeaEvalBuiltIn() {
  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <ListChecks className="h-4 w-4" aria-hidden />
        Built-in evaluators
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: "CoherenceEvaluator", accent: "violet", desc: "Scores whether the response is logically consistent, well-structured, and self-coherent (1–5). Uses LLM judgment." },
          { label: "GroundednessEvaluator", accent: "emerald", desc: "Checks that every claim in the response is supported by the provided context. Critical for RAG — detects hallucinations." },
          { label: "RelevanceEvaluator", accent: "blue", desc: "Measures how well the response addresses the actual question. High relevance = on-topic. Low = the model wandered." },
          { label: "FluencyEvaluator", accent: "amber", desc: "Assesses grammatical quality and natural language fluency. Useful when outputs have been translated or post-processed." },
        ].map(({ label, accent, desc }) => {
          const a = accentMap[accent];
          return (
            <div key={label} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-1", a.border)}>
              <p className={cn("font-mono text-xs font-bold", a.text)}>{label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"// dotnet add package Microsoft.Extensions.AI.Evaluation.Quality"}</div>
        <div className="text-emerald-400">{"var pipeline = new EvaluationPipeline("}</div>
        <div className="pl-4 text-slate-300">{"new CoherenceEvaluator(judgeClient),"}</div>
        <div className="pl-4 text-slate-300">{"new GroundednessEvaluator(judgeClient),"}</div>
        <div className="pl-4 text-slate-300">{"new RelevanceEvaluator(judgeClient));"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-emerald-400">{"var results = await pipeline.EvaluateAsync("}</div>
        <div className="pl-4 text-slate-300">{"request: new ChatMessage(ChatRole.User, question),"}</div>
        <div className="pl-4 text-slate-300">{"response: new ChatMessage(ChatRole.Assistant, actualAnswer),"}</div>
        <div className="pl-4 text-slate-300">{"context: new EvaluationContext { AdditionalContext = retrievedChunks });"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-emerald-400">{"foreach (var r in results.Metrics)"}</div>
        <div className="text-slate-300">{"    Assert.True(r.Score >= 4, $\"{r.Name}: {r.Score}/5 — {r.Reason}\");"}</div>
      </div>
    </div>
  );
}

function MeaEvalCustom() {
  return (
    <div className="rounded-xl border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300">
        <Wrench className="h-4 w-4" aria-hidden />
        Custom evaluator — implement IEvaluator
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-emerald-400">{"public class CitationAccuracyEvaluator : IEvaluator"}</div>
        <div className="text-slate-300">{"{"}</div>
        <div className="pl-4 text-slate-300">{"public string Name => \"CitationAccuracy\";"}</div>
        <div className="pl-4 text-slate-400">{""}</div>
        <div className="pl-4 text-emerald-400">{"public Task<EvaluationResult> EvaluateAsync("}</div>
        <div className="pl-8 text-emerald-400">{"ChatMessage request, ChatMessage response,"}</div>
        <div className="pl-8 text-emerald-400">{"EvaluationContext ctx, CancellationToken ct)"}</div>
        <div className="pl-4 text-slate-300">{"{"}</div>
        <div className="pl-8 text-slate-500">{"// Check every [Source: X] tag maps to a real retrieved chunk"}</div>
        <div className="pl-8 text-slate-300">{"var cited = ExtractCitations(response.Text);"}</div>
        <div className="pl-8 text-slate-300">{"var valid = cited.All(c => ctx.AdditionalContext.Contains(c));"}</div>
        <div className="pl-8 text-slate-300">{"return Task.FromResult(new EvaluationResult"}</div>
        <div className="pl-8 text-slate-300">{"{"}</div>
        <div className="pl-12 text-slate-300">{"Metrics = [new() { Name = Name, Score = valid ? 5 : 1,"}</div>
        <div className="pl-16 text-slate-300">{"Reason = valid ? \"All citations valid\" : \"Invalid citation found\" }]"}</div>
        <div className="pl-8 text-slate-300">{"});"}</div>
        <div className="pl-4 text-slate-300">{"}"}</div>
        <div className="text-slate-300">{"}"}</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 5 — CI Strategy
// ═══════════════════════════════════════════════════════════════════════════

function CiTab() {
  return (
    <>
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
        AI evaluation in CI needs a 3-tier approach: fast deterministic checks on every commit, medium-weight LLM evaluations on every PR, and full golden-set regression on releases.
      </p>
      <CiTiers />
      <CiGitHubActions />
    </>
  );
}

function CiTiers() {
  const tiers = [
    {
      tier: "Tier 1", label: "Every commit", accent: "emerald",
      when: "Runs on every push — under 60 seconds",
      what: ["Deterministic checks (required/forbidden phrases, structure)", "Unit tests for prompt template rendering", "Type-check on JSON schema definitions"],
      cost: "Zero — no LLM calls",
    },
    {
      tier: "Tier 2", label: "Every PR", accent: "blue",
      when: "Runs on PR open/push — under 10 minutes",
      what: ["LLM-judge evaluation on a 20-case subset of golden set", "Cosine similarity against ideal answers", "Latency P95 assertion"],
      cost: "Low — ~20 judge calls",
    },
    {
      tier: "Tier 3", label: "Release gate", accent: "violet",
      when: "Runs before every production deploy — up to 60 minutes",
      what: ["Full golden set (200+ cases) with all evaluators", "Extensions.AI.Evaluation pipeline (coherence, groundedness, relevance)", "Regression comparison vs previous release scores", "Human review queue for cases that regressed"],
      cost: "Medium — full judge pipeline",
    },
  ];

  return (
    <div className="rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-violet-300">
        <GitBranch className="h-4 w-4" aria-hidden />
        3-tier CI evaluation strategy
      </h3>
      <div className="space-y-3">
        {tiers.map(({ tier, label, accent, when, what, cost }) => {
          const a = accentMap[accent];
          return (
            <div key={tier} className={cn("rounded-lg border-2 bg-white dark:bg-slate-900 p-4 space-y-3", a.border)}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border", a.chipBg, a.text, a.border)}>{tier}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 italic ml-auto">{when}</span>
              </div>
              <ul className="space-y-1">
                {what.map(w => <li key={w} className="text-xs text-slate-600 dark:text-slate-400 flex gap-1.5"><span className={cn(a.text)}>✓</span>{w}</li>)}
              </ul>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{cost}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CiGitHubActions() {
  return (
    <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
        <Wrench className="h-4 w-4" aria-hidden />
        GitHub Actions — Tier 1 &amp; 2 workflow skeleton
      </h3>
      <div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto">
        <div className="text-slate-500">{"# .github/workflows/ai-eval.yml"}</div>
        <div className="text-amber-300">{"name: AI Evaluation"}</div>
        <div className="text-amber-300">{"on: [push, pull_request]"}</div>
        <div className="text-slate-400">{""}</div>
        <div className="text-amber-300">{"jobs:"}</div>
        <div className="pl-4 text-amber-300">{"tier1-deterministic:"}</div>
        <div className="pl-8 text-slate-300">{"runs-on: ubuntu-latest"}</div>
        <div className="pl-8 text-slate-300">{"steps:"}</div>
        <div className="pl-10 text-slate-300">{"- uses: actions/checkout@v4"}</div>
        <div className="pl-10 text-slate-300">{"- uses: actions/setup-dotnet@v4"}</div>
        <div className="pl-10 text-emerald-400">{"- run: dotnet test --filter \"Category=Tier1\""}</div>
        <div className="text-slate-400">{""}</div>
        <div className="pl-4 text-amber-300">{"tier2-llm-judge:"}</div>
        <div className="pl-8 text-slate-300">{"runs-on: ubuntu-latest"}</div>
        <div className="pl-8 text-slate-300">{"if: github.event_name == 'pull_request'"}</div>
        <div className="pl-8 text-slate-300">{"needs: tier1-deterministic"}</div>
        <div className="pl-8 text-slate-300">{"steps:"}</div>
        <div className="pl-10 text-slate-300">{"- uses: actions/checkout@v4"}</div>
        <div className="pl-10 text-slate-300">{"- uses: actions/setup-dotnet@v4"}</div>
        <div className="pl-10 text-slate-300">{"- env:"}</div>
        <div className="pl-12 text-emerald-400">{"OpenAI__ApiKey: ${{ secrets.OPENAI_API_KEY }}"}</div>
        <div className="pl-10 text-emerald-400">{"  run: dotnet test --filter \"Category=Tier2\""}</div>
      </div>
      <Callout tone="blue" icon={BarChart3} title="Store evaluation results as artifacts">
        Serialize evaluation results to JSON and upload with <Code>actions/upload-artifact</Code>. Track score trends over time. Alert on regressions — a 10% drop in groundedness scores is a deployment blocker, not a note for the next sprint.
      </Callout>
    </div>
  );
}
