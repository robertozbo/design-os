import { ArrowDownRight, ArrowUpRight, CalendarClock, ChevronRight, DoorOpen, UserPlus } from 'lucide-react'
import type {
  GestaoData,
  Kpi,
  Pendencia,
  Periodo,
} from '@/../product-clinic/sections/inicio-gestao/types'
import { AVATAR_COR, BAR_COR, brlCompacto, ocupacaoBar } from './helpers'

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: 'hoje', label: 'Hoje' },
  { value: 'semana', label: 'Semana' },
  { value: 'mes', label: 'Mês' },
]

const PENDENCIA_ICON = {
  convite: UserPlus,
  agendamento: CalendarClock,
  sala: DoorOpen,
}

interface Props {
  dados: GestaoData
  onPeriodo: (p: Periodo) => void
  onPendencia: (p: Pendencia) => void
}

export function VisaoGeralView({ dados, onPeriodo, onPendencia }: Props) {
  const maxDia = Math.max(...dados.atendimentosSemana.map((d) => d.atendimentos))
  const maxProd = Math.max(...dados.producao.map((p) => p.atendimentos))

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Visão geral</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{dados.clinica}</p>
        </div>
        <div className="flex items-center gap-0.5 self-start rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          {PERIODOS.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodo(p.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                dados.periodo === p.value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {dados.kpis.map((k) => (
          <KpiCard key={k.id} kpi={k} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Atendimentos por dia */}
        <Card titulo="Atendimentos por dia" className="lg:col-span-2">
          <div className="flex h-40 items-end gap-3 pt-2">
            {dados.atendimentosSemana.map((d) => (
              <div key={d.dia} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
                  {d.atendimentos}
                </span>
                <div className="flex w-full items-end" style={{ height: 110 }}>
                  <div
                    className="w-full rounded-t-md bg-teal-500/80 transition-all"
                    style={{ height: `${(d.atendimentos / maxDia) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400">{d.dia}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pendências */}
        <Card titulo="Pendências">
          <ul className="space-y-2">
            {dados.pendencias.map((p) => {
              const Icon = PENDENCIA_ICON[p.tipo]
              return (
                <li key={p.id}>
                  <button
                    onClick={() => onPendencia(p)}
                    className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 p-2.5 text-left transition-colors hover:border-teal-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 text-xs text-slate-600 dark:text-slate-300">
                      {p.label}
                    </span>
                    <span className="shrink-0 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                      {p.count}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Produção por médico */}
        <Card titulo="Produção por médico">
          <ul className="space-y-3">
            {dados.producao.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${AVATAR_COR[m.cor]}`}>
                  {m.iniciais}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                      {m.nome}
                    </span>
                    <span className="shrink-0 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {m.atendimentos} · {brlCompacto(m.receita)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full ${BAR_COR[m.cor]}`}
                      style={{ width: `${(m.atendimentos / maxProd) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          {/* Receita por especialidade */}
          <Card titulo="Receita por especialidade">
            <ul className="space-y-2.5">
              {dados.receitaPorEspecialidade.map((r) => (
                <li key={r.especialidade}>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300">{r.especialidade}</span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {brlCompacto(r.valor)} · {r.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${BAR_COR[r.cor]}`} style={{ width: `${r.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Ocupação de salas */}
          <Card titulo="Ocupação de salas hoje">
            <ul className="space-y-2">
              {dados.ocupacaoSalas.map((s) => (
                <li key={s.nome} className="flex items-center gap-2">
                  <span className="w-32 shrink-0 truncate text-[11px] text-slate-600 dark:text-slate-300">
                    {s.nome}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${ocupacaoBar(s.pct)}`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[11px] font-mono tabular-nums text-slate-400">
                    {s.pct}%
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const ruim = kpi.tendencia === 'up' ? kpi.invertido : kpi.tendencia === 'down' && !kpi.invertido
  const cls = ruim
    ? 'text-rose-600 dark:text-rose-400'
    : 'text-emerald-600 dark:text-emerald-400'
  const Arrow = kpi.tendencia === 'down' ? ArrowDownRight : ArrowUpRight

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{kpi.label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-semibold text-slate-900 dark:text-slate-50">{kpi.valor}</span>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${cls}`}>
          <Arrow className="h-3 w-3" />
          {kpi.delta}
        </span>
      </div>
      <div className="mt-0.5 text-[11px] text-slate-400">{kpi.sub}</div>
    </div>
  )
}

function Card({
  titulo,
  className,
  children,
}: {
  titulo: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 ${className ?? ''}`}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {titulo}
      </h2>
      {children}
    </div>
  )
}
