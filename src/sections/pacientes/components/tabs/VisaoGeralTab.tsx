import {
  Activity,
  Calculator,
  Calendar,
  CalendarClock,
  Footprints,
  Heart,
  Minus,
  Moon,
  Scale,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import type {
  EvolucaoPeso,
  MacrosHoje,
  MetaPrincipal,
  PlanTier,
  ResumoSaudeItem,
  TrendDirection,
  VisaoGeralData,
} from '@/../product/sections/pacientes/types'

interface VisaoGeralTabProps {
  data: VisaoGeralData
  currentPlan: PlanTier
  onRangeChange?: (rangeId: string) => void
  onAnaliseIa?: () => void
}

const ICON_MAP: Record<string, typeof Scale> = {
  scale: Scale,
  calculator: Calculator,
  target: Target,
  footprints: Footprints,
  moon: Moon,
  heart: Heart,
  activity: Activity,
}

const TREND_ICON: Record<TrendDirection, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function VisaoGeralTab({ data, currentPlan, onRangeChange, onAnaliseIa }: VisaoGeralTabProps) {
  const canAnaliseIa = PLAN_RANK[currentPlan] >= PLAN_RANK['pro']

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Left col 2/3 */}
      <div className="space-y-5 lg:col-span-2">
        {/* Resumo de Saúde */}
        <Card title="Resumo de Saúde" subtitle="Últimos 30 dias">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.resumoSaude.map((item) => (
              <ResumoTile key={item.label} item={item} />
            ))}
          </div>
        </Card>

        {/* Evolução de peso */}
        <Card
          title="Evolução de peso"
          right={
            <RangeToggle
              ranges={data.evolucaoPeso.ranges}
              selected={data.evolucaoPeso.selectedRange}
              onChange={onRangeChange}
            />
          }
        >
          <PesoChart series={data.evolucaoPeso.series} />
        </Card>

        {/* Macros hoje */}
        <Card title="Macros hoje" subtitle="Vindo do diário alimentar do app">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MacroBar label="Calorias" data={data.macrosHoje.calories} primary />
            <MacroBar label="Proteína" data={data.macrosHoje.protein} />
            <MacroBar label="Carboidrato" data={data.macrosHoje.carbs} />
            <MacroBar label="Gordura" data={data.macrosHoje.fat} />
          </div>
        </Card>
      </div>

      {/* Right col 1/3 */}
      <div className="space-y-5">
        {/* Análise IA CTA */}
        <button
          type="button"
          onClick={onAnaliseIa}
          className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all ${
            canAnaliseIa
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
                canAnaliseIa ? 'text-orange-300' : 'text-orange-700 dark:text-orange-300'
              }`}
            >
              <Sparkles size={12} />
              Análise IA
              {!canAnaliseIa && <span className="font-sans">· Pro</span>}
            </div>
            <h3
              className={`mt-2 text-base font-semibold ${
                canAnaliseIa ? 'text-white' : 'text-slate-900 dark:text-slate-50'
              }`}
            >
              Gerar relatório completo
            </h3>
            <p
              className={`mt-1 text-xs ${
                canAnaliseIa ? 'text-orange-100/90' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              IA cruza fotos corporais, bioimpedância, métricas e adesão pra montar análise estruturada (Resumo, Pontos fortes, Atenção, Meta, Projeção, Próximos passos).
            </p>
            <p
              className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${
                canAnaliseIa ? 'text-orange-300' : 'text-orange-700 dark:text-orange-300'
              }`}
            >
              {canAnaliseIa ? 'Gerar análise' : 'Disponível no Pro'} →
            </p>
          </div>
        </button>

        {/* Meta Principal */}
        {data.metaPrincipal && <MetaCard meta={data.metaPrincipal} />}

        {/* Última / Próxima consulta */}
        <Card title="Consultas">
          <div className="space-y-3">
            <ConsultaInfoRow
              icon={<CalendarClock size={14} />}
              label="Última"
              value={
                data.ultimaConsulta
                  ? `${data.ultimaConsulta.label}`
                  : '—'
              }
              detail={data.ultimaConsulta?.type}
            />
            <ConsultaInfoRow
              icon={<Calendar size={14} />}
              label="Próxima"
              value={data.proximaConsulta?.label ?? 'Não agendada'}
              detail={data.proximaConsulta?.type}
              warning={!data.proximaConsulta}
            />
          </div>
        </Card>

        {/* Plano vigente */}
        {data.planoExpira && (
          <Card title="Plano alimentar">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Vigente · expira em
                </p>
                <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                  {data.planoExpira.daysRemaining}{' '}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    dias
                  </span>
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {formatDate(data.planoExpira.date)}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ===== Sub components =====

function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </header>
      <div className="mt-4">{children}</div>
    </article>
  )
}

function ResumoTile({ item }: { item: ResumoSaudeItem }) {
  const Icon = ICON_MAP[item.icon] ?? Activity
  const TrendIcon = TREND_ICON[item.trend]
  const trendTone =
    item.trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : item.trend === 'down'
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-slate-500 dark:text-slate-400'

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <Icon size={12} />
        <p className="text-[10px] font-medium uppercase tracking-wider">{item.label}</p>
      </div>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {item.value}
        </span>
        {item.unit && (
          <span className="text-[10px] text-slate-500 dark:text-slate-500">{item.unit}</span>
        )}
      </p>
      <p className={`mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium ${trendTone}`}>
        <TrendIcon size={10} />
        {item.delta}
      </p>
    </div>
  )
}

function RangeToggle({
  ranges,
  selected,
  onChange,
}: {
  ranges: { id: string; label: string }[]
  selected: string
  onChange?: (id: string) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-950">
      {ranges.map((r) => {
        const active = r.id === selected
        return (
          <button
            key={r.id}
            onClick={() => onChange?.(r.id)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              active
                ? 'bg-teal-600 text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
            }`}
          >
            {r.label}
          </button>
        )
      })}
    </div>
  )
}

function PesoChart({ series }: { series: { date: string; value: number }[] }) {
  if (series.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-500">Sem dados.</p>
  }
  const values = series.map((s) => s.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const width = 600
  const height = 140
  const padding = { top: 16, right: 8, bottom: 28, left: 36 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = series.map((s, i) => {
    const x = padding.left + (i / (series.length - 1)) * chartW
    const y = padding.top + ((max - s.value) / range) * chartH
    return { x, y, value: s.value, date: s.date }
  })

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`
  const firstValue = series[0].value
  const lastValue = series[series.length - 1].value
  const delta = lastValue - firstValue

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {lastValue} <span className="text-xs font-normal text-slate-500">kg</span>
        </p>
        <p
          className={`font-mono text-xs font-medium tabular-nums ${
            delta < 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : delta > 0
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-slate-500'
          }`}
        >
          {delta > 0 ? '+' : ''}
          {delta.toFixed(1)} kg no período
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="peso-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(20 184 166)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(20 184 166)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#peso-fill)" />
        <path d={pathD} fill="none" stroke="rgb(13 148 136)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r="2.5" fill="white" stroke="rgb(13 148 136)" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  )
}

function MacroBar({
  label,
  data,
  primary,
}: {
  label: string
  data: { consumed: number; target: number; unit: string }
  primary?: boolean
}) {
  const percent = Math.min(Math.round((data.consumed / data.target) * 100), 100)
  const barColor = primary ? 'bg-teal-500' : 'bg-emerald-400'

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 flex items-baseline gap-1">
        <span className="font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {data.consumed}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          / {data.target} {data.unit}
        </span>
      </p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
        {percent}%
      </p>
    </div>
  )
}

function MetaCard({ meta }: { meta: MetaPrincipal }) {
  const statusTone: Record<MetaPrincipal['status'], string> = {
    'on-track': 'text-emerald-600 dark:text-emerald-400',
    'at-risk': 'text-orange-600 dark:text-orange-400',
    achieved: 'text-teal-600 dark:text-teal-400',
  }
  const statusLabel: Record<MetaPrincipal['status'], string> = {
    'on-track': 'No rumo',
    'at-risk': 'Em risco',
    achieved: 'Atingida',
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Target size={14} className="text-slate-400" />
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Meta principal
          </h2>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${statusTone[meta.status]}`}
        >
          {statusLabel[meta.status]}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{meta.title}</p>
      <div className="mt-3 flex items-baseline justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>
          De{' '}
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {meta.current}
          </span>
        </span>
        <span>
          até{' '}
          <span className="font-mono text-slate-700 dark:text-slate-300">
            {meta.target}
          </span>
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700"
          style={{ width: `${meta.progressPercent}%` }}
        />
      </div>
      <div className="mt-2 flex items-baseline justify-between text-[11px]">
        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
          {meta.progressPercent}%
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {meta.daysRemaining} dias restantes
        </span>
      </div>
    </article>
  )
}

function ConsultaInfoRow({
  icon,
  label,
  value,
  detail,
  warning,
}: {
  icon: React.ReactNode
  label: string
  value: string
  detail?: string
  warning?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            warning
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {value}
        </p>
        {detail && (
          <p className="text-[10px] text-slate-500 dark:text-slate-500">{detail}</p>
        )}
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
