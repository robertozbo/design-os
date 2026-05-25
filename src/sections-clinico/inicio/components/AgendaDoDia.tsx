import { useState } from 'react'
import { Stethoscope, Video, MapPin, ChevronRight, Zap } from 'lucide-react'
import type {
  AgendaItem,
  StatusAgendamento,
} from '@/../product-clinico/sections/inicio/types'
import { STATUS_LABEL, STATUS_DOT, STATUS_TEXT } from './helpers'

type Filtro = 'todos' | 'pendentes' | 'realizados'

interface Props {
  agenda: AgendaItem[]
  proximoAgendamentoId?: string | null
  onAbrirConsulta?: (id: string) => void
  onIniciarConsulta?: (id: string) => void
  onFiltrar?: (f: Filtro) => void
}

const FILTROS: { id: Filtro; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'realizados', label: 'Realizados' },
]

export function AgendaDoDia({
  agenda,
  proximoAgendamentoId,
  onAbrirConsulta,
  onIniciarConsulta,
  onFiltrar,
}: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const filtrada = agenda.filter((a) => {
    if (filtro === 'pendentes') return ['pendente', 'confirmado'].includes(a.status)
    if (filtro === 'realizados') return a.status === 'realizado'
    return true
  })

  const setF = (f: Filtro) => {
    setFiltro(f)
    onFiltrar?.(f)
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-3 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Agenda de hoje
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {agenda.length} consultas · {agenda.filter((a) => a.status === 'realizado').length}{' '}
            realizadas
          </p>
        </div>
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50/60 p-0.5 dark:border-slate-800 dark:bg-slate-900/60">
          {FILTROS.map((f) => {
            const ativo = filtro === f.id
            return (
              <button
                key={f.id}
                onClick={() => setF(f.id)}
                className={`
                  rounded-md px-2.5 py-1 text-xs font-medium transition-colors
                  ${
                    ativo
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }
                `}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </header>

      {filtrada.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm italic text-slate-500 dark:text-slate-400">
          Nenhuma consulta com esse filtro.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filtrada.map((a) => (
            <Item
              key={a.id}
              a={a}
              ehProximo={a.id === proximoAgendamentoId}
              onAbrir={() => onAbrirConsulta?.(a.id)}
              onIniciar={() => onIniciarConsulta?.(a.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function Item({
  a,
  ehProximo,
  onAbrir,
  onIniciar,
}: {
  a: AgendaItem
  ehProximo: boolean
  onAbrir?: () => void
  onIniciar?: () => void
}) {
  const realizado = a.status === 'realizado'
  const Modalidade = a.modalidade === 'tele' ? Video : MapPin

  return (
    <li
      className={`
        relative flex items-center gap-3 px-5 py-3.5 transition-colors
        hover:bg-slate-50/60 dark:hover:bg-slate-800/40
        ${realizado ? 'opacity-70' : ''}
        ${ehProximo ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''}
      `}
    >
      {/* Status indicator vertical */}
      <span
        className={`absolute left-0 top-2 bottom-2 w-1 rounded-r ${
          ehProximo ? 'bg-teal-500' : ''
        }`}
        aria-hidden="true"
      />

      {/* Hour */}
      <div className="flex w-12 shrink-0 flex-col items-center">
        <span
          className={`
            font-mono text-sm font-semibold tabular-nums
            ${realizado ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}
          `}
        >
          {a.horaLabel}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-slate-400">
          {a.duracaoMin}min
        </span>
      </div>

      {/* Avatar */}
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-[10px] font-medium text-slate-700 shadow-sm dark:from-slate-700 dark:to-slate-800 dark:text-slate-200">
        {a.iniciais}
      </div>

      {/* Patient info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {a.pacienteNome}
          </p>
          {a.isEncaixe && (
            <span
              className="inline-flex items-center gap-0.5 rounded-full border border-amber-300/70 bg-amber-50 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
              title="Encaixe"
            >
              <Zap className="size-2" />
              encaixe
            </span>
          )}
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-0.5 capitalize">
            <Modalidade className="size-2.5" />
            {a.modalidade}
          </span>
          {a.condicoesCronicas.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate">{a.condicoesCronicas.join(' · ')}</span>
            </>
          )}
          {a.observacao && (
            <>
              <span aria-hidden="true">·</span>
              <span className="truncate italic">{a.observacao}</span>
            </>
          )}
        </p>
      </div>

      {/* Status */}
      <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
        <span className={`size-1.5 rounded-full ${STATUS_DOT[a.status as StatusAgendamento]}`} />
        <span
          className={`text-[10px] font-medium ${
            STATUS_TEXT[a.status as StatusAgendamento]
          }`}
        >
          {STATUS_LABEL[a.status as StatusAgendamento]}
        </span>
      </div>

      {/* Action */}
      <div className="flex shrink-0 items-center">
        {ehProximo && a.status !== 'realizado' ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onIniciar?.()
            }}
            className="
              inline-flex items-center gap-1 rounded-md bg-teal-600 px-2.5 py-1 text-[11px] font-medium text-white
              transition-colors hover:bg-teal-500
            "
          >
            <Stethoscope className="size-3" />
            Iniciar
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAbrir?.()
            }}
            className="
              rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
            aria-label="Abrir consulta"
          >
            <ChevronRight className="size-4" />
          </button>
        )}
      </div>
    </li>
  )
}
