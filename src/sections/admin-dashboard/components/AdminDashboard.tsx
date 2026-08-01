import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Ban,
  ChevronRight,
  Clock,
  CreditCard,
  Cpu,
  DollarSign,
  Eye,
  FileText,
  Link as LinkIcon,
  Pause,
  Repeat,
  RotateCcw,
  Server,
  Shield,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import type {
  ActionQueueItem,
  AdminDashboardProps,
  AlertSeverity,
  AuditEvent,
  DashboardHeader,
  Kpi,
  MrrPoint,
  PanelCard,
  SystemStatus,
  Timeframe,
  UpcomingEvent,
} from '@/../product/sections/admin-dashboard/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  dollar: DollarSign,
  users: Users,
  'trending-up': TrendingUp,
  activity: Activity,
  'user-check': UserCheck,
  'credit-card': CreditCard,
  'alert-triangle': AlertTriangle,
  zap: Zap,
  link: LinkIcon,
  cpu: Cpu,
  shield: Shield,
  server: Server,
  'file-text': FileText,
  eye: Eye,
  'rotate-ccw': RotateCcw,
  ban: Ban,
  pause: Pause,
  repeat: Repeat,
  clock: Clock,
}

const SEVERITY_CHIP: Record<AlertSeverity, string> = {
  critical:
    'bg-rose-50 text-rose-700 ring-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60 dark:hover:bg-rose-950/60',
  warning:
    'bg-amber-50 text-amber-800 ring-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900/60 dark:hover:bg-amber-950/60',
  info: 'bg-sky-50 text-sky-700 ring-sky-200 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900/60 dark:hover:bg-sky-950/60',
}

const SEVERITY_DOT: Record<AlertSeverity, string> = {
  critical: 'bg-rose-500',
  warning: 'bg-amber-500',
  info: 'bg-sky-500',
}

const SEVERITY_RING: Record<AlertSeverity, string> = {
  critical: 'ring-2 ring-rose-300 dark:ring-rose-800/80',
  warning: 'ring-2 ring-amber-300 dark:ring-amber-800/80',
  info: 'ring-2 ring-sky-300 dark:ring-sky-800/80',
}

function toneClasses(tone: Kpi['tone']) {
  switch (tone) {
    case 'positive':
      return {
        deltaText: 'text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
      }
    case 'negative':
      return {
        deltaText: 'text-rose-600 dark:text-rose-400',
        iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
      }
    case 'warning':
      return {
        deltaText: 'text-amber-700 dark:text-amber-400',
        iconBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
      }
    default:
      return {
        deltaText: 'text-slate-500 dark:text-slate-400',
        iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
      }
  }
}

function systemBannerClasses(status: SystemStatus['status']) {
  switch (status) {
    case 'operational':
      return {
        wrap: 'bg-emerald-50 ring-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:ring-emerald-900/60 dark:text-emerald-100',
        dot: 'bg-emerald-500',
        label: 'Todos os sistemas operacionais',
      }
    case 'degraded':
      return {
        wrap: 'bg-amber-50 ring-amber-200 text-amber-900 dark:bg-amber-950/40 dark:ring-amber-900/60 dark:text-amber-100',
        dot: 'bg-amber-500 animate-pulse',
        label: 'Serviços com latência elevada',
      }
    case 'incident':
      return {
        wrap: 'bg-rose-50 ring-rose-200 text-rose-900 dark:bg-rose-950/40 dark:ring-rose-900/60 dark:text-rose-100',
        dot: 'bg-rose-500 animate-pulse',
        label: 'Incident ativo',
      }
    case 'maintenance':
      return {
        wrap: 'bg-sky-50 ring-sky-200 text-sky-900 dark:bg-sky-950/40 dark:ring-sky-900/60 dark:text-sky-100',
        dot: 'bg-sky-500',
        label: 'Modo manutenção',
      }
  }
}

function Sparkline({ points }: { points: MrrPoint[] }) {
  if (points.length < 2) return null
  const width = 260
  const height = 64
  const padX = 4
  const padY = 6
  const values = points.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const stepX = (width - padX * 2) / (points.length - 1)
  const coords = points.map((p, i) => {
    const x = padX + i * stepX
    const y = height - padY - ((p.value - min) / range) * (height - padY * 2)
    return [x, y] as const
  })
  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${(width - padX).toFixed(1)} ${(height - padY).toFixed(1)} L ${padX.toFixed(1)} ${(height - padY).toFixed(1)} Z`
  const last = coords[coords.length - 1]
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="mrrSparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#mrrSparkFill)" className="text-teal-500 dark:text-teal-400" />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-teal-600 dark:text-teal-400"
      />
      <circle cx={last[0]} cy={last[1]} r="3.25" className="fill-white dark:fill-slate-900" />
      <circle cx={last[0]} cy={last[1]} r="3.25" fill="none" strokeWidth="1.75" stroke="currentColor" className="text-teal-600 dark:text-teal-400" />
    </svg>
  )
}

function KpiTile({ kpi }: { kpi: Kpi }) {
  const Icon = ICON_MAP[kpi.icon] ?? Activity
  const tone = toneClasses(kpi.tone)
  const isPositive = kpi.tone === 'positive'
  const DeltaIcon = isPositive ? TrendingUp : kpi.tone === 'negative' ? TrendingDown : Activity
  return (
    <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700">
      <div className="flex items-start justify-between">
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${tone.iconBg}`}>
          <Icon size={18} />
        </span>
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${tone.deltaText}`}>
          <DeltaIcon size={13} />
          <span className="font-mono tabular-nums">{kpi.delta}</span>
        </span>
      </div>
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{kpi.label}</p>
        <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-50 sm:text-3xl">
          {kpi.value}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{kpi.deltaLabel}</p>
      </div>
    </div>
  )
}

function StatusBanner({
  status,
  onSelect,
}: {
  status: SystemStatus
  onSelect?: (status: SystemStatus) => void
}) {
  const c = systemBannerClasses(status.status)
  return (
    <button
      type="button"
      onClick={() => onSelect?.(status)}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left ring-1 transition hover:brightness-[1.02] ${c.wrap}`}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`absolute inset-0 rounded-full ${c.dot}`} />
        </span>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-sm font-semibold">{c.label}</span>
          <span className="text-xs opacity-80 sm:text-sm">{status.message}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden font-mono text-xs tabular-nums opacity-80 sm:inline">
          {status.servicesUp}/{status.servicesTotal} serviços
        </span>
        <ChevronRight size={16} className="opacity-70" />
      </div>
    </button>
  )
}

function ActionChip({
  item,
  onSelect,
}: {
  item: ActionQueueItem
  onSelect?: (item: ActionQueueItem) => void
}) {
  const Icon = ICON_MAP[item.icon] ?? AlertTriangle
  const isZero = item.count === 0
  const cls = isZero
    ? 'bg-slate-100 text-slate-500 ring-slate-200 hover:bg-slate-200/70 dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800'
    : SEVERITY_CHIP[item.severity]
  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      className={`group inline-flex shrink-0 items-center gap-2.5 rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition ${cls}`}
    >
      <Icon size={15} className={isZero ? '' : 'opacity-90'} />
      <span className="whitespace-nowrap">{item.label}</span>
      <span
        className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-semibold tabular-nums ${
          isZero
            ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            : 'bg-white/70 text-slate-900 dark:bg-slate-950/40 dark:text-white'
        }`}
      >
        {item.count}
      </span>
      <ArrowUpRight
        size={13}
        className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
    </button>
  )
}

function PanelNavCard({
  panel,
  onSelect,
}: {
  panel: PanelCard
  onSelect?: (panel: PanelCard) => void
}) {
  const Icon = ICON_MAP[panel.icon] ?? Activity
  const ring = panel.pending && panel.pendingSeverity ? SEVERITY_RING[panel.pendingSeverity] : 'ring-1 ring-slate-200 dark:ring-slate-800'
  return (
    <button
      type="button"
      onClick={() => onSelect?.(panel)}
      className={`group relative flex flex-col items-start gap-4 rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900/60 ${ring}`}
    >
      {panel.pending && panel.pendingSeverity && (
        <span
          className={`absolute right-4 top-4 h-2 w-2 rounded-full ${SEVERITY_DOT[panel.pendingSeverity]} animate-pulse`}
          aria-hidden
        />
      )}
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-teal-50 group-hover:text-teal-700 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-teal-950/50 dark:group-hover:text-teal-300">
        <Icon size={20} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{panel.label}</p>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">{panel.description}</p>
      </div>
      <div className="mt-auto flex w-full items-end justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{panel.kpiLabel}</p>
          <p className="font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-slate-50">{panel.kpiValue}</p>
        </div>
        <ChevronRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400"
        />
      </div>
    </button>
  )
}

function ActivityRow({
  event,
  onSelect,
}: {
  event: AuditEvent
  onSelect?: (event: AuditEvent) => void
}) {
  const Icon = ICON_MAP[event.icon] ?? Activity
  const sevDot = SEVERITY_DOT[event.severity]
  const isCritical = event.severity === 'critical'
  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className="group relative flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
    >
      <span
        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isCritical
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            : event.severity === 'warning'
            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{event.actorName}</p>
          <span className="shrink-0 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
            {event.timestampRelative}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-slate-600 dark:text-slate-400 line-clamp-2">{event.description}</p>
      </div>
      {isCritical && <span className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${sevDot}`} aria-hidden />}
    </button>
  )
}

function UpcomingEventRow({
  event,
  onSelect,
}: {
  event: UpcomingEvent
  onSelect?: (event: UpcomingEvent) => void
}) {
  const Icon = ICON_MAP[event.icon] ?? Clock
  const isDispute = event.type === 'dispute'
  return (
    <button
      type="button"
      onClick={() => onSelect?.(event)}
      className="group flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
    >
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isDispute
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            : event.type === 'retry'
            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
            : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
        }`}
      >
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{event.label}</p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px]">
          <span className="font-mono font-medium tabular-nums text-slate-700 dark:text-slate-300">{event.valueLabel}</span>
          <span className="text-slate-400 dark:text-slate-500">·</span>
          <span className={isDispute ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}>
            {event.deadlineRelative}
          </span>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
    </button>
  )
}

function TimeframePicker({
  header,
  onChange,
}: {
  header: DashboardHeader
  onChange?: (t: Timeframe) => void
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 ring-1 ring-slate-200 dark:bg-slate-800/80 dark:ring-slate-700">
      {header.timeframeOptions.map((opt) => {
        const active = opt.id === header.timeframe
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange?.(opt.id)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              active
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-50'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export function AdminDashboard({
  header,
  systemStatus,
  kpis,
  actionQueue,
  panels,
  recentActivity,
  mrrSeries,
  upcomingEvents,
  onTimeframeChange,
  onActionQueueSelect,
  onPanelSelect,
  onViewAllActivity,
  onActivitySelect,
  onUpcomingEventSelect,
  onSystemStatusSelect,
}: AdminDashboardProps) {
  const totalUrgent = actionQueue.reduce((sum, item) => sum + item.count, 0)
  const lastMrr = mrrSeries[mrrSeries.length - 1]
  const firstMrr = mrrSeries[0]
  const mrrDelta = lastMrr && firstMrr ? ((lastMrr.value - firstMrr.value) / firstMrr.value) * 100 : 0
  const mrrFormatted = lastMrr ? `R$ ${(lastMrr.value / 1000).toFixed(1)}k` : '—'

  return (
    <div
      data-nymos-admin-dashboard
      className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
                {header.title}
              </p>
              <span className="inline-flex items-center rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900/60">
                {header.roleLabel}
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {header.greeting}
            </h1>
            <p className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
              {header.lastUpdatedLabel}
            </p>
          </div>
          <TimeframePicker header={header} onChange={onTimeframeChange} />
        </header>

        {/* Status banner */}
        <div className="mt-6">
          <StatusBanner status={systemStatus} onSelect={onSystemStatusSelect} />
        </div>

        {/* KPIs */}
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiTile key={kpi.id} kpi={kpi} />
          ))}
        </section>

        {/* Action queue */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ações urgentes
            </h2>
            <span className="font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
              {totalUrgent} {totalUrgent === 1 ? 'item' : 'itens'}
            </span>
          </div>
          {actionQueue.length === 0 ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/60">
              Nenhuma ação urgente · operação saudável
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
              {actionQueue.map((item) => (
                <ActionChip key={item.id} item={item} onSelect={onActionQueueSelect} />
              ))}
            </div>
          )}
        </section>

        {/* Main grid: panels + sidebar */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Panels grid */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Painéis admin
              </h2>
              <span className="font-mono text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                {panels.length} módulos
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {panels.map((panel) => (
                <PanelNavCard key={panel.id} panel={panel} onSelect={onPanelSelect} />
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Recent activity */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Atividade recente
                </h3>
                <button
                  type="button"
                  onClick={() => onViewAllActivity?.()}
                  className="text-[11px] font-medium text-teal-700 transition hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Ver tudo
                </button>
              </div>
              {recentActivity.length === 0 ? (
                <p className="px-2 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  Nenhuma ação administrativa no período
                </p>
              ) : (
                <div className="-mx-1 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {recentActivity.map((event) => (
                    <ActivityRow key={event.id} event={event} onSelect={onActivitySelect} />
                  ))}
                </div>
              )}
            </div>

            {/* MRR sparkline */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Evolução MRR
                </h3>
                <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">12m</span>
              </div>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                    {mrrFormatted}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={11} className="mr-0.5 inline-block" />
                    <span className="font-mono tabular-nums">+{mrrDelta.toFixed(0)}%</span>
                    <span className="ml-1 font-sans text-slate-500 dark:text-slate-400">vs 12m atrás</span>
                  </p>
                </div>
              </div>
              <div className="mt-3 text-teal-600 dark:text-teal-400">
                <Sparkline points={mrrSeries} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] tabular-nums text-slate-400 dark:text-slate-500">
                <span>{mrrSeries[0]?.month}</span>
                <span>{mrrSeries[mrrSeries.length - 1]?.month}</span>
              </div>
            </div>

            {/* Upcoming events */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Próximos eventos
              </h3>
              {upcomingEvents.length === 0 ? (
                <p className="px-2 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  Sem eventos nos próximos 7 dias
                </p>
              ) : (
                <div className="-mx-1 divide-y divide-slate-100 dark:divide-slate-800/60">
                  {upcomingEvents.map((event) => (
                    <UpcomingEventRow key={event.id} event={event} onSelect={onUpcomingEventSelect} />
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
