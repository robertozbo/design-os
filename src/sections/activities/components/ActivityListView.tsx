import type { Activity } from '@/../product/sections/activities/types'
import { ActivityIcon } from './ActivityIcon'
import { SourceBadge } from './SourceBadge'
import { ActivityActionsMenu } from './ActivityActionsMenu'

export interface ActivityListViewProps {
  activities: Activity[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

function formatPerformedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export function ActivityListView({ activities, onEdit, onDelete }: ActivityListViewProps) {
  return (
    <div
      className="
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        overflow-hidden
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
      "
    >
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/40">
          <tr className="text-left">
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Tipo / Nome
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:table-cell">
              Duração
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:table-cell text-right">
              Calorias
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden lg:table-cell">
              Fonte
            </th>
            <th className="px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Data
            </th>
            <th className="px-2 py-2.5" aria-label="Ações" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {activities.map((a) => {
            const isManual = a.source === 'manual'
            return (
              <tr
                key={a.id}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ActivityIcon
                      iconKey={a.activityType.icon}
                      categoryKey={a.activityType.categoryKey}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {a.activityType.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                        <span className="font-mono tabular-nums">{a.points}</span>
                        <span>pts</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{a.activityType.categoryLabel}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono tabular-nums hidden sm:table-cell">
                  {formatDuration(a.durationMinutes)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono tabular-nums hidden md:table-cell">
                  {a.caloriesBurned !== null ? (
                    <>
                      {a.caloriesBurned}
                      <span className="ml-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        kcal
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <SourceBadge source={a.source} label={a.sourceLabel} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono tabular-nums">
                  {formatPerformedAt(a.performedAt)}
                </td>
                <td className="px-2 py-3 w-10">
                  <ActivityActionsMenu
                    disabled={!isManual}
                    onEdit={() => onEdit?.(a.id)}
                    onDelete={() => onDelete?.(a.id)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
