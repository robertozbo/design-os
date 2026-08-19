import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Brain,
  Calendar,
  CheckCircle2,
  FileText,
  HeartPulse,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  TrendingUp,
  Upload,
  User,
} from 'lucide-react'
import {
  brandRamps,
  chartPalette,
  darkVars,
  fontFamilies,
  fontWeights,
  healthSemantics,
  lightVars,
  motionScale,
  radiusScale,
  semanticGroups,
  shadowScale,
  spacingScale,
  statusRamps,
  statusTokens,
  typeScale,
  zIndexScale,
  type Ramp,
} from '@/lib/brand-tokens'
import { NymosLockup, NymosMark } from '@/components/brand/NymosMark'
import { CodeChip, DoDont, Panel, Section, SubSection } from '@/components/brand/BrandUI'
import { useCopy } from '@/lib/use-copy'
import {
  AppSnippet,
  BrandAlert,
  BrandAvatar,
  BrandBadge,
  BrandButton,
  BrandInput,
  ChartSample,
  FeatureCard,
  HealthBar,
  MetricCard,
  Specimen,
} from '@/components/brand/BrandSpecimens'

const toc = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'voice', label: 'Voice & tone' },
  { id: 'logo', label: 'Logo' },
  { id: 'color', label: 'Colour' },
  { id: 'typography', label: 'Typography' },
  { id: 'space', label: 'Space & shape' },
  { id: 'icons', label: 'Iconography' },
  { id: 'components', label: 'Components' },
  { id: 'dataviz', label: 'Data viz' },
  { id: 'motion', label: 'Motion & depth' },
  { id: 'a11y', label: 'Accessibility' },
  { id: 'usage', label: 'Using the tokens' },
]

export function BrandPage() {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const vars = mode === 'light' ? lightVars : darkVars

  return (
    <div
      style={{ ...(vars as React.CSSProperties), fontFamily: fontFamilies.sans }}
      className="min-h-screen bg-[var(--nymos-bg)] text-[var(--nymos-text)] animate-fade-in"
    >
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--nymos-border)] bg-[var(--nymos-surface)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <Link
            to="/design"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--nymos-text-2)] transition-colors hover:text-[var(--nymos-text)]"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Design
          </Link>
          <span className="h-4 w-px bg-[var(--nymos-border)]" />
          <span className="text-sm font-semibold">Brand Manual</span>
          <span className="ml-auto flex items-center rounded-lg border border-[var(--nymos-border)] p-0.5">
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors"
                style={{
                  background: mode === m ? 'var(--nymos-brand)' : 'transparent',
                  color: mode === m ? '#ffffff' : 'var(--nymos-text-2)',
                }}
              >
                {m === 'light' ? <Sun className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />}
                {m}
              </button>
            ))}
          </span>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-5">
        {/* Table of contents */}
        <nav className="sticky top-20 hidden h-fit w-44 shrink-0 py-14 lg:block">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--nymos-text-3)]">
            Contents
          </p>
          <ul className="space-y-1">
            {toc.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex items-baseline gap-2 rounded-md px-2 py-1 text-sm text-[var(--nymos-text-2)] transition-colors hover:bg-[var(--nymos-surface-3)] hover:text-[var(--nymos-text)]"
                >
                  <span className="font-mono text-[10px] text-[var(--nymos-text-3)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <main className="min-w-0 flex-1 pb-24">
          <Hero />

          <Section
            id="foundation"
            number="01"
            title="Foundation"
            intro="Nymos puts a person's whole health record — wearables, exams, appointments, professionals — in one place, and makes it readable. Everything in this manual exists to make health data feel calm, trustworthy and understandable."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: 'Trust before delight',
                  body: 'This is medical data. Composure beats personality. No dark patterns, no gamified urgency, no fake progress.',
                },
                {
                  title: 'Clarity is the feature',
                  body: 'A number the patient understands is worth more than a chart that impresses. Explain the units, the range, the meaning.',
                },
                {
                  title: 'Calm under bad news',
                  body: 'A critical result must be unmistakable without being alarming. Colour states the fact; the copy states the next step.',
                },
              ].map((p) => (
                <Panel key={p.title}>
                  <p className="text-base font-semibold">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--nymos-text-2)]">{p.body}</p>
                </Panel>
              ))}
            </div>

            <SubSection title="Personality" hint="Where Nymos sits between two poles">
              <div className="space-y-4 rounded-xl border border-[var(--nymos-border)] bg-[var(--nymos-surface)] p-6">
                {[
                  { left: 'Clinical', right: 'Human', value: 62 },
                  { left: 'Playful', right: 'Serious', value: 72 },
                  { left: 'Dense', right: 'Spacious', value: 70 },
                  { left: 'Loud', right: 'Quiet', value: 78 },
                ].map((axis) => (
                  <div key={axis.left} className="flex items-center gap-4">
                    <span className="w-20 shrink-0 text-right text-xs text-[var(--nymos-text-3)]">
                      {axis.left}
                    </span>
                    <div className="relative h-1 flex-1 rounded-full bg-[var(--nymos-surface-3)]">
                      <span
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                        style={{
                          left: `${axis.value}%`,
                          width: 12,
                          height: 12,
                          background: 'var(--nymos-brand)',
                          boxShadow: '0 0 0 4px color-mix(in srgb, var(--nymos-brand) 18%, transparent)',
                        }}
                      />
                    </div>
                    <span className="w-20 shrink-0 text-xs font-medium">{axis.right}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          <Section
            id="voice"
            number="02"
            title="Voice & tone"
            intro="Portuguese (pt-BR) for patients and professionals; plain language always. The product speaks like a good clinician: direct, unhurried, never condescending."
          >
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: 'Empty state', bad: 'Nada por aqui ainda 😢', good: 'Você ainda não enviou exames. Envie o primeiro para ver sua evolução.' },
                { label: 'Error', bad: 'Erro 500 — falha inesperada', good: 'Não conseguimos salvar agora. Tente de novo em instantes.' },
                { label: 'Critical result', bad: '⚠️ ALERTA! Glicose PERIGOSA!', good: 'Glicose acima da faixa de referência. Vale conversar com seu médico.' },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-[var(--nymos-border)] overflow-hidden">
                  <p className="border-b border-[var(--nymos-border)] bg-[var(--nymos-surface-2)] px-4 py-2 text-xs font-semibold">
                    {c.label}
                  </p>
                  <div className="space-y-3 bg-[var(--nymos-surface)] p-4">
                    <p className="text-sm line-through" style={{ color: '#c93545' }}>
                      {c.bad}
                    </p>
                    <p className="text-sm text-[var(--nymos-text)]">{c.good}</p>
                  </div>
                </div>
              ))}
            </div>

            <DoDont
              dos={[
                'Say what happened and what to do next, in that order.',
                'Use the unit and the reference range next to every clinical number.',
                'Address the person directly: "seus exames", not "exames do usuário".',
                'Keep sentences under 20 words. One idea per sentence.',
              ]}
              donts={[
                'Never diagnose. Nymos surfaces data and suggests a conversation.',
                'No exclamation marks in clinical context. No emoji in results.',
                'No jargon without a plain-language gloss on first use.',
                'Never imply urgency to drive a click.',
              ]}
            />
          </Section>

          <Section
            id="logo"
            number="03"
            title="Logo"
            intro="One mark: an emerald squircle holding a white N. It reads at 16px in a browser tab and at 512px on a splash screen without changes."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Specimen label="Primary mark" spec="emerald #10b981 · radius 27%">
                <div className="flex items-center justify-center py-6">
                  <NymosMark size={112} />
                </div>
              </Specimen>
              <Specimen label="Lockup" spec="gap = 35% of mark height">
                <div className="flex h-full flex-col items-center justify-center gap-6 py-6">
                  <NymosLockup size={48} />
                  <NymosLockup size={40} tagline="Health OS" />
                </div>
              </Specimen>
            </div>

            <SubSection title="Variants" hint="Use brand emerald whenever the background allows it">
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: 'Brand', variant: 'brand' as const, bg: 'var(--nymos-surface-2)' },
                  { label: 'Mono dark', variant: 'mono-dark' as const, bg: '#ffffff' },
                  { label: 'Mono light', variant: 'mono-light' as const, bg: '#0f172a' },
                  { label: 'Outline', variant: 'outline' as const, bg: 'var(--nymos-surface-2)' },
                ].map((v) => (
                  <div key={v.label} className="rounded-xl border border-[var(--nymos-border)] overflow-hidden">
                    <div className="flex items-center justify-center py-8" style={{ background: v.bg }}>
                      <span style={{ color: v.variant === 'outline' ? 'var(--nymos-text)' : undefined }}>
                        <NymosMark size={56} variant={v.variant} />
                      </span>
                    </div>
                    <p className="border-t border-[var(--nymos-border)] bg-[var(--nymos-surface)] px-3 py-2 text-xs text-[var(--nymos-text-2)]">
                      {v.label}
                    </p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Clear space & minimum size">
              <div className="grid gap-4 md:grid-cols-2">
                <Specimen label="Clear space" spec="25% of the mark on every side">
                  <div className="flex items-center justify-center py-4">
                    <div
                      className="p-[20px]"
                      style={{
                        border: '1px dashed var(--nymos-border)',
                        borderRadius: 12,
                        background:
                          'repeating-linear-gradient(45deg, transparent, transparent 6px, color-mix(in srgb, var(--nymos-brand) 8%, transparent) 6px, color-mix(in srgb, var(--nymos-brand) 8%, transparent) 12px)',
                      }}
                    >
                      <NymosMark size={80} />
                    </div>
                  </div>
                </Specimen>
                <Specimen label="Minimum sizes" spec="24px digital · 8mm print">
                  <div className="flex items-end justify-center gap-6 py-6">
                    {[16, 24, 32, 48].map((s) => (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <NymosMark size={s} />
                        <span className="font-mono text-[10px] text-[var(--nymos-text-3)]">{s}px</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-xs text-[var(--nymos-text-3)]">
                    16px is favicon-only — the wordmark is dropped below 24px.
                  </p>
                </Specimen>
              </div>
            </SubSection>

            <DoDont
              dos={[
                'Place the mark on a solid surface with at least 4.5:1 contrast.',
                'Use mono-light on photography or dark clinical imagery.',
                'Keep the squircle radius — it is 27% of the side, not a circle.',
              ]}
              donts={[
                'Never recolour the N or gradient-fill the squircle.',
                'Never rotate, stretch, outline or add a drop shadow to the mark.',
                'Never lock the mark to another brand without a divider and equal height.',
              ]}
            />
          </Section>

          <Section
            id="color"
            number="04"
            title="Colour"
            intro="Emerald is the brand. Slate carries the interface. Everything else is either a status or a clinical reading — colour is never decorative."
          >
            <SubSection title="Brand ramps" hint="Click any swatch to copy the hex">
              <div className="space-y-6">
                {brandRamps.map((ramp) => (
                  <RampRow key={ramp.id} ramp={ramp} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Status ramps">
              <div className="space-y-6">
                {statusRamps.map((ramp) => (
                  <RampRow key={ramp.id} ramp={ramp} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Semantic tokens" hint="Components consume these, never the ramps directly">
              <div className="space-y-6">
                {semanticGroups.map((group) => (
                  <div key={group.id} className="overflow-hidden rounded-xl border border-[var(--nymos-border)]">
                    <div className="border-b border-[var(--nymos-border)] bg-[var(--nymos-surface-2)] px-4 py-2.5">
                      <p className="text-sm font-semibold">{group.title}</p>
                      <p className="text-xs text-[var(--nymos-text-2)]">{group.description}</p>
                    </div>
                    <table className="w-full bg-[var(--nymos-surface)] text-sm">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wide text-[var(--nymos-text-3)]">
                          <th className="px-4 py-2 text-left font-medium">Token</th>
                          <th className="px-4 py-2 text-left font-medium">Light</th>
                          <th className="px-4 py-2 text-left font-medium">Dark</th>
                          <th className="hidden px-4 py-2 text-left font-medium sm:table-cell">Use</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.tokens.map((t) => (
                          <tr key={t.token} className="border-t border-[var(--nymos-border-subtle)]">
                            <td className="px-4 py-2">
                              <CodeChip value={`--nymos${t.token[0].toUpperCase()}${t.token.slice(1)}`} />
                            </td>
                            <td className="px-4 py-2">
                              <TokenValue hex={t.light} />
                            </td>
                            <td className="px-4 py-2">
                              <TokenValue hex={t.dark} />
                            </td>
                            <td className="hidden px-4 py-2 text-[var(--nymos-text-2)] sm:table-cell">{t.use}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Health semantics" hint="Reserved for clinical readings — never for UI state">
              <div className="grid gap-4 sm:grid-cols-3">
                {healthSemantics.map((h) => (
                  <div
                    key={h.token}
                    className="rounded-xl border border-[var(--nymos-border)] bg-[var(--nymos-surface)] p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span style={{ width: 12, height: 12, borderRadius: 9999, background: h.hex }} />
                      <span className="text-sm font-semibold">{h.label}</span>
                    </div>
                    <p className="text-sm text-[var(--nymos-text-2)]">{h.use}</p>
                    <div className="mt-3">
                      <CodeChip value={`--nymos${h.token[0].toUpperCase()}${h.token.slice(1)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <DoDont
              dos={[
                'Fill exactly one primary action per screen with brand emerald.',
                'Pair every status colour with an icon and a label — colour alone fails colour-blind users.',
                'Use the subtle tints (50/100) for backgrounds, the 600/700 steps for text on them.',
              ]}
              donts={[
                'Never use emerald to mean "healthy" — that is success/semanticNormal.',
                'Never introduce a colour outside these ramps, including "just this once" for a chart.',
                'Never put brand emerald text on white below 16px — it fails AA at small sizes.',
              ]}
            />
          </Section>

          <Section
            id="typography"
            number="05"
            title="Typography"
            intro="Plus Jakarta Sans for everything a person reads. JetBrains Mono for values a machine produced — IDs, codes, raw measurements."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Specimen label="Plus Jakarta Sans" spec="--nymosFontFamilySans">
                <p className="text-5xl font-bold tracking-tight">Aa</p>
                <p className="mt-3 text-sm text-[var(--nymos-text-2)]">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 · mg/dL bpm mmHg
                </p>
              </Specimen>
              <Specimen label="JetBrains Mono" spec="--nymosFontFamilyMono">
                <p className="font-mono text-5xl font-bold" style={{ fontFamily: fontFamilies.mono }}>
                  Aa
                </p>
                <p className="mt-3 text-sm text-[var(--nymos-text-2)]" style={{ fontFamily: fontFamilies.mono }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 · #A17-2291-B
                </p>
              </Specimen>
            </div>

            <SubSection title="Type scale" hint="9 steps — nothing between them">
              <div className="divide-y divide-[var(--nymos-border-subtle)] overflow-hidden rounded-xl border border-[var(--nymos-border)] bg-[var(--nymos-surface)]">
                {typeScale.map((t) => (
                  <div key={t.token} className="flex items-baseline gap-4 px-5 py-4">
                    <span className="w-14 shrink-0 font-mono text-[11px] text-[var(--nymos-text-3)]">
                      {t.token}
                    </span>
                    <span
                      className="min-w-0 flex-1 truncate"
                      style={{
                        fontSize: t.size,
                        lineHeight: `${t.lineHeight}px`,
                        fontWeight: t.weight,
                        letterSpacing: t.tracking,
                      }}
                    >
                      Sua saúde em um só lugar
                    </span>
                    <span className="hidden w-40 shrink-0 text-right text-xs text-[var(--nymos-text-2)] md:block">
                      {t.use}
                    </span>
                    <span className="w-24 shrink-0 text-right font-mono text-[11px] text-[var(--nymos-text-3)]">
                      {t.size}/{t.lineHeight}
                    </span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Weights">
              <div className="grid gap-4 sm:grid-cols-4">
                {fontWeights.map((w) => (
                  <div key={w.token} className="rounded-xl border border-[var(--nymos-border)] bg-[var(--nymos-surface)] p-5">
                    <p className="text-2xl" style={{ fontWeight: w.value }}>
                      Nymos
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-[var(--nymos-text-3)]">{w.value}</p>
                    <p className="mt-1 text-xs text-[var(--nymos-text-2)]">{w.use}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <DoDont
              dos={[
                'Body copy is 16px. Anything smaller is a label, not prose.',
                'Tighten tracking (-0.025em) on 24px and above; leave it alone below.',
                'Set clinical values in mono when they are compared column to column.',
              ]}
              donts={[
                'No third typeface, ever — not for marketing, not for a report cover.',
                'No 300 weight: it disappears against light surfaces.',
                'No all-caps beyond 12px labels.',
              ]}
            />
          </Section>

          <Section
            id="space"
            number="06"
            title="Space & shape"
            intro="A 4px grid, six radii, five shadows. Consistency here is what makes screens built by different people look like one product."
          >
            <SubSection title="Spacing" hint="4px base — use the scale, never an arbitrary value">
              <div className="space-y-2 rounded-xl border border-[var(--nymos-border)] bg-[var(--nymos-surface)] p-5">
                {spacingScale.map((s) => (
                  <div key={s.token} className="flex items-center gap-4">
                    <span className="w-16 shrink-0 font-mono text-[11px] text-[var(--nymos-text-3)]">
                      space-{s.token}
                    </span>
                    {/* fixed 96px track (the largest step) keeps the px and use columns aligned */}
                    <span className="w-24 shrink-0">
                      <span
                        className="block h-3 rounded-sm"
                        style={{ width: s.px, background: 'var(--nymos-brand)', opacity: 0.85 }}
                      />
                    </span>
                    <span className="w-12 shrink-0 font-mono text-[11px] text-[var(--nymos-text-3)]">
                      {s.px}px
                    </span>
                    <span className="hidden text-xs text-[var(--nymos-text-2)] sm:block">{s.use}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Radius">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-6">
                {radiusScale.map((r) => (
                  <div key={r.token} className="text-center">
                    {/* square tiles — on a wide box the smaller radii are indistinguishable */}
                    <div
                      className="mx-auto mb-2 aspect-square w-full max-w-24 border-2"
                      style={{
                        borderRadius: r.px,
                        borderColor: 'var(--nymos-brand)',
                        background: 'color-mix(in srgb, var(--nymos-brand) 10%, transparent)',
                      }}
                    />
                    <p className="font-mono text-[11px] text-[var(--nymos-text)]">{r.token}</p>
                    <p className="text-[11px] text-[var(--nymos-text-3)]">{r.use}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Elevation">
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-5 rounded-xl bg-[var(--nymos-surface-2)] p-8">
                {shadowScale.map((s) => (
                  <div key={s.token} className="text-center">
                    <div
                      className="mx-auto mb-3 h-16 w-full rounded-lg bg-[var(--nymos-surface)]"
                      style={{ boxShadow: s.value, border: '1px solid var(--nymos-border-subtle)' }}
                    />
                    <p className="font-mono text-[11px]">{s.token}</p>
                    <p className="text-[11px] text-[var(--nymos-text-3)]">{s.use}</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          <Section
            id="icons"
            number="07"
            title="Iconography"
            intro="Lucide React, stroke 1.75, no fills. Icons clarify a label — they never replace one in navigation or clinical context."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Specimen label="Sizes" spec="16 · 20 · 24 · 32">
                <div className="flex items-end justify-center gap-8 py-4">
                  {[16, 20, 24, 32].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <HeartPulse style={{ width: s, height: s }} strokeWidth={1.75} />
                      <span className="font-mono text-[10px] text-[var(--nymos-text-3)]">{s}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-center text-xs text-[var(--nymos-text-3)]">
                  16 inside inputs and badges · 20 in buttons and lists · 24 in headers · 32 in empty states
                </p>
              </Specimen>
              <Specimen label="Gradient tile" spec="48px · radius-lg · white icon">
                <div className="flex items-center justify-center gap-4 py-4">
                  {[
                    { g: 'linear-gradient(135deg, #10b981, #14b8a6)', icon: <HeartPulse className="w-6 h-6" strokeWidth={1.75} /> },
                    { g: 'linear-gradient(135deg, #6c5ce7, #8b5cf6)', icon: <Brain className="w-6 h-6" strokeWidth={1.75} /> },
                    { g: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', icon: <FileText className="w-6 h-6" strokeWidth={1.75} /> },
                  ].map((t, i) => (
                    <span
                      key={i}
                      className="flex items-center justify-center text-white"
                      style={{ width: 48, height: 48, borderRadius: 12, background: t.g }}
                    >
                      {t.icon}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-center text-xs text-[var(--nymos-text-3)]">
                  Gradients live only in feature tiles — never behind text.
                </p>
              </Specimen>
            </div>

            <SubSection title="Core set" hint="One meaning, one icon, across the whole product">
              <div className="grid gap-3 grid-cols-3 sm:grid-cols-6">
                {[
                  { icon: HeartPulse, label: 'Metrics' },
                  { icon: FileText, label: 'Exams' },
                  { icon: Calendar, label: 'Appointments' },
                  { icon: TrendingUp, label: 'Progress' },
                  { icon: Brain, label: 'AI insight' },
                  { icon: Shield, label: 'Privacy' },
                  { icon: User, label: 'Profile' },
                  { icon: Bell, label: 'Alerts' },
                  { icon: Upload, label: 'Upload' },
                  { icon: Search, label: 'Search' },
                  { icon: Settings, label: 'Settings' },
                  { icon: CheckCircle2, label: 'Done' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-lg border border-[var(--nymos-border)] bg-[var(--nymos-surface)] py-4"
                  >
                    <Icon className="w-5 h-5 text-[var(--nymos-text-2)]" strokeWidth={1.75} />
                    <span className="text-[11px] text-[var(--nymos-text-3)]">{label}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          <Section
            id="components"
            number="08"
            title="Components"
            intro="The building blocks, in the states that actually ship. If a state is missing here, it is missing in the product too."
          >
            <Specimen label="Buttons" spec="height 32 / 40 / 48 · radius-md">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <BrandButton variant="primary">Primary</BrandButton>
                  <BrandButton variant="secondary">Secondary</BrandButton>
                  <BrandButton variant="ghost">Ghost</BrandButton>
                  <BrandButton variant="danger">Delete account</BrandButton>
                  <BrandButton disabled>Disabled</BrandButton>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <BrandButton size="sm">Small</BrandButton>
                  <BrandButton size="md">Medium</BrandButton>
                  <BrandButton size="lg">Large</BrandButton>
                  <BrandButton icon={<Upload className="w-4 h-4" strokeWidth={2} />}>With icon</BrandButton>
                </div>
                <p className="text-xs text-[var(--nymos-text-3)]">
                  One primary per screen. Destructive actions always ask for confirmation.
                </p>
              </div>
            </Specimen>

            <div className="grid gap-4 md:grid-cols-2">
              <Specimen label="Inputs" spec="height 40 · radius-md · focus ring 3px">
                <div className="space-y-4">
                  <BrandInput label="E-mail" placeholder="voce@exemplo.com" />
                  <BrandInput label="Nome" value="Roberto Zboralski" state="focus" helper="Focused" />
                  <BrandInput
                    label="CPF"
                    value="000.000.000-00"
                    state="error"
                    helper="CPF inválido — confira os dígitos."
                  />
                  <BrandInput label="Plano" value="Free" state="disabled" />
                </div>
              </Specimen>

              <Specimen label="Badges" spec="radius-sm · xs / 500">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {statusTokens.map((s) => (
                      <BrandBadge key={s.id} status={s.id}>
                        {s.label}
                      </BrandBadge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusTokens.map((s) => (
                      <BrandBadge key={s.id} status={s.id} solid>
                        {s.label}
                      </BrandBadge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <BrandBadge status="info" pill>
                      Pill
                    </BrandBadge>
                    <BrandBadge status="success" pill>
                      Dentro da faixa
                    </BrandBadge>
                    <BrandBadge status="danger" pill>
                      Fora da faixa
                    </BrandBadge>
                  </div>
                  <div className="flex items-end gap-4 pt-2">
                    {[24, 32, 40, 48].map((s) => (
                      <BrandAvatar key={s} size={s} initials="RZ" />
                    ))}
                  </div>
                </div>
              </Specimen>
            </div>

            <Specimen label="Alerts" spec="radius-lg · icon 20 · status tokens">
              <div className="grid gap-3 md:grid-cols-2">
                <BrandAlert status="success" title="Exame enviado" description="Vamos avisar quando a leitura estiver pronta." />
                <BrandAlert status="info" title="Novo laudo disponível" description="Seu médico anexou um comentário ao hemograma." />
                <BrandAlert status="warning" title="Consentimento vence em 7 dias" description="Renove para manter o compartilhamento ativo." />
                <BrandAlert status="danger" title="Não foi possível sincronizar" description="Reconecte o Apple Health nas configurações." />
              </div>
            </Specimen>

            <Specimen label="Cards" spec="radius-lg · padding 24 · shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3">
                <FeatureCard
                  icon={<HeartPulse className="w-6 h-6" strokeWidth={1.75} />}
                  title="Métricas"
                  description="Wearables e medições manuais em uma linha do tempo só."
                  gradient="linear-gradient(135deg, #10b981, #14b8a6)"
                />
                <FeatureCard
                  icon={<FileText className="w-6 h-6" strokeWidth={1.75} />}
                  title="Exames"
                  description="PDF vira dado estruturado, com faixa de referência."
                  gradient="linear-gradient(135deg, #06b6d4, #0ea5e9)"
                />
                <FeatureCard
                  icon={<Brain className="w-6 h-6" strokeWidth={1.75} />}
                  title="Leitura por IA"
                  description="Contexto em linguagem simples — nunca um diagnóstico."
                  gradient="linear-gradient(135deg, #6c5ce7, #8b5cf6)"
                />
              </div>
            </Specimen>

            <Specimen label="Metric cards & progress" spec="the clinical reading drives the colour">
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MetricCard label="Pressão" value="118/76" unit="mmHg" delta="Normal" status="normal" />
                  <MetricCard label="LDL" value="141" unit="mg/dL" delta="Atenção" status="attention" />
                  <MetricCard label="Glicose" value="187" unit="mg/dL" delta="Fora da faixa" status="alert" />
                </div>
                <div className="space-y-3">
                  <HealthBar value={72} status="normal" />
                  <HealthBar value={48} status="attention" />
                  <HealthBar value={22} status="alert" />
                </div>
              </div>
            </Specimen>

            <SubSection title="Everything together" hint="A screen assembled only from the tokens above">
              <AppSnippet />
            </SubSection>
          </Section>

          <Section
            id="dataviz"
            number="09"
            title="Data visualisation"
            intro="Health charts are read, not admired. Six series colours in a fixed order, one accent per chart, reference ranges always visible."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Specimen label="Series palette" spec="assign in order — never by taste">
                <div className="space-y-2">
                  {chartPalette.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <span className="w-4 font-mono text-[11px] text-[var(--nymos-text-3)]">{i + 1}</span>
                      <span className="h-4 w-10 rounded" style={{ background: c.hex }} />
                      <span className="font-mono text-[11px] text-[var(--nymos-text-2)]">{c.hex}</span>
                    </div>
                  ))}
                </div>
              </Specimen>
              <Specimen label="Bar chart" spec="4px top radius · 12px gap">
                <ChartSample />
              </Specimen>
            </div>

            <DoDont
              dos={[
                'Always draw the reference range as a shaded band behind the series.',
                'Label the axis with the unit (mg/dL, bpm) — never a bare number.',
                'Use dashes or markers as well as colour to separate series.',
              ]}
              donts={[
                'No 3D, no donut with more than four slices, no dual Y axis.',
                'No red/green as the only difference between two series.',
                'No truncated Y axis on clinical values — it exaggerates change.',
              ]}
            />
          </Section>

          <Section
            id="motion"
            number="10"
            title="Motion & depth"
            intro="Motion confirms that something happened. 200ms is the default; anything a person has to wait for gets a skeleton, not a spinner."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Specimen label="Transitions">
                <div className="space-y-2">
                  {motionScale.map((m) => (
                    <div key={m.token} className="flex items-baseline gap-3">
                      <CodeChip value={`--nymosTransition${m.token[0].toUpperCase()}${m.token.slice(1)}`} label={m.token} />
                      <span className="font-mono text-[11px] text-[var(--nymos-text-2)]">{m.value}</span>
                      <span className="text-xs text-[var(--nymos-text-3)]">{m.use}</span>
                    </div>
                  ))}
                </div>
              </Specimen>
              <Specimen label="Z-index">
                <div className="space-y-2">
                  {zIndexScale.map((z) => (
                    <div key={z.token} className="flex items-baseline gap-3">
                      <span className="w-20 font-mono text-[11px] text-[var(--nymos-text-2)]">{z.token}</span>
                      <span className="font-mono text-[11px] text-[var(--nymos-text-3)]">{z.value}</span>
                    </div>
                  ))}
                </div>
              </Specimen>
            </div>
            <p className="text-sm text-[var(--nymos-text-2)]">
              Respect <span className="font-mono text-xs">prefers-reduced-motion</span>: drop translation and
              scale, keep opacity.
            </p>
          </Section>

          <Section
            id="a11y"
            number="11"
            title="Accessibility"
            intro="WCAG 2.1 AA is the floor, not the goal. A person reading a bad result on a phone in a waiting room is the design target."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { t: 'Contrast', b: '4.5:1 for text, 3:1 for icons and borders that carry meaning. Verified in both themes.' },
                { t: 'Focus', b: 'Visible ring on every interactive element: 2px borderFocus plus a 3px 18%-alpha halo.' },
                { t: 'Targets', b: 'Minimum 44×44px touch target, even when the visual control is 32px.' },
                { t: 'Never colour alone', b: 'Every status carries an icon and a text label as well as its colour.' },
                { t: 'Motion', b: 'Honour prefers-reduced-motion; no auto-playing animation over data.' },
                { t: 'Language', b: 'Clinical terms get a plain-language gloss the first time they appear on a screen.' },
              ].map((r) => (
                <Panel key={r.t}>
                  <p className="text-sm font-semibold">{r.t}</p>
                  <p className="mt-1 text-sm text-[var(--nymos-text-2)]">{r.b}</p>
                </Panel>
              ))}
            </div>
          </Section>

          <Section
            id="usage"
            number="12"
            title="Using the tokens"
            intro="Tokens ship as CSS variables from Style Dictionary. Consume the semantic layer; the ramps are implementation detail."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Specimen label="CSS" spec="frontend/src/styles/tokens/">
                <pre
                  className="overflow-x-auto text-xs leading-relaxed text-[var(--nymos-text-2)]"
                  style={{ fontFamily: fontFamilies.mono }}
                >
{`.card {
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
}`}
                </pre>
              </Specimen>
              <Specimen label="Rules" spec="non-negotiable">
                <ul className="space-y-2 text-sm text-[var(--nymos-text-2)]">
                  {[
                    'Never hardcode a hex in a component.',
                    'Never read a ramp token (Primary500) from a component — use brandPrimary.',
                    'Every component ships light and dark on the same commit.',
                    'New token? It goes in Style Dictionary first, then this manual.',
                  ].map((r) => (
                    <li key={r} className="flex gap-2">
                      <span style={{ color: 'var(--nymos-brand)' }}>→</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </Specimen>
            </div>

            <Panel>
              <p className="text-sm font-semibold">Where things live</p>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--nymos-text-2)]">
                <li>
                  <span className="font-mono text-xs text-[var(--nymos-text)]">frontend/src/styles/tokens/</span> — generated
                  CSS/TS tokens (source of truth)
                </li>
                <li>
                  <span className="font-mono text-xs text-[var(--nymos-text)]">design-os/docs/brand-manual.md</span> — this
                  manual in writing
                </li>
                <li>
                  <span className="font-mono text-xs text-[var(--nymos-text)]">design-os/src/lib/brand-tokens.ts</span> — the
                  data behind this page
                </li>
              </ul>
            </Panel>
          </Section>
        </main>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <div className="py-16">
      <div className="flex flex-wrap items-center gap-6">
        <NymosMark size={88} />
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Brand Manual</h1>
          <p className="mt-2 max-w-xl text-lg text-[var(--nymos-text-2)]">
            Nymos Health — the tokens, the type, the components and the rules that keep every screen
            recognisably ours.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {['Emerald #10b981', 'Plus Jakarta Sans', '4px grid', 'WCAG 2.1 AA', 'Light + dark'].map((t) => (
          <span
            key={t}
            className="rounded-full border border-[var(--nymos-border)] bg-[var(--nymos-surface-2)] px-3 py-1 text-xs font-medium text-[var(--nymos-text-2)]"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Colour helpers                                                      */
/* ------------------------------------------------------------------ */

function RampRow({ ramp }: { ramp: Ramp }) {
  const { copied, copy } = useCopy()

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
        <p className="text-sm font-semibold">{ramp.name}</p>
        <p className="text-xs text-[var(--nymos-text-2)]">{ramp.role}</p>
      </div>
      <div className="flex gap-1 overflow-hidden rounded-lg">
        {ramp.scale.map((s) => {
          const isDarkStep = Number(s.step) >= 500
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => copy(s.hex)}
              title={`${s.hex}${s.note ? ` — ${s.note}` : ''}`}
              className="group relative flex-1 transition-transform hover:scale-[1.03]"
              style={{ background: s.hex, height: 72 }}
            >
              <span
                className="absolute inset-x-0 bottom-1 text-[10px] font-medium"
                style={{ color: isDarkStep ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.7)' }}
              >
                {copied === s.hex ? 'copied' : s.step}
              </span>
              {s.step === ramp.base && (
                <span
                  className="absolute inset-x-0 top-1.5 text-[9px] uppercase tracking-wide"
                  style={{ color: isDarkStep ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.55)' }}
                >
                  base
                </span>
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
        {ramp.scale
          .filter((s) => s.note)
          .map((s) => (
            <span key={s.step} className="text-[11px] text-[var(--nymos-text-3)]">
              <span className="font-mono">{s.step}</span> — {s.note}
            </span>
          ))}
      </div>
    </div>
  )
}

function TokenValue({ hex }: { hex: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block shrink-0 rounded"
        style={{ width: 16, height: 16, background: hex, border: '1px solid var(--nymos-border)' }}
      />
      <span className="font-mono text-[11px] text-[var(--nymos-text-2)]">{hex}</span>
    </span>
  )
}
