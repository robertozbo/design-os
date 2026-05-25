import { useEffect, useRef, useState } from 'react'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  Home,
  MapPin,
  MoreHorizontal,
  Sparkles,
  Trash2,
  User,
  Video,
  X,
} from 'lucide-react'
import type {
  AnchorRect,
  AttendanceType,
  CalendarEvent,
  NymosEvent,
  PatientLite,
  PopoverMode,
  Servico,
} from '@/../product/sections/agenda/types'
import { Avatar } from '@/sections/pacientes/components/Avatar'

interface EventPopoverProps {
  mode: PopoverMode
  anchor: AnchorRect | null
  // for view mode
  event: NymosEvent | null
  // for create mode
  prefillDate?: string
  prefillStartTime?: string
  patients: PatientLite[]
  servicos: Servico[]
  durationOptions: number[]
  defaultDuration: number
  attendanceOptions: Array<{ id: AttendanceType; label: string }>
  onClose?: () => void
  onSave?: (data: {
    patientId: string
    servicoId: string
    attendanceType: AttendanceType
    date: string
    startTime: string
    durationMin: number
    notes: string
  }) => void
  onMaisOpcoes?: () => void
  onConfirm?: (eventId: string) => void
  onCancel?: (eventId: string) => void
  onDuplicate?: (eventId: string) => void
  onCopyTeleconsultaLink?: (eventId: string) => void
  onStartAtendimento?: (eventId: string) => void
}

const ATTENDANCE_ICON: Record<AttendanceType, typeof MapPin> = {
  presencial: MapPin,
  teleconsulta: Video,
  domicilio: Home,
}

const ATTENDANCE_LABEL: Record<AttendanceType, string> = {
  presencial: 'Presencial',
  teleconsulta: 'Teleconsulta',
  domicilio: 'Domicílio',
}

const STATUS_TONE: Record<NymosEvent['status'], string> = {
  confirmada: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  pendente: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  realizada: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  cancelada: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
}

const STATUS_LABEL: Record<NymosEvent['status'], string> = {
  confirmada: 'Confirmada',
  pendente: 'Pendente',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
}

const POPOVER_WIDTH = 380

export function EventPopover(props: EventPopoverProps) {
  const { mode, anchor, onClose } = props
  const popoverRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  // Compute position
  useEffect(() => {
    if (mode === 'closed' || !anchor) {
      setPosition(null)
      return
    }
    const margin = 8
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight
    const popH = popoverRef.current?.offsetHeight ?? 480

    // Try right of anchor
    let left = anchor.right + margin
    let top = anchor.top

    // If overflows right, place to left
    if (left + POPOVER_WIDTH > viewportW - 16) {
      left = anchor.left - POPOVER_WIDTH - margin
    }
    // If still off-screen left, center it
    if (left < 16) {
      left = Math.max(16, (viewportW - POPOVER_WIDTH) / 2)
    }
    // Adjust vertical
    if (top + popH > viewportH - 16) {
      top = Math.max(16, viewportH - popH - 16)
    }
    if (top < 16) top = 16

    setPosition({ top, left })
  }, [mode, anchor])

  // Close on Escape
  useEffect(() => {
    if (mode === 'closed') return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [mode, onClose])

  if (mode === 'closed') return null

  return (
    <>
      {/* Light overlay just to capture outside clicks; no backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        ref={popoverRef}
        style={{
          top: position?.top ?? -9999,
          left: position?.left ?? -9999,
          width: POPOVER_WIDTH,
        }}
        className="fixed z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/20 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/60"
        role="dialog"
        aria-modal="false"
      >
        {mode === 'view' && props.event && <ViewMode {...props} event={props.event} />}
        {mode === 'create' && <CreateMode {...props} />}
      </div>
    </>
  )
}

// ===== View mode =====

function ViewMode({
  event,
  onClose,
  onMaisOpcoes,
  onConfirm,
  onCancel,
  onDuplicate,
  onCopyTeleconsultaLink,
  onStartAtendimento,
}: EventPopoverProps & { event: NymosEvent }) {
  const AttIcon = ATTENDANCE_ICON[event.attendanceType]

  return (
    <>
      <header className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_TONE[event.status]}`}
          >
            {STATUS_LABEL[event.status]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Mais opções" onClick={() => onMaisOpcoes?.()}>
            <MoreHorizontal size={14} />
          </IconBtn>
          <IconBtn label="Fechar" onClick={onClose}>
            <X size={14} />
          </IconBtn>
        </div>
      </header>

      <div className="space-y-3 px-4 py-4">
        {/* Patient */}
        <div className="flex items-center gap-3">
          <Avatar name={event.patientName} imageUrl={event.patientAvatarUrl} size="md" />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
              {event.patientName}
            </p>
            {event.isFirstVisit && (
              <span className="inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                1ª consulta
              </span>
            )}
          </div>
        </div>

        {/* Date / time */}
        <Row icon={<Clock size={14} />}>
          <span className="text-sm text-slate-900 dark:text-slate-100">
            {formatDate(event.date)} · {event.startTime}–{event.endTime}
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
              ({event.durationMin}min)
            </span>
          </span>
        </Row>

        {/* Service */}
        <Row icon={<Briefcase size={14} />}>
          <span className="text-sm text-slate-700 dark:text-slate-200">{event.servicoName}</span>
        </Row>

        {/* Attendance type */}
        <Row icon={<AttIcon size={14} />}>
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {ATTENDANCE_LABEL[event.attendanceType]}
          </span>
          {event.teleconsultaUrl && (
            <button
              type="button"
              onClick={() => onCopyTeleconsultaLink?.(event.id)}
              className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
            >
              <Copy size={11} />
              Copiar link
            </button>
          )}
        </Row>

        {/* Notes */}
        {event.notes && (
          <Row icon={<Edit3 size={14} />}>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {event.notes}
            </p>
          </Row>
        )}
      </div>

      {/* Actions footer */}
      <footer className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
        {event.status === 'pendente' && (
          <button
            type="button"
            onClick={() => onConfirm?.(event.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 size={12} />
            Confirmar
          </button>
        )}
        <button
          type="button"
          onClick={() => onStartAtendimento?.(event.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
        >
          <Sparkles size={12} />
          Iniciar atendimento
        </button>
        <button
          type="button"
          onClick={() => onDuplicate?.(event.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Copy size={12} />
          Duplicar
        </button>
        <button
          type="button"
          onClick={() => onCancel?.(event.id)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-white px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:bg-slate-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
        >
          <Trash2 size={12} />
          Cancelar
        </button>
      </footer>
    </>
  )
}

// ===== Create mode =====

function CreateMode({
  prefillDate = '',
  prefillStartTime = '',
  patients,
  servicos,
  durationOptions,
  defaultDuration,
  attendanceOptions,
  onClose,
  onSave,
  onMaisOpcoes,
}: EventPopoverProps) {
  const [patientId, setPatientId] = useState('')
  const [servicoId, setServicoId] = useState('')
  const [attendanceType, setAttendanceType] = useState<AttendanceType>('presencial')
  const [duration, setDuration] = useState(defaultDuration)
  const [notes, setNotes] = useState('')

  // When servico changes, default attendance type from servico
  function handleServicoChange(id: string) {
    setServicoId(id)
    const s = servicos.find((x) => x.id === id)
    if (s) {
      setAttendanceType(s.defaultAttendanceType)
      setDuration(s.defaultDurationMin)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!patientId || !servicoId) return
    onSave?.({
      patientId,
      servicoId,
      attendanceType,
      date: prefillDate,
      startTime: prefillStartTime,
      durationMin: duration,
      notes: notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="flex items-start justify-between gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Nova consulta
        </h2>
        <IconBtn label="Fechar" onClick={onClose}>
          <X size={14} />
        </IconBtn>
      </header>

      <div className="space-y-3 px-4 py-4">
        {/* Date / time (read-only chip) */}
        <Row icon={<Clock size={14} />} alignTop>
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm text-slate-700 dark:text-slate-200">
              {formatDate(prefillDate)}
            </span>
            <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
              {prefillStartTime} → {addMinutes(prefillStartTime ?? '00:00', duration)}
              <span className="ml-2 text-slate-400 dark:text-slate-500">
                ({duration}min)
              </span>
            </span>
          </div>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="self-start rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {durationOptions.map((d) => (
              <option key={d} value={d}>
                {d}min
              </option>
            ))}
          </select>
        </Row>

        {/* Patient */}
        <Row icon={<User size={14} />}>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Escolha um paciente…</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.linkedToApp ? '· vinculado' : ''}
              </option>
            ))}
          </select>
        </Row>

        {/* Servico */}
        <Row icon={<Briefcase size={14} />}>
          <select
            value={servicoId}
            onChange={(e) => handleServicoChange(e.target.value)}
            required
            className="flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-teal-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Escolha um serviço…</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · R$ {s.price}
              </option>
            ))}
          </select>
        </Row>

        {/* Attendance type radio */}
        <Row icon={<MapPin size={14} />}>
          <div className="flex items-center gap-1">
            {attendanceOptions.map((opt) => {
              const Icon = ATTENDANCE_ICON[opt.id]
              const active = opt.id === attendanceType
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAttendanceType(opt.id)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={11} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </Row>

        {/* Notes */}
        <Row icon={<Edit3 size={14} />} alignTop>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações (opcional)…"
            rows={2}
            className="flex-1 resize-none rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </Row>
      </div>

      <footer className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40">
        <button
          type="button"
          onClick={onMaisOpcoes}
          className="text-xs font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Mais opções
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!patientId || !servicoId}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
          >
            Salvar
          </button>
        </div>
      </footer>
    </form>
  )
}

// ===== Helpers =====

function Row({
  icon,
  alignTop,
  children,
}: {
  icon: React.ReactNode
  alignTop?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`flex gap-3 ${alignTop ? 'items-start' : 'items-center'}`}>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 dark:text-slate-500 ${
          alignTop ? 'mt-1' : ''
        }`}
      >
        {icon}
      </span>
      <div className="flex flex-1 items-center gap-2">{children}</div>
    </div>
  )
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
    >
      {children}
    </button>
  )
}

function formatDate(iso: string) {
  if (!iso) return ''
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  } catch {
    return iso
  }
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const hh = Math.floor((total / 60) % 24)
  const mm = total % 60
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`
}
