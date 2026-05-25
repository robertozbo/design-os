import { Activity, Calendar, Clock, Zap, type LucideIcon } from 'lucide-react'
import type { ActivityHeroStat } from '@/../product/sections/activities/types'

export interface HeroStatsProps {
  stats: ActivityHeroStat[]
  revealStartIndex?: number
}

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  calendar: Calendar,
  clock: Clock,
  zap: Zap,
}

function colorClasses(color: ActivityHeroStat['color']) {
  switch (color) {
    case 'teal':
      return {
        chip: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300',
        value: 'text-slate-900 dark:text-slate-50',
      }
    case 'emerald':
      return {
        chip: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300',
        value: 'text-slate-900 dark:text-slate-50',
      }
    case 'coral':
      return {
        chip: 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300',
        value: 'text-slate-900 dark:text-slate-50',
      }
    default:
      return {
        chip: 'bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300',
        value: 'text-slate-900 dark:text-slate-50',
      }
  }
}

export function HeroStats({ stats, revealStartIndex = 2 }: HeroStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => {
        const Icon = ICONS[stat.icon] ?? Activity
        const cls = colorClasses(stat.color)
        return (
          <div
            key={stat.id}
            style={{ animationDelay: `${80 * (revealStartIndex + i)}ms` }}
            className="
              nymos-reveal opacity-0
              flex items-center gap-3
              rounded-2xl
              bg-white/90 dark:bg-slate-900/80
              border border-slate-200/80 dark:border-slate-800
              backdrop-blur-[2px]
              shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
              dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
              p-4
            "
          >
            <div className={`shrink-0 grid place-items-center w-10 h-10 rounded-xl ${cls.chip}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 truncate">
                {stat.label}
              </div>
              <div className={`mt-0.5 font-mono text-xl font-semibold leading-none tracking-tight tabular-nums ${cls.value}`}>
                {stat.value}
                {stat.unit && (
                  <span className="ml-1 text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {stat.unit}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
