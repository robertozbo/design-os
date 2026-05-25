import { ArrowRight, CalendarPlus, ChevronRight, Play, Video } from 'lucide-react'
import type {
  AgendaPeriod,
  AgendaSectionData,
  Appointment,
} from '@/../product/sections/professional-dashboard/types'

interface Props {
  agenda: AgendaSectionData
  revealIndex?: number
  onPeriodChange?: (period: AgendaPeriod) => void
  onOpenAppointment?: (appointmentId: string) => void
  onStartAppointment?: (appointmentId: string) => void
  onNewAppointment?: () => void
  onSeeFullAgenda?: () => void
}

const periodHeading: Record<AgendaPeriod, string> = {
  today: 'Agenda de hoje',
  week: 'Agenda da semana',
  month: 'Agenda do mês',
}

const emptyCopy: Record<AgendaPeriod, string> = {
  today: 'Sem consultas hoje. Que tal aproveitar pra revisar a triagem abaixo?',
  week: 'Sem consultas marcadas para esta semana.',
  month: 'Sem consultas marcadas para este mês.',
}

export function AgendaSection({
  agenda,
  revealIndex = 0,
  onPeriodChange,
  onOpenAppointment,
  onStartAppointment,
  onNewAppointment,
  onSeeFullAgenda,
}: Props) {
  const { activePeriod, periodTabs, appointments, totalCount } = agenda
  const visible = appointments.slice(0, 5)
  const hidden = Math.max(0, totalCount - visible.length)
  const heading = periodHeading[activePeriod]

  return (
    <section
      style={{ animationDelay: `${60 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-slate-200/80 dark:border-slate-800
        shadow-[0_1px_2px_rgba(15,23,42,0.04)]
        overflow-hidden
      "
      aria-labelledby="agenda-heading"
    >
      {/* Header */}
      <header
        className="
          flex flex-col gap-3 px-5 py-4
          md:flex-row md:items-center md:justify-between
          border-b border-slate-200/70 dark:border-slate-800
        "
      >
        <div className="flex items-center gap-3">
          <h2
            id="agenda-heading"
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            {heading}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {totalCount} consulta{totalCount === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period tabs */}
          <div
            role="tablist"
            aria-label="Período da agenda"
            className="flex items-center gap-1.5"
          >
            {periodTabs.map((tab) => {
              const active = tab.id === activePeriod
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onPeriodChange?.(tab.id)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    text-xs font-medium transition-colors
                    ${
                      active
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`
                      text-[10px] font-semibold tabular-nums rounded-full px-1.5 py-0.5
                      ${
                        active
                          ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNewAppointment?.()}
              className="
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-medium
                bg-teal-600 text-white hover:bg-teal-700
                dark:bg-teal-500 dark:hover:bg-teal-400 dark:text-slate-950
                transition-colors
              "
            >
              <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Novo</span>
            </button>
            <button
              type="button"
              onClick={() => onSeeFullAgenda?.()}
              className="
                inline-flex items-center gap-1 px-2 py-1.5 rounded-md
                text-xs font-medium
                text-slate-600 hover:text-slate-900 hover:bg-slate-100
                dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800
                transition-colors
              "
            >
              <span>Ver agenda</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* List */}
      {visible.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {emptyCopy[activePeriod]}
          </p>
          {activePeriod === 'today' && (
            <button
              type="button"
              onClick={() => onNewAppointment?.()}
              className="
                mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-medium
                bg-slate-900 text-white hover:bg-slate-800
                dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
                transition-colors
              "
            >
              <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Novo agendamento</span>
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
          {visible.map((apt) => (
            <AppointmentRow
              key={apt.id}
              appointment={apt}
              showDate={activePeriod !== 'today'}
              onOpen={() => onOpenAppointment?.(apt.id)}
              onStart={() => onStartAppointment?.(apt.id)}
            />
          ))}
        </ul>
      )}

      {/* Footer with hidden count */}
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => onSeeFullAgenda?.()}
          className="
            w-full px-5 py-2.5 text-xs font-medium
            text-slate-600 hover:text-slate-900 hover:bg-slate-50
            dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50
            border-t border-slate-200/70 dark:border-slate-800
            inline-flex items-center justify-center gap-1
            transition-colors
          "
        >
          <span>+{hidden} na agenda completa</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </section>
  )
}

function AppointmentRow({
  appointment,
  showDate,
  onOpen,
  onStart,
}: {
  appointment: Appointment
  showDate: boolean
  onOpen: () => void
  onStart: () => void
}) {
  return (
    <li className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
      {/* Time */}
      <div className="w-16 shrink-0 text-left">
        {showDate && appointment.dateLabel && (
          <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {appointment.dateLabel}
          </div>
        )}
        <div className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {appointment.startLabel}
        </div>
      </div>

      {/* Avatar */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Abrir paciente ${appointment.patientName}`}
        className="
          shrink-0 w-9 h-9 rounded-full
          bg-gradient-to-br from-teal-100 to-teal-200
          dark:from-teal-900/60 dark:to-teal-800/40
          flex items-center justify-center
          text-xs font-semibold text-teal-800 dark:text-teal-200
          hover:ring-2 hover:ring-teal-500/40
          transition-shadow
        "
      >
        {appointment.patientInitials}
      </button>

      {/* Info */}
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {appointment.patientName}
          </span>
          {appointment.isTeleconsultation && (
            <Video
              aria-label="Telemedicina"
              className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0"
            />
          )}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {appointment.serviceLabel}
        </div>
      </button>

      {/* Action */}
      <button
        type="button"
        onClick={onStart}
        disabled={appointment.status === 'completed'}
        className="
          shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full
          text-xs font-medium
          bg-slate-900 text-white hover:bg-slate-800
          dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
        "
      >
        <Play className="w-3 h-3" aria-hidden="true" />
        <span>Iniciar atendimento</span>
      </button>
    </li>
  )
}
