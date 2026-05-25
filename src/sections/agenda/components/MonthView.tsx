import { useMemo } from 'react'
import { Home, MapPin, Video } from 'lucide-react'
import type {
  AnchorRect,
  AttendanceType,
  CalendarEvent,
} from '@/../product/sections/agenda/types'

interface MonthViewProps {
  /** Date inside the month to render (ISO yyyy-mm-dd). Also used as the selected cell. */
  currentDate: string
  /** Optional separate "today" highlight (ISO). Defaults to currentDate. */
  todayDate?: string
  events: CalendarEvent[]
  onDateClick?: (isoDate: string) => void
  onEventClick?: (eventId: string, anchor: AnchorRect) => void
  /** Click an empty cell creates an event at this default time. */
  defaultCreateTime?: string
  onSlotClick?: (slot: { date: string; startTime: string }, anchor: AnchorRect) => void
}

const WEEKDAY_HEADERS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MAX_VISIBLE_EVENTS_PER_CELL = 3

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

function parseIso(iso: string): { year: number; month: number; day: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { year: y, month: m - 1, day: d }
}

function rectFromEl(el: HTMLElement): AnchorRect {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, bottom: r.bottom, right: r.right, width: r.width, height: r.height }
}

const ATTENDANCE_DOT: Record<AttendanceType, { bg: string; text: string; ring: string; Icon: typeof MapPin }> = {
  presencial: {
    bg: 'bg-teal-100 dark:bg-teal-900/40',
    text: 'text-teal-900 dark:text-teal-100',
    ring: 'ring-teal-500/30',
    Icon: MapPin,
  },
  teleconsulta: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    text: 'text-emerald-900 dark:text-emerald-100',
    ring: 'ring-emerald-500/30',
    Icon: Video,
  },
  domicilio: {
    bg: 'bg-orange-100 dark:bg-orange-900/40',
    text: 'text-orange-900 dark:text-orange-100',
    ring: 'ring-orange-500/30',
    Icon: Home,
  },
}

export function MonthView({
  currentDate,
  todayDate,
  events,
  onDateClick,
  onEventClick,
}: MonthViewProps) {
  const { year, month } = parseIso(currentDate)

  const grid = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1)
    const startWeekday = firstDayOfMonth.getDay() // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const cells: Array<{ iso: string; day: number; inCurrentMonth: boolean }> = []

    // Leading days from previous month
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i
      const m = month === 0 ? 11 : month - 1
      const y = month === 0 ? year - 1 : year
      cells.push({ iso: toIso(y, m, d), day: d, inCurrentMonth: false })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ iso: toIso(year, month, d), day: d, inCurrentMonth: true })
    }

    // Trailing to fill 6 rows
    while (cells.length < 42) {
      const last = cells[cells.length - 1]
      const lp = parseIso(last.iso)
      const next = last.day + 1
      const dim = new Date(lp.year, lp.month + 1, 0).getDate()
      if (next > dim) {
        const nm = lp.month === 11 ? 0 : lp.month + 1
        const ny = lp.month === 11 ? lp.year + 1 : lp.year
        cells.push({ iso: toIso(ny, nm, 1), day: 1, inCurrentMonth: false })
      } else {
        cells.push({ iso: toIso(lp.year, lp.month, next), day: next, inCurrentMonth: false })
      }
    }
    return cells
  }, [year, month])

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    for (const e of events) {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    }
    // Sort each day by startTime
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return map
  }, [events])

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40">
        {WEEKDAY_HEADERS.map((label) => (
          <div
            key={label}
            className="border-l border-slate-200 px-2 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500 first:border-l-0 dark:border-slate-800 dark:text-slate-400"
          >
            {label}
          </div>
        ))}
      </div>

      {/* 6×7 grid */}
      <div className="grid grid-cols-7 grid-rows-6">
        {grid.map((cell, idx) => {
          const isSelected = cell.iso === currentDate
          const isToday = cell.iso === (todayDate ?? currentDate)
          const dayEvents = eventsByDate[cell.iso] ?? []
          const visible = dayEvents.slice(0, MAX_VISIBLE_EVENTS_PER_CELL)
          const overflow = dayEvents.length - visible.length

          // Top-row cells get no top border (header already has it)
          const isTopRow = idx < 7
          // First column gets no left border
          const isFirstCol = idx % 7 === 0

          return (
            <div
              key={cell.iso}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-month-event]')) return
                onDateClick?.(cell.iso)
              }}
              role="button"
              tabIndex={0}
              className={`
                group relative min-h-[110px] cursor-pointer
                ${isTopRow ? '' : 'border-t border-slate-200 dark:border-slate-800'}
                ${isFirstCol ? '' : 'border-l border-slate-200 dark:border-slate-800'}
                ${cell.inCurrentMonth ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/40 dark:bg-slate-950/30'}
                ${isSelected ? 'bg-teal-50/60 dark:bg-teal-900/10' : ''}
                hover:bg-slate-50 dark:hover:bg-slate-800/40
                transition-colors
              `}
            >
              {/* Date number */}
              <div className="flex items-center justify-end px-2 pt-1.5">
                <span
                  className={`
                    flex h-6 min-w-6 items-center justify-center rounded-full px-1.5
                    font-mono text-xs tabular-nums
                    ${
                      isSelected
                        ? 'bg-teal-600 text-white font-semibold shadow-sm'
                        : isToday
                        ? 'ring-1 ring-teal-400 text-teal-700 dark:text-teal-300'
                        : cell.inCurrentMonth
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 dark:text-slate-600'
                    }
                  `}
                >
                  {cell.day}
                </span>
              </div>

              {/* Event chips */}
              <div className="mt-0.5 space-y-0.5 px-1.5 pb-1.5">
                {visible.map((event) => (
                  <MonthEventChip
                    key={event.id}
                    event={event}
                    onClick={(anchor) => onEventClick?.(event.id, anchor)}
                  />
                ))}
                {overflow > 0 && (
                  <button
                    type="button"
                    data-month-event
                    onClick={(e) => {
                      e.stopPropagation()
                      onDateClick?.(cell.iso)
                    }}
                    className="block w-full px-1 py-0.5 text-left font-mono text-[10px] tabular-nums text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    +{overflow} mais
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

function MonthEventChip({
  event,
  onClick,
}: {
  event: CalendarEvent
  onClick?: (anchor: AnchorRect) => void
}) {
  if (event.source === 'google') {
    return (
      <button
        type="button"
        data-month-event
        onClick={(e) => {
          e.stopPropagation()
          onClick?.(rectFromEl(e.currentTarget))
        }}
        className="flex w-full items-center gap-1 truncate rounded border border-dashed border-slate-300 bg-slate-50 px-1.5 py-0.5 text-left text-[10px] text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span className="font-mono tabular-nums opacity-70">{event.startTime}</span>
        <span className="truncate font-medium">{event.title}</span>
      </button>
    )
  }

  const cfg = ATTENDANCE_DOT[event.attendanceType]
  const isCancelada = event.status === 'cancelada'
  const isPendente = event.status === 'pendente'

  return (
    <button
      type="button"
      data-month-event
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(rectFromEl(e.currentTarget))
      }}
      className={`
        flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-[10px]
        ${cfg.bg} ${cfg.text}
        ${isPendente ? 'ring-1 ring-dashed ring-current/40' : ''}
        ${isCancelada ? 'opacity-50 line-through' : ''}
        hover:brightness-95
      `}
    >
      <span className="font-mono tabular-nums opacity-80">{event.startTime}</span>
      <span className="truncate font-medium">{event.patientName}</span>
    </button>
  )
}
