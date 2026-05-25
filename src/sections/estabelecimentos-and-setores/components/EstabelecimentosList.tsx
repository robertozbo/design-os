import { useMemo, useState } from 'react'
import type {
  EstabelecimentosSetoresProps,
  Estabelecimento,
  FiltrosEstabelecimentos,
  OrdenacaoEstab,
} from '@/../product/sections/estabelecimentos-and-setores/types'
import {
  Plus,
  Search,
  ArrowDownNarrowWide,
  Activity,
  Upload,
  ChevronRight,
  Building2,
} from 'lucide-react'
import { KpiStripEstab } from './KpiStripEstab'
import { TipoFilters } from './TipoFilters'
import { EstabelecimentoCard } from './EstabelecimentoCard'
import { SaudeFilters } from './SaudeFilters'
import { EstabelecimentoDrawer } from './EstabelecimentoDrawer'
import { CsvImportDialog } from './CsvImportDialog'

const ORDENACOES: { value: OrdenacaoEstab; label: string }[] = [
  { value: 'alfabetica', label: 'Alfabética (A → Z)' },
  { value: 'mais_trabalhadores', label: 'Mais trabalhadores' },
  { value: 'maior_risco', label: 'Maior risco' },
  { value: 'vigencia_proxima', label: 'Vigência mais próxima' },
]

function riscoScore(e: Estabelecimento) {
  const sevByRisco = { baixo: 0, moderado: 1, critico: 3, prioritario: 4 }
  const r = e.saudeNr1.riscoPredominante
  const base = r ? sevByRisco[r] : 0
  return base + e.saudeNr1.alertasCriticos * 2 + (e.saudeNr1.coberturaMedia < 0.65 ? 1 : 0)
}

function ordenar(arr: Estabelecimento[], ordenacao: OrdenacaoEstab) {
  const out = [...arr]
  switch (ordenacao) {
    case 'alfabetica':
      return out.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    case 'mais_trabalhadores':
      return out.sort((a, b) => b.estrutura.totalTrabalhadores - a.estrutura.totalTrabalhadores)
    case 'maior_risco':
      return out.sort((a, b) => riscoScore(b) - riscoScore(a))
    case 'vigencia_proxima':
      return out
  }
}

export function EstabelecimentosList({
  empregadorContexto,
  estabelecimentos,
  filtrosAtuais,
  onSelectEstabelecimento,
  onAddEstabelecimento,
  onEditEstabelecimento,
  onSaveEstabelecimento,
  onArchiveEstabelecimento,
  onFiltrosChange,
  onImportCsv,
  onConfirmCsvImport,
}: EstabelecimentosSetoresProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [csvOpen, setCsvOpen] = useState(false)

  const filtros = filtrosAtuais
  const setFiltros = (next: FiltrosEstabelecimentos) => onFiltrosChange?.(next)

  const estabelecimentoEmEdicao = editingId
    ? estabelecimentos.find((e) => e.id === editingId) ?? null
    : null

  const filtradosOrdenados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    const filtered = estabelecimentos.filter((e) => {
      if (filtros.tipo !== 'todos' && e.tipo !== filtros.tipo) return false
      if (termo) {
        const haystack = `${e.nome} ${e.cnpjProprio} ${e.endereco.cidade} ${e.endereco.uf}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }
      switch (filtros.saudeNr1) {
        case 'cobertura_abaixo':
          if (e.saudeNr1.coberturaMedia >= 0.65) return false
          break
        case 'risco_critico':
          if (
            e.saudeNr1.riscoPredominante !== 'critico' &&
            e.saudeNr1.riscoPredominante !== 'prioritario'
          )
            return false
          break
        case 'em_dia':
          if (e.saudeNr1.coberturaMedia < 0.65 || e.saudeNr1.alertasCriticos > 0) return false
          break
      }
      return true
    })
    return ordenar(filtered, filtros.ordenacao)
  }, [estabelecimentos, filtros])

  const handleAdd = () => {
    setEditingId(null)
    setDrawerOpen(true)
    onAddEstabelecimento?.()
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setDrawerOpen(true)
    onEditEstabelecimento?.(id)
  }

  const advancedActiveCount = filtros.saudeNr1 !== 'todos' ? 1 : 0

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
          <span className="text-slate-500 dark:text-slate-400">Estabelecimentos</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Estrutura organizacional
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {empregadorContexto.razaoSocial}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                CNPJ <span className="font-mono">{empregadorContexto.cnpj}</span> ·{' '}
                <span className="tabular-nums">{empregadorContexto.agregado.totalEstabelecimentos}</span>{' '}
                estabelecimentos ·{' '}
                <span className="tabular-nums">{empregadorContexto.agregado.totalSetores}</span>{' '}
                setores ·{' '}
                <span className="tabular-nums">
                  {empregadorContexto.agregado.totalTrabalhadores.toLocaleString('pt-BR')}
                </span>{' '}
                trabalhadores
              </p>
              {empregadorContexto.diasAteVigencia !== null && (
                <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                  Vigência NR-1 em{' '}
                  <span
                    className={`font-mono ${
                      empregadorContexto.diasAteVigencia <= 30
                        ? 'text-rose-700 dark:text-rose-300 font-semibold'
                        : ''
                    }`}
                  >
                    {empregadorContexto.diasAteVigencia} dias
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCsvOpen(true)
                  onImportCsv?.()
                }}
                className="
                  inline-flex items-center justify-center gap-2
                  px-3.5 py-2.5 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  hover:bg-slate-50 dark:hover:bg-slate-800/60
                  text-slate-700 dark:text-slate-200 font-medium text-sm
                  transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                "
              >
                <Upload className="w-4 h-4" strokeWidth={1.75} />
                Importar CSV
              </button>
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
                Novo estabelecimento
              </button>
            </div>
          </div>
        </header>

        <div className="mt-7">
          <KpiStripEstab empregador={empregadorContexto} estabelecimentos={estabelecimentos} />
        </div>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
        >
          <TipoFilters
            ativo={filtros.tipo}
            estabelecimentos={estabelecimentos}
            onChange={(tipo) => setFiltros({ ...filtros, tipo })}
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
                placeholder="Nome, CNPJ ou cidade"
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
                  setFiltros({ ...filtros, ordenacao: e.target.value as OrdenacaoEstab })
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
                border text-sm font-medium transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500
                ${
                  advancedOpen || advancedActiveCount > 0
                    ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60'
                    : 'bg-white/80 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }
              `}
              aria-expanded={advancedOpen}
            >
              <Activity className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Saúde NR-1</span>
              {advancedActiveCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md bg-teal-600 text-white text-[10px] font-mono tabular-nums">
                  {advancedActiveCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {advancedOpen && (
          <div className="mt-3">
            <SaudeFilters
              open={advancedOpen}
              filtros={filtros}
              onClose={() => setAdvancedOpen(false)}
              onChange={setFiltros}
              onClear={() => setFiltros({ ...filtros, saudeNr1: 'todos' })}
            />
          </div>
        )}

        <div className="mt-5">
          {filtradosOrdenados.length === 0 ? (
            <EmptyState
              isFilterEmpty={
                filtros.busca !== '' ||
                filtros.tipo !== 'todos' ||
                filtros.saudeNr1 !== 'todos'
              }
              onAdd={handleAdd}
              onClear={() =>
                setFiltros({
                  busca: '',
                  tipo: 'todos',
                  saudeNr1: 'todos',
                  ordenacao: filtros.ordenacao,
                })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtradosOrdenados.map((estab, idx) => (
                <EstabelecimentoCard
                  key={estab.id}
                  estabelecimento={estab}
                  revealIndex={idx + 6}
                  onSelect={() => onSelectEstabelecimento?.(estab.id)}
                  onEdit={() => handleEdit(estab.id)}
                  onArchive={() => onArchiveEstabelecimento?.(estab.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <EstabelecimentoDrawer
          key={editingId ?? 'new'}
          open
          estabelecimentoEmEdicao={estabelecimentoEmEdicao}
          empregadorCnpjBase={empregadorContexto.cnpj}
          onClose={() => {
            setDrawerOpen(false)
            setEditingId(null)
          }}
          onSave={(input) => {
            onSaveEstabelecimento?.(input)
            setDrawerOpen(false)
            setEditingId(null)
          }}
        />
      )}

      {csvOpen && (
        <CsvImportDialog
          open
          onClose={() => setCsvOpen(false)}
          onConfirm={(linhas) => {
            onConfirmCsvImport?.(linhas)
          }}
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
        <Building2 className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isFilterEmpty ? 'Nenhum estabelecimento no filtro atual' : 'Estrutura ainda não cadastrada'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isFilterEmpty
          ? 'Ajuste os filtros para ver outros estabelecimentos ou adicione um novo.'
          : 'Cadastre a matriz e as filiais para depois estruturar setores e iniciar avaliações NR-1.'}
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
            inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
            bg-slate-900 hover:bg-slate-800
            dark:bg-slate-100 dark:hover:bg-slate-200
            text-white dark:text-slate-900
            font-medium text-sm transition
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Novo estabelecimento
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
