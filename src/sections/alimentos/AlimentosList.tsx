import { useMemo, useState } from 'react'
import data from '@/../product/sections/alimentos/data.json'
import type {
  Alimento,
  AlimentoFormDraft,
  AlimentosProps,
  CategoryFilterId,
  CategoryId,
  DrawerMode,
  SortId,
  SourceFilterId,
} from '@/../product/sections/alimentos/types'
import { AlimentoDrawer } from './components/AlimentoDrawer'
import { AlimentosList as AlimentosListView } from './components/AlimentosList'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'

interface DrawerState {
  mode: DrawerMode
  alimentoId: string | null
  duplicateFromTbca: boolean
}

export default function AlimentosListPreview() {
  const baseProps = data as unknown as AlimentosProps

  const [alimentos, setAlimentos] = useState<Alimento[]>(baseProps.alimentos)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState<SourceFilterId>(baseProps.selectedSource)
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterId>(
    baseProps.selectedCategory,
  )
  const [selectedSort, setSelectedSort] = useState<SortId>(baseProps.selectedSort)

  const [drawer, setDrawer] = useState<DrawerState>({
    mode: 'closed',
    alimentoId: null,
    duplicateFromTbca: false,
  })
  const [deleteTarget, setDeleteTarget] = useState<Alimento | null>(null)

  // Filter + sort
  const visibleAlimentos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let out = alimentos.filter((a) => {
      const matchesSource =
        selectedSource === 'todos' ||
        (selectedSource === 'favoritos' && a.isFavorite) ||
        a.source === selectedSource
      const matchesCategory =
        selectedCategory === 'todas' || a.category === selectedCategory
      const matchesSearch = !q || a.name.toLowerCase().includes(q)
      return matchesSource && matchesCategory && matchesSearch
    })

    switch (selectedSort) {
      case 'name-asc':
        out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        break
      case 'name-desc':
        out = [...out].sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'))
        break
      case 'kcal-asc':
        out = [...out].sort((a, b) => a.kcalPer100g - b.kcalPer100g)
        break
      case 'kcal-desc':
        out = [...out].sort((a, b) => b.kcalPer100g - a.kcalPer100g)
        break
      case 'most-used':
        out = [...out].sort((a, b) => b.linkedPlansCount - a.linkedPlansCount)
        break
    }
    return out
  }, [alimentos, searchQuery, selectedSource, selectedCategory, selectedSort])

  // Live source counts (consider search but not source/category, so the user can still see other sources)
  const liveSources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = (a: Alimento) =>
      !q || a.name.toLowerCase().includes(q)

    const matchesCategory = (a: Alimento) =>
      selectedCategory === 'todas' || a.category === selectedCategory

    const filtered = alimentos.filter((a) => matchesSearch(a) && matchesCategory(a))

    return baseProps.sources.map((s) => {
      let count = 0
      if (s.id === 'todos') count = filtered.length
      else if (s.id === 'favoritos') count = filtered.filter((a) => a.isFavorite).length
      else count = filtered.filter((a) => a.source === s.id).length
      return { ...s, count }
    })
  }, [alimentos, searchQuery, selectedCategory, baseProps.sources])

  // Live category counts (consider search and source, but not category itself)
  const liveCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = (a: Alimento) =>
      !q || a.name.toLowerCase().includes(q)
    const matchesSource = (a: Alimento) =>
      selectedSource === 'todos' ||
      (selectedSource === 'favoritos' && a.isFavorite) ||
      a.source === selectedSource

    const filtered = alimentos.filter((a) => matchesSearch(a) && matchesSource(a))

    return baseProps.categories.map((c) => {
      const count = filtered.filter((a) => a.category === c.id).length
      return { ...c, count }
    })
  }, [alimentos, searchQuery, selectedSource, baseProps.categories])

  // Live stats
  const liveStats = useMemo(() => {
    return {
      total: alimentos.length,
      tbca: alimentos.filter((a) => a.source === 'tbca').length,
      custom: alimentos.filter((a) => a.source === 'custom').length,
      favoritos: alimentos.filter((a) => a.isFavorite).length,
    }
  }, [alimentos])

  // Category labels map
  const categoryLabels = useMemo(() => {
    return Object.fromEntries(
      liveCategories.map((c) => [c.id, c.label]),
    ) as Record<CategoryId, string>
  }, [liveCategories])

  function getAlimento(id: string | null) {
    return id ? alimentos.find((a) => a.id === id) ?? null : null
  }

  function openDetail(id: string) {
    setDrawer({ mode: 'view', alimentoId: id, duplicateFromTbca: false })
  }
  function openCreate() {
    setDrawer({ mode: 'create', alimentoId: null, duplicateFromTbca: false })
  }
  function openEdit(id: string) {
    setDrawer({ mode: 'edit', alimentoId: id, duplicateFromTbca: false })
  }
  function openDuplicate(id: string) {
    setDrawer({ mode: 'create', alimentoId: id, duplicateFromTbca: true })
  }
  function closeDrawer() {
    setDrawer({ mode: 'closed', alimentoId: null, duplicateFromTbca: false })
  }

  function toggleFavorite(id: string) {
    setAlimentos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isFavorite: !a.isFavorite } : a)),
    )
  }

  function handleCreate(draft: AlimentoFormDraft) {
    const newOne: Alimento = {
      id: `ali_custom_${Date.now()}`,
      source: 'custom',
      createdBy: baseProps.nutri.id,
      name: draft.name,
      category: draft.category,
      kcalPer100g: draft.kcalPer100g,
      proteinPer100g: draft.proteinPer100g,
      carbPer100g: draft.carbPer100g,
      fatPer100g: draft.fatPer100g,
      fiberPer100g: draft.fiberPer100g,
      defaultPortion: { label: draft.portionLabel, grams: draft.portionGrams },
      isFavorite: false,
      linkedPlansCount: 0,
    }
    setAlimentos((prev) => [...prev, newOne])
    closeDrawer()
  }

  function handleUpdate(id: string, draft: AlimentoFormDraft) {
    setAlimentos((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              name: draft.name,
              category: draft.category,
              kcalPer100g: draft.kcalPer100g,
              proteinPer100g: draft.proteinPer100g,
              carbPer100g: draft.carbPer100g,
              fatPer100g: draft.fatPer100g,
              fiberPer100g: draft.fiberPer100g,
              defaultPortion: { label: draft.portionLabel, grams: draft.portionGrams },
            }
          : a,
      ),
    )
    closeDrawer()
  }

  function requestDelete(id: string) {
    const a = getAlimento(id)
    if (!a) return
    setDeleteTarget(a)
    closeDrawer()
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setAlimentos((prev) => prev.filter((a) => a.id !== id))
    setDeleteTarget(null)
  }

  function clearFilters() {
    setSearchQuery('')
    setSelectedSource('todos')
    setSelectedCategory('todas')
  }

  const viewProps: AlimentosProps = {
    ...baseProps,
    alimentos: visibleAlimentos,
    sources: liveSources,
    selectedSource,
    categories: liveCategories,
    selectedCategory,
    selectedSort,
    stats: liveStats,
    searchQuery,
  }

  const drawerAlimento = getAlimento(drawer.alimentoId)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-alimentos],
        [data-nymos-alimentos] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-alimentos] .font-mono,
        [data-nymos-alimentos] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <AlimentosListView
        {...viewProps}
        onSearchChange={setSearchQuery}
        onSourceChange={setSelectedSource}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
        onToggleFavorite={toggleFavorite}
        onOpenDetail={openDetail}
        onOpenCreate={openCreate}
        onClearFilters={clearFilters}
      />

      <AlimentoDrawer
        mode={drawer.mode}
        alimento={drawerAlimento}
        duplicateFromTbca={drawer.duplicateFromTbca}
        defaults={baseProps.drawerDefaults}
        categoryLabels={categoryLabels}
        onClose={closeDrawer}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onEdit={openEdit}
        onDuplicateAsCustom={openDuplicate}
        onRequestDelete={requestDelete}
        onToggleFavorite={toggleFavorite}
      />

      <DeleteConfirmModal
        alimento={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
