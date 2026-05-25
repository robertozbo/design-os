import { useMemo } from 'react'
import type {
  FiltrosLotes,
  Lote,
  LotesListProps,
  StatusLote,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  Search,
  Package,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Radio,
  Inbox,
} from 'lucide-react'
import { AmbienteToggle } from './AmbienteToggle'
import { AmbienteBadge } from './AmbienteBadge'
import { ModuleSubTabs } from './ModuleSubTabs'

const STATUS_FILTROS: { v: StatusLote | 'todos'; label: string }[] = [
  { v: 'todos', label: 'Todos' },
  { v: 'em_transmissao', label: 'Em transmissão' },
  { v: 'recepcionado', label: 'Recepcionado' },
  { v: 'processado_sucesso', label: 'Sucesso' },
  { v: 'processado_com_erros', label: 'Com erros' },
  { v: 'processado_com_advertencia', label: 'Advertências' },
  { v: 'cancelado', label: 'Cancelado' },
]

const STATUS_TONE: Record<
  StatusLote,
  { dot: string; text: string; bg: string; ring: string; pulse?: boolean; Icon: typeof CheckCircle2 }
> = {
  em_transmissao: {
    dot: 'bg-amber-500',
    text: 'text-amber-800 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'ring-amber-200 dark:ring-amber-900',
    pulse: true,
    Icon: Radio,
  },
  recepcionado: {
    dot: 'bg-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    ring: 'ring-sky-200 dark:ring-sky-900',
    Icon: Inbox,
  },
  processado_sucesso: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    ring: 'ring-emerald-200 dark:ring-emerald-900',
    Icon: CheckCircle2,
  },
  processado_com_erros: {
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    ring: 'ring-rose-200 dark:ring-rose-900',
    Icon: XCircle,
  },
  processado_com_advertencia: {
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    ring: 'ring-amber-200 dark:ring-amber-900',
    Icon: AlertTriangle,
  },
  cancelado: {
    dot: 'bg-stone-400',
    text: 'text-stone-600 dark:text-stone-400',
    bg: 'bg-stone-100 dark:bg-stone-800/60',
    ring: 'ring-stone-200 dark:ring-stone-700',
    Icon: XCircle,
  },
}

export function LotesList({
  empregadorContexto,
  lotes,
  filtros,
  subTela = 'lotes',
  lotesEmTransmissao = 0,
  eventosDisponiveis = 0,
  onSubTelaChange,
  onAbrirLote,
  onAmbienteChange,
  onFiltrosChange,
  onBaixarXml,
  onBaixarProtocolo,
}: LotesListProps) {
  const setFiltros = (next: FiltrosLotes) => onFiltrosChange?.(next)

  const lotesDoAmbiente = useMemo(
    () => lotes.filter((l) => l.ambiente === filtros.ambiente),
    [lotes, filtros.ambiente],
  )

  const contagemPorStatus = useMemo(() => {
    const m: Record<StatusLote | 'todos', number> = {
      todos: lotesDoAmbiente.length,
      em_transmissao: 0,
      recepcionado: 0,
      processado_sucesso: 0,
      processado_com_erros: 0,
      processado_com_advertencia: 0,
      cancelado: 0,
    }
    for (const l of lotesDoAmbiente) m[l.status]++
    return m
  }, [lotesDoAmbiente])

  const filtrados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    return lotesDoAmbiente
      .filter((l) => {
        if (filtros.status !== 'todos' && l.status !== filtros.status) return false
        if (termo) {
          const hay = `${l.numeroSequencial} ${l.protocoloGoverno ?? ''} ${l.id}`.toLowerCase()
          if (!hay.includes(termo)) return false
        }
        if (filtros.periodoInicio && l.geradoEm < filtros.periodoInicio) return false
        if (filtros.periodoFim && l.geradoEm > filtros.periodoFim) return false
        return true
      })
      .sort((a, b) => b.geradoEm.localeCompare(a.geradoEm))
  }, [lotesDoAmbiente, filtros])

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap">
          <span className="text-teal-600 dark:text-teal-400 font-medium">Empregadores</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">Gestão eSocial</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Lotes</span>
        </div>

        {/* Header */}
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Gestão eSocial · Lotes
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Lotes de Eventos
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">{contagemPorStatus.todos}</span> lotes no ambiente ·{' '}
                Histórico completo de envelopes enviados ao governo
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                CNPJ <span className="font-mono">{empregadorContexto.cnpj}</span>
              </p>
            </div>
            <AmbienteToggle
              ambiente={filtros.ambiente}
              onChange={(amb) => {
                setFiltros({ ...filtros, ambiente: amb })
                onAmbienteChange?.(amb)
              }}
            />
          </div>
        </header>

        {/* Sub-tabs do módulo */}
        <div className="mt-5">
          <ModuleSubTabs
            ativa={subTela}
            contadores={{ eventos: eventosDisponiveis, lotes: lotesEmTransmissao }}
            onChange={(t) => onSubTelaChange?.(t)}
          />
        </div>

        {/* Filtros */}
        <div
          style={{ animationDelay: '260ms' }}
          className="nymos-reveal opacity-0 mt-6 flex flex-col lg:flex-row lg:items-center gap-3"
        >
          <div className="relative flex-1 lg:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              placeholder="Número do lote ou protocolo"
              className="
                w-full pl-9 pr-3 py-2 rounded-xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200 dark:border-slate-800
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                text-sm text-slate-700 dark:text-slate-200
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                transition
              "
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTROS.map((opt) => {
              const active = filtros.status === opt.v
              const count = contagemPorStatus[opt.v]
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setFiltros({ ...filtros, status: opt.v })}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition
                    ${
                      active
                        ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-[0_2px_8px_-2px_rgba(13,148,136,0.45)]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {opt.label}
                  <span
                    className={`text-[10px] tabular-nums ${
                      active ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Lista de lotes */}
        <div className="mt-5">
          {filtrados.length === 0 ? (
            <EmptyState ambiente={filtros.ambiente} />
          ) : (
            <div className="space-y-2">
              {filtrados.map((lote, idx) => (
                <LoteRow
                  key={lote.id}
                  lote={lote}
                  revealIndex={idx}
                  onAbrir={() => onAbrirLote?.(lote.id)}
                  onBaixarXml={() => onBaixarXml?.(lote.id)}
                  onBaixarProtocolo={() => onBaixarProtocolo?.(lote.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoteRow({
  lote,
  revealIndex,
  onAbrir,
  onBaixarXml,
  onBaixarProtocolo,
}: {
  lote: Lote
  revealIndex: number
  onAbrir: () => void
  onBaixarXml: () => void
  onBaixarProtocolo: () => void
}) {
  const tone = STATUS_TONE[lote.status]
  const Icon = tone.Icon
  const isErro = lote.status === 'processado_com_erros'

  return (
    <article
      style={{ animationDelay: `${revealIndex * 40 + 200}ms` }}
      className={`
        nymos-reveal opacity-0 group relative
        rounded-2xl border bg-white/80 dark:bg-slate-900/40
        transition-all duration-200
        hover:border-slate-300 dark:hover:border-slate-700
        hover:shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]
        dark:hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.55)]
        ${isErro ? 'border-rose-200/70 dark:border-rose-900/50' : 'border-slate-200 dark:border-slate-800'}
      `}
    >
      <button
        type="button"
        onClick={onAbrir}
        className="w-full text-left px-4 py-3 grid grid-cols-12 gap-3 items-center"
      >
        {/* Ícone + número */}
        <div className="col-span-12 sm:col-span-3 flex items-center gap-2.5">
          <span
            className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-1">
              <Package className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
              Lote #{lote.numeroSequencial}
            </p>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {lote.protocoloGoverno ?? '—'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="col-span-6 sm:col-span-3 min-w-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}
          >
            <span className="relative inline-flex w-1.5 h-1.5">
              {tone.pulse && (
                <span className={`absolute inset-0 rounded-full ${tone.dot} opacity-60 animate-ping`} />
              )}
              <span className={`relative inline-flex w-1.5 h-1.5 rounded-full ${tone.dot}`} />
            </span>
            {lote.statusLabel}
          </span>
        </div>

        {/* Eventos */}
        <div className="col-span-6 sm:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Eventos
          </p>
          <p className="text-[13px] tabular-nums text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{lote.quantidadeEventos}</span>
            <span className="text-slate-400 dark:text-slate-600">/50</span>
            {lote.totalRejeitados > 0 && (
              <span className="ml-2 text-[10px] text-rose-700 dark:text-rose-300 font-medium">
                {lote.totalRejeitados} rejeitado{lote.totalRejeitados > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        {/* Datas */}
        <div className="hidden md:block md:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Gerado
          </p>
          <p className="text-[12px] text-slate-700 dark:text-slate-300 tabular-nums">
            {formatDateTime(lote.geradoEm)}
          </p>
        </div>

        {/* Ações */}
        <div className="col-span-12 sm:col-span-2 flex sm:justify-end items-center gap-1.5">
          <AmbienteBadge ambiente={lote.ambiente} />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onBaixarXml()
            }}
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition opacity-0 group-hover:opacity-100"
            title="Baixar XML do lote"
            aria-label="Baixar XML do lote"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
          {lote.protocoloGoverno && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onBaixarProtocolo()
              }}
              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition opacity-0 group-hover:opacity-100"
              title="Baixar protocolo do governo"
              aria-label="Baixar protocolo do governo"
            >
              <FileText className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          )}
          <ChevronRight
            className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all"
            strokeWidth={1.75}
          />
        </div>
      </button>

      {/* Strip de erro */}
      {isErro && lote.ultimoErroDescricao && (
        <div className="px-4 pb-3 pt-0">
          <div className="rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 px-3 py-2">
            <p className="text-[11px] text-rose-800 dark:text-rose-200 leading-snug">
              <span className="font-mono font-semibold mr-1">[{lote.ultimoErroCodigo}]</span>
              {lote.ultimoErroDescricao}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}

function EmptyState({ ambiente }: { ambiente: 'producao' | 'homologacao' }) {
  return (
    <div className="nymos-reveal opacity-0 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 px-8 py-14 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Package className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Nenhum lote em {ambiente === 'producao' ? 'produção' : 'homologação'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Lotes aparecem aqui após você selecionar eventos na tela Eventos e clicar em "Gerar lote para eSocial".
      </p>
    </div>
  )
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
