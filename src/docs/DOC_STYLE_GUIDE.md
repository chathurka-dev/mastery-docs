# MasteryDocs — Interactive Doc Style Guide

This guide locks in the visual language used by `dotnet-internals/component.tsx`. Every new doc component under `src/docs/<slug>/component.tsx` must follow these rules so the library stays cohesive.

If you're an AI assistant generating a new doc: read this file first, then mirror the patterns exactly. Do not invent new colors, sizes, or spacings.

---

## 1. Container & layout

### Width discipline — ONE max-width, never two

The `DocViewer` already constrains the page to `max-w-4xl` (896px). **Do not** add another `max-w-*` on your component's root — that creates a card-wider-than-content gap that shows up as wasted whitespace on the sides.

```tsx
// ✅ Correct — fills the DocViewer card edge-to-edge
<article className="px-5 py-6 sm:px-7 sm:py-8">

// ❌ Wrong — double constraint, leaves dead space inside the card
<article className="px-5 py-6 sm:px-7 sm:py-8 max-w-3xl mx-auto">
```

896px (`max-w-4xl`) is the page width. It's slightly wider than the typographic "60–80 character" ideal because these docs are **interactive content** (cards, grids, tables, code blocks) — long prose is rare. Wider gives multi-column grids more breathing room and cuts wasted side-margin on big monitors.

Never go wider than `max-w-4xl` without a conversation — past that, multi-column layouts start to feel sparse and prose paragraphs become hard to track line-to-line.

### Padding scale

| Where | Class | Why |
|-------|-------|-----|
| Component article (vertical) | `py-6 sm:py-8` | Breathing room without feeling empty. |
| Component article (horizontal) | `px-5 sm:px-7` | Matches the DocViewer's outer horizontal pad. |
| Outer card | `p-5` | Major topic area. |
| Inner card | `p-4` | Sub-topic inside an outer card. |
| Smallest card / chip box | `p-3` | Pill row, etymology box, callout-like note. |
| DocViewer page outer | `px-4 py-6 lg:px-6` | Owned by `DocViewer.tsx` — don't override. |
| DocViewer header card | `p-5 sm:p-6 mb-4` | Owned by `DocViewer.tsx` — don't override. |

### Vertical rhythm

- Between major blocks inside a tab: `space-y-6`.
- Between sub-sections inside a card: `space-y-4` or `space-y-5`.
- Between header card and body card in `DocViewer`: `mb-4`.

The rule is "tighter inside, looser outside" — bigger gaps between top-level sections, smaller gaps between related items inside the same section.

---

## 2. Typography scale

Use ONLY these sizes. Pick by role, not by feel.

| Role | Class | Notes |
|------|-------|-------|
| Doc title (H1) | `text-3xl sm:text-4xl font-extrabold gradient-text` | Wrap with `<h2>` because the page already owns `<h1>`. |
| Eyebrow above title | `text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400` | "Interactive Guide" style. |
| Doc subtitle | `text-base text-slate-600 dark:text-slate-400` | One sentence under the title. |
| Tab intro paragraph | `text-sm text-slate-600 dark:text-slate-400 text-center` | First text of each tab panel. |
| Section heading (H3) | `text-sm font-bold text-slate-900 dark:text-slate-100` | Add an icon if the section deserves one. |
| Sub-section heading (H4) | `text-sm font-bold text-{accent}-700 dark:text-{accent}-300` | Color matches the parent section accent. |
| Body paragraph | `text-sm text-slate-600 dark:text-slate-400 leading-relaxed` | Default for explanatory prose. |
| Strong emphasis inside body | `<strong className="text-slate-800 dark:text-slate-200">` | Never bold-only — always bump color too. |
| Tertiary / footnote | `text-xs text-slate-500 dark:text-slate-400 italic` | Use sparingly. |
| Metadata label (uppercase) | `text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400` | Above tables, ladders, lists of rules. |
| Inline code | `<Code>` helper | Never raw `<code>` — always use the helper for consistent borders. |

**Forbidden combinations** (they always look bad):
- `text-xs` for a full paragraph of prose. Bump to `text-sm`.
- `text-base` body inside a card. Cards use `text-sm` or `text-xs`.
- Any `text-slate-500` / `text-slate-400` without a dark-mode partner.
- Dark-mode color DARKER than light-mode color (e.g. `text-slate-400 dark:text-slate-600` — backwards!).

---

## 3. Color system

### Accent palette

Six accent colors, all routed through `accentMap`. Pick by **semantic role**, never randomly.

| Accent | When to use |
|--------|-------------|
| `violet` | Primary CTAs, top-of-stack / boot / entry points, "the orchestrator." |
| `rose` | Engines, critical paths, performance hotspots, "the heart." |
| `emerald` | Success states, AOT-safe, pre-compiled, "the good outcome." |
| `blue` | User-facing surfaces, source code, libraries, "what you touch." |
| `amber` | Warnings, JIT spikes, slow paths, "be careful." |
| `cyan` | Hardware / low-level / "raw" things (machine code, CPUs). |

Each accent always uses the same five Tailwind classes from `accentMap`:

```ts
{
  border: "border-{color}-300 dark:border-{color}-700",
  bg:     "bg-{color}-50 dark:bg-{color}-950/40",
  text:   "text-{color}-700 dark:text-{color}-300",
  ring:   "ring-{color}-400",
  chipBg: "bg-{color}-100 dark:bg-{color}-900/50",
}
```

Never use bare Tailwind color classes for accents — always go through `accentMap[accent]`.

### Neutral palette

Always use `slate` for neutrals. Never `gray`, `zinc`, or `neutral` — they don't match.

| Token | Light | Dark | Use for |
|-------|-------|------|---------|
| Page background | `bg-white` | `dark:bg-slate-900` | Card surfaces. |
| Subtle background | `bg-slate-50` | `dark:bg-slate-900/50` | Footnote panels, etymology boxes. |
| Border | `border-slate-200` | `dark:border-slate-700` | All neutral borders. |
| Heading text | `text-slate-900` | `dark:text-slate-100` | H3 section headings. |
| Body text | `text-slate-600` | `dark:text-slate-400` | Default prose. |
| Muted text | `text-slate-500` | `dark:text-slate-400` | Captions, italics. (Note: `dark:text-slate-400`, NOT slate-500.) |
| Strong inline | `text-slate-800` | `dark:text-slate-200` | `<strong>` emphasis. |

### Code-block colors

Dark code blocks ONLY (light code blocks look out of place):

```tsx
className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs leading-relaxed overflow-x-auto"
```

- Background: `bg-slate-800 dark:bg-slate-900` (never `slate-950` — too harsh in light mode).
- Border: `border-slate-700` (no dark variant needed).
- Syntax highlighting:
  - Comments → `text-slate-500`
  - Plain code → `text-slate-300`
  - Keywords / attributes → `text-emerald-400`
  - Strings / commands → `text-amber-300`
  - Table headers → `text-slate-400`

---

## 4. Component patterns

### 4.1 Doc header

Always identical, always centered:

```tsx
<header className="mb-8 text-center">
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">
    Interactive Guide
  </p>
  <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-3">{title}</h2>
  <p className="text-base text-slate-600 dark:text-slate-400">{subtitle}</p>
</header>
```

### 4.2 Tabs

Required ARIA: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, arrow-key navigation via `useRef`. Use the `Tabs` pattern from the .NET doc verbatim — don't reinvent it.

- 1 tab visible at a time, `tabIndex={active ? 0 : -1}`.
- Icons always visible; labels hidden below `sm`.

### 4.3 Card hierarchy (3 levels)

Nesting goes max 3 deep:

| Level | Class | Use for |
|-------|-------|---------|
| Outer | `rounded-xl border-2 p-5` | A whole topic area (tier list, R2R section). Border color = accent. |
| Inner | `rounded-lg border p-4` | A sub-topic inside an outer card. Often neutral border. |
| Smallest | `rounded-md border p-3` | A pill row, etymology box, or callout-style note inside an inner card. |

Cards on a colored section background use `bg-white dark:bg-slate-900` to "punch through" the tint.

### 4.4 Callouts

Use the `Callout` helper. Three tones only:

```tsx
<Callout tone="amber"   icon={Lightbulb}     title="...">...</Callout>  // tips, analogies
<Callout tone="emerald" icon={Package}       title="...">...</Callout>  // good news, features
<Callout tone="blue"    icon={BarChart3}     title="...">...</Callout>  // measurement, neutral facts
```

- `title` is optional. Body is `text-sm leading-relaxed`.
- Icon is always `h-5 w-5 flex-shrink-0 mt-0.5`.

### 4.5 Code blocks

**Inline code** — always via the `Code` helper:

```tsx
<Code>dotnet publish</Code>
```

Never use raw `<code>`. The helper enforces border, padding, monospace, and dark-mode color in one go.

**Multi-line code block** — div with line-per-div:

```tsx
<div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
  <div className="text-slate-500">// comment</div>
  <div className="text-slate-300">var x = 1;</div>
  <div className="pl-4 text-emerald-400">[Attribute]</div>
</div>
```

Use `pl-4` for one level of indent, `pl-8` for two.

**Tabular output** (anything that looks like a results table, ASCII columns, etc.) — use a real `<table>`, not a `<pre>`. Browsers collapse multi-space gaps inside inline elements even when wrapped in `<pre>`, so column alignment via spaces is unreliable. A table guarantees alignment via column cells while still looking like terminal output:

```tsx
<div className="rounded-lg bg-slate-800 dark:bg-slate-900 border border-slate-700 p-3 font-mono text-xs overflow-x-auto">
  <div className="text-slate-500 mb-2">// BenchmarkDotNet output</div>
  <table className="w-full border-collapse">
    <thead>
      <tr className="border-b border-slate-700">
        <th className="text-left  text-slate-400 font-semibold py-1.5 pr-6">Method</th>
        <th className="text-right text-slate-400 font-semibold py-1.5 px-3">Mean</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="text-emerald-400 py-1.5 pr-6">Foo</td>
        <td className="text-right text-amber-300 py-1.5 px-3">12 ns</td>
      </tr>
    </tbody>
  </table>
</div>
```

Reserve `<pre>` for single-color blocks (commands, short snippets) where alignment is just left-justified.

### 4.6 Chips / badges

Three variants, by purpose:

```tsx
// Tag chip (default)
<span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold border", a.chipBg, a.text, a.border)}>
  {label}
</span>

// Pill / status badge
<span className={cn("px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap border", a.chipBg, a.text, a.border)}>
  {phase}
</span>

// Number / step circle
<span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", a.chipBg, a.text)}>
  {n}
</span>
```

All chips get accent color from `accentMap[accent]` — three classes: `chipBg`, `text`, `border`.

### 4.7 Flow diagrams (horizontal pipelines)

A flex row of chips separated by `<ArrowRight>`:

```tsx
<ol className="flex flex-wrap items-center gap-2 text-sm">
  {steps.map((s, i, arr) => (
    <li key={s.label} className="flex items-center gap-2">
      <span className={cn("px-2.5 py-1 rounded-md text-xs font-semibold border", a.chipBg, a.text, a.border)}>
        {s.label}
      </span>
      {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />}
    </li>
  ))}
</ol>
```

Arrows are always `h-3.5 w-3.5 text-slate-400`. Wrap with `flex-wrap` so they stack on mobile.

### 4.8 Tables (or table-like lists)

Two acceptable styles:

**Real `<table>`** for true tabular data (rows × columns, comparison):

```tsx
<table className="w-full text-sm border-collapse">
  <thead>
    <tr className="border-b border-slate-200 dark:border-slate-700">
      <th className="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Column
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">...</tbody>
</table>
```

**Divided `<ul>`** for two-column "key → value" lists:

```tsx
<ul className="divide-y divide-slate-100 dark:divide-slate-800">
  <li className="py-3 flex items-center justify-between gap-3">
    <span className="text-sm text-slate-700 dark:text-slate-300">{key}</span>
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap", a.chipBg, a.text, a.border)}>
      {value}
    </span>
  </li>
</ul>
```

### 4.9 Pros / Cons two-column

```tsx
<div className="grid sm:grid-cols-2 gap-4">
  <div>
    <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-2">✓ Pros</h4>
    <ul className="space-y-1.5">
      {items.map(p => (
        <li key={p} className="text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-emerald-300 dark:border-emerald-700">
          {p}
        </li>
      ))}
    </ul>
  </div>
  <div>
    <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2">⚠ Cons</h4>
    <ul className="space-y-1.5">
      {items.map(c => (
        <li key={c} className="text-sm text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-rose-300 dark:border-rose-700">
          {c}
        </li>
      ))}
    </ul>
  </div>
</div>
```

Always emerald for pros, rose for cons. Always `pl-3 border-l-2` accent left bar.

### 4.10 Accordion / collapsible

For "click to expand" sections. Required ARIA: `aria-expanded`, `aria-controls`, focus ring.

```tsx
<button
  onClick={() => setOpen(!open)}
  aria-expanded={open}
  aria-controls={panelId}
  className={cn(
    "w-full flex items-center justify-between gap-4 px-4 py-3.5 border-2 rounded-xl transition-all text-left",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800",
    a.border, a.ring,
    open ? a.bg : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
  )}
>
```

Chevron is an `<ArrowRight>` rotated 90° when open.

---

## 5. Dark mode rules (NON-NEGOTIABLE)

The site uses Tailwind v4 `@custom-variant dark` based on `[data-theme=dark]` on `<html>`. Every color class must declare its dark-mode partner.

**Hard rules:**

1. **Light → light, Dark → dark.** Light-mode classes are LIGHT (`text-slate-600`, `bg-white`). Dark-mode classes are LIGHT-ON-DARK (`dark:text-slate-300`, `dark:bg-slate-900`). Never invert.
2. **Never `dark:text-slate-500` or `dark:text-slate-600` for body text.** Those tones are unreadable on dark backgrounds. Stop at `dark:text-slate-400`.
3. **Never `dark:bg-slate-950` for cards.** It's near-black and looks broken. Use `dark:bg-slate-900`.
4. **Never omit a dark variant on any text class.** If you have `text-slate-500`, you must have `dark:text-slate-400` next to it. The audit script will flag missing variants.
5. **Accent text classes** (`text-violet-700 dark:text-violet-300`) always come from `accentMap`. Don't write them by hand.
6. **Code block backgrounds** stay `bg-slate-800 dark:bg-slate-900` (never `slate-950`).

---

## 6. Accessibility minimums

Every doc must satisfy ALL of these — no exceptions.

- **Semantic HTML**: `<article>`, `<section>`, `<header>`, `<h2>`/`<h3>`/`<h4>`, `<ol>`/`<ul>`, `<dl>`. Don't wrap everything in `<div>`.
- **Focus rings**: every interactive element gets `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500` (or accent-matching).
- **ARIA**:
  - Tabs: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, arrow-key navigation.
  - Accordions: `aria-expanded`, `aria-controls`.
  - Radio groups (mode pickers): `role="radiogroup"` + `role="radio"` + `aria-checked`.
- **Decorative icons** get `aria-hidden`. Text labels live in `<span>`, not in icon `alt`.
- **Color is never the only signal.** Pros/cons have ✓/⚠ glyphs; status badges have text labels; flows have arrows.

---

## 7. Spacing scale

Stick to this scale. No `gap-1.5`-on-monday, `gap-3.5`-on-tuesday.

| Token | Use for |
|-------|---------|
| `gap-1` | Single-line chip rows inside a sentence. |
| `gap-1.5` | Flow-diagram chips (with arrows). |
| `gap-2` | Default chip rows, list items inside small cards. |
| `gap-3` | List items inside outer cards. |
| `gap-4` | Two-column grids, separate sub-sections. |
| `space-y-2` | Tight list of related items. |
| `space-y-3` | Default list spacing. |
| `space-y-4` | Sub-sections inside a card. |
| `space-y-5` | Sub-sections inside a colored section card. |
| `space-y-6` | Top-level blocks inside a tab. |

`mb-2` / `mb-3` / `mb-4` between heading and content. `mb-8` only on the doc header.

---

## 8. Icons

- Library: `lucide-react`. Don't introduce a second icon set.
- Sizing: `h-3.5 w-3.5` (inline arrows), `h-4 w-4` (heading icons), `h-5 w-5` (callout icons).
- Color: matches the parent context (accent text class), or `text-slate-400` for neutral pipeline arrows.
- Always `aria-hidden` unless it carries meaning on its own.

---

## 9. What to AVOID

These have all been tried and they all look wrong. Don't repeat.

- ❌ Inline `style={{ color: '#abc' }}` — always Tailwind classes.
- ❌ `bg-gray-*` / `bg-zinc-*` / `bg-neutral-*` — only `slate`.
- ❌ Custom hex colors. The accent map is the palette.
- ❌ Multiple font families. The site uses Inter (body) and JetBrains Mono (code). Don't import others.
- ❌ Emojis as section icons. Use `lucide-react`. (Inline emojis in body text are fine if the original doc has them.)
- ❌ `text-base` paragraphs inside cards. Cards are `text-sm` or smaller.
- ❌ Removing dark variants "to keep classes short." Every color needs both.
- ❌ Building a custom tab/accordion. Reuse the pattern from `dotnet-internals/component.tsx`.
- ❌ Drop shadows beyond `shadow-sm`. The design is flat.
- ❌ Animations beyond `transition-all` / `transition-transform`. No bouncing, no fade-ins.

---

## 10. Checklist before shipping a new doc

Run through these manually before committing.

- [ ] Container is `max-w-3xl mx-auto`.
- [ ] Doc header uses the eyebrow / `gradient-text` title / subtitle pattern.
- [ ] All accent colors come from `accentMap`.
- [ ] Every `text-slate-*` has a `dark:text-slate-*` partner — and dark is LIGHTER.
- [ ] No `dark:bg-slate-950`. No `bg-slate-950` outside code blocks.
- [ ] Code blocks use `bg-slate-800 dark:bg-slate-900`.
- [ ] Inline code uses `<Code>`, not raw `<code>`.
- [ ] Tabs have full ARIA + arrow-key navigation.
- [ ] All buttons / accordions have visible focus rings.
- [ ] Pros = emerald + ✓, Cons = rose + ⚠.
- [ ] Decorative icons are `aria-hidden`.
- [ ] `npx tsc --noEmit` passes.
- [ ] Doc renders correctly in both light and dark mode.
