import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Dumbbell,
  Flame,
  Gauge,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import type {
  Aluno,
  SessaoExecutadaShowcase,
  SessaoExecutadaStatus,
  SerieExecutadaShowcase,
} from '@/../product-personal/sections/alunos/types'

interface FichaAtividadesTabProps {
  aluno: Aluno
}

type PeriodoFiltro = '7d' | '30d' | '90d' | 'tudo'
type StatusFiltro = 'todos' | 'completa' | 'parcial' | 'pulada'

const PERIODO_LABEL: Record<PeriodoFiltro, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '90d': 'Últimos 90 dias',
  tudo: 'Tudo',
}

const STATUS_TONE: Record<
  SessaoExecutadaStatus,
  { label: string; icon: React.ElementType; iconColor: string; bg: string; text: string }
> = {
  completa: {
    label: 'Completa',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  parcial: {
    label: 'Parcial',
    icon: Circle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
  },
  pulada: {
    label: 'Pulada',
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-100 dark:bg-rose-900/40',
    text: 'text-rose-700 dark:text-rose-300',
  },
  agendada: {
    label: 'Agendada',
    icon: Circle,
    iconColor: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-300',
  },
}

export function FichaAtividadesTab({ aluno }: FichaAtividadesTabProps) {
  const sessoes = aluno.sessoesExecutadas ?? []
  const [periodo, setPeriodo] = useState<PeriodoFiltro>('30d')
  const [status, setStatus] = useState<StatusFiltro>('todos')

  const sessoesFiltradas = useMemo(() => {
    let filtered = [...sessoes]
    if (periodo !== 'tudo') {
      const days = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
      const limite = Date.now() - days * 24 * 60 * 60 * 1000
      filtered = filtered.filter(
        (s) => new Date(s.data).getTime() >= limite,
      )
    }
    if (status !== 'todos') {
      filtered = filtered.filter((s) => s.status === status)
    }
    return filtered.sort((a, b) => b.data.localeCompare(a.data))
  }, [sessoes, periodo, status])

  const stats = useMemo(() => computeStats(sessoes), [sessoes])
  const cargaProgressao = useMemo(
    () => computeCargaProgressao(sessoes),
    [sessoes],
  )

  if (sessoes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
          <Activity size={20} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
          Nenhuma sessão registrada ainda
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          As sessões aparecem aqui conforme o aluno registrar a execução do treino no app.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          icon={<CheckCircle2 size={13} />}
          label="Sessões"
          value={stats.totalSessoes}
          unit="registradas"
        />
        <Stat
          icon={<Gauge size={13} />}
          label="Adesão"
          valueNode={
            <span
              className={`font-mono text-2xl font-semibold tabular-nums ${
                stats.adesaoPercent >= 85
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : stats.adesaoPercent >= 60
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {stats.adesaoPercent}
              <span className="text-xs text-slate-400 dark:text-slate-500">%</span>
            </span>
          }
          unit={`${stats.completas}/${stats.totalSessoes} completas`}
        />
        <Stat
          icon={<Flame size={13} />}
          label="Streak"
          value={stats.streakAtual}
          unit="seguidas"
          tone="amber"
        />
        <Stat
          icon={<Clock size={13} />}
          label="Tempo médio"
          valueNode={
            <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {stats.duracaoMediaMin ?? '—'}
              {stats.duracaoMediaMin && (
                <span className="text-xs text-slate-400 dark:text-slate-500">min</span>
              )}
            </span>
          }
          unit={`RPE médio ${stats.rpeMedio?.toFixed(1) ?? '—'}`}
        />
      </div>

      {/* Progressão de carga (se houver) */}
      {cargaProgressao.length > 0 && (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <header className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <TrendingUp size={13} />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
              Progressão de carga
            </p>
          </header>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {cargaProgressao.slice(0, 6).map((p) => (
              <CargaProgressaoRow key={p.exercicioId} progressao={p} />
            ))}
          </div>
        </article>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(['todos', 'completa', 'parcial', 'pulada'] as StatusFiltro[]).map((s) => {
            const active = status === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {s === 'todos' ? 'Todas' : STATUS_TONE[s].label}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-1">
          {(['7d', '30d', '90d', 'tudo'] as PeriodoFiltro[]).map((p) => {
            const active = periodo === p
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodo(p)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  active
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {PERIODO_LABEL[p]}
              </button>
            )
          })}
        </div>
      </div>

      {/* Counter */}
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span className="font-mono tabular-nums text-slate-900 dark:text-slate-50">
          {sessoesFiltradas.length}
        </span>{' '}
        sessão{sessoesFiltradas.length === 1 ? '' : 's'}
      </p>

      {/* Timeline */}
      {sessoesFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sem sessões neste filtro.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[18px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2.5">
            {sessoesFiltradas.map((s) => (
              <SessaoRow key={s.id} sessao={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ===== Subcomponents =====

function Stat({
  icon,
  label,
  value,
  valueNode,
  unit,
  tone = 'default',
}: {
  icon: React.ReactNode
  label: string
  value?: number
  valueNode?: React.ReactNode
  unit?: string
  tone?: 'default' | 'amber'
}) {
  const valueTone = tone === 'amber' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-50'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1 font-mono">
        {valueNode ? (
          valueNode
        ) : (
          <>
            <span className={`text-2xl font-semibold tabular-nums ${valueTone}`}>
              {value}
            </span>
          </>
        )}
      </div>
      {unit && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {unit}
        </p>
      )}
    </div>
  )
}

function SessaoRow({ sessao }: { sessao: SessaoExecutadaShowcase }) {
  const [open, setOpen] = useState(false)
  const tone = STATUS_TONE[sessao.status]
  const Icon = tone.icon

  return (
    <div className="relative flex items-start gap-4">
      <span
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950 ${tone.bg} ${tone.iconColor}`}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-4 p-4 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Treino {sessao.treinoLetra} · {sessao.treinoNome}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone.bg} ${tone.text}`}
              >
                {tone.label}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {new Date(sessao.data).toLocaleDateString('pt-BR', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              {sessao.duracaoMinutos != null && (
                <>
                  {' · '}
                  <Clock size={11} className="mb-0.5 inline-block" /> {sessao.duracaoMinutos}min
                </>
              )}
              {sessao.rpeMedio != null && (
                <>
                  {' · '}RPE {sessao.rpeMedio.toFixed(1)}
                </>
              )}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform ${
              open ? 'rotate-180' : ''
            } dark:text-slate-500`}
          />
        </button>

        {open && sessao.status !== 'pulada' && (
          <div className="space-y-3 border-t border-slate-100 p-4 dark:border-slate-800">
            {sessao.comentarioAluno && (
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Comentário do aluno
                </p>
                <p className="mt-1 text-[13px] italic text-slate-700 dark:text-slate-300">
                  “{sessao.comentarioAluno}”
                </p>
              </div>
            )}

            {sessao.exercicios.map((ex) => (
              <ExercicioExecutado key={ex.exercicioId} exercicio={ex} />
            ))}
          </div>
        )}

        {open && sessao.status === 'pulada' && (
          <div className="border-t border-slate-100 p-4 dark:border-slate-800">
            {sessao.comentarioAluno ? (
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Justificativa
                </p>
                <p className="mt-1 text-[13px] italic text-slate-700 dark:text-slate-300">
                  “{sessao.comentarioAluno}”
                </p>
              </div>
            ) : (
              <p className="text-center text-[12px] text-slate-500 dark:text-slate-400">
                Sessão não executada · sem comentário
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ExercicioExecutado({
  exercicio,
}: {
  exercicio: { exercicioId: string; exercicioNome: string; series: SerieExecutadaShowcase[] }
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex items-center gap-2">
        <Dumbbell size={12} className="text-slate-400 dark:text-slate-500" />
        <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
          {exercicio.exercicioNome}
        </p>
      </div>
      <table className="mt-2 w-full text-[12px]">
        <thead>
          <tr className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <th className="pb-1 pr-2 text-left">Série</th>
            <th className="pb-1 px-2 text-left">Prescrito</th>
            <th className="pb-1 px-2 text-left">Real</th>
            <th className="pb-1 pl-2 text-left">RPE</th>
          </tr>
        </thead>
        <tbody className="font-mono tabular-nums">
          {exercicio.series.map((s) => {
            const cargaDelta =
              s.cargaRealKg != null && s.cargaPrescritaKg != null
                ? s.cargaRealKg - s.cargaPrescritaKg
                : null
            return (
              <tr
                key={s.numero}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="py-1.5 pr-2 text-slate-500 dark:text-slate-400">
                  {s.numero}
                </td>
                <td className="py-1.5 px-2 text-slate-500 dark:text-slate-400">
                  {formatPrescrito(s)}
                </td>
                <td className="py-1.5 px-2 text-slate-900 dark:text-slate-100">
                  {formatReal(s)}
                  {cargaDelta != null && cargaDelta !== 0 && (
                    <span
                      className={`ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-semibold ${
                        cargaDelta > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {cargaDelta > 0 ? (
                        <ArrowUp size={9} strokeWidth={3} />
                      ) : (
                        <ArrowDown size={9} strokeWidth={3} />
                      )}
                      {Math.abs(cargaDelta)}kg
                    </span>
                  )}
                </td>
                <td className="py-1.5 pl-2 text-slate-700 dark:text-slate-300">
                  {s.rpePercebido ?? '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CargaProgressaoRow({
  progressao,
}: {
  progressao: {
    exercicioId: string
    exercicioNome: string
    inicial: number
    atual: number
    delta: number
  }
}) {
  const positivo = progressao.delta > 0

  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/60 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-slate-700 dark:text-slate-300">
          {progressao.exercicioNome}
        </p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span className="tabular-nums">{progressao.inicial}</span>kg →{' '}
          <span className="tabular-nums text-slate-700 dark:text-slate-200">
            {progressao.atual}
          </span>
          kg
        </p>
      </div>
      <span
        className={`inline-flex items-center gap-0.5 font-mono text-sm font-semibold tabular-nums ${
          positivo
            ? 'text-emerald-600 dark:text-emerald-400'
            : progressao.delta < 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        {positivo ? '+' : ''}
        {progressao.delta}kg
      </span>
    </div>
  )
}

// ===== Helpers =====

function formatPrescrito(s: SerieExecutadaShowcase): string {
  if (s.cargaPrescritaKg == null && s.repsPrescrita == null) return '—'
  if (s.tempoRealSegundos != null) return '—'
  return `${s.repsPrescrita ?? '—'} × ${s.cargaPrescritaKg ?? 0}kg`
}

function formatReal(s: SerieExecutadaShowcase): string {
  if (s.tempoRealSegundos != null) return `${s.tempoRealSegundos}s`
  if (s.repsReal != null) return `${s.repsReal} × ${s.cargaRealKg ?? 0}kg`
  return '—'
}

function computeStats(sessoes: SessaoExecutadaShowcase[]) {
  const completas = sessoes.filter((s) => s.status === 'completa').length
  const parciais = sessoes.filter((s) => s.status === 'parcial').length
  const puladas = sessoes.filter((s) => s.status === 'pulada').length
  const total = sessoes.length
  const adesaoPercent =
    total > 0 ? Math.round(((completas + parciais * 0.5) / total) * 100) : 0

  // Streak: consecutive completas/parciais starting from most recent
  const ordenadas = [...sessoes].sort((a, b) => b.data.localeCompare(a.data))
  let streak = 0
  for (const s of ordenadas) {
    if (s.status === 'completa' || s.status === 'parcial') streak++
    else break
  }

  const durs = sessoes.map((s) => s.duracaoMinutos).filter((d): d is number => d != null)
  const duracaoMediaMin = durs.length > 0 ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : null

  const rpes = sessoes.map((s) => s.rpeMedio).filter((r): r is number => r != null)
  const rpeMedio = rpes.length > 0 ? rpes.reduce((a, b) => a + b, 0) / rpes.length : null

  return {
    totalSessoes: total,
    completas,
    parciais,
    puladas,
    adesaoPercent,
    streakAtual: streak,
    duracaoMediaMin,
    rpeMedio,
  }
}

function computeCargaProgressao(sessoes: SessaoExecutadaShowcase[]) {
  // Pra cada exercício, encontra a maior carga real na primeira e na última sessão
  const map = new Map<
    string,
    { exercicioId: string; exercicioNome: string; inicial: number; atual: number; primeiraData: string; ultimaData: string }
  >()

  const ordenadas = [...sessoes].sort((a, b) => a.data.localeCompare(b.data))

  for (const s of ordenadas) {
    if (s.status !== 'completa' && s.status !== 'parcial') continue
    for (const ex of s.exercicios) {
      const cargas = ex.series
        .map((sr) => sr.cargaRealKg)
        .filter((c): c is number => c != null)
      if (cargas.length === 0) continue
      const maxCarga = Math.max(...cargas)
      const existing = map.get(ex.exercicioId)
      if (!existing) {
        map.set(ex.exercicioId, {
          exercicioId: ex.exercicioId,
          exercicioNome: ex.exercicioNome,
          inicial: maxCarga,
          atual: maxCarga,
          primeiraData: s.data,
          ultimaData: s.data,
        })
      } else {
        existing.atual = maxCarga
        existing.ultimaData = s.data
      }
    }
  }

  return Array.from(map.values())
    .map((p) => ({ ...p, delta: p.atual - p.inicial }))
    .filter((p) => p.delta !== 0 && p.primeiraData !== p.ultimaData)
    .sort((a, b) => b.delta - a.delta)
}
