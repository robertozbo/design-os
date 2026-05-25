import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import type {
  HealthPeriod,
  PeriodFilterValue,
  PeriodOption,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface PeriodFilterProps {
  value: PeriodFilterValue
  options: PeriodOption[]
  rangeLabel: string
  onChange: (next: PeriodFilterValue) => void
}

export function PeriodFilter({
  value,
  options,
  rangeLabel,
  onChange,
}: PeriodFilterProps) {
  const [from, setFrom] = useState(value.from ?? '')
  const [to, setTo] = useState(value.to ?? '')

  useEffect(() => {
    setFrom(value.from ?? '')
    setTo(value.to ?? '')
  }, [value.from, value.to])

  const isCustom = value.period === 'custom'

  function handlePeriodClick(period: HealthPeriod) {
    if (period === 'custom') {
      onChange({ period: 'custom', from: from || null, to: to || null })
    } else {
      onChange({ period, from: null, to: null })
    }
  }

  function applyCustom() {
    if (from && to) {
      onChange({ period: 'custom', from, to })
    }
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {options.map((opt) => {
            const active = value.period === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handlePeriodClick(opt.value)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {opt.value === 'custom' && <Calendar className="h-3 w-3" />}
                {opt.label}
              </button>
            )
          })}
        </div>
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {rangeLabel}
        </span>
      </div>

      {isCustom && (
        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-2xl border border-slate-200 bg-white/50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
          <label className="block flex-1 min-w-[140px]">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              De
            </span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <label className="block flex-1 min-w-[140px]">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Até
            </span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>
          <button
            type="button"
            onClick={applyCustom}
            disabled={!from || !to}
            className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  )
}
