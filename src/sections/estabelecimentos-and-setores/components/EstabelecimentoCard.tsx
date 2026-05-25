import type {
  ClassificacaoRisco,
  Estabelecimento,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import {
  Building,
  Building2,
  ChevronRight,
  AlertTriangle,
  MapPin,
  Layers3,
  Users2,
  Pencil,
  Archive,
  ShieldCheck,
} from 'lucide-react'

interface EstabelecimentoCardProps {
  estabelecimento: Estabelecimento
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
    label: 'Risco baixo',
    pill: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-emerald-200/60 dark:ring-emerald-900/50',
    dot: 'bg-emerald-500',
  },
  moderado: {
    label: 'Risco moderado',
    pill: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 ring-amber-200/60 dark:ring-amber-900/50',
    dot: 'bg-amber-500',
  },
  critico: {
    label: 'Risco crítico',
    pill: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-rose-200/60 dark:ring-rose-900/50',
    dot: 'bg-rose-500',
  },
  prioritario: {
    label: 'Risco prioritário',
    pill: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 ring-rose-300/70 dark:ring-rose-900/70',
    dot: 'bg-rose-600',
  },
}

export function EstabelecimentoCard({
  estabelecimento,
  revealIndex = 0,
  onSelect,
  onEdit,
  onArchive,
}: EstabelecimentoCardProps) {
  const isMatriz = estabelecimento.tipo === 'matriz'
  const { saudeNr1, estrutura, endereco } = estabelecimento
  const cobertura = saudeNr1.coberturaMedia
  const cleared = cobertura >= 0.65
  const fillTone = cleared
    ? 'from-teal-500 to-emerald-400'
    : cobertura > 0
      ? 'from-amber-500 to-amber-300'
      : 'from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700'
  const isVazio = estrutura.totalSetores === 0
  const ringTone =
    saudeNr1.alertasCriticos > 0
      ? 'ring-1 ring-rose-200/70 dark:ring-rose-900/50'
      : saudeNr1.riscoPredominante === 'critico'
        ? 'ring-1 ring-rose-200/60 dark:ring-rose-900/40'
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
      style={{ animationDelay: `${50 * revealIndex}ms` }}
      className={`
        nymos-reveal opacity-0
        group relative cursor-pointer
        rounded-2xl
        bg-white/95 dark:bg-slate-900/70
        border border-slate-200/80 dark:border-slate-800
        ${ringTone}
        hover:border-teal-300 dark:hover:border-teal-700
        hover:shadow-[0_4px_20px_-8px_rgba(15,118,110,0.25)]
        dark:hover:shadow-[0_4px_20px_-8px_rgba(20,184,166,0.35)]
        transition-all duration-200
        p-5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-px rounded-md ring-1 text-[10px] font-medium ${
                isMatriz
                  ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 ring-teal-200/60 dark:ring-teal-900/60'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 ring-slate-200 dark:ring-slate-700'
              }`}
            >
              {isMatriz ? (
                <Building2 className="w-3 h-3" strokeWidth={2} />
              ) : (
                <Building className="w-3 h-3" strokeWidth={2} />
              )}
              {isMatriz ? 'Matriz' : 'Filial'}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              eSocial · {estabelecimento.codigoEsocial}
            </span>
            {!isMatriz && estabelecimento.cnpjProprio && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {estabelecimento.cnpjProprio}
              </span>
            )}
            {saudeNr1.alertasCriticos > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200 dark:ring-rose-900/60 text-[10px] font-medium text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-3 h-3" strokeWidth={1.75} />
                {saudeNr1.alertasCriticos}{' '}
                {saudeNr1.alertasCriticos === 1 ? 'alerta' : 'alertas'}
              </span>
            )}
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-slate-50 line-clamp-1">
            {estabelecimento.nome}
          </h3>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[12px] text-slate-500 dark:text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
            <span className="line-clamp-1">
              {endereco.bairro} · {endereco.cidade} / {endereco.uf}
            </span>
          </p>
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

      <div className="mt-3 flex items-center gap-x-4 gap-y-1 flex-wrap text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Layers3 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{estrutura.totalSetores}</span> setores
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
          <span className="tabular-nums">{NUM.format(estrutura.totalTrabalhadores)}</span>{' '}
          trab.
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Cobertura NR-1
            </span>
            {saudeNr1.ultimoInstrumento ? (
              <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                {saudeNr1.ultimoInstrumento}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">—</span>
            )}
          </div>
          {saudeNr1.ultimoInstrumento ? (
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  cleared
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-amber-700 dark:text-amber-300'
                }`}
              >
                {(cobertura * 100).toFixed(0)}%
              </span>
              <div className="relative flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${fillTone}`}
                  style={{ width: `${Math.min(cobertura * 100, 100)}%` }}
                />
                <div
                  className="absolute top-[-1px] bottom-[-1px] w-px bg-slate-300 dark:bg-slate-600"
                  style={{ left: '65%' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isVazio ? 'Sem setores cadastrados' : 'Sem coleta'}
            </span>
          )}
        </div>

        <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3.5 py-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Risco predominante
            </span>
          </div>
          {saudeNr1.riscoPredominante ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 text-[11px] font-medium ${
                RISCO_TONE[saudeNr1.riscoPredominante].pill
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${RISCO_TONE[saudeNr1.riscoPredominante].dot}`}
              />
              {RISCO_TONE[saudeNr1.riscoPredominante].label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3 h-3" strokeWidth={1.75} />
              Aguardando avaliação
            </span>
          )}
        </div>
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
