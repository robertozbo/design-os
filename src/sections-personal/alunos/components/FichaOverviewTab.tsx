import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Dumbbell,
  Gauge,
  Minus,
  MessageSquare,
  Sparkles,
  Target,
  XCircle,
} from 'lucide-react'
import type {
  Aluno,
  AvaliacaoResumo,
  MetaPrincipal,
} from '@/../product-personal/sections/alunos/types'
import { OBJETIVO_LABEL, OBJETIVO_TONE } from './helpers'

interface FichaOverviewTabProps {
  aluno: Aluno
  onOpenPlano?: () => void
  onAnaliseIA?: () => void
  onNovaAvaliacao?: () => void
}

const TIPO_ATIVIDADE_ICON: Record<string, React.ElementType> = {
  'sessao-completa': CheckCircle2,
  'sessao-pulada': XCircle,
  mensagem: MessageSquare,
  'avaliacao-completa': Sparkles,
  'comentario-dor': AlertTriangle,
}

const TIPO_ATIVIDADE_TONE: Record<string, string> = {
  'sessao-completa': 'text-emerald-600 dark:text-emerald-400',
  'sessao-pulada': 'text-rose-600 dark:text-rose-400',
  mensagem: 'text-teal-600 dark:text-teal-400',
  'avaliacao-completa': 'text-violet-600 dark:text-violet-400',
  'comentario-dor': 'text-red-600 dark:text-red-400',
}

type MetricaKey =
  | 'pesoKg'
  | 'percentualGordura'
  | 'rmSupino'
  | 'rmSquat'
  | 'rmDeadlift'
  | 'fmsScore'
  | 'massaMagraKg'

const METRICA_OPTIONS: {
  id: MetricaKey
  label: string
  unidade: string
  /** Diminuir é positivo? (ex: %G ↓ é positivo) */
  diminuirEhPositivo: boolean
  icon: React.ElementType
}[] = [
  { id: 'pesoKg', label: 'Peso', unidade: 'kg', diminuirEhPositivo: false, icon: Gauge },
  {
    id: 'percentualGordura',
    label: '% Gordura',
    unidade: '%',
    diminuirEhPositivo: true,
    icon: Activity,
  },
  {
    id: 'massaMagraKg',
    label: 'Massa magra',
    unidade: 'kg',
    diminuirEhPositivo: false,
    icon: Sparkles,
  },
  { id: 'rmSupino', label: 'RM Supino', unidade: 'kg', diminuirEhPositivo: false, icon: Dumbbell },
  { id: 'rmSquat', label: 'RM Squat', unidade: 'kg', diminuirEhPositivo: false, icon: Dumbbell },
  {
    id: 'rmDeadlift',
    label: 'RM Deadlift',
    unidade: 'kg',
    diminuirEhPositivo: false,
    icon: Dumbbell,
  },
  { id: 'fmsScore', label: 'FMS', unidade: '/21', diminuirEhPositivo: false, icon: Activity },
]

const PLAN_RANK = { free: 0, plus: 1, pro: 2 }

export function FichaOverviewTab({
  aluno,
  onOpenPlano,
  onAnaliseIA,
  onNovaAvaliacao,
}: FichaOverviewTabProps) {
  const plano = aluno.planoAtual
  const atividade = aluno.atividadeRecente ?? []
  const alertas = aluno.alertasMotivos ?? []
  const avaliacoes = aluno.avaliacoes ?? []
  const meta = aluno.metaPrincipal
  const planoPersonal = aluno.planoPersonal ?? 'plus'
  const canAnaliseIA =
    PLAN_RANK[planoPersonal as keyof typeof PLAN_RANK] >= PLAN_RANK.pro

  return (
    <div className="space-y-5">
      {/* Plano atual destacado (full-width) */}
      <PlanoCard plano={plano} aluno={aluno} onOpenPlano={onOpenPlano} />

      {/* Resumo de Performance */}
      {avaliacoes.length > 0 && <PerformanceTiles avaliacoes={avaliacoes} />}

      {/* Mid: Evolução chart (2/3) + Meta + IA (1/3) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EvolucaoCard avaliacoes={avaliacoes} onNovaAvaliacao={onNovaAvaliacao} />
        </div>
        <div className="space-y-5">
          {meta && <MetaCard meta={meta} />}
          <AnaliseIaCta canAnaliseIA={canAnaliseIA} onClick={onAnaliseIA} />
        </div>
      </div>

      {/* Bottom: Atividade + Alertas/Observações */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AtividadeCard atividade={atividade} />
        </div>
        <div className="space-y-5">
          {alertas.length > 0 && <AlertasCard alertas={alertas} />}
          {aluno.observacoesIniciais && (
            <ObservacoesCard texto={aluno.observacoesIniciais} />
          )}
          <ProximaAvaliacaoCard data={aluno.proximaAvaliacaoData} />
        </div>
      </div>
    </div>
  )
}

// ===== Subcomponents =====

function PlanoCard({
  plano,
  aluno,
  onOpenPlano,
}: {
  plano: Aluno['planoAtual']
  aluno: Aluno
  onOpenPlano?: () => void
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Plano atual
        </p>
        {plano && (
          <button
            type="button"
            onClick={onOpenPlano}
            className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Ver completo
            <ChevronRight size={12} />
          </button>
        )}
      </header>

      {plano ? (
        <div className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {plano.nome}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${OBJETIVO_TONE[plano.objetivo]}`}
                >
                  {OBJETIVO_LABEL[plano.objetivo]}
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  Início:{' '}
                  {new Date(plano.inicioData).toLocaleDateString('pt-BR')}
                </span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  ·{' '}
                  {plano.duracaoSemanas
                    ? `${plano.duracaoSemanas} semanas`
                    : 'Indeterminado'}
                </span>
              </div>
            </div>

            {aluno.proximaSessao && (
              <div className="flex items-center gap-3 rounded-xl bg-teal-50 px-4 py-3 dark:bg-teal-900/20 lg:max-w-md">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                  <CalendarDays size={16} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                    Próxima sessão
                  </p>
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">
                    {new Date(aluno.proximaSessao.data).toLocaleDateString(
                      'pt-BR',
                      { weekday: 'short', day: '2-digit', month: 'short' },
                    )}{' '}
                    · Treino {aluno.proximaSessao.treinoLetra} ·{' '}
                    {aluno.proximaSessao.treinoNome}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Sem plano atribuído ainda.
        </p>
      )}
    </article>
  )
}

function PerformanceTiles({ avaliacoes }: { avaliacoes: AvaliacaoResumo[] }) {
  const ordered = [...avaliacoes].sort((a, b) => b.data.localeCompare(a.data))
  const atual = ordered[0]
  const anterior = ordered[1]

  const tiles: { key: MetricaKey; label: string; unidade: string; diminuirEhPositivo: boolean }[] = [
    { key: 'pesoKg', label: 'Peso', unidade: 'kg', diminuirEhPositivo: false },
    { key: 'percentualGordura', label: '% Gord', unidade: '%', diminuirEhPositivo: true },
    { key: 'massaMagraKg', label: 'Massa magra', unidade: 'kg', diminuirEhPositivo: false },
    { key: 'rmSupino', label: 'Sup 1RM', unidade: 'kg', diminuirEhPositivo: false },
    { key: 'rmSquat', label: 'Squat 1RM', unidade: 'kg', diminuirEhPositivo: false },
    { key: 'fmsScore', label: 'FMS', unidade: '/21', diminuirEhPositivo: false },
  ]

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Resumo de Performance
        </p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          última avaliação ·{' '}
          {new Date(atual.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </p>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <PerformanceTile
            key={t.key}
            label={t.label}
            unidade={t.unidade}
            valor={atual[t.key as keyof AvaliacaoResumo] as number | null}
            anterior={
              anterior
                ? (anterior[t.key as keyof AvaliacaoResumo] as number | null)
                : null
            }
            diminuirEhPositivo={t.diminuirEhPositivo}
          />
        ))}
      </div>
    </article>
  )
}

function PerformanceTile({
  label,
  unidade,
  valor,
  anterior,
  diminuirEhPositivo,
}: {
  label: string
  unidade: string
  valor: number | null
  anterior: number | null
  diminuirEhPositivo: boolean
}) {
  const delta = valor != null && anterior != null ? valor - anterior : null
  const isPositive =
    delta == null
      ? null
      : delta === 0
        ? 'neutral'
        : diminuirEhPositivo
          ? delta < 0
          : delta > 0

  const deltaTone =
    isPositive === 'neutral'
      ? 'text-slate-500 dark:text-slate-400'
      : isPositive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-inset ring-slate-100 dark:bg-slate-900/60 dark:ring-slate-800">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <div className="mt-1 flex items-baseline gap-0.5">
        <span className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {valor ?? '—'}
        </span>
        {valor != null && (
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            {unidade}
          </span>
        )}
      </div>
      {delta != null && (
        <div className={`mt-1 inline-flex items-center gap-0.5 font-mono text-[10px] font-semibold tabular-nums ${deltaTone}`}>
          {delta === 0 ? (
            <Minus size={9} strokeWidth={3} />
          ) : delta > 0 ? (
            <ArrowUp size={9} strokeWidth={3} />
          ) : (
            <ArrowDown size={9} strokeWidth={3} />
          )}
          {Math.abs(delta).toFixed(delta % 1 === 0 ? 0 : 1)}
          {unidade.startsWith('/') ? '' : unidade}
        </div>
      )}
    </div>
  )
}

function EvolucaoCard({
  avaliacoes,
  onNovaAvaliacao,
}: {
  avaliacoes: AvaliacaoResumo[]
  onNovaAvaliacao?: () => void
}) {
  const [metricaSelecionada, setMetricaSelecionada] = useState<MetricaKey>('pesoKg')

  const pontos = useMemo(() => {
    return [...avaliacoes]
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((a) => ({
        data: a.data,
        valor: a[metricaSelecionada as keyof AvaliacaoResumo] as number | null,
      }))
      .filter((p): p is { data: string; valor: number } => p.valor != null)
  }, [avaliacoes, metricaSelecionada])

  const metricaInfo = METRICA_OPTIONS.find((m) => m.id === metricaSelecionada)!

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Evolução
        </p>
        <div className="flex flex-wrap gap-1">
          {METRICA_OPTIONS.map((m) => {
            const active = metricaSelecionada === m.id
            const Icon = m.icon
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetricaSelecionada(m.id)}
                className={`
                  inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-colors
                  ${
                    active
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon size={10} />
                {m.label}
              </button>
            )
          })}
        </div>
      </header>

      <LineChart
        pontos={pontos}
        unidade={metricaInfo.unidade}
        diminuirEhPositivo={metricaInfo.diminuirEhPositivo}
      />

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {avaliacoes.length} avaliaç
          {avaliacoes.length === 1 ? 'ão' : 'ões'}
        </p>
        <button
          type="button"
          onClick={onNovaAvaliacao}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          + Nova avaliação
        </button>
      </div>
    </article>
  )
}

function LineChart({
  pontos,
  unidade,
  diminuirEhPositivo,
}: {
  pontos: { data: string; valor: number }[]
  unidade: string
  diminuirEhPositivo: boolean
}) {
  if (pontos.length < 2) {
    return (
      <p className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        Precisa de ao menos 2 avaliações pra mostrar evolução.
      </p>
    )
  }

  const valores = pontos.map((p) => p.valor)
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const yMax = max + (max - min) * 0.2 || max + 5
  const yMin = Math.max(0, min - (max - min) * 0.2)
  const range = yMax - yMin || 1

  const W = 100
  const H = 60
  const padX = 6

  const pointX = (i: number) =>
    pontos.length === 1 ? W / 2 : padX + (i / (pontos.length - 1)) * (W - padX * 2)
  const pointY = (v: number) => H - ((v - yMin) / range) * H + 2

  const linePath = pontos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${pointX(i)} ${pointY(p.valor)}`)
    .join(' ')

  const areaPath = `${linePath} L ${pointX(pontos.length - 1)} ${H + 2} L ${pointX(0)} ${H + 2} Z`

  const delta = pontos[pontos.length - 1].valor - pontos[0].valor
  const positive =
    delta === 0
      ? 'neutral'
      : diminuirEhPositivo
        ? delta < 0
        : delta > 0
  const deltaTone =
    positive === 'neutral'
      ? 'text-slate-500 dark:text-slate-400'
      : positive
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between">
        <p className="font-mono">
          <span className="text-3xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {pontos[pontos.length - 1].valor}
          </span>
          <span className="ml-1 text-sm text-slate-400 dark:text-slate-500">
            {unidade}
          </span>
        </p>
        <p className={`font-mono text-xs font-semibold tabular-nums ${deltaTone}`}>
          {delta > 0 ? '+' : ''}
          {delta.toFixed(delta % 1 === 0 ? 0 : 1)}{' '}
          {unidade.startsWith('/') ? '' : unidade} desde{' '}
          {new Date(pontos[0].data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
          })}
        </p>
      </div>

      <div className="mt-4 flex h-32 items-stretch gap-2">
        <div className="flex flex-col justify-between font-mono text-[9px] text-slate-400 dark:text-slate-500 py-0.5">
          <span>{yMax.toFixed(1)}</span>
          <span>{((yMax + yMin) / 2).toFixed(1)}</span>
          <span>{yMin.toFixed(1)}</span>
        </div>

        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${W} ${H + 4}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <path
              d={areaPath}
              className="fill-teal-500/15 dark:fill-teal-400/10"
            />
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-teal-500 dark:text-teal-400"
            />
            {pontos.map((p, i) => (
              <circle
                key={i}
                cx={pointX(i)}
                cy={pointY(p.valor)}
                r="1.6"
                className="fill-teal-500 dark:fill-teal-400"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="ml-9 mt-1 flex justify-between font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {pontos.map((p, i) => (
          <span key={i}>
            {new Date(p.data).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
          </span>
        ))}
      </div>
    </div>
  )
}

function MetaCard({ meta }: { meta: MetaPrincipal }) {
  const tomBar = OBJETIVO_TONE[meta.tom]
  const restante =
    meta.direcao === 'perder'
      ? meta.valorAtual - meta.valorAlvo
      : meta.valorAlvo - meta.valorAtual

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Target size={12} />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">
          Meta principal
        </span>
      </div>

      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-slate-900 dark:text-slate-50">
        {meta.titulo}
      </h3>

      <div className="mt-4">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>
            <span className="tabular-nums text-slate-700 dark:text-slate-200">
              {meta.valorAtual}
            </span>
            {meta.unidade}
          </span>
          <span>
            alvo:{' '}
            <span className="tabular-nums text-slate-700 dark:text-slate-200">
              {meta.valorAlvo}
            </span>
            {meta.unidade}
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full ${tomBar.includes('teal') ? 'bg-teal-500' : tomBar.includes('amber') ? 'bg-amber-500' : tomBar.includes('violet') ? 'bg-violet-500' : tomBar.includes('rose') ? 'bg-rose-500' : 'bg-slate-500'}`}
            style={{ width: `${meta.percentualAtingido}%` }}
          />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {meta.percentualAtingido}
            <span className="ml-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
              %
            </span>
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            faltam{' '}
            <span className="tabular-nums text-slate-700 dark:text-slate-200">
              {Math.abs(restante).toFixed(1)}
            </span>
            {meta.unidade}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
        <span className="font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Prazo
        </span>
        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
          {new Date(meta.prazoData).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}{' '}
          ·{' '}
          <span className="text-teal-600 dark:text-teal-400">
            {meta.diasRestantes}d
          </span>
        </span>
      </div>
    </article>
  )
}

function AnaliseIaCta({
  canAnaliseIA,
  onClick,
}: {
  canAnaliseIA: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all ${
        canAnaliseIA
          ? 'border-orange-300 bg-gradient-to-br from-slate-900 via-orange-950 to-orange-900 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/20 dark:border-orange-700'
          : 'border-dashed border-orange-300 bg-gradient-to-br from-slate-50 via-orange-50/50 to-orange-100/50 dark:border-orange-800 dark:from-slate-900 dark:via-orange-950/30 dark:to-orange-900/30'
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-400 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <div
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${
            canAnaliseIA
              ? 'text-orange-300'
              : 'text-orange-700 dark:text-orange-300'
          }`}
        >
          <Sparkles size={12} />
          Análise IA
          {!canAnaliseIA && <span className="font-sans">· Pro</span>}
        </div>
        <h3
          className={`mt-2 text-base font-semibold ${
            canAnaliseIA ? 'text-white' : 'text-slate-900 dark:text-slate-50'
          }`}
        >
          Gerar relatório completo
        </h3>
        <p
          className={`mt-1 text-xs leading-relaxed ${
            canAnaliseIA
              ? 'text-orange-100/90'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          IA cruza avaliações, execução de treino, adesão e comentários pra
          montar análise estruturada (pontos fortes, atenção, projeção,
          próximos passos).
        </p>
        <p
          className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
            canAnaliseIA
              ? 'text-orange-300'
              : 'text-orange-700 dark:text-orange-300'
          }`}
        >
          {canAnaliseIA ? 'Gerar análise' : 'Disponível no Pro'} →
        </p>
      </div>
    </button>
  )
}

function AtividadeCard({
  atividade,
}: {
  atividade: NonNullable<Aluno['atividadeRecente']>
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Atividade recente
        </p>
      </header>

      {atividade.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Sem atividade recente
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {atividade.map((ev) => {
            const Icon = TIPO_ATIVIDADE_ICON[ev.tipo] ?? CheckCircle2
            const tone = TIPO_ATIVIDADE_TONE[ev.tipo] ?? ''
            return (
              <li key={ev.id} className="flex items-start gap-3 px-5 py-3">
                <span className={`mt-0.5 ${tone}`}>
                  <Icon size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-slate-700 dark:text-slate-300">
                    {ev.descricao}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {ev.timestamp}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </article>
  )
}

function AlertasCard({ alertas }: { alertas: string[] }) {
  return (
    <article className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/50 dark:bg-amber-900/10">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
        <AlertTriangle size={14} />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
          Alertas
        </p>
      </div>
      <ul className="mt-2 space-y-1.5">
        {alertas.map((a, i) => (
          <li
            key={i}
            className="text-[12px] leading-snug text-amber-900 dark:text-amber-200"
          >
            • {a}
          </li>
        ))}
      </ul>
    </article>
  )
}

function ObservacoesCard({ texto }: { texto: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 dark:border-slate-800 dark:bg-slate-900/40">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Observações iniciais
      </p>
      <p className="mt-2 text-[12px] italic leading-relaxed text-slate-600 dark:text-slate-400">
        {texto}
      </p>
    </article>
  )
}

function ProximaAvaliacaoCard({ data }: { data?: string }) {
  if (!data) return null
  const dias = Math.round(
    (new Date(data).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )
  const tone =
    dias < 0
      ? 'rose'
      : dias <= 14
        ? 'amber'
        : 'teal'

  const toneClass = {
    rose: 'border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-300',
    amber: 'border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300',
    teal: 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
  }[tone]

  return (
    <article className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-center gap-2">
        <CalendarDays size={14} />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
          Próxima avaliação
        </p>
      </div>
      <p className="mt-2 font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {new Date(data).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </p>
      <p className="mt-0.5 text-[11px]">
        {dias < 0
          ? `Atrasada há ${Math.abs(dias)} dias`
          : dias === 0
            ? 'Hoje'
            : `em ${dias} dias`}
      </p>
    </article>
  )
}
