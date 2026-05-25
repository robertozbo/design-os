import type {
  FaixaTamanho,
  FiltrosEmpregadores,
} from '@/../product/sections/empregadores/types'
import { SlidersHorizontal, X } from 'lucide-react'

interface AdvancedFiltersProps {
  open: boolean
  filtros: FiltrosEmpregadores
  onClose?: () => void
  onChange?: (filtros: FiltrosEmpregadores) => void
  onClear?: () => void
}

const FAIXAS: { value: FaixaTamanho; label: string }[] = [
  { value: 'ate_50', label: 'Até 50' },
  { value: '50_500', label: '50 – 500' },
  { value: '500_1000', label: '500 – 1.000' },
  { value: 'acima_1000', label: 'Acima de 1.000' },
]

export function AdvancedFilters({ open, filtros, onClose, onChange, onClear }: AdvancedFiltersProps) {
  if (!open) return null

  const set = (patch: Partial<FiltrosEmpregadores>) => onChange?.({ ...filtros, ...patch })

  const activeCount =
    (filtros.faixaTamanho ? 1 : 0) +
    (filtros.vigenciaAte ? 1 : 0) +
    (filtros.coberturaMinima !== null ? 1 : 0)

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
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Filtros avançados
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 text-[10px] font-mono tabular-nums">
              {activeCount}
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
            aria-label="Fechar filtros"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Faixa de tamanho
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FAIXAS.map((faixa) => {
              const active = filtros.faixaTamanho === faixa.value
              return (
                <button
                  key={faixa.value}
                  type="button"
                  onClick={() => set({ faixaTamanho: active ? null : faixa.value })}
                  className={`
                    px-2.5 py-1 rounded-lg text-[12px] font-medium ring-1 transition
                    ${
                      active
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60'
                        : 'bg-white/60 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  {faixa.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="vigencia-ate"
            className="block text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
          >
            Vigência NR-1 até
          </label>
          <input
            id="vigencia-ate"
            type="date"
            value={filtros.vigenciaAte ?? ''}
            onChange={(e) => set({ vigenciaAte: e.target.value || null })}
            className="
              w-full px-3 py-1.5 rounded-lg
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm font-mono text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition
            "
          />
        </div>

        <div>
          <label
            htmlFor="cobertura-minima"
            className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
          >
            <span>Cobertura mínima</span>
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300 normal-case tracking-normal">
              {filtros.coberturaMinima !== null ? `${Math.round(filtros.coberturaMinima * 100)}%` : 'Qualquer'}
            </span>
          </label>
          <input
            id="cobertura-minima"
            type="range"
            min={0}
            max={100}
            step={5}
            value={filtros.coberturaMinima !== null ? Math.round(filtros.coberturaMinima * 100) : 0}
            onChange={(e) => {
              const pct = Number(e.target.value)
              set({ coberturaMinima: pct === 0 ? null : pct / 100 })
            }}
            className="w-full accent-teal-600 dark:accent-teal-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
