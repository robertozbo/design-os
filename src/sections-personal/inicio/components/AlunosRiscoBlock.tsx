import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Clock,
  TrendingDown,
} from 'lucide-react'
import type {
  AlunoRisco,
  CriterioRisco,
} from '@/../product-personal/sections/inicio/types'
import { RISCO_STYLE } from './helpers'

interface AlunosRiscoBlockProps {
  alunos: AlunoRisco[]
  onOpenAluno?: (alunoId: string) => void
}

const ICON_BY_CRITERIO: Record<CriterioRisco, React.ElementType> = {
  'adesao-baixa': TrendingDown,
  'sem-sessao': Clock,
  dor: AlertTriangle,
  'reavaliacao-atrasada': Calendar,
}

export function AlunosRiscoBlock({ alunos, onOpenAluno }: AlunosRiscoBlockProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Atenção
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-50">
            <span className="font-mono tabular-nums">{alunos.length}</span> alunos em risco
          </h2>
        </div>
      </header>

      {alunos.length === 0 ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Tudo sob controle 👌
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-slate-100 dark:bg-slate-800 sm:grid-cols-2">
          {alunos.map((aluno) => (
            <RiscoRow
              key={aluno.alunoId}
              aluno={aluno}
              onClick={() => onOpenAluno?.(aluno.alunoId)}
            />
          ))}
        </div>
      )}
    </article>
  )
}

function RiscoRow({
  aluno,
  onClick,
}: {
  aluno: AlunoRisco
  onClick?: () => void
}) {
  const style = RISCO_STYLE[aluno.criterio]
  const Icon = ICON_BY_CRITERIO[aluno.criterio]

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-2 bg-white p-4 text-left transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}
        >
          <Icon size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {aluno.aluno.avatarUrl ? (
              <img
                src={aluno.aluno.avatarUrl}
                alt=""
                className="h-5 w-5 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
              />
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                {aluno.aluno.nome.charAt(0)}
              </div>
            )}
            <p className="truncate text-[13px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {aluno.aluno.nome}
            </p>
            <SeveridadeDot severidade={aluno.severidade} />
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {style.label}
          </p>
          <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-slate-600 dark:text-slate-400">
            {aluno.motivo}
          </p>
        </div>
      </div>
      <div className="ml-11 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {aluno.desde}
        </span>
        <ChevronRight
          size={14}
          className="text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-700 dark:group-hover:text-slate-300"
        />
      </div>
    </button>
  )
}

function SeveridadeDot({
  severidade,
}: {
  severidade: 'alta' | 'media' | 'baixa'
}) {
  const tone =
    severidade === 'alta'
      ? 'bg-rose-500'
      : severidade === 'media'
        ? 'bg-amber-500'
        : 'bg-slate-400'
  return (
    <span
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${tone}`}
      title={`Severidade ${severidade}`}
    />
  )
}
