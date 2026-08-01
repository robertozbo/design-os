import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  KeyRound,
  Link2Off,
  Pause,
  ShieldCheck,
  UserCog,
} from 'lucide-react'
import type {
  AdminAuditoriaProps,
  AuditEvent,
  EventSeverity,
  EventType,
  KpiTile,
} from '@/../product/sections/admin-auditoria/types'

const KPI_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  download: Download,
}

const EVENT_ICON: Record<EventType, React.ComponentType<{ size?: number; className?: string }>> = {
  'user.suspend': Pause,
  'user.ban': Ban,
  'user.reactivate': CheckCircle2,
  'user.role-change': UserCog,
  'user.impersonate': Eye,
  'user.reset-password': KeyRound,
  'permission.grant': ShieldCheck,
  'permission.revoke': Ban,
  'payment.refund': CreditCard,
  'payment.cancel-sub': Ban,
  'professional.verify': CheckCircle2,
  'professional.flag': AlertTriangle,
  'vinculo.force-unlink': Link2Off,
}

const SEV_STYLE: Record<EventSeverity, { ring: string; iconBg: string; label: string }> = {
  info: { ring: 'ring-slate-200 dark:ring-slate-800', iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', label: 'Info' },
  warning: { ring: 'ring-amber-200 dark:ring-amber-900/50', iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400', label: 'Atenção' },
  critical: { ring: 'ring-rose-300 dark:ring-rose-900/70', iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400', label: 'Crítico' },
}

function KpiCard({ kpi }: { kpi: KpiTile }) {
  const Icon = KPI_ICON[kpi.icon] ?? Activity
  const tone =
    kpi.tone === 'warning'
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
      : kpi.tone === 'critical'
      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
      : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60'
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{kpi.label}</span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}><Icon size={14} /></span>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{kpi.value}</div>
      {kpi.secondary && <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{kpi.secondary}</div>}
    </div>
  )
}

function EventCard({ event, onClick }: { event: AuditEvent; onClick?: () => void }) {
  const Icon = EVENT_ICON[event.type] ?? Activity
  const sev = SEV_STYLE[event.severity]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group block w-full rounded-xl bg-white p-4 text-left ring-1 transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/50 ${sev.ring}`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sev.iconBg}`}>
          <Icon size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <img src={event.actor.avatarUrl} alt="" className="h-5 w-5 shrink-0 rounded-full" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{event.actor.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">·</span>
            <span className="truncate text-xs text-slate-900 dark:text-slate-50">{event.description}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">·</span>
            <span className="truncate text-xs font-medium text-slate-900 dark:text-slate-50">{event.target.name}</span>
            {event.severity === 'critical' && (
              <span className="ml-auto rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {sev.label}
              </span>
            )}
          </div>
          {event.diffSummary && (
            <div className="mt-1 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {event.diffSummary}
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
            <span>{event.timestampLabel}</span>
            {event.ipMasked && (
              <>
                <span>·</span>
                <span>IP {event.ipMasked}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

export function AdminAuditoria({
  header,
  kpis,
  typeOptions,
  severityOptions,
  dateRangeLabel,
  selectedType,
  selectedSeverity,
  events,
  onTypeFilter,
  onSeverityFilter,
  onEventClick,
  onExport,
}: AdminAuditoriaProps) {
  return (
    <div data-nymos-admin-auditoria className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <RevealStyles />
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Admin · Nymos</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{header.title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Download size={14} />
              {header.exportLabel}
            </button>
          </div>
        </header>

        <section style={{ animationDelay: '120ms' }} className="nymos-reveal opacity-0 mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
        </section>

        <section style={{ animationDelay: '200ms' }} className="nymos-reveal opacity-0 mt-6 flex flex-wrap items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => onTypeFilter?.(e.target.value)}
            className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
          >
            {typeOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => onSeverityFilter?.(e.target.value)}
            className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
          >
            {severityOptions.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
          </select>
          <span className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
            {dateRangeLabel}
          </span>
          <span className="ml-auto font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
            {events.length} evento{events.length === 1 ? '' : 's'}
          </span>
        </section>

        <section style={{ animationDelay: '280ms' }} className="nymos-reveal opacity-0 mt-4 space-y-2">
          {events.map((e) => <EventCard key={e.id} event={e} onClick={() => onEventClick?.(e.id)} />)}
        </section>
      </div>
    </div>
  )
}

function RevealStyles() {
  return <style>{`@keyframes nymos-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .nymos-reveal { animation: nymos-reveal 380ms ease-out forwards; }`}</style>
}
