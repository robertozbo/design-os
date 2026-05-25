import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CheckCircle2,
  Copy,
  Link2,
  Play,
  XCircle,
} from 'lucide-react'
import type {
  AnchorRect,
  NymosEvent,
} from '@/../product/sections/agenda/types'

interface EventMenuProps {
  event: NymosEvent | null
  anchor: AnchorRect | null
  onClose: () => void
  onConfirm?: (id: string) => void
  onCancel?: (id: string) => void
  onDuplicate?: (id: string) => void
  onCopyTeleconsultaLink?: (id: string) => void
  onStartAtendimento?: (id: string) => void
}

const MENU_WIDTH = 220

export function EventMenu({
  event,
  anchor,
  onClose,
  onConfirm,
  onCancel,
  onDuplicate,
  onCopyTeleconsultaLink,
  onStartAtendimento,
}: EventMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!event) return

    function handlePointer(e: PointerEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) onClose()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointer, true)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer, true)
      document.removeEventListener('keydown', handleKey)
    }
  }, [event, onClose])

  // Initial position guess; refined after mount via useLayoutEffect
  const [pos, setPos] = useState<{ top: number; left: number; opacity: number }>(() => ({
    top: anchor ? anchor.bottom + 4 : 0,
    left: anchor ? Math.max(12, anchor.right - MENU_WIDTH) : 0,
    opacity: 0,
  }))

  useLayoutEffect(() => {
    if (!event || !anchor || !ref.current) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const margin = 12
    const gap = 4
    const menuRect = ref.current.getBoundingClientRect()
    const w = menuRect.width
    const h = menuRect.height

    // Vertical: prefer below kebab; flip up if overflow
    let top = anchor.bottom + gap
    if (top + h > vh - margin) {
      const flipped = anchor.top - gap - h
      top = flipped >= margin ? flipped : Math.max(margin, vh - margin - h)
    }

    // Horizontal: align menu's right with kebab's right
    let left = anchor.right - w
    if (left < margin) left = margin
    if (left + w > vw - margin) left = vw - margin - w

    setPos({ top, left, opacity: 1 })
  }, [event, anchor])

  if (!event || !anchor) return null
  if (typeof document === 'undefined') return null

  const isPendente = event.status === 'pendente'
  const isCancelada = event.status === 'cancelada'
  const isTeleconsulta = event.attendanceType === 'teleconsulta'

  return createPortal(
    <div
      ref={ref}
      role="menu"
      style={{ top: pos.top, left: pos.left, width: MENU_WIDTH, opacity: pos.opacity }}
      className="
        fixed z-50 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl
        transition-opacity
        dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40
      "
    >
      {isPendente && (
        <MenuItem
          icon={<CheckCircle2 size={14} />}
          label="Confirmar"
          onClick={() => {
            onConfirm?.(event.id)
            onClose()
          }}
        />
      )}

      <MenuItem
        icon={<Play size={14} />}
        label="Iniciar atendimento"
        onClick={() => {
          onStartAtendimento?.(event.id)
          onClose()
        }}
      />

      {isTeleconsulta && (
        <MenuItem
          icon={<Link2 size={14} />}
          label="Copiar link teleconsulta"
          onClick={() => {
            onCopyTeleconsultaLink?.(event.id)
            onClose()
          }}
        />
      )}

      <MenuItem
        icon={<Copy size={14} />}
        label="Duplicar"
        onClick={() => {
          onDuplicate?.(event.id)
          onClose()
        }}
      />

      {!isCancelada && (
        <>
          <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
          <MenuItem
            icon={<XCircle size={14} />}
            label="Cancelar"
            danger
            onClick={() => {
              onCancel?.(event.id)
              onClose()
            }}
          />
        </>
      )}
    </div>,
    document.body,
  )
}

function MenuItem({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className={`
        flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors
        ${
          danger
            ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
        }
      `}
    >
      <span className={danger ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}>
        {icon}
      </span>
      {label}
    </button>
  )
}
