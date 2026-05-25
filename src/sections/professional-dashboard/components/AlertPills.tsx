import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  HeartPulse,
  Info,
  Target,
} from 'lucide-react'
import type {
  AlertType,
  PatientAlert,
  Severity,
} from '@/../product/sections/professional-dashboard/types'

const severityPill: Record<Severity, string> = {
  critical:
    'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-900/50',
  warning:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-900/50',
  info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-900/50',
}

export const severityIcon: Record<Severity, typeof AlertTriangle> = {
  critical: AlertOctagon,
  warning: AlertTriangle,
  info: Info,
}

export const typeIcon: Record<AlertType, typeof Activity> = {
  'critical-biomarker': HeartPulse,
  'mood-decline': Activity,
  'low-adherence': AlertTriangle,
  'goal-at-risk': Target,
}

export const typeLabel: Record<AlertType, string> = {
  'critical-biomarker': 'Biomarcador',
  'mood-decline': 'Humor',
  'low-adherence': 'Adesão',
  'goal-at-risk': 'Meta',
}

interface AlertPillsProps {
  alerts: PatientAlert[]
  compact?: boolean
}

export function AlertPills({ alerts, compact = false }: AlertPillsProps) {
  if (alerts.length === 0) {
    return (
      <span className="inline-flex items-center text-xs text-slate-400 dark:text-slate-600">
        Sem alertas
      </span>
    )
  }

  // Use dominant severity to style the count pill; individual chips show type icons.
  const severityRank: Record<Severity, number> = { critical: 3, warning: 2, info: 1 }
  const dominant = alerts.reduce<Severity>(
    (acc, a) => (severityRank[a.severity] > severityRank[acc] ? a.severity : acc),
    'info'
  )

  if (compact) {
    const DomIcon = severityIcon[dominant]
    return (
      <span
        className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border
          ${severityPill[dominant]}
        `}
      >
        <DomIcon className="w-3 h-3" />
        <span className="tabular-nums">{alerts.length}</span>
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {alerts.map((a) => {
        const TypeIcon = typeIcon[a.type]
        return (
          <span
            key={a.id}
            title={`${typeLabel[a.type]} · ${a.label}`}
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border
              ${severityPill[a.severity]}
            `}
          >
            <TypeIcon className="w-3 h-3" />
            <span className="max-w-[160px] truncate">{a.label}</span>
          </span>
        )
      })}
    </div>
  )
}
