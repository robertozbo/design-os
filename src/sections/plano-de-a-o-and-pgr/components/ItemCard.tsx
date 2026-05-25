import type {
  PlanoAcaoItem,
  Prioridade,
  StatusItem,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import {
  Calendar,
  Paperclip,
  AlertTriangle,
  ExternalLink,
  GripVertical,
  UserCircle2,
  Building,
} from 'lucide-react'

interface ItemCardProps {
  item: PlanoAcaoItem
  hoje: Date
  revealIndex?: number
  onSelect?: () => void
  onChangeStatus?: (newStatus: StatusItem) => void
  onNavigateToAvaliacao?: () => void
}

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

function daysBetween(a: Date, b: Date): number {
  const dayMs = 1000 * 60 * 60 * 24
  return Math.ceil((b.getTime() - a.getTime()) / dayMs)
}

const PRIORIDADE_TONE: Record<Prioridade, { label: string; pill: string; dot: string }> = {
  alta: {
    label: 'Alta',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    dot: 'bg-rose-500',
  },
  media: {
    label: 'Média',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    dot: 'bg-amber-500',
  },
  baixa: {
    label: 'Baixa',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
}

function avatarInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function ItemCard({
  item,
  hoje,
  revealIndex = 0,
  onSelect,
  onNavigateToAvaliacao,
}: ItemCardProps) {
  const prioridade = PRIORIDADE_TONE[item.prioridade]
  const prazoDate = new Date(item.prazo + 'T12:00:00')
  const diasRestantes = daysBetween(hoje, prazoDate)
  const isVencido = item.status !== 'concluido' && diasRestantes < 0
  const isProximo = item.status !== 'concluido' && diasRestantes >= 0 && diasRestantes <= 7

  const prazoTone = isVencido
    ? 'text-rose-700 dark:text-rose-300 font-semibold'
    : isProximo
      ? 'text-amber-700 dark:text-amber-300 font-semibold'
      : 'text-slate-600 dark:text-slate-400'

  const ringByPriority =
    item.prioridade === 'alta' && item.status !== 'concluido'
      ? 'ring-rose-200/40 dark:ring-rose-900/30'
      : ''

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
      className={`
        nymos-reveal opacity-0
        group relative cursor-pointer
        rounded-xl bg-white/95 dark:bg-slate-900/80
        ring-1 ring-slate-200/80 dark:ring-slate-800
        ${ringByPriority}
        hover:ring-teal-300 dark:hover:ring-teal-700
        hover:shadow-[0_4px_16px_-8px_rgba(15,118,110,0.2)]
        dark:hover:shadow-[0_4px_16px_-8px_rgba(20,184,166,0.3)]
        transition-all duration-200
        p-3.5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
      `}
    >
      <span
        className="
          absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition
          text-slate-300 dark:text-slate-600
        "
        title="Arrastar"
        aria-hidden="true"
      >
        <GripVertical className="w-3.5 h-3.5" strokeWidth={1.75} />
      </span>

      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${prioridade.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${prioridade.dot}`} />
          {prioridade.label}
        </span>
        {item.origem.tipo === 'matriz' && item.origem.classificacaoRisco === 'critico' && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200/60 dark:ring-rose-900/50 text-[10px] font-medium text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-2.5 h-2.5" strokeWidth={2} />
            Crítico
          </span>
        )}
        {!item.responsavel && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200/60 dark:ring-amber-900/50 text-[10px] font-medium text-amber-700 dark:text-amber-300">
            <UserCircle2 className="w-2.5 h-2.5" strokeWidth={2} />
            Sem resp.
          </span>
        )}
      </div>

      <h3 className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 line-clamp-2 leading-snug">
        {item.titulo}
      </h3>

      {item.origem.tipo === 'matriz' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigateToAvaliacao?.()
          }}
          className="
            mt-2 inline-flex items-center gap-1 max-w-full
            text-[11px] text-slate-500 dark:text-slate-400
            hover:text-teal-700 dark:hover:text-teal-300 transition
          "
        >
          <Building className="w-3 h-3 text-slate-400 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{item.origem.setorNome}</span>
          <span className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
          <span className="font-mono text-[10px] tracking-wide shrink-0">
            {item.origem.instrumentoSigla}
          </span>
          <span className="text-slate-300 dark:text-slate-700 shrink-0">·</span>
          <span className="truncate">{item.origem.fatorNome}</span>
          <ExternalLink className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600 shrink-0" strokeWidth={1.75} />
        </button>
      )}
      {item.origem.tipo === 'livre' && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center justify-center px-1 py-px rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-mono">
            LIVRE
          </span>
          <span className="truncate">{item.origem.perigoNome}</span>
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          {item.responsavel ? (
            <>
              <span
                className={`
                  inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-mono font-semibold shrink-0
                  ${
                    item.responsavel.papel === 'sst'
                      ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                      : 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300'
                  }
                `}
                title={item.responsavel.nome}
              >
                {avatarInitials(item.responsavel.nome)}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                {item.responsavel.nome.split(' ')[0]}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-amber-700 dark:text-amber-300 inline-flex items-center gap-1">
              <UserCircle2 className="w-3 h-3" strokeWidth={1.75} />
              Atribuir
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.evidencias.length > 0 && (
            <span
              className="inline-flex items-center gap-0.5 text-[11px] text-slate-500 dark:text-slate-500"
              title={`${item.evidencias.length} evidências`}
            >
              <Paperclip className="w-3 h-3" strokeWidth={1.75} />
              <span className="tabular-nums">{item.evidencias.length}</span>
            </span>
          )}
          <span className={`inline-flex items-center gap-1 text-[11px] tabular-nums ${prazoTone}`}>
            <Calendar className="w-3 h-3" strokeWidth={1.75} />
            {item.status === 'concluido' && item.concluidoEm
              ? `✓ ${formatDate(item.concluidoEm)}`
              : isVencido
                ? `${Math.abs(diasRestantes)}d atrás`
                : isProximo
                  ? `${diasRestantes}d`
                  : formatDate(item.prazo)}
          </span>
        </div>
      </div>
    </div>
  )
}
