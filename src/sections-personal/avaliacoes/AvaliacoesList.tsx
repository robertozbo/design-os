import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-personal/sections/avaliacoes/data.json'
import type {
  Avaliacao,
  PeriodoId,
  SortId,
  TipoFiltroId,
} from '@/../product-personal/sections/avaliacoes/types'
import { AvaliacoesList as AvaliacoesListView } from './components/AvaliacoesList'

const avaliacoes = data.avaliacoes as Avaliacao[]

export default function AvaliacoesListPreview() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTipo, setSelectedTipo] = useState<TipoFiltroId>(
    data.selected.tipo as TipoFiltroId,
  )
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoId>(
    data.selected.periodo as PeriodoId,
  )
  const [selectedSort, setSelectedSort] = useState<SortId>(
    data.selected.sort as SortId,
  )

  const goToAlunoFicha = (avaliacaoId: string) => {
    const av = avaliacoes.find((a) => a.id === avaliacaoId)
    if (!av) return
    // Em produção: navega pra ficha do aluno + tab Avaliações + abre detalhe
    navigate(
      `/personal/sections/alunos?openAluno=${av.alunoId}&tab=avaliacoes&openAvaliacao=${av.id}`,
    )
  }

  return (
    <AvaliacoesListView
      avaliacoes={avaliacoes}
      tipos={data.tipos as never}
      selectedTipo={selectedTipo}
      periodos={data.periodos as never}
      selectedPeriodo={selectedPeriodo}
      sortOptions={data.sortOptions as never}
      selectedSort={selectedSort}
      stats={data.stats}
      emptyStates={data.emptyStates}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onTipoChange={setSelectedTipo}
      onPeriodoChange={setSelectedPeriodo}
      onSortChange={setSelectedSort}
      onOpenDetail={goToAlunoFicha}
      onClearFilters={() => {
        setSearchQuery('')
        setSelectedTipo('todas')
        setSelectedPeriodo('todas')
      }}
    />
  )
}
