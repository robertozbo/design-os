import type { ProfessionalDashboardProps } from '@/../product/sections/professional-dashboard/types'
import { AgendaSection } from './AgendaSection'
import { FilterBar } from './FilterBar'
import { KpiCard } from './KpiCard'
import { Nr1Strip } from './Nr1Strip'
import { PatientDrawer } from './PatientDrawer'
import { PatientList } from './PatientList'

export function ProfessionalDashboard({
  professional,
  workspace,
  nr1,
  kpis,
  agenda,
  filterChips,
  activeFilterId,
  totalFilteredCount,
  patients,
  drawer,
  onFilterChange,
  onSearchChange,
  onOpenPatient,
  onCloseDrawer,
  onOpenTimeline,
  onAcknowledgeAlert,
  onSaveClinicalNote,
  onAgendaPeriodChange,
  onOpenAppointment,
  onStartAppointment,
  onNewAppointment,
  onSeeFullAgenda,
  onOpenNr1Module,
}: ProfessionalDashboardProps) {
  const showNr1 =
    workspace.type === 'employer' && workspace.hasNr1Access && nr1 != null
  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Greeting */}
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Consultório · Nymos
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {professional.greeting}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {professional.role} · Sua triagem de hoje começa com {kpis[1]?.value ?? 0} alertas críticos abertos.
              </p>
            </div>
          </div>
        </header>

        {/* NR-1 strip (only when active workspace is employer with NR-1 enabled) */}
        {showNr1 && nr1 && (
          <div className="mt-6">
            <Nr1Strip
              workspace={workspace}
              nr1={nr1}
              revealIndex={1}
              onOpenModule={onOpenNr1Module}
            />
          </div>
        )}

        {/* KPIs */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k, i) => (
            <KpiCard key={k.id} kpi={k} revealIndex={i + 2} />
          ))}
        </div>

        {/* Agenda */}
        <div className="mt-6">
          <AgendaSection
            agenda={agenda}
            revealIndex={6}
            onPeriodChange={onAgendaPeriodChange}
            onOpenAppointment={onOpenAppointment}
            onStartAppointment={onStartAppointment}
            onNewAppointment={onNewAppointment}
            onSeeFullAgenda={onSeeFullAgenda}
          />
        </div>

        {/* Content: list + drawer */}
        <div className="mt-6 flex flex-col xl:flex-row gap-4">
          <div className="flex-1 min-w-0 space-y-4">
            <FilterBar
              chips={filterChips}
              activeFilterId={activeFilterId}
              totalFilteredCount={totalFilteredCount}
              onFilterChange={onFilterChange}
              onSearchChange={onSearchChange}
              revealIndex={6}
            />
            <PatientList
              patients={patients}
              selectedPatientId={drawer.patientId}
              onOpenPatient={onOpenPatient}
              revealIndex={7}
            />
          </div>

          <PatientDrawer
            drawer={drawer}
            onClose={onCloseDrawer}
            onOpenTimeline={onOpenTimeline}
            onAcknowledgeAlert={onAcknowledgeAlert}
            onSaveClinicalNote={onSaveClinicalNote}
          />
        </div>
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
