import { useMemo } from 'react'
import { Plus, Send, FileEdit, Eye, Heart } from 'lucide-react'
import type {
  CategoriaFiltroId,
  Receita,
  ReceitasProps,
  AlimentoLite,
} from '@/../product/sections/receitas/types'
import { FilterStrip } from './FilterStrip'
import { RecipeCard } from './RecipeCard'
import { EmptyState } from './EmptyState'
import { sumMacros } from './utils'

export function Receitas({
  perfilContexto,
  stats,
  receitas,
  alimentos,
  categoriaOpcoes,
  tagOpcoes,
  sortOptions,
  emptyStates,

  selectedCategoria = 'todas',
  onCategoriaChange,
  selectedTags = [],
  onTagsChange,
  searchQuery = '',
  onSearchChange,
  selectedSort = 'recent',
  onSortChange,

  onOpenNew,
  onOpenEdit,
  onToggleFavorita,
  onTogglePublicada,
  onDuplicate,
  onDelete,
}: ReceitasProps) {
  const alimentosById = useMemo(
    () => Object.fromEntries(alimentos.map((a) => [a.id, a])) as Record<string, AlimentoLite>,
    [alimentos],
  )

  // Apply text + tag filters but ignore category for the count map
  const filteredByTextAndTags = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return receitas.filter((r) => {
      // Search match on name, ingredients (alimento name), tags
      if (q) {
        const nameMatch = r.nome.toLowerCase().includes(q)
        const tagMatch = r.tags.some((t) => t.toLowerCase().includes(q))
        const ingMatch = r.ingredientes.some((ing) => {
          const al = alimentosById[ing.alimentoId]
          return al?.nome.toLowerCase().includes(q)
        })
        if (!nameMatch && !tagMatch && !ingMatch) return false
      }
      // Tags match (intersection: all selected tags must be present)
      if (selectedTags.length > 0) {
        if (!selectedTags.every((t) => r.tags.includes(t))) return false
      }
      return true
    })
  }, [receitas, searchQuery, selectedTags, alimentosById])

  const categoriaCount = useMemo(() => {
    const c: Record<CategoriaFiltroId, number> = {
      todas: filteredByTextAndTags.length,
      cafe: 0,
      'almoco-jantar': 0,
      lanche: 0,
      'sobremesa-bebida': 0,
    }
    for (const r of filteredByTextAndTags) {
      c[r.categoria] = (c[r.categoria] ?? 0) + 1
    }
    return c
  }, [filteredByTextAndTags])

  const visible = useMemo(() => {
    let out = filteredByTextAndTags
    if (selectedCategoria !== 'todas') {
      out = out.filter((r) => r.categoria === selectedCategoria)
    }
    switch (selectedSort) {
      case 'name-asc':
        out = [...out].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        break
      case 'views-desc':
        out = [...out].sort((a, b) => b.visualizacoesCount - a.visualizacoesCount)
        break
      case 'saves-desc':
        out = [...out].sort((a, b) => b.salvaPorPacientesCount - a.salvaPorPacientesCount)
        break
      case 'kcal-asc':
      case 'kcal-desc': {
        const dir = selectedSort === 'kcal-asc' ? 1 : -1
        out = [...out].sort((a, b) => {
          const aMacros = sumMacros(a.ingredientes, alimentosById)
          const bMacros = sumMacros(b.ingredientes, alimentosById)
          const aPP = aMacros.kcal / Math.max(1, a.porcoes)
          const bPP = bMacros.kcal / Math.max(1, b.porcoes)
          return (aPP - bPP) * dir
        })
        break
      }
      case 'recent':
      default:
        out = [...out].sort((a, b) => b.editadoEm.localeCompare(a.editadoEm))
    }
    return out
  }, [filteredByTextAndTags, selectedCategoria, selectedSort, alimentosById])

  const hasActiveFilters =
    selectedCategoria !== 'todas' || selectedTags.length > 0 || !!searchQuery.trim()

  function clearFilters() {
    onCategoriaChange?.('todas')
    onTagsChange?.([])
    onSearchChange?.('')
  }

  function renderEmpty() {
    if (visible.length > 0) return null
    if (receitas.length === 0) {
      return (
        <EmptyState
          variant="no-receitas"
          titulo={emptyStates.noReceitas.titulo}
          descricao={emptyStates.noReceitas.descricao}
          ctaLabel={emptyStates.noReceitas.ctaLabel}
          onCta={onOpenNew}
        />
      )
    }
    return (
      <EmptyState
        variant="no-results"
        titulo={emptyStates.noResults.titulo}
        descricao={emptyStates.noResults.descricao}
        onClearFilters={clearFilters}
      />
    )
  }

  return (
    <div
      data-nymos-receitas="true"
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        text-slate-900
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
        <header className="nymos-reveal flex flex-col gap-3 opacity-0 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                Conta · Biblioteca
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Receitas
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Compartilhe dicas saudáveis com seus pacientes pelo app · {perfilContexto.nome}
            </p>

            {/* Inline stats */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[10px] uppercase tracking-wider tabular-nums">
              <Stat
                icon={<Send size={11} strokeWidth={1.75} />}
                value={stats.totalPublicadas}
                label="publicadas"
                tone="teal"
              />
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Stat
                icon={<FileEdit size={11} strokeWidth={1.75} />}
                value={stats.totalRascunhos}
                label="rascunhos"
                tone="amber"
              />
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Stat
                icon={<Eye size={11} strokeWidth={1.75} />}
                value={stats.visualizacoesNoMes}
                label="vistas no mês"
                tone="slate"
              />
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Stat
                icon={<Heart size={11} strokeWidth={1.75} />}
                value={stats.salvasPorPacientesNoMes}
                label="salvas pelos pacientes"
                tone="rose"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={onOpenNew}
              className="
                inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white
                hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400
              "
            >
              <Plus size={14} /> Nova receita
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="nymos-reveal mt-6 opacity-0" style={{ animationDelay: '120ms' }}>
          <FilterStrip
            categoriaOpcoes={categoriaOpcoes}
            categoriaCount={categoriaCount}
            selectedCategoria={selectedCategoria}
            onCategoriaChange={(id) => onCategoriaChange?.(id)}
            tagOpcoes={tagOpcoes}
            selectedTags={selectedTags}
            onTagsChange={(t) => onTagsChange?.(t)}
            searchQuery={searchQuery}
            onSearchChange={(q) => onSearchChange?.(q)}
            sortOptions={sortOptions}
            selectedSort={selectedSort}
            onSortChange={(s) => onSortChange?.(s)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Grid */}
        <div className="nymos-reveal mt-6 opacity-0" style={{ animationDelay: '180ms' }}>
          {visible.length === 0 ? (
            renderEmpty()
          ) : (
            <>
              <header className="mb-3 flex items-baseline justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider tabular-nums text-slate-500 dark:text-slate-500">
                  {visible.length} {visible.length === 1 ? 'receita' : 'receitas'}
                  {hasActiveFilters && ' (filtradas)'}
                </span>
              </header>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((r: Receita) => (
                  <RecipeCard
                    key={r.id}
                    receita={r}
                    alimentosById={alimentosById}
                    categoriaOpcoes={categoriaOpcoes}
                    tagOpcoes={tagOpcoes}
                    onOpenEdit={() => onOpenEdit?.(r.id)}
                    onToggleFavorita={() => onToggleFavorita?.(r.id)}
                    onTogglePublicada={() => onTogglePublicada?.(r.id)}
                    onDuplicate={() => onDuplicate?.(r.id)}
                    onDelete={() => onDelete?.(r.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: number
  label: string
  tone: 'slate' | 'amber' | 'teal' | 'rose'
}) {
  const toneClass: Record<typeof tone, string> = {
    slate: 'text-slate-700 dark:text-slate-300',
    amber: 'text-amber-700 dark:text-amber-300',
    teal: 'text-teal-700 dark:text-teal-300',
    rose: 'text-rose-700 dark:text-rose-300',
  }
  return (
    <span className={`inline-flex items-center gap-1 ${toneClass[tone]}`}>
      {icon}
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="opacity-70">{label}</span>
    </span>
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
