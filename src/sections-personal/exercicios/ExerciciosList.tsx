import { useState } from 'react'
import data from '@/../product-personal/sections/exercicios/data.json'
import type {
  EquipmentId,
  Exercise,
  MovementPatternId,
  MuscleGroupId,
  SortId,
  SourceId,
} from '@/../product-personal/sections/exercicios/types'
import { ExerciciosList as ExerciciosListView } from './components/ExerciciosList'

const exercicios = data.exercicios as Exercise[]

export default function ExerciciosListPreview() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState<SourceId>(
    data.selected.source as SourceId,
  )
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroupId>(
    data.selected.muscleGroup as MuscleGroupId,
  )
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentId>(
    data.selected.equipment as EquipmentId,
  )
  const [selectedMovementPattern, setSelectedMovementPattern] =
    useState<MovementPatternId>(data.selected.movementPattern as MovementPatternId)
  const [selectedSort, setSelectedSort] = useState<SortId>(
    data.selected.sort as SortId,
  )
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    Object.fromEntries(exercicios.map((e) => [e.id, e.isFavorite])),
  )

  const filtered = exercicios
    .map((e) => ({ ...e, isFavorite: favorites[e.id] ?? false }))
    .filter((e) => {
      if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false
      if (selectedSource === 'curados' && e.source !== 'curated') return false
      if (selectedSource === 'customizados' && e.source !== 'custom') return false
      if (selectedSource === 'favoritos' && !e.isFavorite) return false
      if (selectedMuscleGroup !== 'todos' && e.muscleGroup !== selectedMuscleGroup)
        return false
      if (selectedEquipment !== 'todos' && e.equipment !== selectedEquipment)
        return false
      if (
        selectedMovementPattern !== 'todos' &&
        e.movementPattern !== selectedMovementPattern
      )
        return false
      return true
    })
    .sort((a, b) => {
      if (selectedSort === 'name-asc') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <ExerciciosListView
      exercicios={filtered}
      sources={data.sources as never}
      selectedSource={selectedSource}
      muscleGroups={data.muscleGroups as never}
      selectedMuscleGroup={selectedMuscleGroup}
      equipment={data.equipment as never}
      selectedEquipment={selectedEquipment}
      movementPatterns={data.movementPatterns as never}
      selectedMovementPattern={selectedMovementPattern}
      sortOptions={data.sortOptions as never}
      selectedSort={selectedSort}
      stats={data.stats}
      emptyStates={data.emptyStates}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onSourceChange={setSelectedSource}
      onMuscleGroupChange={setSelectedMuscleGroup}
      onEquipmentChange={setSelectedEquipment}
      onMovementPatternChange={setSelectedMovementPattern}
      onSortChange={setSelectedSort}
      onToggleFavorite={(id) =>
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }))
      }
      onOpenDetail={(id) => console.log('open detail:', id)}
      onOpenCreate={() => console.log('open create')}
      onClearFilters={() => {
        setSearchQuery('')
        setSelectedSource('todos')
        setSelectedMuscleGroup('todos')
        setSelectedEquipment('todos')
        setSelectedMovementPattern('todos')
      }}
      onDuplicateAsCustom={(id) => console.log('duplicate as custom:', id)}
      onEdit={(id) => console.log('edit:', id)}
      onDelete={(id) => console.log('delete:', id)}
    />
  )
}
