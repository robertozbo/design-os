import { useMemo, useState } from 'react'
import type {
  Empregador,
  EmpregadoresProps,
  FiltrosEmpregadores,
  Ordenacao,
  ResponsavelTecnico,
} from '@/../product/sections/empregadores/types'
import {
  Plus,
  Search,
  SlidersHorizontal,
  ArrowDownNarrowWide,
  Briefcase,
} from 'lucide-react'
import { KpiStrip } from './KpiStrip'
import { StatusTabs } from './StatusTabs'
import { EmpregadorCard } from './EmpregadorCard'
import { AdvancedFilters } from './AdvancedFilters'
import { CadastroDrawer } from './CadastroDrawer'

const ORDENACOES: { value: Ordenacao; label: string }[] = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'alfabetica', label: 'Alfabética (A → Z)' },
  { value: 'vigencia_proxima', label: 'Vigência mais próxima' },
  { value: 'maior_cobertura', label: 'Maior cobertura' },
  { value: 'maior_risco', label: 'Maior risco' },
]

const FAIXA_RANGES: Record<string, [number, number]> = {
  ate_50: [0, 50],
  '50_500': [50, 500],
  '500_1000': [500, 1000],
  acima_1000: [1000, Infinity],
}

function riskScore(emp: Empregador): number {
  const sevWeights = { critica: 3, alta: 1 }
  const alertWeight = emp.alertas.reduce((acc, a) => acc + sevWeights[a.severidade], 0)
  const lowCoverage = emp.saudeNr1.coberturaMedia < 0.65 ? 2 : 0
  const overdue = emp.planoAcao.emAtraso > 0 ? 2 : 0
  const closeVigencia = (emp.saudeNr1.diasAteVigencia ?? 999) <= 30 ? 2 : 0
  return alertWeight + lowCoverage + overdue + closeVigencia
}

function ordenar(empregadores: Empregador[], ordenacao: Ordenacao): Empregador[] {
  const arr = [...empregadores]
  switch (ordenacao) {
    case 'recentes':
      return arr.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
    case 'alfabetica':
      return arr.sort((a, b) => a.razaoSocial.localeCompare(b.razaoSocial, 'pt-BR'))
    case 'vigencia_proxima':
      return arr.sort((a, b) => {
        const da = a.saudeNr1.diasAteVigencia ?? Number.POSITIVE_INFINITY
        const db = b.saudeNr1.diasAteVigencia ?? Number.POSITIVE_INFINITY
        return da - db
      })
    case 'maior_cobertura':
      return arr.sort((a, b) => b.saudeNr1.coberturaMedia - a.saudeNr1.coberturaMedia)
    case 'maior_risco':
      return arr.sort((a, b) => riskScore(b) - riskScore(a))
  }
}

export function EmpregadoresList({
  carteira,
  empregadores,
  responsavelLogado,
  filtrosAtuais,
  onSelectEmpregador,
  onAddEmpregador,
  onEditEmpregador,
  onSaveEmpregador,
  onArchiveEmpregador,
  onUnarchiveEmpregador,
  onFiltrosChange,
  onLookupCnpj,
  onSelectAlerta,
}: EmpregadoresProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const filtros = filtrosAtuais
  const setFiltros = (next: FiltrosEmpregadores) => onFiltrosChange?.(next)

  const profissionaisDisponiveis = useMemo<ResponsavelTecnico[]>(() => {
    const map = new Map<string, ResponsavelTecnico>()
    map.set(responsavelLogado.id, responsavelLogado)
    empregadores.forEach((e) => {
      if (!map.has(e.responsavelTecnico.id)) map.set(e.responsavelTecnico.id, e.responsavelTecnico)
    })
    return Array.from(map.values())
  }, [empregadores, responsavelLogado])

  const empregadorEmEdicao = editingId ? empregadores.find((e) => e.id === editingId) ?? null : null

  const advancedActiveCount =
    (filtros.faixaTamanho ? 1 : 0) +
    (filtros.vigenciaAte ? 1 : 0) +
    (filtros.coberturaMinima !== null ? 1 : 0)

  const filtradosOrdenados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    const filtered = empregadores.filter((emp) => {
      const matchStatus =
        filtros.status === 'todos' ||
        (filtros.status === 'ativos' && emp.status === 'ativo') ||
        (filtros.status === 'arquivados' && emp.status === 'arquivado')
      if (!matchStatus) return false

      if (termo) {
        const haystack = `${emp.razaoSocial} ${emp.nomeFantasia} ${emp.cnpj}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }

      if (filtros.faixaTamanho) {
        const [min, max] = FAIXA_RANGES[filtros.faixaTamanho]
        const trab = emp.estrutura.trabalhadores
        if (trab < min || trab >= max) return false
      }

      if (filtros.vigenciaAte && emp.saudeNr1.vigenciaEspecifica) {
        if (emp.saudeNr1.vigenciaEspecifica > filtros.vigenciaAte) return false
      }

      if (filtros.coberturaMinima !== null) {
        if (emp.saudeNr1.coberturaMedia < filtros.coberturaMinima) return false
      }

      return true
    })
    return ordenar(filtered, filtros.ordenacao)
  }, [empregadores, filtros])

  const handleAdd = () => {
    setEditingId(null)
    setDrawerOpen(true)
    onAddEmpregador?.()
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setDrawerOpen(true)
    onEditEmpregador?.(id)
  }

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
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Empregadores
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Carteira de empregadores
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">{carteira.totalEmpregadores}</span>{' '}
                empregadores ·{' '}
                <span className="tabular-nums">{carteira.totalEstabelecimentos}</span>{' '}
                estabelecimentos ·{' '}
                <span className="tabular-nums">
                  {carteira.totalTrabalhadores.toLocaleString('pt-BR')}
                </span>{' '}
                trabalhadores sob sua gestão NR-1
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Responsável técnico:{' '}
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {responsavelLogado.nome}
                </span>{' '}
                · <span className="font-mono">{responsavelLogado.registro}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="
                inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl
                bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                dark:bg-teal-500 dark:hover:bg-teal-400
                text-white font-medium text-sm
                shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
              "
            >
              <Plus className="w-4 h-4" strokeWidth={2.25} />
              Novo empregador
            </button>
          </div>
        </header>

        <div className="mt-7">
          <KpiStrip carteira={carteira} />
        </div>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
        >
          <StatusTabs
            ativo={filtros.status}
            carteira={carteira}
            onChange={(status) => setFiltros({ ...filtros, status })}
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:max-w-xs lg:w-[280px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                placeholder="Razão social, fantasia ou CNPJ"
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
              <ArrowDownNarrowWide
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                strokeWidth={1.75}
              />
              <select
                value={filtros.ordenacao}
                onChange={(e) =>
                  setFiltros({ ...filtros, ordenacao: e.target.value as Ordenacao })
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
                {ORDENACOES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-xl
                border text-sm font-medium
                transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                ${
                  advancedOpen || advancedActiveCount > 0
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60'
                    : 'bg-white/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }
              `}
              aria-expanded={advancedOpen}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Filtros</span>
              {advancedActiveCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-teal-600 text-white text-[10px] font-mono tabular-nums">
                  {advancedActiveCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {advancedOpen && (
          <div style={{ animationDelay: '480ms' }} className="mt-3">
            <AdvancedFilters
              open={advancedOpen}
              filtros={filtros}
              onClose={() => setAdvancedOpen(false)}
              onChange={setFiltros}
              onClear={() =>
                setFiltros({
                  ...filtros,
                  faixaTamanho: null,
                  vigenciaAte: null,
                  coberturaMinima: null,
                })
              }
            />
          </div>
        )}

        <div className="mt-5">
          {filtradosOrdenados.length === 0 ? (
            <EmptyState
              isFilterEmpty={
                filtros.busca !== '' ||
                advancedActiveCount > 0 ||
                filtros.status !== 'todos'
              }
              onAdd={handleAdd}
              onClear={() =>
                setFiltros({
                  busca: '',
                  status: 'todos',
                  ordenacao: filtros.ordenacao,
                  faixaTamanho: null,
                  vigenciaAte: null,
                  coberturaMinima: null,
                })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtradosOrdenados.map((emp, idx) => (
                <EmpregadorCard
                  key={emp.id}
                  empregador={emp}
                  revealIndex={idx + 6}
                  onSelect={() => onSelectEmpregador?.(emp.id)}
                  onEdit={() => handleEdit(emp.id)}
                  onArchive={() => onArchiveEmpregador?.(emp.id)}
                  onUnarchive={() => onUnarchiveEmpregador?.(emp.id)}
                  onSelectAlerta={(alertaId) => onSelectAlerta?.(emp.id, alertaId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <CadastroDrawer
          key={editingId ?? 'new'}
          open
          empregadorEmEdicao={empregadorEmEdicao}
          responsavelLogado={responsavelLogado}
          profissionaisDisponiveis={profissionaisDisponiveis}
          onClose={() => {
            setDrawerOpen(false)
            setEditingId(null)
          }}
          onSave={(input) => {
            onSaveEmpregador?.(input)
            setDrawerOpen(false)
            setEditingId(null)
          }}
          onLookupCnpj={onLookupCnpj}
        />
      )}
    </div>
  )
}

function EmptyState({
  isFilterEmpty,
  onAdd,
  onClear,
}: {
  isFilterEmpty: boolean
  onAdd?: () => void
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
        <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isFilterEmpty ? 'Nenhum empregador no filtro atual' : 'Sua carteira está vazia'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isFilterEmpty
          ? 'Ajuste os filtros para ver outros empregadores ou adicione um novo à carteira.'
          : 'Adicione o primeiro empregador para começar a montar a carteira NR-1 e iniciar avaliações psicossociais.'}
      </p>
      <div className="mt-5 flex items-center gap-2">
        {isFilterEmpty && (
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
        )}
        <button
          type="button"
          onClick={onAdd}
          className="
            inline-flex items-center gap-2
            px-3.5 py-2 rounded-xl
            bg-slate-900 hover:bg-slate-800
            dark:bg-slate-100 dark:hover:bg-slate-200
            text-white dark:text-slate-900
            font-medium text-sm
            transition-colors duration-150
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Novo empregador
        </button>
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
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .drawer-fade {
        animation: drawer-fade-in 0.18s ease-out forwards;
      }
      @keyframes drawer-slide-in {
        from { transform: translateX(20px); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      .drawer-slide {
        animation: drawer-slide-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal, .drawer-fade, .drawer-slide {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
