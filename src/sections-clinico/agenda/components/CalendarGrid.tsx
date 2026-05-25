import { Video, MapPin, Zap } from 'lucide-react'
import type {
  Agendamento,
  Bloqueio,
  DiaSemana,
  StatusAgendamento,
  Modalidade,
} from '@/../product-clinico/sections/agenda/types'
import {
  HORAS_GRID,
  formatHora,
  formatHoraMin,
  formatDuracao,
  STATUS_BLOCK_STYLE,
  getDuracaoEntre,
  getIsoDia,
} from './helpers'

interface Props {
  diasSemana: DiaSemana[]
  agendamentos: Agendamento[]
  bloqueios: Bloqueio[]
  onClickSlotVazio?: (iso: string, hora: string) => void
  onClickAgendamento?: (id: string) => void
}

const SLOT_HEIGHT = 64 // px per hour

export function CalendarGrid({
  diasSemana,
  agendamentos,
  bloqueios,
  onClickSlotVazio,
  onClickAgendamento,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Days header */}
      <div
        className="sticky top-0 z-[2] grid border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        style={{ gridTemplateColumns: '64px repeat(7, minmax(120px, 1fr))' }}
      >
        <div className="border-r border-slate-200 dark:border-slate-800" />
        {diasSemana.map((d) => (
          <div
            key={d.iso}
            className={`
              flex flex-col items-center justify-center gap-0.5 border-r border-slate-200 py-3
              dark:border-slate-800
              ${d.ehHoje ? 'bg-teal-50/50 dark:bg-teal-950/20' : ''}
            `}
          >
            <span
              className={`
                text-[10px] font-semibold uppercase tracking-wider
                ${
                  d.ehHoje
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-slate-500 dark:text-slate-400'
                }
              `}
            >
              {d.label}
            </span>
            <span
              className={`
                inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums
                ${
                  d.ehHoje
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-700 dark:text-slate-200'
                }
              `}
            >
              {d.numero}
            </span>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div
        className="relative grid"
        style={{ gridTemplateColumns: '64px repeat(7, minmax(120px, 1fr))' }}
      >
        {/* Hours column */}
        <div className="border-r border-slate-200 dark:border-slate-800">
          {HORAS_GRID.map((h) => (
            <div
              key={h}
              className="border-b border-slate-100 px-2 pt-1 text-right text-[10px] font-mono tabular-nums text-slate-400 dark:border-slate-800 dark:text-slate-500"
              style={{ height: SLOT_HEIGHT }}
            >
              {formatHora(h)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {diasSemana.map((d) => {
          const agendamentosDoDia = agendamentos.filter(
            (a) => getIsoDia(a.iniciaEm) === d.iso,
          )
          const bloqueiosDoDia = bloqueios.filter((b) => getIsoDia(b.iniciaEm) === d.iso)

          return (
            <div
              key={d.iso}
              className={`
                relative border-r border-slate-200 dark:border-slate-800
                ${d.ehHoje ? 'bg-teal-50/20 dark:bg-teal-950/10' : ''}
              `}
            >
              {/* Empty slots (clickable) */}
              {HORAS_GRID.map((h) => (
                <button
                  key={h}
                  onClick={() => onClickSlotVazio?.(d.iso, formatHora(h))}
                  className="
                    block w-full border-b border-slate-100 transition-colors
                    hover:bg-teal-50/50
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-400
                    dark:border-slate-800 dark:hover:bg-teal-950/20
                  "
                  style={{ height: SLOT_HEIGHT }}
                  aria-label={`Slot vazio ${d.label} ${formatHora(h)}`}
                />
              ))}

              {/* Bloqueios */}
              {bloqueiosDoDia.map((b) => {
                const { horaIni, horaFim } = getDuracaoEntre(b.iniciaEm, b.duracaoMin)
                const top = (horaIni - HORAS_GRID[0]) * SLOT_HEIGHT
                const height = (horaFim - horaIni) * SLOT_HEIGHT
                if (top < 0) return null
                return (
                  <div
                    key={b.id}
                    className="
                      pointer-events-none absolute left-1 right-1 overflow-hidden rounded-md
                      border border-slate-300/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider
                      text-slate-500
                      dark:border-slate-700/60 dark:text-slate-500
                    "
                    style={{
                      top,
                      height,
                      backgroundImage:
                        'repeating-linear-gradient(45deg, rgba(148,163,184,0.10) 0, rgba(148,163,184,0.10) 6px, transparent 6px, transparent 12px)',
                    }}
                  >
                    {b.label}
                  </div>
                )
              })}

              {/* Agendamentos */}
              {agendamentosDoDia.map((a) => {
                const { horaIni, horaFim } = getDuracaoEntre(a.iniciaEm, a.duracaoMin)
                const top = (horaIni - HORAS_GRID[0]) * SLOT_HEIGHT
                const height = Math.max((horaFim - horaIni) * SLOT_HEIGHT - 4, 28)
                if (top < 0) return null
                return (
                  <AgendamentoBlock
                    key={a.id}
                    a={a}
                    top={top}
                    height={height}
                    onClick={() => onClickAgendamento?.(a.id)}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AgendamentoBlock({
  a,
  top,
  height,
  onClick,
}: {
  a: Agendamento
  top: number
  height: number
  onClick?: () => void
}) {
  const Modalidade =
    a.modalidade === 'tele'
      ? Video
      : MapPin

  return (
    <button
      onClick={onClick}
      className={`
        absolute left-1 right-1 z-[1] cursor-pointer overflow-hidden rounded-md
        px-2 py-1 text-left text-[11px] leading-tight
        shadow-sm transition-all hover:scale-[1.01] hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-teal-500
        ${STATUS_BLOCK_STYLE[a.status as StatusAgendamento]}
        ${a.isEncaixe ? '-rotate-[0.4deg]' : ''}
      `}
      style={{ top, height }}
      title={`${a.pacienteNome} · ${formatDuracao(a.duracaoMin)} · ${a.observacao || 'sem observação'}`}
    >
      <div className="flex items-center gap-1.5">
        <Modalidade className="size-3 shrink-0 opacity-70" />
        <span className="font-mono text-[10px] tabular-nums opacity-80">
          {formatHoraMin(a.iniciaEm)}
        </span>
        {a.isEncaixe && (
          <span
            className="
              inline-flex items-center gap-0.5 rounded-full bg-amber-400/90 px-1 py-0
              text-[8px] font-bold uppercase tracking-wider text-white
              dark:bg-amber-500
            "
            title="Encaixe"
          >
            <Zap className="size-2" />
          </span>
        )}
      </div>
      {height > 36 && (
        <p className="mt-0.5 truncate font-semibold">{a.pacienteNome.split(' ')[0]} {a.pacienteNome.split(' ').slice(-1)[0][0]}.</p>
      )}
      {height > 60 && a.observacao && (
        <p className="mt-0.5 line-clamp-2 text-[10px] opacity-75">{a.observacao}</p>
      )}
    </button>
  )
}

export type { Modalidade }
