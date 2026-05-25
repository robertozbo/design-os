import { useMemo, useState } from 'react'
import type {
  FiltroPrazo,
  FiltroPrioridade,
  FiltrosPlano,
  PlanoAcaoItem,
  PlanoAcaoPgrProps,
  StatusItem,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import {
  Plus,
  Search,
  Download,
  ChevronRight,
  CalendarDays,
  ListChecks,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  Filter,
  X,
  Check,
  KanbanSquare,
} from 'lucide-react'
import { KpiStripPlano } from './KpiStripPlano'
import { ItemCard } from './ItemCard'
import { CronogramaTimeline } from './CronogramaTimeline'

type ViewMode = 'kanban' | 'cronograma'

const STATUS_COLUNAS: {
  value: StatusItem
  label: string
  helper: string
  icon: React.ReactNode
  tone: {
    header: string
    bg: string
    chip: string
  }
}[] = [
  {
    value: 'planejado',
    label: 'Planejado',
    helper: 'A iniciar',
    icon: <ListChecks className="w-3.5 h-3.5" strokeWidth={1.75} />,
    tone: {
      header: 'text-slate-700 dark:text-slate-300',
      bg: 'bg-slate-100/60 dark:bg-slate-900/40',
      chip: 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
  },
  {
    value: 'em_execucao',
    label: 'Em execução',
    helper: 'Em andamento',
    icon: <Loader2 className="w-3.5 h-3.5" strokeWidth={1.75} />,
    tone: {
      header: 'text-teal-700 dark:text-teal-300',
      bg: 'bg-teal-50/40 dark:bg-teal-950/20',
      chip: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    },
  },
  {
    value: 'em_revisao',
    label: 'Em revisão',
    helper: 'Aguardando aprovação',
    icon: <RefreshCcw className="w-3.5 h-3.5" strokeWidth={1.75} />,
    tone: {
      header: 'text-violet-700 dark:text-violet-300',
      bg: 'bg-violet-50/40 dark:bg-violet-950/20',
      chip: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    },
  },
  {
    value: 'concluido',
    label: 'Concluído',
    helper: 'Finalizado',
    icon: <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />,
    tone: {
      header: 'text-emerald-700 dark:text-emerald-300',
      bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
      chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    },
  },
]

const PRIORIDADE_OPTS: { v: FiltroPrioridade; label: string }[] = [
  { v: 'todas', label: 'Todas' },
  { v: 'alta', label: 'Alta' },
  { v: 'media', label: 'Média' },
  { v: 'baixa', label: 'Baixa' },
]

const PRAZO_OPTS: { v: FiltroPrazo; label: string }[] = [
  { v: 'todos', label: 'Todos prazos' },
  { v: 'vencidos', label: 'Vencidos' },
  { v: 'proximos_7d', label: 'Próximos 7 dias' },
  { v: 'proximos_30d', label: 'Próximos 30 dias' },
]

const HOJE_REF = new Date('2026-04-29T12:00:00')

function dentroDoFiltroPrazo(item: PlanoAcaoItem, prazoFiltro: FiltroPrazo): boolean {
  if (prazoFiltro === 'todos') return true
  if (item.status === 'concluido') return false
  const prazo = new Date(item.prazo + 'T12:00:00')
  const dayMs = 1000 * 60 * 60 * 24
  const dias = Math.ceil((prazo.getTime() - HOJE_REF.getTime()) / dayMs)
  if (prazoFiltro === 'vencidos') return dias < 0
  if (prazoFiltro === 'proximos_7d') return dias >= 0 && dias <= 7
  if (prazoFiltro === 'proximos_30d') return dias >= 0 && dias <= 30
  return true
}

export function PlanoAcaoBoard({
  empregadorContexto,
  planoVigente,
  ciclosHistorico,
  kpis,
  filtrosAtuais,
  responsaveisDisponiveis,
  setoresAfetados,
  itens,
  onSelectCiclo,
  onFiltrosChange,
  onAddItem,
  onSelectItem,
  onChangeItemStatus,
  onExportPgrIntent,
  onNavigateToAvaliacao,
}: PlanoAcaoPgrProps) {
  const [setorPickerOpen, setSetorPickerOpen] = useState(false)
  const [respPickerOpen, setRespPickerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')

  const filtros = filtrosAtuais
  const setFiltros = (next: FiltrosPlano) => onFiltrosChange?.(next)

  const filteredItens = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    return itens.filter((it) => {
      if (filtros.setoresIds.length > 0) {
        if (!it.origem.setorId || !filtros.setoresIds.includes(it.origem.setorId)) return false
      }
      if (filtros.responsaveisIds.length > 0) {
        if (!it.responsavel || !filtros.responsaveisIds.includes(it.responsavel.id)) return false
      }
      if (filtros.prioridade !== 'todas' && it.prioridade !== filtros.prioridade) return false
      if (!dentroDoFiltroPrazo(it, filtros.prazo)) return false
      if (termo) {
        const haystack = `${it.titulo} ${it.descricao} ${it.origem.perigoNome}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }
      return true
    })
  }, [itens, filtros])

  const itensPorStatus = useMemo(() => {
    const map: Record<StatusItem, PlanoAcaoItem[]> = {
      planejado: [],
      em_execucao: [],
      em_revisao: [],
      concluido: [],
    }
    for (const it of filteredItens) {
      map[it.status].push(it)
    }
    return map
  }, [filteredItens])

  const setoresLabel =
    filtros.setoresIds.length === 0
      ? 'Todos setores'
      : filtros.setoresIds.length === 1
        ? setoresAfetados.find((s) => s.id === filtros.setoresIds[0])?.nome ?? '1 setor'
        : `${filtros.setoresIds.length} setores`

  const respLabel =
    filtros.responsaveisIds.length === 0
      ? 'Todos responsáveis'
      : filtros.responsaveisIds.length === 1
        ? responsaveisDisponiveis.find((r) => r.id === filtros.responsaveisIds[0])?.nome.split(' ')[0] ?? '1 responsável'
        : `${filtros.responsaveisIds.length} responsáveis`

  const totalActiveFilters =
    (filtros.busca ? 1 : 0) +
    (filtros.setoresIds.length > 0 ? 1 : 0) +
    (filtros.responsaveisIds.length > 0 ? 1 : 0) +
    (filtros.prazo !== 'todos' ? 1 : 0) +
    (filtros.prioridade !== 'todas' ? 1 : 0)

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8 pt-8 pb-16">
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
          <span className="text-slate-500 dark:text-slate-400">Plano de Ação & PGR</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Plano de Ação NR-1 / PGR
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-md bg-teal-50 dark:bg-teal-950/40 text-[10px] font-medium text-teal-700 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60">
              <CalendarDays className="w-3 h-3" strokeWidth={2} />
              Ciclo {planoVigente.ciclo} · vigente
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {planoVigente.nome}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {empregadorContexto.razaoSocial} · CNPJ{' '}
                <span className="font-mono">{empregadorContexto.cnpj}</span>
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Derivado de{' '}
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {planoVigente.avaliacaoOrigemNome}
                </span>{' '}
                · Vigente desde{' '}
                <span className="font-mono">{planoVigente.vigenteDesde}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {ciclosHistorico.length > 0 && (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) onSelectCiclo?.(e.target.value)
                  }}
                  className="
                    px-3 py-2 rounded-xl
                    bg-white/80 dark:bg-slate-900/40
                    border border-slate-200 dark:border-slate-800
                    text-sm text-slate-700 dark:text-slate-200
                    focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                    transition cursor-pointer
                  "
                  aria-label="Histórico de ciclos"
                >
                  <option value="">Histórico…</option>
                  {ciclosHistorico.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ciclo} · {c.concluidos}/{c.totalItens} concluídos
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={onExportPgrIntent}
                className="
                  inline-flex items-center justify-center gap-2
                  px-3.5 py-2.5 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  hover:bg-slate-50 dark:hover:bg-slate-800/60
                  text-slate-700 dark:text-slate-200 font-medium text-sm
                  transition
                "
              >
                <Download className="w-4 h-4" strokeWidth={1.75} />
                Exportar PGR
              </button>
              <button
                type="button"
                onClick={onAddItem}
                className="
                  inline-flex items-center justify-center gap-2
                  px-4 py-2.5 rounded-xl
                  bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                  dark:bg-teal-500 dark:hover:bg-teal-400
                  text-white font-medium text-sm
                  shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                  dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                  transition
                "
              >
                <Plus className="w-4 h-4" strokeWidth={2.25} />
                Novo item
              </button>
            </div>
          </div>
        </header>

        <div className="mt-7">
          <KpiStripPlano kpis={kpis} />
        </div>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-7 flex flex-col lg:flex-row lg:items-center gap-3 flex-wrap"
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
              placeholder="Título, descrição ou perigo"
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

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSetorPickerOpen((v) => !v)
                setRespPickerOpen(false)
              }}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition
                ${
                  filtros.setoresIds.length > 0 || setorPickerOpen
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60'
                    : 'bg-white/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }
              `}
            >
              <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
              {setoresLabel}
              {filtros.setoresIds.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-teal-600 text-white text-[10px] font-mono tabular-nums">
                  {filtros.setoresIds.length}
                </span>
              )}
            </button>
            {setorPickerOpen && (
              <Picker
                title="Setores afetados"
                onClose={() => setSetorPickerOpen(false)}
                onClear={() => setFiltros({ ...filtros, setoresIds: [] })}
              >
                {setoresAfetados.map((s) => {
                  const active = filtros.setoresIds.includes(s.id)
                  return (
                    <PickerOption
                      key={s.id}
                      active={active}
                      onClick={() => {
                        const next = active
                          ? filtros.setoresIds.filter((id) => id !== s.id)
                          : [...filtros.setoresIds, s.id]
                        setFiltros({ ...filtros, setoresIds: next })
                      }}
                    >
                      <span className="font-medium">{s.nome}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500">
                        {s.estabelecimentoNome}
                      </span>
                    </PickerOption>
                  )
                })}
              </Picker>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setRespPickerOpen((v) => !v)
                setSetorPickerOpen(false)
              }}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition
                ${
                  filtros.responsaveisIds.length > 0 || respPickerOpen
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60'
                    : 'bg-white/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }
              `}
            >
              <Filter className="w-3.5 h-3.5" strokeWidth={1.75} />
              {respLabel}
              {filtros.responsaveisIds.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-teal-600 text-white text-[10px] font-mono tabular-nums">
                  {filtros.responsaveisIds.length}
                </span>
              )}
            </button>
            {respPickerOpen && (
              <Picker
                title="Responsáveis"
                onClose={() => setRespPickerOpen(false)}
                onClear={() => setFiltros({ ...filtros, responsaveisIds: [] })}
              >
                {responsaveisDisponiveis.map((r) => {
                  const active = filtros.responsaveisIds.includes(r.id)
                  return (
                    <PickerOption
                      key={r.id}
                      active={active}
                      onClick={() => {
                        const next = active
                          ? filtros.responsaveisIds.filter((id) => id !== r.id)
                          : [...filtros.responsaveisIds, r.id]
                        setFiltros({ ...filtros, responsaveisIds: next })
                      }}
                    >
                      <span className="font-medium">{r.nome}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500">
                        {r.cargo}
                      </span>
                    </PickerOption>
                  )
                })}
              </Picker>
            )}
          </div>

          <select
            value={filtros.prazo}
            onChange={(e) => setFiltros({ ...filtros, prazo: e.target.value as FiltroPrazo })}
            className="
              px-3 py-2 rounded-xl
              bg-white/80 dark:bg-slate-900/40
              border border-slate-200 dark:border-slate-800
              text-sm text-slate-700 dark:text-slate-200
              focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
              transition cursor-pointer
            "
          >
            {PRAZO_OPTS.map((opt) => (
              <option key={opt.v} value={opt.v}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="inline-flex p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800">
            {PRIORIDADE_OPTS.map((opt) => {
              const active = filtros.prioridade === opt.v
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setFiltros({ ...filtros, prioridade: opt.v })}
                  className={`
                    px-2.5 py-1 rounded-lg text-[12px] font-medium transition
                    ${
                      active
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {totalActiveFilters > 0 && (
            <button
              type="button"
              onClick={() =>
                setFiltros({
                  busca: '',
                  setoresIds: [],
                  responsaveisIds: [],
                  prazo: 'todos',
                  prioridade: 'todas',
                })
              }
              className="
                inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                text-[12px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition
              "
            >
              <X className="w-3 h-3" strokeWidth={1.75} />
              Limpar filtros
            </button>
          )}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <div
            role="tablist"
            aria-label="Modo de visualização"
            className="inline-flex items-center gap-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 p-1 ring-1 ring-slate-200 dark:ring-slate-800"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'kanban'}
              onClick={() => setViewMode('kanban')}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition
                ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              <KanbanSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
              Kanban
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'cronograma'}
              onClick={() => setViewMode('cronograma')}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition
                ${
                  viewMode === 'cronograma'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }
              `}
            >
              <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.75} />
              Cronograma
            </button>
          </div>
        </div>

        {viewMode === 'cronograma' ? (
          <CronogramaTimeline
            itens={filteredItens}
            hoje={HOJE_REF}
            onSelectItem={onSelectItem}
          />
        ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {STATUS_COLUNAS.map((col) => {
            const colItens = itensPorStatus[col.value]
            return (
              <div
                key={col.value}
                className={`
                  rounded-2xl ring-1 ring-slate-200/70 dark:ring-slate-800
                  ${col.tone.bg}
                  flex flex-col
                  min-h-[480px]
                `}
              >
                <div className="px-4 py-3 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={col.tone.header}>{col.icon}</span>
                    <div>
                      <p
                        className={`text-[12px] uppercase tracking-[0.12em] font-semibold ${col.tone.header}`}
                      >
                        {col.label}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-500">{col.helper}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center justify-center min-w-[24px] h-[20px] px-1.5 rounded-md text-[11px] font-mono tabular-nums ${col.tone.chip}`}
                  >
                    {colItens.length}
                  </span>
                </div>
                <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                  {colItens.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-8 text-center">
                      <p className="text-[12px] text-slate-500 dark:text-slate-500">
                        {col.value === 'planejado'
                          ? 'Nenhum item planejado.'
                          : col.value === 'em_execucao'
                            ? 'Nenhum item em execução.'
                            : col.value === 'em_revisao'
                              ? 'Nenhum item em revisão.'
                              : 'Ainda nada concluído.'}
                      </p>
                      {col.value === 'planejado' && (
                        <button
                          type="button"
                          onClick={onAddItem}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-300 hover:underline underline-offset-2"
                        >
                          <Plus className="w-3 h-3" strokeWidth={2} />
                          Adicionar
                        </button>
                      )}
                    </div>
                  ) : (
                    colItens.map((item, idx) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        hoje={HOJE_REF}
                        revealIndex={idx + 6}
                        onSelect={() => onSelectItem?.(item.id)}
                        onChangeStatus={(s) => onChangeItemStatus?.(item.id, s)}
                        onNavigateToAvaliacao={() =>
                          item.origem.tipo === 'matriz' &&
                          onNavigateToAvaliacao?.(
                            planoVigente.avaliacaoOrigemId,
                            item.origem.setorId,
                            item.origem.fatorId,
                          )
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}

function Picker({
  title,
  onClose,
  onClear,
  children,
}: {
  title: string
  onClose: () => void
  onClear: () => void
  children: React.ReactNode
}) {
  return (
    <>
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="fixed inset-0 z-30 cursor-default"
      />
      <div
        className="
          absolute left-0 top-full mt-2 z-40
          w-[280px] rounded-xl
          bg-white dark:bg-slate-950
          ring-1 ring-slate-200/80 dark:ring-slate-800
          shadow-[0_12px_32px_-12px_rgba(15,23,42,0.25)]
          drawer-fade
        "
      >
        <div className="px-3 py-2 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Limpar
          </button>
        </div>
        <div className="p-1 max-h-[280px] overflow-y-auto space-y-px">{children}</div>
      </div>
    </>
  )
}

function PickerOption({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex flex-col items-start gap-0.5 px-2.5 py-2 rounded-lg text-left transition
        ${
          active
            ? 'bg-teal-50 dark:bg-teal-950/40'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
        }
      `}
    >
      <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-800 dark:text-slate-200">
        <span
          className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded ring-1 ${
            active
              ? 'bg-teal-600 ring-teal-600 text-white'
              : 'ring-slate-300 dark:ring-slate-700'
          }`}
        >
          {active && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
        </span>
        {children}
      </span>
    </button>
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
