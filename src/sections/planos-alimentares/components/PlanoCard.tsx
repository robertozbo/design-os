import { Calendar, Flame, Star, TrendingDown, TrendingUp } from 'lucide-react'
import type {
  ObjetivoOption,
  PatientLite,
  PlanoStatus,
  PlanoSummary,
} from '@/../product/sections/planos-alimentares/types'
import { Avatar } from './Avatar'
import { ObjetivoBadge } from './ObjetivoBadge'

interface PlanoCardProps {
  plano: PlanoSummary
  patient: PatientLite | undefined
  objetivoOptions: ObjetivoOption[]
  onClick?: () => void
  onToggleFavorite?: () => void
}

const STATUS_CONFIG: Record<
  PlanoStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
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

function formatRelative(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `há ${diffDays}d`
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)}sem`
  return `há ${Math.floor(diffDays / 30)}m`
}

export function PlanoCard({
  plano,
  patient,
  objetivoOptions,
  onClick,
  onToggleFavorite,
}: PlanoCardProps) {
  const cfg = STATUS_CONFIG[plano.status]
  const isArchived = plano.status === 'arquivado'

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={`
        group relative flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5
        transition-all hover:-translate-y-0.5 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900
        ${isArchived ? 'opacity-70' : ''}
      `}
    >
      {/* Top-right cluster: favorite + status */}
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          aria-label={plano.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="rounded-full p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Star
            size={14}
            className={
              plano.isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500'
            }
          />
        </button>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Patient row */}
      <div className="flex items-center gap-3 pr-28">
        {patient ? (
          <Avatar initials={patient.avatarInitials} color={patient.avatarColor} />
        ) : (
          <span className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {patient?.name ?? 'Paciente desconhecido'}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Editado {formatRelative(plano.lastEditedAt)}
          </p>
        </div>
      </div>

      {/* Plan name + objetivo */}
      <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">
        {plano.name}
      </h3>
      {plano.objetivo && (
        <div className="mt-1.5">
          <ObjetivoBadge objetivo={plano.objetivo} options={objetivoOptions} />
        </div>
      )}

      {/* Metadata row */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        {(plano.startDate || plano.endDate) && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            <span className="font-mono tabular-nums">
              {formatDate(plano.startDate)}
              {plano.endDate ? ` → ${formatDate(plano.endDate)}` : ' → vigente'}
            </span>
          </span>
        )}
        {plano.targets && (
          <span className="inline-flex items-center gap-1">
            <Flame size={11} className="text-orange-500" />
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
              {plano.targets.kcal}
            </span>
            <span className="text-slate-400 dark:text-slate-500">kcal/dia</span>
          </span>
        )}
      </div>

      {/* Adherence (only for vigente) */}
      {plano.status === 'vigente' && plano.adherenceLast7d !== null && (
        <footer className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Adesão (7d)
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span
                className={`font-mono text-2xl font-semibold tabular-nums ${
                  plano.adherenceLast7d >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : plano.adherenceLast7d >= 60
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {plano.adherenceLast7d}%
              </span>
              {plano.adherenceLast7d >= 80 ? (
                <TrendingUp size={12} className="text-emerald-500" />
              ) : plano.adherenceLast7d < 60 ? (
                <TrendingDown size={12} className="text-rose-500" />
              ) : null}
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="flex-1 max-w-[120px]">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${
                  plano.adherenceLast7d >= 80
                    ? 'bg-emerald-500'
                    : plano.adherenceLast7d >= 60
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${plano.adherenceLast7d}%` }}
              />
            </div>
          </div>
        </footer>
      )}

      {/* Empty rascunho indicator */}
      {plano.status === 'rascunho' && plano.totalKcal === 0 && (
        <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] italic text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Vazio — nenhuma refeição cadastrada ainda
        </p>
      )}
    </article>
  )
}
