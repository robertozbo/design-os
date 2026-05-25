import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

export interface CardShellProps {
  eyebrow?: string
  title: string
  accent?: 'teal' | 'violet' | 'slate'
  meta?: ReactNode
  onNavigate?: () => void
  children: ReactNode
  className?: string
  revealIndex?: number
  padded?: boolean
}

const accentDot: Record<NonNullable<CardShellProps['accent']>, string> = {
  teal: 'bg-teal-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-400',
}

export function CardShell({
  eyebrow,
  title,
  accent = 'teal',
  meta,
  onNavigate,
  children,
  className = '',
  revealIndex = 0,
  padded = true,
}: CardShellProps) {
  const interactive = typeof onNavigate === 'function'
  return (
    <section
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0
        group relative flex flex-col
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-300 ease-out
        ${className}
      `}
    >
      <header className="flex items-start justify-between gap-4 p-5 pb-3">
        <div className="min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${accentDot[accent]}`}
                aria-hidden="true"
              />
              <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                {eyebrow}
              </span>
            </div>
          )}
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate">
            {title}
          </h3>
          {meta && (
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
              {meta}
            </div>
          )}
        </div>
        {interactive && (
          <button
            onClick={onNavigate}
            aria-label={`Open ${title}`}
            className="
              shrink-0 grid place-items-center
              w-8 h-8 rounded-lg
              text-slate-400 dark:text-slate-500
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:text-slate-700 dark:hover:text-slate-200
              transition-colors
            "
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </header>
      <div className={padded ? 'flex-1 px-5 pb-5' : 'flex-1'}>{children}</div>
    </section>
  )
}
