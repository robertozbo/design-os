import {
  Flame,
  MessageSquare,
  ChevronRight,
  CalendarDays,
  AlertTriangle,
} from 'lucide-react'
import type { Plano } from '@/../product-personal/sections/treinos/types'
import { OBJETIVO_STYLE, formatProximaSessao, getAdesaoTone } from './objetivoStyle'

interface PlanoAtribuidoCardProps {
  plano: Plano
  onOpenDetail?: () => void
  onMessageAluno?: () => void
}

export function PlanoAtribuidoCard({
  plano,
  onOpenDetail,
  onMessageAluno,
}: PlanoAtribuidoCardProps) {
  const aluno = plano.aluno
  const adesao = plano.adesao
  if (!aluno || !adesao) return null

  const objStyle = OBJETIVO_STYLE[plano.objetivo]
  const adesaoTone = getAdesaoTone(adesao.percentual)
  const hasAlertas = (plano.alertas?.length ?? 0) > 0

  return (
    <article
      className="
        group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white
        transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
      "
    >
      {/* Top section — clickable area */}
      <button type="button" onClick={onOpenDetail} className="text-left">
        {/* Aluno header */}
        <div className="flex items-center gap-3 p-5 pb-3">
          {aluno.avatarUrl ? (
            <img
              src={aluno.avatarUrl}
              alt={aluno.nome}
              className="h-11 w-11 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {aluno.nome.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {aluno.nome}
            </h3>
            <p className="mt-0.5 truncate text-[12px] text-slate-500 dark:text-slate-400">
              {plano.nome}
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${objStyle.badge}`}
          >
            {objStyle.label}
          </span>
        </div>

        {/* Adesão bar */}
        <div className="px-5 pb-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Adesão
            </span>
            <span
              className={`font-mono text-sm font-semibold tabular-nums ${adesaoTone.text}`}
            >
              {adesao.percentual}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full ${adesaoTone.bar}`}
              style={{ width: `${adesao.percentual}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span className="tabular-nums">{adesao.sessoesFeitas}</span> de{' '}
            <span className="tabular-nums">{adesao.sessoesTotais}</span> sessões ·{' '}
            <span className="tabular-nums">RPE {adesao.rpeMedio?.toFixed(1) ?? '—'}</span>
          </p>
        </div>

        {/* Streak + próxima sessão */}
        <div className="mx-5 mb-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <Flame size={14} />
            </span>
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Streak
              </p>
              <p className="font-mono text-[13px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
                {adesao.streak}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
              <CalendarDays size={14} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Próx. {plano.proximaSessao?.treinoLetra}
              </p>
              <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                {plano.proximaSessao
                  ? formatProximaSessao(plano.proximaSessao.data)
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {hasAlertas && (
          <div className="mx-5 mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 dark:border-amber-900/50 dark:bg-amber-900/10">
            <AlertTriangle
              size={13}
              className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
            />
            <p className="text-[12px] leading-snug text-amber-900 dark:text-amber-200">
              {plano.alertas![0]}
            </p>
          </div>
        )}
      </button>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onOpenDetail}
          className="
            flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2
            text-sm font-semibold text-white transition-colors hover:bg-slate-800
            dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
          "
        >
          Ver detalhe
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onMessageAluno}
          aria-label="Enviar mensagem"
          className="
            inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600
            hover:bg-slate-50 hover:text-slate-900
            dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100
          "
        >
          <MessageSquare size={14} />
        </button>
      </div>
    </article>
  )
}
