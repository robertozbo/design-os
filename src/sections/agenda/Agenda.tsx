import { useState } from 'react'
import data from '@/../product/sections/agenda/data.json'
import type {
  AgendaProps,
  AgendaViewId,
  AnchorRect,
  CalendarEvent,
  CreateSlot,
  HeaderState,
  NymosEvent,
  PopoverMode,
} from '@/../product/sections/agenda/types'
import { Agenda as AgendaView } from './components/Agenda'
import { EventPopover } from './components/EventPopover'

const MONTH_ABBR = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
]

const MONTH_FULL = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

const WEEKDAY_FULL = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
]

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function toIso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function fromIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Sunday-start week containing the given ISO date. */
function computeWeekStart(iso: string) {
  const d = fromIso(iso)
  d.setDate(d.getDate() - d.getDay())
  return toIso(d)
}

function addDays(iso: string, n: number) {
  const d = fromIso(iso)
  d.setDate(d.getDate() + n)
  return toIso(d)
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

function minutesToTime(min: number) {
  return `${pad2(Math.floor(min / 60))}:${pad2(min % 60)}`
}

function computeWeekPeriodLabel(weekStart: string) {
  const start = fromIso(weekStart)
  const end = fromIso(addDays(weekStart, 6))
  const sd = start.getDate()
  const sm = MONTH_ABBR[start.getMonth()]
  const ed = end.getDate()
  const em = MONTH_ABBR[end.getMonth()]
  return start.getMonth() === end.getMonth()
    ? `Semana de ${sd} — ${ed} ${em}`
    : `Semana de ${sd} ${sm} — ${ed} ${em}`
}

function computeDayPeriodLabel(iso: string) {
  const d = fromIso(iso)
  return `${WEEKDAY_FULL[d.getDay()]}, ${d.getDate()} de ${MONTH_FULL[d.getMonth()]}`
}

function computeMonthPeriodLabel(iso: string) {
  const d = fromIso(iso)
  const m = MONTH_FULL[d.getMonth()]
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${d.getFullYear()}`
}

function addMonths(iso: string, n: number) {
  const d = fromIso(iso)
  const targetMonth = d.getMonth() + n
  const year = d.getFullYear() + Math.floor(targetMonth / 12)
  const monthIdx = ((targetMonth % 12) + 12) % 12
  // Clamp the day to the last day of the new month
  const lastDay = new Date(year, monthIdx + 1, 0).getDate()
  const day = Math.min(d.getDate(), lastDay)
  return toIso(new Date(year, monthIdx, day))
}

export default function AgendaPreview() {
  const baseProps = data as unknown as AgendaProps

  const [activeView, setActiveView] = useState<AgendaViewId>(baseProps.headerState.activeView)
  const [selectedFilterType, setSelectedFilterType] = useState(
    baseProps.headerState.selectedFilterType,
  )
  const [selectedFilterStatus, setSelectedFilterStatus] = useState(
    baseProps.headerState.selectedFilterStatus,
  )
  const [showUnavailable, setShowUnavailable] = useState(
    baseProps.headerState.showUnavailableSlots,
  )
  const [currentDate, setCurrentDate] = useState(baseProps.headerState.currentDate)
  const [weekStart, setWeekStart] = useState(baseProps.headerState.weekStart)
  const [events, setEvents] = useState<CalendarEvent[]>(baseProps.events)

  function updateEvent(eventId: string, patch: Partial<NymosEvent>) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId && e.source === 'nymos' ? { ...e, ...patch } : e,
      ),
    )
  }

  function handleEventDrop(eventId: string, newDate: string, newStartTime: string) {
    const ev = events.find((e) => e.id === eventId)
    if (!ev || ev.source !== 'nymos') return
    const endTime = minutesToTime(timeToMinutes(newStartTime) + ev.durationMin)
    updateEvent(eventId, { date: newDate, startTime: newStartTime, endTime })
  }

  function handleEventResize(eventId: string, newDurationMin: number) {
    const ev = events.find((e) => e.id === eventId)
    if (!ev || ev.source !== 'nymos') return
    const endTime = minutesToTime(timeToMinutes(ev.startTime) + newDurationMin)
    updateEvent(eventId, { durationMin: newDurationMin, endTime })
  }

  function handleConfirm(eventId: string) {
    updateEvent(eventId, { status: 'confirmada' })
  }

  function handleCancel(eventId: string) {
    updateEvent(eventId, { status: 'cancelada' })
  }

  function handleDuplicate(eventId: string) {
    setEvents((prev) => {
      const ev = prev.find((e) => e.id === eventId)
      if (!ev || ev.source !== 'nymos') return prev
      const startMin = timeToMinutes(ev.startTime) + ev.durationMin
      const newStart = minutesToTime(Math.min(20 * 60 - ev.durationMin, startMin))
      const newEnd = minutesToTime(timeToMinutes(newStart) + ev.durationMin)
      const dup: NymosEvent = {
        ...ev,
        id: `${ev.id}_copy_${Date.now()}`,
        startTime: newStart,
        endTime: newEnd,
        status: 'pendente',
        hasConflict: false,
        conflictWith: undefined,
      }
      return [...prev, dup]
    })
  }

  function handleDateChange(iso: string) {
    setCurrentDate(iso)
    setWeekStart(computeWeekStart(iso))
  }

  function handleNavigate(direction: 'prev' | 'next' | 'today') {
    if (direction === 'today') {
      const today = baseProps.headerState.currentDate
      setCurrentDate(today)
      setWeekStart(computeWeekStart(today))
      return
    }
    const sign = direction === 'next' ? 1 : -1
    let next: string
    if (activeView === 'dia') {
      next = addDays(currentDate, sign * 1)
    } else if (activeView === 'mes') {
      next = addMonths(currentDate, sign * 1)
    } else {
      next = addDays(weekStart, sign * 7)
    }
    setCurrentDate(next)
    setWeekStart(computeWeekStart(next))
  }

  // Popover state
  const [popoverMode, setPopoverMode] = useState<PopoverMode>('closed')
  const [popoverAnchor, setPopoverAnchor] = useState<AnchorRect | null>(null)
  const [popoverEvent, setPopoverEvent] = useState<NymosEvent | null>(null)
  const [popoverPrefill, setPopoverPrefill] = useState<CreateSlot | null>(null)

  function openCreatePopover(slot: CreateSlot, anchor: AnchorRect) {
    setPopoverPrefill(slot)
    setPopoverEvent(null)
    setPopoverAnchor(anchor)
    setPopoverMode('create')
  }

  function openViewPopover(eventId: string, anchor: AnchorRect) {
    const ev = events.find((e) => e.id === eventId)
    if (!ev || ev.source !== 'nymos') return
    setPopoverEvent(ev as NymosEvent)
    setPopoverPrefill(null)
    setPopoverAnchor(anchor)
    setPopoverMode('view')
  }

  function closePopover() {
    setPopoverMode('closed')
  }

  function openCreateCenter() {
    // Anchor in the middle of the viewport
    const w = window.innerWidth
    const h = window.innerHeight
    setPopoverPrefill({
      date: baseProps.headerState.currentDate,
      startTime: '09:00',
    })
    setPopoverEvent(null)
    setPopoverAnchor({
      top: h / 2 - 200,
      left: w / 2 - 100,
      bottom: h / 2 - 200,
      right: w / 2 + 100,
      width: 200,
      height: 0,
    })
    setPopoverMode('create')
  }

  const periodLabel =
    activeView === 'dia'
      ? computeDayPeriodLabel(currentDate)
      : activeView === 'mes'
      ? computeMonthPeriodLabel(currentDate)
      : computeWeekPeriodLabel(weekStart)

  const liveHeader: HeaderState = {
    ...baseProps.headerState,
    activeView,
    selectedFilterType,
    selectedFilterStatus,
    showUnavailableSlots: showUnavailable,
    currentDate,
    weekStart,
    weekEnd: addDays(weekStart, 6),
    periodLabel,
  }

  const liveProps: AgendaProps = {
    ...baseProps,
    headerState: liveHeader,
    events,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-agenda],
        [data-nymos-agenda] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-agenda] .font-mono,
        [data-nymos-agenda] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <AgendaView
        {...liveProps}
        onViewChange={setActiveView}
        onNavigate={handleNavigate}
        onDateChange={handleDateChange}
        onFilterTypeChange={setSelectedFilterType}
        onFilterStatusChange={setSelectedFilterStatus}
        onToggleUnavailable={setShowUnavailable}
        onForceSync={() => console.log('force sync')}
        onReconnectGoogle={() => console.log('reconnect google')}
        onOpenCreate={openCreateCenter}
        onEventClick={openViewPopover}
        onSlotClick={openCreatePopover}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onConfirmAppointment={handleConfirm}
        onCancelAppointment={handleCancel}
        onDuplicateAppointment={handleDuplicate}
        onCopyTeleconsultaLink={(id) => console.log('copy link', id)}
        onStartAtendimento={(id) => console.log('start atendimento', id)}
      />

      {/* Floating popover (Google Calendar style) */}
      <EventPopover
        mode={popoverMode}
        anchor={popoverAnchor}
        event={popoverEvent}
        prefillDate={popoverPrefill?.date}
        prefillStartTime={popoverPrefill?.startTime}
        patients={baseProps.patients}
        servicos={baseProps.servicos}
        durationOptions={baseProps.newAppointmentDefaults.durationOptions}
        defaultDuration={baseProps.newAppointmentDefaults.defaultDuration}
        attendanceOptions={baseProps.newAppointmentDefaults.attendanceTypeOptions}
        onClose={closePopover}
        onSave={(d) => {
          console.log('save event', d)
          closePopover()
        }}
        onMaisOpcoes={() => console.log('open advanced edit')}
        onConfirm={(id) => {
          handleConfirm(id)
          closePopover()
        }}
        onCancel={(id) => {
          handleCancel(id)
          closePopover()
        }}
        onDuplicate={(id) => {
          handleDuplicate(id)
          closePopover()
        }}
        onCopyTeleconsultaLink={(id) => console.log('copy link', id)}
        onStartAtendimento={(id) => {
          console.log('start atendimento', id)
          closePopover()
        }}
      />
    </>
  )
}
