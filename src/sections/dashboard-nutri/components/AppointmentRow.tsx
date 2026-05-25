import { ArrowRight, Home, MapPin, Video } from 'lucide-react'
import type { Appointment } from '@/../product/sections/dashboard-nutri/types'

interface AppointmentRowProps {
  appointment: Appointment
  onClick?: () => void
}

const STATUS_TONE: Record<Appointment['status'], string> = {
  confirmada: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  realizada: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  cancelada: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
}

const STATUS_LABEL: Record<Appointment['status'], string> = {
  confirmada: 'Confirmada',
  pendente: 'Pendente',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
}

const ATTENDANCE: Record<
  Appointment['attendanceType'],
  { label: string; Icon: typeof MapPin; tone: string }
> = {
  presencial: {
    label: 'Presencial',
    Icon: MapPin,
    tone: 'text-teal-700 dark:text-teal-300',
  },
  teleconsulta: {
    label: 'Teleconsulta',
    Icon: Video,
    tone: 'text-emerald-700 dark:text-emerald-300',
  },
  domicilio: {
    label: 'Domicílio',
    Icon: Home,
    tone: 'text-orange-700 dark:text-orange-300',
  },
}

export function AppointmentRow({ appointment, onClick }: AppointmentRowProps) {
  const attendance = ATTENDANCE[appointment.attendanceType]
  const AttendanceIcon = attendance.Icon

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-900/60"
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {appointment.startTime}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
          {appointment.durationMin}m
        </span>
      </div>

      <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-semibold text-white">
        {appointment.patientName
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {appointment.patientName}
          </p>
          {appointment.isFirstVisit && (
            <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              1ª consulta
            </span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <AttendanceIcon size={12} className={attendance.tone} />
          <span>{attendance.label}</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="truncate">{appointment.serviceName}</span>
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_TONE[appointment.status]}`}
      >
        {STATUS_LABEL[appointment.status]}
      </span>

      <ArrowRight
        size={14}
        className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-teal-600 dark:text-slate-600 dark:group-hover:text-teal-400"
      />
    </button>
  )
}
