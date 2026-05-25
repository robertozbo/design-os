import type { WorkerHealth } from '@/../product/sections/eventos-esocial/types'
import { Activity, Gauge, Zap, Pause, Play, AlertTriangle } from 'lucide-react'

interface Props {
  worker: WorkerHealth
  onPausar?: () => void
  onRetomar?: () => void
}

export function WorkerHealthCard({ worker, onPausar, onRetomar }: Props) {
  const isHealthy = worker.status === 'saudavel'
  const isStopped = worker.status === 'parado'
  const isDegraded = worker.status === 'degradado'

  const statusColor = isStopped
    ? 'rose'
    : isDegraded
      ? 'amber'
      : 'emerald'

  const statusLabel = isStopped ? 'Parado' : isDegraded ? 'Degradado' : 'Saudável'

  return (
    <section
      style={{ animationDelay: '120ms' }}
      className="nymos-reveal opacity-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950"
    >
      <div className="px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Status do worker */}
        <div className="flex items-center gap-3 lg:pr-4 lg:border-r border-slate-200 dark:border-slate-800 shrink-0">
          <span
            className={`relative inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-${statusColor}-100 dark:bg-${statusColor}-950/50 text-${statusColor}-700 dark:text-${statusColor}-300`}
          >
            {!isStopped && (
              <span
                className={`absolute inset-0 rounded-2xl bg-${statusColor}-400/40 dark:bg-${statusColor}-500/30 animate-ping`}
                aria-hidden="true"
                style={{ animationDuration: '2s' }}
              />
            )}
            <Activity className="relative w-5 h-5" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Worker eSocial
            </p>
            <p
              className={`text-base font-semibold ${
                isStopped
                  ? 'text-rose-700 dark:text-rose-300'
                  : isDegraded
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {statusLabel}
            </p>
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
              ♥ {formatRelativeShort(worker.ultimoHeartbeatEm)}
            </p>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <Metric
            icon={<Zap className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Concorrência"
            value={`${worker.jobsConcorrentes}/${worker.capacidadeConcorrente}`}
          />
          <Metric
            icon={<Gauge className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Throughput"
            value={`${worker.throughputPorMin}`}
            suffix="evt/min"
          />
          <Metric
            label="Latência média"
            value={`${(worker.latenciaMediaMs / 1000).toFixed(1)}`}
            suffix="s"
          />
          <Metric
            label="Sucesso 24h"
            value={`${worker.taxaSucesso24h.toFixed(1)}`}
            suffix="%"
            tone={worker.taxaSucesso24h >= 95 ? 'success' : worker.taxaSucesso24h >= 85 ? 'warning' : 'danger'}
          />
        </div>

        {/* Ações */}
        <div className="shrink-0 flex items-center gap-2">
          {isStopped ? (
            <button
              type="button"
              onClick={onRetomar}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white transition"
            >
              <Play className="w-3.5 h-3.5" strokeWidth={2.25} />
              Retomar
            </button>
          ) : (
            <button
              type="button"
              onClick={onPausar}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
            >
              <Pause className="w-3.5 h-3.5" strokeWidth={1.75} />
              Pausar
            </button>
          )}
        </div>
      </div>

      {/* Alertas do worker */}
      {worker.alertas.length > 0 && (
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20">
          {worker.alertas.map((alerta, idx) => (
            <p
              key={idx}
              className="text-[11px] text-amber-800 dark:text-amber-300 inline-flex items-start gap-1.5"
            >
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" strokeWidth={2} />
              {alerta}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

function Metric({
  icon,
  label,
  value,
  suffix,
  tone = 'default',
}: {
  icon?: React.ReactNode
  label: string
  value: string
  suffix?: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const toneClass =
    tone === 'success'
      ? 'text-emerald-700 dark:text-emerald-300'
      : tone === 'warning'
        ? 'text-amber-700 dark:text-amber-300'
        : tone === 'danger'
          ? 'text-rose-700 dark:text-rose-300'
          : 'text-slate-900 dark:text-slate-100'

  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className={`mt-0.5 text-lg font-semibold tabular-nums ${toneClass}`}>
        {value}
        {suffix && (
          <span className="ml-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {suffix}
          </span>
        )}
      </p>
    </div>
  )
}

function formatRelativeShort(iso: string): string {
  try {
    const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
    if (diffSec < 5) return 'agora'
    if (diffSec < 60) return `${diffSec}s atrás`
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}min atrás`
    return 'há +1h'
  } catch {
    return '—'
  }
}
