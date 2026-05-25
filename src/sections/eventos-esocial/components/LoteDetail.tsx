import { useMemo, useState } from 'react'
import type {
  EventoNoLoteResumo,
  LoteDetailProps,
  StatusEventoNoLote,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  ChevronLeft,
  Package,
  Download,
  FileText,
  X,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Radio,
  Inbox,
  AlertTriangle,
  ArrowUpRight,
  History,
  Hash,
  Copy,
  Search,
} from 'lucide-react'
import { TipoEventoBadge } from './TipoEventoBadge'
import { AmbienteBadge } from './AmbienteBadge'
import { MotivoGatilhoChip } from './MotivoGatilhoChip'

const LOTE_STATUS_TONE = {
  em_transmissao: {
    Icon: Radio,
    bg: 'from-amber-50 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-950',
    border: 'border-amber-200/70 dark:border-amber-900/60',
    pillBg: 'bg-amber-50 dark:bg-amber-950/40',
    pillText: 'text-amber-800 dark:text-amber-300',
    pillRing: 'ring-amber-200 dark:ring-amber-900',
    dot: 'bg-amber-500',
    pulse: true,
  },
  recepcionado: {
    Icon: Inbox,
    bg: 'from-sky-50 via-white to-sky-50/30 dark:from-sky-950/30 dark:via-slate-900 dark:to-slate-950',
    border: 'border-sky-200/70 dark:border-sky-900/60',
    pillBg: 'bg-sky-50 dark:bg-sky-950/40',
    pillText: 'text-sky-700 dark:text-sky-300',
    pillRing: 'ring-sky-200 dark:ring-sky-900',
    dot: 'bg-sky-500',
    pulse: true,
  },
  processado_sucesso: {
    Icon: CheckCircle2,
    bg: 'from-emerald-50 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950',
    border: 'border-emerald-200/70 dark:border-emerald-900/60',
    pillBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    pillText: 'text-emerald-700 dark:text-emerald-300',
    pillRing: 'ring-emerald-200 dark:ring-emerald-900',
    dot: 'bg-emerald-500',
    pulse: false,
  },
  processado_com_erros: {
    Icon: XCircle,
    bg: 'from-rose-50 via-white to-rose-50/30 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-950',
    border: 'border-rose-200/70 dark:border-rose-900/60',
    pillBg: 'bg-rose-50 dark:bg-rose-950/40',
    pillText: 'text-rose-700 dark:text-rose-300',
    pillRing: 'ring-rose-200 dark:ring-rose-900',
    dot: 'bg-rose-500',
    pulse: false,
  },
  processado_com_advertencia: {
    Icon: AlertTriangle,
    bg: 'from-amber-50 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-950',
    border: 'border-amber-200/70 dark:border-amber-900/60',
    pillBg: 'bg-amber-50 dark:bg-amber-950/40',
    pillText: 'text-amber-700 dark:text-amber-300',
    pillRing: 'ring-amber-200 dark:ring-amber-900',
    dot: 'bg-amber-500',
    pulse: false,
  },
  cancelado: {
    Icon: XCircle,
    bg: 'from-stone-50 via-white to-stone-50/30 dark:from-stone-900/30 dark:via-slate-900 dark:to-slate-950',
    border: 'border-stone-200/70 dark:border-stone-800',
    pillBg: 'bg-stone-100 dark:bg-stone-800/60',
    pillText: 'text-stone-600 dark:text-stone-400',
    pillRing: 'ring-stone-200 dark:ring-stone-700',
    dot: 'bg-stone-400',
    pulse: false,
  },
}

const EVENTO_STATUS_TONE: Record<
  StatusEventoNoLote,
  { dot: string; text: string; bg: string; ring: string }
> = {
  aceito: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    ring: 'ring-emerald-200 dark:ring-emerald-900',
  },
  rejeitado: {
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    ring: 'ring-rose-200 dark:ring-rose-900',
  },
  em_processamento: {
    dot: 'bg-amber-500',
    text: 'text-amber-800 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'ring-amber-200 dark:ring-amber-900',
  },
  advertencia: {
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'ring-amber-200 dark:ring-amber-900',
  },
}

export function LoteDetail({
  lote,
  empregadorContexto,
  onVoltar,
  onAbrirEvento,
  onBaixarXml,
  onBaixarProtocolo,
  onCancelarTransmissao,
  onReprocessarRejeitados,
}: LoteDetailProps) {
  const tone = LOTE_STATUS_TONE[lote.status]
  const StatusIcon = tone.Icon
  const eventos = lote.eventosResumo ?? []
  const historico = lote.historicoTransmissao ?? []
  const [filtroErros, setFiltroErros] = useState(false)
  const [busca, setBusca] = useState('')

  const eventosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return eventos.filter((e) => {
      if (filtroErros && e.status !== 'rejeitado' && e.status !== 'advertencia') return false
      if (termo) {
        const hay = `${e.trabalhador.nome} ${e.trabalhador.cpf} ${e.id} ${e.recibo ?? ''} ${e.tipo}`.toLowerCase()
        if (!hay.includes(termo)) return false
      }
      return true
    })
  }, [eventos, busca, filtroErros])

  const podeCancelar = lote.status === 'em_transmissao'
  const temRejeitados = lote.totalRejeitados > 0

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap">
          <button type="button" onClick={onVoltar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">Gestão eSocial</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button type="button" onClick={onVoltar} className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
            Lotes
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400 font-mono">
            Lote #{lote.numeroSequencial}
          </span>
        </div>

        <button
          type="button"
          onClick={onVoltar}
          className="nymos-reveal opacity-0 inline-flex items-center gap-1 mb-3 text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition lg:hidden"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Voltar para Lotes
        </button>

        {/* Hero card */}
        <header
          style={{ animationDelay: '60ms' }}
          className={`nymos-reveal opacity-0 rounded-3xl overflow-hidden border bg-gradient-to-br ${tone.bg} ${tone.border}`}
        >
          <div className="px-6 py-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${tone.pillBg} ${tone.pillText} ring-1 ${tone.pillRing}`}
                >
                  <span className="relative inline-flex w-1.5 h-1.5">
                    {tone.pulse && (
                      <span className={`absolute inset-0 rounded-full ${tone.dot} opacity-60 animate-ping`} />
                    )}
                    <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                  </span>
                  {lote.statusLabel}
                </span>
                <AmbienteBadge ambiente={lote.ambiente} size="md" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 inline-flex items-center gap-2">
                <Package className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                Lote #{lote.numeroSequencial}
              </h1>

              {lote.protocoloGoverno && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800">
                  <Hash className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
                  <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                    Protocolo
                  </span>
                  <code className="text-[12px] font-mono font-medium text-slate-800 dark:text-slate-100">
                    {lote.protocoloGoverno}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(lote.protocoloGoverno!)}
                    className="inline-flex items-center justify-center w-5 h-5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    aria-label="Copiar protocolo"
                  >
                    <Copy className="w-3 h-3" strokeWidth={2} />
                  </button>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-[11px]">
                <Meta label="Gerado em" value={formatDateTime(lote.geradoEm)} mono />
                <Meta label="Gerado por" value={lote.geradoPor} />
                {lote.recebidoEm && (
                  <Meta label="Recebido em" value={formatDateTime(lote.recebidoEm)} mono />
                )}
                {lote.processadoEm && (
                  <Meta label="Processado em" value={formatDateTime(lote.processadoEm)} mono />
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              {temRejeitados && (
                <button
                  type="button"
                  onClick={() => onReprocessarRejeitados?.(lote.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Reprocessar {lote.totalRejeitados} rejeitado{lote.totalRejeitados > 1 ? 's' : ''}
                </button>
              )}
              <button
                type="button"
                onClick={() => onBaixarXml?.(lote.id)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                XML
              </button>
              {lote.protocoloGoverno && (
                <button
                  type="button"
                  onClick={() => onBaixarProtocolo?.(lote.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition"
                >
                  <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Protocolo
                </button>
              )}
              {podeCancelar && (
                <button
                  type="button"
                  onClick={() => onCancelarTransmissao?.(lote.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Stats inline */}
          <div className="px-6 py-3 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-4 gap-4 text-center">
            <Stat
              icon={<Inbox className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Total"
              value={lote.quantidadeEventos}
              limit="/ 50"
            />
            <Stat
              icon={<CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Aceitos"
              value={lote.totalAceitos}
              tone="emerald"
            />
            <Stat
              icon={<XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Rejeitados"
              value={lote.totalRejeitados}
              tone="rose"
            />
            <Stat
              icon={<AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Advertências"
              value={lote.totalAdvertencias}
              tone="amber"
            />
          </div>
        </header>

        {/* 2-col layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Lista de eventos */}
          <section className="lg:col-span-8 min-w-0">
            <div
              style={{ animationDelay: '180ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-2">
                  Eventos do lote
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 tabular-nums">
                    {eventosFiltrados.length} / {eventos.length}
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  {temRejeitados && (
                    <button
                      type="button"
                      onClick={() => setFiltroErros((v) => !v)}
                      className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition
                        ${
                          filtroErros
                            ? 'bg-rose-600 dark:bg-rose-500 text-white'
                            : 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                        }
                      `}
                    >
                      <XCircle className="w-3 h-3" strokeWidth={2} />
                      Só erros
                    </button>
                  )}
                </div>
              </header>

              <div className="px-3 py-2 border-b border-slate-200/70 dark:border-slate-800/80">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                    strokeWidth={1.75}
                  />
                  <input
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por trabalhador, CPF, recibo ou ID"
                    className="
                      w-full pl-9 pr-3 py-1.5 rounded-lg
                      bg-slate-50 dark:bg-slate-900/60
                      border border-slate-200 dark:border-slate-800
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      text-[12px] text-slate-700 dark:text-slate-200
                      focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                      transition
                    "
                  />
                </div>
              </div>

              <ul className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {eventosFiltrados.length === 0 ? (
                  <li className="px-5 py-10 text-center">
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                      Nenhum evento corresponde aos filtros.
                    </p>
                  </li>
                ) : (
                  eventosFiltrados.map((evento, idx) => (
                    <EventoLoteRow
                      key={evento.id}
                      evento={evento}
                      revealIndex={idx}
                      onAbrir={() => onAbrirEvento?.(evento.id)}
                    />
                  ))
                )}
              </ul>
            </div>
          </section>

          {/* Painel lateral: histórico */}
          <aside className="lg:col-span-4 min-w-0">
            <div
              style={{ animationDelay: '260ms' }}
              className="nymos-reveal opacity-0 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <header className="px-5 py-3.5 flex items-center gap-2 border-b border-slate-200/70 dark:border-slate-800/80">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <History className="w-3.5 h-3.5" strokeWidth={1.75} />
                </span>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Histórico de transmissão
                </h2>
              </header>
              <div className="px-5 py-4">
                {historico.length === 0 ? (
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 text-center py-4">
                    Sem histórico registrado.
                  </p>
                ) : (
                  <ol className="relative space-y-3 pl-5 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                    {historico.map((h, idx) => {
                      const isLast = idx === historico.length - 1
                      const isFinal =
                        lote.status === 'processado_sucesso' || lote.status === 'processado_com_erros'
                      const dotColor = isLast && isFinal
                        ? lote.status === 'processado_sucesso'
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                        : 'bg-slate-400 dark:bg-slate-600'
                      return (
                        <li key={idx} className="relative">
                          <span
                            className={`absolute -left-[17px] top-1 inline-flex w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900/40 ${dotColor}`}
                          />
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200">
                              {h.acao}
                            </span>
                            <span className="shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                              {formatHora(h.timestamp)}
                            </span>
                          </div>
                          {h.detalhe && (
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                              {h.detalhe}
                            </p>
                          )}
                        </li>
                      )
                    })}
                  </ol>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function EventoLoteRow({
  evento,
  revealIndex,
  onAbrir,
}: {
  evento: EventoNoLoteResumo
  revealIndex: number
  onAbrir: () => void
}) {
  const tone = EVENTO_STATUS_TONE[evento.status]
  const isErro = evento.status === 'rejeitado'

  return (
    <li>
      <button
        type="button"
        onClick={onAbrir}
        style={{ animationDelay: `${320 + revealIndex * 30}ms` }}
        className={`
          nymos-reveal opacity-0 group w-full px-5 py-3 text-left
          grid grid-cols-12 gap-3 items-center
          hover:bg-slate-50 dark:hover:bg-slate-800/40 transition
          ${isErro ? 'bg-rose-50/30 dark:bg-rose-950/15' : ''}
        `}
      >
        {isErro && (
          <span
            aria-hidden="true"
            className="absolute left-0 w-[2px] h-12 bg-rose-500"
            style={{ marginLeft: '-2px' }}
          />
        )}

        <div className="col-span-12 sm:col-span-3 flex items-center gap-2 min-w-0">
          <TipoEventoBadge tipo={evento.tipo} compact />
          <span
            className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}
          >
            <span className={`inline-flex w-1.5 h-1.5 rounded-full ${tone.dot}`} />
            {evento.statusLabel}
          </span>
        </div>

        <div className="col-span-12 sm:col-span-4 min-w-0">
          <p className="text-[12px] font-medium text-slate-900 dark:text-slate-100 truncate">
            {evento.trabalhador.nome}
          </p>
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            {evento.trabalhador.cpf}
          </p>
        </div>

        <div className="hidden lg:flex lg:col-span-2">
          <MotivoGatilhoChip
            motivo={evento.motivoGatilho}
            label={evento.motivoGatilhoLabel}
            compact
          />
        </div>

        <div className="col-span-10 sm:col-span-2 min-w-0">
          {evento.recibo ? (
            <p
              className="text-[10px] font-mono text-slate-500 dark:text-slate-500 truncate"
              title={evento.recibo}
            >
              {evento.recibo}
            </p>
          ) : isErro && evento.ultimoErroCodigo ? (
            <p className="text-[10px] font-mono text-rose-700 dark:text-rose-300 font-medium">
              [{evento.ultimoErroCodigo}]
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 dark:text-slate-600">—</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1 flex justify-end">
          <ArrowUpRight
            className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all"
            strokeWidth={2}
          />
        </div>
      </button>

      {isErro && evento.ultimoErroDescricao && (
        <div className="px-5 pb-3 pt-0">
          <div className="rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 px-3 py-2">
            <p className="text-[11px] text-rose-800 dark:text-rose-200 leading-snug">
              <span className="font-mono font-semibold mr-1">[{evento.ultimoErroCodigo}]</span>
              {evento.ultimoErroDescricao}
            </p>
            {evento.sugestaoCorrecao && (
              <p className="mt-1 text-[11px] text-rose-700/80 dark:text-rose-300/70 border-l-2 border-rose-300 dark:border-rose-800 pl-2">
                → {evento.sugestaoCorrecao}
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function Meta({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p
        className={`text-slate-700 dark:text-slate-300 ${mono ? 'font-mono tabular-nums' : ''}`}
      >
        {value}
      </p>
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  limit,
  tone = 'slate',
}: {
  icon: React.ReactNode
  label: string
  value: number
  limit?: string
  tone?: 'slate' | 'emerald' | 'rose' | 'amber'
}) {
  const tones = {
    slate: 'text-slate-900 dark:text-slate-50',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    rose: 'text-rose-700 dark:text-rose-300',
    amber: 'text-amber-700 dark:text-amber-300',
  }
  return (
    <div className="flex flex-col items-center">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </span>
      <p className={`text-lg font-semibold tabular-nums ${tones[tone]}`}>
        {value}
        {limit && (
          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium ml-0.5">
            {limit}
          </span>
        )}
      </p>
    </div>
  )
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const mn = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm}/${yy} ${hh}:${mn}`
  } catch {
    return '—'
  }
}

function formatHora(iso: string): string {
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

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
