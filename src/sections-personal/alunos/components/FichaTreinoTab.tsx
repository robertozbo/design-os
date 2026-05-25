import { useState } from 'react'
import { Calendar, ChevronDown, Pencil, Send } from 'lucide-react'
import type { Aluno, PlanoHistorico } from '@/../product-personal/sections/alunos/types'
import { OBJETIVO_LABEL, OBJETIVO_TONE } from './helpers'

interface FichaTreinoTabProps {
  aluno: Aluno
  onApplyTemplate?: () => void
  onEditPlano?: () => void
}

export function FichaTreinoTab({ aluno, onApplyTemplate, onEditPlano }: FichaTreinoTabProps) {
  const plano = aluno.planoAtual
  const historico = aluno.planosAnteriores ?? []

  return (
    <div className="space-y-5">
      {/* Plano atual */}
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Plano atual
          </p>
          {plano && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onApplyTemplate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Send size={12} />
                Trocar plano
              </button>
              <button
                type="button"
                onClick={onEditPlano}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Pencil size={12} />
                Editar prescrição
              </button>
            </div>
          )}
        </header>

        {plano ? (
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {plano.nome}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${OBJETIVO_TONE[plano.objetivo]}`}
                >
                  {OBJETIVO_LABEL[plano.objetivo]}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  início: {new Date(plano.inicioData).toLocaleDateString('pt-BR')}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ·{' '}
                  {plano.duracaoSemanas
                    ? `${plano.duracaoSemanas} semanas`
                    : 'indeterminado'}
                </span>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
              Veja a prescrição completa (treinos A/B/C, séries, cargas) na seção <span className="font-semibold text-slate-700 dark:text-slate-300">Treinos</span>.
              Os ajustes feitos lá refletem aqui imediatamente.
            </p>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Aluno sem plano atribuído.
            </p>
            <button
              type="button"
              onClick={onApplyTemplate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Send size={14} strokeWidth={2.5} />
              Aplicar template
            </button>
          </div>
        )}
      </article>

      {/* Histórico */}
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <header className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Histórico de planos · {historico.length}
          </p>
        </header>

        {historico.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Sem planos anteriores. O plano atual é o primeiro.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {historico.map((p) => (
              <PlanoHistoricoRow key={p.id} plano={p} />
            ))}
          </div>
        )}
      </article>
    </div>
  )
}

function PlanoHistoricoRow({ plano }: { plano: PlanoHistorico }) {
  const [open, setOpen] = useState(false)

  const inicio = new Date(plano.inicioData).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const fim = new Date(plano.fimData).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const adesaoTone =
    plano.adesaoFinal >= 85
      ? 'text-emerald-600 dark:text-emerald-400'
      : plano.adesaoFinal >= 60
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-rose-600 dark:text-rose-400'

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
      >
        <Calendar size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
            {plano.nome}
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span className="tabular-nums">{inicio}</span> →{' '}
            <span className="tabular-nums">{fim}</span>
          </p>
        </div>
        <span
          className={`font-mono text-sm font-semibold tabular-nums ${adesaoTone}`}
        >
          {plano.adesaoFinal}%
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? 'rotate-180' : ''
          } dark:text-slate-500`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-3 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Motivo da troca
          </p>
          <p className="mt-1 text-[12px] italic leading-snug text-slate-600 dark:text-slate-400">
            {plano.motivoTroca}
          </p>
        </div>
      )}
    </div>
  )
}
