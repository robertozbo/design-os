import {
  ArrowLeft,
  Copy,
  Download,
  GitCompare,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react'
import type { Avaliacao } from '@/../product-personal/sections/avaliacoes/types'

interface DetailHeaderProps {
  avaliacao: Avaliacao
  onBack?: () => void
  onEdit?: () => void
  onDuplicate?: () => void
  onCompare?: () => void
  onExportPdf?: () => void
  onDelete?: () => void
  onToggleNutriShare?: () => void
}

export function DetailHeader({
  avaliacao,
  onBack,
  onEdit,
  onDuplicate,
  onCompare,
  onExportPdf,
  onDelete,
  onToggleNutriShare,
}: DetailHeaderProps) {
  const dataFmt = new Date(avaliacao.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft size={14} />
        Voltar para avaliações
      </button>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {avaliacao.aluno.avatarUrl ? (
            <img
              src={avaliacao.aluno.avatarUrl}
              alt={avaliacao.aluno.nome}
              className="h-14 w-14 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {avaliacao.aluno.nome.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Avaliação · {dataFmt}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {avaliacao.aluno.nome}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {avaliacao.status === 'rascunho' && (
                <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  Rascunho
                </span>
              )}
              {avaliacao.antropometria && (
                <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  Antropometria
                </span>
              )}
              {avaliacao.funcional && (
                <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  Funcional
                </span>
              )}
              {avaliacao.aluno.temNutri && (
                <button
                  type="button"
                  onClick={onToggleNutriShare}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    avaliacao.compartilhadaComNutri
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                  title={
                    avaliacao.compartilhadaComNutri
                      ? 'Compartilhada com nutri'
                      : 'Compartilhar com nutri'
                  }
                >
                  <Share2 size={10} />
                  {avaliacao.compartilhadaComNutri
                    ? 'Compartilhada · Nutri'
                    : 'Compartilhar com Nutri'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCompare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <GitCompare size={14} />
            Comparar
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download size={14} />
            Exportar PDF
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <Pencil size={14} />
            Editar
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            aria-label="Duplicar"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            title="Duplicar"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Excluir"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
          <button
            type="button"
            aria-label="Mais"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {avaliacao.observacoes && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Observações
          </p>
          <p className="mt-1 text-[13px] italic leading-relaxed text-slate-600 dark:text-slate-400">
            “{avaliacao.observacoes}”
          </p>
        </div>
      )}
    </div>
  )
}
