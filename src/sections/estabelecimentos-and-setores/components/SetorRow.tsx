import type {
  ClassificacaoRisco,
  Setor,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import {
  ChevronRight,
  Users2,
  Pencil,
  Archive,
  AlertCircle,
  ListChecks,
  UserCircle2,
} from 'lucide-react'

interface SetorRowProps {
  setor: Setor
  revealIndex?: number
  onSelect?: () => void
  onEdit?: () => void
  onArchive?: () => void
}

const NUM = new Intl.NumberFormat('pt-BR')

const RISCO_TONE: Record<
  ClassificacaoRisco,
  { label: string; pill: string; dot: string }
> = {
  baixo: {
    label: 'baixo',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    dot: 'bg-emerald-500',
  },
  moderado: {
    label: 'moderado',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    dot: 'bg-amber-500',
  },
  critico: {
    label: 'crítico',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    dot: 'bg-rose-500',
  },
  prioritario: {
    label: 'prioritário',
    pill: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 ring-rose-300/70 dark:ring-rose-900/70',
    dot: 'bg-rose-600',
  },
}

function avatarInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function SetorRow({
  setor,
  revealIndex = 0,
  onSelect,
  onEdit,
  onArchive,
}: SetorRowProps) {
  const { gestor, agrupamentoPgr, tamanho, riscoPsicossocial } = setor
  const tone = RISCO_TONE[riscoPsicossocial.classificacao]

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
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className="
        nymos-reveal opacity-0
        group cursor-pointer
        rounded-xl bg-white/95 dark:bg-slate-900/60
        ring-1 ring-slate-200/70 dark:ring-slate-800
        hover:ring-teal-300 dark:hover:ring-teal-700
        hover:shadow-[0_4px_16px_-8px_rgba(15,118,110,0.2)]
        dark:hover:shadow-[0_4px_16px_-8px_rgba(20,184,166,0.3)]
        transition-all duration-200
        px-4 py-3
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
      "
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate">
              {setor.nome}
            </h3>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {setor.codigo}
            </span>
          </div>

          {gestor ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-[9px] font-mono font-semibold text-violet-700 dark:text-violet-300">
                {avatarInitials(gestor.nome)}
              </span>
              <span className="text-[12px] text-slate-700 dark:text-slate-200 font-medium">
                {gestor.nome}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                · {gestor.cargo}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mb-2 text-[11px] text-amber-700 dark:text-amber-300">
              <UserCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
              Sem gestor vinculado
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            <Chip>{agrupamentoPgr.ghe}</Chip>
            <Chip>{agrupamentoPgr.ambiente}</Chip>
            <Chip mono>{agrupamentoPgr.centroCusto}</Chip>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[12px] text-slate-600 dark:text-slate-400">
            <Users2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
            <span className="tabular-nums">{NUM.format(tamanho.trabalhadores)}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium ${tone.pill}`}
            title={`${riscoPsicossocial.instrumento} · score ${riscoPsicossocial.scoreMedio}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
            <span className="font-mono tabular-nums">{riscoPsicossocial.scoreMedio}</span>
            <span>· {tone.label}</span>
          </span>
          {riscoPsicossocial.acoesAbertas > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
              {riscoPsicossocial.acoesAbertas >= 3 ? (
                <AlertCircle className="w-3 h-3 text-rose-500" strokeWidth={2} />
              ) : (
                <ListChecks className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
              )}
              <span className="tabular-nums">{riscoPsicossocial.acoesAbertas}</span> em ação
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
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
          <ChevronRight
            className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all duration-200 ml-0.5"
            strokeWidth={1.75}
          />
        </div>
      </div>
    </div>
  )
}

function Chip({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <span
      className={`
        inline-flex items-center px-1.5 py-0.5 rounded-md
        bg-slate-100 dark:bg-slate-800/70
        ring-1 ring-slate-200/70 dark:ring-slate-700
        text-[10px] text-slate-600 dark:text-slate-400
        ${mono ? 'font-mono' : 'font-medium'}
      `}
    >
      {children}
    </span>
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
        inline-flex items-center justify-center
        w-7 h-7 rounded-lg
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
