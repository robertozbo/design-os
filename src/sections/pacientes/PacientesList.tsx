import { useMemo, useState } from 'react'
import data from '@/../product/sections/pacientes/data.json'
import type {
  FilterId,
  PacientesProps,
  PatientListItem,
  SortId,
} from '@/../product/sections/pacientes/types'
import { PacientesList as PacientesListView } from './components/PacientesList'

export default function PacientesListPreview() {
  const baseProps = data as unknown as PacientesProps

  // Local interactive state so inputs actually work in the preview.
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterId>(baseProps.list.selectedFilter)
  const [selectedSort, setSelectedSort] = useState<SortId>(baseProps.list.selectedSort)
  const [conviteOpen, setConviteOpen] = useState(false)
  const [cadastrarOpen, setCadastrarOpen] = useState(false)

  const filteredPatients = useMemo(() => {
    let items = [...baseProps.list.patients]

    // Filter
    if (selectedFilter !== 'todos') {
      items = items.filter((p) => matchesFilter(p, selectedFilter))
    }

    // Search
    const q = searchQuery.trim().toLowerCase()
    if (q !== '') {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q),
      )
    }

    // Sort
    items.sort((a, b) => {
      switch (selectedSort) {
        case 'nome-asc':
          return a.name.localeCompare(b.name, 'pt-BR')
        case 'adesao-asc':
          return (a.adherencePercent ?? 999) - (b.adherencePercent ?? 999)
        case 'ultima-consulta':
          return (b.lastAppointmentAt ?? '').localeCompare(a.lastAppointmentAt ?? '')
        case 'recentes':
        default:
          return (b.lastAppointmentAt ?? '').localeCompare(a.lastAppointmentAt ?? '')
      }
    })

    return items
  }, [baseProps.list.patients, selectedFilter, selectedSort, searchQuery])

  const liveProps: PacientesProps = {
    ...baseProps,
    list: {
      ...baseProps.list,
      searchQuery,
      selectedFilter,
      selectedSort,
      patients: filteredPatients,
    },
    modals: {
      ...baseProps.modals,
      convite: { isOpen: conviteOpen },
      cadastrar: { isOpen: cadastrarOpen },
    },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-pacientes],
        [data-nymos-pacientes] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-pacientes] .font-mono,
        [data-nymos-pacientes] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>
      <PacientesListView
        {...liveProps}
        onSearchChange={setSearchQuery}
        onFilterChange={setSelectedFilter}
        onSortChange={setSelectedSort}
        onOpenPatient={(id) => console.log('open patient →', id)}
        onOpenInviteModal={() => setConviteOpen(true)}
        onOpenCadastrarModal={() => setCadastrarOpen(true)}
        onCloseModal={(id) => {
          if (id === 'convite') setConviteOpen(false)
          if (id === 'cadastrar') setCadastrarOpen(false)
        }}
        onCopyInvite={(kind) => console.log('copy invite →', kind)}
        onShareInvite={(channel) => console.log('share via →', channel)}
        onSubmitCadastrar={(d) => {
          console.log('submit cadastrar →', d)
          setCadastrarOpen(false)
        }}
      />
    </>
  )
}

function matchesFilter(patient: PatientListItem, filter: FilterId): boolean {
  switch (filter) {
    case 'vinculados':
      return patient.status === 'vinculado'
    case 'pendentes':
      return patient.status === 'pendente'
    case 'arquivados':
      return patient.status === 'arquivado'
    case 'sem-app':
      return !patient.linkedToApp
    case 'alerta':
      return patient.alertReason !== null
    case 'todos':
    default:
      return true
  }
}
