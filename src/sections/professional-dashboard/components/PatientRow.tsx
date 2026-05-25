import { ChevronRight, Clock3 } from 'lucide-react'
import type {
  PatientRow as PatientRowData,
  Tone,
} from '@/../product/sections/professional-dashboard/types'
import { AlertPills } from './AlertPills'

interface Props {
  patient: PatientRowData
  isSelected?: boolean
  onOpen?: () => void
}

const adherenceBar: Record<Tone, string> = {
  good: 'bg-teal-500',
  warning: 'bg-amber-400',
  critical: 'bg-rose-500',
  neutral: 'bg-slate-400',
  info: 'bg-sky-500',
}

const adherenceText: Record<Tone, string> = {
  good: 'text-teal-700 dark:text-teal-300',
  warning: 'text-amber-700 dark:text-amber-300',
  critical: 'text-rose-700 dark:text-rose-300',
  neutral: 'text-slate-600 dark:text-slate-300',
  info: 'text-sky-700 dark:text-sky-300',
}

const checkInText: Record<Tone, string> = {
  good: 'text-slate-600 dark:text-slate-300',
  warning: 'text-amber-700 dark:text-amber-300',
  critical: 'text-rose-700 dark:text-rose-300',
  neutral: 'text-slate-600 dark:text-slate-300',
  info: 'text-sky-700 dark:text-sky-300',
}

export function PatientRow({ patient, isSelected, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={isSelected}
      className={`
        group relative w-full text-left
        px-4 sm:px-5 py-3.5
        flex items-center gap-4
        transition-colors
        ${
          isSelected
            ? 'bg-teal-50/70 dark:bg-teal-500/5'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
        }
      `}
    >
      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-0.5 rounded-r-full bg-teal-500"
        />
      )}

      {/* Identity */}
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none sm:w-60">
        <div
          aria-hidden="true"
          className="
            shrink-0 grid place-items-center w-9 h-9 rounded-full
            bg-gradient-to-br from-teal-400 to-violet-400 text-white
            text-xs font-semibold
          "
        >
          {patient.initials}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
            {patient.fullName}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
            {patient.age} anos
          </div>
        </div>
      </div>

      {/* Last check-in */}
      <div className="hidden sm:flex items-center gap-1.5 min-w-0 w-40">
        <Clock3
          className={`w-3.5 h-3.5 shrink-0 ${checkInText[patient.lastCheckInTone]}`}
        />
        <span
          className={`text-xs font-medium truncate ${checkInText[patient.lastCheckInTone]}`}
        >
          {patient.lastCheckInLabel}
        </span>
      </div>

      {/* Adherence */}
      <div className="hidden md:block w-44">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
            Adesão
          </span>
          <span
            className={`text-xs font-semibold tabular-nums ${adherenceText[patient.adherenceTone]}`}
          >
            {patient.adherencePercent}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${adherenceBar[patient.adherenceTone]}`}
            style={{ width: `${Math.max(3, Math.min(100, patient.adherencePercent))}%` }}
          />
        </div>
      </div>

      {/* Alerts */}
      <div className="flex-1 min-w-0 flex items-center justify-end md:justify-start">
        <AlertPills alerts={patient.activeAlerts} compact />
      </div>

      {/* Chevron */}
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors"
      />
    </button>
  )
}
