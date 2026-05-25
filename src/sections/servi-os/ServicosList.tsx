import { useMemo, useState } from 'react'
import data from '@/../product/sections/servi-os/data.json'
import type {
  FilterTypeId,
  Servico,
  ServicoFormDraft,
  ServicosProps,
  SortId,
} from '@/../product/sections/servi-os/types'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { ServicoDrawer } from './components/ServicoDrawer'
import { ServicosList as ServicosListView } from './components/ServicosList'

type DrawerState =
  | { mode: 'closed'; initial: null; duplicateSuffix?: undefined }
  | { mode: 'create'; initial: null; duplicateSuffix?: undefined }
  | { mode: 'edit'; initial: Servico; duplicateSuffix?: undefined }
  | { mode: 'create'; initial: Servico; duplicateSuffix: string } // duplicate

export default function ServicosListPreview() {
  const baseProps = data as unknown as ServicosProps

  const [servicos, setServicos] = useState<Servico[]>(baseProps.servicos)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilterType, setSelectedFilterType] = useState<FilterTypeId>(
    baseProps.selectedFilterType,
  )
  const [selectedSort, setSelectedSort] = useState<SortId>(baseProps.selectedSort)

  const [drawer, setDrawer] = useState<DrawerState>({ mode: 'closed', initial: null })
  const [deleteTarget, setDeleteTarget] = useState<Servico | null>(null)

  // Filter + sort
  const visibleServicos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let out = servicos.filter((s) => {
      const matchesType =
        selectedFilterType === 'todos' || s.defaultAttendanceType === selectedFilterType
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      return matchesType && matchesSearch
    })

    switch (selectedSort) {
      case 'name-asc':
        out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        break
      case 'name-desc':
        out = [...out].sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'))
        break
      case 'price-asc':
        out = [...out].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        out = [...out].sort((a, b) => b.price - a.price)
        break
    }
    return out
  }, [servicos, searchQuery, selectedFilterType, selectedSort])

  // Recompute live filter counts (per type) so pills reflect search-filtered state
  const liveFilterTypes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = (s: Servico) =>
      !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)

    const total = servicos.filter(matchesSearch).length
    const byType = (t: FilterTypeId) =>
      servicos.filter((s) => matchesSearch(s) && s.defaultAttendanceType === t).length

    return baseProps.filterTypes.map((f) => ({
      ...f,
      count: f.id === 'todos' ? total : byType(f.id),
    }))
  }, [servicos, searchQuery, baseProps.filterTypes])

  // Live stats
  const liveStats = useMemo(() => {
    const total = servicos.length
    const byType = {
      presencial: servicos.filter((s) => s.defaultAttendanceType === 'presencial').length,
      teleconsulta: servicos.filter((s) => s.defaultAttendanceType === 'teleconsulta').length,
      domicilio: servicos.filter((s) => s.defaultAttendanceType === 'domicilio').length,
    }
    const averagePrice =
      total === 0 ? 0 : Math.round(servicos.reduce((sum, s) => sum + s.price, 0) / total)
    return { total, byType, averagePrice }
  }, [servicos])

  function openCreate() {
    setDrawer({ mode: 'create', initial: null })
  }

  function openEdit(servicoId: string) {
    const s = servicos.find((x) => x.id === servicoId)
    if (!s) return
    setDrawer({ mode: 'edit', initial: s })
  }

  function openDuplicate(servicoId: string) {
    const s = servicos.find((x) => x.id === servicoId)
    if (!s) return
    setDrawer({ mode: 'create', initial: s, duplicateSuffix: '(cópia)' })
  }

  function requestDelete(servicoId: string) {
    const s = servicos.find((x) => x.id === servicoId)
    if (!s) return
    setDeleteTarget(s)
  }

  function closeDrawer() {
    setDrawer({ mode: 'closed', initial: null })
  }

  function handleSubmit(draft: ServicoFormDraft) {
    if (drawer.mode === 'edit' && drawer.initial) {
      const id = drawer.initial.id
      setServicos((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...draft } : s)),
      )
    } else if (drawer.mode === 'create') {
      const newServico: Servico = {
        id: `srv_new_${Date.now()}`,
        ...draft,
        linkedAppointmentsCount: 0,
      }
      setServicos((prev) => [...prev, newServico])
    }
    closeDrawer()
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setServicos((prev) => prev.filter((s) => s.id !== id))
    setDeleteTarget(null)
  }

  function clearFilters() {
    setSearchQuery('')
    setSelectedFilterType('todos')
  }

  // The view receives the already-filtered list
  const viewProps: ServicosProps = {
    ...baseProps,
    servicos: visibleServicos,
    filterTypes: liveFilterTypes,
    selectedFilterType,
    selectedSort,
    stats: liveStats,
    searchQuery,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-servicos],
        [data-nymos-servicos] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-servicos] .font-mono,
        [data-nymos-servicos] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <ServicosListView
        {...viewProps}
        onSearchChange={setSearchQuery}
        onFilterTypeChange={setSelectedFilterType}
        onSortChange={setSelectedSort}
        onOpenCreate={openCreate}
        onOpenEdit={openEdit}
        onDuplicate={openDuplicate}
        onRequestDelete={requestDelete}
        onClearFilters={clearFilters}
      />

      <ServicoDrawer
        mode={drawer.mode}
        initial={drawer.initial}
        duplicateSuffix={drawer.duplicateSuffix}
        defaults={baseProps.drawerDefaults}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmModal
        servico={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
