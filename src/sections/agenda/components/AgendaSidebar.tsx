import { CalendarDays } from 'lucide-react'
import type { CalendarEvent } from '@/../product/sections/agenda/types'
import { MiniCalendar } from './MiniCalendar'

interface AgendaSidebarProps {
  selectedDate: string
  todayDate?: string
  events: CalendarEvent[]
  onDateClick?: (isoDate: string) => void
}

export function AgendaSidebar({
  selectedDate,
  todayDate,
  events,
  onDateClick,
}: AgendaSidebarProps) {
  // Build set of dates with events for indicator dots
  const datesWithEvents = Array.from(
    new Set(events.map((e) => e.date)),
  )

  return (
    <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center gap-1.5 px-1">
        <CalendarDays size={12} className="text-teal-600 dark:text-teal-400" />
        <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
          Navegar
        </h2>
      </header>

      <MiniCalendar
        selectedDate={selectedDate}
        todayDate={todayDate}
        datesWithEvents={datesWithEvents}
        onDateClick={onDateClick}
      />
    </aside>
  )
}
