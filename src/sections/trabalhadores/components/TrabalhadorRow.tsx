import type {
  EstabelecimentoLite,
  SetorLite,
  StatusCampanha,
  StatusVinculoNymos,
  Trabalhador,
} from '@/../product/sections/trabalhadores/types'
import {
  ChevronRight,
  Pencil,
  Archive,
  Accessibility,
  Sparkles,
  MailWarning,
  UserMinus,
  CheckCircle2,
  Hourglass,
  CircleDashed,
} from 'lucide-react'
import { IdiomaBadge } from './IdiomaBadge'

interface TrabalhadorRowProps {
  trabalhador: Trabalhador
  estabelecimento: EstabelecimentoLite | null
  setor: SetorLite | null
  revealIndex?: number
  onSelect?: () => void
  onEdit?: () => void
  onArchive?: () => void
  onInviteNymos?: () => void
  onSelectSetor?: () => void
}

const STATUS_CAMPANHA: Record<
  StatusCampanha,
  { label: string; pill: string; dot: string; icon: React.ReactNode }
> = {
  elegivel: {
    label: 'Elegível',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    dot: 'bg-emerald-500',
    icon: <CheckCircle2 className="w-3 h-3" strokeWidth={2} />,
  },
  inativo: {
    label: 'Inativo',
    pill: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200/60 dark:ring-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
    icon: <CircleDashed className="w-3 h-3" strokeWidth={2} />,
  },
  sem_canal_contato: {
    label: 'Sem canal de contato',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    dot: 'bg-amber-500',
    icon: <MailWarning className="w-3 h-3" strokeWidth={2} />,
  },
  opt_out_ciclo: {
    label: 'Opt-out do ciclo',
    pill: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-slate-200/60 dark:ring-slate-700',
    dot: 'bg-slate-500',
    icon: <CircleDashed className="w-3 h-3" strokeWidth={2} />,
  },
}

const STATUS_NYMOS: Record<
  StatusVinculoNymos,
  { label: string; pill: string; icon: React.ReactNode }
> = {
  ativo: {
    label: 'Nymos ativo',
    pill: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 ring-violet-200/60 dark:ring-violet-900/50',
    icon: <Sparkles className="w-3 h-3" strokeWidth={2} />,
  },
  convidado: {
    label: 'Convite enviado',
    pill: 'bg-violet-50/60 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400/90 ring-violet-200/40 dark:ring-violet-900/30',
    icon: <Hourglass className="w-3 h-3" strokeWidth={2} />,
  },
  sem_vinculo: {
    label: 'Sem Nymos',
    pill: 'bg-slate-100 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400 ring-slate-200/40 dark:ring-slate-700/60',
    icon: <UserMinus className="w-3 h-3" strokeWidth={2} />,
  },
}

function avatarInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return (first + last).toUpperCase()
}

export function TrabalhadorRow({
  trabalhador,
  estabelecimento,
  setor,
  revealIndex = 0,
  onSelect,
  onEdit,
  onArchive,
  onInviteNymos,
  onSelectSetor,
}: TrabalhadorRowProps) {
  const statusCamp = STATUS_CAMPANHA[trabalhador.statusCampanha]
  const statusNymos = STATUS_NYMOS[trabalhador.vinculoNymos.status]
  const hasAcess = trabalhador.acessibilidade.length > 0

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
        <span
          className={`
            inline-flex items-center justify-center w-10 h-10 rounded-xl
            text-[12px] font-mono font-semibold shrink-0
            ${
              trabalhador.vinculoNymos.status === 'ativo'
                ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/60 dark:ring-violet-900/60'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200/60 dark:ring-slate-700'
            }
          `}
        >
          {avatarInitials(trabalhador.nome)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 truncate">
              {trabalhador.nome}
            </h3>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {trabalhador.matricula}
            </span>
            <span
              className={`
                inline-flex items-center px-1.5 py-px rounded-md ring-1 text-[10px] font-medium
                ${
                  trabalhador.regime === 'CLT'
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700'
                    : 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60'
                }
              `}
            >
              {trabalhador.regime === 'CLT' ? 'CLT' : 'Estatutário'}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-slate-600 dark:text-slate-400 truncate">
            {trabalhador.cargo}
          </p>
          {setor && estabelecimento && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelectSetor?.()
              }}
              className="
                mt-1.5 inline-flex items-center gap-1.5 max-w-full
                text-[11px] text-slate-500 dark:text-slate-400
                hover:text-teal-700 dark:hover:text-teal-300 transition
              "
            >
              <span className="truncate">{estabelecimento.nome}</span>
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" strokeWidth={1.75} />
              <span className="font-medium truncate">{setor.nome}</span>
              <span className="font-mono text-slate-400 dark:text-slate-500 shrink-0">
                · {setor.codigo}
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <IdiomaBadge idioma={trabalhador.idiomaPreferido} />
            {hasAcess && (
              <span
                title={trabalhador.acessibilidade.join(' · ')}
                className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/60 dark:ring-violet-900/60"
              >
                <Accessibility className="w-3 h-3" strokeWidth={1.75} />
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${statusCamp.pill}`}
            >
              {statusCamp.icon}
              {statusCamp.label}
            </span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ring-1 text-[10px] font-medium ${statusNymos.pill}`}
          >
            {statusNymos.icon}
            {statusNymos.label}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {trabalhador.vinculoNymos.status === 'sem_vinculo' &&
            trabalhador.emailCorporativo !== '' && (
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  onInviteNymos?.()
                }}
                label="Convidar para Nymos"
                icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />}
                tone="violet"
              />
            )}
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

function ActionButton({
  onClick,
  label,
  icon,
  tone = 'slate',
}: {
  onClick: (e: React.MouseEvent) => void
  label: string
  icon: React.ReactNode
  tone?: 'slate' | 'violet'
}) {
  const tones = {
    slate:
      'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
    violet:
      'text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/40',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`
        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
        inline-flex items-center justify-center
        w-7 h-7 rounded-lg
        transition
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
        ${tones[tone]}
      `}
    >
      {icon}
    </button>
  )
}

