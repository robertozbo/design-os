import { useEffect } from 'react'
import {
  AlertOctagon,
  Calendar,
  ExternalLink,
  FileDown,
  History,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  X,
} from 'lucide-react'
import type {
  PrescricaoDetalhe,
  RenovacaoHistoricoItem,
} from '@/../product-clinico/sections/prescricao/types'
import {
  CLASSE_CHIP,
  MOTIVO_LABEL,
  ORIGEM_LABEL,
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  VALIDADE_TONE_CLASS,
  describeValidade,
  formatDataBR,
  formatDataLonga,
} from './helpers'

interface PrescricaoDrawerProps {
  prescricao: PrescricaoDetalhe | null
  onClose?: () => void
  onAbrirPdf?: () => void
  onRenovar?: () => void
  onCancelar?: () => void
  onAbrirConsulta?: () => void
}

export function PrescricaoDrawer({
  prescricao,
  onClose,
  onAbrirPdf,
  onRenovar,
  onCancelar,
  onAbrirConsulta,
}: PrescricaoDrawerProps) {
  useEffect(() => {
    if (!prescricao) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prescricao, onClose])

  if (!prescricao) return null

  const cancelada = prescricao.status === 'cancelada'
  const expirada = prescricao.status === 'expirada'
  const validade = describeValidade(prescricao.diasAteVencer, prescricao.status)

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] dark:bg-slate-950/60"
      />
      <aside
        className="
          absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col border-l border-slate-200 bg-white shadow-xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        {/* Header */}
        <header className="flex items-start gap-3 border-b border-slate-200/80 p-5 dark:border-slate-800/80">
          <div
            className={`
              flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white shadow-sm
              ${
                cancelada
                  ? 'bg-gradient-to-br from-rose-400 to-rose-600'
                  : 'bg-gradient-to-br from-teal-500 to-emerald-600'
              }
            `}
          >
            {prescricao.iniciais}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-slate-900 dark:text-slate-50">
              {prescricao.pacienteNome}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <span
                className={`
                  inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium
                  ${STATUS_BADGE_CLASS[prescricao.status]}
                `}
              >
                {STATUS_LABEL[prescricao.status]}
              </span>
              {prescricao.condicoesCronicas.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Memed <span className="font-mono">{prescricao.memedId}</span> · emitida em{' '}
              {formatDataLonga(prescricao.dataEmissao)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Cancelamento (topo se aplicável) */}
          {cancelada && prescricao.canceladaEm && (
            <div className="mb-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-100">
              <AlertOctagon className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="text-xs">
                <p className="font-semibold">
                  Cancelada em {formatDataBR(prescricao.canceladaEm)} ·{' '}
                  {prescricao.motivoCancelamentoCategoria
                    ? MOTIVO_LABEL[prescricao.motivoCancelamentoCategoria]
                    : 'Sem motivo'}
                </p>
                {prescricao.justificativaCancelamento && (
                  <p className="mt-1 leading-relaxed text-rose-800 dark:text-rose-200">
                    {prescricao.justificativaCancelamento}
                  </p>
                )}
                <p className="mt-1.5 text-[10px] text-rose-700/80 dark:text-rose-300/80">
                  por {prescricao.canceladaPor}
                </p>
              </div>
            </div>
          )}

          {/* Itens da receita */}
          <section>
            <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Itens da receita ({prescricao.itens.length})
            </h3>
            <ul className="space-y-2">
              {prescricao.itens.map((item) => (
                <li
                  key={item.id}
                  className={`
                    rounded-xl border bg-white p-3.5 dark:bg-slate-900
                    ${
                      cancelada
                        ? 'border-rose-200/40 opacity-60 dark:border-rose-900/20'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }
                  `}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.medicamento}
                    </p>
                    <span className="font-mono text-xs text-slate-500 tabular-nums">
                      {item.dose}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] italic text-slate-500 dark:text-slate-400">
                    {item.principioAtivo}
                  </p>
                  <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                    <span className="text-slate-400">posologia</span>
                    <span className="text-slate-700 dark:text-slate-200">{item.posologia}</span>
                    <span className="text-slate-400">duração</span>
                    <span className="text-slate-700 dark:text-slate-200">{item.duracaoDias} dias</span>
                  </div>
                  {item.observacao && (
                    <p className="mt-2 rounded-md bg-amber-50/60 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                      {item.observacao}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {prescricao.observacaoGeral && (
              <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Orientação geral
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  {prescricao.observacaoGeral}
                </p>
              </div>
            )}
          </section>

          {/* Validade */}
          <section className="mt-5">
            <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Validade ICP-Brasil
            </h3>
            <div
              className={`
                flex items-center gap-3 rounded-xl border p-3.5
                ${
                  expirada || cancelada
                    ? 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60'
                    : validade.tone === 'red' || validade.tone === 'amber'
                      ? 'border-amber-200/80 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20'
                      : 'border-emerald-200/70 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                }
              `}
            >
              <ShieldCheck
                className={`size-5 shrink-0 ${
                  expirada || cancelada
                    ? 'text-slate-400'
                    : validade.tone === 'red' || validade.tone === 'amber'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                }`}
              />
              <div className="flex-1">
                <p className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                  até {formatDataBR(prescricao.validade)}
                </p>
                <p className={`text-[11px] ${VALIDADE_TONE_CLASS[validade.tone]}`}>
                  {validade.texto}
                </p>
              </div>
            </div>
          </section>

          {/* Origem */}
          <section className="mt-5">
            <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Origem
            </h3>
            {prescricao.origem === 'consulta' && prescricao.consultaId ? (
              <button
                onClick={onAbrirConsulta}
                className="
                  group/cns flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-colors
                  hover:border-teal-300 hover:bg-teal-50/40
                  dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700 dark:hover:bg-teal-950/20
                "
              >
                <Stethoscope className="size-4 text-teal-600 dark:text-teal-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Consulta de {formatDataBR(prescricao.consultaData ?? prescricao.dataEmissao)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ver detalhes da consulta vinculada
                  </p>
                </div>
                <ExternalLink className="size-4 text-slate-400 transition-colors group-hover/cns:text-teal-600 dark:group-hover/cns:text-teal-400" />
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                <Calendar className="size-4 text-slate-400" />
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  {ORIGEM_LABEL[prescricao.origem]}
                  <span className="ml-2 text-[11px] text-slate-500 dark:text-slate-400">
                    sem consulta vinculada
                  </span>
                </p>
              </div>
            )}
          </section>

          {/* Histórico */}
          {prescricao.numeroRenovacoes > 0 && (
            <section className="mt-5">
              <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <History className="-mt-0.5 mr-1 inline size-3" /> Renovada{' '}
                {prescricao.numeroRenovacoes}{' '}
                {prescricao.numeroRenovacoes === 1 ? 'vez' : 'vezes'}
              </h3>
              <ul className="space-y-1.5">
                {prescricao.historicoRenovacoes.map((h: RenovacaoHistoricoItem) => (
                  <li
                    key={h.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50/60 px-3 py-1.5 text-xs dark:bg-slate-900/60"
                  >
                    <span className="font-mono text-slate-700 tabular-nums dark:text-slate-200">
                      {formatDataBR(h.dataEmissao)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {h.tipo === 'consulta'
                        ? 'consulta'
                        : h.tipo === 'renovacao_sem_consulta'
                          ? 'renovação'
                          : 'avulsa'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center gap-2 border-t border-slate-200/80 bg-slate-50/40 p-3 dark:border-slate-800/80 dark:bg-slate-950/60">
          <button
            onClick={onAbrirPdf}
            className="
              inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors
              hover:border-slate-300 hover:bg-slate-50
              focus:outline-none focus:ring-2 focus:ring-teal-500/40
              dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
            "
          >
            <FileDown className="size-3.5" />
            PDF Memed
          </button>
          {!cancelada && (
            <button
              onClick={onRenovar}
              className="
                inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors
                hover:bg-teal-500
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
              "
            >
              <RefreshCw className="size-3.5" />
              Renovar
            </button>
          )}
          {prescricao.status === 'ativa' && (
            <button
              onClick={onCancelar}
              className="
                inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition-colors
                hover:bg-rose-50
                focus:outline-none focus:ring-2 focus:ring-rose-500/40
                dark:text-rose-400 dark:hover:bg-rose-950/30
              "
            >
              Cancelar
            </button>
          )}
        </footer>
      </aside>
    </div>
  )
}
