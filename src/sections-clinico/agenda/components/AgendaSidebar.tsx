import { Check, X, Calendar, Video, MapPin, Stethoscope, ChevronRight, Filter } from 'lucide-react'
import type {
  Pendente,
  ProximaConsulta,
  FiltroAtivo,
  StatusAgendamento,
  Modalidade,
} from '@/../product-clinico/sections/agenda/types'
import { MiniCalendar } from './MiniCalendar'
import {
  formatHoraMin,
  formatDataCompacta,
  formatRelativo,
  STATUS_LABEL,
  STATUS_CHIP_STYLE,
  getIsoDia,
} from './helpers'

interface Props {
  isoFoco: string
  diasComConsulta: Set<string>
  pendentes: Pendente[]
  proximas: ProximaConsulta[]
  filtroAtivo: FiltroAtivo
  onSelecionarDia?: (iso: string) => void
  onConfirmarPendente?: (id: string) => void
  onRemarcarPendente?: (id: string) => void
  onCancelarPendente?: (id: string) => void
  onIniciarConsulta?: (id: string) => void
  onVerPaciente?: (id: string) => void
  onAplicarFiltro?: (f: FiltroAtivo) => void
  onLimparFiltros?: () => void
}

const STATUS_OPCOES: StatusAgendamento[] = [
  'pendente',
  'confirmado',
  'realizado',
  'cancelado',
  'faltou',
]

const MODALIDADE_OPCOES: { id: Modalidade; label: string; Icon: typeof Video }[] = [
  { id: 'presencial', label: 'Presencial', Icon: MapPin },
  { id: 'tele', label: 'Tele', Icon: Video },
]

export function AgendaSidebar({
  isoFoco,
  diasComConsulta,
  pendentes,
  proximas,
  filtroAtivo,
  onSelecionarDia,
  onConfirmarPendente,
  onRemarcarPendente,
  onCancelarPendente,
  onIniciarConsulta,
  onVerPaciente,
  onAplicarFiltro,
  onLimparFiltros,
}: Props) {
  const temFiltroAtivo =
    filtroAtivo.status.length > 0 ||
    filtroAtivo.modalidades.length > 0 ||
    filtroAtivo.pacienteIds.length > 0

  const toggleStatus = (s: StatusAgendamento) => {
    const novo = filtroAtivo.status.includes(s)
      ? filtroAtivo.status.filter((x) => x !== s)
      : [...filtroAtivo.status, s]
    onAplicarFiltro?.({ ...filtroAtivo, status: novo })
  }

  const toggleModalidade = (m: Modalidade) => {
    const novo = filtroAtivo.modalidades.includes(m)
      ? filtroAtivo.modalidades.filter((x) => x !== m)
      : [...filtroAtivo.modalidades, m]
    onAplicarFiltro?.({ ...filtroAtivo, modalidades: novo })
  }

  return (
    <aside className="flex flex-col gap-4">
      <MiniCalendar
        isoFoco={isoFoco}
        diasComConsulta={diasComConsulta}
        onSelecionarDia={onSelecionarDia}
      />

      {/* Pendentes */}
      <Section
        title="A confirmar"
        count={pendentes.length}
        icon={<Calendar className="size-3.5" />}
      >
        {pendentes.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500">Nenhum pendente 👌</p>
        ) : (
          <ul className="space-y-2">
            {pendentes.map((p) => (
              <li
                key={p.agendamentoId}
                className="rounded-lg border border-amber-200/70 bg-amber-50/50 p-2.5 dark:border-amber-900/50 dark:bg-amber-950/20"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {p.pacienteNome}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-600 dark:text-slate-400">
                      <span className="font-mono tabular-nums">
                        {formatDataCompacta(p.iniciaEm)} · {formatHoraMin(p.iniciaEm)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{p.modalidade}</span>
                      {p.isEncaixe && (
                        <span className="rounded bg-amber-200 px-1 text-[9px] font-bold uppercase text-amber-900 dark:bg-amber-700 dark:text-amber-100">
                          encaixe
                        </span>
                      )}
                    </p>
                    {p.observacao && (
                      <p className="mt-1 line-clamp-1 text-[10px] italic text-slate-500 dark:text-slate-500">
                        {p.observacao}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <button
                    onClick={() => onConfirmarPendente?.(p.agendamentoId)}
                    className="
                      inline-flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[10px] font-medium text-white
                      transition-colors hover:bg-teal-500
                    "
                  >
                    <Check className="size-3" />
                    Confirmar
                  </button>
                  <button
                    onClick={() => onRemarcarPendente?.(p.agendamentoId)}
                    className="
                      rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600
                      transition-colors hover:bg-slate-50
                      dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
                    "
                  >
                    Remarcar
                  </button>
                  <button
                    onClick={() => onCancelarPendente?.(p.agendamentoId)}
                    className="
                      rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600
                      dark:hover:bg-rose-950/40 dark:hover:text-rose-400
                    "
                    aria-label="Cancelar"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Filtros */}
      <Section title="Filtros" count={null} icon={<Filter className="size-3.5" />}>
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Status
            </p>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPCOES.map((s) => {
                const ativo = filtroAtivo.status.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    className={`
                      rounded-full px-2 py-0.5 text-[10px] font-medium transition-all
                      ${
                        ativo
                          ? `${STATUS_CHIP_STYLE[s]} ring-2 ring-offset-1 ring-slate-300 dark:ring-slate-700 dark:ring-offset-slate-900`
                          : `${STATUS_CHIP_STYLE[s]} opacity-50 hover:opacity-100`
                      }
                    `}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Modalidade
            </p>
            <div className="flex flex-wrap gap-1">
              {MODALIDADE_OPCOES.map(({ id, label, Icon }) => {
                const ativo = filtroAtivo.modalidades.includes(id)
                return (
                  <button
                    key={id}
                    onClick={() => toggleModalidade(id)}
                    className={`
                      inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all
                      ${
                        ativo
                          ? 'bg-teal-100 text-teal-800 ring-2 ring-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-700'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="size-2.5" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          {temFiltroAtivo && (
            <button
              onClick={onLimparFiltros}
              className="
                text-[10px] font-medium text-slate-500 underline-offset-2 hover:underline
                dark:text-slate-400
              "
            >
              Limpar filtros
            </button>
          )}
        </div>
      </Section>

      {/* Próximas 3 */}
      <Section
        title="Próximas"
        count={proximas.length}
        icon={<Stethoscope className="size-3.5" />}
      >
        <ul className="space-y-2">
          {proximas.map((p) => {
            const ehNoMomento = p.minutosAteInicio < 15
            return (
              <li
                key={p.agendamentoId}
                className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {p.pacienteNome}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1">
                      {p.condicoesCronicas.map((c, i) => (
                        <span
                          key={i}
                          className="
                            inline-flex items-center rounded bg-slate-200/70 px-1 py-0 text-[9px]
                            text-slate-700
                            dark:bg-slate-800 dark:text-slate-300
                          "
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                      {p.modalidade === 'tele' ? (
                        <Video className="size-2.5" />
                      ) : (
                        <MapPin className="size-2.5" />
                      )}
                      <span className="font-mono tabular-nums">
                        {formatHoraMin(p.iniciaEm)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelativo(p.minutosAteInicio)}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {ehNoMomento ? (
                    <button
                      onClick={() => onIniciarConsulta?.(p.agendamentoId)}
                      className="
                        inline-flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[10px] font-medium text-white
                        transition-colors hover:bg-teal-500
                      "
                    >
                      <Stethoscope className="size-3" />
                      Iniciar consulta
                    </button>
                  ) : (
                    <button
                      onClick={() => onVerPaciente?.(p.pacienteId)}
                      className="
                        inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600
                        transition-colors hover:bg-slate-50
                        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
                      "
                    >
                      Ver paciente
                      <ChevronRight className="size-2.5" />
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </Section>
    </aside>
  )
}

function Section({
  title,
  count,
  icon,
  children,
}: {
  title: string
  count: number | null
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        {title}
        {count !== null && (
          <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {count}
          </span>
        )}
      </h3>
      {children}
    </section>
  )
}

export { getIsoDia }
