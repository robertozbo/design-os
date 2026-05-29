# iPad Prototype Design — App Store Marketing Pack

**Date:** 2026-05-29
**Status:** Design approved, ready for implementation plan
**Owner:** Roberto

## Goal

Generate 5 iPad-optimized screen designs of the Nymos patient app for submission to the Apple App Store. App Store Connect requires at least one iPad 13" screenshot (2064×2752px portrait) to allow the app review to proceed.

The prototype is a separate Design OS namespace (`product-ipad` / `sections-ipad` / `shell-ipad`) that mirrors the existing `product-mobile` structure. It is **not** a port of every mobile screen — only the 5 screens that best sell the product on the App Store.

## Non-Goals

- Porting the full 31-section mobile app.
- Building shared abstractions between mobile and iPad shells (intentional copy/paste; the two are sized and laid out differently and will diverge).
- Backend changes, real data, real export package. Output is screenshots only.
- Landscape orientation. App Store accepts portrait alone; portrait is enough.

## Scope — The 5 Screens

| # | Section ID | Why it sells |
|---|------------|--------------|
| 1 | `inicio` | Daily dashboard — first impression, shows the actionable nature of the product |
| 2 | `minha-saude` | Score + AI analyses — flagship "wellness intelligence" feature |
| 3 | `metricas` | Charts at iPad scale — strongest visual screen, shows depth of tracking |
| 4 | `chat-ia` | AI conversation — shows the AI "personality" reviewers will look for |
| 5 | `ia` | AI hub — shows the breadth of AI features in one card grid |

## Architecture

### Approach

The iPad prototype is a **dedicated namespace** that mirrors the `product-mobile` / `product-fisio` patterns already in the repo. The same Design OS application surfaces it under a new route, `/ipad`. No existing mobile code is changed.

### File layout

```
product-ipad/                      # Product definition (portable)
├── product-overview.md            # iPad variant overview
├── design-system/
│   ├── colors.json                # Copied from product-mobile (same brand)
│   └── typography.json
├── shell/
│   └── spec.md                    # Sidebar 280pt + main, dark theme
└── sections/
    ├── inicio/spec.md
    ├── minha-saude/spec.md
    ├── metricas/spec.md           # spec includes SplitView (list + detail)
    ├── chat-ia/spec.md            # spec includes SplitView (conversations + chat)
    └── ia/spec.md

src/
├── shell-ipad/
│   ├── components/
│   │   ├── IpadShell.tsx          # Sidebar fixa + main container
│   │   ├── IpadSidebar.tsx        # Logo + 5 nav items + user pill
│   │   └── index.ts
│   └── IpadFrame.tsx              # Viewport frame, 2064×2752 scaled-to-fit
├── sections-ipad/
│   ├── inicio/Inicio.tsx
│   ├── minha-saude/MinhaSaude.tsx
│   ├── metricas/Metricas.tsx      # Internal SplitView
│   ├── chat-ia/ChatIA.tsx         # Internal SplitView
│   └── ia/IA.tsx
├── lib/
│   └── ipad-section-loader.ts     # Mirror of mobile-section-loader.ts
└── components/
    └── IpadPage.tsx               # IpadSectionsPage + IpadSectionPage
```

### Routing

Two new routes registered in `src/lib/router.tsx` (the existing router file used by `MobilePage`, `FisioPage`, etc.):

- `/ipad` → `IpadSectionsPage` — grid of the 5 sections, mirroring `/mobile`.
- `/ipad/sections/:sectionId` → `IpadSectionPage` — opens the section inside `IpadFrame`.

The mobile route (`/mobile`) and the rest of Design OS stay untouched.

`IpadPage.tsx` mirrors `MobilePage.tsx`: a single file with two named exports — `IpadSectionsPage` (the grid index) and `IpadSectionPage` (the single-section viewer). Both consume `ipad-section-loader.ts`.

### Section loader

`src/lib/ipad-section-loader.ts` is a direct mirror of `src/lib/mobile-section-loader.ts` (and the just-added `src/lib/fisio-section-loader.ts`, which is byte-for-byte identical except for path substitutions — either can be used as the template). Substitutions:

- `/product-mobile/sections/` → `/product-ipad/sections/`
- `/src/sections-mobile/` → `/src/sections-ipad/`
- Function names prefixed with `Ipad` instead of `Mobile`.

This keeps the loader contract (`SectionData`, `ScreenDesignInfo`, `ScreenshotInfo`) identical and reuses `parseSpec` from `section-loader.ts`.

### Data reuse

Each iPad section spec includes a `data.json` either copied from the corresponding `product-mobile/sections/{id}/data.json` or extended where the iPad split layout needs more rows (Métricas needs ~12 metrics to populate the left list; Chat IA needs ~8 conversations).

No shared module — iPad has its own `data.json` per section to avoid coupling.

## Shell — `IpadShell` + `IpadSidebar`

### Layout

- Container: `flex h-full bg-slate-950`
- Sidebar: fixed-width `w-[280px]` left, border-right `slate-800`, padding `py-6 px-4`
- Main area: `flex-1 overflow-y-auto` with padding `px-12 py-10`
- No bottom tabs (sidebar replaces them)
- No status bar mock (Apple's screenshot doesn't include it for iPad)

### Sidebar contents (top to bottom)

1. **Brand row** — Nymos wordmark + small "iPad" badge, `mb-8`
2. **Nav section** — five items, each `flex items-center gap-3 py-3 px-3 rounded-xl`. The order matches the Scope table (top to bottom):
   - Início — `Home` icon
   - Minha Saúde — `Heart` icon
   - Métricas — `BarChart3` icon
   - Chat IA — `MessageCircle` icon
   - IA — `Sparkles` icon
   - Active state: `bg-teal-500/15 text-teal-300`, inactive: `text-slate-400 hover:bg-slate-900`
3. **Spacer** (`flex-1`)
4. **User pill** — avatar circle 40×40 + name "Roberto" + plan chip "Pro" in a rounded card `bg-slate-900 border border-slate-800 p-3 rounded-xl`

### IpadFrame

Visual frame that wraps section content for the section viewer. Renders a 2064×2752 viewport scaled to fit the browser window so designers can preview the layout. Background is a stone-colored mat with a subtle device bezel illusion. The frame is **only** for the preview UI — screenshots are taken at native resolution via the screenshot pipeline, not from the scaled preview.

## Section Designs

Each section spec follows the existing `product-mobile/sections/*/spec.md` structure: Overview, Princípio, User Flows, UI Requirements, Configuration. Sizes below assume 2064×2752 portrait viewport minus the 280pt sidebar = ~1784pt usable main width.

### 1. `inicio` — Dashboard

2-column layout inside main:

- **Left column (~60%)** — Hero greeting + AI insight line + streak + Anel de calorias **enlarged to 380px** (vs 240 on mobile), legend below.
- **Right column (~40%)** — Card "Plano de Hoje" expanded (next 3 meals listed with macros), then Banner Novidade, then a vertical stack of mini-stats (3 chips instead of horizontal scroll: peso, sono, passos).

Below both columns, full-width:
- Strip of mini-stats (the remaining 3: água, BPM, % gordura) horizontal
- Quick actions grid — 4 cards instead of 3 (add "Saúde Mental" to fill the wider row)

### 2. `minha-saude` — Score + Analyses

3-column header strip + analyses grid:

- **Header strip** — 3 cards: Score atual (big number + ring), Tendência 7d (sparkline), Próximo check (countdown). Each card ~580pt wide.
- **Analyses grid** — 2×3 grid of AI analysis cards, each `rounded-2xl` with title, 2-line summary, "Ler análise" CTA. Total 6 visible analyses.
- **Footer card** — full-width "Evolução" with a 6-month area chart.

### 3. `metricas` — Split List + Detail

Internal SplitView (the showcase screen):

- **Left pane (`w-[420px]`)** — search bar + list of 12 metrics, each row 64pt tall with icon + label + current value + delta. Selected row has `bg-teal-500/10` border-left `teal-400`.
- **Right pane (`flex-1`)** — header (metric name + period picker), big chart (line chart 480pt tall), stats row (min / max / avg / current), recent entries list.
- Default selection: Peso (most relatable metric).

### 4. `chat-ia` — Split Conversations + Chat

Internal SplitView:

- **Left pane (`w-[360px]`)** — "Nova conversa" button + list of 8 conversations (recent first), each showing title + last message preview + timestamp.
- **Right pane (`flex-1`)** — conversation header (title + "powered by Nymos AI" chip), scrollable message list (4-5 visible turns showing AI personality answering a health question), composer at bottom with attach button + textarea + send.

### 5. `ia` — AI Hub

Single-column hero + grid:

- **Hero card** (full width, `bg-gradient-to-br from-teal-500/15 to-sky-400/10`) — "Análise inteligente Nymos" headline, 1-line subtitle, primary CTA "Conversar com Nymos" + secondary "Ver últimas análises".
- **Capabilities grid** — 3×2 grid of capability cards (Análise de exames, Padrões de sono, Sugestões de plano, Avaliação corporal, Insights cross-feature, Conversa livre). Each card has icon, title, 1-line description, "Experimentar" CTA.
- **Footer strip** — "Privacidade: análises feitas em servidor seguro, dados nunca compartilhados" privacy reassurance line.

## Design Tokens

iPad sections use the **same** design tokens as `product-mobile`:

- Dark mode primary (Apple App Store screenshots are most impactful in dark theme for health apps).
- Colors: slate background palette, teal-400/500 primary, sky/violet/rose/cyan/amber/emerald accents (same as mobile spec).
- Typography: DM Sans for UI, IBM Plex Mono for numbers (tabular-nums on all values).

`product-ipad/design-system/colors.json` and `typography.json` are byte-identical copies of `product-mobile/design-system/*`. Keeping them as separate files (vs symlink/import) follows the existing pattern in `product-fisio` and `product-clinico`.

## Screenshot Pipeline

Screenshots are captured at native iPad 13" resolution (2064×2752) using the existing `/screenshot-design` skill or equivalent. The `IpadFrame` preview is for designer review only; the actual screenshots render the section component at the native viewport without the scale wrapper.

Output PNGs live in `product-ipad/sections/{section-id}/{name}.png`, matching the mobile convention. Upload to App Store Connect happens manually from those files.

## Out of Scope (Explicitly Deferred)

- Light theme variants of iPad screens (mobile has both; iPad only needs dark for App Store).
- Landscape orientation.
- Functional behavior beyond visual rendering (no real data, no real navigation between iPad sections).
- An export package (`product-plan-ipad/`) — there is no implementation target.
- Tests. This is design output; correctness is judged visually.

## Risks & Open Questions

| Risk | Mitigation |
|------|------------|
| Apple rejects screenshots that don't show actual iPad UI | Hybrid shell (sidebar + split views) is the standard iPad pattern; passes the "looks like an iPad app" bar. |
| Mobile spec drifts from iPad spec over time | Accepted. iPad is a one-time marketing artifact, not a maintained product variant. If the mobile app ships major UI changes, the iPad screenshots may need a refresh — but that's a future, opt-in task. |
| 2064×2752 is huge to render in browser preview | `IpadFrame` scales-to-fit using `transform: scale()`. Native screenshots render off-screen at full size. |

## Success Criteria

1. Five PNG screenshots exist in `product-ipad/sections/{id}/` at 2064×2752 portrait.
2. App Store Connect accepts them in the "iPad 13"" slot.
3. The Design OS application has a working `/ipad` route showing the 5 sections, navigable to each section viewer.
4. No regression in existing mobile or other product routes.
