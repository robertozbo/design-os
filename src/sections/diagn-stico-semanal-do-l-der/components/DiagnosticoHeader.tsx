import { ChevronRight, ClipboardCheck, Sparkles, Users } from 'lucide-react'
import type { Team, CurrentWeek } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'

interface Props {
  team: Team
  currentWeek: CurrentWeek
  onStartDiagnosis?: () => void
}

export function DiagnosticoHeader({ team, currentWeek, onStartDiagnosis }: Props) {
  const isPending = currentWeek.diagnosisStatus === 'pending'

  return (
    <header
      style={{ animationDelay: '60ms' }}
      className="nymos-reveal opacity-0 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
    >
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/70 dark:border-teal-900/60 text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
          <Sparkles className="w-3 h-3" strokeWidth={2.25} />
          NR-1 · Diagnóstico semanal do líder
        </div>

        <h1 className="mt-3 text-3xl sm:text-[34px] lg:text-[40px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.05]">
          {team.sectorName}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">{team.employerName}</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="tabular-nums">{team.headcount}</span> trabalhadores
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>
            Líder: <span className="text-slate-700 dark:text-slate-300">{team.leaderName}</span>
            <span className="text-slate-400 dark:text-slate-500"> · {team.leaderRole}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur">
          <div className="text-[10px] uppercase tracking-[0.18em] font-mono text-slate-500 dark:text-slate-400">
            Semana corrente
          </div>
          <div className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
            {currentWeek.weekLabel}
          </div>
        </div>

        <button
          type="button"
          onClick={onStartDiagnosis}
          className="
            group relative inline-flex items-center justify-center gap-2
            px-5 py-3 rounded-xl
            bg-slate-900 text-white dark:bg-teal-500 dark:text-slate-950
            font-semibold text-sm tracking-tight
            shadow-[0_14px_30px_-12px_rgba(15,23,42,0.45)] dark:shadow-[0_14px_30px_-12px_rgba(20,184,166,0.55)]
            hover:bg-slate-800 dark:hover:bg-teal-400
            active:scale-[0.98] transition
          "
        >
          <ClipboardCheck className="w-4 h-4" strokeWidth={2.25} />
          {isPending ? 'Iniciar diagnóstico' : 'Ver diagnóstico'}
          <ChevronRight
            className="w-4 h-4 -mr-1 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.25}
          />
        </button>
      </div>
    </header>
  )
}
