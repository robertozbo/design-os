import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, DoorOpen, Plus, Stethoscope, Video } from 'lucide-react'
import type {
  Agendamento,
  AgendaDia,
  VisaoAgenda,
} from '@/../product-medical-clinic/sections/agenda/types'
import { AVATAR_COR, BLOCO_COR, STATUS_META, dataExtenso, minutos } from './helpers'

const HORA_PX = 56 // altura de 1 hora no grid

interface Props {
  agenda: AgendaDia
  visao: VisaoAgenda
  onVisao: (v: VisaoAgenda) => void
  onDia: (delta: number) => void
  onHoje: () => void
  onNovo: () => void
  onAbrir: (a: Agendamento) => void
}

export function AgendaView({ agenda, visao, onVisao, onDia, onHoje, onNovo, onAbrir }: Props) {
  const base = minutos(agenda.horaInicio)
  const totalHoras = (minutos(agenda.horaFim) - base) / 60
  const horas = Array.from({ length: totalHoras + 1 }, (_, i) => base + i * 60)

  // O grid é de um dia só: descarta qualquer agendamento de outra data que venha na lista.
  const doDia = useMemo(
    () => agenda.agendamentos.filter((a) => a.data === agenda.data),
    [agenda.agendamentos, agenda.data],
  )

  const colunas = useMemo(() => {
    if (visao === 'medicos') {
      return agenda.medicos.map((m) => ({
        id: m.id,
        titulo: m.nome,
        subtitulo: m.especialidade,
        iniciais: m.iniciais,
        cor: m.cor,
        icone: 'medico' as const,
        itens: doDia.filter((a) => a.medicoId === m.id),
      }))
    }
    return agenda.salas.map((s) => ({
      id: s.id,
      titulo: s.nome,
      subtitulo: s.local,
      iniciais: '',
      cor: 'slate' as const,
      icone: 'sala' as const,
      itens: doDia.filter((a) => a.salaId === s.id),
    }))
  }, [agenda.medicos, agenda.salas, doDia, visao])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3 pl-16 lg:pl-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDia(-1)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Dia anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onHoje}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Hoje
          </button>
          <button
            onClick={() => onDia(1)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Próximo dia"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h1 className="ml-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {dataExtenso(agenda.data)}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <ToggleBtn ativo={visao === 'medicos'} onClick={() => onVisao('medicos')}>
              <Stethoscope className="h-3.5 w-3.5" /> Médicos
            </ToggleBtn>
            <ToggleBtn ativo={visao === 'salas'} onClick={() => onVisao('salas')}>
              <DoorOpen className="h-3.5 w-3.5" /> Salas
            </ToggleBtn>
          </div>
          <button
            onClick={onNovo}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" /> Novo agendamento
          </button>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-slate-200 bg-slate-50 px-6 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
        {Object.entries(STATUS_META).map(([k, m]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${m.dot}`} />
            {m.label}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5">
          <Video className="h-3 w-3" /> Teleconsulta
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-6 pl-16 lg:pl-0">
        <div className="flex min-w-max">
          {/* Coluna de horas */}
          <div className="sticky left-0 z-10 w-14 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="h-12 border-b border-slate-200 dark:border-slate-800" />
            {horas.slice(0, -1).map((h) => (
              <div
                key={h}
                className="relative border-b border-slate-100 text-right dark:border-slate-800/60"
                style={{ height: HORA_PX }}
              >
                <span className="absolute -top-2 right-2 text-[10px] font-mono text-slate-400">
                  {String(Math.floor(h / 60)).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Colunas de recursos */}
          {colunas.map((col) => (
            <div
              key={col.id}
              className="w-48 shrink-0 border-r border-slate-200 dark:border-slate-800"
            >
              {/* Cabeçalho da coluna */}
              <div className="sticky top-0 z-10 flex h-12 items-center gap-2 border-b border-slate-200 bg-white px-2.5 dark:border-slate-800 dark:bg-slate-950">
                {col.icone === 'medico' ? (
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${AVATAR_COR[col.cor]}`}
                  >
                    {col.iniciais}
                  </span>
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
                    <DoorOpen className="h-3.5 w-3.5" />
                  </span>
                )}
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {col.titulo}
                  </div>
                  <div className="truncate text-[10px] text-slate-400">{col.subtitulo}</div>
                </div>
              </div>

              {/* Trilha de horários com blocos */}
              <div className="relative" style={{ height: totalHoras * HORA_PX }}>
                {horas.slice(0, -1).map((h) => (
                  <div
                    key={h}
                    className="border-b border-slate-100 dark:border-slate-800/60"
                    style={{ height: HORA_PX }}
                  />
                ))}
                {col.itens.map((a) => {
                  const top = ((minutos(a.inicio) - base) / 60) * HORA_PX
                  const alt = ((minutos(a.fim) - minutos(a.inicio)) / 60) * HORA_PX
                  const st = STATUS_META[a.status]
                  return (
                    <button
                      key={a.id + col.id}
                      onClick={() => onAbrir(a)}
                      style={{ top, height: Math.max(alt, 22) }}
                      className={`absolute inset-x-1 overflow-hidden rounded-md border-l-[3px] px-1.5 py-1 text-left shadow-sm transition-all hover:z-20 hover:shadow-md ${BLOCO_COR[a.cor]} ${
                        st.esmaecido ? 'opacity-50 line-through decoration-1' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${st.dot}`} />
                        <span className="truncate text-[11px] font-semibold leading-none">
                          {a.pacienteNome}
                        </span>
                        {a.modalidade === 'tele' && <Video className="h-2.5 w-2.5 shrink-0" />}
                      </div>
                      <div className="mt-0.5 truncate text-[10px] opacity-80">
                        {a.inicio}–{a.fim}
                        {visao === 'salas' ? ` · ${a.especialidade}` : ''}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ToggleBtn({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
        ativo
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
      }`}
    >
      {children}
    </button>
  )
}
