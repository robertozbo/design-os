import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { VisaoAtual, VisaoTipo } from '@/../product-clinico/sections/agenda/types'

interface Props {
  visaoAtual: VisaoAtual
  onTrocarVisao?: (tipo: VisaoTipo) => void
  onNavegarPeriodo?: (direcao: -1 | 0 | 1) => void
  onCriarNovo?: () => void
}

const VISOES: { id: VisaoTipo; label: string }[] = [
  { id: 'dia', label: 'Dia' },
  { id: 'semana', label: 'Semana' },
  { id: 'mes', label: 'Mês' },
]

export function AgendaToolbar({
  visaoAtual,
  onTrocarVisao,
  onNavegarPeriodo,
  onCriarNovo,
}: Props) {
  return (
    <div
      className="
        sticky top-0 z-10
        flex flex-wrap items-center gap-3 border-b border-slate-200/80
        bg-white/85 px-4 py-3 backdrop-blur-md
        sm:px-6 lg:px-8
        dark:border-slate-800/80 dark:bg-slate-950/80
      "
    >
      <button
        onClick={() => onNavegarPeriodo?.(0)}
        className="
          rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700
          transition-colors hover:bg-slate-50
          focus:outline-none focus:ring-2 focus:ring-slate-300
          dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
          dark:focus:ring-slate-600
        "
      >
        Hoje
      </button>

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onNavegarPeriodo?.(-1)}
          className="
            rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900
            focus:outline-none focus:ring-2 focus:ring-slate-300
            dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
          "
          aria-label="Período anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={() => onNavegarPeriodo?.(1)}
          className="
            rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900
            focus:outline-none focus:ring-2 focus:ring-slate-300
            dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
          "
          aria-label="Próximo período"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {visaoAtual.labelPeriodo}
      </h2>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Visão segmented */}
      <div
        className="
          inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100/60 p-0.5
          dark:border-slate-800 dark:bg-slate-900/60
        "
        role="tablist"
        aria-label="Visualização"
      >
        {VISOES.map((v) => {
          const ativo = visaoAtual.tipo === v.id
          return (
            <button
              key={v.id}
              role="tab"
              aria-selected={ativo}
              onClick={() => onTrocarVisao?.(v.id)}
              className={`
                rounded-md px-3 py-1 text-xs font-medium transition-colors
                ${
                  ativo
                    ? 'text-teal-700 ring-1 ring-inset ring-teal-600/40 dark:text-teal-300 dark:ring-teal-400/40'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200'
                }
              `}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <button
        onClick={onCriarNovo}
        className="
          inline-flex items-center gap-1.5 rounded-lg
          bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm
          transition-all hover:bg-teal-500
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
          dark:focus:ring-offset-slate-950
        "
      >
        <Plus className="size-4" />
        Nova consulta
      </button>
    </div>
  )
}
