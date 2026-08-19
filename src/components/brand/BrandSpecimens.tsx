import type { ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  HeartPulse,
  Info,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { chartPalette, statusTokens } from '@/lib/brand-tokens'

/* ------------------------------------------------------------------ */
/* Shared frame                                                        */
/* ------------------------------------------------------------------ */

export function Specimen({
  label,
  spec,
  children,
  className = '',
}: {
  label: string
  spec?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-[var(--nymos-border)] overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--nymos-border)] bg-[var(--nymos-surface-2)] px-4 py-2.5">
        <span className="text-xs font-semibold text-[var(--nymos-text)]">{label}</span>
        {spec && <span className="font-mono text-[11px] text-[var(--nymos-text-3)]">{spec}</span>}
      </div>
      <div className="bg-[var(--nymos-surface)] p-6">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonSizes: Record<ButtonSize, { padding: string; fontSize: number; height: number }> = {
  sm: { padding: '0 12px', fontSize: 14, height: 32 },
  md: { padding: '0 16px', fontSize: 14, height: 40 },
  lg: { padding: '0 24px', fontSize: 16, height: 48 },
}

export function BrandButton({
  variant = 'primary',
  size = 'md',
  disabled,
  children,
  icon,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  children: ReactNode
  icon?: ReactNode
}) {
  const s = buttonSizes[size]

  // brand colours come from the themed vars: emerald-500/white in light,
  // emerald-400/slate-900 in dark — matching --nymosBrandPrimary / --nymosTextInverse
  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: 'var(--nymos-brand)',
      color: 'var(--nymos-on-brand)',
      border: '1px solid transparent',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--nymos-brand)',
      border: '1px solid var(--nymos-brand)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--nymos-text-2)',
      border: '1px solid transparent',
    },
    danger: { background: '#c93545', color: '#ffffff', border: '1px solid transparent' },
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 hover:brightness-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
      style={{
        ...variants[variant],
        padding: s.padding,
        height: s.height,
        fontSize: s.fontSize,
        borderRadius: 8,
      }}
    >
      {icon}
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export function BrandBadge({
  status = 'success',
  children,
  solid = false,
  pill = false,
}: {
  status?: string
  children: ReactNode
  solid?: boolean
  pill?: boolean
}) {
  const t = statusTokens.find((s) => s.id === status) ?? statusTokens[0]

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold"
      style={{
        background: solid ? t.icon : t.bg,
        color: solid ? '#ffffff' : t.text,
        border: `1px solid ${solid ? 'transparent' : t.border}`,
        borderRadius: pill ? 9999 : 4,
      }}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Input                                                               */
/* ------------------------------------------------------------------ */

export function BrandInput({
  label,
  placeholder,
  helper,
  state = 'default',
  value,
  icon,
}: {
  label: string
  placeholder?: string
  helper?: string
  state?: 'default' | 'focus' | 'error' | 'disabled'
  value?: string
  icon?: ReactNode
}) {
  const border =
    state === 'error' ? '#c93545' : state === 'focus' ? '#10b981' : 'var(--nymos-border)'

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--nymos-text)]">{label}</label>
      <div
        className="flex items-center gap-2 px-3 transition-colors"
        style={{
          height: 40,
          borderRadius: 8,
          border: `1px solid ${border}`,
          background: state === 'disabled' ? 'var(--nymos-surface-3)' : 'var(--nymos-surface)',
          boxShadow: state === 'focus' ? '0 0 0 3px rgba(16,185,129,0.18)' : 'none',
          opacity: state === 'disabled' ? 0.6 : 1,
        }}
      >
        {icon}
        <span
          className="text-sm"
          style={{ color: value ? 'var(--nymos-text)' : 'var(--nymos-text-3)' }}
        >
          {value || placeholder}
        </span>
      </div>
      {helper && (
        <p className="text-xs" style={{ color: state === 'error' ? '#c93545' : 'var(--nymos-text-3)' }}>
          {helper}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Alerts                                                              */
/* ------------------------------------------------------------------ */

const alertIcons: Record<string, ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
  warning: <AlertTriangle className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
  danger: <XCircle className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
  info: <Info className="w-5 h-5 shrink-0" strokeWidth={1.75} />,
}

export function BrandAlert({
  status,
  title,
  description,
}: {
  status: 'success' | 'warning' | 'danger' | 'info'
  title: string
  description: string
}) {
  const t = statusTokens.find((s) => s.id === status)!

  return (
    <div
      className="flex gap-3 p-4"
      style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12 }}
    >
      <span style={{ color: t.icon }}>{alertIcons[status]}</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: t.text }}>
          {title}
        </p>
        <p className="text-sm mt-0.5" style={{ color: t.text, opacity: 0.85 }}>
          {description}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div
      className="group p-6 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'var(--nymos-surface)',
        border: '1px solid var(--nymos-border)',
        borderRadius: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="mb-4 flex items-center justify-center"
        style={{ width: 48, height: 48, borderRadius: 12, background: gradient, color: '#ffffff' }}
      >
        {icon}
      </div>
      <p className="text-base font-semibold text-[var(--nymos-text)]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--nymos-text-2)]">{description}</p>
    </div>
  )
}

export function MetricCard({
  label,
  value,
  unit,
  delta,
  status,
}: {
  label: string
  value: string
  unit: string
  delta: string
  status: 'normal' | 'attention' | 'alert'
}) {
  const colors = { normal: '#22c55e', attention: '#c47d0a', alert: '#c93545' }
  const color = colors[status]

  return (
    <div
      className="p-5"
      style={{
        background: 'var(--nymos-surface)',
        border: '1px solid var(--nymos-border)',
        borderRadius: 12,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--nymos-text-2)]">
          {label}
        </span>
        <span
          className="flex items-center justify-center"
          style={{ width: 28, height: 28, borderRadius: 8, background: `${color}1a`, color }}
        >
          <HeartPulse className="w-4 h-4" strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-[var(--nymos-text)]">{value}</span>
        <span className="text-sm text-[var(--nymos-text-2)]">{unit}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="inline-block" style={{ width: 6, height: 6, borderRadius: 9999, background: color }} />
        <span className="text-xs font-medium" style={{ color }}>
          {delta}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Avatars, progress, chart                                            */
/* ------------------------------------------------------------------ */

export function BrandAvatar({ size, initials }: { size: number; initials: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-semibold"
      style={{
        width: size,
        height: size,
        borderRadius: 9999,
        background: '#ecfdf5',
        color: '#047857',
        fontSize: size * 0.38,
        border: '1px solid #a7f3d0',
      }}
    >
      {initials}
    </span>
  )
}

export function HealthBar({ value, status }: { value: number; status: 'normal' | 'attention' | 'alert' }) {
  const colors = { normal: '#22c55e', attention: '#c47d0a', alert: '#c93545' }
  return (
    <div
      style={{ height: 8, borderRadius: 9999, background: 'var(--nymos-surface-3)', overflow: 'hidden' }}
    >
      <div
        style={{
          width: `${value}%`,
          height: '100%',
          borderRadius: 9999,
          background: colors[status],
          transition: 'width 300ms ease',
        }}
      />
    </div>
  )
}

export function ChartSample() {
  const series = [
    [42, 58, 51, 70, 64, 82],
    [30, 34, 46, 41, 55, 60],
  ]

  return (
    <div className="flex items-end gap-3" style={{ height: 140 }}>
      {series[0].map((v, i) => (
        // h-full is load-bearing: the bars size in %, so the wrapper needs a resolved height
        <div key={i} className="flex h-full flex-1 items-end gap-1">
          <div
            style={{
              flex: 1,
              height: `${v}%`,
              background: chartPalette[0].hex,
              borderRadius: '4px 4px 0 0',
            }}
          />
          <div
            style={{
              flex: 1,
              height: `${series[1][i]}%`,
              background: chartPalette[1].hex,
              borderRadius: '4px 4px 0 0',
            }}
          />
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Composed app snippet — how it all comes together                    */
/* ------------------------------------------------------------------ */

export function AppSnippet() {
  return (
    <div
      className="overflow-hidden"
      style={{ border: '1px solid var(--nymos-border)', borderRadius: 16, background: 'var(--nymos-bg)' }}
    >
      {/* top bar */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderBottom: '1px solid var(--nymos-border)', background: 'var(--nymos-surface)' }}
      >
        <span
          className="flex items-center justify-center font-bold text-white"
          style={{ width: 28, height: 28, borderRadius: 8, background: '#10b981', fontSize: 15 }}
        >
          N
        </span>
        <span className="text-sm font-bold tracking-tight text-[var(--nymos-text)]">Nymos</span>
        <div
          className="ml-4 hidden items-center gap-2 px-3 sm:flex"
          style={{
            height: 32,
            borderRadius: 8,
            border: '1px solid var(--nymos-border)',
            background: 'var(--nymos-surface-2)',
            minWidth: 200,
          }}
        >
          <Search className="w-3.5 h-3.5 text-[var(--nymos-text-3)]" strokeWidth={1.75} />
          <span className="text-xs text-[var(--nymos-text-3)]">Search exams, metrics…</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <BrandBadge status="info" pill>
            <Sparkles className="w-3 h-3" strokeWidth={2} /> AI insight
          </BrandBadge>
          <BrandAvatar size={28} initials="RZ" />
        </div>
      </div>

      {/* body */}
      <div className="space-y-4 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold tracking-tight text-[var(--nymos-text)]">
              Good morning, Roberto
            </h4>
            <p className="text-sm text-[var(--nymos-text-2)]">3 metrics updated since yesterday</p>
          </div>
          <BrandButton size="sm" icon={<ArrowUpRight className="w-4 h-4" strokeWidth={2} />}>
            New exam
          </BrandButton>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Resting HR" value="62" unit="bpm" delta="Within range" status="normal" />
          <MetricCard label="LDL" value="141" unit="mg/dL" delta="Above target" status="attention" />
          <MetricCard label="Glucose" value="187" unit="mg/dL" delta="Needs action" status="alert" />
        </div>

        <div
          className="flex gap-3 p-4"
          style={{ background: '#f5f3ff', border: '1px solid #e9d5ff', borderRadius: 12 }}
        >
          <span style={{ color: '#6c5ce7' }}>
            <Brain className="w-5 h-5 shrink-0" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#4a3cb5' }}>
              AI reading of your last panel
            </p>
            <p className="mt-0.5 text-sm" style={{ color: '#4a3cb5', opacity: 0.85 }}>
              Cholesterol trending up for 3 months. Worth discussing at your next appointment.
            </p>
          </div>
        </div>

        <div
          className="p-5"
          style={{ background: 'var(--nymos-surface)', border: '1px solid var(--nymos-border)', borderRadius: 12 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--nymos-text)]">Weekly activity</span>
            <Activity className="w-4 h-4 text-[var(--nymos-text-3)]" strokeWidth={1.75} />
          </div>
          <ChartSample />
        </div>
      </div>
    </div>
  )
}
