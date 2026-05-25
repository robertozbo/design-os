import type { EventoEsocial } from '@/../product/sections/eventos-esocial/types'
import {
  Radio,
  CheckCircle2,
  XCircle,
  GitBranch,
  Hash,
  Copy,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { StatusBadge } from './StatusBadge'

interface Props {
  evento: EventoEsocial
  onAbrirEvento?: (id: string) => void
  onRetentarTransmissao?: () => void
}

export function StatusGovernoPanel({ evento, onAbrirEvento, onRetentarTransmissao }: Props) {
  const ultimaTransmissao = evento.transmissoes[evento.transmissoes.length - 1] ?? null
  const isRejeitado = evento.status === 'rejeitado'
  const isAceito = evento.status === 'aceito'

  return (
    <section
      style={{ animationDelay: '120ms' }}
      className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
    >
      <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Radio className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Status do governo
          </h2>
        </div>
        <StatusBadge status={evento.status} label={evento.statusLabel} />
      </header>

      <div className="px-5 py-4 space-y-4">
        {/* Recibo / erro */}
        {isAceito && evento.recibo && (
          <div className="rounded-xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-950 dark:to-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/60 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-emerald-700 dark:text-emerald-400">
                  Recibo do eSocial
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="text-sm font-mono font-medium text-emerald-900 dark:text-emerald-200 break-all">
                    {evento.recibo}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(evento.recibo!)}
                    className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded text-emerald-700/70 dark:text-emerald-400/70 hover:text-emerald-900 dark:hover:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition"
                    aria-label="Copiar recibo"
                  >
                    <Copy className="w-3 h-3" strokeWidth={2} />
                  </button>
                </div>
                {evento.hashAuditoria && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700/80 dark:text-emerald-400/70">
                    <Hash className="w-3 h-3" strokeWidth={2} />
                    <span className="font-mono break-all">{evento.hashAuditoria}</span>
                  </div>
                )}
                {evento.diasParaRetificacao !== null && (
                  <p
                    className={`mt-2 text-[11px] inline-flex items-center gap-1 ${
                      evento.diasParaRetificacao <= 30
                        ? 'text-orange-700 dark:text-orange-300 font-medium'
                        : 'text-emerald-700/80 dark:text-emerald-400/70'
                    }`}
                  >
                    <Clock className="w-3 h-3" strokeWidth={2} />
                    {evento.diasParaRetificacao} dias para retificar
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {isRejeitado && ultimaTransmissao?.descricaoErro && (
          <div className="rounded-xl bg-gradient-to-br from-rose-50/80 via-white to-rose-50/40 dark:from-rose-950/40 dark:via-slate-950 dark:to-rose-950/20 border border-rose-200/70 dark:border-rose-900/60 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                <XCircle className="w-4 h-4" strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-rose-700 dark:text-rose-400">
                  Por que foi rejeitado
                </p>
                <p className="mt-1 text-sm text-rose-900 dark:text-rose-200">
                  <span className="font-mono font-semibold mr-2">
                    [{ultimaTransmissao.codigoErro}]
                  </span>
                  {ultimaTransmissao.descricaoErro}
                </p>
                {ultimaTransmissao.sugestaoCorrecao && (
                  <p className="mt-2 text-[12px] text-rose-800/90 dark:text-rose-300/80 leading-relaxed border-l-2 border-rose-300 dark:border-rose-800 pl-3">
                    <span className="font-medium text-rose-900 dark:text-rose-200">Sugestão · </span>
                    {ultimaTransmissao.sugestaoCorrecao}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Eventos relacionados */}
        {(evento.retificacaoDe || evento.retificadoPor) && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
              Eventos relacionados
            </p>
            {evento.retificacaoDe && (
              <button
                type="button"
                onClick={() => onAbrirEvento?.(evento.retificacaoDe!)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-900/50 hover:border-violet-300 dark:hover:border-violet-800 transition text-left"
              >
                <GitBranch className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" strokeWidth={2} />
                <span className="flex-1 min-w-0 text-[12px] text-violet-900 dark:text-violet-200">
                  Retifica{' '}
                  <span className="font-mono font-medium">{evento.retificacaoDe}</span>
                </span>
                <ArrowUpRight className="w-3 h-3 text-violet-600/70 dark:text-violet-400/70" strokeWidth={2} />
              </button>
            )}
            {evento.retificadoPor && (
              <button
                type="button"
                onClick={() => onAbrirEvento?.(evento.retificadoPor!)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-900/50 hover:border-violet-300 dark:hover:border-violet-800 transition text-left"
              >
                <GitBranch className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" strokeWidth={2} />
                <span className="flex-1 min-w-0 text-[12px] text-violet-900 dark:text-violet-200">
                  Retificado por{' '}
                  <span className="font-mono font-medium">{evento.retificadoPor}</span>
                </span>
                <ArrowUpRight className="w-3 h-3 text-violet-600/70 dark:text-violet-400/70" strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        {/* Timeline de transmissões */}
        {evento.transmissoes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Histórico de transmissões · {evento.transmissoes.length}
              </p>
              {isRejeitado && (
                <button
                  type="button"
                  onClick={onRetentarTransmissao}
                  className="text-[11px] font-medium text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 transition"
                >
                  Reenviar agora
                </button>
              )}
            </div>
            <ol className="relative space-y-3 pl-5 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
              {evento.transmissoes.map((t, idx) => {
                const isSuccess = t.statusRetorno === 'sucesso'
                const isProcessing = t.statusRetorno === 'em_processamento'
                const dotColor = isSuccess
                  ? 'bg-emerald-500'
                  : isProcessing
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                return (
                  <li key={idx} className="relative">
                    <span
                      className={`absolute -left-[18px] top-1 inline-flex w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900/40 ${dotColor}`}
                    >
                      {isProcessing && (
                        <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </span>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200 capitalize">
                        {t.tipoEvento ?? statusLabel(t.statusRetorno)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 tabular-nums">
                        {formatDateTime(t.timestamp)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                      {t.codigoRetorno && (
                        <span className="font-mono">código {t.codigoRetorno}</span>
                      )}
                      {t.duracaoMs !== null && t.duracaoMs !== undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{t.duracaoMs}ms</span>
                        </>
                      )}
                      {t.codigoErro && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-rose-700 dark:text-rose-300">
                            {t.codigoErro}
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}

function statusLabel(s: string): string {
  switch (s) {
    case 'sucesso':
      return 'Aceito pelo governo'
    case 'rejeitado':
      return 'Rejeitado pelo governo'
    case 'em_processamento':
      return 'Em processamento'
    case 'timeout':
      return 'Timeout'
    case 'erro_rede':
      return 'Erro de rede'
    default:
      return s
  }
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mn = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm} · ${hh}:${mn}`
  } catch {
    return '—'
  }
}
