import type { EventoEsocial } from '@/../product/sections/eventos-esocial/types'
import { History, User2, Sparkles, GitBranch, ArrowUpRight } from 'lucide-react'
import { MotivoGatilhoChip } from './MotivoGatilhoChip'

interface Props {
  evento: EventoEsocial
  onAbrirOrigem?: (id: string) => void
}

export function AuditoriaPanel({ evento, onAbrirOrigem }: Props) {
  const modificacoes = evento.modificacoes ?? []
  const isSugestao = evento.origem.startsWith('sugerido')
  const isRetificacao = evento.origem === 'retificacao'

  const OriginIcon = isSugestao ? Sparkles : isRetificacao ? GitBranch : User2
  const originIconColor = isSugestao
    ? 'text-sky-600 dark:text-sky-400'
    : isRetificacao
      ? 'text-violet-600 dark:text-violet-400'
      : 'text-slate-600 dark:text-slate-400'

  return (
    <section
      style={{ animationDelay: '380ms' }}
      className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800/80">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <History className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Auditoria</h2>
      </header>

      <div className="px-5 py-4 space-y-4">
        {/* Origem */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
            Origem
          </p>
          <div className="flex items-start gap-2.5">
            <span className={`shrink-0 mt-0.5 ${originIconColor}`}>
              <OriginIcon className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-slate-800 dark:text-slate-200">
                {evento.origemLabel}
              </p>
              {evento.origemReferenciaId && (
                <button
                  type="button"
                  onClick={() => onAbrirOrigem?.(evento.origemReferenciaId!)}
                  className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 transition"
                >
                  <span className="truncate max-w-[200px]">
                    {evento.origemReferenciaLabel ?? evento.origemReferenciaId}
                  </span>
                  <ArrowUpRight className="w-2.5 h-2.5 shrink-0" strokeWidth={2} />
                </button>
              )}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Criado por <span className="text-slate-700 dark:text-slate-300">{evento.criadoPor}</span>
              </p>
              <div className="mt-2">
                <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Motivo gatilho
                </p>
                <MotivoGatilhoChip
                  motivo={evento.motivoGatilho}
                  label={evento.motivoGatilhoLabel}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {modificacoes.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Histórico
            </p>
            <ol className="relative space-y-2.5 pl-4 before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
              {modificacoes.map((m, idx) => (
                <li key={idx} className="relative">
                  <span className="absolute -left-[14px] top-1.5 inline-block w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 ring-2 ring-white dark:ring-slate-900/40" />
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[12px] text-slate-800 dark:text-slate-200 leading-snug">
                      {m.acao}
                    </p>
                    <span className="shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                      {formatDateTime(m.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.autor}
                    {m.detalhe && (
                      <>
                        <span className="opacity-50 mx-1">·</span>
                        {m.detalhe}
                      </>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mn = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm} ${hh}:${mn}`
  } catch {
    return '—'
  }
}
