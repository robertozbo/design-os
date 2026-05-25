import type { ReactNode } from 'react'

// === Card ===

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  /** Slot rendered on the right side of the title row (e.g. status badge). */
  trailing?: ReactNode
  /** Use a more pronounced "danger" border (rose). */
  danger?: boolean
}

export function Card({ title, description, children, className = '', trailing, danger }: CardProps) {
  return (
    <section
      className={`
        rounded-2xl border bg-white dark:bg-slate-900/40
        ${danger
          ? 'border-rose-200/80 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10'
          : 'border-slate-200/80 dark:border-slate-800'}
        ${className}
      `}
    >
      {(title || description || trailing) && (
        <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div className="min-w-0">
            {title && (
              <h2 className={`text-sm font-semibold ${danger ? 'text-rose-700 dark:text-rose-300' : 'text-slate-900 dark:text-slate-50'}`}>
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </header>
      )}
      <div className="px-5 pb-5">{children}</div>
    </section>
  )
}

// === Switch ===

interface SwitchProps {
  checked: boolean
  onChange?: (next: boolean) => void
  /** When true, renders disabled style and ignores clicks. */
  disabled?: boolean
  ariaLabel?: string
}

export function Switch({ checked, onChange, disabled, ariaLabel }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked
          ? 'bg-teal-500 dark:bg-teal-500'
          : 'bg-slate-300 dark:bg-slate-700'}
      `}
    >
      <span
        className={`
          inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

// === Toggle row ===

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange?: (next: boolean) => void
  icon?: ReactNode
  disabled?: boolean
}

export function ToggleRow({ label, description, checked, onChange, icon, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      {icon && (
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 shrink-0">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 pt-0.5">
        <Switch checked={checked} onChange={onChange} disabled={disabled} ariaLabel={label} />
      </div>
    </div>
  )
}

// === Status badge ===

interface StatusBadgeProps {
  tone: 'emerald' | 'slate' | 'rose' | 'teal' | 'amber'
  children: ReactNode
  pulse?: boolean
}

const TONE_CLASSES: Record<StatusBadgeProps['tone'], string> = {
  emerald:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60',
  slate:
    'bg-slate-100 text-slate-600 ring-slate-200/60 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-700/60',
  rose:
    'bg-rose-50 text-rose-700 ring-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60',
  teal: 'bg-teal-50 text-teal-700 ring-teal-200/60 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/60',
  amber:
    'bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60',
}

export function StatusBadge({ tone, children, pulse }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
        text-[10px] font-semibold uppercase tracking-[0.12em] ring-1
        ${TONE_CLASSES[tone]}
      `}
    >
      <span
        className={`
          inline-block h-1.5 w-1.5 rounded-full bg-current
          ${pulse ? 'animate-pulse' : ''}
        `}
        aria-hidden
      />
      {children}
    </span>
  )
}

// === Section header (h2 inside main) ===

interface PanelHeaderProps {
  eyebrow: string
  title: string
  description?: string
}

export function PanelHeader({ eyebrow, title, description }: PanelHeaderProps) {
  return (
    <header className="mb-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
    </header>
  )
}

// === Save bar (sticky) ===

interface SaveBarProps {
  dirty: boolean
  onSave?: () => void
  onDiscard?: () => void
}

export function SaveBar({ dirty, onSave, onDiscard }: SaveBarProps) {
  if (!dirty) return null
  return (
    <div className="sticky bottom-4 z-30 mt-6">
      <div
        className="
          flex items-center justify-between gap-3 rounded-2xl
          border border-amber-200 bg-amber-50/95 px-4 py-3 shadow-lg backdrop-blur
          dark:border-amber-900/60 dark:bg-amber-950/70
        "
      >
        <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
          Você tem alterações não salvas
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-900/40"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
