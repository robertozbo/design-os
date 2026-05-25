import { ArrowRight, Clock, Hourglass, Mail, Plug, Sparkles } from 'lucide-react'
import type { OperationalAlert } from '@/../product/sections/dashboard-nutri/types'

interface OperationalAlertItemProps {
  alert: OperationalAlert
  onAction?: () => void
}

const TYPE_ICON: Record<OperationalAlert['type'], typeof Clock> = {
  'unconfirmed-appointment': Clock,
  'unread-message': Mail,
  'ai-insight': Sparkles,
  'integration-disconnected': Plug,
  'plan-expiring': Hourglass,
}

const SEVERITY_TONE: Record<
  OperationalAlert['severity'],
  { ring: string; bg: string; icon: string }
> = {
  info: {
    ring: 'ring-slate-200 dark:ring-slate-700',
    bg: 'bg-slate-100 dark:bg-slate-800',
    icon: 'text-slate-700 dark:text-slate-300',
  },
  warning: {
    ring: 'ring-amber-200 dark:ring-amber-800',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    icon: 'text-amber-700 dark:text-amber-300',
  },
  critical: {
    ring: 'ring-orange-200 dark:ring-orange-800',
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    icon: 'text-orange-700 dark:text-orange-300',
  },
}

export function OperationalAlertItem({ alert, onAction }: OperationalAlertItemProps) {
  const tone = SEVERITY_TONE[alert.severity]
  const Icon = TYPE_ICON[alert.type]

  return (
    <article className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 ${tone.bg} ${tone.ring}`}
      >
        <Icon size={16} className={tone.icon} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{alert.title}</p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{alert.description}</p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="group/btn shrink-0 self-center inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-900/30"
      >
        {alert.actionLabel}
        <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
      </button>
    </article>
  )
}
