import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MiniCalendarProps {
  /** Currently selected/highlighted date (ISO yyyy-mm-dd) */
  selectedDate: string
  /** Today's date (ISO) — receives a special highlight */
  todayDate?: string
  /** Optional: ISO dates that have events (for indicator dots) */
  datesWithEvents?: string[]
  onDateClick?: (isoDate: string) => void
}

const WEEKDAY_HEADERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

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

export function MiniCalendar({
  selectedDate,
  todayDate,
  datesWithEvents = [],
  onDateClick,
}: MiniCalendarProps) {
  const initial = parseIso(selectedDate)
  const [viewYear, setViewYear] = useState(initial.year)
  const [viewMonth, setViewMonth] = useState(initial.month)

  const eventDateSet = useMemo(() => new Set(datesWithEvents), [datesWithEvents])

  const grid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
    const startWeekday = firstDayOfMonth.getDay() // 0 = Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const cells: Array<{
      iso: string
      day: number
      inCurrentMonth: boolean
    }> = []

    // Leading days from previous month
    for (let i = startWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      const m = viewMonth === 0 ? 11 : viewMonth - 1
      const y = viewMonth === 0 ? viewYear - 1 : viewYear
      cells.push({ iso: toIso(y, m, day), day, inCurrentMonth: false })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ iso: toIso(viewYear, viewMonth, d), day: d, inCurrentMonth: true })
    }

    // Trailing days to fill 6 rows
    while (cells.length < 42) {
      const last = cells[cells.length - 1]
      const lastParsed = parseIso(last.iso)
      const nextDay = last.day + 1
      const daysInThisMonth = new Date(lastParsed.year, lastParsed.month + 1, 0).getDate()
      if (nextDay > daysInThisMonth) {
        const nm = lastParsed.month === 11 ? 0 : lastParsed.month + 1
        const ny = lastParsed.month === 11 ? lastParsed.year + 1 : lastParsed.year
        cells.push({ iso: toIso(ny, nm, 1), day: 1, inCurrentMonth: false })
      } else {
        cells.push({
          iso: toIso(lastParsed.year, lastParsed.month, nextDay),
          day: nextDay,
          inCurrentMonth: false,
        })
      }
    }

    return cells
  }, [viewMonth, viewYear])

  function goPrev() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  function goNext() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div className="select-none">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {MONTH_NAMES[viewMonth].charAt(0).toUpperCase() + MONTH_NAMES[viewMonth].slice(1)}{' '}
          <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {viewYear}
          </span>
        </h3>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Mês anterior"
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próximo mês"
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 px-0.5">
        {WEEKDAY_HEADERS.map((label, i) => (
          <div
            key={i}
            className="text-center font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="mt-1 grid grid-cols-7 gap-0.5 px-0.5">
        {grid.map((cell) => {
          const isSelected = cell.iso === selectedDate
          const isToday = cell.iso === todayDate
          const hasEvents = eventDateSet.has(cell.iso)

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onDateClick?.(cell.iso)}
              className={`
                relative aspect-square flex items-center justify-center
                rounded-full font-mono text-[11px] tabular-nums transition-all
                ${
                  isSelected
                    ? 'bg-teal-600 text-white font-semibold shadow-sm'
                    : isToday
                    ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-300 dark:bg-teal-900/40 dark:text-teal-200 dark:ring-teal-700'
                    : cell.inCurrentMonth
                    ? 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    : 'text-slate-300 hover:bg-slate-50 dark:text-slate-600 dark:hover:bg-slate-800/50'
                }
              `}
              aria-label={cell.iso}
              aria-selected={isSelected}
            >
              {cell.day}
              {hasEvents && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-teal-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
