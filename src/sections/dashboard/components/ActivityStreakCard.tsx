import {
  Flame,
  ArrowUpRight,
  Footprints,
  Dumbbell,
  Sparkles,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import type {
  AccentColor,
  DashboardActivityStreak,
} from '@/../product/sections/dashboard/types'

export interface ActivityStreakCardProps {
  streak: DashboardActivityStreak
  revealIndex?: number
  onNavigate?: () => void
}

const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  dumbbell: Dumbbell,
  sparkles: Sparkles,
  activity: Activity,
}

const ACCENT_TINT: Record<AccentColor, { bg: string; fg: string }> = {
  rose: { bg: 'bg-rose-500/10 dark:bg-rose-400/10', fg: 'text-rose-600 dark:text-rose-300' },
  teal: { bg: 'bg-teal-500/10 dark:bg-teal-400/10', fg: 'text-teal-600 dark:text-teal-300' },
  violet: { bg: 'bg-violet-500/10 dark:bg-violet-400/10', fg: 'text-violet-600 dark:text-violet-300' },
  amber: { bg: 'bg-amber-500/10 dark:bg-amber-400/10', fg: 'text-amber-600 dark:text-amber-300' },
  emerald: { bg: 'bg-emerald-500/10 dark:bg-emerald-400/10', fg: 'text-emerald-600 dark:text-emerald-300' },
  indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-400/10', fg: 'text-indigo-600 dark:text-indigo-300' },
  purple: { bg: 'bg-purple-500/10 dark:bg-purple-400/10', fg: 'text-purple-600 dark:text-purple-300' },
  sky: { bg: 'bg-sky-500/10 dark:bg-sky-400/10', fg: 'text-sky-600 dark:text-sky-300' },
}

function formatRelative(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffH = (now.getTime() - d.getTime()) / 3_600_000
    if (diffH < 24) return 'Hoje'
    if (diffH < 48) return 'Ontem'
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return iso
  }
}

export function ActivityStreakCard({
  streak,
  revealIndex = 0,
  onNavigate,
}: ActivityStreakCardProps) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      style={{ animationDelay: `${80 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group flex flex-col text-left h-full
        rounded-2xl p-5
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        backdrop-blur-[2px]
        shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)]
        dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)]
        transition-[transform,box-shadow] duration-300 ease-out
        hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40
      "
    >
      <header className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Movimento
            </span>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Streak ativa
          </h3>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </header>

      <div className="flex items-baseline gap-3 mb-4">
        <div className="font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50 leading-none">
          {streak.currentDays}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          dias seguidos
        </div>
        <div className="ml-auto text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
          recorde: {streak.longestDays}d
        </div>
      </div>

      <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 dark:border-amber-400/20">
        <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
          Minutos ativos hoje
        </div>
        <div className="font-mono text-base font-semibold tabular-nums text-amber-700 dark:text-amber-300">
          {streak.activeMinutesToday} min
        </div>
      </div>

      <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
        Últimas sessões
      </div>
      <ul className="flex flex-col gap-1.5">
        {streak.lastSessions.slice(0, 3).map((s) => {
          const Icon = ICONS[s.icon] ?? Activity
          const tint = ACCENT_TINT[s.accent]
          return (
            <li key={s.id} className="flex items-center gap-2 min-w-0">
              <div
                className={`shrink-0 grid place-items-center w-7 h-7 rounded-lg ${tint.bg} ${tint.fg}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1">
                {s.label}
              </span>
              <span className="text-[10px] font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                {s.durationMin}min · {formatRelative(s.performedAt)}
              </span>
            </li>
          )
        })}
      </ul>
    </button>
  )
}
