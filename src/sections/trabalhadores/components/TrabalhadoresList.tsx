import { useMemo, useState } from 'react'
import type {
  EstabelecimentoLite,
  FiltroIdioma,
  FiltroStatusCampanha,
  FiltrosTrabalhadores,
  IdiomaPreferido,
  Ordenacao,
  SetorLite,
  Trabalhador,
  TrabalhadoresProps,
} from '@/../product/sections/trabalhadores/types'
import {
  Plus,
  Search,
  ArrowDownNarrowWide,
  Upload,
  ChevronRight,
  Users2,
  Accessibility,
} from 'lucide-react'
import { KpiStripTrab } from './KpiStripTrab'
import { TrabalhadorRow } from './TrabalhadorRow'
import { TrabalhadorDrawer } from './TrabalhadorDrawer'

const ORDENACOES: { value: Ordenacao; label: string }[] = [
  { value: 'alfabetica', label: 'Alfabética (A → Z)' },
  { value: 'mais_recente', label: 'Mais recentes' },
  { value: 'por_setor', label: 'Por setor' },
  { value: 'acessibilidade_primeiro', label: 'Acessibilidade primeiro' },
]

const IDIOMA_OPTS: { v: FiltroIdioma; label: string }[] = [
  { v: 'todos', label: 'Todos' },
  { v: 'pt', label: 'PT' },
  { v: 'en', label: 'EN' },
  { v: 'es', label: 'ES' },
]

const STATUS_OPTS: { v: FiltroStatusCampanha; label: string }[] = [
  { v: 'todos', label: 'Todos os status' },
  { v: 'elegivel', label: 'Apenas elegíveis' },
  { v: 'inativo', label: 'Inativos' },
  { v: 'sem_canal_contato', label: 'Sem canal de contato' },
  { v: 'opt_out_ciclo', label: 'Opt-out do ciclo' },
]

function ordenar(arr: Trabalhador[], ord: Ordenacao, setores: SetorLite[]): Trabalhador[] {
  const out = [...arr]
  switch (ord) {
    case 'alfabetica':
      return out.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    case 'mais_recente':
      return out.sort((a, b) => b.dataAdmissao.localeCompare(a.dataAdmissao))
    case 'por_setor': {
      const setorIndex = new Map(setores.map((s, idx) => [s.id, idx]))
      return out.sort((a, b) => {
        const ai = setorIndex.get(a.setorId) ?? Number.POSITIVE_INFINITY
        const bi = setorIndex.get(b.setorId) ?? Number.POSITIVE_INFINITY
        if (ai !== bi) return ai - bi
        return a.nome.localeCompare(b.nome, 'pt-BR')
      })
    }
    case 'acessibilidade_primeiro':
      return out.sort((a, b) => {
        const aHas = a.acessibilidade.length > 0 ? 1 : 0
        const bHas = b.acessibilidade.length > 0 ? 1 : 0
        if (aHas !== bHas) return bHas - aHas
        return a.nome.localeCompare(b.nome, 'pt-BR')
      })
  }
}

export function TrabalhadoresList({
  empregadorContexto,
  agregado,
  estabelecimentos,
  setores,
  trabalhadores,
  filtrosAtuais,
  onSelectTrabalhador,
  onAddTrabalhador,
  onEditTrabalhador,
  onSaveTrabalhador,
  onArchiveTrabalhador,
  onInviteNymos,
  onFiltrosChange,
  onImportCsv,
  onNavigateToSetor,
}: TrabalhadoresProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const filtros = filtrosAtuais
  const setFiltros = (next: FiltrosTrabalhadores) => onFiltrosChange?.(next)

  const trabalhadorEmEdicao = editingId
    ? trabalhadores.find((t) => t.id === editingId) ?? null
    : null

  const setoresDoEstab = useMemo(() => {
    if (!filtros.estabelecimentoId) return setores
    return setores.filter((s) => s.estabelecimentoId === filtros.estabelecimentoId)
  }, [setores, filtros.estabelecimentoId])

  const estabMap = useMemo(
    () => new Map<string, EstabelecimentoLite>(estabelecimentos.map((e) => [e.id, e])),
    [estabelecimentos],
  )
  const setorMap = useMemo(() => new Map<string, SetorLite>(setores.map((s) => [s.id, s])), [setores])

  const filtradosOrdenados = useMemo(() => {
    const termo = filtros.busca.trim().toLowerCase()
    const filtered = trabalhadores.filter((t) => {
      if (filtros.estabelecimentoId && t.estabelecimentoId !== filtros.estabelecimentoId)
        return false
      if (filtros.setorId && t.setorId !== filtros.setorId) return false
      if (filtros.idioma !== 'todos' && t.idiomaPreferido !== filtros.idioma) return false
      if (filtros.comAcessibilidade && t.acessibilidade.length === 0) return false
      if (filtros.statusCampanha !== 'todos' && t.statusCampanha !== filtros.statusCampanha)
        return false
      if (termo) {
        const haystack = `${t.nome} ${t.matricula} ${t.cargo}`.toLowerCase()
        if (!haystack.includes(termo)) return false
      }
      return true
    })
    return ordenar(filtered, filtros.ordenacao, setores)
  }, [trabalhadores, filtros, setores])

  const handleAdd = () => {
    setEditingId(null)
    setDrawerOpen(true)
    onAddTrabalhador?.()
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setDrawerOpen(true)
    onEditTrabalhador?.(id)
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
          <span className="text-slate-500 dark:text-slate-400">Trabalhadores</span>
        </div>

        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Trabalhadores cadastrados
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Carteira de trabalhadores
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">{agregado.totalTrabalhadores}</span> cadastrados ·{' '}
                <span className="tabular-nums">{agregado.totalElegiveis}</span> elegíveis ·{' '}
                <span className="tabular-nums">{agregado.totalComVinculoNymos}</span> com Nymos
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onImportCsv}
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
                  transition
                "
              >
                <Plus className="w-4 h-4" strokeWidth={2.25} />
                Novo trabalhador
              </button>
            </div>
          </div>
        </header>

        <div className="mt-7">
          <KpiStripTrab agregado={agregado} />
        </div>

        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 mt-7 flex flex-col gap-3"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 lg:max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                placeholder="Nome, matrícula ou cargo"
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
              value={filtros.estabelecimentoId ?? ''}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  estabelecimentoId: e.target.value === '' ? null : e.target.value,
                  setorId: null,
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
              <option value="">Todos estabelecimentos</option>
              {estabelecimentos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>

            <select
              value={filtros.setorId ?? ''}
              disabled={!filtros.estabelecimentoId}
              onChange={(e) =>
                setFiltros({ ...filtros, setorId: e.target.value === '' ? null : e.target.value })
              }
              className="
                px-3 py-2 rounded-xl
                bg-white/80 dark:bg-slate-900/40
                border border-slate-200 dark:border-slate-800
                text-sm text-slate-700 dark:text-slate-200
                focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                disabled:opacity-50 disabled:cursor-not-allowed
                transition cursor-pointer
              "
            >
              <option value="">{filtros.estabelecimentoId ? 'Todos setores' : 'Escolha estab.'}</option>
              {setoresDoEstab.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>

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
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800 self-start">
              {IDIOMA_OPTS.map((opt) => {
                const active = filtros.idioma === opt.v
                return (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setFiltros({ ...filtros, idioma: opt.v })}
                    className={`
                      inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium transition
                      ${
                        active
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }
                    `}
                  >
                    {opt.v !== 'todos' ? (
                      <span
                        className={`font-mono font-semibold tracking-wider text-[10px] ${
                          active
                            ? opt.v === 'pt'
                              ? 'text-teal-700 dark:text-teal-300'
                              : opt.v === 'en'
                                ? 'text-violet-700 dark:text-violet-300'
                                : 'text-amber-700 dark:text-amber-300'
                            : ''
                        }`}
                      >
                        {opt.label}
                      </span>
                    ) : (
                      opt.label
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="inline-flex items-center gap-1.5 text-[12px] text-slate-700 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.comAcessibilidade}
                  onChange={(e) =>
                    setFiltros({ ...filtros, comAcessibilidade: e.target.checked })
                  }
                  className="accent-violet-600 dark:accent-violet-400"
                />
                <Accessibility className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" strokeWidth={1.75} />
                Apenas com acessibilidade
              </label>

              <select
                value={filtros.statusCampanha}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    statusCampanha: e.target.value as FiltroStatusCampanha,
                  })
                }
                className="
                  px-3 py-1.5 rounded-xl
                  bg-white/80 dark:bg-slate-900/40
                  border border-slate-200 dark:border-slate-800
                  text-[12px] text-slate-700 dark:text-slate-200
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
            </div>
          </div>
        </div>

        <div className="mt-5">
          {filtradosOrdenados.length === 0 ? (
            <EmptyState
              isFilterEmpty={
                filtros.busca !== '' ||
                filtros.estabelecimentoId !== null ||
                filtros.setorId !== null ||
                filtros.idioma !== 'todos' ||
                filtros.comAcessibilidade ||
                filtros.statusCampanha !== 'todos'
              }
              onAdd={handleAdd}
              onClear={() =>
                setFiltros({
                  busca: '',
                  estabelecimentoId: null,
                  setorId: null,
                  idioma: 'todos' as IdiomaPreferido | 'todos',
                  comAcessibilidade: false,
                  statusCampanha: 'todos',
                  ordenacao: filtros.ordenacao,
                })
              }
            />
          ) : (
            <div className="space-y-2">
              {filtradosOrdenados.map((t, idx) => (
                <TrabalhadorRow
                  key={t.id}
                  trabalhador={t}
                  estabelecimento={estabMap.get(t.estabelecimentoId) ?? null}
                  setor={setorMap.get(t.setorId) ?? null}
                  revealIndex={idx + 6}
                  onSelect={() => onSelectTrabalhador?.(t.id)}
                  onEdit={() => handleEdit(t.id)}
                  onArchive={() => onArchiveTrabalhador?.(t.id)}
                  onInviteNymos={() => onInviteNymos?.(t.id)}
                  onSelectSetor={() => onNavigateToSetor?.(t.estabelecimentoId, t.setorId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <TrabalhadorDrawer
          key={editingId ?? 'new'}
          open
          trabalhadorEmEdicao={trabalhadorEmEdicao}
          estabelecimentos={estabelecimentos}
          setores={setores}
          onClose={() => {
            setDrawerOpen(false)
            setEditingId(null)
          }}
          onSave={(input) => {
            onSaveTrabalhador?.(input)
            setDrawerOpen(false)
            setEditingId(null)
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
        <Users2 className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {isFilterEmpty ? 'Nenhum trabalhador no filtro atual' : 'Carteira ainda sem trabalhadores'}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {isFilterEmpty
          ? 'Ajuste os filtros para ver outros cadastros ou adicione um novo trabalhador.'
          : 'Cadastre os trabalhadores manualmente ou importe via CSV para iniciar campanhas NR-1.'}
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
            text-white dark:text-slate-900 font-medium text-sm transition
          "
        >
          <Plus className="w-4 h-4" strokeWidth={2.25} />
          Novo trabalhador
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
