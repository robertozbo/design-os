import { Calendar, ChevronRight, Plus } from 'lucide-react'
import type { ProximaReavaliacao } from '@/../product-personal/sections/inicio/types'

interface ProximasReavaliacoesBlockProps {
  reavaliacoes: ProximaReavaliacao[]
  onOpenAluno?: (alunoId: string) => void
  onCreateAvaliacao?: (alunoId: string) => void
}

export function ProximasReavaliacoesBlock({
  reavaliacoes,
  onOpenAluno,
  onCreateAvaliacao,
}: ProximasReavaliacoesBlockProps) {
  const atrasadas = reavaliacoes.filter((r) => r.status === 'atrasada').length

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Próximas reavaliações
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
            <span className="font-mono tabular-nums">{reavaliacoes.length}</span> alunos
            {atrasadas > 0 && (
              <span className="ml-2 inline-flex items-center rounded-md bg-rose-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                {atrasadas} atrasada{atrasadas === 1 ? '' : 's'}
              </span>
            )}
          </h2>
        </div>
        <Calendar size={16} className="text-slate-300 dark:text-slate-700" />
      </header>

      {reavaliacoes.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Sem reavaliações pendentes
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {reavaliacoes.map((r) => (
            <li
              key={r.alunoId}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              {r.aluno.avatarUrl ? (
                <img
                  src={r.aluno.avatarUrl}
                  alt={r.aluno.nome}
                  className="h-8 w-8 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  {r.aluno.nome.charAt(0)}
                </div>
              )}
              <button
                type="button"
                onClick={() => onOpenAluno?.(r.alunoId)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-[13px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
                  {r.aluno.nome}
                </p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Última: {new Date(r.ultimaAvaliacaoData).toLocaleDateString('pt-BR')} ·{' '}
                  <span className="tabular-nums">{r.diasDesdeUltima}</span>d
                </p>
              </button>
              <span
                className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                  r.status === 'atrasada'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                    : r.diasParaOuDesdePrazo <= 14
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {r.status === 'atrasada'
                  ? `+${r.diasParaOuDesdePrazo}d atrasada`
                  : `em ${r.diasParaOuDesdePrazo}d`}
              </span>
              <button
                type="button"
                onClick={() => onCreateAvaliacao?.(r.alunoId)}
                aria-label={`Iniciar avaliação para ${r.aluno.nome}`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
                title="Iniciar avaliação"
              >
                <Plus size={14} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="flex items-center justify-end border-t border-slate-100 px-5 py-2 dark:border-slate-800">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Ver avaliações
          <ChevronRight size={12} />
        </button>
      </footer>
    </article>
  )
}
