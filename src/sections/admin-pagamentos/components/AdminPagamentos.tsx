import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Check,
  CreditCard,
  ExternalLink,
  RotateCcw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import type {
  AdminPagamentosProps,
  AttentionRow,
  KpiTile,
  MrrChart,
  TxRow,
  TxStatus,
} from '@/../product/sections/admin-pagamentos/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  'alert-circle': AlertCircle,
  'rotate-ccw': RotateCcw,
}

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function KpiCard({ kpi }: { kpi: KpiTile }) {
  const Icon = ICON_MAP[kpi.icon] ?? TrendingUp
  const ring =
    kpi.tone === 'positive'
      ? 'ring-emerald-200/70 dark:ring-emerald-900/40'
      : kpi.tone === 'warning'
      ? 'ring-amber-200/70 dark:ring-amber-900/40'
      : kpi.tone === 'critical'
      ? 'ring-rose-200/70 dark:ring-rose-900/40'
      : 'ring-slate-200 dark:ring-slate-800'
  const iconBg =
    kpi.tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
      : kpi.tone === 'warning'
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
      : kpi.tone === 'critical'
      ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
      : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60'
  return (
    <div className={`rounded-2xl bg-white p-4 ring-1 ${ring} dark:bg-slate-900`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{kpi.label}</span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}><Icon size={14} /></span>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">{kpi.value}</div>
      {kpi.secondary && <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{kpi.secondary}</div>}
    </div>
  )
}

function MrrChartCard({ mrr }: { mrr: MrrChart }) {
  const max = Math.max(...mrr.pointsBrl.map((p) => p.valueBrl))
  const min = Math.min(...mrr.pointsBrl.map((p) => p.valueBrl))
  const range = max - min || 1
  const points = mrr.pointsBrl
    .map((p, i) => {
      const x = (i / (mrr.pointsBrl.length - 1)) * 100
      const y = 100 - ((p.valueBrl - min) / range) * 90 - 5
      return `${x},${y}`
    })
    .join(' ')
  const areaPoints = `0,100 ${points} 100,100`

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Evolução do MRR</h2>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Últimos 12 meses</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
            {formatBRL(mrr.currentBrl)}
          </div>
          <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
            ▲ +{mrr.deltaPct}% mês
          </div>
        </div>
      </header>
      <div className="mt-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full">
          <defs>
            <linearGradient id="mrr-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(20, 184, 166)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(20, 184, 166)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#mrr-grad)" />
          <polyline points={points} fill="none" stroke="rgb(20, 184, 166)" strokeWidth="0.6" />
        </svg>
        <div className="mt-2 grid grid-cols-12 text-center text-[9px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
          {mrr.pointsBrl.map((p) => (
            <span key={p.monthLabel} className="truncate">{p.monthLabel.split('/')[0]}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function AttentionItem({ row, onAction }: { row: AttentionRow; onAction?: () => void }) {
  const typeColor =
    row.type === 'dispute'
      ? 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900'
      : row.type === 'retry-failed'
      ? 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900'
      : 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900'
  const typeLabel = { 'past-due': 'Inadimplente', 'card-expired': 'Cartão expira', 'retry-failed': 'Retry falhou', dispute: 'Disputa' }[row.type]
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <img src={row.userAvatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{row.userName}</span>
          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${typeColor}`}>{typeLabel}</span>
        </div>
        <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
          {row.planLabel} · {row.detailLabel}
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <div className="font-mono text-sm tabular-nums text-slate-700 dark:text-slate-200">{formatBRL(row.amountBrl)}</div>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {row.ctaLabel}
      </button>
    </div>
  )
}

function TxStatusBadge({ status }: { status: TxStatus }) {
  if (status === 'succeeded') return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"><Check size={11} />Aprovado</span>
  if (status === 'failed') return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400"><X size={11} />Falhou</span>
  if (status === 'refunded') return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400"><RotateCcw size={11} />Reembolsado</span>
  return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">● Pendente</span>
}

function TxItem({ row, onAction }: { row: TxRow; onAction?: (a: string) => void }) {
  const isRefundable = row.status === 'succeeded'
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <img src={row.userAvatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{row.userName}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="truncate">{row.description}</span>
          <span>·</span>
          <span className="font-mono tabular-nums">{row.timeAgoLabel}</span>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-mono text-sm tabular-nums ${row.status === 'refunded' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
          {formatBRL(row.amountBrl)}
        </div>
        <div className="mt-0.5">
          <TxStatusBadge status={row.status} />
        </div>
      </div>
      {isRefundable && (
        <button
          type="button"
          onClick={() => onAction?.('refund')}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="Reembolsar"
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  )
}

export function AdminPagamentos({ header, kpis, mrr, attention, transactions, upcomingRenewals, disputes, onAttentionAction, onTxAction }: AdminPagamentosProps) {
  return (
    <div data-nymos-admin-pagamentos className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
      <RevealStyles />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Admin · Nymos</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{header.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
        </header>

        <section style={{ animationDelay: '120ms' }} className="nymos-reveal opacity-0 mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            <section style={{ animationDelay: '240ms' }} className="nymos-reveal opacity-0">
              <MrrChartCard mrr={mrr} />
            </section>

            <section style={{ animationDelay: '320ms' }} className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <header className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <ShieldAlert size={14} className="text-rose-600 dark:text-rose-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Em atenção</h2>
                <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">· {attention.length}</span>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {attention.map((r) => <AttentionItem key={r.id} row={r} onAction={() => onAttentionAction?.(r.id)} />)}
              </div>
            </section>

            <section style={{ animationDelay: '400ms' }} className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Transações recentes</h2>
                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                  Stripe Dashboard <ExternalLink size={11} />
                </a>
              </header>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transactions.map((t) => <TxItem key={t.id} row={t} onAction={(a) => onTxAction?.(t.id, a)} />)}
              </div>
            </section>
          </div>

          <aside style={{ animationDelay: '480ms' }} className="nymos-reveal opacity-0 space-y-3 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="flex items-center gap-2">
                <CalendarClock size={14} className="text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Renovações próximas</h3>
              </div>
              <div className="mt-3 space-y-2">
                {upcomingRenewals.map((r) => (
                  <div key={r.id} className="flex items-center gap-2">
                    <img src={r.userAvatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-slate-900 dark:text-slate-100">{r.userName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{r.planLabel} · {r.whenLabel}</div>
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-slate-700 dark:text-slate-300">{formatBRL(r.amountBrl)}</span>
                  </div>
                ))}
              </div>
            </div>

            {disputes.length > 0 && (
              <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:ring-rose-900/50">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-rose-600 dark:text-rose-400" />
                  <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">Disputas Stripe</h3>
                </div>
                <div className="mt-3 space-y-2">
                  {disputes.map((d) => (
                    <div key={d.id} className="rounded-lg bg-white p-2 ring-1 ring-rose-200/50 dark:bg-slate-900 dark:ring-rose-900/40">
                      <div className="flex items-center gap-2">
                        <img src={d.userAvatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full" />
                        <span className="truncate text-xs font-medium text-slate-900 dark:text-slate-100">{d.userName}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="text-rose-600 dark:text-rose-400">{d.reasonLabel}</span>
                        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">{formatBRL(d.amountBrl)}</span>
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-rose-700 dark:text-rose-300">
                        ⚠ Responder em {d.daysLeft} dia{d.daysLeft === 1 ? '' : 's'} <ArrowRight size={10} className="inline" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return <style>{`@keyframes nymos-reveal { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .nymos-reveal { animation: nymos-reveal 380ms ease-out forwards; }`}</style>
}
