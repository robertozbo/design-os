import {
  Activity,
  ArrowLeft,
  MessageSquare,
  MoreHorizontal,
  Pause,
  Smartphone,
} from 'lucide-react'
import type { Aluno } from '@/../product-personal/sections/alunos/types'
import { OBJETIVO_LABEL, OBJETIVO_TONE, STATUS_STYLE } from './helpers'

interface FichaHeaderProps {
  aluno: Aluno
  onBack?: () => void
  onMessage?: () => void
  onNovaAvaliacao?: () => void
  onPausar?: () => void
}

export function FichaHeader({
  aluno,
  onBack,
  onMessage,
  onNovaAvaliacao,
  onPausar,
}: FichaHeaderProps) {
  const status = STATUS_STYLE[aluno.status]
  const dataInicio = new Date(aluno.inicioVinculoData).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
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
        Voltar para alunos
      </button>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {aluno.avatarUrl ? (
            <img
              src={aluno.avatarUrl}
              alt={aluno.nome}
              className="h-16 w-16 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xl font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {aluno.nome.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Aluno desde {dataInicio}
            </p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {aluno.nome}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${status.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${OBJETIVO_TONE[aluno.objetivo]}`}
              >
                {OBJETIVO_LABEL[aluno.objetivo]}
              </span>
              {aluno.vinculadoApp && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <Smartphone size={10} />
                  Vinculado app
                </span>
              )}
              {aluno.temNutri && (
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  + Nutri
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMessage}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <MessageSquare size={14} />
            Mensagem
            {aluno.mensagensNaoLidas > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 font-mono text-[9px] font-semibold text-white">
                {aluno.mensagensNaoLidas}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onNovaAvaliacao}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <Activity size={14} />
            Nova avaliação
          </button>
          {aluno.status === 'em-plano' && (
            <button
              type="button"
              onClick={onPausar}
              aria-label="Pausar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              title="Pausar plano"
            >
              <Pause size={14} />
            </button>
          )}
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
