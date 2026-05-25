import { ArchiveRestore, Copy } from 'lucide-react'
import type { Plano } from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE } from './objetivoStyle'

interface PlanoArquivadoCardProps {
  plano: Plano
  onUnarchive?: () => void
  onDuplicate?: () => void
}

export function PlanoArquivadoCard({
  plano,
  onUnarchive,
  onDuplicate,
}: PlanoArquivadoCardProps) {
  const objStyle = OBJETIVO_STYLE[plano.objetivo]

  return (
    <article
      className="
        group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/40 px-5 py-4
        opacity-80 transition-opacity hover:opacity-100
        dark:border-slate-800 dark:bg-slate-900/40
      "
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${objStyle.badge}`}
          >
            {objStyle.label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            arquivado{' '}
            {plano.arquivadoEm
              ? new Date(plano.arquivadoEm).toLocaleDateString('pt-BR')
              : ''}
          </span>
        </div>
        <h3 className="mt-1.5 truncate text-[14px] font-semibold text-slate-700 dark:text-slate-300">
          {plano.nome}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-500 dark:text-slate-500">
          {plano.descricao}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          onClick={onUnarchive}
          aria-label="Restaurar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ArchiveRestore size={14} />
        </button>
      </div>
    </article>
  )
}
