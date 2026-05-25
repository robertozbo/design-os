import { MessageCircle } from 'lucide-react'
import type { MedicoVinculado } from '@/../product/sections/medication/types'

export type MedicationTimeframe = 'today' | 'week' | 'month'

const TIMEFRAMES: { id: MedicationTimeframe; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: 'Semana' },
  { id: 'month', label: 'Mês' },
]

interface Props {
  timeframe: MedicationTimeframe
  medicos: MedicoVinculado[]
  onTimeframeChange: (t: MedicationTimeframe) => void
  onFalarComMedico?: () => void
}

export function MedicationHeader({
  timeframe,
  medicos,
  onTimeframeChange,
  onFalarComMedico,
}: Props) {
  const principal = medicos[0]
  const multi = medicos.length > 1

  return (
    <div className="relative">
      {/* Halos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-20 -top-28 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.20)_0%,rgba(45,212,191,0)_60%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.16)_0%,rgba(20,184,166,0)_60%)]" />
        <div className="absolute -left-24 -top-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14)_0%,rgba(16,185,129,0)_60%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.14)_0%,rgba(5,150,105,0)_60%)]" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Left: eyebrow + title + subtitle */}
        <div className="nymos-reveal opacity-0" style={{ animationDelay: '0ms' }}>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">
            <span className="h-px w-6 bg-teal-500/60" />
            Medicação
          </div>
          <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight text-slate-900 dark:text-slate-50 md:text-[40px]">
            Sua medicação
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {principal ? (
              <>
                Prescrições do{' '}
                <span className="text-slate-700 dark:text-slate-300">
                  {principal.nome}
                </span>
                {' '}· sincronizado com Memed
                {multi && (
                  <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-400/10 dark:text-teal-300">
                    +{medicos.length - 1}
                  </span>
                )}
              </>
            ) : (
              'Sem médico vinculado'
            )}
          </p>
        </div>

        {/* Right: timeframe pill + CTA */}
        <div
          className="nymos-reveal flex items-center gap-2 self-start opacity-0 md:self-auto"
          style={{ animationDelay: '120ms' }}
        >
          <div
            className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100/80 p-1 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60"
            role="tablist"
            aria-label="Seletor de período"
          >
            {TIMEFRAMES.map((opt) => {
              const active = opt.id === timeframe
              return (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTimeframeChange(opt.id)}
                  className={`relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={onFalarComMedico}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          >
            <MessageCircle className="h-4 w-4" />
            Falar com médico
          </button>
        </div>
      </div>
    </div>
  )
}
