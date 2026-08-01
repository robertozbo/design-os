import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  FileText,
  Footprints,
  Heart,
  Link2,
  Link2Off,
  Pause,
  Search,
  Sparkles,
  Unlink,
  Utensils,
  Zap,
} from 'lucide-react'
import type {
  AdminVinculosProps,
  KpiTile,
  VinculoAlert,
  VinculoRow,
  VinculoStatus,
} from '@/../product/sections/admin-vinculos/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  link: Link2,
  pause: Pause,
  unlink: Unlink,
  activity: Activity,
  sparkles: Sparkles,
  'file-text': FileText,
  utensils: Utensils,
  heart: Heart,
  book: BookOpen,
  run: Footprints,
}

const STATUS_LABEL: Record<VinculoStatus, string> = { active: 'Ativo', paused: 'Pausado', canceled: 'Cancelado' }
const STATUS_COLOR: Record<VinculoStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900',
  paused: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  canceled: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

const SEV_STYLE: Record<VinculoAlert['severity'], { bg: string; icon: typeof AlertTriangle; color: string }> = {
  info: { bg: 'bg-sky-50 ring-sky-200 dark:bg-sky-950/30 dark:ring-sky-900/50', icon: Zap, color: 'text-sky-600 dark:text-sky-400' },
  warning: { bg: 'bg-amber-50 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900/50', icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400' },
  critical: { bg: 'bg-rose-50 ring-rose-200 dark:bg-rose-950/30 dark:ring-rose-900/50', icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400' },
}

function KpiCard({ kpi }: { kpi: KpiTile }) {
  const Icon = ICON_MAP[kpi.icon] ?? Link2
  const tone =
    kpi.tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
      : kpi.tone === 'warning'
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

function VinculoItem({ row, onClick, onForceUnlink }: { row: VinculoRow; onClick?: () => void; onForceUnlink?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
        row.status === 'canceled' ? 'opacity-60' : ''
      }`}
    >
      {/* Paciente */}
      <div className="flex min-w-0 items-center gap-2 flex-1">
        <img src={row.patient.avatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900" />
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-slate-900 dark:text-slate-50">{row.patient.name}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Paciente</div>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight size={14} className="shrink-0 text-slate-400" />

      {/* Profissional */}
      <div className="flex min-w-0 items-center gap-2 flex-1">
        <img src={row.professional.avatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900" />
        <div className="min-w-0">
          <div className="truncate text-xs font-medium text-slate-900 dark:text-slate-50">{row.professional.name}</div>
          <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">{row.professional.specialty}</div>
        </div>
      </div>

      {/* Consents */}
      <div className="hidden lg:flex lg:items-center lg:gap-1 lg:shrink-0">
        {row.consents.map((c) => {
          const CIcon = ICON_MAP[c.icon] ?? Sparkles
          return (
            <span
              key={c.id}
              title={c.label}
              className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              <CIcon size={11} />
            </span>
          )
        })}
      </div>

      {/* Status + date */}
      <div className="hidden shrink-0 sm:block sm:text-right">
        <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${STATUS_COLOR[row.status]}`}>
          {STATUS_LABEL[row.status]}
        </span>
        <div className="mt-1 font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
          {row.status === 'paused' && row.endsAtLabel ? row.endsAtLabel : `Desde ${row.startedAtLabel}`}
        </div>
        {row.adminRevoked && (
          <div className="mt-0.5 text-[10px] text-rose-600 dark:text-rose-400">⚠ revogado pelo admin</div>
        )}
      </div>

      {/* Force unlink action */}
      {row.status === 'active' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onForceUnlink?.()
          }}
          className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          title="Desvincular forçadamente"
        >
          <Link2Off size={14} />
        </button>
      )}
    </button>
  )
}

function AlertItem({ alert, onAction }: { alert: VinculoAlert; onAction?: () => void }) {
  const sev = SEV_STYLE[alert.severity]
  const SIcon = sev.icon
  return (
    <article className={`rounded-xl p-3 ring-1 ${sev.bg}`}>
      <div className="flex items-start gap-2">
        <SIcon size={14} className={`mt-0.5 shrink-0 ${sev.color}`} />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold leading-snug text-slate-900 dark:text-slate-50">{alert.title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{alert.description}</p>
          <button
            type="button"
            onClick={onAction}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            {alert.ctaLabel} <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </article>
  )
}

export function AdminVinculos({ header, kpis, vinculos, alerts, onSearch, onVinculoClick, onForceUnlink, onAlertAction }: AdminVinculosProps) {
  const [q, setQ] = useState('')
  return (
    <div data-nymos-admin-vinculos className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <RevealStyles />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Admin · Nymos</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{header.title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
            </div>
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder={header.searchPlaceholder}
                value={q}
                onChange={(e) => { setQ(e.target.value); onSearch?.(e.target.value) }}
                className="w-full rounded-lg bg-white px-9 py-2 text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800 dark:focus:ring-slate-100 lg:w-80"
              />
            </div>
          </div>
        </header>

        <section style={{ animationDelay: '120ms' }} className="nymos-reveal opacity-0 mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section style={{ animationDelay: '240ms' }} className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <header className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{vinculos.length} vínculos</span>
            </header>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {vinculos.map((v) => (
                <VinculoItem key={v.id} row={v} onClick={() => onVinculoClick?.(v.id)} onForceUnlink={() => onForceUnlink?.(v.id)} />
              ))}
            </div>
          </section>

          <aside style={{ animationDelay: '320ms' }} className="nymos-reveal opacity-0 lg:sticky lg:top-6 lg:self-start space-y-2">
            <h3 className="px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Alertas</h3>
            {alerts.map((a) => <AlertItem key={a.id} alert={a} onAction={() => onAlertAction?.(a.id)} />)}
          </aside>
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return <style>{`@keyframes nymos-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .nymos-reveal { animation: nymos-reveal 380ms ease-out forwards; }`}</style>
}
