import { ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type {
  Employer,
  InboxTab,
  NotificationType,
  NotificationUrgency,
} from '@/../product/sections/notifica-es-sst/types'
import { TYPE_META, URGENCY_TONE } from './utils'

interface FilterStripProps {
  tab: InboxTab
  tabCounts: Record<InboxTab, number>
  typeFilters: NotificationType[]
  urgencyFilters: NotificationUrgency[]
  employerFilter: string | null
  employers: Employer[]
  hasActiveFilters: boolean
  onChangeTab: (tab: InboxTab) => void
  onToggleType: (t: NotificationType) => void
  onToggleUrgency: (u: NotificationUrgency) => void
  onChangeEmployer: (id: string | null) => void
  onClearFilters: () => void
}

const TABS: { id: InboxTab; label: string }[] = [
  { id: 'unread', label: 'Não lidas' },
  { id: 'all', label: 'Todas' },
  { id: 'archived', label: 'Arquivadas' },
]

const TYPE_ORDER: NotificationType[] = ['vigencia', 'cobertura_baixa', 'prazo_vencendo', 'novo_perigo']
const URGENCY_ORDER: NotificationUrgency[] = ['critico', 'alto', 'medio', 'informativo']

export function FilterStrip({
  tab,
  tabCounts,
  typeFilters,
  urgencyFilters,
  employerFilter,
  employers,
  hasActiveFilters,
  onChangeTab,
  onToggleType,
  onToggleUrgency,
  onChangeEmployer,
  onClearFilters,
}: FilterStripProps) {
  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" className="flex items-center gap-1 -mx-1 overflow-x-auto pb-px">
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => onChangeTab(t.id)}
              className={`
                shrink-0 inline-flex items-center gap-2
                px-3.5 py-2 mx-1 rounded-lg
                text-sm font-medium
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                ${active
                  ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'}
              `}
            >
              {t.label}
              <span
                className={`
                  inline-flex items-center justify-center
                  text-[11px] font-semibold tabular-nums
                  rounded-full min-w-[20px] h-[18px] px-1.5
                  ${active
                    ? 'bg-white/15 dark:bg-slate-900/15 text-white dark:text-slate-900'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}
                `}
              >
                {tabCounts[t.id]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-500">
            Tipo
          </span>
          {TYPE_ORDER.map((t) => {
            const meta = TYPE_META[t]
            const active = typeFilters.includes(t)
            const Icon = meta.icon
            return (
              <button
                key={t}
                type="button"
                onClick={() => onToggleType(t)}
                aria-pressed={active}
                className={`
                  inline-flex items-center gap-1.5
                  px-2.5 py-1.5 rounded-full
                  text-xs font-medium
                  transition-all duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                  ${active
                    ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 ring-1 ring-teal-300 dark:ring-teal-700'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600'}
                `}
              >
                <Icon className="w-3 h-3" strokeWidth={2} />
                {meta.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-500">
            Urgência
          </span>
          {URGENCY_ORDER.map((u) => {
            const tone = URGENCY_TONE[u]
            const active = urgencyFilters.includes(u)
            return (
              <button
                key={u}
                type="button"
                onClick={() => onToggleUrgency(u)}
                aria-pressed={active}
                className={`
                  inline-flex items-center gap-1.5
                  px-2.5 py-1.5 rounded-full
                  text-xs font-medium
                  transition-all duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                  ${active
                    ? `${tone.badgeBg} ${tone.badgeText} ring-1 ${tone.ring.replace('ring-', 'ring-')}`
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300 dark:hover:ring-slate-600'}
                `}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
                {tone.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 lg:ml-auto">
          <EmployerSelect
            employers={employers}
            value={employerFilter}
            onChange={onChangeEmployer}
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="
                inline-flex items-center gap-1
                text-xs font-medium
                text-slate-500 dark:text-slate-400
                hover:text-rose-600 dark:hover:text-rose-400
                transition-colors duration-150
                focus:outline-none focus-visible:underline
              "
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface EmployerSelectProps {
  employers: Employer[]
  value: string | null
  onChange: (id: string | null) => void
}

function EmployerSelect({ employers, value, onChange }: EmployerSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const selected = employers.find((e) => e.id === value)

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
          Empregador
        </span>
        <span className="max-w-[180px] truncate">
          {selected ? selected.razaoSocial : 'Todos'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            absolute right-0 top-full mt-1.5 z-20
            min-w-[260px] py-1
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
            Todos os empregadores
          </button>
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
          {employers.map((e) => {
            const active = value === e.id
            return (
              <button
                key={e.id}
                role="option"
                aria-selected={active}
                type="button"
                onClick={() => { onChange(e.id); setOpen(false) }}
                className={`
                  w-full px-3 py-2 text-left
                  transition-colors duration-100
                  ${active
                    ? 'bg-teal-50 dark:bg-teal-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
              >
                <div className={`text-xs font-medium ${active ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}`}>
                  {e.razaoSocial}
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-500 mt-0.5">
                  {e.cnpj}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
