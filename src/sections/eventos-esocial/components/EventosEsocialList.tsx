import { useMemo, useState } from 'react'
import type {
  EventoEsocial,
  EventosEsocialProps,
  FiltrosLista,
  MotivoGatilho,
  StatusEvento,
  TipoEvento,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  Search,
  FileX2,
  ArrowDownNarrowWide,
  Send,
  Plus,
  X,
} from 'lucide-react'
import { KpiStripEventos } from './KpiStripEventos'
import { CertificadoBanner } from './CertificadoBanner'
import { FilaBanner } from './FilaBanner'
import { AmbienteToggle } from './AmbienteToggle'
import { NovoEventoMenu } from './NovoEventoMenu'
import { EventoRow } from './EventoRow'
import { ModuleSubTabs } from './ModuleSubTabs'
import { QuickViewDrawer } from './QuickViewDrawer'

const TAB_TIPOS: { value: TipoEvento | 'todos'; label: string; sub: string }[] = [
  { value: 'todos', label: 'Todos', sub: '' },
  { value: 'S-2210', label: 'CAT', sub: 'S-2210' },
  { value: 'S-2220', label: 'ASO', sub: 'S-2220' },
  { value: 'S-2221', label: 'Toxicológico', sub: 'S-2221' },
  { value: 'S-2240', label: 'Riscos', sub: 'S-2240' },
  { value: 'S-2245', label: 'Treinamentos', sub: 'S-2245' },
]

const STATUS_OPTS: { v: StatusEvento | 'todos'; label: string }[] = [
  { v: 'todos', label: 'Todos status' },
  { v: 'disponivel', label: 'Disponível p/ envio' },
  { v: 'em_lote', label: 'Em lote' },
  { v: 'ignorado', label: 'Ignorado' },
  { v: 'rascunho', label: 'Rascunho' },
  { v: 'validado', label: 'Validado' },
  { v: 'em_transmissao', label: 'Em transmissão' },
  { v: 'aceito', label: 'Aceito' },
  { v: 'rejeitado', label: 'Rejeitado' },
  { v: 'retificado', label: 'Retificado' },
  { v: 'excluido', label: 'Excluído' },
]

const MOTIVO_OPTS: { v: MotivoGatilho | 'todos'; label: string }[] = [
  { v: 'todos', label: 'Todos motivos' },
  { v: 'cadastro_trabalhador', label: 'Cadastro' },
  { v: 'admissao', label: 'Admissão' },
  { v: 'vinculo_risco', label: 'Vínculo de risco' },
  { v: 'atualizacao_riscos', label: 'Atualização de riscos' },
  { v: 'alteracao_responsavel', label: 'Alteração de responsável' },
  { v: 'inicio_ghe', label: 'Início em GHE' },
  { v: 'novo_aso', label: 'Novo ASO' },
  { v: 'novo_toxicologico', label: 'Novo toxicológico' },
  { v: 'cat_lancada', label: 'CAT lançada' },
  { v: 'treinamento_concluido', label: 'Treino concluído' },
  { v: 'manual', label: 'Manual' },
  { v: 'retificacao', label: 'Retificação' },
]

const ORDENACAO_OPTS = [
  { v: 'mais_recente', label: 'Mais recentes' },
  { v: 'mais_antigo', label: 'Mais antigos' },
  { v: 'status', label: 'Por status' },
  { v: 'trabalhador', label: 'Por trabalhador' },
  { v: 'tipo', label: 'Por tipo' },
] as const

const ORIGEM_OPTS = [
  { v: 'todos', label: 'Todas origens' },
  { v: 'manual', label: 'Manual' },
  { v: 'sugerido_aso', label: 'Sugerido (ASO)' },
  { v: 'sugerido_risco', label: 'Sugerido (Risco)' },
  { v: 'sugerido_treinamento', label: 'Sugerido (Treino)' },
  { v: 'retificacao', label: 'Retificação' },
] as const

export function EventosEsocialList({
  empregadorContexto,
  certificadoStatus,
  agregado,
  filaAtual,
  eventos,
  filtros,
  subTela = 'eventos',
  lotesEmTransmissao = 0,
  selecionados = [],
  onSubTelaChange,
  onSelecionarEvento,
  onSelecionarTodos,
  onIgnorarEvento,
  onDesignorarEvento,
  onQuickView,
  onGerarLote,
  onAmbienteChange,
  onNovoEvento,
  onAbrirEvento,
  onAbrirFila,
  onConfigurarCertificado,
  onValidarXsd,
  onEnviarParaFila,
  onRetificar,
  onExcluir,
  onBaixarXml,
  onFiltrosChange,
}: EventosEsocialProps) {
  const setFiltros = (next: FiltrosLista) => onFiltrosChange?.(next)
  const [quickViewEvento, setQuickViewEvento] = useState<EventoEsocial | null>(null)
  const selecionadosSet = useMemo(() => new Set(selecionados), [selecionados])

  const eventosDoAmbiente = useMemo(
    () => eventos.filter((e) => e.ambiente === filtros.ambiente),
    [eventos, filtros.ambiente],
  )

  const contagemPorTipo = useMemo(() => {
    const map: Record<TipoEvento | 'todos', number> = {
      todos: eventosDoAmbiente.length,
      'S-2210': 0,
      'S-2220': 0,
      'S-2240': 0,
      'S-2245': 0,
    }
    for (const e of eventosDoAmbiente) {
      map[e.tipo]++
    }
    return map
  }, [eventosDoAmbiente])

  const pendentesPorTipo = useMemo(() => {
    const map: Record<TipoEvento | 'todos', number> = {
      todos: 0,
      'S-2210': 0,
      'S-2220': 0,
      'S-2240': 0,
      'S-2245': 0,
    }
    for (const e of eventosDoAmbiente) {
      if (e.status === 'rascunho' || e.status === 'rejeitado') {
        map[e.tipo]++
        map.todos++
      }
    }
    return map
  }, [eventosDoAmbiente])

  const filtrados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    const out = eventosDoAmbiente.filter((e) => {
      if (filtros.tipo !== 'todos' && e.tipo !== filtros.tipo) return false
      if (filtros.status !== 'todos' && e.status !== filtros.status) return false
      if (filtros.origem !== 'todos' && e.origem !== filtros.origem) return false
      if (termo) {
        const hay = `${e.trabalhador.nome} ${e.trabalhador.cpf} ${e.recibo ?? ''} ${e.tipo}`.toLowerCase()
        if (!hay.includes(termo)) return false
      }
      if (filtros.periodoInicio && e.dataFatoGerador < filtros.periodoInicio) return false
      if (filtros.periodoFim && e.dataFatoGerador > filtros.periodoFim) return false
      if (filtros.motivoGatilho !== 'todos' && e.motivoGatilho !== filtros.motivoGatilho) return false
      return true
    })

    const statusRank: Record<StatusEvento, number> = {
      disponivel: 0,
      rejeitado: 1,
      rascunho: 2,
      em_transmissao: 3,
      validado: 4,
      em_lote: 5,
      aceito: 6,
      ignorado: 7,
      retificado: 8,
      excluido: 9,
    }

    switch (filtros.ordenacao) {
      case 'mais_recente':
        return out.sort((a, b) => b.ultimaAtualizacao.localeCompare(a.ultimaAtualizacao))
      case 'mais_antigo':
        return out.sort((a, b) => a.ultimaAtualizacao.localeCompare(b.ultimaAtualizacao))
      case 'status':
        return out.sort((a, b) => statusRank[a.status] - statusRank[b.status])
      case 'trabalhador':
        return out.sort((a, b) => a.trabalhador.nome.localeCompare(b.trabalhador.nome, 'pt-BR'))
      case 'tipo':
        return out.sort((a, b) => a.tipo.localeCompare(b.tipo))
      default:
        return out
    }
  }, [eventosDoAmbiente, filtros])

  const certificadoBloqueia =
    certificadoStatus.status === 'expirado' ||
    certificadoStatus.status === 'invalido' ||
    !certificadoStatus.configurado

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div
          className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap"
          aria-label="Trilha"
        >
          <span className="text-teal-600 dark:text-teal-400 font-medium">Empregadores</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Eventos eSocial</span>
        </div>

        {/* Header */}
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Conformidade eSocial
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Eventos eSocial
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">{contagemPorTipo.todos}</span> eventos no ambiente ·{' '}
                <span className="tabular-nums">{pendentesPorTipo.todos}</span> pendentes de revisão
              </p>
              <p
                className="mt-1 text-[11px] text-slate-500 dark:text-slate-500 inline-flex items-center gap-1"
                title="Plataforma envia eventos ao eSocial — não recebe atualizações de volta. Trabalhadores devem ser cadastrados manualmente; a partir de cada modificação, eventos são auto-gerados aqui."
              >
                <span className="inline-block w-1 h-1 rounded-full bg-slate-400" aria-hidden="true" />
                Plataforma envia ao eSocial — não recebe. Trabalhadores são cadastrados manualmente.
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                CNPJ <span className="font-mono">{empregadorContexto.cnpj}</span>
                {empregadorContexto.diasAteVigencia !== null && (
                  <>
                    {' '}
                    · Vigência NR-1 em{' '}
                    <span
                      className={`font-mono ${
                        empregadorContexto.diasAteVigencia <= 30
                          ? 'text-rose-700 dark:text-rose-300 font-semibold'
                          : ''
                      }`}
                    >
                      {empregadorContexto.diasAteVigencia} dias
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <AmbienteToggle
                ambiente={filtros.ambiente}
                onChange={(amb) => {
                  setFiltros({ ...filtros, ambiente: amb })
                  onAmbienteChange?.(amb)
                }}
              />
              <NovoEventoMenu
                onSelect={(tipo) => onNovoEvento?.(tipo)}
              />
            </div>
          </div>
        </header>

        {/* Sub-tabs do módulo Gestão eSocial */}
        <div className="mt-5">
          <ModuleSubTabs
            ativa={subTela}
            contadores={{
              eventos: eventos.filter((e) => e.status === 'disponivel').length,
              lotes: lotesEmTransmissao,
            }}
            onChange={(t) => onSubTelaChange?.(t)}
          />
        </div>

        {/* Banner certificado */}
        <div className="mt-5 space-y-2">
          <CertificadoBanner
            certificado={certificadoStatus}
            onConfigurarCertificado={onConfigurarCertificado}
          />
          <FilaBanner fila={filaAtual} onAbrirFila={onAbrirFila} />
        </div>

        {/* KPIs */}
        <div className="mt-6">
          <KpiStripEventos agregado={agregado} />
        </div>

        {/* Tabs */}
        <div
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mt-7 border-b border-slate-200 dark:border-slate-800 overflow-x-auto"
        >
          <div
            role="tablist"
            aria-label="Tipo de evento"
            className="flex items-end gap-1 min-w-max"
          >
            {TAB_TIPOS.map((tab) => {
              const active = filtros.tipo === tab.value
              const pendentes = pendentesPorTipo[tab.value]
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() =>
                    setFiltros({ ...filtros, tipo: tab.value as TipoEvento | 'todos' })
                  }
                  className={`
                    relative inline-flex items-center gap-2 px-3.5 py-2.5
                    text-sm font-medium transition border-b-2 -mb-px
                    ${
                      active
                        ? 'text-teal-700 dark:text-teal-300 border-teal-600 dark:border-teal-400'
                        : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  {tab.sub && (
                    <span className="font-mono text-[10px] opacity-60 hidden sm:inline">
                      {tab.sub}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                      {contagemPorTipo[tab.value]}
                    </span>
                    {pendentes > 0 && (
                      <span
                        className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-900"
                        title={`${pendentes} pendentes`}
                      >
                        {pendentes}
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtros */}
        <div
          style={{ animationDelay: '380ms' }}
          className="nymos-reveal opacity-0 mt-4 flex flex-col lg:flex-row lg:items-center gap-3"
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
              placeholder="Trabalhador, CPF ou recibo"
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

          <select
            value={filtros.status}
            onChange={(e) =>
              setFiltros({ ...filtros, status: e.target.value as StatusEvento | 'todos' })
            }
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            {STATUS_OPTS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filtros.origem}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                origem: e.target.value as FiltrosLista['origem'],
              })
            }
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            {ORIGEM_OPTS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filtros.motivoGatilho}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                motivoGatilho: e.target.value as FiltrosLista['motivoGatilho'],
              })
            }
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
            aria-label="Filtrar por motivo gatilho"
          >
            {MOTIVO_OPTS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="relative lg:ml-auto">
            <ArrowDownNarrowWide
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
              strokeWidth={1.75}
            />
            <select
              value={filtros.ordenacao}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ordenacao: e.target.value as FiltrosLista['ordenacao'],
                })
              }
              className="
                appearance-none pl-8 pr-7 py-2 rounded-xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200 dark:border-slate-800
                text-sm text-slate-700 dark:text-slate-200
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                transition cursor-pointer
              "
              aria-label="Ordenar por"
            >
              {ORDENACAO_OPTS.map((o) => (
                <option key={o.v} value={o.v}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Barra de seleção: aparece quando há eventos selecionados */}
        {selecionados.length > 0 && (
          <div className="mt-4 sticky top-2 z-10 nymos-reveal opacity-0 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white shadow-[0_8px_24px_-8px_rgba(13,148,136,0.45)] px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => onSelecionarTodos?.(false)}
                className="inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-white/15 transition"
                aria-label="Limpar seleção"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
              <span className="text-sm font-medium tabular-nums">
                {selecionados.length} selecionado{selecionados.length > 1 ? 's' : ''}
              </span>
              {selecionados.length > 50 && (
                <span className="text-[11px] bg-rose-500/30 px-1.5 py-0.5 rounded font-mono">
                  Limite eSocial: 50 por lote
                </span>
              )}
              <span className="text-[11px] text-white/70 hidden sm:inline-block">
                · Pronto pra enviar como lote ao governo
              </span>
            </div>
            <button
              type="button"
              onClick={() => onGerarLote?.(selecionados)}
              disabled={selecionados.length > 50}
              className={`
                inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition
                ${
                  selecionados.length > 50
                    ? 'bg-white/30 text-white/60 cursor-not-allowed'
                    : 'bg-white text-teal-700 hover:bg-teal-50'
                }
              `}
            >
              <Send className="w-3.5 h-3.5" strokeWidth={2.25} />
              Gerar lote · {selecionados.length}
            </button>
          </div>
        )}

        {/* Lista de eventos */}
        <div className="mt-5">
          {filtrados.length === 0 ? (
            <EmptyState
              isFiltered={
                filtros.busca !== '' ||
                filtros.tipo !== 'todos' ||
                filtros.status !== 'todos' ||
                filtros.origem !== 'todos' ||
                filtros.motivoGatilho !== 'todos'
              }
              certificadoBloqueia={certificadoBloqueia}
              ambiente={filtros.ambiente}
              onNovoEvento={() => onNovoEvento?.('S-2210')}
              onConfigurarCertificado={onConfigurarCertificado}
              onClear={() =>
                setFiltros({
                  ...filtros,
                  busca: '',
                  tipo: 'todos',
                  status: 'todos',
                  origem: 'todos',
                  motivoGatilho: 'todos',
                })
              }
            />
          ) : (
            <div className="space-y-2">
              {filtrados.map((evento, idx) => (
                <EventoRow
                  key={evento.id}
                  evento={evento}
                  revealIndex={idx + 6}
                  selecionavel
                  selecionado={selecionadosSet.has(evento.id)}
                  onSelecionar={(sel) => onSelecionarEvento?.(evento.id, sel)}
                  onQuickView={() => {
                    setQuickViewEvento(evento)
                    onQuickView?.(evento.id)
                  }}
                  onIgnorar={() => onIgnorarEvento?.(evento.id)}
                  onDesignorar={() => onDesignorarEvento?.(evento.id)}
                  onAbrir={() => onAbrirEvento?.(evento.id)}
                  onValidarXsd={() => onValidarXsd?.(evento.id)}
                  onEnviarParaFila={() => onEnviarParaFila?.(evento.id)}
                  onRetificar={() => onRetificar?.(evento.id)}
                  onExcluir={() => {
                    const just = prompt('Justificativa da exclusão (mín. 20 caracteres):') ?? ''
                    if (just.trim().length >= 20) {
                      onExcluir?.(evento.id, just.trim())
                    }
                  }}
                  onBaixarXml={() => onBaixarXml?.(evento.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickViewDrawer
        evento={quickViewEvento}
        open={quickViewEvento !== null}
        onClose={() => setQuickViewEvento(null)}
        onAbrirDetalhe={() => {
          if (quickViewEvento) onAbrirEvento?.(quickViewEvento.id)
          setQuickViewEvento(null)
        }}
        onIgnorar={() => {
          if (quickViewEvento) onIgnorarEvento?.(quickViewEvento.id)
          setQuickViewEvento(null)
        }}
        onDesignorar={() => {
          if (quickViewEvento) onDesignorarEvento?.(quickViewEvento.id)
          setQuickViewEvento(null)
        }}
      />
    </div>
  )
}

function EmptyState({
  isFiltered,
  certificadoBloqueia,
  ambiente,
  onNovoEvento,
  onConfigurarCertificado,
  onClear,
}: {
  isFiltered: boolean
  certificadoBloqueia: boolean
  ambiente: 'producao' | 'homologacao'
  onNovoEvento?: () => void
  onConfigurarCertificado?: () => void
  onClear?: () => void
}) {
  return (
    <div
      className="
        nymos-reveal opacity-0
        rounded-2xl border border-dashed border-slate-300 dark:border-slate-700
        bg-white/40 dark:bg-slate-900/30
        px-8 py-14
        flex flex-col items-center text-center
      "
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <FileX2 className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isFiltered
          ? 'Nenhum evento no filtro atual'
          : `Nenhum evento em ${ambiente === 'producao' ? 'produção' : 'homologação'}`}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isFiltered
          ? 'Ajuste os filtros ou as tabs acima para ver outros eventos.'
          : certificadoBloqueia
            ? 'Comece configurando o certificado digital deste Empregador para liberar transmissões.'
            : 'Comece criando seu primeiro evento eSocial.'}
      </p>
      <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
        {isFiltered ? (
          <button
            type="button"
            onClick={onClear}
            className="
              px-3.5 py-2 rounded-xl text-sm font-medium
              text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
              transition
            "
          >
            Limpar filtros
          </button>
        ) : null}
        {certificadoBloqueia ? (
          <button
            type="button"
            onClick={onConfigurarCertificado}
            className="
              inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
              bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400
              text-white font-medium text-sm transition
            "
          >
            Configurar certificado
          </button>
        ) : (
          <button
            type="button"
            onClick={onNovoEvento}
            className="
              inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
              bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
              text-white font-medium text-sm transition
            "
          >
            Novo evento
          </button>
        )}
      </div>
    </div>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes drawer-fade-in {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal, .drawer-fade {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
