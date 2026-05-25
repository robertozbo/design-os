import type {
  CategoriaPerigo,
  Perigo,
} from '@/../product/sections/cat-logos/types'
import {
  ChevronRight,
  Pencil,
  Archive,
  ShieldCheck,
  Wrench,
  Flame,
  AlertOctagon,
  TrendingUp,
  Wind,
  Users,
  Zap,
  BookOpenText,
} from 'lucide-react'

interface PerigoCardProps {
  perigo: Perigo
  revealIndex?: number
  onSelect?: () => void
  onEdit?: () => void
  onArchive?: () => void
}

const CATEGORIA_TONE: Record<
  CategoriaPerigo,
  { label: string; color: string; icon: React.ReactNode }
> = {
  sobrecarga: {
    label: 'Sobrecarga',
    color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    icon: <Flame className="w-3 h-3" strokeWidth={1.75} />,
  },
  assedio: {
    label: 'Assédio',
    color: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 ring-rose-300/60 dark:ring-rose-900/60',
    icon: <AlertOctagon className="w-3 h-3" strokeWidth={1.75} />,
  },
  autonomia: {
    label: 'Autonomia',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    icon: <Zap className="w-3 h-3" strokeWidth={1.75} />,
  },
  metas: {
    label: 'Metas',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    icon: <TrendingUp className="w-3 h-3" strokeWidth={1.75} />,
  },
  ambiente: {
    label: 'Ambiente',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-200/60 dark:ring-slate-700',
    icon: <Wind className="w-3 h-3" strokeWidth={1.75} />,
  },
  cultura: {
    label: 'Cultura',
    color: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
    icon: <Users className="w-3 h-3" strokeWidth={1.75} />,
  },
}

export function PerigoCard({
  perigo,
  revealIndex = 0,
  onSelect,
  onEdit,
  onArchive,
}: PerigoCardProps) {
  const cat = CATEGORIA_TONE[perigo.categoria]
  const isCustomizado = perigo.origem === 'customizado'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      style={{ animationDelay: `${30 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group cursor-pointer
        rounded-2xl bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        hover:border-teal-300 dark:hover:border-teal-700
        hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.25)]
        dark:hover:shadow-[0_4px_20px_-8px_rgba(20,184,166,0.35)]
        transition-all duration-200
        p-5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${cat.color}`}
            >
              {cat.icon}
              {cat.label}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {perigo.codigo}
            </span>
            {isCustomizado ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-[10px] font-medium text-amber-700 dark:text-amber-300 ring-1 ring-amber-200/60 dark:ring-amber-900/50">
                <Wrench className="w-3 h-3" strokeWidth={1.75} />
                Customizado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-medium text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200/60 dark:ring-emerald-900/50">
                <ShieldCheck className="w-3 h-3" strokeWidth={1.75} />
                Catálogo Nymos
              </span>
            )}
          </div>
          <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {perigo.nome}
          </h3>
          <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
            {perigo.descricao}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isCustomizado && (
            <>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
                label="Editar"
                icon={<Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />}
              />
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  onArchive?.()
                }}
                label="Arquivar"
                icon={<Archive className="w-3.5 h-3.5" strokeWidth={1.75} />}
              />
            </>
          )}
          <ChevronRight
            className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200 ml-0.5"
            strokeWidth={1.75}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {perigo.fatoresAssociados.slice(0, 3).map((f, idx) => (
          <span
            key={`${f.instrumentoId}-${f.fatorId}-${idx}`}
            className="
              inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md
              bg-slate-100 dark:bg-slate-800/70
              ring-1 ring-slate-200/70 dark:ring-slate-700
              text-[10px] text-slate-600 dark:text-slate-400
            "
            title={`${f.fatorNome} (${f.instrumentoId})`}
          >
            <span className="font-mono font-semibold tracking-wider text-[9px] text-slate-500 dark:text-slate-500">
              {f.instrumentoId.replace('ins-', '').toUpperCase()}
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="truncate max-w-[120px]">{f.fatorNome}</span>
          </span>
        ))}
        {perigo.fatoresAssociados.length > 3 && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] text-slate-500 dark:text-slate-500 font-mono">
            +{perigo.fatoresAssociados.length - 3}
          </span>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <BookOpenText className="w-3 h-3" strokeWidth={1.75} />
          <span className="tabular-nums">{perigo.referencias.length}</span> referências
        </span>
        <span>
          <span className="tabular-nums">{perigo.acoesSugeridas.length}</span> ações sugeridas
        </span>
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  label,
  icon,
}: {
  onClick: (e: React.MouseEvent) => void
  label: string
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="
        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
        inline-flex items-center justify-center w-7 h-7 rounded-lg
        text-slate-500 dark:text-slate-400
        hover:bg-slate-100 dark:hover:bg-slate-800
        hover:text-slate-900 dark:hover:text-slate-100
        transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
      "
    >
      {icon}
    </button>
  )
}
