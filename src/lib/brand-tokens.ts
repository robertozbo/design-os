/**
 * Nymos Health — Brand tokens
 *
 * Source of truth: `frontend/src/styles/tokens/{light,dark}.css` (Style Dictionary
 * output, prefix `--nymos*`). Values here are transcribed from those files and
 * semantic references (`var(--nymosPrimary500)`) are resolved to hex so the brand
 * manual can render them without importing the product stylesheet.
 *
 * If the generated tokens change, update this file — the manual is a mirror, not
 * a second source.
 */

export interface Swatch {
  step: string
  hex: string
  note?: string
}

export interface Ramp {
  id: string
  name: string
  role: string
  /** Step that is the canonical "default" of the ramp */
  base: string
  scale: Swatch[]
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export const brandRamps: Ramp[] = [
  {
    id: 'primary',
    name: 'Primary — Emerald',
    role: 'The Nymos green. CTAs, active states, brand moments.',
    base: '500',
    scale: [
      { step: '50', hex: '#ecfdf5' },
      { step: '100', hex: '#d1fae5' },
      { step: '200', hex: '#a7f3d0' },
      { step: '300', hex: '#6ee7b7' },
      { step: '400', hex: '#34d399', note: 'Brand primary in dark mode' },
      { step: '500', hex: '#10b981', note: 'Brand primary in light mode' },
      { step: '600', hex: '#059669', note: 'Hover' },
      { step: '700', hex: '#047857' },
      { step: '800', hex: '#065f46' },
      { step: '900', hex: '#064e3b' },
    ],
  },
  {
    id: 'teal',
    name: 'Secondary — Teal',
    role: 'Supporting brand tone. Charts, secondary emphasis, health data.',
    base: '500',
    scale: [
      { step: '50', hex: '#f0fdfa' },
      { step: '100', hex: '#ccfbf1' },
      { step: '200', hex: '#99f6e4' },
      { step: '300', hex: '#5eead4' },
      { step: '400', hex: '#2dd4bf' },
      { step: '500', hex: '#14b8a6', note: 'Brand secondary' },
      { step: '600', hex: '#0d9488', note: 'Hover' },
      { step: '700', hex: '#0f766e' },
      { step: '800', hex: '#115e59' },
      { step: '900', hex: '#134e4a' },
    ],
  },
  {
    id: 'purple',
    name: 'Accent — Purple',
    role: 'AI, insights and notifications. Never a primary action.',
    base: '500',
    scale: [
      { step: '50', hex: '#faf5ff' },
      { step: '100', hex: '#f3e8ff' },
      { step: '200', hex: '#e9d5ff' },
      { step: '300', hex: '#d8b4fe' },
      { step: '400', hex: '#c084fc' },
      { step: '500', hex: '#6c5ce7', note: 'Brand accent — custom, not Tailwind' },
      { step: '600', hex: '#5a4bd4' },
      { step: '700', hex: '#4a3cb5' },
      { step: '800', hex: '#3a2e96' },
      { step: '900', hex: '#2a2077' },
    ],
  },
  {
    id: 'slate',
    name: 'Neutral — Slate',
    role: 'Every surface, border and piece of text. Cool grey, never warm.',
    base: '500',
    scale: [
      { step: '50', hex: '#f8fafc' },
      { step: '100', hex: '#f1f5f9' },
      { step: '200', hex: '#e2e8f0' },
      { step: '300', hex: '#cbd5e1' },
      { step: '400', hex: '#94a3b8' },
      { step: '500', hex: '#64748b' },
      { step: '600', hex: '#475569' },
      { step: '700', hex: '#334155' },
      { step: '800', hex: '#1e293b' },
      { step: '900', hex: '#0f172a' },
    ],
  },
]

export const statusRamps: Ramp[] = [
  {
    id: 'success',
    name: 'Success',
    role: 'Confirmations, metrics inside the reference range.',
    base: '500',
    scale: [
      { step: '50', hex: '#f0fdf4' },
      { step: '100', hex: '#dcfce7' },
      { step: '200', hex: '#bbf7d0' },
      { step: '300', hex: '#86efac' },
      { step: '400', hex: '#4ade80' },
      { step: '500', hex: '#22c55e' },
      { step: '600', hex: '#16a34a' },
      { step: '700', hex: '#15803d' },
      { step: '800', hex: '#166534' },
      { step: '900', hex: '#14532d' },
    ],
  },
  {
    id: 'warning',
    name: 'Warning',
    role: 'Attention, borderline results. Muted amber — never neon yellow.',
    base: '500',
    scale: [
      { step: '50', hex: '#fef9ee' },
      { step: '100', hex: '#fdf0d5' },
      { step: '200', hex: '#f9dda5' },
      { step: '300', hex: '#f3c46d' },
      { step: '400', hex: '#dfa03a' },
      { step: '500', hex: '#c47d0a', note: 'Custom — darker than Tailwind amber' },
      { step: '600', hex: '#a66808' },
      { step: '700', hex: '#885306' },
      { step: '800', hex: '#6a4105' },
      { step: '900', hex: '#4d2f04' },
    ],
  },
  {
    id: 'danger',
    name: 'Danger',
    role: 'Destructive actions and critical clinical values.',
    base: '500',
    scale: [
      { step: '50', hex: '#fdf2f4' },
      { step: '100', hex: '#fce4e8' },
      { step: '200', hex: '#f8c9cf' },
      { step: '300', hex: '#f3a1ab' },
      { step: '400', hex: '#e16b7a' },
      { step: '500', hex: '#c93545', note: 'Custom — desaturated for clinical calm' },
      { step: '600', hex: '#ab2a39' },
      { step: '700', hex: '#8e2130' },
      { step: '800', hex: '#711a26' },
      { step: '900', hex: '#54121c' },
    ],
  },
  {
    id: 'info',
    name: 'Info',
    role: 'Neutral guidance, tips, system messages.',
    base: '500',
    scale: [
      { step: '50', hex: '#ecfeff' },
      { step: '100', hex: '#cffafe' },
      { step: '200', hex: '#a5f3fc' },
      { step: '300', hex: '#67e8f9' },
      { step: '400', hex: '#22d3ee' },
      { step: '500', hex: '#06b6d4' },
      { step: '600', hex: '#0891b2' },
      { step: '700', hex: '#0e7490' },
      { step: '800', hex: '#155e75' },
      { step: '900', hex: '#164e63' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Semantic tokens (resolved)                                          */
/* ------------------------------------------------------------------ */

export interface SemanticToken {
  token: string
  light: string
  dark: string
  use: string
}

export interface SemanticGroup {
  id: string
  title: string
  description: string
  tokens: SemanticToken[]
}

export const semanticGroups: SemanticGroup[] = [
  {
    id: 'surface',
    title: 'Surfaces',
    description: 'Every background in the product comes from one of these five.',
    tokens: [
      { token: 'surfaceBackground', light: '#ffffff', dark: '#0f172a', use: 'Page background' },
      { token: 'surfacePrimary', light: '#ffffff', dark: '#1e293b', use: 'Cards, modals' },
      { token: 'surfaceSecondary', light: '#f8fafc', dark: '#1e293b', use: 'Alternating sections' },
      { token: 'surfaceTertiary', light: '#f1f5f9', dark: '#334155', use: 'Highlighted rows, chips' },
      { token: 'surfaceElevated', light: '#ffffff', dark: '#1e293b', use: 'Dropdowns, popovers' },
    ],
  },
  {
    id: 'text',
    title: 'Text',
    description: 'Four levels of hierarchy. Anything below tertiary is not legible.',
    tokens: [
      { token: 'textPrimary', light: '#0f172a', dark: '#f8fafc', use: 'Headings, body' },
      { token: 'textSecondary', light: '#64748b', dark: '#cbd5e1', use: 'Supporting copy' },
      { token: 'textTertiary', light: '#94a3b8', dark: '#94a3b8', use: 'Placeholders, hints' },
      { token: 'textDisabled', light: '#cbd5e1', dark: '#475569', use: 'Disabled states' },
      { token: 'textInverse', light: '#ffffff', dark: '#0f172a', use: 'Text on solid brand fills' },
    ],
  },
  {
    id: 'border',
    title: 'Borders',
    description: '1px is the default. 2px only for focus.',
    tokens: [
      { token: 'borderDefault', light: '#e2e8f0', dark: '#334155', use: 'Cards, inputs' },
      { token: 'borderSubtle', light: '#f1f5f9', dark: '#1e293b', use: 'Dividers inside a card' },
      { token: 'borderStrong', light: '#cbd5e1', dark: '#475569', use: 'Emphasis, hover' },
      { token: 'borderFocus', light: '#10b981', dark: '#34d399', use: 'Focus ring' },
    ],
  },
  {
    id: 'brand',
    title: 'Brand',
    description: 'The only place brand colour is allowed to enter a component.',
    tokens: [
      { token: 'brandPrimary', light: '#10b981', dark: '#34d399', use: 'Primary CTA, active nav' },
      { token: 'brandPrimaryHover', light: '#059669', dark: '#6ee7b7', use: 'Hover' },
      { token: 'brandPrimarySubtle', light: '#ecfdf5', dark: '#064e3b', use: 'Tinted backgrounds' },
      { token: 'brandSecondary', light: '#14b8a6', dark: '#14b8a6', use: 'Secondary emphasis' },
      { token: 'brandAccent', light: '#6c5ce7', dark: '#6c5ce7', use: 'AI, insights, badges' },
    ],
  },
]

export interface StatusToken {
  id: string
  label: string
  bg: string
  border: string
  text: string
  icon: string
}

/** Status chips/alerts — identical in both themes by design (tinted light chip). */
export const statusTokens: StatusToken[] = [
  { id: 'success', label: 'Success', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: '#22c55e' },
  { id: 'warning', label: 'Warning', bg: '#fef9ee', border: '#f9dda5', text: '#885306', icon: '#c47d0a' },
  { id: 'danger', label: 'Danger', bg: '#fdf2f4', border: '#f8c9cf', text: '#8e2130', icon: '#c93545' },
  { id: 'info', label: 'Info', bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490', icon: '#06b6d4' },
  { id: 'neutral', label: 'Neutral', bg: '#f8fafc', border: '#e2e8f0', text: '#334155', icon: '#64748b' },
]

/** Health semantics — the clinical reading of a metric, never reused for UI state. */
export const healthSemantics = [
  { token: 'semanticNormal', hex: '#22c55e', label: 'Normal', use: 'Value inside the reference range' },
  { token: 'semanticAttention', hex: '#c47d0a', label: 'Attention', use: 'Borderline — worth a look' },
  { token: 'semanticAlert', hex: '#c93545', label: 'Alert', use: 'Outside range — act now' },
]

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export const fontFamilies = {
  sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
}

export interface TypeStep {
  token: string
  size: number
  lineHeight: number
  use: string
  weight: number
  tracking: string
}

export const typeScale: TypeStep[] = [
  { token: '5xl', size: 48, lineHeight: 48, use: 'Display — marketing only', weight: 700, tracking: '-0.025em' },
  { token: '4xl', size: 36, lineHeight: 40, use: 'Headline', weight: 700, tracking: '-0.025em' },
  { token: '3xl', size: 30, lineHeight: 36, use: 'Page title', weight: 600, tracking: '-0.025em' },
  { token: '2xl', size: 24, lineHeight: 32, use: 'Section title', weight: 600, tracking: '-0.025em' },
  { token: 'xl', size: 20, lineHeight: 28, use: 'Subtitle, card title', weight: 600, tracking: '0' },
  { token: 'lg', size: 18, lineHeight: 28, use: 'Large body, lead', weight: 400, tracking: '0' },
  { token: 'base', size: 16, lineHeight: 24, use: 'Body — the default', weight: 400, tracking: '0' },
  { token: 'sm', size: 14, lineHeight: 20, use: 'Captions, helper text', weight: 400, tracking: '0' },
  { token: 'xs', size: 12, lineHeight: 16, use: 'Labels, badges', weight: 500, tracking: '0.025em' },
]

export const fontWeights = [
  { token: 'regular', value: 400, use: 'Body copy' },
  { token: 'medium', value: 500, use: 'Labels, nav items' },
  { token: 'semibold', value: 600, use: 'Titles, buttons' },
  { token: 'bold', value: 700, use: 'Headlines, numbers that matter' },
]

/* ------------------------------------------------------------------ */
/* Space, shape, depth, motion                                         */
/* ------------------------------------------------------------------ */

export const spacingScale = [
  { token: '1', px: 4, use: 'Icon-to-label gap' },
  { token: '2', px: 8, use: 'Tight padding' },
  { token: '3', px: 12, use: 'Gap between elements' },
  { token: '4', px: 16, use: 'Default padding' },
  { token: '5', px: 20, use: '—' },
  { token: '6', px: 24, use: 'Card padding' },
  { token: '8', px: 32, use: 'Gap between sections' },
  { token: '10', px: 40, use: '—' },
  { token: '12', px: 48, use: 'Page margin' },
  { token: '16', px: 64, use: 'Block separation' },
  { token: '20', px: 80, use: '—' },
  { token: '24', px: 96, use: 'Large section break' },
]

export const radiusScale = [
  { token: 'sm', px: 4, use: 'Badges, chips' },
  { token: 'md', px: 8, use: 'Buttons, inputs' },
  { token: 'lg', px: 12, use: 'Cards' },
  { token: 'xl', px: 16, use: 'Modals' },
  { token: '2xl', px: 24, use: 'Featured cards, hero tiles' },
  { token: 'full', px: 9999, use: 'Avatars, pills' },
]

export const shadowScale = [
  { token: 'sm', value: '0 1px 2px rgba(0,0,0,0.05)', use: 'Resting card' },
  { token: 'md', value: '0 4px 6px -1px rgba(0,0,0,0.1)', use: 'Hovered card' },
  { token: 'lg', value: '0 10px 15px -3px rgba(0,0,0,0.1)', use: 'Dropdown, popover' },
  { token: 'xl', value: '0 20px 25px -5px rgba(0,0,0,0.1)', use: 'Modal' },
  { token: 'inner', value: 'inset 0 2px 4px rgba(0,0,0,0.05)', use: 'Pressed input' },
]

export const motionScale = [
  { token: 'fast', value: '150ms ease', use: 'Colour, opacity, hover' },
  { token: 'base', value: '200ms ease', use: 'The default for everything' },
  { token: 'slow', value: '300ms ease', use: 'Sheets, expanding panels' },
  { token: 'slower', value: '500ms ease', use: 'Page-level transitions only' },
]

export const zIndexScale = [
  { token: 'base', value: 0 },
  { token: 'dropdown', value: 10 },
  { token: 'sticky', value: 20 },
  { token: 'overlay', value: 30 },
  { token: 'modal', value: 40 },
  { token: 'toast', value: 50 },
  { token: 'tooltip', value: 60 },
]

/* ------------------------------------------------------------------ */
/* Data visualisation                                                  */
/* ------------------------------------------------------------------ */

export const chartPalette = [
  { name: 'Series 1', hex: '#10b981' },
  { name: 'Series 2', hex: '#14b8a6' },
  { name: 'Series 3', hex: '#6c5ce7' },
  { name: 'Series 4', hex: '#06b6d4' },
  { name: 'Series 5', hex: '#c47d0a' },
  { name: 'Series 6', hex: '#ec4899' },
]

/* ------------------------------------------------------------------ */
/* CSS variable maps used to theme the manual itself                   */
/* ------------------------------------------------------------------ */

type Vars = Record<string, string>

export const lightVars: Vars = {
  '--nymos-bg': '#ffffff',
  '--nymos-surface': '#ffffff',
  '--nymos-surface-2': '#f8fafc',
  '--nymos-surface-3': '#f1f5f9',
  '--nymos-text': '#0f172a',
  '--nymos-text-2': '#64748b',
  '--nymos-text-3': '#94a3b8',
  '--nymos-border': '#e2e8f0',
  '--nymos-border-subtle': '#f1f5f9',
  '--nymos-brand': '#10b981',
  '--nymos-brand-hover': '#059669',
  '--nymos-brand-subtle': '#ecfdf5',
  /* textInverse — what sits on top of a solid brand fill */
  '--nymos-on-brand': '#ffffff',
  '--nymos-secondary': '#14b8a6',
  '--nymos-accent': '#6c5ce7',
}

export const darkVars: Vars = {
  '--nymos-bg': '#0f172a',
  '--nymos-surface': '#1e293b',
  '--nymos-surface-2': '#1e293b',
  '--nymos-surface-3': '#334155',
  '--nymos-text': '#f8fafc',
  '--nymos-text-2': '#cbd5e1',
  '--nymos-text-3': '#94a3b8',
  '--nymos-border': '#334155',
  '--nymos-border-subtle': '#1e293b',
  '--nymos-brand': '#34d399',
  '--nymos-brand-hover': '#6ee7b7',
  '--nymos-brand-subtle': '#064e3b',
  /* textInverse — dark text on the lighter dark-mode brand fill */
  '--nymos-on-brand': '#0f172a',
  '--nymos-secondary': '#14b8a6',
  '--nymos-accent': '#6c5ce7',
}
