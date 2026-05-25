import {
  ArrowLeft,
  MessageSquare,
  Pencil,
  Archive,
  Save,
  MoreHorizontal,
} from 'lucide-react'
import type { Plano } from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE } from './objetivoStyle'

interface DetailHeaderProps {
  plano: Plano
  onBack?: () => void
  onAdjustPlano?: () => void
  onMessageAluno?: () => void
  onSaveAsTemplate?: () => void
  onArchive?: () => void
}

export function DetailHeader({
  plano,
  onBack,
  onAdjustPlano,
  onMessageAluno,
  onSaveAsTemplate,
  onArchive,
}: DetailHeaderProps) {
  const aluno = plano.aluno
  const objStyle = OBJETIVO_STYLE[plano.objetivo]
  if (!aluno) return null

  const dataInicio = plano.dataInicio
    ? new Date(plano.dataInicio).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ArrowLeft size={14} />
        Voltar para lista
      </button>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {aluno.avatarUrl ? (
            <img
              src={aluno.avatarUrl}
              alt={aluno.nome}
              className="h-14 w-14 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {aluno.nome.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Plano atribuído · iniciado {dataInicio}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {aluno.nome}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {plano.nome}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${objStyle.badge}`}
              >
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${objStyle.dot}`} />
                {objStyle.label}
              </span>
              {plano.permitirAjusteCarga && (
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  Aluno ajusta carga
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMessageAluno}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <MessageSquare size={14} />
            Mensagem
          </button>
          <button
            type="button"
            onClick={onSaveAsTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Save size={14} />
            Salvar como template
          </button>
          <button
            type="button"
            onClick={onAdjustPlano}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <Pencil size={14} />
            Ajustar plano
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Mais ações"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              onClick={onArchive}
              title="Arquivar plano"
            >
              <Archive size={14} />
            </button>
          </div>
          <button
            type="button"
            aria-label="Mais"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
