import {
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  KeyRound,
  ExternalLink,
  Sparkles,
  CreditCard,
} from 'lucide-react'
import type {
  PatientProfile,
  UserPlan,
} from '@/../product/sections/perfil-paciente/types'

interface AccountInfoProps {
  profile: PatientProfile
  plan: UserPlan
  onChangePassword: () => void
  onManagePlan?: () => void
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

function formatRelative(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  return formatDate(iso)
}

function PlanStatusBadge({ plan }: { plan: UserPlan }) {
  if (plan.isTrialActive && plan.trialEndDate) {
    const daysLeft = Math.max(
      0,
      Math.ceil(
        (new Date(plan.trialEndDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      ),
    )
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
        Trial · {daysLeft}d
      </span>
    )
  }
  if (plan.status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
        Ativo
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
      {plan.status === 'suspended' ? 'Suspenso' : 'Cancelado'}
    </span>
  )
}

interface RowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  trailing?: React.ReactNode
}

function Row({ icon, label, value, trailing }: RowProps) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-slate-900 dark:text-slate-100">
          {value}
        </p>
      </div>
      {trailing}
    </div>
  )
}

export function AccountInfo({
  profile,
  plan,
  onChangePassword,
  onManagePlan,
}: AccountInfoProps) {
  return (
    <div className="space-y-6">
      {/* Account card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Informações da conta
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Email, plano e datas
          </p>
        </header>
        <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
          <Row
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={<span className="font-mono">{profile.email}</span>}
            trailing={
              profile.emailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                  <ShieldCheck className="h-3 w-3" />
                  Verificado
                </span>
              )
            }
          />
          <Row
            icon={<Sparkles className="h-4 w-4" />}
            label="Plano"
            value={
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{plan.planName}</span>
                <PlanStatusBadge plan={plan} />
              </span>
            }
            trailing={
              <button
                type="button"
                onClick={onManagePlan}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 transition hover:bg-teal-50 dark:text-teal-300 dark:ring-teal-500/30 dark:hover:bg-teal-500/10"
              >
                <CreditCard className="h-3 w-3" />
                Gerenciar
                <ExternalLink className="h-3 w-3" />
              </button>
            }
          />
          <Row
            icon={<Calendar className="h-4 w-4" />}
            label="Membro desde"
            value={<span className="font-mono">{formatDate(profile.createdAt)}</span>}
          />
          <Row
            icon={<Clock className="h-4 w-4" />}
            label="Último acesso"
            value={formatRelative(profile.lastLogin)}
          />
        </div>
      </section>

      {/* Security card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Segurança
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proteja sua conta
          </p>
        </header>
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <KeyRound className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Senha
            </p>
            <p className="mt-0.5 font-mono text-sm tracking-widest text-slate-900 dark:text-slate-100">
              ••••••••••
            </p>
          </div>
          <button
            type="button"
            onClick={onChangePassword}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700"
          >
            Trocar senha
          </button>
        </div>
      </section>
    </div>
  )
}
