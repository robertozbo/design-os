import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import type {
  EstadoTab,
  EstadoTabId,
  PacienteFiltro,
  TipoNotificacao,
  TipoOpcao,
  UrgenciaNotificacao,
  UrgenciaOpcao,
} from '@/../product/sections/notifica-es-nutri/types'
import { AVATAR_COLOR_CLASS } from './utils'

interface FilterStripProps {
  tabs: EstadoTab[]
  tabCounts: Record<EstadoTabId, number>
  activeTab: EstadoTabId
  onTabChange: (id: EstadoTabId) => void

  tiposOpcoes: TipoOpcao[]
  selectedTipos: TipoNotificacao[]
  onTiposChange: (tipos: TipoNotificacao[]) => void

  urgenciasOpcoes: UrgenciaOpcao[]
  selectedUrgencias: UrgenciaNotificacao[]
  onUrgenciasChange: (urgencias: UrgenciaNotificacao[]) => void

  pacientes: PacienteFiltro[]
  selectedPacienteId: string | null
  onPacienteChange: (id: string | null) => void

  hasActiveFilters: boolean
  onClearFilters: () => void
}

const URGENCY_DOT: Record<UrgenciaNotificacao, string> = {
  critica: 'bg-rose-400',
  alta: 'bg-amber-400',
  media: 'bg-teal-400',
  informativa: 'bg-slate-400',
}

export function FilterStrip({
  tabs,
  tabCounts,
  activeTab,
  onTabChange,
  tiposOpcoes,
  selectedTipos,
  onTiposChange,
  urgenciasOpcoes,
  selectedUrgencias,
  onUrgenciasChange,
  pacientes,
  selectedPacienteId,
  onPacienteChange,
  hasActiveFilters,
  onClearFilters,
}: FilterStripProps) {
  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Estado da inbox"
        className="
          flex w-fit gap-0.5 rounded-xl border border-slate-200/80 bg-white p-1 shadow-sm
          dark:border-slate-800 dark:bg-slate-900/40
        "
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id
          const count = tabCounts[tab.id]
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              className={`
                inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition
                ${active
                  ? 'bg-slate-900 text-white shadow dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}
              `}
            >
              {tab.label}
              <span
                className={`
                  rounded-full px-1.5 py-px text-[10px] font-mono tabular-nums
                  ${active
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}
                `}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <ChipGroup
          label="Tipo"
          options={tiposOpcoes.map((t) => ({ value: t.value, label: t.label }))}
          selected={selectedTipos}
          onToggle={(v) => {
            const next = (selectedTipos as string[]).includes(v as string)
              ? selectedTipos.filter((s) => (s as string) !== v)
              : [...selectedTipos, v as TipoNotificacao]
            onTiposChange(next)
          }}
        />

        <ChipGroup
          label="Urgência"
          options={urgenciasOpcoes.map((u) => ({
            value: u.value,
            label: u.label,
            dot: URGENCY_DOT[u.value],
          }))}
          selected={selectedUrgencias}
          onToggle={(v) => {
            const next = (selectedUrgencias as string[]).includes(v as string)
              ? selectedUrgencias.filter((s) => (s as string) !== v)
              : [...selectedUrgencias, v as UrgenciaNotificacao]
            onUrgenciasChange(next)
          }}
        />

        <PacienteDropdown
          pacientes={pacientes}
          selectedId={selectedPacienteId}
          onChange={onPacienteChange}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="
              inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium
              text-slate-500 hover:bg-slate-100 hover:text-slate-700
              dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
          >
            <X size={11} />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}

function ChipGroup<V extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string
  options: { value: V; label: string; dot?: string }[]
  selected: V[]
  onToggle: (value: V) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
        {label}
      </span>
      {options.map((opt) => {
        const active = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onToggle(opt.value)}
            className={`
              inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition
              ${active
                ? 'bg-teal-600 text-white dark:bg-teal-500'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
            `}
          >
            {opt.dot && <span className={`inline-block h-1.5 w-1.5 rounded-full ${opt.dot}`} />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function PacienteDropdown({
  pacientes,
  selectedId,
  onChange,
}: {
  pacientes: PacienteFiltro[]
  selectedId: string | null
  onChange: (id: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = pacientes.find((p) => p.id === selectedId)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition
          ${selected
            ? 'bg-teal-600 text-white dark:bg-teal-500'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}
        `}
      >
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-80">
          Paciente
        </span>
        {selected ? (
          <>
            <span
              className={`
                inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-semibold
                ${AVATAR_COLOR_CLASS[selected.corAvatar]}
              `}
            >
              {selected.iniciais}
            </span>
            <span>{selected.nome}</span>
          </>
        ) : (
          <span>Todos</span>
        )}
        <ChevronDown size={11} />
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            className="
              absolute left-0 top-full z-50 mt-1 max-h-72 min-w-[220px] overflow-y-auto rounded-xl
              border border-slate-200 bg-white shadow-lg
              dark:border-slate-800 dark:bg-slate-900
            "
          >
            <ul className="py-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                  className="
                    flex w-full items-center px-3 py-1.5 text-left text-xs
                    text-slate-700 hover:bg-teal-50 hover:text-teal-700
                    dark:text-slate-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-200
                  "
                >
                  Todos os pacientes
                </button>
              </li>
              <li className="my-1 border-t border-slate-200 dark:border-slate-800" />
              {pacientes.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(p.id)
                      setOpen(false)
                    }}
                    className="
                      flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs
                      text-slate-700 hover:bg-teal-50 hover:text-teal-700
                      dark:text-slate-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-200
                    "
                  >
                    <span
                      className={`
                        inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold
                        ${AVATAR_COLOR_CLASS[p.corAvatar]}
                      `}
                    >
                      {p.iniciais}
                    </span>
                    {p.nome}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
