import { MessageSquareQuote } from 'lucide-react'

interface Props {
  observation: string
  onChange: (value: string) => void
}

const STARTERS = [
  'Notei que o time...',
  'A equipe relatou...',
  'Conversei com X e percebi que...',
  'Houve um evento esta semana que...',
  'Observei queda de...',
]

const MIN_CHARS = 40

export function WizardStepObservation({ observation, onChange }: Props) {
  const chars = observation.length

  return (
    <div className="space-y-5">
      <header>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">
          Passo 2 de 3
        </div>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Qual sua observação geral do time?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Com base nos sinais e nas suas conversas com o time, registre o que você observou nesta semana. Seja específico — o histórico vira evidência da NR-1.
        </p>
      </header>

      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          {STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => {
                const next = observation && !observation.endsWith(' ') ? `${observation} ${starter}` : `${observation}${starter}`
                onChange(next)
              }}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-violet-50 dark:bg-violet-950/40
                border border-violet-200 dark:border-violet-900/60
                text-[11px] font-medium text-violet-700 dark:text-violet-300
                hover:bg-violet-100 dark:hover:bg-violet-950/60 hover:-translate-y-0.5
                transition
              "
            >
              <MessageSquareQuote className="w-3 h-3" strokeWidth={2.25} />
              {starter}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={observation}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            placeholder="Descreva o que você observou no time esta semana — situações, conversas, sinais cruzados, contexto que ajude a explicar os números…"
            className="
              w-full px-4 py-3 rounded-2xl
              bg-white dark:bg-slate-900/60
              border border-slate-200 dark:border-slate-800
              text-base leading-relaxed text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              resize-y min-h-[200px]
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition
            "
          />

          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] font-mono tabular-nums">
            <span
              className={`
                ${
                  chars >= MIN_CHARS
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }
              `}
            >
              {chars} / {MIN_CHARS}+ caracteres
            </span>
          </div>
        </div>

        {chars > 0 && chars < MIN_CHARS && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            Adicione mais detalhes — observações curtas dificultam o diagnóstico ao longo do tempo.
          </p>
        )}
      </div>
    </div>
  )
}
