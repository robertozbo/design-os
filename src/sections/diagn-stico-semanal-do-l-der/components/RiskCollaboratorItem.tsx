import type { RiskCollaborator } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { ArrowUpRight, EyeOff } from 'lucide-react'

interface Props {
  collaborator: RiskCollaborator
  onOpen?: () => void
  onForward?: () => void
}

const RISK_STYLE: Record<
  RiskCollaborator['riskLevel'],
  { label: string; chip: string; dot: string; ring: string }
> = {
  critical: {
    label: 'Crítico',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dot: 'bg-rose-500',
    ring: 'ring-1 ring-rose-200 dark:ring-rose-900/40',
  },
  high: {
    label: 'Alto',
    chip: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900/60',
    dot: 'bg-amber-500',
    ring: '',
  },
  moderate: {
    label: 'Moderado',
    chip: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-900/60',
    dot: 'bg-violet-500',
    ring: '',
  },
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = now - then
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'há poucos minutos'
  if (hours < 24) return `há ${hours}h`
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  const weeks = Math.floor(days / 7)
  return `há ${weeks} sem.`
}

export function RiskCollaboratorItem({ collaborator, onOpen, onForward }: Props) {
  const style = RISK_STYLE[collaborator.riskLevel]
  const isCritical = collaborator.riskLevel === 'critical'

  return (
    <li
      className={`
        group relative px-5 py-4 transition
        hover:bg-slate-50/60 dark:hover:bg-slate-800/30
        ${isCritical ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex-shrink-0 w-9 h-9 rounded-xl
            bg-slate-100 dark:bg-slate-800/80
            flex items-center justify-center
            text-slate-500 dark:text-slate-400
            ${style.ring}
          `}
        >
          <EyeOff className="w-4 h-4" strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onOpen}
              className="text-sm font-mono font-semibold text-slate-900 dark:text-slate-100 hover:text-teal-700 dark:hover:text-teal-300 transition truncate text-left"
            >
              {collaborator.anonId}
            </button>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${style.chip}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {style.label}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {collaborator.signalSource}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-500">
            <span className="tabular-nums">
              {collaborator.weeksUnderObservation} {collaborator.weeksUnderObservation === 1 ? 'sem.' : 'sem.'} em obs.
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span>{relativeTime(collaborator.lastSignalAt)}</span>
          </div>

          {collaborator.leaderNotes && (
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed pl-2 border-l-2 border-slate-200 dark:border-slate-700">
              {collaborator.leaderNotes}
            </p>
          )}

          <div className="mt-2.5 flex items-center gap-3">
            <button
              type="button"
              onClick={onOpen}
              className="text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 transition"
            >
              Registrar acompanhamento
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={onForward}
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-200 transition"
            >
              Encaminhar ao SST
              <ArrowUpRight className="w-3 h-3" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
