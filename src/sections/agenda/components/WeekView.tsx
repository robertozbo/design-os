import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  AnchorRect,
  AvailabilitySlot,
  BlockedSlot,
  CalendarEvent,
  CreateSlot,
  NymosEvent,
  Weekday,
} from '@/../product/sections/agenda/types'
import { EventCard } from './EventCard'
import { EventMenu } from './EventMenu'

interface WeekViewProps {
  /** 'dia' renders a single column for currentDate; 'semana' renders 7 columns from weekStart. */
  viewMode?: 'dia' | 'semana'
  weekStart: string
  events: CalendarEvent[]
  availabilitySlots: AvailabilitySlot[]
  blockedSlots: BlockedSlot[]
  showUnavailable: boolean
  currentTimeIndicator: string
  currentDate: string
  onEventClick?: (eventId: string, anchor: AnchorRect) => void
  onSlotClick?: (slot: CreateSlot, anchor: AnchorRect) => void
  onEventDrop?: (eventId: string, newDate: string, newStartTime: string) => void
  onEventResize?: (eventId: string, newDurationMin: number) => void
  onConfirmAppointment?: (eventId: string) => void
  onCancelAppointment?: (eventId: string) => void
  onDuplicateAppointment?: (eventId: string) => void
  onCopyTeleconsultaLink?: (eventId: string) => void
  onStartAtendimento?: (eventId: string) => void
}

function rectFromEl(el: HTMLElement): AnchorRect {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, bottom: r.bottom, right: r.right, width: r.width, height: r.height }
}

const DAY_LABELS: Record<Weekday, { short: string; long: string }> = {
  segunda: { short: 'Seg', long: 'Segunda' },
  terca: { short: 'Ter', long: 'Terça' },
  quarta: { short: 'Qua', long: 'Quarta' },
  quinta: { short: 'Qui', long: 'Quinta' },
  sexta: { short: 'Sex', long: 'Sexta' },
  sabado: { short: 'Sáb', long: 'Sábado' },
  domingo: { short: 'Dom', long: 'Domingo' },
}

const HOUR_HEIGHT = 56 // px per hour
const START_HOUR = 7
const END_HOUR = 20
const HOURS_VISIBLE = END_HOUR - START_HOUR
const SNAP_MIN = 15
const DRAG_THRESHOLD_PX = 4

const WEEKDAYS_ORDER: Weekday[] = [
  'segunda',
  'terca',
  'quarta',
  'quinta',
  'sexta',
  'sabado',
  'domingo',
]

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function dayNumber(isoDate: string): number {
  return new Date(isoDate + 'T00:00:00').getDate()
}

function weekdayFromIso(isoDate: string): Weekday {
  const dow = new Date(isoDate + 'T00:00:00').getDay() // 0=Sun
  // Map JS Sunday-start to our Weekday enum
  const map: Weekday[] = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
  return map[dow]
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${pad(h)}:${pad(m)}`
}

function timeToTopPx(t: string): number {
  const minutes = timeToMinutes(t)
  const fromStart = minutes - START_HOUR * 60
  return (fromStart / 60) * HOUR_HEIGHT
}

function durationToHeightPx(durationMin: number): number {
  return (durationMin / 60) * HOUR_HEIGHT
}

function snap(min: number, step = SNAP_MIN) {
  return Math.round(min / step) * step
}

// === Drag state ===

type DragState =
  | {
      kind: 'move'
      eventId: string
      original: NymosEvent
      startX: number
      startY: number
      // y-offset in px from card top to where the user grabbed (so ghost stays aligned)
      grabOffsetPx: number
      exceeded: boolean
      ghostDate: string
      ghostStartTime: string
    }
  | {
      kind: 'resize'
      eventId: string
      original: NymosEvent
      startY: number
      exceeded: boolean
      ghostDurationMin: number
    }

export function WeekView({
  viewMode = 'semana',
  weekStart,
  events,
  availabilitySlots,
  blockedSlots,
  showUnavailable,
  currentTimeIndicator,
  currentDate,
  onEventClick,
  onSlotClick,
  onEventDrop,
  onEventResize,
  onConfirmAppointment,
  onCancelAppointment,
  onDuplicateAppointment,
  onCopyTeleconsultaLink,
  onStartAtendimento,
}: WeekViewProps) {
  const days = useMemo(() => {
    if (viewMode === 'dia') {
      return [
        {
          weekday: weekdayFromIso(currentDate),
          isoDate: currentDate,
          dayNumber: dayNumber(currentDate),
          isToday: true,
        },
      ]
    }
    return WEEKDAYS_ORDER.map((weekday, i) => {
      const isoDate = addDays(weekStart, i)
      return {
        weekday,
        isoDate,
        dayNumber: dayNumber(isoDate),
        isToday: isoDate === currentDate,
      }
    })
  }, [viewMode, weekStart, currentDate])

  const colCount = days.length
  const gridCols = `72px repeat(${colCount}, minmax(0, 1fr))`

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    for (const e of events) {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    }
    return map
  }, [events])

  const todayIndex = days.findIndex((d) => d.isToday)
  const currentMinutes = timeToMinutes(currentTimeIndicator)
  const currentTimeWithinView =
    currentMinutes >= START_HOUR * 60 && currentMinutes <= END_HOUR * 60
  const currentTimeTop = timeToTopPx(currentTimeIndicator)

  // === Refs / state for drag + menu ===

  const dayColRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const registerDayRef = useCallback((iso: string, el: HTMLDivElement | null) => {
    if (el) dayColRefs.current.set(iso, el)
    else dayColRefs.current.delete(iso)
  }, [])

  const [dragState, setDragState] = useState<DragState | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  dragStateRef.current = dragState
  const suppressClickRef = useRef(false)

  const [menuState, setMenuState] = useState<{ event: NymosEvent; anchor: AnchorRect } | null>(null)

  function handleBodyPointerDown(e: React.PointerEvent<HTMLElement>, ev: NymosEvent) {
    if (ev.status === 'cancelada' || ev.status === 'realizada') return
    const cardRect = e.currentTarget.getBoundingClientRect()
    const grabOffsetPx = e.clientY - cardRect.top
    setDragState({
      kind: 'move',
      eventId: ev.id,
      original: ev,
      startX: e.clientX,
      startY: e.clientY,
      grabOffsetPx,
      exceeded: false,
      ghostDate: ev.date,
      ghostStartTime: ev.startTime,
    })
  }

  function handleResizePointerDown(e: React.PointerEvent<HTMLElement>, ev: NymosEvent) {
    if (ev.status === 'cancelada' || ev.status === 'realizada') return
    setDragState({
      kind: 'resize',
      eventId: ev.id,
      original: ev,
      startY: e.clientY,
      exceeded: false,
      ghostDurationMin: ev.durationMin,
    })
  }

  // Compute new ghost from pointer position
  const computeMoveGhost = useCallback(
    (clientX: number, clientY: number, grabOffsetPx: number, original: NymosEvent) => {
      // Find which day column the X falls into
      let foundDate = original.date
      for (const [iso, el] of dayColRefs.current.entries()) {
        const r = el.getBoundingClientRect()
        if (clientX >= r.left && clientX < r.right) {
          foundDate = iso
          break
        }
      }
      const colEl = dayColRefs.current.get(foundDate)
      if (!colEl) return { ghostDate: foundDate, ghostStartTime: original.startTime }

      const colRect = colEl.getBoundingClientRect()
      // Card top relative to column top, in px
      const cardTopPx = clientY - grabOffsetPx - colRect.top
      // Convert to minutes from START_HOUR
      const minutesFromStart = (cardTopPx / HOUR_HEIGHT) * 60
      let newStartMin = START_HOUR * 60 + minutesFromStart
      newStartMin = snap(newStartMin)
      // Clamp so event fits within visible range
      const minStart = START_HOUR * 60
      const maxStart = END_HOUR * 60 - original.durationMin
      newStartMin = Math.max(minStart, Math.min(maxStart, newStartMin))
      return { ghostDate: foundDate, ghostStartTime: minutesToTime(newStartMin) }
    },
    [],
  )

  const computeResizeGhost = useCallback((clientY: number, startY: number, original: NymosEvent) => {
    const deltaPx = clientY - startY
    const deltaMin = (deltaPx / HOUR_HEIGHT) * 60
    let newDuration = snap(original.durationMin + deltaMin)
    // Floor 15min
    newDuration = Math.max(SNAP_MIN, newDuration)
    // Ceil so we don't extend past END_HOUR
    const startMin = timeToMinutes(original.startTime)
    const maxDur = END_HOUR * 60 - startMin
    newDuration = Math.min(maxDur, newDuration)
    return newDuration
  }, [])

  // Document-level pointermove / pointerup
  useEffect(() => {
    if (!dragState) return

    function onMove(e: PointerEvent) {
      const s = dragStateRef.current
      if (!s) return
      e.preventDefault()

      if (s.kind === 'move') {
        const dx = e.clientX - s.startX
        const dy = e.clientY - s.startY
        const exceeded = s.exceeded || Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX
        const { ghostDate, ghostStartTime } = computeMoveGhost(
          e.clientX,
          e.clientY,
          s.grabOffsetPx,
          s.original,
        )
        setDragState({ ...s, exceeded, ghostDate, ghostStartTime })
      } else {
        const dy = e.clientY - s.startY
        const exceeded = s.exceeded || Math.abs(dy) >= DRAG_THRESHOLD_PX
        const ghostDurationMin = computeResizeGhost(e.clientY, s.startY, s.original)
        setDragState({ ...s, exceeded, ghostDurationMin })
      }
    }

    function onUp() {
      const s = dragStateRef.current
      setDragState(null)
      if (!s) return
      if (!s.exceeded) return // it was just a click — let the native click fire
      suppressClickRef.current = true
      if (s.kind === 'move') {
        if (s.ghostDate !== s.original.date || s.ghostStartTime !== s.original.startTime) {
          onEventDrop?.(s.eventId, s.ghostDate, s.ghostStartTime)
        }
      } else {
        if (s.ghostDurationMin !== s.original.durationMin) {
          onEventResize?.(s.eventId, s.ghostDurationMin)
        }
      }
    }

    document.addEventListener('pointermove', onMove, { passive: false })
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }
  }, [dragState !== null, computeMoveGhost, computeResizeGhost, onEventDrop, onEventResize])

  function wrappedEventClick(eventId: string, anchor: AnchorRect) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    onEventClick?.(eventId, anchor)
  }

  // Build ghost props (rendered as overlay in target column)
  const ghostInfo = useMemo(() => {
    if (!dragState || !dragState.exceeded) return null
    if (dragState.kind === 'move') {
      const ghostEvent: NymosEvent = {
        ...dragState.original,
        date: dragState.ghostDate,
        startTime: dragState.ghostStartTime,
        endTime: minutesToTime(
          timeToMinutes(dragState.ghostStartTime) + dragState.original.durationMin,
        ),
      }
      return {
        date: dragState.ghostDate,
        event: ghostEvent,
        topPx: timeToTopPx(dragState.ghostStartTime),
        heightPx: durationToHeightPx(dragState.original.durationMin),
      }
    }
    // resize ghost stays in the same column
    const ghostEvent: NymosEvent = {
      ...dragState.original,
      durationMin: dragState.ghostDurationMin,
      endTime: minutesToTime(
        timeToMinutes(dragState.original.startTime) + dragState.ghostDurationMin,
      ),
    }
    return {
      date: dragState.original.date,
      event: ghostEvent,
      topPx: timeToTopPx(dragState.original.startTime),
      heightPx: durationToHeightPx(dragState.ghostDurationMin),
    }
  }, [dragState])

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Day headers */}
      <div
        style={{ gridTemplateColumns: gridCols }}
        className="grid border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/40"
      >
        <div className="flex items-end justify-end pb-2 pr-3">
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            GMT-3
          </span>
        </div>
        {days.map((d) => (
          <div
            key={d.isoDate}
            className={`flex flex-col items-center justify-center gap-0.5 border-l border-slate-200 py-3 dark:border-slate-800`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {DAY_LABELS[d.weekday].short}
            </span>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-sm font-semibold tabular-nums ${
                d.isToday
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {d.dayNumber}
            </span>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div
        className="relative grid"
        style={{
          gridTemplateColumns: gridCols,
          height: HOURS_VISIBLE * HOUR_HEIGHT,
        }}
      >
        {/* Hours column */}
        <div className="relative border-r border-slate-200 dark:border-slate-800">
          {Array.from({ length: HOURS_VISIBLE }).map((_, i) => {
            const hour = START_HOUR + i + 1
            return (
              <div
                key={hour}
                style={{ top: (i + 1) * HOUR_HEIGHT }}
                className="absolute right-3 -translate-y-1/2 bg-white px-1 font-mono text-[10px] tabular-nums text-slate-400 dark:bg-slate-900 dark:text-slate-500"
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            )
          })}
        </div>

        {/* Day columns */}
        {days.map((d) => (
          <DayColumn
            key={d.isoDate}
            day={d}
            registerRef={registerDayRef}
            events={eventsByDay[d.isoDate] ?? []}
            availabilitySlots={availabilitySlots.filter((a) => a.weekday === d.weekday)}
            blockedSlots={blockedSlots.filter((b) => b.date === d.isoDate)}
            showUnavailable={showUnavailable}
            hideEventId={dragState?.kind === 'move' && dragState.exceeded ? dragState.eventId : undefined}
            ghost={ghostInfo && ghostInfo.date === d.isoDate ? ghostInfo : null}
            onEventClick={wrappedEventClick}
            onSlotClick={onSlotClick}
            onEventBodyPointerDown={handleBodyPointerDown}
            onEventResizePointerDown={handleResizePointerDown}
            onEventMenuClick={(ev, anchor) => setMenuState({ event: ev, anchor })}
          />
        ))}

        {/* Current time line */}
        {currentTimeWithinView && todayIndex >= 0 && (
          <div
            className="pointer-events-none absolute z-30 flex items-center"
            style={{
              top: currentTimeTop - 1,
              left: `calc(72px + ${todayIndex} * ((100% - 72px) / ${colCount}))`,
              width: `calc((100% - 72px) / ${colCount})`,
            }}
          >
            <span className="h-2.5 w-2.5 -ml-1 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            <div className="h-px flex-1 bg-rose-500" />
          </div>
        )}

        {/* Live duration indicator during resize */}
        {dragState?.kind === 'resize' && dragState.exceeded && (
          <DurationBadge
            startTime={dragState.original.startTime}
            durationMin={dragState.ghostDurationMin}
          />
        )}
      </div>

      <EventMenu
        event={menuState?.event ?? null}
        anchor={menuState?.anchor ?? null}
        onClose={() => setMenuState(null)}
        onConfirm={onConfirmAppointment}
        onCancel={onCancelAppointment}
        onDuplicate={onDuplicateAppointment}
        onCopyTeleconsultaLink={onCopyTeleconsultaLink}
        onStartAtendimento={onStartAtendimento}
      />
    </article>
  )
}

function DurationBadge({ startTime, durationMin }: { startTime: string; durationMin: number }) {
  const endTime = minutesToTime(timeToMinutes(startTime) + durationMin)
  const h = Math.floor(durationMin / 60)
  const m = durationMin % 60
  const label = h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m}min`
  return (
    <div className="pointer-events-none absolute right-3 top-3 z-40 rounded-md bg-slate-900 px-2 py-1 font-mono text-[10px] tabular-nums text-white shadow-lg dark:bg-slate-100 dark:text-slate-900">
      {startTime} → {endTime} · {label}
    </div>
  )
}

function DayColumn({
  day,
  registerRef,
  events,
  availabilitySlots,
  blockedSlots,
  showUnavailable,
  hideEventId,
  ghost,
  onEventClick,
  onSlotClick,
  onEventBodyPointerDown,
  onEventResizePointerDown,
  onEventMenuClick,
}: {
  day: { weekday: Weekday; isoDate: string; isToday: boolean }
  registerRef: (iso: string, el: HTMLDivElement | null) => void
  events: CalendarEvent[]
  availabilitySlots: AvailabilitySlot[]
  blockedSlots: BlockedSlot[]
  showUnavailable: boolean
  hideEventId?: string
  ghost: { event: NymosEvent; topPx: number; heightPx: number } | null
  onEventClick?: (eventId: string, anchor: AnchorRect) => void
  onSlotClick?: (slot: CreateSlot, anchor: AnchorRect) => void
  onEventBodyPointerDown: (e: React.PointerEvent<HTMLElement>, ev: NymosEvent) => void
  onEventResizePointerDown: (e: React.PointerEvent<HTMLElement>, ev: NymosEvent) => void
  onEventMenuClick: (ev: NymosEvent, anchor: AnchorRect) => void
}) {
  const availableWindows = availabilitySlots.map((a) => ({
    start: timeToMinutes(a.startTime),
    end: timeToMinutes(a.endTime),
  }))

  const blockedWindows = blockedSlots.map((b) => ({
    start: timeToMinutes(b.startTime),
    end: timeToMinutes(b.endTime),
  }))

  function isAvailable(minute: number): boolean {
    const inAvailable = availableWindows.some((w) => minute >= w.start && minute < w.end)
    if (!inAvailable) return false
    const inBlocked = blockedWindows.some((w) => minute >= w.start && minute < w.end)
    return !inBlocked
  }

  const hourCells = Array.from({ length: HOURS_VISIBLE * 2 }).map((_, i) => {
    const minutes = (START_HOUR * 60) + i * 30
    const hh = Math.floor(minutes / 60)
    const mm = minutes % 60
    const startTime = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`
    return {
      minutes,
      startTime,
      available: isAvailable(minutes),
      topPx: (i * HOUR_HEIGHT) / 2,
    }
  })

  return (
    <div
      ref={(el) => registerRef(day.isoDate, el)}
      style={{
        backgroundImage:
          'linear-gradient(to bottom, transparent calc(100% - 1px), rgb(148 163 184 / 0.18) 100%)',
        backgroundSize: `100% ${HOUR_HEIGHT}px`,
        backgroundRepeat: 'repeat-y',
      }}
      className={`relative border-l border-slate-200 dark:border-slate-800 ${
        day.isToday ? 'bg-teal-50/40 dark:bg-teal-900/15' : ''
      }`}
    >
      {/* Slot click targets (one per 30min) */}
      {hourCells.map((cell) => {
        const isClickable = cell.available
        return (
          <button
            key={cell.startTime}
            type="button"
            onClick={
              isClickable
                ? (e) =>
                    onSlotClick?.(
                      { date: day.isoDate, startTime: cell.startTime },
                      rectFromEl(e.currentTarget),
                    )
                : undefined
            }
            disabled={!isClickable}
            style={{ top: cell.topPx, height: HOUR_HEIGHT / 2 }}
            className={`absolute left-0 right-0 transition-colors ${
              isClickable
                ? 'cursor-pointer hover:bg-teal-100/40 dark:hover:bg-teal-900/20'
                : showUnavailable
                ? 'cursor-not-allowed bg-slate-50/60 dark:bg-slate-950/40'
                : 'cursor-default'
            }`}
            aria-label={isClickable ? `Criar consulta às ${cell.startTime}` : 'Indisponível'}
          />
        )
      })}

      {showUnavailable && (
        <UnavailableOverlay
          availableWindows={availableWindows}
          blockedWindows={blockedWindows}
        />
      )}

      {/* Events (skip the one being dragged) */}
      {events.map((event) => {
        if (event.id === hideEventId) return null
        return (
          <EventCard
            key={event.id}
            event={event}
            topPx={timeToTopPx(event.startTime)}
            heightPx={durationToHeightPx(event.durationMin)}
            onClick={(anchor) => onEventClick?.(event.id, anchor)}
            onBodyPointerDown={onEventBodyPointerDown}
            onResizePointerDown={onEventResizePointerDown}
            onMenuClick={onEventMenuClick}
          />
        )
      })}

      {/* Ghost preview */}
      {ghost && (
        <EventCard
          event={ghost.event}
          topPx={ghost.topPx}
          heightPx={ghost.heightPx}
          isGhost
        />
      )}
    </div>
  )
}

function UnavailableOverlay({
  availableWindows,
  blockedWindows,
}: {
  availableWindows: { start: number; end: number }[]
  blockedWindows: { start: number; end: number }[]
}) {
  const dayStart = START_HOUR * 60
  const dayEnd = END_HOUR * 60

  const segments: { start: number; end: number; reason: 'unavailable' | 'blocked' }[] = []

  const sortedAvail = [...availableWindows].sort((a, b) => a.start - b.start)
  let cursor = dayStart
  for (const w of sortedAvail) {
    if (w.start > cursor) {
      segments.push({ start: cursor, end: Math.min(w.start, dayEnd), reason: 'unavailable' })
    }
    cursor = Math.max(cursor, w.end)
  }
  if (cursor < dayEnd) {
    segments.push({ start: cursor, end: dayEnd, reason: 'unavailable' })
  }

  for (const b of blockedWindows) {
    segments.push({ start: b.start, end: b.end, reason: 'blocked' })
  }

  return (
    <>
      {segments.map((s, i) => {
        const top = ((s.start - dayStart) / 60) * HOUR_HEIGHT
        const height = ((s.end - s.start) / 60) * HOUR_HEIGHT
        return (
          <div
            key={i}
            style={{
              top,
              height,
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(148,163,184,0.12) 0 6px, transparent 6px 12px)',
            }}
            className="pointer-events-none absolute left-0 right-0"
          />
        )
      })}
    </>
  )
}
