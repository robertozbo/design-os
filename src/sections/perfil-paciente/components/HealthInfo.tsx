import { Pencil, Activity, Droplet, Ruler, Scale, Cake } from 'lucide-react'
import type {
  ActivityLevelOption,
  PatientProfile,
} from '@/../product/sections/perfil-paciente/types'

interface HealthInfoProps {
  profile: PatientProfile
  activityLevelOptions: ActivityLevelOption[]
  onEdit: () => void
}

interface StatProps {
  icon: React.ReactNode
  label: string
  value: string
  unit?: string
  tone?: 'default' | 'rose' | 'emerald' | 'teal'
}

const TONE_STYLES: Record<NonNullable<StatProps['tone']>, string> = {
  default: 'bg-slate-50 text-slate-900 dark:bg-slate-800/50 dark:text-slate-100',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300',
}

function Stat({ icon, label, value, unit, tone = 'default' }: StatProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-2xl p-4 ${TONE_STYLES[tone]}`}>
      <div className="flex items-center gap-2 opacity-80">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-bold tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium opacity-70">{unit}</span>
        )}
      </div>
    </div>
  )
}

export function HealthInfo({
  profile,
  activityLevelOptions,
  onEdit,
}: HealthInfoProps) {
  const activityLabel =
    activityLevelOptions.find((o) => o.value === profile.activityLevel)?.label ??
    '—'
  const activityDescription =
    activityLevelOptions.find((o) => o.value === profile.activityLevel)
      ?.description

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Saúde
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dados físicos e alergias
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </button>
      </header>

      <div className="space-y-6 p-6">
        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat
            icon={<Cake className="h-3.5 w-3.5" />}
            label="Idade"
            value={profile.age != null ? String(profile.age) : '—'}
            unit={profile.age != null ? 'anos' : undefined}
            tone="default"
          />
          <Stat
            icon={<Ruler className="h-3.5 w-3.5" />}
            label="Altura"
            value={profile.height != null ? String(profile.height) : '—'}
            unit={profile.height != null ? 'cm' : undefined}
            tone="teal"
          />
          <Stat
            icon={<Scale className="h-3.5 w-3.5" />}
            label="Peso"
            value={profile.weight != null ? String(profile.weight) : '—'}
            unit={profile.weight != null ? 'kg' : undefined}
            tone="emerald"
          />
          <Stat
            icon={<Droplet className="h-3.5 w-3.5" />}
            label="Sangue"
            value={profile.bloodType ?? '—'}
            tone="rose"
          />
        </div>

        {/* Activity level */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-teal-400 dark:ring-slate-700">
            <Activity className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nível de atividade
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {activityLabel}
            </p>
            {activityDescription && profile.activityLevel && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {activityDescription}
              </p>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Alergias
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.allergies.length === 0 ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30">
                Nenhuma alergia cadastrada
              </span>
            ) : (
              profile.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
                >
                  {allergy}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
