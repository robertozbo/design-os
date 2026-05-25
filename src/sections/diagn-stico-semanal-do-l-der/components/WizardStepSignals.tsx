import type { WeeklySignal } from '@/../product/sections/diagn-stico-semanal-do-l-der/types'
import { Activity, ArrowDown, ArrowRight, ArrowUp, Bell, Clock, Stethoscope } from 'lucide-react'

interface Props {
  signals: WeeklySignal[]
  signalNotes: Record<string, string>
  onChangeNote: (signalId: string, note: string) => void
}

const ICON_MAP = {
  clock: Clock,
  stethoscope: Stethoscope,
  bell: Bell,
  activity: Activity,
} as const

const CONCERN = {
  high: { label: 'Alta atenção', dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300', bar: 'bg-rose-500' },
  medium: { label: 'Atenção', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300', bar: 'bg-amber-500' },
  low: { label: 'Estável', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', bar: 'bg-emerald-500' },
} as const

export function WizardStepSignals({ signals, signalNotes, onChangeNote }: Props) {
  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
          Passo 1 de 3
        </div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Revise os sinais da semana
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Confira o que aconteceu com o time esta semana. Você pode adicionar uma nota privada por sinal — isso ajuda a fundamentar a observação no próximo passo.
        </p>
      </header>

      <div className="space-y-3">
        {signals.map((signal) => {
          const Icon = ICON_MAP[signal.icon as keyof typeof ICON_MAP] ?? Activity
          const tone = CONCERN[signal.concern]
          const ArrowIcon =
            signal.direction === 'up' ? ArrowUp : signal.direction === 'down' ? ArrowDown : ArrowRight
          const isWorsening = signal.direction === 'up'
          const deltaColor =
            signal.direction === 'flat'
              ? 'text-slate-500 dark:text-slate-400'
              : isWorsening
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'

          return (
            <article
              key={signal.id}
              className="
                relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/60
                border border-slate-200 dark:border-slate-800
                p-4 sm:p-5
              "
            >
              <span aria-hidden className={`absolute left-0 top-0 bottom-0 w-1 ${tone.bar}`} />

              <div className="flex items-start gap-4 pl-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Icon className="w-4 h-4" strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {signal.label}
                    </h3>
                    <span className={`text-[11px] font-medium ${tone.text} inline-flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                      {tone.label}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                      {signal.current}
                    </span>
                    <span className={`inline-flex items-center gap-0.5 text-sm font-semibold ${deltaColor}`}>
                      <ArrowIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                      <span className="tabular-nums">{Math.abs(signal.delta)}</span>
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      vs. {signal.previous} sem. anterior
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 ml-auto">
                      {signal.unit}
                    </span>
                  </div>

                  <div className="mt-3">
                    <label
                      htmlFor={`note-${signal.id}`}
                      className="block text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-1.5"
                    >
                      Nota sobre este sinal · opcional
                    </label>
                    <textarea
                      id={`note-${signal.id}`}
                      value={signalNotes[signal.id] ?? ''}
                      onChange={(e) => onChangeNote(signal.id, e.target.value)}
                      rows={2}
                      placeholder="O que pode ter influenciado este número?"
                      className="
                        w-full px-3 py-2 rounded-xl
                        bg-slate-50/60 dark:bg-slate-900/40
                        border border-slate-200 dark:border-slate-800
                        text-sm text-slate-700 dark:text-slate-200
                        placeholder:text-slate-400 dark:placeholder:text-slate-500
                        resize-none
                        focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                        transition
                      "
                    />
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
