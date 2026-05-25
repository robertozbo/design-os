import {
  Activity,
  AlertTriangle,
  ArchiveRestore,
  Dumbbell,
  Flame,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Play,
  Smartphone,
} from 'lucide-react'
import type { Aluno } from '@/../product-personal/sections/alunos/types'
import {
  STATUS_STYLE,
  formatDiasRel,
  formatProximaRel,
  getAdesaoTone,
} from './helpers'

interface AlunoTableRowProps {
  aluno: Aluno
  onOpenFicha?: () => void
  onMessage?: () => void
  onApplyTemplate?: () => void
  onNovaAvaliacao?: () => void
  onPausar?: () => void
  onDespausar?: () => void
  /** Reserved for future menu — currently unused */
  onArquivar?: () => void
  onRestaurar?: () => void
}

export function AlunoTableRow({
  aluno,
  onOpenFicha,
  onMessage,
  onApplyTemplate,
  onNovaAvaliacao,
  onPausar,
  onDespausar,
  onRestaurar,
}: AlunoTableRowProps) {
  const status = STATUS_STYLE[aluno.status]
  const adesaoTone = aluno.adesao ? getAdesaoTone(aluno.adesao.percentual) : null
  const hasRisk = aluno.riscos.length > 0
  const isArquivado = aluno.status === 'arquivado'
  const isPausado = aluno.status === 'pausado'

  // Risk left-border color
  const riskBorder = hasRisk
    ? aluno.riscos.includes('dor') || aluno.riscos.includes('sem-sessao')
      ? 'border-l-rose-400 dark:border-l-rose-700'
      : 'border-l-amber-400 dark:border-l-amber-700'
    : 'border-l-transparent'

  return (
    <div
      role="row"
      onClick={onOpenFicha}
      style={{
        gridTemplateColumns:
          'minmax(0, 2.4fr) minmax(0, 2fr) minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
      }}
      className={`
        group grid cursor-pointer items-center gap-4 border-l-[3px] px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40
        ${riskBorder}
        ${status.rowTone ?? ''}
      `}
    >
      {/* Aluno */}
      <div className="flex min-w-0 items-center gap-3">
        {aluno.avatarUrl ? (
          <img
            src={aluno.avatarUrl}
            alt={aluno.nome}
            className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            {aluno.nome.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[14px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {aluno.nome}
            </p>
            {hasRisk && (
              <AlertTriangle
                size={11}
                className="shrink-0 text-amber-500 dark:text-amber-400"
                aria-label="Em risco"
              />
            )}
            {aluno.vinculadoApp && (
              <Smartphone
                size={11}
                className="shrink-0 text-teal-500 dark:text-teal-400"
                aria-label="Vinculado ao app"
              />
            )}
            {aluno.mensagensNaoLidas > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[9px] font-semibold text-white">
                {aluno.mensagensNaoLidas}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {aluno.email}
          </p>
        </div>
      </div>

      {/* Plano */}
      <div className="min-w-0">
        {aluno.planoAtual ? (
          <>
            <p className="truncate text-[12px] font-semibold text-slate-700 dark:text-slate-300">
              {aluno.planoAtual.nome}
            </p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {aluno.planoAtual.duracaoSemanas
                ? `${aluno.planoAtual.duracaoSemanas} sem.`
                : 'Indeterminado'}
            </p>
          </>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            sem plano
          </span>
        )}
      </div>

      {/* Adesão */}
      <div className="min-w-0">
        {aluno.adesao && adesaoTone ? (
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-mono text-sm font-semibold tabular-nums ${adesaoTone.text}`}
              >
                {aluno.adesao.percentual}%
              </span>
              {aluno.adesao.streak > 0 && (
                <span className="inline-flex items-center gap-0.5 font-mono text-[10px] tabular-nums text-amber-600 dark:text-amber-400">
                  <Flame size={9} />
                  {aluno.adesao.streak}
                </span>
              )}
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full ${adesaoTone.bar}`}
                style={{ width: `${aluno.adesao.percentual}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider tabular-nums text-slate-400 dark:text-slate-500">
              {aluno.adesao.sessoesFeitas}/{aluno.adesao.sessoesTotais}
            </p>
          </div>
        ) : (
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            —
          </span>
        )}
      </div>

      {/* Última sessão */}
      <div className="min-w-0">
        <p className="font-mono text-[12px] tabular-nums text-slate-700 dark:text-slate-300">
          {formatDiasRel(aluno.ultimaSessaoData)}
        </p>
        {aluno.ultimaSessaoData && (
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {new Date(aluno.ultimaSessaoData).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* Próxima */}
      <div className="min-w-0">
        {aluno.proximaSessao ? (
          <>
            <p className="font-mono text-[12px] tabular-nums text-slate-700 dark:text-slate-300">
              {formatProximaRel(aluno.proximaSessao.data)}
            </p>
            {aluno.proximaSessao.treinoLetra && (
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Treino {aluno.proximaSessao.treinoLetra}
              </p>
            )}
          </>
        ) : (
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            —
          </span>
        )}
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${status.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Actions (stop propagation) */}
      <div
        className="flex items-center justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {!isArquivado ? (
          <>
            <IconBtn onClick={onMessage} ariaLabel="Mensagem" tone="teal">
              <MessageSquare size={13} />
              {aluno.mensagensNaoLidas > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
              )}
            </IconBtn>
            <IconBtn onClick={onApplyTemplate} ariaLabel="Aplicar template">
              <Dumbbell size={13} />
            </IconBtn>
            <IconBtn onClick={onNovaAvaliacao} ariaLabel="Nova avaliação">
              <Activity size={13} />
            </IconBtn>
            {isPausado ? (
              <IconBtn onClick={onDespausar} ariaLabel="Despausar">
                <Play size={13} />
              </IconBtn>
            ) : (
              aluno.status === 'em-plano' && (
                <IconBtn onClick={onPausar} ariaLabel="Pausar">
                  <Pause size={13} />
                </IconBtn>
              )
            )}
            <IconBtn ariaLabel="Mais">
              <MoreHorizontal size={13} />
            </IconBtn>
          </>
        ) : (
          <IconBtn onClick={onRestaurar} ariaLabel="Restaurar">
            <ArchiveRestore size={13} />
          </IconBtn>
        )}
      </div>
    </div>
  )
}

function IconBtn({
  onClick,
  ariaLabel,
  tone = 'slate',
  children,
}: {
  onClick?: () => void
  ariaLabel: string
  tone?: 'slate' | 'teal'
  children: React.ReactNode
}) {
  const hover =
    tone === 'teal'
      ? 'hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/30 dark:hover:text-teal-300'
      : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 ${hover}`}
    >
      {children}
    </button>
  )
}
