import { AlertTriangle, Mail, Smartphone, SmartphoneNfc } from 'lucide-react'
import type { PatientListItem, PlanTier } from '@/../product/sections/pacientes/types'
import { Avatar } from './Avatar'

interface PatientCardProps {
  patient: PatientListItem
  currentPlan: PlanTier
  onClick?: () => void
}

const STATUS_CONFIG: Record<
  PatientListItem['status'],
  { label: string; tone: string; dot: string }
> = {
  vinculado: {
    label: 'Vinculado',
    tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  pendente: {
    label: 'Pendente',
    tone: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  arquivado: {
    label: 'Arquivado',
    tone: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
}

const ALERT_TONE: Record<
  NonNullable<PatientListItem['alertSeverity']>,
  { ring: string; bg: string; icon: string }
> = {
  info: {
    ring: 'ring-amber-200 dark:ring-amber-800/60',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-700 dark:text-amber-300',
  },
  warning: {
    ring: 'ring-orange-200 dark:ring-orange-800/60',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-700 dark:text-orange-300',
  },
  critical: {
    ring: 'ring-red-200 dark:ring-red-800/60',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-700 dark:text-red-300',
  },
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

function adherenceColor(percent: number) {
  if (percent >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (percent >= 65) return 'text-amber-600 dark:text-amber-400'
  return 'text-orange-600 dark:text-orange-400'
}

export function PatientCard({ patient, currentPlan, onClick }: PatientCardProps) {
  const status = STATUS_CONFIG[patient.status]
  const showAdherence = PLAN_RANK[currentPlan] >= PLAN_RANK['plus']

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700 sm:flex-row sm:items-center sm:gap-5"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar name={patient.name} imageUrl={patient.avatarUrl} size="lg" />
        {patient.linkedToApp ? (
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
            title="Vinculado ao app"
          >
            <SmartphoneNfc size={10} className="text-white" />
          </span>
        ) : (
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 ring-2 ring-white dark:bg-slate-700 dark:ring-slate-900"
            title="App não vinculado"
          >
            <Smartphone size={10} className="text-slate-600 dark:text-slate-300" />
          </span>
        )}
      </div>

      {/* Identity */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
            {patient.name}
          </h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${status.tone}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          {patient.isFirstVisit && (
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              1ª consulta
            </span>
          )}
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Mail size={12} className="shrink-0" />
          <span className="truncate">{patient.email}</span>
        </p>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Última consulta · <span className="font-medium text-slate-700 dark:text-slate-300">{patient.lastAppointmentLabel}</span>
          {patient.linkedDaysAgo !== null && patient.linkedDaysAgo > 0 && (
            <>
              <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
              <span>Vinculado há {patient.linkedDaysAgo}d</span>
            </>
          )}
        </p>
      </div>

      {/* Adherence */}
      {showAdherence && patient.adherencePercent !== null && (
        <div className="flex shrink-0 flex-col items-end gap-0.5 sm:items-center">
          <p
            className={`font-mono text-xl font-semibold tabular-nums ${adherenceColor(patient.adherencePercent)}`}
          >
            {patient.adherencePercent}%
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            adesão
          </p>
        </div>
      )}

      {/* Alert flag */}
      {patient.alertReason && patient.alertSeverity && (
        <div
          className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 ring-1 ${ALERT_TONE[patient.alertSeverity].bg} ${ALERT_TONE[patient.alertSeverity].ring}`}
        >
          <AlertTriangle size={14} className={ALERT_TONE[patient.alertSeverity].icon} />
          <span className={`text-[11px] font-medium ${ALERT_TONE[patient.alertSeverity].icon}`}>
            {patient.alertReason}
          </span>
        </div>
      )}
    </button>
  )
}
