import { AlertTriangle, Home, MapPin, MoreHorizontal, Video } from 'lucide-react'
import type {
  AnchorRect,
  AttendanceType,
  CalendarEvent,
  NymosEvent,
} from '@/../product/sections/agenda/types'

interface EventCardProps {
  event: CalendarEvent
  topPx: number
  heightPx: number
  isGhost?: boolean
  onClick?: (anchor: AnchorRect) => void
  /** Pointer-down on the card body — parent decides drag vs click. */
  onBodyPointerDown?: (e: React.PointerEvent<HTMLElement>, event: NymosEvent) => void
  /** Pointer-down on the bottom resize handle. */
  onResizePointerDown?: (e: React.PointerEvent<HTMLElement>, event: NymosEvent) => void
  /** Click on the "…" kebab → open menu anchored to the kebab. */
  onMenuClick?: (event: NymosEvent, anchor: AnchorRect) => void
}

function rectFromEl(el: HTMLElement): AnchorRect {
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, bottom: r.bottom, right: r.right, width: r.width, height: r.height }
}

const ATTENDANCE_CONFIG: Record<
  AttendanceType,
  { Icon: typeof MapPin; bgLight: string; bgDark: string; textLight: string; textDark: string; border: string; label: string }
> = {
  presencial: {
    Icon: MapPin,
    bgLight: 'bg-teal-100',
    bgDark: 'dark:bg-teal-900/40',
    textLight: 'text-teal-900',
    textDark: 'dark:text-teal-100',
    border: 'border-l-teal-500',
    label: 'Presencial',
  },
  teleconsulta: {
    Icon: Video,
    bgLight: 'bg-emerald-100',
    bgDark: 'dark:bg-emerald-900/40',
    textLight: 'text-emerald-900',
    textDark: 'dark:text-emerald-100',
    border: 'border-l-emerald-500',
    label: 'Teleconsulta',
  },
  domicilio: {
    Icon: Home,
    bgLight: 'bg-orange-100',
    bgDark: 'dark:bg-orange-900/40',
    textLight: 'text-orange-900',
    textDark: 'dark:text-orange-100',
    border: 'border-l-orange-500',
    label: 'Domicílio',
  },
}

export function EventCard(props: EventCardProps) {
  if (props.event.source === 'google') {
    return <GoogleEventCard {...(props as EventCardProps & { event: Extract<CalendarEvent, { source: 'google' }> })} />
  }
  return <NymosEventCard {...(props as EventCardProps & { event: NymosEvent })} />
}

function NymosEventCard({
  event,
  topPx,
  heightPx,
  isGhost,
  onClick,
  onBodyPointerDown,
  onResizePointerDown,
  onMenuClick,
}: EventCardProps & { event: NymosEvent }) {
  const cfg = ATTENDANCE_CONFIG[event.attendanceType]
  const Icon = cfg.Icon

  const isPendente = event.status === 'pendente'
  const isCancelada = event.status === 'cancelada'
  const isRealizada = event.status === 'realizada'
  const isCompact = heightPx < 50

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if (isGhost) return
        onClick?.(rectFromEl(e.currentTarget))
      }}
      onPointerDown={(e) => {
        if (isGhost) return
        // Don't start drag on kebab/resize handle
        const target = e.target as HTMLElement
        if (target.closest('[data-event-kebab]') || target.closest('[data-event-resize]')) return
        if (e.button !== 0) return
        onBodyPointerDown?.(e, event)
      }}
      style={{
        top: `${topPx}px`,
        height: `${Math.max(heightPx - 2, 22)}px`,
        touchAction: 'none',
      }}
      className={`
        group absolute left-0.5 right-0.5 z-10
        flex flex-col items-stretch overflow-hidden
        rounded-md border-l-2 px-1.5 py-1 text-left
        cursor-grab active:cursor-grabbing select-none
        transition-shadow hover:z-20 hover:shadow-md
        ${cfg.bgLight} ${cfg.bgDark} ${cfg.textLight} ${cfg.textDark} ${cfg.border}
        ${isPendente ? 'border-dashed border border-l-2' : ''}
        ${isCancelada ? 'opacity-50 line-through' : ''}
        ${isRealizada ? 'opacity-60' : ''}
        ${event.hasConflict ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-slate-950' : ''}
        ${isGhost ? 'pointer-events-none opacity-70 ring-2 ring-teal-500/70 shadow-lg' : ''}
      `}
    >
      <div className="flex items-center gap-1 text-[10px] font-mono tabular-nums opacity-80">
        <span>{event.startTime}</span>
        {!isCompact && <Icon size={9} className="opacity-70" />}
        {event.hasConflict && <AlertTriangle size={9} className="ml-auto text-amber-600 dark:text-amber-400" />}

        {/* Kebab "…" — hover only, top-right */}
        {!isGhost && !isCancelada && (
          <button
            type="button"
            data-event-kebab
            onClick={(e) => {
              e.stopPropagation()
              onMenuClick?.(event, rectFromEl(e.currentTarget))
            }}
            className={`
              ${event.hasConflict ? '' : 'ml-auto'}
              -mr-0.5 rounded p-0.5
              opacity-0 group-hover:opacity-100 focus:opacity-100
              hover:bg-black/10 dark:hover:bg-white/10
              transition-opacity
            `}
            aria-label="Mais ações"
          >
            <MoreHorizontal size={11} />
          </button>
        )}
      </div>
      <p className="mt-0.5 truncate text-[11px] font-semibold leading-tight">
        {event.patientName}
      </p>
      {!isCompact && heightPx >= 56 && (
        <p className="mt-0.5 truncate text-[10px] opacity-70">{event.servicoName}</p>
      )}

      {/* Resize handle — bottom strip, hover-visible */}
      {!isGhost && !isCancelada && (
        <div
          data-event-resize
          onPointerDown={(e) => {
            e.stopPropagation()
            if (e.button !== 0) return
            onResizePointerDown?.(e, event)
          }}
          style={{ touchAction: 'none' }}
          className="
            absolute inset-x-1.5 bottom-0 h-1.5
            cursor-ns-resize
            opacity-0 group-hover:opacity-100
            transition-opacity
          "
          aria-label="Redimensionar"
        >
          <div className="mx-auto h-0.5 w-6 rounded-full bg-current opacity-50" />
        </div>
      )}
    </div>
  )
}

function GoogleEventCard({
  event,
  topPx,
  heightPx,
  isGhost,
  onClick,
}: EventCardProps & { event: Extract<CalendarEvent, { source: 'google' }> }) {
  return (
    <button
      type="button"
      onClick={(e) => onClick?.(rectFromEl(e.currentTarget))}
      style={{ top: `${topPx}px`, height: `${Math.max(heightPx - 2, 22)}px` }}
      className={`
        group absolute left-0.5 right-0.5 z-10 flex flex-col items-stretch overflow-hidden rounded-md border border-dashed border-slate-400 bg-slate-100/80 px-1.5 py-1 text-left text-slate-700 transition-all hover:z-20 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800
        ${isGhost ? 'pointer-events-none opacity-70' : ''}
      `}
    >
      <div className="flex items-center gap-1 text-[10px] font-mono tabular-nums opacity-70">
        <span>{event.startTime}</span>
        <span className="ml-auto rounded bg-slate-200 px-1 text-[8px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          G
        </span>
      </div>
      <p className="mt-0.5 truncate text-[11px] font-medium leading-tight">{event.title}</p>
    </button>
  )
}
