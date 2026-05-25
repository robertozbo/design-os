import { Bell, CheckCheck } from 'lucide-react'
import type { NotificationSummary } from '@/../product/sections/notifica-es-sst/types'

interface InboxHeaderProps {
  summary: NotificationSummary
  hasUnread: boolean
  onMarkAllRead?: () => void
}

export function InboxHeader({ summary, hasUnread, onMarkAllRead }: InboxHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-1 w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-200 dark:ring-teal-900/60 flex items-center justify-center">
            <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-[26px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Central de Notificações
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Caixa de entrada operacional da carteira NR-1 — vigências, coberturas, prazos e novos perigos.
            </p>
          </div>
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="
              group inline-flex items-center gap-2 self-start sm:self-auto
              px-3 py-2 rounded-lg
              text-xs font-medium tracking-wide
              text-slate-700 dark:text-slate-200
              bg-white dark:bg-slate-900
              ring-1 ring-slate-200 dark:ring-slate-700
              hover:ring-teal-400 dark:hover:ring-teal-500
              hover:text-teal-700 dark:hover:text-teal-300
              transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
            "
          >
            <CheckCheck className="w-3.5 h-3.5 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400" strokeWidth={2} />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SummaryChip
          label="críticas"
          value={summary.criticas}
          tone="rose"
          pulse={summary.criticas > 0}
        />
        <SummaryChip label="pendentes" value={summary.pendentes} tone="amber" />
        <SummaryChip label="arquivadas" value={summary.arquivadas} tone="slate" />
      </div>
    </header>
  )
}

interface SummaryChipProps {
  label: string
  value: number
  tone: 'rose' | 'amber' | 'slate'
  pulse?: boolean
}

const CHIP_TONE: Record<SummaryChipProps['tone'], { dot: string; ring: string; value: string; ringActive: string }> = {
  rose: {
    dot: 'bg-rose-500',
    ring: 'ring-rose-200 dark:ring-rose-900/60',
    ringActive: 'shadow-[0_0_0_4px_rgba(244,63,94,0.08)] dark:shadow-[0_0_0_4px_rgba(244,63,94,0.18)]',
    value: 'text-rose-700 dark:text-rose-300',
  },
  amber: {
    dot: 'bg-amber-500',
    ring: 'ring-amber-200 dark:ring-amber-900/60',
    ringActive: '',
    value: 'text-amber-700 dark:text-amber-300',
  },
  slate: {
    dot: 'bg-slate-400',
    ring: 'ring-slate-200 dark:ring-slate-700',
    ringActive: '',
    value: 'text-slate-700 dark:text-slate-300',
  },
}

function SummaryChip({ label, value, tone, pulse }: SummaryChipProps) {
  const t = CHIP_TONE[tone]
  return (
    <div
      className={`
        inline-flex items-center gap-2.5
        rounded-full px-3.5 py-1.5
        bg-white dark:bg-slate-900
        ring-1 ${t.ring}
        ${pulse ? t.ringActive : ''}
        transition-shadow duration-300
      `}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${t.dot} opacity-60 animate-ping`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${t.dot}`} />
      </span>
      <span className={`text-base font-semibold tabular-nums ${t.value}`}>{value}</span>
      <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
    </div>
  )
}
