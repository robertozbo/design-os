import { Users, Layers, Star } from 'lucide-react'
import type { MyProfessionalsStats } from '@/../product/sections/my-professionals/types'
import { ProfessionalAvatar } from './ProfessionalAvatar'

export interface HeroStatsProps {
  stats: MyProfessionalsStats
  revealStartIndex?: number
}

export function HeroStats({ stats, revealStartIndex = 2 }: HeroStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <StatCard
        revealIndex={revealStartIndex}
        icon={
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
            <Users className="w-4 h-4" />
          </div>
        }
        label="Total vinculados"
        value={
          <div className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50 leading-none">
            {stats.totalLinked}
          </div>
        }
      />
      <StatCard
        revealIndex={revealStartIndex + 1}
        icon={
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300">
            <Layers className="w-4 h-4" />
          </div>
        }
        label="Especialidades"
        value={
          <div className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50 leading-none">
            {stats.specialtiesCovered}
          </div>
        }
      />
      <StatCard
        revealIndex={revealStartIndex + 2}
        icon={
          stats.primary ? (
            <ProfessionalAvatar
              type={stats.primary.professionalType}
              fullName={stats.primary.name}
              size="sm"
            />
          ) : (
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-slate-500/10 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400">
              <Star className="w-4 h-4" />
            </div>
          )
        }
        label="Primário"
        value={
          stats.primary ? (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                {stats.primary.name}
              </div>
              <div className="text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500 dark:text-slate-400 truncate">
                {stats.primary.typeLabel}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400">Nenhum definido</div>
          )
        }
      />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  revealIndex,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  revealIndex: number
}) {
  return (
    <div
      style={{ animationDelay: `${80 * revealIndex}ms` }}
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
      {icon}
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 truncate">
          {label}
        </div>
        <div className="mt-1">{value}</div>
      </div>
    </div>
  )
}
