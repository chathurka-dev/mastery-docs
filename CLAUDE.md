# MasteryDocs — Claude Rules

## 1. Clean Code

- Use meaningful, intention-revealing names for variables, functions, and components. No abbreviations unless universally understood (`id`, `url`, `db`).
- Keep functions small and focused on a single task. If a function needs a comment to explain what it does, it should probably be split.
- No magic numbers or strings — extract them to named constants in `src/lib/constants.ts`.
- Avoid deep nesting. Prefer early returns over else branches.
- Delete dead code rather than commenting it out.

## 2. SOLID Principles

- **Single Responsibility**: each component, hook, or module does one thing. UI components render — they do not fetch data or run business logic directly.
- **Open/Closed**: extend via props, composition, and new files rather than modifying existing stable components.
- **Liskov Substitution**: derived components must be usable wherever the base is expected without breaking callers.
- **Interface Segregation**: keep prop interfaces narrow. Don't pass an entire object when only two fields are needed.
- **Dependency Inversion**: depend on abstractions (`db`, `authClient`, server actions) not concrete implementations. Never import Prisma directly in a component.

## 3. Comments

- Add a comment only when the **WHY** is non-obvious: a hidden constraint, a workaround for a specific bug, or behavior that would surprise a reader.
- Never describe WHAT the code does — well-named identifiers already do that.
- Never reference the current task, issue number, or caller in a comment ("added for X flow", "fix for issue #123") — those belong in the commit message.
- One short line max. No multi-line comment blocks.

## 4. Project Walkthrough

- **Every time a new feature, page, component, or architectural decision is added**, update `src/docs/project-walkthrough/component.tsx` to reflect it.
- Keep the walkthrough accurate enough that a new developer could understand the project structure by reading it.
- Follow the same doc component patterns when editing the walkthrough (see Rule 7).

## 5. TypeScript

- Strict mode is on — never use `any`. Use `unknown` + type narrowing when the type is genuinely unknown.
- Prefer `interface` for object shapes, `type` for unions and aliases.
- Export types alongside the code that owns them. Don't centralize all types in one file.
- Always type function return values explicitly for exported functions and server actions.

## 6. Verify Before Done

Before marking any task complete, always run:

```
npx tsc --noEmit
npm run lint
```

Do not report success if either fails. ESLint errors have previously blocked Vercel deploys on this project.

## 7. UI Work

**Always read `src/docs/DOC_STYLE_GUIDE.md` before implementing any UI** — doc components, app pages, or shared components. No exceptions.

Additional rules for doc components (`src/docs/<slug>/component.tsx`):

1. Use `accentMap` for all accent colors — never write Tailwind accent classes by hand.
2. Reuse the tab and accordion patterns from `src/docs/dotnet-internals/component.tsx`. Don't reinvent them.
3. Register new docs in `src/docs/registry.ts` — that is the single source of truth for the doc list.
4. Run through the checklist in Section 9 of the style guide before committing.

## 8. Dark Mode

Every Tailwind color class must declare its dark-mode partner on the same element. No exceptions.

- Light-mode classes are LIGHT (`text-slate-600`, `bg-white`).
- Dark-mode classes are LIGHT-ON-DARK (`dark:text-slate-300`, `dark:bg-slate-900`).
- Never use `dark:bg-slate-950` for cards. Never use `dark:text-slate-500` or `dark:text-slate-600` for body text.
- The site uses `data-theme` on `<html>` — NOT class-based dark mode.

## 9. Accessibility

Every interactive component must satisfy ALL of these:

- Semantic HTML: `<article>`, `<section>`, `<header>`, `<h2>`–`<h4>`, `<ol>`/`<ul>`. No `<div>` soup.
- Focus rings on every interactive element: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500` (or accent-matching).
- ARIA: tabs need `role="tablist/tab/tabpanel"` + `aria-selected` + `aria-controls` + arrow-key nav. Accordions need `aria-expanded` + `aria-controls`.
- Decorative icons get `aria-hidden`. Never put meaning in an icon's visual alone.
- Color is never the only signal — always pair with a text label, glyph, or shape.

## 10. Git & Deployment

- **Never push to the remote repository without asking the user first.**
- Prefer creating new commits over amending existing ones.
- Never skip hooks (`--no-verify`) unless the user explicitly asks.
- Never force-push to `main`.
