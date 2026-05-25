import { ArrowRight } from 'lucide-react'
import type { PatientCard, PatientsTabId, PatientsWidget as PatientsWidgetData, PlanTier } from '@/../product/sections/dashboard-nutri/types'

interface PatientsWidgetProps {
  widget: PatientsWidgetData
  currentPlan: PlanTier
  onTabChange?: (tab: PatientsTabId) => void
  onPatientClick?: (patientId: string) => void
}

const SEVERITY_DOT: Record<NonNullable<PatientCard['alertSeverity']>, string> = {
  info: 'bg-amber-400',
  warning: 'bg-orange-500',
  critical: 'bg-red-600',
}

function adherenceTone(percent: number) {
  if (percent >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (percent >= 65) return 'text-amber-600 dark:text-amber-400'
  return 'text-orange-600 dark:text-orange-400'
}

function PatientItem({
  patient,
  showAdherence,
  onClick,
}: {
  patient: PatientCard
  showAdherence: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-all hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900/60"
    >
      <div className="relative">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-500 text-xs font-semibold text-white">
          {patient.name
            .split(' ')
            .slice(0, 2)
            .map((n) => n[0])
            .join('')}
        </div>
        {patient.alertSeverity && (
          <span
            className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${SEVERITY_DOT[patient.alertSeverity]}`}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-50">
            {patient.name}
          </p>
          {!patient.linkedToApp && (
            <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              sem app
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {patient.alertReason ?? patient.lastAppointmentLabel}
        </p>
      </div>

      {showAdherence && patient.adherencePercent !== null && (
        <div className="text-right">
          <p className={`font-mono text-sm font-semibold tabular-nums ${adherenceTone(patient.adherencePercent)}`}>
            {patient.adherencePercent}%
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            adesão
          </p>
        </div>
      )}

      <ArrowRight
        size={14}
        className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600 dark:text-slate-700 dark:group-hover:text-teal-400"
      />
    </button>
  )
}

const PLAN_RANK: Record<PlanTier, number> = { free: 0, plus: 1, pro: 2 }

export function PatientsWidget({ widget, currentPlan, onTabChange, onPatientClick }: PatientsWidgetProps) {
  const showAdherence = PLAN_RANK[currentPlan] >= PLAN_RANK['plus']
  const patients = widget.patientsByTab[widget.selectedTab] ?? []

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex flex-col gap-3 border-b border-slate-100 pb-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">Pacientes</h2>

        <div role="tablist" aria-label="Filtro de pacientes" className="flex gap-1">
          {widget.tabs.map((tab) => {
            const active = tab.id === widget.selectedTab
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => onTabChange?.(tab.id)}
                className={`group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
                <span
                  className={`font-mono text-xs tabular-nums ${
                    active
                      ? 'text-slate-300 dark:text-slate-500'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="mt-2 space-y-1">
        {patients.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Nenhum paciente nessa lista.
            </p>
          </div>
        ) : (
          patients.map((patient) => (
            <PatientItem
              key={patient.id}
              patient={patient}
              showAdherence={showAdherence}
              onClick={() => onPatientClick?.(patient.id)}
            />
          ))
        )}
      </div>

      {patients.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <a
            href={widget.viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Ver todos os pacientes
            <ArrowRight size={14} />
          </a>
        </div>
      )}
    </section>
  )
}
