import { useState } from 'react'
import {
  Activity,
  Ban,
  Bell,
  ChevronRight,
  Download,
  KeyRound,
  Mail,
  Moon,
  MoreVertical,
  Pause,
  Search,
  Shield,
  ShieldAlert,
  UserCog,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import type {
  AdminUsuariosProps,
  BulkAction,
  PlanTier,
  RecentAdminActivity,
  RoleDistribution,
  UserRole,
  UserRow,
  UserStat,
  UserStatus,
} from '@/../product/sections/admin-usuarios/types'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  users: Users,
  activity: Activity,
  moon: Moon,
  ban: Ban,
  'user-plus': UserPlus,
  download: Download,
  bell: Bell,
  pause: Pause,
}

const ROLE_LABEL: Record<UserRole, string> = {
  patient: 'Paciente',
  professional: 'Profissional',
  admin: 'Admin',
  'super-admin': 'Super Admin',
  enterprise: 'Empresa',
}

const ROLE_COLOR: Record<UserRole, string> = {
  patient: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900',
  professional: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:ring-violet-900',
  admin: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900',
  'super-admin': 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-900',
  enterprise: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900',
}

const STATUS_LABEL: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
  banned: 'Banido',
  pending: 'Pendente',
}

const STATUS_COLOR: Record<UserStatus, string> = {
  active: 'bg-emerald-500',
  inactive: 'bg-slate-400 dark:bg-slate-600',
  suspended: 'bg-amber-500',
  banned: 'bg-rose-500',
  pending: 'bg-sky-500',
}

const PLAN_COLOR: Record<PlanTier, string> = {
  free: 'text-slate-600 dark:text-slate-400',
  plus: 'text-teal-600 dark:text-teal-400',
  pro: 'text-violet-600 dark:text-violet-400',
  clinica: 'text-amber-600 dark:text-amber-400',
  enterprise: 'text-sky-600 dark:text-sky-400',
  none: 'text-slate-400 dark:text-slate-500',
}

function formatNumberBR(n: number) {
  return new Intl.NumberFormat('pt-BR').format(n)
}

function KpiCard({ kpi }: { kpi: UserStat }) {
  const Icon = ICON_MAP[kpi.icon] ?? Users
  const tone =
    kpi.tone === 'positive'
      ? { ring: 'ring-emerald-200/70 dark:ring-emerald-900/40', iconBg: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' }
      : kpi.tone === 'warning'
      ? { ring: 'ring-amber-200/70 dark:ring-amber-900/40', iconBg: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' }
      : kpi.tone === 'critical'
      ? { ring: 'ring-rose-200/70 dark:ring-rose-900/40', iconBg: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40' }
      : { ring: 'ring-slate-200 dark:ring-slate-800', iconBg: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60' }

  return (
    <div className={`relative rounded-2xl bg-white p-4 ring-1 ${tone.ring} dark:bg-slate-900`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {kpi.label}
        </span>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${tone.iconBg}`}>
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

function RoleChip({
  chip,
  selected,
  onClick,
}: {
  chip: { id: 'all' | UserRole; label: string; count: number }
  selected: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        selected
          ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
          : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'
      }`}
    >
      {chip.label}
      <span className={`tabular-nums text-[10px] ${selected ? 'text-slate-300 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
        {formatNumberBR(chip.count)}
      </span>
    </button>
  )
}

function StatusDot({ status }: { status: UserStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 rounded-full ${STATUS_COLOR[status]}`} />
      <span className="text-xs text-slate-700 dark:text-slate-300">{STATUS_LABEL[status]}</span>
    </span>
  )
}

function UserRowItem({
  user,
  selected,
  onSelect,
  onClick,
  onAction,
}: {
  user: UserRow
  selected: boolean
  onSelect: () => void
  onClick?: () => void
  onAction?: (action: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isSuspended = user.status === 'suspended' || user.status === 'banned'

  return (
    <div
      className={`group relative flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
        isSuspended ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 shrink-0 cursor-pointer accent-slate-900 dark:accent-slate-50"
      />
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-3 text-left min-w-0"
      >
        <img
          src={user.avatarUrl}
          alt=""
          className={`h-9 w-9 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900 ${
            isSuspended ? 'opacity-60 grayscale' : ''
          }`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`truncate text-sm font-medium text-slate-900 dark:text-slate-50 ${
                isSuspended ? 'line-through opacity-60' : ''
              }`}
            >
              {user.name}
            </span>
            {user.flags?.includes('mfa-on') && (
              <Shield size={11} className="text-emerald-600 dark:text-emerald-400" />
            )}
            {user.flags?.includes('verified') && (
              <span className="rounded bg-sky-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                ✓
              </span>
            )}
            {user.flags?.includes('high-usage') && (
              <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                ▲ uso
              </span>
            )}
            {user.flags?.includes('abuse-flag') && (
              <ShieldAlert size={11} className="text-rose-600 dark:text-rose-400" />
            )}
          </div>
          <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {user.emailMasked} · {user.vinculosLabel}
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-4 md:shrink-0">
          <span
            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ${ROLE_COLOR[user.role]}`}
          >
            {ROLE_LABEL[user.role]}
          </span>
          <span className={`min-w-[60px] text-xs font-medium ${PLAN_COLOR[user.plan]}`}>
            {user.planLabel}
          </span>
          <span className="min-w-[80px]">
            <StatusDot status={user.status} />
          </span>
          <span className="min-w-[80px] font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
            {user.lastAccessLabel}
          </span>
        </div>
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((o) => !o)
          }}
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Ações"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <RowMenuItem
                icon={<UserCog size={13} />}
                label="Ver perfil completo"
                onClick={() => {
                  onAction?.('view-profile')
                  setMenuOpen(false)
                }}
              />
              <RowMenuItem
                icon={<Shield size={13} />}
                label="Editar role"
                onClick={() => {
                  onAction?.('edit-role')
                  setMenuOpen(false)
                }}
              />
              <RowMenuItem
                icon={<KeyRound size={13} />}
                label="Forçar reset de senha"
                onClick={() => {
                  onAction?.('reset-password')
                  setMenuOpen(false)
                }}
              />
              <RowMenuItem
                icon={<Mail size={13} />}
                label="Enviar email"
                onClick={() => {
                  onAction?.('send-email')
                  setMenuOpen(false)
                }}
              />
              <div className="my-0.5 h-px bg-slate-100 dark:bg-slate-800" />
              {user.status !== 'suspended' && user.status !== 'banned' ? (
                <>
                  <RowMenuItem
                    icon={<Pause size={13} />}
                    label="Suspender"
                    destructive
                    onClick={() => {
                      onAction?.('suspend')
                      setMenuOpen(false)
                    }}
                  />
                  <RowMenuItem
                    icon={<Ban size={13} />}
                    label="Banir"
                    destructive
                    onClick={() => {
                      onAction?.('ban')
                      setMenuOpen(false)
                    }}
                  />
                </>
              ) : (
                <RowMenuItem
                  icon={<Activity size={13} />}
                  label="Reativar conta"
                  onClick={() => {
                    onAction?.('reactivate')
                    setMenuOpen(false)
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RowMenuItem({
  icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  destructive?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
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

function RoleDistributionCard({ items }: { items: RoleDistribution[] }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Distribuição por role
      </h3>
      <div className="mt-3 space-y-2.5">
        {items.map((item) => (
          <div key={item.role}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
              <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {formatNumberBR(item.count)} · {item.percent}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full ${
                  item.role === 'patient'
                    ? 'bg-teal-500'
                    : item.role === 'professional'
                    ? 'bg-violet-500'
                    : item.role === 'enterprise'
                    ? 'bg-sky-500'
                    : item.role === 'admin'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(item.percent, 1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentActivityCard({
  activities,
  onSeeAll,
}: {
  activities: RecentAdminActivity[]
  onSeeAll?: () => void
}) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <header className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Atividade recente
        </h3>
        <button
          type="button"
          onClick={onSeeAll}
          className="inline-flex items-center gap-0.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Ver tudo
          <ChevronRight size={12} />
        </button>
      </header>
      <div className="mt-3 space-y-3">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-2">
            <img
              src={act.actorAvatarUrl}
              alt=""
              className="h-6 w-6 shrink-0 rounded-full ring-2 ring-white dark:ring-slate-900"
            />
            <div className="min-w-0 flex-1 text-xs leading-snug">
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {act.actorName}
              </span>{' '}
              <span className="text-slate-500 dark:text-slate-400">{act.actionLabel}</span>{' '}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {act.targetLabel}
              </span>
              <div className="mt-0.5 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {act.timeAgoLabel}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PermissionsTeaser({ onManage }: { onManage?: () => void }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-4 text-slate-50 dark:from-slate-800 dark:to-slate-700">
      <div className="flex items-center gap-2">
        <Shield size={16} />
        <h3 className="text-sm font-semibold">Permissões por role</h3>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
        Configure o que cada role pode fazer — leitura, escrita, ações destrutivas,
        impersonação. Mudanças tomam efeito imediato.
      </p>
      <button
        type="button"
        onClick={onManage}
        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium ring-1 ring-white/20 transition-colors hover:bg-white/20"
      >
        Gerenciar permissões
        <ChevronRight size={12} />
      </button>
    </div>
  )
}

function BulkActionBar({
  selectedCount,
  actions,
  onAction,
  onClear,
}: {
  selectedCount: number
  actions: BulkAction[]
  onAction?: (id: string) => void
  onClear: () => void
}) {
  if (selectedCount === 0) return null
  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-slate-50 shadow-2xl ring-1 ring-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:ring-slate-200">
        <span className="text-xs font-medium">
          <span className="font-mono tabular-nums">{selectedCount}</span> selecionado{selectedCount === 1 ? '' : 's'}
        </span>
        <div className="mx-2 h-4 w-px bg-slate-700 dark:bg-slate-300" />
        <div className="flex items-center gap-1">
          {actions.map((act) => {
            const Icon = ICON_MAP[act.icon] ?? Users
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => onAction?.(act.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  act.destructive
                    ? 'text-rose-300 hover:bg-rose-900/40 dark:text-rose-600 dark:hover:bg-rose-100'
                    : 'text-slate-200 hover:bg-slate-800 dark:text-slate-700 dark:hover:bg-slate-200'
                }`}
              >
                <Icon size={12} />
                {act.label}
              </button>
            )
          })}
        </div>
        <div className="mx-1 h-4 w-px bg-slate-700 dark:bg-slate-300" />
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 dark:text-slate-500 dark:hover:bg-slate-200 dark:hover:text-slate-700"
          aria-label="Limpar seleção"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

export function AdminUsuarios({
  header,
  kpis,
  filters,
  users,
  totalUsers,
  roleDistribution,
  recentActivities,
  bulkActions,
  emptyStates,
  onSearch,
  onInviteAdmin,
  onRoleFilter,
  onStatusFilter,
  onPlanFilter,
  onClearFilters,
  onUserClick,
  onUserAction,
  onBulkAction,
  onManagePermissions,
  onSeeAllActivities,
}: AdminUsuariosProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === users.length) setSelected(new Set())
    else setSelected(new Set(users.map((u) => u.id)))
  }

  const hasActiveFilters =
    filters.selectedRole !== 'all' ||
    filters.selectedStatus !== 'all' ||
    filters.selectedPlan !== 'all' ||
    searchQuery.length > 0

  return (
    <div
      data-nymos-admin-usuarios
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
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {header.subtitle} ·{' '}
                <span className="tabular-nums">{formatNumberBR(totalUsers)} contas</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  placeholder={header.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    onSearch?.(e.target.value)
                  }}
                  className="w-full rounded-lg bg-white px-9 py-2 text-sm text-slate-900 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-50 dark:ring-slate-800 dark:placeholder:text-slate-500 dark:focus:ring-slate-100 sm:w-80"
                />
              </div>
              <button
                type="button"
                onClick={onInviteAdmin}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <UserPlus size={14} />
                {header.inviteAdminLabel}
              </button>
            </div>
          </div>
        </header>

        {/* KPIs */}
        <section
          aria-label="Indicadores de usuários"
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0 mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </section>

        {/* Filters bar */}
        <section
          style={{ animationDelay: '200ms' }}
          className="nymos-reveal opacity-0 mt-6 flex flex-wrap items-center gap-2"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.roleChips.map((chip) => (
              <RoleChip
                key={chip.id}
                chip={chip}
                selected={filters.selectedRole === chip.id}
                onClick={() => onRoleFilter?.(chip.id)}
              />
            ))}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select
              value={filters.selectedStatus}
              onChange={(e) => onStatusFilter?.(e.target.value)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
            >
              {filters.statusOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={filters.selectedPlan}
              onChange={(e) => onPlanFilter?.(e.target.value)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800"
            >
              {filters.planOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="rounded-lg bg-white px-3 py-1.5 text-xs text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800">
              {filters.dateRangeLabel}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  onClearFilters?.()
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <X size={12} />
                Limpar
              </button>
            )}
          </div>
        </section>

        {/* Main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Table */}
          <section
            style={{ animationDelay: '280ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
          >
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.size > 0 && selected.size === users.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 cursor-pointer accent-slate-900 dark:accent-slate-50"
                  aria-label="Selecionar todos"
                />
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                  {selected.size > 0 ? `${selected.size} de ${users.length}` : `${users.length} usuários`}
                </span>
              </div>
              <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 md:inline">
                Role · Plano · Status · Último acesso
              </span>
            </header>
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {users.length === 0 ? (
                <EmptyBlock
                  title={hasActiveFilters ? emptyStates.noResults.title : emptyStates.noUsers.title}
                  description={
                    hasActiveFilters ? emptyStates.noResults.description : emptyStates.noUsers.description
                  }
                />
              ) : (
                users.map((user) => (
                  <UserRowItem
                    key={user.id}
                    user={user}
                    selected={selected.has(user.id)}
                    onSelect={() => toggleSelect(user.id)}
                    onClick={() => onUserClick?.(user.id)}
                    onAction={(action) => onUserAction?.(user.id, action)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Right column */}
          <aside
            style={{ animationDelay: '360ms' }}
            className="nymos-reveal opacity-0 space-y-3 lg:sticky lg:top-6 lg:self-start"
          >
            <RoleDistributionCard items={roleDistribution} />
            <PermissionsTeaser onManage={onManagePermissions} />
            <RecentActivityCard
              activities={recentActivities}
              onSeeAll={onSeeAllActivities}
            />
          </aside>
        </div>
      </div>

      <BulkActionBar
        selectedCount={selected.size}
        actions={bulkActions}
        onAction={(action) => onBulkAction?.(action, Array.from(selected))}
        onClear={() => setSelected(new Set())}
      />
    </div>
  )
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-3 py-16 text-center">
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
