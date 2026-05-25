import type { AgendaProps } from '@/../product/sections/agenda/types'
import { AgendaHeader } from './AgendaHeader'
import { AgendaSidebar } from './AgendaSidebar'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'

export function Agenda({
  headerState,
  googleSync,
  events,
  availabilitySlots,
  blockedSlots,
  onViewChange,
  onNavigate,
  onDateChange,
  onFilterTypeChange,
  onFilterStatusChange,
  onToggleUnavailable,
  onForceSync,
  onReconnectGoogle,
  onOpenCreate,
  onEventClick,
  onSlotClick,
  onEventDrop,
  onEventResize,
  onConfirmAppointment,
  onCancelAppointment,
  onDuplicateAppointment,
  onCopyTeleconsultaLink,
  onStartAtendimento,
}: AgendaProps) {
  // Filter events by selected type and status
  const filteredEvents = events.filter((e) => {
    if (e.source === 'google') return googleSync.showSyncedFromGoogle
    const matchesType =
      headerState.selectedFilterType === 'todos-tipos' ||
      e.attendanceType === headerState.selectedFilterType
    const matchesStatus =
      headerState.selectedFilterStatus === 'todos-status' ||
      e.status === headerState.selectedFilterStatus
    return matchesType && matchesStatus
  })

  return (
    <div
      data-nymos-agenda
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Page title */}
        <div
          style={{ animationDelay: '0ms' }}
          className="nymos-reveal opacity-0 mb-6 space-y-2"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Agenda
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Calendário
          </h1>
        </div>

        {/* Header (toggle, nav, filters, sync) */}
        <div
          style={{ animationDelay: '120ms' }}
          className="nymos-reveal opacity-0"
        >
          <AgendaHeader
            headerState={headerState}
            googleSync={googleSync}
            onViewChange={onViewChange}
            onNavigate={onNavigate}
            onDateChange={onDateChange}
            onFilterTypeChange={onFilterTypeChange}
            onFilterStatusChange={onFilterStatusChange}
            onToggleUnavailable={onToggleUnavailable}
            onForceSync={onForceSync}
            onReconnectGoogle={onReconnectGoogle}
            onOpenCreate={onOpenCreate}
          />
        </div>

        {/* Sidebar (mini-cal) + active view */}
        <div
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mt-6 grid gap-5 lg:grid-cols-[260px_1fr]"
        >
          <AgendaSidebar
            selectedDate={headerState.currentDate}
            todayDate={headerState.currentDate}
            events={events}
            onDateClick={(iso) => onDateChange?.(iso)}
          />

          <div className="min-w-0">
            {headerState.activeView === 'mes' ? (
              <MonthView
                currentDate={headerState.currentDate}
                events={filteredEvents}
                onDateClick={(iso) => onDateChange?.(iso)}
                onEventClick={onEventClick}
              />
            ) : (
              <WeekView
                viewMode={headerState.activeView === 'dia' ? 'dia' : 'semana'}
                weekStart={headerState.weekStart}
                events={filteredEvents}
                availabilitySlots={availabilitySlots}
                blockedSlots={blockedSlots}
                showUnavailable={headerState.showUnavailableSlots}
                currentTimeIndicator={headerState.currentTimeIndicator}
                currentDate={headerState.currentDate}
                onEventClick={onEventClick}
                onSlotClick={onSlotClick}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                onConfirmAppointment={onConfirmAppointment}
                onCancelAppointment={onCancelAppointment}
                onDuplicateAppointment={onDuplicateAppointment}
                onCopyTeleconsultaLink={onCopyTeleconsultaLink}
                onStartAtendimento={onStartAtendimento}
              />
            )}
          </div>
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
      [data-nymos-agenda] .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        [data-nymos-agenda] .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
