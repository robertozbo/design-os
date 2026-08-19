import type { ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { useCopy } from '@/lib/use-copy'

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

interface SectionProps {
  id: string
  number: string
  title: string
  intro?: string
  children: ReactNode
}

export function Section({ id, number, title, intro, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-14 border-t border-[var(--nymos-border)] first:border-t-0">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-mono text-xs text-[var(--nymos-brand)] tracking-widest">{number}</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--nymos-text)]">
          {title}
        </h2>
      </div>
      {intro && (
        <p className="text-[var(--nymos-text-2)] max-w-2xl leading-relaxed mb-8">{intro}</p>
      )}
      <div className="space-y-10">{children}</div>
    </section>
  )
}

export function SubSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--nymos-text-2)]">
          {title}
        </h3>
        {hint && <span className="text-xs text-[var(--nymos-text-3)]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-[var(--nymos-border)] bg-[var(--nymos-surface)] p-6 ${className}`}
    >
      {children}
    </div>
  )
}

/** Two-column do / don't block. */
export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border p-5" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: '#15803d' }}>
          Do
        </p>
        <ul className="space-y-2">
          {dos.map((d) => (
            <li key={d} className="text-sm leading-relaxed flex gap-2" style={{ color: '#14532d' }}>
              <span aria-hidden>✓</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border p-5" style={{ borderColor: '#f8c9cf', background: '#fdf2f4' }}>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: '#8e2130' }}>
          Don't
        </p>
        <ul className="space-y-2">
          {donts.map((d) => (
            <li key={d} className="text-sm leading-relaxed flex gap-2" style={{ color: '#54121c' }}>
              <span aria-hidden>✕</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Copy to clipboard                                                   */
/* ------------------------------------------------------------------ */

export function CodeChip({ value, label }: { value: string; label?: string }) {
  const { copied, copy } = useCopy()
  const isCopied = copied === value

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      title="Copy"
      className="group inline-flex items-center gap-1.5 rounded-md border border-[var(--nymos-border)] bg-[var(--nymos-surface-3)] px-2 py-1 font-mono text-[11px] text-[var(--nymos-text-2)] transition-colors hover:border-[var(--nymos-brand)] hover:text-[var(--nymos-text)]"
    >
      {label ?? value}
      {isCopied ? (
        <Check className="w-3 h-3" style={{ color: 'var(--nymos-brand)' }} strokeWidth={2.5} />
      ) : (
        <Copy className="w-3 h-3 opacity-40 group-hover:opacity-100" strokeWidth={2} />
      )}
    </button>
  )
}
