import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Cpu,
  DollarSign,
  FileText,
  Heart,
  Image as ImageIcon,
  Info,
  MessageSquare,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Utensils,
  Zap,
} from 'lucide-react'
import type {
  AdminCustosIaProps,
  AlertSeverity,
  FeatureCostCard,
  KpiTile,
  MarginHealth,
  OperationalAlert,
  PatientCostRow,
  ProfessionalCostRow,
  TimeframeId,
  TrendDirection,
} from '@/../product/sections/admin-custos-ia/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  dollar: DollarSign,
  cpu: Cpu,
  'trending-up': TrendingUp,
  sparkles: Sparkles,
  users: Users,
  'message-square': MessageSquare,
  utensils: Utensils,
  'file-text': FileText,
  image: ImageIcon,
  activity: Activity,
  heart: Heart,
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  plus: 'Plus',
  pro: 'Pro',
  clinica: 'Clínica',
}

const TIER_COLOR: Record<string, string> = {
  plus: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900',
  pro: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900',
  clinica: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  free: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

const SOURCE_LABEL: Record<string, string> = {
  patient_plus: 'Plus avulso',
  vinculo: 'Vínculo',
  plus_and_vinculo: 'Plus + Vínculo',
}

const SEVERITY_STYLE: Record<AlertSeverity, { ring: string; icon: React.ComponentType<{ size?: number; className?: string }>; iconColor: string }> = {
  critical: {
    ring: 'ring-rose-200 dark:ring-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30',
    icon: AlertTriangle,
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  warning: {
    ring: 'ring-amber-200 dark:ring-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30',
    icon: Zap,
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    ring: 'ring-sky-200 dark:ring-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30',
    icon: Info,
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
}

function marginColor(health: MarginHealth) {
  if (health === 'critical') return 'text-rose-600 dark:text-rose-400'
  if (health === 'warning') return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

function marginRowBg(health: MarginHealth) {
  if (health === 'critical') return 'bg-rose-50/40 dark:bg-rose-950/20'
  return ''
}

function trendDecor(t: TrendDirection) {
  if (t === 'up') return { icon: TrendingUp, color: 'text-amber-600 dark:text-amber-400' }
  if (t === 'down') return { icon: TrendingDown, color: 'text-emerald-600 dark:text-emerald-400' }
  return { icon: ArrowRight, color: 'text-slate-500 dark:text-slate-400' }
}

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function formatNumber(n: number) {
  return new Intl.NumberFormat('pt-BR').format(n)
}

function KpiCard({ kpi }: { kpi: KpiTile }) {
  const Icon = ICON_MAP[kpi.icon] ?? Sparkles
  const toneRing =
    kpi.tone === 'positive'
      ? 'ring-emerald-200/70 dark:ring-emerald-900/40'
      : kpi.tone === 'warning'
      ? 'ring-amber-200/70 dark:ring-amber-900/40'
      : kpi.tone === 'critical'
      ? 'ring-rose-200/70 dark:ring-rose-900/40'
      : 'ring-slate-200 dark:ring-slate-800'
  const toneIcon =
    kpi.tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
      : kpi.tone === 'warning'
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
      : kpi.tone === 'critical'
      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
      : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60'

  return (
    <div
      className={`relative rounded-2xl bg-white p-4 ring-1 ${toneRing} dark:bg-slate-900`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {kpi.label}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneIcon}`}>
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {kpi.value}
      </div>
      {kpi.secondary && (
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{kpi.secondary}</div>
      )}
    </div>
  )
}

function TimeframeToggle({
  timeframe,
  options,
  onChange,
}: {
  timeframe: TimeframeId
  options: { id: TimeframeId; label: string }[]
  onChange?: (t: TimeframeId) => void
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      {options.map((opt) => {
        const active = opt.id === timeframe
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange?.(opt.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-50'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function PatientRow({
  row,
  onClick,
}: {
  row: PatientCostRow
  onClick?: () => void
}) {
  const marginSign = row.marginPct >= 0 ? '+' : ''
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${marginRowBg(row.marginHealth)}`}
    >
      <img
        src={row.avatarUrl}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
            {row.name}
          </span>
          <span className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200 dark:text-slate-400 dark:ring-slate-700">
            {SOURCE_LABEL[row.source]}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
          {row.emailMasked} · {row.topFeatureLabel}
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <div className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
          {formatNumber(row.analysesCount)} análises
        </div>
        <div className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
          {formatBRL(row.costBrl)} · pago {formatBRL(row.revenueBrl)}
        </div>
      </div>
      <div className={`text-right font-mono text-sm font-semibold tabular-nums ${marginColor(row.marginHealth)}`}>
        {marginSign}
        {row.marginPct}%
      </div>
      <ArrowRight
        size={14}
        className="hidden shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 sm:block"
      />
    </button>
  )
}

function ProfessionalRow({
  row,
  onClick,
}: {
  row: ProfessionalCostRow
  onClick?: () => void
}) {
  const marginSign = row.marginPct >= 0 ? '+' : ''
  const limit = row.patientsLimit ? `${row.activePatients}/${row.patientsLimit}` : `${row.activePatients}/∞`
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${marginRowBg(row.marginHealth)}`}
    >
      <img
        src={row.avatarUrl}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
            {row.name}
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${TIER_COLOR[row.tier]}`}
          >
            {TIER_LABEL[row.tier]}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
          {row.registry} · top: {row.topConsumerPatientName}
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <div className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
          {limit} pacientes
        </div>
        <div className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
          {formatBRL(row.costBrl)} · seat {formatBRL(row.seatPriceBrl)}
        </div>
      </div>
      <div className={`text-right font-mono text-sm font-semibold tabular-nums ${marginColor(row.marginHealth)}`}>
        {marginSign}
        {row.marginPct}%
      </div>
      <ArrowRight
        size={14}
        className="hidden shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 sm:block"
      />
    </button>
  )
}

function FeatureCard({
  card,
  onClick,
}: {
  card: FeatureCostCard
  onClick?: () => void
}) {
  const Icon = ICON_MAP[card.icon] ?? Sparkles
  const trend = trendDecor(card.trend)
  const TrendIcon = trend.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition-colors hover:ring-slate-300 dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Icon size={14} />
          </span>
          <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
            {card.label}
          </span>
        </div>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${trend.color}`}>
          <TrendIcon size={12} />
          {card.trend === 'stable' ? '─' : `${card.trendDeltaPct > 0 ? '+' : ''}${card.trendDeltaPct}%`}
        </span>
      </div>
      <div className="mt-3 font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {formatBRL(card.totalCostBrl)}
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="tabular-nums">{formatNumber(card.totalCalls)} chamadas</span>
        <span className="font-mono tabular-nums">
          {formatBRL(card.avgCostPerCallBrl)}/call
        </span>
      </div>
    </button>
  )
}

function AlertItem({
  alert,
  onAction,
}: {
  alert: OperationalAlert
  onAction?: () => void
}) {
  const sev = SEVERITY_STYLE[alert.severity]
  const SevIcon = sev.icon
  return (
    <article className={`rounded-xl p-3 ring-1 ${sev.ring}`}>
      <div className="flex items-start gap-2">
        <SevIcon size={16} className={`mt-0.5 shrink-0 ${sev.iconColor}`} />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold leading-snug text-slate-900 dark:text-slate-50">
            {alert.title}
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
            {alert.description}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {alert.targetLabel} · {alert.createdAtLabel}
            </span>
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
            >
              {alert.ctaLabel}
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function AdminCustosIa({
  header,
  kpis,
  patientsByCost,
  professionalsByCost,
  featuresCost,
  alerts,
  emptyStates,
  onTimeframeChange,
  onPatientClick,
  onProfessionalClick,
  onFeatureClick,
  onAlertAction,
  onSeeAllPatients,
  onSeeAllProfessionals,
}: AdminCustosIaProps) {
  return (
    <div
      data-nymos-admin-custos-ia
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Admin · Nymos
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {header.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {header.subtitle} · <span className="tabular-nums">{header.lastUpdatedLabel}</span>
              </p>
            </div>
            <TimeframeToggle
              timeframe={header.timeframe}
              options={header.timeframeOptions}
              onChange={onTimeframeChange}
            />
          </div>
        </header>

        {/* KPIs */}
        <section
          aria-label="Indicadores de margem"
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </section>

        {/* Main grid: tables on left, alerts on right */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left column */}
          <div className="min-w-0 space-y-6">
            {/* Patients table */}
            <section
              style={{ animationDelay: '240ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
            >
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Pacientes Plus por custo
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    Top {patientsByCost.length} · ordenado por margem (piores primeiro)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSeeAllPatients?.()}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Ver tudo <ArrowRight size={12} />
                </button>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {patientsByCost.length === 0 ? (
                  <EmptyBlock {...emptyStates.patients} />
                ) : (
                  patientsByCost.map((row) => (
                    <PatientRow
                      key={row.id}
                      row={row}
                      onClick={() => onPatientClick?.(row.id)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Professionals table */}
            <section
              style={{ animationDelay: '320ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
            >
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Profissionais por seat
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    Top {professionalsByCost.length} · custo vs seat pago
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSeeAllProfessionals?.()}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  Ver tudo <ArrowRight size={12} />
                </button>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {professionalsByCost.length === 0 ? (
                  <EmptyBlock {...emptyStates.professionals} />
                ) : (
                  professionalsByCost.map((row) => (
                    <ProfessionalRow
                      key={row.id}
                      row={row}
                      onClick={() => onProfessionalClick?.(row.id)}
                    />
                  ))
                )}
              </div>
            </section>

            {/* Features grid */}
            <section style={{ animationDelay: '400ms' }} className="nymos-reveal opacity-0">
              <header className="flex items-end justify-between px-1">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                    Custo por feature de IA
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Tendência mês/mês · clique pra abrir detalhe
                  </p>
                </div>
              </header>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featuresCost.map((card) => (
                  <FeatureCard
                    key={card.id}
                    card={card}
                    onClick={() => onFeatureClick?.(card.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right column: alerts */}
          <aside
            style={{ animationDelay: '480ms' }}
            className="nymos-reveal opacity-0 lg:sticky lg:top-6 lg:self-start"
          >
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <header className="flex items-center justify-between pb-3">
                <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Alertas ativos
                </h2>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900">
                  {alerts.length}
                </span>
              </header>
              <div className="space-y-2">
                {alerts.length === 0 ? (
                  <EmptyBlock {...emptyStates.alerts} compact />
                ) : (
                  alerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onAction={() => onAlertAction?.(alert.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function EmptyBlock({
  title,
  description,
  compact,
}: {
  title: string
  description: string
  compact?: boolean
}) {
  return (
    <div className={`text-center ${compact ? 'px-3 py-6' : 'px-3 py-12'}`}>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal 380ms ease-out forwards;
      }
    `}</style>
  )
}
