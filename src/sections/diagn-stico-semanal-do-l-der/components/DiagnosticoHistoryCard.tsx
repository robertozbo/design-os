import type { DiagnosisHistoryEntry } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { Activity, ArrowRight, Bell, Calendar, ChevronRight, Clock, Stethoscope, Target } from 'lucide-react'

interface Props {
  diagnosis: DiagnosisHistoryEntry
  index: number
  isFirst?: boolean
  onOpen?: () => void
}

const STATUS_STYLE: Record<
  DiagnosisHistoryEntry['status'],
  { label: string; chip: string; dot: string }
> = {
  in_progress: {
    label: 'Em andamento',
    chip: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900/60',
    dot: 'bg-teal-500',
  },
  overdue: {
    label: 'Ação atrasada',
    chip: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60',
    dot: 'bg-rose-500',
  },
  completed: {
    label: 'Concluído',
    chip: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60',
    dot: 'bg-emerald-500',
  },
}

const SIGNAL_META = [
  { key: 'delaysAndAbsences' as const, label: 'Atrasos', icon: Clock, color: 'text-rose-600 dark:text-rose-400' },
  { key: 'sickLeaves' as const, label: 'Atestados', icon: Stethoscope, color: 'text-amber-600 dark:text-amber-400' },
  { key: 'nymosAlerts' as const, label: 'Alertas', icon: Bell, color: 'text-violet-600 dark:text-violet-400' },
  { key: 'presenteeism' as const, label: 'Presenteísmo', icon: Activity, color: 'text-teal-600 dark:text-teal-400' },
]

export function DiagnosticoHistoryCard({ diagnosis, index, isFirst, onOpen }: Props) {
  const status = STATUS_STYLE[diagnosis.status]

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{ animationDelay: `${260 + index * 70}ms` }}
      className="
        nymos-reveal opacity-0
        group block w-full text-left
        rounded-2xl bg-white dark:bg-slate-900/60
        border border-slate-200 dark:border-slate-800
        p-5 sm:p-6
        transition
        hover:border-teal-300 dark:hover:border-teal-800
        hover:shadow-[0_20px_44px_-22px_rgba(15,23,42,0.28)]
      "
    >
      <header className="flex flex-wrap items-center gap-3 mb-3">
        {isFirst && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-medium uppercase tracking-[0.16em]">
            Mais recente
          </span>
        )}

        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" strokeWidth={2.25} />
          <span className="text-base font-semibold tracking-tight">{diagnosis.weekLabel}</span>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.chip}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>

        <span className="ml-auto text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 tabular-nums">
          Registrado{' '}
          {new Date(diagnosis.registeredAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        {SIGNAL_META.map((meta) => {
          const Icon = meta.icon
          const value = diagnosis.signalsSnapshot[meta.key]
          return (
            <div key={meta.key} className="flex items-center gap-2 min-w-0">
              <Icon className={`w-3.5 h-3.5 ${meta.color}`} strokeWidth={2.25} />
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                {meta.label}
              </div>
              <div className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
                {value}
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-1">
            Observação
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-3">
            {diagnosis.observation}
          </p>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
          <Target className="w-4 h-4 mt-0.5 text-teal-600 dark:text-teal-400 flex-shrink-0" strokeWidth={2.25} />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Ação
            </div>
            <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
              {diagnosis.action}
            </p>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              Prazo:{' '}
              {new Date(diagnosis.deadline).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-4 flex items-center justify-between">
        <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          {diagnosis.registeredBy}
        </div>
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition">
          Abrir detalhe
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
        </span>
      </footer>
    </button>
  )
}

export const HistoryArrowRight = ArrowRight
