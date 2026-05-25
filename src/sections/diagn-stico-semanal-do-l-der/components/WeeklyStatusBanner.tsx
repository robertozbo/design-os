import { AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import type { CurrentWeek } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'

interface Props {
  currentWeek: CurrentWeek
  onStartDiagnosis?: () => void
  onOpenDiagnosisDetail?: (id: string) => void
}

export function WeeklyStatusBanner({ currentWeek, onStartDiagnosis, onOpenDiagnosisDetail }: Props) {
  const isPending = currentWeek.diagnosisStatus === 'pending'

  if (isPending) {
    const deadline = new Date(currentWeek.diagnosisDeadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineMidnight = new Date(deadline)
    deadlineMidnight.setHours(0, 0, 0, 0)
    const diffMs = deadlineMidnight.getTime() - today.getTime()
    const daysUntil = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))

    return (
      <div
        style={{ animationDelay: '120ms' }}
        className="
          nymos-reveal opacity-0 relative overflow-hidden rounded-2xl
          border border-amber-200 dark:border-amber-900/60
          bg-gradient-to-br from-amber-50 via-amber-50/50 to-white
          dark:from-amber-950/40 dark:via-amber-950/20 dark:to-slate-950
        "
      >
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-amber-200/40 dark:bg-amber-700/20 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 md:p-6">
          <div className="flex items-start md:items-center gap-4 min-w-0">
            <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-[0_10px_24px_-8px_rgba(217,119,6,0.6)]">
              <AlertCircle className="w-5 h-5" strokeWidth={2.25} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-mono text-amber-700 dark:text-amber-400">
                <span className="relative inline-flex w-1.5 h-1.5">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-amber-500 nymos-pulse-dot text-amber-500" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber-500" />
                </span>
                Diagnóstico pendente
              </div>

              <p className="mt-1 text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 leading-snug">
                Registre o diagnóstico desta semana para cumprir a NR-1.
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 inline-flex items-center gap-1.5 flex-wrap">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                Prazo:{' '}
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {deadline.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                </span>
                <span className="text-amber-700 dark:text-amber-400 font-medium tabular-nums">
                  · {daysUntil === 0 ? 'hoje' : `${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'} restantes`}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartDiagnosis}
            className="
              group self-start md:self-auto flex-shrink-0
              inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold
              shadow-[0_10px_24px_-8px_rgba(217,119,6,0.55)]
              active:scale-[0.98] transition
            "
          >
            Iniciar diagnóstico
            <ChevronRight className="w-4 h-4 -mr-1 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ animationDelay: '120ms' }}
      className="
        nymos-reveal opacity-0 rounded-2xl
        border border-emerald-200 dark:border-emerald-900/60
        bg-emerald-50/60 dark:bg-emerald-950/20
        px-5 py-4 flex items-center justify-between gap-4
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
          <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Diagnóstico desta semana registrado</div>
          {currentWeek.registeredAt && (
            <div className="text-xs text-slate-600 dark:text-slate-400">
              em{' '}
              {new Date(currentWeek.registeredAt).toLocaleString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>

      {currentWeek.registeredDiagnosisId && (
        <button
          type="button"
          onClick={() => onOpenDiagnosisDetail?.(currentWeek.registeredDiagnosisId!)}
          className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          Ver diagnóstico
          <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
        </button>
      )}
    </div>
  )
}
