import { Clock, Flame, Zap } from 'lucide-react'
import type { Activity } from '@/../product/sections/activities/types'
import { ActivityIcon } from './ActivityIcon'
import { SourceBadge } from './SourceBadge'
import { ActivityActionsMenu } from './ActivityActionsMenu'

export interface ActivityGridViewProps {
  activities: Activity[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function formatDuration(min: number): string {
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h${m}`
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function ActivityGridView({ activities, onEdit, onDelete }: ActivityGridViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {activities.map((a) => {
        const isManual = a.source === 'manual'
        return (
          <article
            key={a.id}
            className="
              relative flex flex-col
              rounded-2xl
              bg-white/90 dark:bg-slate-900/80
              border border-slate-200/80 dark:border-slate-800
              backdrop-blur-[2px]
              shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
              dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
              transition-[transform,box-shadow] duration-300 ease-out
              hover:-translate-y-0.5
            "
          >
            <header className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
              <div className="flex items-center gap-3 min-w-0">
                <ActivityIcon
                  iconKey={a.activityType.icon}
                  categoryKey={a.activityType.categoryKey}
                  size="md"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 leading-tight truncate">
                    {a.activityType.label}
                  </h3>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {a.activityType.categoryLabel}
                  </div>
                </div>
              </div>
              <ActivityActionsMenu
                disabled={!isManual}
                onEdit={() => onEdit?.(a.id)}
                onDelete={() => onDelete?.(a.id)}
              />
            </header>

            <div className="px-4 pb-3 flex-1 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <Metric icon={Clock} label="Duração" value={formatDuration(a.durationMinutes)} />
                <Metric
                  icon={Flame}
                  label="Calorias"
                  value={a.caloriesBurned !== null ? `${a.caloriesBurned}` : '—'}
                  unit={a.caloriesBurned !== null ? 'kcal' : undefined}
                />
                <Metric icon={Zap} label="Pontos" value={`${a.points}`} accent />
              </div>

              {a.notes && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {a.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 mt-auto -mb-1">
                <SourceBadge source={a.source} label={a.sourceLabel} />
                <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {formatShortDate(a.performedAt)}
                </span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  unit,
  accent = false,
}: {
  icon: typeof Clock
  label: string
  value: string
  unit?: string
  accent?: boolean
}) {
  return (
    <div
      className={`
        rounded-lg px-2 py-1.5 border
        ${
          accent
            ? 'bg-teal-500/5 dark:bg-teal-400/5 border-teal-500/20 dark:border-teal-400/20'
            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
        }
      `}
    >
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
        <Icon className="w-2.5 h-2.5" />
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-0.5 flex items-baseline gap-0.5">
        <div
          className={`
            font-mono text-sm font-semibold leading-none tabular-nums
            ${accent ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}
          `}
        >
          {value}
        </div>
        {unit && (
          <div className="text-[9px] text-slate-500 dark:text-slate-400">{unit}</div>
        )}
      </div>
    </div>
  )
}
