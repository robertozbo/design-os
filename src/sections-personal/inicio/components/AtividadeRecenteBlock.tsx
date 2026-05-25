import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  MessageSquare,
  Sparkles,
  UserPlus,
  XCircle,
} from 'lucide-react'
import type {
  AtividadeEvento,
  AtividadeTipo,
} from '@/../product-personal/sections/inicio/types'
import { ATIVIDADE_STYLE } from './helpers'

interface AtividadeRecenteBlockProps {
  eventos: AtividadeEvento[]
  onOpenAluno?: (alunoId: string) => void
  onOpenAtividade?: () => void
}

const ICON_BY_TIPO: Record<AtividadeTipo, React.ElementType> = {
  'sessao-completa': CheckCircle2,
  'sessao-pulada': XCircle,
  mensagem: MessageSquare,
  'indicacao-aceita': UserPlus,
  'avaliacao-completa': Sparkles,
  'comentario-dor': AlertTriangle,
}

export function AtividadeRecenteBlock({
  eventos,
  onOpenAluno,
  onOpenAtividade,
}: AtividadeRecenteBlockProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          Atividade recente
        </p>
        <button
          type="button"
          onClick={onOpenAtividade}
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Ver tudo
          <ChevronRight size={12} />
        </button>
      </header>

      {eventos.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Nenhuma atividade recente
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {eventos.slice(0, 8).map((ev) => (
            <EventoRow
              key={ev.id}
              evento={ev}
              onClick={() => onOpenAluno?.(ev.aluno.id)}
            />
          ))}
        </ul>
      )}
    </article>
  )
}

function EventoRow({
  evento,
  onClick,
}: {
  evento: AtividadeEvento
  onClick?: () => void
}) {
  const style = ATIVIDADE_STYLE[evento.tipo]
  const Icon = ICON_BY_TIPO[evento.tipo]

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
      >
        <div className="relative shrink-0">
          {evento.aluno.avatarUrl ? (
            <img
              src={evento.aluno.avatarUrl}
              alt={evento.aluno.nome}
              className="h-8 w-8 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {evento.aluno.nome.charAt(0)}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 ${style.iconBg} ${style.iconColor}`}
          >
            <Icon size={9} />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] leading-snug text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {evento.aluno.nome}
            </span>{' '}
            {evento.descricao}
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {evento.timestamp}
          </p>
        </div>
      </button>
    </li>
  )
}
