import { Pencil, MapPin, UserRound, Cake, Phone, Mail } from 'lucide-react'
import type {
  GenderOption,
  PatientProfile,
} from '@/../product/sections/perfil-paciente/types'

interface PersonalInfoProps {
  profile: PatientProfile
  genderOptions: GenderOption[]
  onEdit: () => void
}

function formatBirthdate(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (isNaN(date.getTime())) return '—'
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}

function formatAddress(profile: PatientProfile): string | null {
  const parts: string[] = []
  if (profile.address) {
    parts.push(
      [profile.address, profile.addressNumber].filter(Boolean).join(', '),
    )
  }
  if (profile.addressComplement) parts.push(profile.addressComplement)
  const locality = [profile.neighborhood, profile.addressCity]
    .filter(Boolean)
    .join(' · ')
  if (locality) {
    parts.push(
      `${locality}${profile.addressState ? '/' + profile.addressState : ''}`,
    )
  }
  if (profile.zipCode) parts.push(`CEP ${profile.zipCode}`)
  if (parts.length === 0) return null
  return parts.join(' — ')
}

interface FieldProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  mono?: boolean
}

function Field({ icon, label, value, mono }: FieldProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p
          className={`mt-0.5 text-sm text-slate-900 dark:text-slate-100 ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export function PersonalInfo({ profile, genderOptions, onEdit }: PersonalInfoProps) {
  const address = formatAddress(profile)
  const genderLabel =
    genderOptions.find((o) => o.value === profile.gender)?.label ?? '—'

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Dados pessoais
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Identidade, contato e endereço
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

      {/* Identidade */}
      <div className="px-6 py-2">
        <p className="pt-3 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Identidade
        </p>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <Field
            icon={<UserRound className="h-4 w-4" />}
            label="Nome completo"
            value={profile.name}
          />
          <Field
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={profile.email}
            mono
          />
          <Field
            icon={<Phone className="h-4 w-4" />}
            label="Telefone"
            value={profile.phone || '—'}
            mono
          />
          <Field
            icon={<Cake className="h-4 w-4" />}
            label="Data de nascimento"
            value={formatBirthdate(profile.birthdate)}
            mono
          />
          <Field
            icon={<UserRound className="h-4 w-4" />}
            label="Gênero"
            value={genderLabel}
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Endereço
        </p>
        <div className="mt-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            {address ? (
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {address}
              </p>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30">
                Endereço não cadastrado
              </span>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Bio
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {profile.bio}
          </p>
        </div>
      )}
    </section>
  )
}
