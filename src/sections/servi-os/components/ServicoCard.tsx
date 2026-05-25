import { useEffect, useRef, useState } from 'react'
import {
  Clock,
  Copy,
  Home,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  Video,
} from 'lucide-react'
import type {
  AttendanceType,
  Servico,
  ServicoColorId,
} from '@/../product/sections/servi-os/types'

interface ServicoCardProps {
  servico: Servico
  onEdit?: () => void
  onDuplicate?: () => void
  onRequestDelete?: () => void
}

const ATTENDANCE_CONFIG: Record<
  AttendanceType,
  { Icon: typeof MapPin; label: string; bgLight: string; bgDark: string; textLight: string; textDark: string }
> = {
  presencial: {
    Icon: MapPin,
    label: 'Presencial',
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-900/30',
    textLight: 'text-teal-700',
    textDark: 'dark:text-teal-300',
  },
  teleconsulta: {
    Icon: Video,
    label: 'Teleconsulta',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-900/30',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
  },
  domicilio: {
    Icon: Home,
    label: 'Domicílio',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-900/30',
    textLight: 'text-orange-700',
    textDark: 'dark:text-orange-300',
  },
}

const COLOR_BAR: Record<ServicoColorId, string> = {
  teal: 'bg-teal-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
}

function formatPrice(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDuration(min: number) {
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}

export function ServicoCard({ servico, onEdit, onDuplicate, onRequestDelete }: ServicoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handlePointer(e: PointerEvent) {
      if (!cardRef.current) return
      if (!cardRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer, true)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer, true)
      document.removeEventListener('keydown', handleKey)
    }
  }, [menuOpen])

  const cfg = ATTENDANCE_CONFIG[servico.defaultAttendanceType]
  const Icon = cfg.Icon

  return (
    <article
      ref={cardRef}
      className="
        group relative flex h-full flex-col overflow-visible rounded-2xl border border-slate-200 bg-white
        transition-all hover:shadow-md hover:-translate-y-0.5
        dark:border-slate-800 dark:bg-slate-900
      "
    >
      {/* Top color bar */}
      <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl ${COLOR_BAR[servico.color]}`} />

      <div className="flex flex-1 flex-col p-5 pt-6">
        {/* Header row */}
        <header className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {servico.name}
            </h3>
          </div>

          {/* Kebab menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen((v) => !v)
              }}
              className={`
                rounded-lg p-1.5 text-slate-400 transition-all
                hover:bg-slate-100 hover:text-slate-700
                dark:hover:bg-slate-800 dark:hover:text-slate-200
                ${menuOpen ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : ''}
              `}
              aria-label="Mais ações"
              aria-expanded={menuOpen}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="
                  absolute right-0 top-full z-30 mt-1 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl
                  dark:border-slate-700 dark:bg-slate-900
                "
              >
                <MenuItem
                  icon={<Pencil size={14} />}
                  label="Editar"
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit?.()
                  }}
                />
                <MenuItem
                  icon={<Copy size={14} />}
                  label="Duplicar"
                  onClick={() => {
                    setMenuOpen(false)
                    onDuplicate?.()
                  }}
                />
                <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                <MenuItem
                  icon={<Trash2 size={14} />}
                  label="Excluir"
                  danger
                  onClick={() => {
                    setMenuOpen(false)
                    onRequestDelete?.()
                  }}
                />
              </div>
            )}
          </div>
        </header>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {servico.description || (
            <span className="italic text-slate-400 dark:text-slate-600">Sem descrição</span>
          )}
        </p>

        {/* Footer row: attendance badge + duration + price */}
        <footer className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`
                inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium
                ${cfg.bgLight} ${cfg.bgDark} ${cfg.textLight} ${cfg.textDark}
              `}
            >
              <Icon size={11} />
              {cfg.label}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
              <Clock size={11} />
              {formatDuration(servico.defaultDurationMin)}
            </span>
          </div>

          <div className="text-right">
            <div className="font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {formatPrice(servico.price)}
            </div>
            {servico.linkedAppointmentsCount > 0 && (
              <div className="font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {servico.linkedAppointmentsCount} agendado{servico.linkedAppointmentsCount === 1 ? '' : 's'}
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
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
      role="menuitem"
      onClick={onClick}
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
