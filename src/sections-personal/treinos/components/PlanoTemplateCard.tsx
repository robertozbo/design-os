import { Send, Copy, Pencil, Archive, MoreHorizontal } from 'lucide-react'
import type { Plano } from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE } from './objetivoStyle'

interface PlanoTemplateCardProps {
  plano: Plano
  onApplyToAluno?: () => void
  onOpenDetail?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onArchive?: () => void
}

export function PlanoTemplateCard({
  plano,
  onApplyToAluno,
  onOpenDetail,
  onEdit,
  onDuplicate,
  onArchive,
}: PlanoTemplateCardProps) {
  const objStyle = OBJETIVO_STYLE[plano.objetivo]
  const totalExercicios = plano.treinos.reduce(
    (sum, t) => sum + t.exercicios.length,
    0,
  )

  return (
    <article
      className="
        group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5
        transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
      "
    >
      <button
        type="button"
        onClick={onOpenDetail}
        className="text-left"
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${objStyle.badge}`}
          >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${objStyle.dot}`} />
            {objStyle.label}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-tight text-slate-900 dark:text-slate-50">
          {plano.nome}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-slate-600 dark:text-slate-400">
          {plano.descricao}
        </p>

        <div className="mt-4 flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="font-mono tabular-nums">
            {plano.treinos.length} treino{plano.treinos.length === 1 ? '' : 's'}
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono tabular-nums">
            {totalExercicios} exercício{totalExercicios === 1 ? '' : 's'}
          </span>
        </div>

        {plano.aplicadoEmAlunosCount !== undefined && plano.aplicadoEmAlunosCount > 0 && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Aplicado em {plano.aplicadoEmAlunosCount}{' '}
            aluno{plano.aplicadoEmAlunosCount === 1 ? '' : 's'}
          </p>
        )}
      </button>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onApplyToAluno}
          className="
            flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2
            text-sm font-semibold text-white transition-colors hover:bg-teal-700
          "
        >
          <Send size={14} strokeWidth={2.5} />
          Aplicar em aluno
        </button>
        <IconButton onClick={onEdit} ariaLabel="Editar">
          <Pencil size={14} />
        </IconButton>
        <IconButton onClick={onDuplicate} ariaLabel="Duplicar">
          <Copy size={14} />
        </IconButton>
        <IconButton onClick={onArchive} ariaLabel="Arquivar">
          <Archive size={14} />
        </IconButton>
        <IconButton onClick={() => {}} ariaLabel="Mais ações">
          <MoreHorizontal size={14} />
        </IconButton>
      </div>
    </article>
  )
}

function IconButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick?: () => void
  ariaLabel: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="
        inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500
        hover:bg-slate-100 hover:text-slate-900
        dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
      "
    >
      {children}
    </button>
  )
}
