# Nymos Health — Brand Manual

> Live version: `/brand` in Design OS. This document and that page render the same data
> (`design-os/src/lib/brand-tokens.ts`).
>
> **Source of truth for values:** `frontend/src/styles/tokens/{light,dark}.css` — Style Dictionary
> output, prefix `--nymos*`. If a value here disagrees with that file, that file wins and this
> document is stale.

---

## 1. Foundation

Nymos puts a person's whole health record — wearables, exams, appointments, professionals — in one
place, and makes it readable. Every rule below exists to make health data feel calm, trustworthy and
understandable.

**Three principles**

| Principle | What it means in practice |
|---|---|
| Trust before delight | This is medical data. Composure beats personality. No dark patterns, no gamified urgency, no fake progress. |
| Clarity is the feature | A number the patient understands beats a chart that impresses. Always show unit, reference range and meaning. |
| Calm under bad news | A critical result must be unmistakable without being alarming. Colour states the fact; copy states the next step. |

**Personality axes** — where Nymos sits between two poles:

- Clinical ————•—— Human
- Playful ——————•— Serious
- Dense —————•—— Spacious
- Loud ——————•— Quiet

---

## 2. Voice & tone

Portuguese (pt-BR) for patients and professionals; plain language always. The product speaks like a
good clinician: direct, unhurried, never condescending.

| Context | ✗ | ✓ |
|---|---|---|
| Empty state | `Nada por aqui ainda 😢` | `Você ainda não enviou exames. Envie o primeiro para ver sua evolução.` |
| Error | `Erro 500 — falha inesperada` | `Não conseguimos salvar agora. Tente de novo em instantes.` |
| Critical result | `⚠️ ALERTA! Glicose PERIGOSA!` | `Glicose acima da faixa de referência. Vale conversar com seu médico.` |

**Do**
- Say what happened and what to do next, in that order.
- Put the unit and reference range next to every clinical number.
- Address the person directly: "seus exames", not "exames do usuário".
- Keep sentences under 20 words. One idea per sentence.

**Don't**
- Never diagnose. Nymos surfaces data and suggests a conversation.
- No exclamation marks in clinical context. No emoji in results.
- No jargon without a plain-language gloss on first use.
- Never imply urgency to drive a click.

---

## 3. Logo

One mark: an emerald squircle holding a white **N** (`frontend/public/icon-source.svg`). It reads at
16px in a browser tab and at 512px on a splash screen without modification.

| Spec | Value |
|---|---|
| Fill | `#10b981` (primary-500) |
| Letter | `#ffffff`, Plus Jakarta Sans Bold, tracking −0.03em |
| Corner radius | 27% of the side — a squircle, never a circle |
| Clear space | 25% of the mark height on all four sides |
| Minimum size | 24px digital (16px favicon-only), 8mm print |
| Lockup gap | 35% of the mark height between mark and wordmark |

**Variants:** brand (default) · mono-dark (`#0f172a` fill) · mono-light (white fill, dark letter) ·
outline (1-colour, currentColor).

**Do**
- Place the mark on a solid surface with at least 4.5:1 contrast.
- Use mono-light on photography or dark clinical imagery.
- Keep the squircle radius.

**Don't**
- Never recolour the N or gradient-fill the squircle.
- Never rotate, stretch, outline or shadow the mark.
- Never lock to another brand without a divider and equal height.

---

## 4. Colour

Emerald is the brand. Slate carries the interface. Everything else is either a **status** or a
**clinical reading** — colour is never decorative.

### 4.1 Brand ramps

| Ramp | Role | Base | Notes |
|---|---|---|---|
| Primary — Emerald | CTAs, active states, brand moments | `#10b981` | `400 #34d399` is the brand primary in dark mode; `600 #059669` is hover |
| Secondary — Teal | Supporting tone, charts, health data | `#14b8a6` | Hover `#0d9488` |
| Accent — Purple | AI, insights, notifications | `#6c5ce7` | Custom value, not Tailwind purple. Never a primary action |
| Neutral — Slate | Surfaces, borders, text | `#64748b` | Cool grey, never warm |

Full 50–900 ramps are in `brand-tokens.ts` and rendered swatch-by-swatch at `/brand`.

### 4.2 Status ramps

| Ramp | Base | Note |
|---|---|---|
| Success | `#22c55e` | Standard green |
| Warning | `#c47d0a` | Custom — darker than Tailwind amber, for legibility on white |
| Danger | `#c93545` | Custom — desaturated for clinical calm |
| Info | `#06b6d4` | Cyan |

### 4.3 Semantic tokens

Components consume **these**, never the ramps.

**Surfaces**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--nymosSurfaceBackground` | `#ffffff` | `#0f172a` | Page background |
| `--nymosSurfacePrimary` | `#ffffff` | `#1e293b` | Cards, modals |
| `--nymosSurfaceSecondary` | `#f8fafc` | `#1e293b` | Alternating sections |
| `--nymosSurfaceTertiary` | `#f1f5f9` | `#334155` | Highlighted rows, chips |
| `--nymosSurfaceElevated` | `#ffffff` | `#1e293b` | Dropdowns, popovers |

**Text**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--nymosTextPrimary` | `#0f172a` | `#f8fafc` | Headings, body |
| `--nymosTextSecondary` | `#64748b` | `#cbd5e1` | Supporting copy |
| `--nymosTextTertiary` | `#94a3b8` | `#94a3b8` | Placeholders, hints |
| `--nymosTextDisabled` | `#cbd5e1` | `#475569` | Disabled states |
| `--nymosTextInverse` | `#ffffff` | `#0f172a` | Text on solid brand fills |

**Borders**

| Token | Light | Dark |
|---|---|---|
| `--nymosBorderDefault` | `#e2e8f0` | `#334155` |
| `--nymosBorderSubtle` | `#f1f5f9` | `#1e293b` |
| `--nymosBorderStrong` | `#cbd5e1` | `#475569` |
| `--nymosBorderFocus` | `#10b981` | `#34d399` |

**Brand**

| Token | Light | Dark | Use |
|---|---|---|---|
| `--nymosBrandPrimary` | `#10b981` | `#34d399` | Primary CTA, active nav |
| `--nymosBrandPrimaryHover` | `#059669` | `#6ee7b7` | Hover |
| `--nymosBrandPrimarySubtle` | `#ecfdf5` | `#064e3b` | Tinted backgrounds |
| `--nymosBrandSecondary` | `#14b8a6` | `#14b8a6` | Secondary emphasis |
| `--nymosBrandAccent` | `#6c5ce7` | `#6c5ce7` | AI, insights, badges |

### 4.4 Health semantics

Reserved for the clinical reading of a metric. Never reused for UI state.

| Token | Hex | Meaning |
|---|---|---|
| `--nymosSemanticNormal` | `#22c55e` | Value inside the reference range |
| `--nymosSemanticAttention` | `#c47d0a` | Borderline — worth a look |
| `--nymosSemanticAlert` | `#c93545` | Outside range — act now |

**Do**
- Exactly one emerald-filled primary action per screen.
- Pair every status colour with an icon **and** a label — colour alone fails colour-blind users.
- Tints 50/100 for backgrounds; 600/700 for text on those backgrounds.

**Don't**
- Never use brand emerald to mean "healthy" — that is `semanticNormal`.
- Never introduce a colour outside these ramps, not even for one chart.
- Never set brand emerald text on white below 16px — it fails AA at small sizes.

---

## 5. Typography

| Role | Family | Token |
|---|---|---|
| Everything a person reads | **Plus Jakarta Sans** | `--nymosFontFamilySans` |
| Values a machine produced (IDs, codes, raw measurements) | **JetBrains Mono** | `--nymosFontFamilyMono` |

### Type scale

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `5xl` | 48 / 48 | 700 | Display — marketing only |
| `4xl` | 36 / 40 | 700 | Headline |
| `3xl` | 30 / 36 | 600 | Page title |
| `2xl` | 24 / 32 | 600 | Section title |
| `xl` | 20 / 28 | 600 | Subtitle, card title |
| `lg` | 18 / 28 | 400 | Large body, lead |
| `base` | 16 / 24 | 400 | Body — the default |
| `sm` | 14 / 20 | 400 | Captions, helper text |
| `xs` | 12 / 16 | 500 | Labels, badges |

Weights: 400 regular · 500 medium (labels, nav) · 600 semibold (titles, buttons) · 700 bold
(headlines, numbers that matter). Tracking: −0.025em at 24px and above, 0 below, 0.025em on 12px
uppercase labels.

**Do**
- Body copy is 16px. Anything smaller is a label, not prose.
- Set clinical values in mono when compared column to column.

**Don't**
- No third typeface, ever.
- No 300 weight — it disappears against light surfaces.
- No all-caps beyond 12px labels.

---

## 6. Space & shape

**Spacing** — 4px base. Use the scale, never an arbitrary value.

`1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=20 · `6`=24 · `8`=32 · `10`=40 · `12`=48 · `16`=64 · `20`=80 · `24`=96

Common: 16 default padding · 24 card padding · 32 gap between sections · 48 page margin.

**Radius**

| Token | px | Use |
|---|---|---|
| `sm` | 4 | Badges, chips |
| `md` | 8 | Buttons, inputs |
| `lg` | 12 | Cards |
| `xl` | 16 | Modals |
| `2xl` | 24 | Featured cards, hero tiles |
| `full` | 9999 | Avatars, pills |

**Elevation**

| Token | Value | Use |
|---|---|---|
| `sm` | `0 1px 2px rgba(0,0,0,.05)` | Resting card |
| `md` | `0 4px 6px -1px rgba(0,0,0,.1)` | Hovered card |
| `lg` | `0 10px 15px -3px rgba(0,0,0,.1)` | Dropdown, popover |
| `xl` | `0 20px 25px -5px rgba(0,0,0,.1)` | Modal |
| `inner` | `inset 0 2px 4px rgba(0,0,0,.05)` | Pressed input |

Border widths: 1px default, 2px focus only.

---

## 7. Iconography

Lucide React, **stroke 1.75**, no fills. Icons clarify a label; they never replace one in navigation
or clinical context.

Sizes: **16** inside inputs and badges · **20** in buttons and lists · **24** in headers · **32** in
empty states.

Gradient tiles (48px, radius-lg, white icon) are the only place gradients appear — never behind text:

- Health: `linear-gradient(135deg, #10b981, #14b8a6)`
- AI: `linear-gradient(135deg, #6c5ce7, #8b5cf6)`
- Documents: `linear-gradient(135deg, #06b6d4, #0ea5e9)`

Core set — one meaning, one icon, product-wide: Metrics `HeartPulse` · Exams `FileText` ·
Appointments `Calendar` · Progress `TrendingUp` · AI `Brain` · Privacy `Shield` · Profile `User` ·
Alerts `Bell` · Upload `Upload` · Search `Search` · Settings `Settings` · Done `CheckCircle2`.

---

## 8. Components

| Component | Spec |
|---|---|
| Button | Heights 32 / 40 / 48, radius-md, semibold. Variants: primary (emerald fill), secondary (emerald outline), ghost, danger. One primary per screen; destructive always confirms. |
| Input | Height 40, radius-md, 1px border. Focus: `borderFocus` + 3px 18%-alpha halo. Error: danger border + helper text. |
| Badge | radius-sm (pill for filters), 12px/500, subtle by default, solid for counts. |
| Alert | radius-lg, 20px icon, status `bg` / `border` / `text` triad. |
| Card | radius-lg, padding 24, `shadow-sm` at rest, `shadow-md` on hover, lift −2px. |
| Metric card | Label (xs, uppercase) → value (3xl bold) + unit (sm) → status dot + delta. Colour comes from the health semantics, not the brand. |
| Avatar | radius-full, `primary-50` background, `primary-700` initials, `primary-200` border. |

All components ship light **and** dark in the same commit.

---

## 9. Data visualisation

Series palette, assigned in order — never by taste:

`#10b981` → `#14b8a6` → `#6c5ce7` → `#06b6d4` → `#c47d0a` → `#ec4899`

**Do**
- Draw the reference range as a shaded band behind the series.
- Label axes with the unit (mg/dL, bpm) — never a bare number.
- Use dashes or markers as well as colour to separate series.

**Don't**
- No 3D, no donut with more than four slices, no dual Y axis.
- No red/green as the only difference between two series.
- No truncated Y axis on clinical values — it exaggerates change.

---

## 10. Motion & depth

| Token | Value | Use |
|---|---|---|
| `fast` | 150ms ease | Colour, opacity, hover |
| `base` | 200ms ease | The default |
| `slow` | 300ms ease | Sheets, expanding panels |
| `slower` | 500ms ease | Page-level transitions only |

Z-index: base 0 · dropdown 10 · sticky 20 · overlay 30 · modal 40 · toast 50 · tooltip 60.

Motion confirms that something happened. Anything a person waits for gets a skeleton, not a spinner.
Respect `prefers-reduced-motion`: drop translation and scale, keep opacity.

---

## 11. Accessibility

WCAG 2.1 AA is the floor.

- **Contrast** — 4.5:1 for text, 3:1 for icons and meaningful borders. Verified in both themes.
- **Focus** — visible ring on every interactive element: 2px `borderFocus` + 3px 18%-alpha halo.
- **Targets** — minimum 44×44px touch target even when the visual control is 32px.
- **Never colour alone** — every status carries an icon and a text label.
- **Motion** — honour `prefers-reduced-motion`; no auto-playing animation over data.
- **Language** — clinical terms get a plain-language gloss the first time they appear on a screen.

---

## 12. Using the tokens

```css
.card {
  background: var(--nymosSurfacePrimary);
  border: 1px solid var(--nymosBorderDefault);
  border-radius: var(--nymosRadiusLg);
  padding: var(--nymosSpace6);
  box-shadow: var(--nymosShadowSm);
}

.card__title {
  color: var(--nymosTextPrimary);
  font-size: var(--nymosFontSizeXl);
  font-weight: var(--nymosFontWeightSemibold);
}
```

**Rules**

1. Never hardcode a hex in a component.
2. Never read a ramp token (`--nymosPrimary500`) from a component — use `--nymosBrandPrimary`.
3. Every component ships light and dark in the same commit.
4. New token? Style Dictionary first, then this manual.

**Where things live**

| What | Path |
|---|---|
| Generated tokens (source of truth) | `frontend/src/styles/tokens/` |
| This manual, in writing | `design-os/docs/brand-manual.md` |
| Data behind the live page | `design-os/src/lib/brand-tokens.ts` |
| Live page | `design-os` → `/brand` |

---

## Known divergences (2026-08-14)

Recorded so nobody "fixes" the manual toward the wrong source:

1. **The `nymos-design-system` skill is stale.** `~/.claude/skills/nymos-design-system/references/tokens.md`
   declares primary `#00A8A8` (teal), secondary mint `#25D89B`, accent coral `#FF6A48`, and neutrals as a
   custom grey ramp. The shipped tokens use emerald `#10b981`, teal `#14b8a6`, purple `#6c5ce7`, slate.
   This manual follows the shipped tokens.
2. **Design OS product tokens are an approximation.** `product*/design-system/colors.json` says
   `teal / emerald / coral / slate` with DM Sans — that drives the prototype screens in this repo, not
   the product. The product is Plus Jakarta Sans + emerald-primary.
3. **Status chips do not invert in dark mode.** `dark.css` keeps `Status*Bg` at the 50 step and
   `Status*Text` at 700, so a status chip stays a light tinted chip on a dark surface. Deliberate or not,
   it is what ships — documented here rather than silently corrected.
