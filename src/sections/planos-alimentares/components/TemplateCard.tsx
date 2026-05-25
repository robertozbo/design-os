import { ArrowRight, Flame, Star, Users } from 'lucide-react'
import type {
  ObjetivoOption,
  TemplateSummary,
} from '@/../product/sections/planos-alimentares/types'
import { ObjetivoBadge } from './ObjetivoBadge'

interface TemplateCardProps {
  template: TemplateSummary
  objetivoOptions: ObjetivoOption[]
  onClick?: () => void
  onApply?: () => void
  onToggleFavorite?: () => void
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
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)}m`
  return `há ${Math.floor(diffDays / 365)}a`
}

export function TemplateCard({
  template,
  objetivoOptions,
  onClick,
  onApply,
  onToggleFavorite,
}: TemplateCardProps) {
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
      className="
        group relative flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5
        transition-all hover:-translate-y-0.5 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900
      "
    >
      {/* Favorite top-right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite?.()
        }}
        aria-label={template.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className="absolute right-3 top-3 rounded-full p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Star
          size={14}
          className={
            template.isFavorite
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500'
          }
        />
      </button>

      {/* Name + objetivo */}
      <header className="pr-10">
        <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-50">
          {template.name}
        </h3>
        {template.objetivo && (
          <div className="mt-1.5">
            <ObjetivoBadge objetivo={template.objetivo} options={objetivoOptions} />
          </div>
        )}
      </header>

      {/* Description */}
      {template.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {template.description}
        </p>
      )}

      {/* Stats row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
        {template.targets && (
          <span className="inline-flex items-center gap-1">
            <Flame size={11} className="text-orange-500" />
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
              {template.targets.kcal}
            </span>
            <span>kcal/dia</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <Users size={11} />
          <span className="font-mono tabular-nums">{template.applicationsCount}</span>
          {' '}aplicações
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
          Editado {formatRelative(template.lastEditedAt)}
        </span>
      </div>

      {/* Apply CTA */}
      <footer className="mt-auto flex items-center justify-end pt-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onApply?.()
          }}
          className="
            inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800
            transition-all hover:-translate-y-0.5 hover:bg-teal-100 hover:shadow-sm
            dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200 dark:hover:bg-teal-900/50
          "
        >
          Aplicar em paciente
          <ArrowRight size={12} />
        </button>
      </footer>
    </article>
  )
}
