import {
  Camera,
  KeyRound,
  ChevronRight,
  Star,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import type {
  LinkedProfessionalSummary,
  PatientProfile,
  UserPlan,
} from '@/../product/sections/perfil-paciente/types'

interface OverviewProps {
  profile: PatientProfile
  plan: UserPlan
  linkedProfessionals: LinkedProfessionalSummary[]
  linkedProfessionalsTotal: number
  onEditPersonalData: () => void
  onEditAvatar: () => void
  onEditPassword: () => void
  onSeeAllProfessionals?: () => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function PlanBadge({ plan }: { plan: UserPlan }) {
  if (plan.isTrialActive && plan.trialEndDate) {
    const daysLeft = Math.max(
      0,
      Math.ceil(
        (new Date(plan.trialEndDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      ),
    )
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
        <Sparkles className="h-3 w-3" />
        TRIAL · {daysLeft}d
      </span>
    )
  }
  if (plan.status === 'active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
        <Sparkles className="h-3 w-3" />
        {plan.planName.toUpperCase()}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">
      {plan.status === 'suspended' ? 'SUSPENSO' : 'CANCELADO'}
    </span>
  )
}

const TYPE_LABEL_COLORS: Record<string, string> = {
  nutritionist: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30',
  personal_trainer: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
  doctor: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30',
  physiotherapist: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30',
  psychologist: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
  health_coach: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30',
}

export function Overview({
  profile,
  plan,
  linkedProfessionals,
  linkedProfessionalsTotal,
  onEditPersonalData,
  onEditAvatar,
  onEditPassword,
  onSeeAllProfessionals,
}: OverviewProps) {
  const initials = getInitials(profile.name)
  const top3 = linkedProfessionals.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-teal-400/40 via-emerald-300/30 to-transparent blur-3xl dark:from-teal-500/30 dark:via-emerald-500/20"
        />
        <div className="relative grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-center gap-6 p-6 md:p-8">
          {/* Avatar */}
          <button
            type="button"
            onClick={onEditAvatar}
            className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/80 shadow-lg shadow-teal-500/10 dark:ring-slate-900 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40"
            aria-label="Trocar foto de perfil"
          >
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-emerald-200 text-2xl font-bold tracking-tight text-teal-800 dark:from-teal-500/20 dark:to-emerald-500/30 dark:text-teal-200">
                {initials}
              </div>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </span>
          </button>

          {/* Identity */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {profile.name}
              </h1>
              <PlanBadge plan={plan} />
            </div>
            <p className="mt-1.5 truncate font-mono text-sm text-slate-500 dark:text-slate-400">
              {profile.email}
            </p>
            {profile.bio && (
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Quick actions row */}
        <div className="relative border-t border-slate-100 bg-slate-50/60 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onEditPersonalData}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              Editar dados
            </button>
            <button
              type="button"
              onClick={onEditPassword}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Trocar senha
            </button>
            <button
              type="button"
              onClick={onEditAvatar}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-700"
            >
              <Camera className="h-3.5 w-3.5" />
              Editar foto
            </button>
          </div>
        </div>
      </section>

      {/* Linked professionals card */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Profissionais vinculados
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {linkedProfessionalsTotal === 0
                ? 'Nenhum profissional vinculado ainda'
                : `${linkedProfessionalsTotal} vinculado${linkedProfessionalsTotal !== 1 ? 's' : ''} no total`}
            </p>
          </div>
          {linkedProfessionalsTotal > 0 && (
            <button
              type="button"
              onClick={onSeeAllProfessionals}
              className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 transition hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
            >
              Ver todos
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </header>

        {top3.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-500/20 dark:to-emerald-500/20">
              <UserPlus className="h-6 w-6 text-teal-700 dark:text-teal-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Vincule seu primeiro profissional
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Nutricionistas, personal trainers, médicos e mais
              </p>
            </div>
            <button
              type="button"
              onClick={onSeeAllProfessionals}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700"
            >
              Ir para Meus Profissionais
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {top3.map((pro) => {
              const proInitials = getInitials(pro.fullName)
              const typeStyle =
                TYPE_LABEL_COLORS[pro.professionalType] ??
                'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700'
              return (
                <li key={pro.id} className="flex items-center gap-4 px-6 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-slate-700">
                    {pro.avatarUrl ? (
                      <img
                        src={pro.avatarUrl}
                        alt={pro.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {proInitials}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {pro.fullName}
                      </p>
                      {pro.isPrimary && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30"
                          aria-label="Profissional primário"
                        >
                          <Star className="h-2.5 w-2.5 fill-current" />
                          Primário
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${typeStyle}`}
                  >
                    {pro.typeLabel}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
