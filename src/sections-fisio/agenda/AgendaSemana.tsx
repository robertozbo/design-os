import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Eye,
  EyeOff,
  House,
  MapPin,
  Plus,
  Stethoscope,
  Video,
  X,
} from 'lucide-react'
import data from '@/../product-fisio/sections/agenda/data.json'
import type {
  Agendamento,
  StatusAgendamento,
  TipoAtendimento,
  VisaoAgenda,
} from '@/../product-fisio/sections/agenda/types'

const agendamentos = data.agendamentos as Agendamento[]
const HOJE = '2026-05-28'
const NOW_HOUR = 11.5 // 11:30 visual de "now"
const HORAS_GRID = Array.from({ length: 15 }, (_, i) => 7 + i) // 07h-21h
const SLOT_HEIGHT = 64

const SEMANA = [
  { data: '2026-05-24', label: 'DOM', dia: 24 },
  { data: '2026-05-25', label: 'SEG', dia: 25 },
  { data: '2026-05-26', label: 'TER', dia: 26 },
  { data: '2026-05-27', label: 'QUA', dia: 27 },
  { data: '2026-05-28', label: 'QUI', dia: 28 },
  { data: '2026-05-29', label: 'SEX', dia: 29 },
  { data: '2026-05-30', label: 'SÁB', dia: 30 },
]

const STATUS_BLOCK: Record<StatusAgendamento, string> = {
  agendada:
    'border border-dashed border-amber-400/80 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200',
  confirmada:
    'border border-teal-500/80 bg-teal-100/80 text-teal-900 dark:border-teal-400/40 dark:bg-teal-900/40 dark:text-teal-100',
  realizada:
    'border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 opacity-80',
  falta:
    'border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-200 line-through',
  cancelada:
    'border border-slate-200 bg-slate-50 text-slate-400 line-through opacity-60 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-600',
  bloqueio: '',
}

const STATUS_LABEL: Record<StatusAgendamento, string> = {
  agendada: 'Pendente',
  confirmada: 'Confirmada',
  realizada: 'Realizada',
  falta: 'Faltou',
  cancelada: 'Cancelada',
  bloqueio: 'Bloqueio',
}

const STATUS_CHIP: Record<StatusAgendamento, string> = {
  agendada: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  confirmada: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
  realizada: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  falta: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  cancelada: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
  bloqueio: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
}

const TIPO_LABEL: Record<TipoAtendimento, string> = {
  presencial: 'Presencial',
  teleconsulta: 'Teleconsulta',
  domicilio: 'Domicílio',
}

const TIPO_ICON: Record<TipoAtendimento, typeof MapPin> = {
  presencial: MapPin,
  teleconsulta: Video,
  domicilio: House,
}

const STATUS_FILTROS: StatusAgendamento[] = [
  'agendada',
  'confirmada',
  'realizada',
  'cancelada',
]

const TIPO_FILTROS: TipoAtendimento[] = ['presencial', 'teleconsulta', 'domicilio']

function parseTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h + m / 60
}

function formatHora(h: number) {
  return `${h.toString().padStart(2, '0')}:00`
}

function formatDataCompacta(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

// Atribui tipoAtendimento default ('presencial') quando não vier do data
const agendamentosNormalizados: Agendamento[] = agendamentos.map((ag, i) => ({
  ...ag,
  tipoAtendimento:
    ag.tipoAtendimento ?? (i % 11 === 0 ? 'teleconsulta' : i % 17 === 0 ? 'domicilio' : 'presencial'),
}))

export default function AgendaSemana() {
  const [visao, setVisao] = useState<VisaoAgenda>('semana')
  const [diaSelecionado, setDiaSelecionado] = useState(HOJE)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null)
  const [tipoFiltro, setTipoFiltro] = useState<TipoAtendimento | 'todos'>('todos')
  const [statusFiltro, setStatusFiltro] = useState<StatusAgendamento | 'todos'>('todos')
  const [mostrarIndisponiveis, setMostrarIndisponiveis] = useState(false)

  const agendamentosVisiveis = useMemo(() => {
    return agendamentosNormalizados.filter((ag) => {
      if (ag.status === 'bloqueio') return mostrarIndisponiveis
      if (tipoFiltro !== 'todos' && ag.tipoAtendimento !== tipoFiltro) return false
      if (statusFiltro !== 'todos' && ag.status !== statusFiltro) return false
      return true
    })
  }, [tipoFiltro, statusFiltro, mostrarIndisponiveis])

  const contadoresTipo = useMemo(() => {
    const c: Record<TipoAtendimento, number> = { presencial: 0, teleconsulta: 0, domicilio: 0 }
    for (const ag of agendamentosNormalizados) {
      if (ag.status === 'bloqueio' || !ag.tipoAtendimento) continue
      c[ag.tipoAtendimento]++
    }
    return c
  }, [])

  const contadoresStatus = useMemo(() => {
    const c: Record<StatusAgendamento, number> = {
      agendada: 0,
      confirmada: 0,
      realizada: 0,
      falta: 0,
      cancelada: 0,
      bloqueio: 0,
    }
    for (const ag of agendamentosNormalizados) c[ag.status]++
    return c
  }, [])

  const totalTodos = agendamentosNormalizados.filter((a) => a.status !== 'bloqueio').length

  const diasComSessao = useMemo(() => {
    const set = new Set<string>()
    for (const ag of agendamentosNormalizados) if (ag.status !== 'bloqueio') set.add(ag.data)
    return set
  }, [])

  const pendentes = useMemo(
    () =>
      agendamentosNormalizados
        .filter((ag) => ag.status === 'agendada' && ag.data >= HOJE)
        .slice(0, 4),
    [],
  )

  const periodLabel =
    visao === 'dia'
      ? new Date(diaSelecionado).toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
        })
      : visao === 'mes'
        ? 'Maio 2026'
        : 'Semana de 24 — 30 mai'

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Eyebrow + Title + Subtitle */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Atendimento · Agenda
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
              <CalendarDays className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Agenda
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sessões agendadas, disponibilidade e bloqueios.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar (view toggle + nav + period + sync + CTA) */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* View toggle */}
            <div
              role="tablist"
              className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              {(['dia', 'semana', 'mes'] as VisaoAgenda[]).map((v) => {
                const active = v === visao
                return (
                  <button
                    key={v}
                    onClick={() => setVisao(v)}
                    className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all capitalize ${
                      active
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                    }`}
                  >
                    {v === 'mes' ? 'Mês' : v}
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="inline-flex items-center gap-1.5">
              <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                <ChevronLeft size={16} />
              </button>
              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                Hoje
              </button>
              <button className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Period label */}
            <div className="inline-flex items-center gap-2">
              <CalendarIcon size={14} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {periodLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
              <AlertTriangle size={12} />
              Google Calendar desconectado
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md hover:shadow-teal-500/20"
            >
              <Plus size={14} />
              Nova sessão
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <FilterPills
            label="Tipo"
            options={[{ id: 'todos', label: 'Todos', count: totalTodos } as const, ...TIPO_FILTROS.map((t) => ({ id: t, label: TIPO_LABEL[t], count: contadoresTipo[t] } as const))]}
            selected={tipoFiltro}
            onChange={(id) => setTipoFiltro(id as TipoAtendimento | 'todos')}
          />
          <span className="hidden h-5 w-px bg-slate-200 dark:bg-slate-800 sm:inline-block" />
          <FilterPills
            label="Status"
            options={[
              { id: 'todos', label: 'Todos', count: totalTodos } as const,
              ...STATUS_FILTROS.map((s) => ({ id: s, label: STATUS_LABEL[s], count: contadoresStatus[s] } as const)),
            ]}
            selected={statusFiltro}
            onChange={(id) => setStatusFiltro(id as StatusAgendamento | 'todos')}
          />
          <button
            onClick={() => setMostrarIndisponiveis((v) => !v)}
            className={`ml-auto inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              mostrarIndisponiveis
                ? 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {mostrarIndisponiveis ? <Eye size={12} /> : <EyeOff size={12} />}
            Slots indisponíveis
          </button>
        </div>

        {/* Sidebar + main view */}
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4">
            <SidebarSection
              icon={<CalendarDays size={12} />}
              title="Navegar"
            >
              <MiniCalendar
                isoFoco={diaSelecionado}
                diasComSessao={diasComSessao}
                onSelecionarDia={(iso) => {
                  setDiaSelecionado(iso)
                  if (visao === 'mes') setVisao('semana')
                }}
              />
            </SidebarSection>

            <SidebarSection
              icon={<Clock size={12} />}
              title="A confirmar"
              count={pendentes.length}
            >
              {pendentes.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 inline-flex items-center gap-1">
                  Sem pendentes. <span aria-hidden>🎯</span>
                </p>
              ) : (
                <ul className="space-y-2">
                  {pendentes.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-lg border border-amber-200/70 bg-amber-50/50 p-2.5 dark:border-amber-900/50 dark:bg-amber-950/20"
                    >
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {p.paciente?.nome}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                        <span className="font-mono tabular-nums">
                          {formatDataCompacta(p.data)} · {p.horaInicio}
                        </span>
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <button className="inline-flex items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-[10px] font-medium text-white hover:bg-teal-500">
                          <Check className="size-3" strokeWidth={2.5} />
                          Confirmar
                        </button>
                        <button
                          onClick={() => setAgendamentoSelecionado(p)}
                          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          Detalhes
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SidebarSection>
          </aside>

          {/* Main view */}
          <div className="min-w-0">
            {visao === 'mes' ? (
              <MonthView
                onSelecionarDia={(iso) => {
                  setDiaSelecionado(iso)
                  setVisao('dia')
                }}
                diasComSessao={diasComSessao}
                agendamentos={agendamentosVisiveis}
              />
            ) : visao === 'dia' ? (
              <DiaView
                diaSelecionado={diaSelecionado}
                agendamentos={agendamentosVisiveis.filter((ag) => ag.data === diaSelecionado)}
                onSelect={setAgendamentoSelecionado}
                onClickSlotVazio={() => setDrawerOpen(true)}
              />
            ) : (
              <WeekView
                agendamentos={agendamentosVisiveis}
                onClickAgendamento={setAgendamentoSelecionado}
                onClickSlotVazio={() => setDrawerOpen(true)}
                onClickDia={(iso) => {
                  setDiaSelecionado(iso)
                  setVisao('dia')
                }}
              />
            )}
          </div>
        </div>
      </div>

      {drawerOpen && <NovoAgendamentoDrawer onClose={() => setDrawerOpen(false)} />}
      {agendamentoSelecionado && (
        <DetalheAgendamentoDrawer
          agendamento={agendamentoSelecionado}
          onClose={() => setAgendamentoSelecionado(null)}
        />
      )}
    </div>
  )
}

/* ---------- Filter pills ---------- */
function FilterPills({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: readonly { id: string; label: string; count: number }[]
  selected: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
        {label}
      </span>
      <div className="flex gap-1 flex-wrap">
        {options.map((f) => {
          const active = f.id === selected
          return (
            <button
              key={f.id}
              onClick={() => onChange(f.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                active
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {f.label}
              <span
                className={`font-mono text-[10px] tabular-nums ${
                  active ? 'text-slate-300 dark:text-slate-500' : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {f.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Sidebar section ---------- */
function SidebarSection({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode
  title: string
  count?: number
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center gap-1.5 px-1 mb-3">
        <span className="text-teal-600 dark:text-teal-400">{icon}</span>
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
          {title}
        </h2>
        {count !== undefined && (
          <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {count}
          </span>
        )}
      </header>
      {children}
    </section>
  )
}

/* ---------- Week View (grid 7 dias) ---------- */
function WeekView({
  agendamentos,
  onClickAgendamento,
  onClickSlotVazio,
  onClickDia,
}: {
  agendamentos: Agendamento[]
  onClickAgendamento: (ag: Agendamento) => void
  onClickSlotVazio: (iso: string, hora: string) => void
  onClickDia: (iso: string) => void
}) {
  const agendamentosPorDia = useMemo(() => {
    const map = new Map<string, Agendamento[]>()
    for (const ag of agendamentos) {
      const arr = map.get(ag.data) ?? []
      arr.push(ag)
      map.set(ag.data, arr)
    }
    return map
  }, [agendamentos])

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header: day labels + numbers */}
      <div
        className="sticky top-0 z-[2] grid border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        style={{ gridTemplateColumns: '64px repeat(7, minmax(120px, 1fr))' }}
      >
        {/* GMT label */}
        <div className="flex items-end justify-center pb-2 border-r border-slate-200 dark:border-slate-800">
          <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500">GMT-3</span>
        </div>
        {SEMANA.map((d) => {
          const isHoje = d.data === HOJE
          return (
            <button
              key={d.data}
              onClick={() => onClickDia(d.data)}
              className="flex flex-col items-center justify-center gap-1 border-r border-slate-200 py-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/30"
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isHoje
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {d.label}
              </span>
              <span
                className={`inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums ${
                  isHoje
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {d.dia}
              </span>
            </button>
          )
        })}
      </div>

      {/* Body grid */}
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
        {SEMANA.map((d) => {
          const ags = agendamentosPorDia.get(d.data) ?? []
          const isHoje = d.data === HOJE
          return (
            <div
              key={d.data}
              className={`relative border-r border-slate-200 dark:border-slate-800 ${
                isHoje ? 'bg-teal-50/20 dark:bg-teal-950/10' : ''
              }`}
            >
              {HORAS_GRID.map((h) => (
                <button
                  key={h}
                  onClick={() => onClickSlotVazio(d.data, formatHora(h))}
                  className="block w-full border-b border-slate-100 transition-colors hover:bg-teal-50/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-400 dark:border-slate-800 dark:hover:bg-teal-950/20"
                  style={{ height: SLOT_HEIGHT }}
                />
              ))}

              {/* Agendamentos */}
              {ags.map((ag) => {
                const ini = parseTime(ag.horaInicio)
                const top = (ini - HORAS_GRID[0]) * SLOT_HEIGHT
                const height = Math.max((ag.duracaoMin / 60) * SLOT_HEIGHT - 4, 28)
                if (top < 0) return null
                if (ag.status === 'bloqueio') {
                  return (
                    <div
                      key={ag.id}
                      className="pointer-events-none absolute left-1 right-1 overflow-hidden rounded-md border border-slate-300/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:border-slate-700/60 dark:text-slate-500"
                      style={{
                        top,
                        height,
                        backgroundImage:
                          'repeating-linear-gradient(45deg, rgba(148,163,184,0.10) 0, rgba(148,163,184,0.10) 6px, transparent 6px, transparent 12px)',
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Coffee className="size-2.5 shrink-0" strokeWidth={2} />
                        <span className="truncate">{ag.bloqueio?.titulo}</span>
                      </div>
                    </div>
                  )
                }
                const Icon = TIPO_ICON[ag.tipoAtendimento ?? 'presencial']
                return (
                  <button
                    key={ag.id}
                    onClick={() => onClickAgendamento(ag)}
                    className={`absolute left-1 right-1 z-[1] cursor-pointer overflow-hidden rounded-md px-2 py-1 text-left text-[11px] leading-tight shadow-sm transition-all hover:scale-[1.01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${STATUS_BLOCK[ag.status]}`}
                    style={{ top, height }}
                    title={`${ag.paciente?.nome} · ${ag.duracaoMin}min`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-2.5 opacity-70 shrink-0" />
                      <span className="font-mono text-[10px] tabular-nums opacity-80">
                        {ag.horaInicio}
                      </span>
                      {ag.paciente?.evaUltima !== undefined && (
                        <span className="rounded bg-white/40 px-1 text-[9px] font-bold tabular-nums dark:bg-black/20">
                          EVA {ag.paciente.evaUltima}
                        </span>
                      )}
                    </div>
                    {height > 36 && (
                      <p className="mt-0.5 truncate font-semibold">
                        {ag.paciente?.nome.split(' ')[0]}{' '}
                        {ag.paciente?.nome.split(' ').slice(-1)[0]?.[0]}.
                      </p>
                    )}
                    {height > 60 && ag.paciente?.queixaCurta && (
                      <p className="mt-0.5 line-clamp-2 text-[10px] opacity-75">
                        {ag.paciente.queixaCurta}
                      </p>
                    )}
                  </button>
                )
              })}

              {/* Now indicator */}
              {isHoje && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-[3] flex items-center"
                  style={{ top: (NOW_HOUR - HORAS_GRID[0]) * SLOT_HEIGHT }}
                >
                  <div className="size-2 rounded-full bg-rose-500 shrink-0 -ml-1 shadow-[0_0_0_3px_rgba(244,63,94,0.2)]" />
                  <div className="flex-1 h-px bg-rose-500/50" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Day View ---------- */
function DiaView({
  diaSelecionado,
  agendamentos,
  onSelect,
  onClickSlotVazio,
}: {
  diaSelecionado: string
  agendamentos: Agendamento[]
  onSelect: (ag: Agendamento) => void
  onClickSlotVazio: (hora: string) => void
}) {
  const dia = SEMANA.find((d) => d.data === diaSelecionado)
  const isHoje = diaSelecionado === HOJE

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500">GMT-3</span>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {dia?.label} {isHoje && '· Hoje'}
            </div>
            <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {dia?.dia} de maio
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
          {agendamentos.length} agendamento{agendamentos.length === 1 ? '' : 's'}
        </div>
      </div>

      <div className="grid grid-cols-[80px_1fr] relative">
        <div className="border-r border-slate-200 dark:border-slate-800">
          {HORAS_GRID.map((h) => (
            <div
              key={h}
              className="border-b border-slate-100 dark:border-slate-800 px-2 pt-1 text-right text-xs font-mono tabular-nums text-slate-400 dark:text-slate-500"
              style={{ height: SLOT_HEIGHT }}
            >
              {formatHora(h)}
            </div>
          ))}
        </div>
        <div className="relative" style={{ height: HORAS_GRID.length * SLOT_HEIGHT }}>
          {HORAS_GRID.map((h) => (
            <button
              key={h}
              onClick={() => onClickSlotVazio(formatHora(h))}
              className="block w-full border-b border-slate-100 transition-colors hover:bg-teal-50/50 focus:outline-none dark:border-slate-800 dark:hover:bg-teal-950/20"
              style={{ height: SLOT_HEIGHT }}
            />
          ))}
          {agendamentos.map((ag) => {
            const ini = parseTime(ag.horaInicio)
            const top = (ini - HORAS_GRID[0]) * SLOT_HEIGHT
            const height = Math.max((ag.duracaoMin / 60) * SLOT_HEIGHT - 4, 36)
            if (top < 0) return null
            if (ag.status === 'bloqueio') {
              return (
                <div
                  key={ag.id}
                  className="pointer-events-none absolute left-2 right-2 overflow-hidden rounded-lg border border-slate-300/60 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700/60 dark:text-slate-400"
                  style={{
                    top,
                    height,
                    backgroundImage:
                      'repeating-linear-gradient(45deg, rgba(148,163,184,0.12) 0, rgba(148,163,184,0.12) 6px, transparent 6px, transparent 12px)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="size-3.5" strokeWidth={2} />
                    <span>{ag.bloqueio?.titulo}</span>
                    <span className="ml-auto text-[10px] font-mono opacity-70">
                      {ag.horaInicio} · {ag.duracaoMin}min
                    </span>
                  </div>
                </div>
              )
            }
            const Icon = TIPO_ICON[ag.tipoAtendimento ?? 'presencial']
            return (
              <button
                key={ag.id}
                onClick={() => onSelect(ag)}
                className={`absolute left-2 right-2 z-[1] cursor-pointer overflow-hidden rounded-lg px-3 py-2 text-left text-sm shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${STATUS_BLOCK[ag.status]}`}
                style={{ top, height }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight">{ag.paciente?.nome}</div>
                    <div className="mt-0.5 text-xs opacity-80 truncate">
                      {ag.paciente?.queixaCurta}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] tabular-nums opacity-75">
                      <Icon className="size-3" />
                      {ag.horaInicio} · {ag.duracaoMin}min
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${STATUS_CHIP[ag.status]}`}
                    >
                      {STATUS_LABEL[ag.status]}
                    </span>
                    {ag.paciente?.evaUltima !== undefined && (
                      <span className="font-mono text-[10px] tabular-nums opacity-75">
                        EVA {ag.paciente.evaUltima}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}

          {isHoje && (
            <div
              className="pointer-events-none absolute left-0 right-0 z-[3] flex items-center"
              style={{ top: (NOW_HOUR - HORAS_GRID[0]) * SLOT_HEIGHT }}
            >
              <div className="size-2 rounded-full bg-rose-500 shrink-0 -ml-1 shadow-[0_0_0_3px_rgba(244,63,94,0.2)]" />
              <div className="flex-1 h-px bg-rose-500/50" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- Month View ---------- */
function MonthView({
  onSelecionarDia,
  diasComSessao,
  agendamentos,
}: {
  onSelecionarDia: (iso: string) => void
  diasComSessao: Set<string>
  agendamentos: Agendamento[]
}) {
  // Maio 2026: 1 May is Friday (weekday 5). Total 31 days.
  // We render 6 rows (42 cells) starting from the first Sunday before/at May 1.
  const ano = 2026
  const mes = 4 // May (0-indexed)
  const primeiroDia = new Date(ano, mes, 1)
  const offsetInicial = primeiroDia.getDay()
  const totalCelulas = 42
  const cells: { iso: string; numero: number; ehMesAtual: boolean }[] = []
  for (let i = 0; i < totalCelulas; i++) {
    const d = new Date(ano, mes, i + 1 - offsetInicial)
    cells.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      numero: d.getDate(),
      ehMesAtual: d.getMonth() === mes,
    })
  }

  const contagemPorDia = useMemo(() => {
    const map = new Map<string, number>()
    for (const ag of agendamentos) {
      if (ag.status === 'bloqueio') continue
      map.set(ag.data, (map.get(ag.data) ?? 0) + 1)
    }
    return map
  }, [agendamentos])

  const HEAD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
        {HEAD.map((h) => (
          <div
            key={h}
            className="border-r border-slate-200 dark:border-slate-800 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {h}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((c, i) => {
          const ehHoje = c.iso === HOJE
          const tem = diasComSessao.has(c.iso)
          const count = contagemPorDia.get(c.iso) ?? 0
          return (
            <button
              key={i}
              onClick={() => onSelecionarDia(c.iso)}
              className={`min-h-[96px] border-r border-b border-slate-200 dark:border-slate-800 p-2 text-left transition-colors ${
                c.ehMesAtual
                  ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  : 'bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600'
              }`}
            >
              <div
                className={`inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums ${
                  ehHoje
                    ? 'bg-teal-600 text-white'
                    : c.ehMesAtual
                      ? 'text-slate-900 dark:text-slate-50'
                      : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                {c.numero}
              </div>
              {tem && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-teal-50 dark:bg-teal-950/40 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:text-teal-300">
                  <span className="size-1 rounded-full bg-teal-500" />
                  {count} sessão{count === 1 ? '' : 'ões'}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- MiniCalendar ---------- */
function MiniCalendar({
  isoFoco,
  diasComSessao,
  onSelecionarDia,
}: {
  isoFoco: string
  diasComSessao: Set<string>
  onSelecionarDia: (iso: string) => void
}) {
  const DIAS_HEAD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  const [anoFoco, mesFoco] = isoFoco.split('-').map(Number)
  const ano = anoFoco
  const mes = mesFoco - 1

  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  const diasMes = ultimoDia.getDate()
  const offsetInicial = primeiroDia.getDay()
  const totalCelulas = Math.ceil((offsetInicial + diasMes) / 7) * 7

  const cells: { iso: string; numero: number; ehMesAtual: boolean }[] = []
  for (let i = 0; i < totalCelulas; i++) {
    const dataReal = new Date(ano, mes, i + 1 - offsetInicial)
    const ehMesAtual = dataReal.getMonth() === mes
    const iso = `${dataReal.getFullYear()}-${String(dataReal.getMonth() + 1).padStart(2, '0')}-${String(dataReal.getDate()).padStart(2, '0')}`
    cells.push({ iso, numero: dataReal.getDate(), ehMesAtual })
  }

  const labelMes = new Date(ano, mes, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase())

  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold tracking-tight text-slate-700 dark:text-slate-200">
          {labelMes}
        </h3>
        <div className="flex items-center gap-0.5">
          <button className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <ChevronLeft className="size-3" strokeWidth={2} />
          </button>
          <button className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <ChevronRight className="size-3" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DIAS_HEAD.map((d, i) => (
          <div key={i} className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {d}
          </div>
        ))}
        {cells.map((c) => {
          const ehHoje = c.iso === HOJE
          const ehFoco = c.iso === isoFoco
          const temSessao = diasComSessao.has(c.iso)
          return (
            <button
              key={c.iso}
              onClick={() => onSelecionarDia(c.iso)}
              className={`relative aspect-square rounded-md text-[11px] tabular-nums transition-all ${
                !c.ehMesAtual
                  ? 'text-slate-300 dark:text-slate-700'
                  : ehFoco
                    ? 'bg-teal-600 font-semibold text-white shadow-sm'
                    : ehHoje
                      ? 'bg-teal-50 font-semibold text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {c.numero}
              {temSessao && c.ehMesAtual && !ehFoco && (
                <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-teal-500/80" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Drawers ---------- */
function NovoAgendamentoDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[480px] flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Nova sessão</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <Field label="Paciente">
            <input
              type="text"
              placeholder="Buscar paciente ou cadastrar novo…"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data">
              <input type="date" defaultValue="2026-05-30" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            </Field>
            <Field label="Hora">
              <input type="time" defaultValue="14:00" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
            </Field>
          </div>
          <Field label="Tipo">
            <div className="grid grid-cols-3 gap-2">
              {TIPO_FILTROS.map((t) => {
                const Icon = TIPO_ICON[t]
                return (
                  <button
                    key={t}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      t === 'presencial'
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="size-3.5" />
                    {TIPO_LABEL[t]}
                  </button>
                )
              })}
            </div>
          </Field>
          <Field label="Duração">
            <div className="flex gap-2">
              {[30, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    m === 60
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}min
                </button>
              ))}
            </div>
          </Field>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
            <input type="checkbox" defaultChecked className="mt-0.5" />
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                Enviar lembrete WhatsApp
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">24h antes</div>
            </div>
          </label>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-200 p-5 dark:border-slate-800">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">
            Agendar
          </button>
        </div>
      </div>
    </>
  )
}

function DetalheAgendamentoDrawer({
  agendamento,
  onClose,
}: {
  agendamento: Agendamento
  onClose: () => void
}) {
  const isBlock = agendamento.status === 'bloqueio'
  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/60" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[400px] flex-col bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_CHIP[agendamento.status]}`}
            >
              {STATUS_LABEL[agendamento.status]}
            </span>
            <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {formatDataCompacta(agendamento.data)} · {agendamento.horaInicio}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {isBlock ? (
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
              <Coffee className="size-5" strokeWidth={1.7} />
              <span className="text-lg font-semibold">{agendamento.bloqueio?.titulo}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-base font-semibold text-white">
                  {agendamento.paciente?.nome
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {agendamento.paciente?.nome}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {agendamento.paciente?.queixaCurta}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Stat label="Duração" value={`${agendamento.duracaoMin}min`} />
                <Stat label="EVA" value={agendamento.paciente?.evaUltima?.toString() ?? '—'} />
                <Stat
                  label="Tipo"
                  value={TIPO_LABEL[agendamento.tipoAtendimento ?? 'presencial']}
                />
              </div>
              {agendamento.lembreteEnviado && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-3.5" strokeWidth={2} />
                  Lembrete WhatsApp enviado
                </div>
              )}
            </>
          )}
        </div>

        {!isBlock && (
          <div className="space-y-2 border-t border-slate-200 p-5 dark:border-slate-800">
            {agendamento.status === 'agendada' && (
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500">
                <Check className="size-3.5" strokeWidth={2} />
                Confirmar com paciente
              </button>
            )}
            {(agendamento.status === 'agendada' || agendamento.status === 'confirmada') && (
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200">
                <Stethoscope className="size-3.5" strokeWidth={2} />
                Iniciar atendimento
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
      <div className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">{value}</div>
    </div>
  )
}
