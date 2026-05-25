import { useState } from 'react'
import data from '@/../product/sections/receitas/data.json'
import type {
  AlimentoLite,
  CategoriaFiltroId,
  CategoriaOpcao,
  DificuldadeOpcao,
  EmptyStates,
  PerfilContexto,
  Receita,
  ReceitasStats,
  ReceitasView,
  SortId,
  SortOpcao,
  TagDieteticaId,
  TagOpcao,
} from '@/../product/sections/receitas/types'
import { Receitas } from './components/Receitas'
import { ReceitaBuilder } from './components/ReceitaBuilder'

type DataShape = {
  perfilContexto: PerfilContexto
  stats: ReceitasStats
  categoriaOpcoes: CategoriaOpcao[]
  tagOpcoes: TagOpcao[]
  sortOptions: SortOpcao[]
  dificuldades: DificuldadeOpcao[]
  alimentos: AlimentoLite[]
  receitas: Receita[]
  emptyStates: EmptyStates
}

export default function ReceitasPreview() {
  const baseProps = data as unknown as DataShape

  const [receitas, setReceitas] = useState<Receita[]>(baseProps.receitas)
  const [view, setView] = useState<ReceitasView>('biblioteca')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Filters
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaFiltroId>('todas')
  const [selectedTags, setSelectedTags] = useState<TagDieteticaId[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState<SortId>('recent')

  const editingReceita = editingId ? receitas.find((r) => r.id === editingId) ?? null : null

  function openNew() {
    setEditingId(null)
    setView('builder')
  }
  function openEdit(id: string) {
    setEditingId(id)
    setView('builder')
  }
  function closeBuilder() {
    setView('biblioteca')
    setEditingId(null)
  }

  function toggleFavorita(id: string) {
    setReceitas((list) =>
      list.map((r) => (r.id === id ? { ...r, isFavorita: !r.isFavorita } : r)),
    )
  }

  function togglePublicada(id: string) {
    setReceitas((list) =>
      list.map((r) => (r.id === id ? { ...r, publicada: !r.publicada } : r)),
    )
    console.log('Toggle publicada', id)
  }

  function deleteReceita(id: string) {
    setReceitas((list) => list.filter((r) => r.id !== id))
    console.log('Delete receita', id)
  }

  function duplicateReceita(id: string) {
    const orig = receitas.find((r) => r.id === id)
    if (!orig) return
    const newId = `rec-new-${Date.now()}`
    const today = new Date().toISOString().slice(0, 10)
    const copy: Receita = {
      ...orig,
      id: newId,
      nome: `${orig.nome} (cópia)`,
      isFavorita: false,
      publicada: false,
      visualizacoesCount: 0,
      salvaPorPacientesCount: 0,
      criadoEm: today,
      editadoEm: today,
    }
    setReceitas((list) => [copy, ...list])
    setEditingId(newId)
    setView('builder')
    console.log('Duplicate receita', id, '→', newId)
  }

  function saveNewReceita(
    payload: Omit<
      Receita,
      'id' | 'criadoEm' | 'editadoEm' | 'isFavorita' | 'visualizacoesCount' | 'salvaPorPacientesCount'
    >,
  ) {
    const today = new Date().toISOString().slice(0, 10)
    const id = `rec-new-${Date.now()}`
    const novo: Receita = {
      ...payload,
      id,
      isFavorita: false,
      visualizacoesCount: 0,
      salvaPorPacientesCount: 0,
      criadoEm: today,
      editadoEm: today,
    }
    setReceitas((list) => [novo, ...list])
    closeBuilder()
    console.log('Create receita', novo)
  }

  function updateExistingReceita(id: string, patch: Partial<Receita>) {
    const today = new Date().toISOString().slice(0, 10)
    setReceitas((list) =>
      list.map((r) => (r.id === id ? { ...r, ...patch, editadoEm: today } : r)),
    )
    closeBuilder()
    console.log('Update receita', id, patch)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-receitas],
        [data-nymos-receitas] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-receitas] .font-mono,
        [data-nymos-receitas] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      {view === 'biblioteca' && (
        <div data-nymos-receitas="true">
          <Receitas
            perfilContexto={baseProps.perfilContexto}
            stats={baseProps.stats}
            receitas={receitas}
            alimentos={baseProps.alimentos}
            categoriaOpcoes={baseProps.categoriaOpcoes}
            tagOpcoes={baseProps.tagOpcoes}
            sortOptions={baseProps.sortOptions}
            dificuldades={baseProps.dificuldades}
            emptyStates={baseProps.emptyStates}
            selectedCategoria={selectedCategoria}
            onCategoriaChange={setSelectedCategoria}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            view={view}
            builderEditing={editingReceita}
            onOpenNew={openNew}
            onOpenEdit={openEdit}
            onToggleFavorita={toggleFavorita}
            onTogglePublicada={togglePublicada}
            onDuplicate={duplicateReceita}
            onDelete={deleteReceita}
          />
        </div>
      )}

      {view === 'builder' && (
        <div data-nymos-receitas="true">
          <ReceitaBuilder
            receita={editingReceita}
            alimentos={baseProps.alimentos}
            categoriaOpcoes={baseProps.categoriaOpcoes}
            tagOpcoes={baseProps.tagOpcoes}
            dificuldades={baseProps.dificuldades}
            onSave={saveNewReceita}
            onSaveExisting={updateExistingReceita}
            onCancel={closeBuilder}
          />
        </div>
      )}
    </>
  )
}
