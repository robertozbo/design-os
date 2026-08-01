import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
  TrendingUp,
} from 'lucide-react'
import type {
  AdminProfissionaisProps,
  KpiTile,
  ProRow,
  ProStatus,
  ProTier,
} from '@/../product/sections/admin-profissionais/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'shield-check': ShieldCheck,
  clock: Clock,
  'alert-triangle': AlertTriangle,
}

const TIER_LABEL: Record<ProTier, string> = { free: 'Free', plus: 'Plus', pro: 'Pro', clinica: 'Clínica' }
const TIER_COLOR: Record<ProTier, string> = {
  free: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
  plus: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900',
  pro: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900',
  clinica: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
}

const STATUS_LABEL: Record<ProStatus, string> = { active: 'Ativo', pending: 'Pendente', flagged: 'Sinalizado', suspended: 'Suspenso' }
const STATUS_DOT: Record<ProStatus, string> = {
  active: 'bg-emerald-500',
  pending: 'bg-sky-500',
  flagged: 'bg-rose-500',
  suspended: 'bg-amber-500',
}

function formatBRL(n: number) {
  return n === 0 ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function KpiCard({ kpi }: { kpi: KpiTile }) {
  const Icon = ICON_MAP[kpi.icon] ?? ShieldCheck
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
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {kpi.label}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}>
          <Icon size={14} />
        </span>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {kpi.value}
      </div>
      {kpi.secondary && <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{kpi.secondary}</div>}
    </div>
  )
}

function ProItem({
  pro,
  onClick,
  onAction,
}: {
  pro: ProRow
  onClick?: () => void
  onAction?: (a: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nearLimit = pro.occupancyPct >= 90 && pro.patientsLimit
  const limit = pro.patientsLimit ? `${pro.activePatients}/${pro.patientsLimit}` : `${pro.activePatients}/∞`

  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
        pro.status === 'suspended' ? 'opacity-60' : ''
      }`}
    >
      <button type="button" onClick={onClick} className="flex flex-1 items-center gap-3 text-left min-w-0">
        <img src={pro.avatarUrl} alt="" className="h-9 w-9 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">{pro.name}</span>
            {pro.verified && <CheckCircle2 size={11} className="text-sky-600 dark:text-sky-400" />}
            {pro.status === 'flagged' && <AlertTriangle size={11} className="text-rose-600 dark:text-rose-400" />}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {pro.registry} · {pro.specialty}
            {pro.flagReason && (
              <span className="ml-1 text-rose-600 dark:text-rose-400">· {pro.flagReason}</span>
            )}
          </div>
        </div>
        <div className="hidden md:flex md:items-center md:gap-4 md:shrink-0">
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${TIER_COLOR[pro.tier]}`}>
            {TIER_LABEL[pro.tier]}
          </span>
          <div className="flex flex-col text-right">
            <span className="font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">{limit}</span>
            {nearLimit && (
              <span className="text-[9px] font-medium text-amber-600 dark:text-amber-400">próximo do limite</span>
            )}
          </div>
          <span className="min-w-[60px] text-right font-mono text-xs tabular-nums text-slate-700 dark:text-slate-300">
            {formatBRL(pro.mrrBrl)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[pro.status]}`} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{STATUS_LABEL[pro.status]}</span>
          </span>
        </div>
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              {pro.status === 'pending' && (
                <>
                  <MenuItem icon={<CheckCircle2 size={13} />} label="Aprovar registro" onClick={() => { onAction?.('approve'); setMenuOpen(false) }} />
                  <MenuItem icon={<ShieldOff size={13} />} label="Rejeitar" destructive onClick={() => { onAction?.('reject'); setMenuOpen(false) }} />
                </>
              )}
              {pro.status === 'active' && (
                <>
                  <MenuItem icon={<TrendingUp size={13} />} label="Promover tier" onClick={() => { onAction?.('promote'); setMenuOpen(false) }} />
                  <MenuItem icon={pro.verified ? <ShieldOff size={13} /> : <CheckCircle2 size={13} />} label={pro.verified ? 'Revogar selo' : 'Verificar'} onClick={() => { onAction?.('toggle-verified'); setMenuOpen(false) }} />
                  <MenuItem icon={<ShieldOff size={13} />} label="Suspender" destructive onClick={() => { onAction?.('suspend'); setMenuOpen(false) }} />
                </>
              )}
              {pro.status === 'flagged' && (
                <>
                  <MenuItem icon={<CheckCircle2 size={13} />} label="Marcar como resolvido" onClick={() => { onAction?.('resolve'); setMenuOpen(false) }} />
                  <MenuItem icon={<ShieldOff size={13} />} label="Suspender" destructive onClick={() => { onAction?.('suspend'); setMenuOpen(false) }} />
                </>
              )}
              {pro.status === 'suspended' && (
                <MenuItem icon={<CheckCircle2 size={13} />} label="Reativar" onClick={() => { onAction?.('reactivate'); setMenuOpen(false) }} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MenuItem({ icon, label, onClick, destructive }: { icon: React.ReactNode; label: string; onClick?: () => void; destructive?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${
        destructive
          ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

export function AdminProfissionais({
  header,
  kpis,
  tabs,
  selectedTab,
  pros,
  urgentPending,
  onTabChange,
  onProClick,
  onProAction,
}: AdminProfissionaisProps) {
  return (
    <div
      data-nymos-admin-profissionais
      className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50"
    >
      <RevealStyles />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Admin · Nymos
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {header.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
        </header>

        <section style={{ animationDelay: '120ms' }} className="nymos-reveal opacity-0 mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
        </section>

        <section style={{ animationDelay: '200ms' }} className="nymos-reveal opacity-0 mt-6 flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange?.(t.id)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                selectedTab === t.id
                  ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
              <span className={`tabular-nums text-[10px] ${selectedTab === t.id ? 'text-slate-300 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
                {t.count.toLocaleString('pt-BR')}
              </span>
            </button>
          ))}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section
            style={{ animationDelay: '280ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
          >
            <header className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {pros.length} profissionais
              </span>
            </header>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {pros.map((p) => (
                <ProItem
                  key={p.id}
                  pro={p}
                  onClick={() => onProClick?.(p.id)}
                  onAction={(a) => onProAction?.(p.id, a)}
                />
              ))}
            </div>
          </section>

          <aside style={{ animationDelay: '360ms' }} className="nymos-reveal opacity-0 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900/50">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Pendentes urgentes
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
                Mais de 24h aguardando aprovação
              </p>
              <div className="mt-3 space-y-2">
                {urgentPending.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => onProClick?.(u.id)}
                    className="group flex w-full items-center gap-2 rounded-lg bg-white p-2 text-left ring-1 ring-amber-200/50 hover:ring-amber-400 dark:bg-slate-900 dark:ring-amber-900/40 dark:hover:ring-amber-700"
                  >
                    <img src={u.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-slate-900 dark:text-slate-100">
                        {u.name}
                      </div>
                      <div className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                        {u.registry} · {u.pendingSinceLabel}
                      </div>
                    </div>
                    <ArrowRight size={12} className="shrink-0 text-amber-600 transition-transform group-hover:translate-x-0.5 dark:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
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
      .nymos-reveal { animation: nymos-reveal 380ms ease-out forwards; }
    `}</style>
  )
}
