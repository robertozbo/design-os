import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Flag,
  Gauge,
  Power,
  Wrench,
} from 'lucide-react'
import type {
  AdminSistemaProps,
  FeatureFlag,
  IaProvider,
  Incident,
  RateLimit,
  ServiceHealth,
  ServiceStatus,
  SystemStatus,
} from '@/../product/sections/admin-sistema/types'

const STATUS_STYLE: Record<
  SystemStatus,
  { dot: string; label: string; bg: string; text: string }
> = {
  healthy: { dot: 'bg-emerald-500', label: 'Tudo ok', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300' },
  degraded: { dot: 'bg-amber-500', label: 'Degraded', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300' },
  incident: { dot: 'bg-rose-500', label: 'Incident', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-300' },
  maintenance: { dot: 'bg-sky-500', label: 'Manutenção', bg: 'bg-sky-50 dark:bg-sky-950/30', text: 'text-sky-700 dark:text-sky-300' },
}

const SERVICE_STATUS_STYLE: Record<ServiceStatus, { color: string; label: string }> = {
  up: { color: 'text-emerald-600 dark:text-emerald-400', label: 'UP' },
  degraded: { color: 'text-amber-600 dark:text-amber-400', label: 'DEGRADED' },
  down: { color: 'text-rose-600 dark:text-rose-400', label: 'DOWN' },
}

function FlagToggle({ flag, onToggle }: { flag: FeatureFlag; onToggle?: () => void }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-slate-900 dark:text-slate-100">{flag.name}</code>
          {flag.critical && <AlertTriangle size={11} className="text-rose-600 dark:text-rose-400" />}
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{flag.description}</p>
        {flag.enabled && flag.rolloutPct < 100 && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full bg-teal-500" style={{ width: `${flag.rolloutPct}%` }} />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
              {flag.rolloutPct}% rollout
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onToggle}
        role="switch"
        aria-checked={flag.enabled}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          flag.enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            flag.enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function RateLimitRow({ rl }: { rl: RateLimit }) {
  const color = rl.usagePct >= 80 ? 'bg-rose-500' : rl.usagePct >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <code className="font-mono text-xs text-slate-900 dark:text-slate-100">{rl.endpoint}</code>
        <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">{rl.limit}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className={`h-full ${color}`} style={{ width: `${rl.usagePct}%` }} />
        </div>
        <span className="font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400 min-w-[36px] text-right">
          {rl.usagePct}%
        </span>
      </div>
      <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">{rl.windowLabel}</div>
    </div>
  )
}

function ProviderRow({ p, onChange }: { p: IaProvider; onChange?: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="group flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
    >
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-slate-900 dark:text-slate-50">{p.featureLabel}</div>
        <div className="mt-0.5 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {p.provider} <span className="text-slate-400 dark:text-slate-500">· fallback {p.fallback}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-[11px] tabular-nums text-slate-700 dark:text-slate-300">
          {p.avgLatencyMs.toLocaleString('pt-BR')} ms
        </div>
        <div className={`text-[10px] font-medium tabular-nums ${p.errorRatePct > 1 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {p.errorRatePct}% err
        </div>
      </div>
      <ChevronRight size={14} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

function ServiceRow({ s }: { s: ServiceHealth }) {
  const style = SERVICE_STATUS_STYLE[s.status]
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className={`inline-block h-2 w-2 rounded-full ${s.status === 'up' ? 'bg-emerald-500' : s.status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'}`} />
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-slate-900 dark:text-slate-50">{s.name}</div>
        <div className="mt-0.5 font-mono text-[10px] tabular-nums text-slate-500 dark:text-slate-400">
          {s.latencyMs > 0 ? `${s.latencyMs}ms` : 'idle'} · {s.uptime24hPct}% uptime 24h
        </div>
      </div>
      <span className={`font-mono text-[10px] font-semibold ${style.color}`}>{style.label}</span>
    </div>
  )
}

function IncidentCard({ inc }: { inc: Incident }) {
  const sev =
    inc.severity === 'critical'
      ? 'bg-rose-50 ring-rose-200 text-rose-900 dark:bg-rose-950/30 dark:ring-rose-900/50 dark:text-rose-200'
      : inc.severity === 'major'
      ? 'bg-amber-50 ring-amber-200 text-amber-900 dark:bg-amber-950/30 dark:ring-amber-900/50 dark:text-amber-200'
      : 'bg-sky-50 ring-sky-200 text-sky-900 dark:bg-sky-950/30 dark:ring-sky-900/50 dark:text-sky-200'
  return (
    <div className={`rounded-xl p-3 ring-1 ${sev}`}>
      <div className="flex items-start gap-2">
        <AlertOctagon size={14} className="mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold leading-snug">{inc.title}</h4>
          <div className="mt-1 font-mono text-[10px] tabular-nums opacity-80">
            Início: {inc.startedAtLabel}
            {inc.resolvedAtLabel ? ` · resolvido: ${inc.resolvedAtLabel}` : ' · ABERTO'}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminSistema({
  header,
  systemStatus,
  flags,
  rateLimits,
  iaProviders,
  services,
  incidents,
  onToggleFlag,
  onChangeProvider,
  onActivateMaintenance,
}: AdminSistemaProps) {
  const ss = STATUS_STYLE[systemStatus]
  return (
    <div data-nymos-admin-sistema className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <RevealStyles />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Admin · Nymos</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{header.title}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ring-current/20 ${ss.bg} ${ss.text}`}>
              <span className={`inline-block h-2 w-2 rounded-full ${ss.dot} animate-pulse`} />
              Sistema · {ss.label}
            </span>
          </div>
        </header>

        {incidents.length > 0 && (
          <section style={{ animationDelay: '100ms' }} className="nymos-reveal opacity-0 mt-6 space-y-2">
            {incidents.map((i) => <IncidentCard key={i.id} inc={i} />)}
          </section>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <section style={{ animationDelay: '200ms' }} className="nymos-reveal opacity-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <header className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Flag size={14} className="text-slate-600 dark:text-slate-300" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Feature flags</h2>
                <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">· {flags.length}</span>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {flags.map((f) => <FlagToggle key={f.id} flag={f} onToggle={() => onToggleFlag?.(f.id)} />)}
              </div>
            </section>

            <section style={{ animationDelay: '280ms' }} className="nymos-reveal opacity-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <header className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Cpu size={14} className="text-slate-600 dark:text-slate-300" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Providers de IA</h2>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {iaProviders.map((p) => <ProviderRow key={p.id} p={p} onChange={() => onChangeProvider?.(p.id)} />)}
              </div>
            </section>

            <section style={{ animationDelay: '360ms' }} className="nymos-reveal opacity-0 rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <header className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Gauge size={14} className="text-slate-600 dark:text-slate-300" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Rate limits</h2>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {rateLimits.map((r) => <RateLimitRow key={r.id} rl={r} />)}
              </div>
            </section>
          </div>

          <aside style={{ animationDelay: '440ms' }} className="nymos-reveal opacity-0 space-y-3 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Health checks</h3>
              </div>
              <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60">
                {services.map((s) => <ServiceRow key={s.id} s={s} />)}
              </div>
            </div>

            <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:ring-rose-900/50">
              <div className="flex items-center gap-2">
                <Wrench size={14} className="text-rose-600 dark:text-rose-400" />
                <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">Modo manutenção</h3>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-rose-700 dark:text-rose-300">
                Bloqueia acesso de todos os usuários e mostra página de manutenção. Use só em deploys críticos.
              </p>
              <button
                type="button"
                onClick={onActivateMaintenance}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
              >
                <Power size={12} />
                Ativar manutenção
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return <style>{`@keyframes nymos-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .nymos-reveal { animation: nymos-reveal 380ms ease-out forwards; }`}</style>
}
