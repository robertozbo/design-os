import { useMemo, useState } from 'react'
import data from '@/../product/sections/planos-alimentares/data.json'
import type {
  AlimentoLite,
  FilterOption,
  Meal,
  Nutri,
  ObjetivoOption,
  PatientLite,
  PlanoFull,
  PlanoSummary,
  PlanosListProps,
  SortId,
  StatusFilterId,
  TemplateFull,
  TemplateSummary,
  TemplatesListProps,
  TemplatesStats,
} from '@/../product/sections/planos-alimentares/types'
import { OriginPickerModal } from './components/OriginPickerModal'
import { PatientPickerModal } from './components/PatientPickerModal'
import { PlanoBuilder } from './components/PlanoBuilder'
import { PlanosList as PlanosListView } from './components/PlanosList'
import type { SectionTab } from './components/SectionTabs'
import { TemplateBuilder } from './components/TemplateBuilder'
import { TemplatesList } from './components/TemplatesList'

interface DataShape {
  nutri: Nutri
  patients: PatientLite[]
  alimentos: AlimentoLite[]
  planoFull: PlanoFull
  defaultMealNames: string[]
  templates: TemplateFull[]
  templatesObjetivoFilters: FilterOption<string>[]
  templatesStats: TemplatesStats
  objetivoOptions: ObjetivoOption[]
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function computeTotalKcal(meals: Meal[], alimentos: AlimentoLite[]): number {
  const byId = Object.fromEntries(alimentos.map((a) => [a.id, a]))
  let total = 0
  for (const m of meals) {
    for (const it of m.items) {
      const a = byId[it.alimentoId]
      if (!a) continue
      total += a.kcalPer100g * (it.grams / 100)
    }
  }
  return Math.round(total)
}

function cloneMeals(meals: Meal[]): Meal[] {
  return meals.map((m) => ({
    ...m,
    id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    items: m.items.map((it) => ({
      ...it,
      id: `it_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    })),
  }))
}

type View = 'list' | 'builder-plano' | 'builder-template'

type PickerState =
  | { mode: 'closed' }
  | { mode: 'origin' } // initial new-plan picker (blank/template/plano)
  | { mode: 'patient-create' } // blank → just choose patient
  | { mode: 'patient-from-plano'; sourceId: string }
  | { mode: 'patient-from-template'; sourceId: string }

export default function PlanosListPreview() {
  const baseProps = data as unknown as PlanosListProps
  const fullData = data as unknown as DataShape

  // === State ===

  const [activeTab, setActiveTab] = useState<SectionTab>('planos')

  // Planos
  const [planos, setPlanos] = useState<PlanoSummary[]>(baseProps.planos)
  const [planosFull, setPlanosFull] = useState<Record<string, PlanoFull>>({
    [fullData.planoFull.id]: fullData.planoFull,
  })
  const [planosSearch, setPlanosSearch] = useState('')
  const [planosFilter, setPlanosFilter] = useState<StatusFilterId>(baseProps.selectedFilter)
  const [planosSort, setPlanosSort] = useState<SortId>(baseProps.selectedSort)

  // Templates
  const [templatesFull, setTemplatesFull] = useState<TemplateFull[]>(fullData.templates)
  const [templatesSearch, setTemplatesSearch] = useState('')
  const [templatesObjetivoFilter, setTemplatesObjetivoFilter] = useState<string>('todos')
  const [templatesSort, setTemplatesSort] = useState<SortId>('recent')

  // Builder routing
  const [view, setView] = useState<View>('list')
  const [activePlanoBuilderId, setActivePlanoBuilderId] = useState<string | null>(null)
  const [activeTemplateBuilderId, setActiveTemplateBuilderId] = useState<string | null>(null)

  // Pickers
  const [picker, setPicker] = useState<PickerState>({ mode: 'closed' })

  // === Derived data ===

  const patientsById = useMemo(
    () => Object.fromEntries(baseProps.patients.map((p) => [p.id, p])),
    [baseProps.patients],
  )

  const patientsWithActivePlan = useMemo(() => {
    return new Set(planos.filter((p) => p.status === 'vigente').map((p) => p.patientId))
  }, [planos])

  // Templates → summaries (for list)
  const templatesSummary = useMemo<TemplateSummary[]>(() => {
    return templatesFull.map((t) => ({
      id: t.id,
      name: t.name,
      objetivo: t.objetivo,
      description: t.description,
      targets: t.targets,
      totalKcal: computeTotalKcal(t.meals, fullData.alimentos),
      applicationsCount: t.applicationsCount,
      isFavorite: t.isFavorite,
      createdAt: t.createdAt,
      lastEditedAt: t.lastEditedAt,
    }))
  }, [templatesFull, fullData.alimentos])

  // Planos filter + sort
  const visiblePlanos = useMemo(() => {
    const q = planosSearch.trim().toLowerCase()
    let out = planos.filter((p) => {
      const matchesFilter = planosFilter === 'todos' || p.status === planosFilter
      const patient = patientsById[p.patientId]
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (patient?.name.toLowerCase().includes(q) ?? false)
      return matchesFilter && matchesSearch
    })

    switch (planosSort) {
      case 'recent':
        out = [...out].sort((a, b) => b.lastEditedAt.localeCompare(a.lastEditedAt))
        break
      case 'name-asc':
        out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        break
      case 'patient-asc':
        out = [...out].sort((a, b) => {
          const an = patientsById[a.patientId]?.name ?? ''
          const bn = patientsById[b.patientId]?.name ?? ''
          return an.localeCompare(bn, 'pt-BR')
        })
        break
      case 'adherence-desc':
        out = [...out].sort(
          (a, b) => (b.adherenceLast7d ?? -1) - (a.adherenceLast7d ?? -1),
        )
        break
    }

    return out
  }, [planos, planosSearch, planosFilter, planosSort, patientsById])

  const livePlanoFilters = useMemo(() => {
    const q = planosSearch.trim().toLowerCase()
    const matchesSearch = (p: PlanoSummary) => {
      if (!q) return true
      const patient = patientsById[p.patientId]
      return p.name.toLowerCase().includes(q) || (patient?.name.toLowerCase().includes(q) ?? false)
    }
    const total = planos.filter(matchesSearch).length

    return baseProps.filters.map((f) => {
      const count =
        f.id === 'todos'
          ? total
          : planos.filter((p) => matchesSearch(p) && p.status === f.id).length
      return { ...f, count }
    })
  }, [planos, baseProps.filters, planosSearch, patientsById])

  const livePlanoStats = useMemo(() => {
    return {
      total: planos.length,
      vigente: planos.filter((p) => p.status === 'vigente').length,
      rascunho: planos.filter((p) => p.status === 'rascunho').length,
      encerrado: planos.filter((p) => p.status === 'encerrado').length,
      arquivado: planos.filter((p) => p.status === 'arquivado').length,
    }
  }, [planos])

  // Templates filter + sort
  const visibleTemplates = useMemo(() => {
    const q = templatesSearch.trim().toLowerCase()
    let out = templatesSummary.filter((t) => {
      const matchesObjetivo =
        templatesObjetivoFilter === 'todos' ||
        (templatesObjetivoFilter === 'favoritos' && t.isFavorite) ||
        t.objetivo?.id === templatesObjetivoFilter
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      return matchesObjetivo && matchesSearch
    })

    switch (templatesSort) {
      case 'recent':
        out = [...out].sort((a, b) => b.lastEditedAt.localeCompare(a.lastEditedAt))
        break
      case 'name-asc':
        out = [...out].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        break
      default:
        out = [...out].sort((a, b) => b.applicationsCount - a.applicationsCount)
    }
    return out
  }, [templatesSummary, templatesSearch, templatesObjetivoFilter, templatesSort])

  const liveTemplateFilters = useMemo<FilterOption<string>[]>(() => {
    const q = templatesSearch.trim().toLowerCase()
    const matchesSearch = (t: TemplateSummary) =>
      !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    const filtered = templatesSummary.filter(matchesSearch)
    return fullData.templatesObjetivoFilters.map((f) => {
      let count = 0
      if (f.id === 'todos') count = filtered.length
      else if (f.id === 'favoritos') count = filtered.filter((t) => t.isFavorite).length
      else count = filtered.filter((t) => t.objetivo?.id === f.id).length
      return { ...f, count }
    })
  }, [templatesSummary, templatesSearch, fullData.templatesObjetivoFilters])

  const liveTemplateStats = useMemo(
    () => ({
      total: templatesFull.length,
      favoritos: templatesFull.filter((t) => t.isFavorite).length,
    }),
    [templatesFull],
  )

  // === Helpers ===

  function ensurePlanoFull(id: string): PlanoFull | null {
    if (planosFull[id]) return planosFull[id]
    const summary = planos.find((p) => p.id === id)
    if (!summary) return null
    const synthesized: PlanoFull = { ...summary, meals: [] }
    setPlanosFull((prev) => ({ ...prev, [id]: synthesized }))
    return synthesized
  }

  function openPlanoBuilder(id: string) {
    ensurePlanoFull(id)
    setActivePlanoBuilderId(id)
    setView('builder-plano')
  }

  function openTemplateBuilder(id: string) {
    setActiveTemplateBuilderId(id)
    setView('builder-template')
  }

  function backToList() {
    setView('list')
    setActivePlanoBuilderId(null)
    setActiveTemplateBuilderId(null)
  }

  // === Picker handlers ===

  function openOriginPicker() {
    setPicker({ mode: 'origin' })
  }

  function pickBlank() {
    setPicker({ mode: 'patient-create' })
  }

  function pickFromTemplate(templateId: string) {
    setPicker({ mode: 'patient-from-template', sourceId: templateId })
  }

  function pickFromPlano(planoId: string) {
    setPicker({ mode: 'patient-from-plano', sourceId: planoId })
  }

  function applyTemplateFromCard(templateId: string) {
    setPicker({ mode: 'patient-from-template', sourceId: templateId })
  }

  function applyTemplateFromBuilder() {
    if (!activeTemplateBuilderId) return
    setPicker({ mode: 'patient-from-template', sourceId: activeTemplateBuilderId })
  }

  function duplicatePlanoFromBuilder() {
    if (!activePlanoBuilderId) return
    setPicker({ mode: 'patient-from-plano', sourceId: activePlanoBuilderId })
  }

  function closePicker() {
    setPicker({ mode: 'closed' })
  }

  function handlePickPatient(patientId: string) {
    const patient = patientsById[patientId]
    const today = todayIso()
    const id = `plano_new_${Date.now()}`

    let summary: PlanoSummary
    let full: PlanoFull

    if (picker.mode === 'patient-from-plano') {
      const sourceFull = planosFull[picker.sourceId]
      const sourceSummary = planos.find((p) => p.id === picker.sourceId)
      const baseName = (sourceFull?.name ?? sourceSummary?.name ?? 'Plano')
        .replace(/ \(cópia\)$/, '')
      const meals = cloneMeals(sourceFull?.meals ?? [])
      summary = {
        id,
        name: `${baseName} (cópia)`,
        patientId,
        status: 'rascunho',
        objetivo: sourceFull?.objetivo ?? sourceSummary?.objetivo ?? null,
        createdAt: today,
        startDate: null,
        endDate: null,
        lastEditedAt: today,
        targets: sourceFull?.targets ?? sourceSummary?.targets ?? null,
        adherenceLast7d: null,
        totalKcal: computeTotalKcal(meals, fullData.alimentos),
        isFavorite: false,
        createdFromTemplateId: null,
      }
      full = { ...summary, meals }
    } else if (picker.mode === 'patient-from-template') {
      const tmpl = templatesFull.find((t) => t.id === picker.sourceId)
      const meals = cloneMeals(tmpl?.meals ?? [])
      summary = {
        id,
        name: tmpl ? `${tmpl.name} — ${patient?.name ?? ''}`.trim() : `Novo plano — ${patient?.name ?? ''}`.trim(),
        patientId,
        status: 'rascunho',
        objetivo: tmpl?.objetivo ?? null,
        createdAt: today,
        startDate: null,
        endDate: null,
        lastEditedAt: today,
        targets: tmpl?.targets ?? null,
        adherenceLast7d: null,
        totalKcal: computeTotalKcal(meals, fullData.alimentos),
        isFavorite: false,
        createdFromTemplateId: tmpl?.id ?? null,
      }
      full = { ...summary, meals }

      // Increment applicationsCount on the source template
      if (tmpl) {
        setTemplatesFull((prev) =>
          prev.map((t) =>
            t.id === tmpl.id ? { ...t, applicationsCount: t.applicationsCount + 1 } : t,
          ),
        )
      }
    } else {
      // patient-create: blank
      summary = {
        id,
        name: `Novo plano — ${patient?.name ?? ''}`.trim(),
        patientId,
        status: 'rascunho',
        objetivo: null,
        createdAt: today,
        startDate: null,
        endDate: null,
        lastEditedAt: today,
        targets: null,
        adherenceLast7d: null,
        totalKcal: 0,
        isFavorite: false,
        createdFromTemplateId: null,
      }
      full = { ...summary, meals: [] }
    }

    setPlanos((prev) => [summary, ...prev])
    setPlanosFull((prev) => ({ ...prev, [id]: full }))
    closePicker()

    // Switch to plano builder
    setActiveTab('planos')
    setActivePlanoBuilderId(id)
    setView('builder-plano')
  }

  // === Plano builder change ===

  function handlePlanoBuilderChange(next: PlanoFull) {
    const today = todayIso()
    const newKcal = computeTotalKcal(next.meals, fullData.alimentos)
    setPlanosFull((prev) => ({ ...prev, [next.id]: { ...next, lastEditedAt: today, totalKcal: newKcal } }))
    setPlanos((prev) =>
      prev.map((p) =>
        p.id === next.id
          ? {
              ...p,
              name: next.name,
              objetivo: next.objetivo,
              targets: next.targets,
              isFavorite: next.isFavorite,
              lastEditedAt: today,
              totalKcal: newKcal,
            }
          : p,
      ),
    )
  }

  function handleTemplateBuilderChange(next: TemplateFull) {
    const today = todayIso()
    const newKcal = computeTotalKcal(next.meals, fullData.alimentos)
    setTemplatesFull((prev) =>
      prev.map((t) =>
        t.id === next.id ? { ...next, lastEditedAt: today, totalKcal: newKcal } : t,
      ),
    )
  }

  function togglePlanoFavorite(id: string) {
    setPlanos((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)))
    setPlanosFull((prev) => {
      const cur = prev[id]
      if (!cur) return prev
      return { ...prev, [id]: { ...cur, isFavorite: !cur.isFavorite } }
    })
  }

  function toggleTemplateFavorite(id: string) {
    setTemplatesFull((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t)),
    )
  }

  function createNewTemplate() {
    const today = todayIso()
    const id = `tmpl_new_${Date.now()}`
    const newTemplate: TemplateFull = {
      id,
      name: 'Novo template',
      objetivo: null,
      description: '',
      targets: null,
      totalKcal: 0,
      applicationsCount: 0,
      isFavorite: false,
      createdAt: today,
      lastEditedAt: today,
      meals: [],
    }
    setTemplatesFull((prev) => [newTemplate, ...prev])
    setActiveTemplateBuilderId(id)
    setView('builder-template')
  }

  function deleteTemplate(id: string) {
    setTemplatesFull((prev) => prev.filter((t) => t.id !== id))
    backToList()
  }

  // === Render ===

  const planoBuilderEntity = activePlanoBuilderId ? planosFull[activePlanoBuilderId] : null
  const templateBuilderEntity = activeTemplateBuilderId
    ? templatesFull.find((t) => t.id === activeTemplateBuilderId)
    : null

  // Source name for picker header (when duplicating)
  const pickerSourceName =
    picker.mode === 'patient-from-plano'
      ? planosFull[picker.sourceId]?.name ?? planos.find((p) => p.id === picker.sourceId)?.name
      : picker.mode === 'patient-from-template'
      ? templatesFull.find((t) => t.id === picker.sourceId)?.name
      : undefined

  const pickerExcludePatientId =
    picker.mode === 'patient-from-plano'
      ? planosFull[picker.sourceId]?.patientId ??
        planos.find((p) => p.id === picker.sourceId)?.patientId
      : undefined

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-planos],
        [data-nymos-planos] *,
        [data-nymos-templates],
        [data-nymos-templates] *,
        [data-nymos-builder],
        [data-nymos-builder] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-planos] .font-mono,
        [data-nymos-planos] .tabular-nums,
        [data-nymos-templates] .font-mono,
        [data-nymos-templates] .tabular-nums,
        [data-nymos-builder] .font-mono,
        [data-nymos-builder] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      {view === 'list' && activeTab === 'planos' && (
        <PlanosListView
          nutri={baseProps.nutri}
          planos={visiblePlanos}
          patients={baseProps.patients}
          filters={livePlanoFilters}
          selectedFilter={planosFilter}
          selectedSort={planosSort}
          sortOptions={baseProps.sortOptions}
          stats={livePlanoStats}
          emptyStates={baseProps.emptyStates}
          objetivoOptions={fullData.objetivoOptions}
          searchQuery={planosSearch}
          onSearchChange={setPlanosSearch}
          onFilterChange={setPlanosFilter}
          onSortChange={setPlanosSort}
          onOpenCreate={openOriginPicker}
          onOpenPlano={openPlanoBuilder}
          onToggleFavorite={togglePlanoFavorite}
          onClearFilters={() => {
            setPlanosSearch('')
            setPlanosFilter('todos')
          }}
          planosCountForTabs={planos.length}
          templatesCountForTabs={templatesFull.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {view === 'list' && activeTab === 'templates' && (
        <TemplatesList
          nutri={baseProps.nutri}
          templates={visibleTemplates}
          objetivoFilters={liveTemplateFilters}
          selectedObjetivoFilter={templatesObjetivoFilter}
          sortOptions={baseProps.sortOptions.filter((s) => s.id === 'recent' || s.id === 'name-asc')}
          selectedSort={templatesSort}
          stats={liveTemplateStats}
          objetivoOptions={fullData.objetivoOptions}
          searchQuery={templatesSearch}
          onSearchChange={setTemplatesSearch}
          onObjetivoFilterChange={setTemplatesObjetivoFilter}
          onSortChange={setTemplatesSort}
          onToggleFavorite={toggleTemplateFavorite}
          onOpenCreate={createNewTemplate}
          onOpenTemplate={openTemplateBuilder}
          onApplyTemplate={applyTemplateFromCard}
          planosCount={planos.length}
          templatesCountForTabs={templatesFull.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          emptyTitle={baseProps.emptyStates.noPlans.title}
          emptyDescription="Crie templates dos planos que você usa muito — depois aplica em qualquer paciente em 2 cliques."
          emptyCtaLabel="Criar primeiro template"
        />
      )}

      {view === 'builder-plano' && planoBuilderEntity && (
        <PlanoBuilder
          nutri={fullData.nutri}
          plano={planoBuilderEntity}
          patients={fullData.patients}
          alimentos={fullData.alimentos}
          defaultMealNames={fullData.defaultMealNames}
          objetivoOptions={fullData.objetivoOptions}
          onPlanoChange={handlePlanoBuilderChange}
          onBack={backToList}
          onSaveDraft={() => {
            console.log('save draft', planoBuilderEntity)
            backToList()
          }}
          onPublish={() => {
            setPlanos((prev) =>
              prev.map((p) =>
                p.id === planoBuilderEntity.id
                  ? { ...p, status: 'vigente', startDate: p.startDate ?? todayIso() }
                  : p,
              ),
            )
            backToList()
          }}
          onDuplicate={duplicatePlanoFromBuilder}
          onArchive={() => {
            setPlanos((prev) =>
              prev.map((p) =>
                p.id === planoBuilderEntity.id ? { ...p, status: 'arquivado' } : p,
              ),
            )
            backToList()
          }}
          onDelete={() => {
            setPlanos((prev) => prev.filter((p) => p.id !== planoBuilderEntity.id))
            setPlanosFull((prev) => {
              const next = { ...prev }
              delete next[planoBuilderEntity.id]
              return next
            })
            backToList()
          }}
          onToggleFavorite={() => togglePlanoFavorite(planoBuilderEntity.id)}
        />
      )}

      {view === 'builder-template' && templateBuilderEntity && (
        <TemplateBuilder
          nutri={fullData.nutri}
          template={templateBuilderEntity}
          alimentos={fullData.alimentos}
          defaultMealNames={fullData.defaultMealNames}
          objetivoOptions={fullData.objetivoOptions}
          onTemplateChange={handleTemplateBuilderChange}
          onBack={backToList}
          onSaveTemplate={() => {
            console.log('save template', templateBuilderEntity)
            backToList()
          }}
          onApplyToPatient={applyTemplateFromBuilder}
          onToggleFavorite={() => toggleTemplateFavorite(templateBuilderEntity.id)}
          onDelete={() => deleteTemplate(templateBuilderEntity.id)}
        />
      )}

      {/* Origin picker (initial step when "+ Novo plano") */}
      <OriginPickerModal
        open={picker.mode === 'origin'}
        templates={templatesSummary}
        planos={planos}
        patients={baseProps.patients}
        objetivoOptions={fullData.objetivoOptions}
        onClose={closePicker}
        onPickBlank={pickBlank}
        onPickTemplate={pickFromTemplate}
        onPickPlano={pickFromPlano}
      />

      {/* Patient picker (final step) */}
      <PatientPickerModal
        open={
          picker.mode === 'patient-create' ||
          picker.mode === 'patient-from-plano' ||
          picker.mode === 'patient-from-template'
        }
        mode={
          picker.mode === 'patient-from-plano'
            ? 'duplicate'
            : picker.mode === 'patient-from-template'
            ? 'apply-template'
            : 'create'
        }
        sourcePlanName={pickerSourceName}
        excludePatientId={pickerExcludePatientId}
        patients={baseProps.patients}
        patientsWithActivePlan={patientsWithActivePlan}
        onClose={closePicker}
        onPick={handlePickPatient}
      />
    </>
  )
}
