import { useMemo, useState } from 'react'
import {
  Check,
  Clock,
  CreditCard,
  Eye,
  Heart,
  Lock,
  Shield,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import type {
  AdminPermissoesProps,
  KpiTile,
  PermissionState,
  Role,
} from '@/../product/sections/admin-permissoes/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  shield: Shield,
  clock: Clock,
  users: Users,
  heart: Heart,
  sparkles: Sparkles,
  'credit-card': CreditCard,
  lock: Lock,
}

const ROLE_COLOR: Record<Role, string> = {
  patient: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900',
  professional: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900',
  admin: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  'super-admin': 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900',
  enterprise: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900',
}

function KpiCard({ kpi }: { kpi: KpiTile }) {
  const Icon = ICON_MAP[kpi.icon] ?? Shield
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {kpi.label}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
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

function CellIcon({ state, pending }: { state: PermissionState; pending?: boolean }) {
  if (pending) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-800">
        ●
      </span>
    )
  }
  if (state === 'granted') {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
        <Check size={12} />
      </span>
    )
  }
  if (state === 'denied') {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:ring-slate-800">
        <X size={11} />
      </span>
    )
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center text-slate-300 dark:text-slate-600">
      —
    </span>
  )
}

export function AdminPermissoes({
  header,
  kpis,
  modules,
  roles,
  matrix,
  recentChanges,
  onToggleCell,
  onSimulateRole,
  onSaveChanges,
  onDiscardChanges,
}: AdminPermissoesProps) {
  const [pending, setPending] = useState<Map<string, PermissionState>>(new Map())
  const [simulateOpen, setSimulateOpen] = useState(false)

  const cellMap = useMemo(() => {
    const map = new Map<string, PermissionState>()
    for (const c of matrix) map.set(`${c.roleId}::${c.permissionId}`, c.state)
    return map
  }, [matrix])

  const getCell = (roleId: Role, permId: string): { state: PermissionState; pending: boolean } => {
    const key = `${roleId}::${permId}`
    if (pending.has(key)) return { state: pending.get(key)!, pending: true }
    return { state: cellMap.get(key) ?? 'na', pending: false }
  }

  const handleToggle = (roleId: Role, permId: string) => {
    const current = getCell(roleId, permId).state
    if (current === 'na') return
    const next: PermissionState = current === 'granted' ? 'denied' : 'granted'
    setPending((prev) => {
      const m = new Map(prev)
      const key = `${roleId}::${permId}`
      if (cellMap.get(key) === next) m.delete(key)
      else m.set(key, next)
      return m
    })
    onToggleCell?.(roleId, permId)
  }

  return (
    <div
      data-nymos-admin-permissoes
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-24">
        {/* Header */}
        <header style={{ animationDelay: '0ms' }} className="nymos-reveal opacity-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Admin · Nymos
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {header.title}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{header.subtitle}</p>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSimulateOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800 dark:hover:bg-slate-800"
              >
                <Eye size={14} />
                {header.simulateLabel}
              </button>
              {simulateOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSimulateOpen(false)} />
                  <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          onSimulateRole?.(r.id)
                          setSimulateOpen(false)
                        }}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <span>{r.label}</span>
                        <span className="font-mono tabular-nums text-[10px] text-slate-400 dark:text-slate-500">
                          {r.userCount.toLocaleString('pt-BR')}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* KPIs */}
        <section
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {kpis.map((k) => (
            <KpiCard key={k.id} kpi={k} />
          ))}
        </section>

        {/* Matrix — full width so every module/permission column is visible */}
        <div className="mt-6 space-y-6">
          <section
            style={{ animationDelay: '240ms' }}
            className="nymos-reveal opacity-0 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      Role
                    </th>
                    {modules.map((mod) => {
                      const ModIcon = ICON_MAP[mod.icon] ?? Shield
                      return (
                        <th
                          key={mod.id}
                          colSpan={mod.permissions.length}
                          className="border-l border-slate-100 px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <ModIcon size={12} />
                            {mod.label}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="sticky left-0 z-10 bg-white px-4 py-2 dark:bg-slate-900" />
                    {modules.flatMap((mod) =>
                      mod.permissions.map((p, i) => (
                        <th
                          key={p.id}
                          className={`px-2 py-2 text-left text-[10px] font-normal text-slate-500 dark:text-slate-400 ${
                            i === 0 ? 'border-l border-slate-100 dark:border-slate-800' : ''
                          }`}
                          title={p.description}
                        >
                          <div className="w-20 truncate">{p.label}</div>
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr
                      key={role.id}
                      className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/60"
                    >
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 dark:bg-slate-900">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${ROLE_COLOR[role.id]}`}
                          >
                            {role.label}
                          </span>
                          <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                            {role.userCount.toLocaleString('pt-BR')} users
                          </span>
                        </div>
                      </td>
                      {modules.flatMap((mod) =>
                        mod.permissions.map((p, i) => {
                          const { state, pending: isPending } = getCell(role.id, p.id)
                          const clickable = state !== 'na'
                          return (
                            <td
                              key={p.id}
                              className={`px-2 py-3 text-center ${
                                i === 0 ? 'border-l border-slate-100 dark:border-slate-800' : ''
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleToggle(role.id, p.id)}
                                disabled={!clickable}
                                className={`inline-flex ${clickable ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
                                title={`${role.label} · ${p.label}`}
                              >
                                <CellIcon state={state} pending={isPending} />
                              </button>
                            </td>
                          )
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside
            style={{ animationDelay: '320ms' }}
            className="nymos-reveal opacity-0"
          >
            <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mudanças recentes
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {recentChanges.map((c) => (
                  <div key={c.id} className="flex items-start gap-2">
                    <img
                      src={c.actorAvatarUrl}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
                    />
                    <div className="min-w-0 flex-1 text-xs leading-snug">
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {c.actorName}
                      </span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">{c.actionLabel}</span>{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {c.permissionLabel}
                      </span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">pra {c.roleLabel}</span>
                      <div className="mt-0.5 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                        {c.timeAgoLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Pending changes bar */}
      {pending.size > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-amber-500 px-4 py-2.5 text-white shadow-2xl ring-1 ring-amber-600">
            <span className="text-xs font-medium">
              <span className="font-mono tabular-nums">{pending.size}</span> alteraç{pending.size === 1 ? 'ão' : 'ões'} pendente{pending.size === 1 ? '' : 's'}
            </span>
            <div className="h-4 w-px bg-amber-300" />
            <button
              type="button"
              onClick={() => {
                setPending(new Map())
                onDiscardChanges?.()
              }}
              className="text-xs font-medium text-amber-100 hover:text-white"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={() => {
                setPending(new Map())
                onSaveChanges?.()
              }}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      )}
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
