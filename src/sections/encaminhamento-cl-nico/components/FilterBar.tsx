import { ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type {
  Instrument,
  SignalPriority,
} from '@/../product/sections/encaminhamento-cl-nico/types'
import { PRIORITY_TONE } from './utils'

interface FilterBarProps {
  sectors: string[]
  instruments: Instrument[]
  sectorFilter: string | null
  instrumentFilter: Instrument | null
  priorityFilters: SignalPriority[]
  onChangeSector: (s: string | null) => void
  onChangeInstrument: (i: Instrument | null) => void
  onTogglePriority: (p: SignalPriority) => void
  onClearAll: () => void
  hasActiveFilters: boolean
}

const PRIORITY_ORDER: SignalPriority[] = ['critico', 'alto', 'moderado']

export function FilterBar({
  sectors,
  instruments,
  sectorFilter,
  instrumentFilter,
  priorityFilters,
  onChangeSector,
  onChangeInstrument,
  onTogglePriority,
  onClearAll,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
      <Dropdown
        label="Setor"
        value={sectorFilter}
        valueLabel={sectorFilter ?? 'Todos'}
        options={sectors.map((s) => ({ id: s, label: s }))}
        onChange={onChangeSector}
      />
      <Dropdown
        label="Instrumento"
        value={instrumentFilter}
        valueLabel={instrumentFilter ?? 'Todos'}
        options={instruments.map((i) => ({ id: i, label: i }))}
        onChange={(v) => onChangeInstrument(v as Instrument | null)}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-500">
          Prioridade
        </span>
        {PRIORITY_ORDER.map((p) => {
          const tone = PRIORITY_TONE[p]
          const active = priorityFilters.includes(p)
          return (
            <button
              key={p}
              type="button"
              onClick={() => onTogglePriority(p)}
              aria-pressed={active}
              className={`
                inline-flex items-center gap-1.5
                px-2.5 py-1.5 rounded-full
                text-xs font-medium
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                ${active
                  ? `${tone.bg} ${tone.text} ring-1 ${tone.ring}`
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600'}
              `}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
              {tone.label}
            </button>
          )
        })}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="
            inline-flex items-center gap-1
            text-xs font-medium
            text-slate-500 dark:text-slate-400
            hover:text-rose-600 dark:hover:text-rose-400
            transition-colors duration-150
            sm:ml-auto
            focus:outline-none focus-visible:underline
          "
        >
          <X className="w-3 h-3" strokeWidth={2.5} />
          Limpar filtros
        </button>
      )}
    </div>
  )
}

interface DropdownProps<T extends string> {
  label: string
  value: T | null
  valueLabel: string
  options: { id: T; label: string }[]
  onChange: (v: T | null) => void
}

function Dropdown<T extends string>({ label, value, valueLabel, options, onChange }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const selected = value !== null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          inline-flex items-center gap-2
          px-3 py-1.5 rounded-lg
          text-xs font-medium
          bg-white dark:bg-slate-900
          ring-1 transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
          ${selected
            ? 'text-teal-700 dark:text-teal-300 ring-teal-300 dark:ring-teal-700'
            : 'text-slate-600 dark:text-slate-300 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600'}
        `}
      >
        <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-500">
          {label}
        </span>
        <span className="max-w-[180px] truncate">{valueLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            absolute left-0 top-full mt-1.5 z-20
            min-w-[220px] max-h-[280px] overflow-y-auto py-1
            bg-white dark:bg-slate-900
            rounded-lg ring-1 ring-slate-200 dark:ring-slate-700
            shadow-lg shadow-slate-900/5 dark:shadow-black/40
            animate-in fade-in slide-in-from-top-1 duration-150
          "
        >
          <button
            role="option"
            aria-selected={value === null}
            type="button"
            onClick={() => { onChange(null); setOpen(false) }}
            className={`
              w-full px-3 py-2 text-left text-xs
              transition-colors duration-100
              ${value === null
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
            `}
          >
            Todos
          </button>
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
          {options.map((opt) => {
            const active = value === opt.id
            return (
              <button
                key={opt.id}
                role="option"
                aria-selected={active}
                type="button"
                onClick={() => { onChange(opt.id); setOpen(false) }}
                className={`
                  w-full px-3 py-2 text-left text-xs
                  transition-colors duration-100
                  ${active
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
