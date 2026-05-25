import { useEffect, useRef, useState } from 'react'
import {
  Archive,
  ArrowLeft,
  Calendar,
  Copy,
  MoreHorizontal,
  Star,
  Trash2,
} from 'lucide-react'
import type {
  Objetivo,
  ObjetivoOption,
  PatientLite,
  PlanoFull,
  PlanoStatus,
} from '@/../product/sections/planos-alimentares/types'
import { Avatar } from './Avatar'
import { ObjetivoPicker } from './ObjetivoPicker'

interface BuilderHeaderProps {
  plano: PlanoFull
  patient: PatientLite | undefined
  objetivoOptions: ObjetivoOption[]
  onChangeName: (name: string) => void
  onChangeObjetivo: (next: Objetivo | null) => void
  onToggleFavorite?: () => void
  onBack?: () => void
  onDuplicate?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

const STATUS_CONFIG: Record<PlanoStatus, { label: string; bg: string; text: string; dot: string }> = {
  vigente: {
    label: 'Vigente',
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  rascunho: {
    label: 'Rascunho',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  encerrado: {
    label: 'Encerrado',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  arquivado: {
    label: 'Arquivado',
    bg: 'bg-slate-50 dark:bg-slate-900/40',
    text: 'text-slate-500 dark:text-slate-500',
    dot: 'bg-slate-300 dark:bg-slate-700',
  },
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  const day = d.getDate().toString().padStart(2, '0')
  const month = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][d.getMonth()]
  return `${day} ${month}`
}

export function BuilderHeader({
  plano,
  patient,
  objetivoOptions,
  onChangeName,
  onChangeObjetivo,
  onToggleFavorite,
  onBack,
  onDuplicate,
  onArchive,
  onDelete,
}: BuilderHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handlePointer(e: PointerEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer, true)
    return () => document.removeEventListener('pointerdown', handlePointer, true)
  }, [menuOpen])

  const cfg = STATUS_CONFIG[plano.status]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600
            transition-colors hover:bg-slate-100 hover:text-slate-900
            dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50
          "
        >
          <ArrowLeft size={15} />
          Voltar
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Plan name (editable) */}
        <input
          type="text"
          value={plano.name}
          onChange={(e) => onChangeName(e.target.value)}
          className="
            min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1
            text-base font-semibold text-slate-900
            transition-colors hover:bg-slate-50 focus:border-slate-300 focus:bg-white focus:outline-none
            dark:text-slate-50 dark:hover:bg-slate-800/50 dark:focus:border-slate-600 dark:focus:bg-slate-900
            sm:text-lg
          "
          aria-label="Nome do plano"
        />

        {/* Patient + status + objetivo + dates */}
        <div className="flex flex-wrap items-center gap-3">
          {patient && (
            <div className="flex items-center gap-2">
              <Avatar initials={patient.avatarInitials} color={patient.avatarColor} size="sm" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {patient.name}
              </span>
            </div>
          )}

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>

          <ObjetivoPicker
            value={plano.objetivo}
            options={objetivoOptions}
            onChange={onChangeObjetivo}
          />

          {(plano.startDate || plano.endDate) && (
            <span className="hidden items-center gap-1 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400 md:inline-flex">
              <Calendar size={11} />
              {formatDate(plano.startDate)} → {plano.endDate ? formatDate(plano.endDate) : 'vigente'}
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={plano.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Star
            size={15}
            className={
              plano.isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-400 dark:text-slate-500'
            }
          />
        </button>

        {/* Kebab menu */}
        <div ref={wrapRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`
              rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
              ${menuOpen ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : ''}
            `}
            aria-label="Mais ações"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-40 mt-1 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <MenuItem
                icon={<Copy size={13} />}
                label="Duplicar para outro paciente"
                onClick={() => {
                  setMenuOpen(false)
                  onDuplicate?.()
                }}
              />
              <MenuItem
                icon={<Archive size={13} />}
                label="Arquivar plano"
                onClick={() => {
                  setMenuOpen(false)
                  onArchive?.()
                }}
              />
              <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
              <MenuItem
                icon={<Trash2 size={13} />}
                label="Excluir plano"
                danger
                onClick={() => {
                  setMenuOpen(false)
                  onDelete?.()
                }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
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
