import type {
  FiltroSaudeNr1,
  FiltrosEstabelecimentos,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import { Activity, X, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'

interface SaudeFiltersProps {
  open: boolean
  filtros: FiltrosEstabelecimentos
  onClose?: () => void
  onChange?: (filtros: FiltrosEstabelecimentos) => void
  onClear?: () => void
}

const OPCOES: {
  value: FiltroSaudeNr1
  label: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    value: 'todos',
    label: 'Todos',
    description: 'Sem filtro de saúde NR-1',
    icon: <Activity className="w-3.5 h-3.5" strokeWidth={1.75} />,
  },
  {
    value: 'cobertura_abaixo',
    label: 'Cobertura abaixo de 65%',
    description: 'Estabelecimentos com cobertura inferior ao mínimo NR-1',
    icon: <ShieldQuestion className="w-3.5 h-3.5" strokeWidth={1.75} />,
  },
  {
    value: 'risco_critico',
    label: 'Risco crítico',
    description: 'Estabelecimentos com risco predominante crítico ou prioritário',
    icon: <ShieldAlert className="w-3.5 h-3.5" strokeWidth={1.75} />,
  },
  {
    value: 'em_dia',
    label: 'Em dia',
    description: 'Cobertura ≥ 65% e sem alertas críticos',
    icon: <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />,
  },
]

export function SaudeFilters({ open, filtros, onClose, onChange, onClear }: SaudeFiltersProps) {
  if (!open) return null

  const set = (saudeNr1: FiltroSaudeNr1) => onChange?.({ ...filtros, saudeNr1 })
  const isActive = filtros.saudeNr1 !== 'todos'

  return (
    <div
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        ring-1 ring-slate-200/80 dark:ring-slate-800
        p-4
      "
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            <Activity className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Filtro de saúde NR-1
          </span>
          {isActive && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 text-[10px] font-mono tabular-nums">
              1
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onClear}
            className="
              text-[12px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200
              px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="
              inline-flex items-center justify-center w-7 h-7 rounded-lg
              text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {OPCOES.map((op) => {
          const active = filtros.saudeNr1 === op.value
          return (
            <button
              key={op.value}
              type="button"
              onClick={() => set(op.value)}
              className={`
                flex flex-col items-start gap-1
                px-3 py-2.5 rounded-xl ring-1 text-left transition
                ${
                  active
                    ? 'bg-teal-50 ring-teal-200/60 dark:bg-teal-950/40 dark:ring-teal-900/60'
                    : 'bg-white/60 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }
              `}
            >
              <span
                className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${
                  active
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {op.icon}
                {op.label}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {op.description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
