import { useMemo, useState } from 'react'
import type {
  AgregadoCarteira,
  CaixaEventosGlobalProps,
  EmpregadorCarteira,
  EventoEsocial,
  MotivoGatilho,
  StatusEvento,
  TipoEvento,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  Search,
  Building2,
  Flame,
  ShieldAlert,
  Hourglass,
  Send,
  Package,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  X,
  ArrowDownNarrowWide,
  Globe,
} from 'lucide-react'
import { AmbienteToggle } from './AmbienteToggle'
import { EventoRow } from './EventoRow'
import { QuickViewDrawer } from './QuickViewDrawer'

const TAB_TIPOS: { value: TipoEvento | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'S-2210', label: 'CAT' },
  { value: 'S-2220', label: 'ASO' },
  { value: 'S-2221', label: 'Tox.' },
  { value: 'S-2240', label: 'Riscos' },
  { value: 'S-2245', label: 'Treinos' },
]

const STATUS_OPTS: { v: StatusEvento | 'todos'; label: string }[] = [
  { v: 'todos', label: 'Todos status' },
  { v: 'disponivel', label: 'Disponível p/ envio' },
  { v: 'em_lote', label: 'Em lote' },
  { v: 'em_transmissao', label: 'Em transmissão' },
  { v: 'rejeitado', label: 'Rejeitado' },
  { v: 'aceito', label: 'Aceito' },
  { v: 'ignorado', label: 'Ignorado' },
]

const MOTIVO_OPTS: { v: MotivoGatilho | 'todos'; label: string }[] = [
  { v: 'todos', label: 'Todos motivos' },
  { v: 'cat_lancada', label: 'CAT lançada' },
  { v: 'novo_aso', label: 'Novo ASO' },
  { v: 'novo_toxicologico', label: 'Novo toxicológico' },
  { v: 'atualizacao_riscos', label: 'Atualização de riscos' },
  { v: 'admissao', label: 'Admissão' },
  { v: 'treinamento_concluido', label: 'Treino concluído' },
  { v: 'manual', label: 'Manual' },
]

export function CaixaEventosGlobal({
  empregadores,
  agregado,
  eventos,
  ambienteAtivo,
  selecionados = [],
  onAmbienteChange,
  onAbrirEvento,
  onAbrirEmpregador,
  onSelecionarEvento,
  onSelecionarTodos,
  onIgnorarSelecionados,
  onReprocessarSelecionados,
  onQuickView,
  onIrParaNovoEvento,
}: CaixaEventosGlobalProps) {
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<TipoEvento | 'todos'>('todos')
  const [statusFiltro, setStatusFiltro] = useState<StatusEvento | 'todos'>('todos')
  const [motivoFiltro, setMotivoFiltro] = useState<MotivoGatilho | 'todos'>('todos')
  const [empregadorFiltro, setEmpregadorFiltro] = useState<string>('')
  const [quickViewEvento, setQuickViewEvento] = useState<EventoEsocial | null>(null)

  const selecionadosSet = useMemo(() => new Set(selecionados), [selecionados])

  const eventosDoAmbiente = useMemo(
    () => eventos.filter((e) => e.ambiente === ambienteAtivo),
    [eventos, ambienteAtivo],
  )

  const contagemPorTipo = useMemo(() => {
    const m: Record<TipoEvento | 'todos', number> = {
      todos: eventosDoAmbiente.length,
      'S-2210': 0,
      'S-2220': 0,
      'S-2221': 0,
      'S-2240': 0,
      'S-2245': 0,
    }
    for (const e of eventosDoAmbiente) m[e.tipo]++
    return m
  }, [eventosDoAmbiente])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const out = eventosDoAmbiente.filter((e) => {
      if (tipoFiltro !== 'todos' && e.tipo !== tipoFiltro) return false
      if (statusFiltro !== 'todos' && e.status !== statusFiltro) return false
      if (motivoFiltro !== 'todos' && e.motivoGatilho !== motivoFiltro) return false
      if (empregadorFiltro && e.empregadorId !== empregadorFiltro) return false
      if (termo) {
        const hay = `${e.trabalhador.nome} ${e.trabalhador.cpf} ${e.recibo ?? ''} ${e.empregadorFantasia ?? ''}`.toLowerCase()
        if (!hay.includes(termo)) return false
      }
      return true
    })
    // Prioriza: SLA risk → rejeitado → em_transmissao → disponivel → resto
    const prio: Record<StatusEvento, number> = {
      em_transmissao: 0,
      rejeitado: 1,
      disponivel: 2,
      em_lote: 3,
      validado: 4,
      rascunho: 5,
      ignorado: 6,
      aceito: 7,
      retificado: 8,
      excluido: 9,
    }
    return out.sort((a, b) => {
      if (a.atrasado !== b.atrasado) return a.atrasado ? -1 : 1
      const pDiff = prio[a.status] - prio[b.status]
      if (pDiff !== 0) return pDiff
      return b.ultimaAtualizacao.localeCompare(a.ultimaAtualizacao)
    })
  }, [eventosDoAmbiente, busca, tipoFiltro, statusFiltro, motivoFiltro, empregadorFiltro])

  const podeReprocessar = selecionados.some(
    (id) => eventos.find((e) => e.id === id)?.status === 'rejeitado',
  )
  const slaRiskCount = filtrados.filter((e) => e.atrasado).length

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap">
          <span className="text-teal-600 dark:text-teal-400 font-medium">Empregadores</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">Carteira completa</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Caixa de Eventos eSocial</span>
        </div>

        {/* Header */}
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Visão consolidada multi-empregador
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 inline-flex items-center gap-2">
                <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" strokeWidth={1.5} />
                Caixa de Eventos eSocial
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">{agregado.empregadoresAtivos}</span> empregadores
                ativos · Lente operacional de leitura cross-carteira · Criação continua dentro de
                cada empregador
              </p>
            </div>

            <AmbienteToggle
              ambiente={ambienteAtivo}
              onChange={(amb) => onAmbienteChange?.(amb)}
            />
          </div>
        </header>

        {/* KPI strip */}
        <div
          style={{ animationDelay: '180ms' }}
          className="nymos-reveal opacity-0 mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <Kpi
            icon={<Hourglass className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Pendentes"
            value={agregado.pendentes}
            tone="slate"
          />
          <Kpi
            icon={<Send className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Em transmissão"
            value={agregado.emTransmissao}
            tone="amber"
            pulse
          />
          <Kpi
            icon={<Package className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Em lote"
            value={agregado.emLote}
            tone="indigo"
          />
          <Kpi
            icon={<CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Aceitos · mês"
            value={agregado.aceitosMes}
            tone="emerald"
          />
          <Kpi
            icon={<XCircle className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="Rejeitados · mês"
            value={agregado.rejeitadosMes}
            tone="rose"
          />
          <Kpi
            icon={<Flame className="w-3.5 h-3.5" strokeWidth={1.75} />}
            label="SLA em risco"
            value={agregado.slaRisk}
            tone={agregado.slaRisk > 0 ? 'rose' : 'emerald'}
          />
        </div>

        {/* Banner SLA */}
        {agregado.slaRisk > 0 && (
          <div
            style={{ animationDelay: '240ms' }}
            className="nymos-reveal opacity-0 mt-4 rounded-2xl border border-rose-200/70 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 px-4 py-3 flex items-start gap-3"
          >
            <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              <Flame className="w-4 h-4" strokeWidth={2} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                {agregado.slaRisk} evento{agregado.slaRisk > 1 ? 's' : ''} com SLA crítico na
                carteira
              </p>
              <p className="text-[12px] text-rose-800/90 dark:text-rose-300/90 mt-0.5">
                CAT 24h ou ASO com prazo legal excedido — priorize antes de fim do dia.
                <span className="block sm:inline sm:ml-1 italic opacity-90">
                  Envie mesmo atrasado: atraso pode gerar autuação · omissão é autuação certa em auditoria.
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStatusFiltro('rejeitado')}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 text-white transition"
            >
              Ver críticos
              <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Banner cert bloqueando */}
        {agregado.certificadosBloqueando > 0 && (
          <div className="nymos-reveal opacity-0 mt-2 rounded-2xl border border-amber-200/70 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-2.5 flex items-center gap-2.5">
            <ShieldAlert
              className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0"
              strokeWidth={2}
            />
            <p className="text-[12px] text-amber-900 dark:text-amber-200">
              <span className="font-semibold">{agregado.certificadosBloqueando} empregador</span>
              {agregado.certificadosBloqueando > 1 ? 'es' : ''} com certificado bloqueando transmissão
            </p>
          </div>
        )}

        {/* Tabs por tipo */}
        <div
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mt-7 border-b border-slate-200 dark:border-slate-800 overflow-x-auto"
        >
          <div role="tablist" className="flex items-end gap-1 min-w-max">
            {TAB_TIPOS.map((tab) => {
              const active = tipoFiltro === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTipoFiltro(tab.value as TipoEvento | 'todos')}
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
                  {tab.label}
                  <span className="text-[11px] tabular-nums text-slate-400 dark:text-slate-500">
                    {contagemPorTipo[tab.value]}
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
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Trabalhador, CPF, recibo ou empregador"
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
            value={empregadorFiltro}
            onChange={(e) => setEmpregadorFiltro(e.target.value)}
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer min-w-[180px]
            "
          >
            <option value="">Todos empregadores</option>
            {empregadores.map((e) => (
              <option key={e.id} value={e.id}>
                {e.fantasia}
              </option>
            ))}
          </select>

          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value as StatusEvento | 'todos')}
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
            value={motivoFiltro}
            onChange={(e) => setMotivoFiltro(e.target.value as MotivoGatilho | 'todos')}
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            {MOTIVO_OPTS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="lg:ml-auto inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <ArrowDownNarrowWide className="w-3 h-3" strokeWidth={1.75} />
            Ordem: prioridade
          </div>
        </div>

        {/* Sticky bar de seleção */}
        {selecionados.length > 0 && (
          <div className="mt-4 sticky top-2 z-10 nymos-reveal opacity-0 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white shadow-[0_8px_24px_-8px_rgba(13,148,136,0.45)] px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
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
              <span className="text-[11px] text-white/70 hidden sm:inline">
                · ações batch cross-empregador
              </span>
            </div>
            <div className="flex items-center gap-2">
              {podeReprocessar && (
                <button
                  type="button"
                  onClick={() => onReprocessarSelecionados?.(selecionados)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white/20 hover:bg-white/25 text-white transition"
                >
                  <RefreshCw className="w-3 h-3" strokeWidth={2.25} />
                  Reprocessar rejeitados
                </button>
              )}
              <button
                type="button"
                onClick={() => onIgnorarSelecionados?.(selecionados)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white text-teal-700 hover:bg-teal-50 transition"
              >
                <EyeOff className="w-3 h-3" strokeWidth={2.25} />
                Ignorar selecionados
              </button>
            </div>
          </div>
        )}

        {/* Lista */}
        <div className="mt-5">
          {filtrados.length === 0 ? (
            <EmptyState
              onLimpar={() => {
                setBusca('')
                setTipoFiltro('todos')
                setStatusFiltro('todos')
                setMotivoFiltro('todos')
                setEmpregadorFiltro('')
              }}
            />
          ) : (
            <div className="space-y-2">
              {filtrados.map((evento, idx) => (
                <EventoRow
                  key={evento.id}
                  evento={evento}
                  revealIndex={idx + 4}
                  selecionavel
                  mostrarEmpregador
                  selecionado={selecionadosSet.has(evento.id)}
                  onSelecionar={(sel) => onSelecionarEvento?.(evento.id, sel)}
                  onQuickView={() => {
                    setQuickViewEvento(evento)
                    onQuickView?.(evento.id)
                  }}
                  onAbrir={() =>
                    onAbrirEvento?.(evento.empregadorId ?? '', evento.id)
                  }
                  onAbrirEmpregador={() =>
                    evento.empregadorId && onAbrirEmpregador?.(evento.empregadorId)
                  }
                  onIgnorar={() => onIgnorarSelecionados?.([evento.id])}
                  onDesignorar={() => console.log('Designorar do global:', evento.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rodapé com nota sobre criação */}
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/30 px-4 py-3 flex items-start gap-2.5">
          <Building2
            className="w-3.5 h-3.5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0"
            strokeWidth={1.75}
          />
          <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Por que não há "Novo evento" aqui?
            </span>{' '}
            Certificado digital e ambiente (prod/homol) são por empregador. Pra evitar transmitir
            com certificado errado, criação de evento sempre acontece dentro do hub do empregador.
            Use o filtro acima pra ir até a empresa correta.
          </p>
          <button
            type="button"
            onClick={onIrParaNovoEvento}
            className="shrink-0 text-[11px] font-medium text-teal-700 dark:text-teal-300 hover:underline"
          >
            Ir pra empregadores →
          </button>
        </div>
      </div>

      <QuickViewDrawer
        evento={quickViewEvento}
        open={quickViewEvento !== null}
        onClose={() => setQuickViewEvento(null)}
        onAbrirDetalhe={() => {
          if (quickViewEvento) {
            onAbrirEvento?.(quickViewEvento.empregadorId ?? '', quickViewEvento.id)
          }
          setQuickViewEvento(null)
        }}
        onIgnorar={() => {
          if (quickViewEvento) onIgnorarSelecionados?.([quickViewEvento.id])
          setQuickViewEvento(null)
        }}
      />
    </div>
  )
}

function Kpi({
  icon,
  label,
  value,
  tone,
  pulse = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'slate' | 'amber' | 'rose' | 'emerald' | 'indigo'
  pulse?: boolean
}) {
  const tones: Record<typeof tone, { bg: string; iconBg: string; text: string; dot: string }> = {
    slate: {
      bg: 'from-slate-50 to-white dark:from-slate-900/60 dark:to-slate-950',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
      text: 'text-slate-900 dark:text-slate-50',
      dot: 'bg-slate-400',
    },
    amber: {
      bg: 'from-amber-50/70 to-white dark:from-amber-950/30 dark:to-slate-950',
      iconBg: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
      text: 'text-amber-900 dark:text-amber-100',
      dot: 'bg-amber-400',
    },
    rose: {
      bg: 'from-rose-50/70 to-white dark:from-rose-950/30 dark:to-slate-950',
      iconBg: 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300',
      text: 'text-rose-900 dark:text-rose-100',
      dot: 'bg-rose-400',
    },
    emerald: {
      bg: 'from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-950',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
      text: 'text-emerald-900 dark:text-emerald-100',
      dot: 'bg-emerald-400',
    },
    indigo: {
      bg: 'from-indigo-50/70 to-white dark:from-indigo-950/30 dark:to-slate-950',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
      text: 'text-indigo-900 dark:text-indigo-100',
      dot: 'bg-indigo-400',
    },
  }
  const t = tones[tone]
  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${t.bg} border border-slate-200/70 dark:border-slate-800 px-4 py-3.5 transition-all duration-300 hover:-translate-y-[1px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className={`mt-1.5 text-2xl font-semibold tabular-nums ${t.text}`}>{value}</p>
        </div>
        <span
          className={`relative shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl ${t.iconBg}`}
        >
          {pulse && value > 0 && (
            <span className={`absolute inset-0 rounded-xl ${t.dot} opacity-30 animate-ping`} />
          )}
          <span className="relative">{icon}</span>
        </span>
      </div>
    </article>
  )
}

function EmptyState({ onLimpar }: { onLimpar: () => void }) {
  return (
    <div className="nymos-reveal opacity-0 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 px-8 py-14 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        Nenhum evento nos filtros atuais
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        Pode ser bom sinal — toda a carteira está em dia. Limpe filtros pra ver tudo.
      </p>
      <button
        type="button"
        onClick={onLimpar}
        className="mt-4 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        Limpar filtros
      </button>
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
