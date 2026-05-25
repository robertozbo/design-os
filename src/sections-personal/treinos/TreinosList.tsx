import { useState } from 'react'
import data from '@/../product-personal/sections/treinos/data.json'
import exerciciosData from '@/../product-personal/sections/exercicios/data.json'
import type {
  AlunoOption,
  AplicarEmAlunoData,
  DetailTabId,
  ExercicioBiblio,
  NovoPlanoData,
  ObjetivoFiltroId,
  Plano,
  TabId,
} from '@/../product-personal/sections/treinos/types'
import { TreinosList as TreinosListView } from './components/TreinosList'
import { PlanoAtribuidoDetail } from './components/PlanoAtribuidoDetail'
import { AplicarEmAlunoModal } from './components/AplicarEmAlunoModal'
import { NovoPlanoBuilder } from './components/NovoPlanoBuilder'

const planos = data.planos as Plano[]
const alunosDisponiveis = data.alunosDisponiveis as AlunoOption[]
const exerciciosBiblio = (exerciciosData.exercicios as ExercicioBiblio[]) ?? []

export default function TreinosListPreview() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<TabId>(
    data.selected.tab as TabId,
  )
  const [selectedObjetivo, setSelectedObjetivo] = useState<ObjetivoFiltroId>(
    data.selected.objetivo as ObjetivoFiltroId,
  )
  const [openDetailId, setOpenDetailId] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTabId>('visao-geral')
  const [applyTemplateId, setApplyTemplateId] = useState<string | null>(null)
  const [builderOpen, setBuilderOpen] = useState(false)

  const detailPlano = openDetailId
    ? planos.find((p) => p.id === openDetailId) ?? null
    : null
  const applyTemplate = applyTemplateId
    ? planos.find((p) => p.id === applyTemplateId) ?? null
    : null

  // Detail view
  if (detailPlano && detailPlano.status === 'atribuido') {
    return (
      <PlanoAtribuidoDetail
        plano={detailPlano}
        selectedTab={detailTab}
        onTabChange={setDetailTab}
        onBack={() => {
          setOpenDetailId(null)
          setDetailTab('visao-geral')
        }}
        onAdjustPlano={() => console.log('adjust plano')}
        onMessageAluno={() =>
          console.log('message aluno', detailPlano.aluno?.id)
        }
        onArchive={() => console.log('archive', detailPlano.id)}
        onSaveAsTemplate={() =>
          console.log('save as template from', detailPlano.id)
        }
      />
    )
  }

  return (
    <>
      <TreinosListView
        planos={planos}
        tabs={data.tabs as never}
        selectedTab={selectedTab}
        objetivos={data.objetivos as never}
        selectedObjetivo={selectedObjetivo}
        duracoes={data.duracoes as never}
        emptyStates={data.emptyStates}
        searchQuery={searchQuery}
        onTabChange={setSelectedTab}
        onSearchChange={setSearchQuery}
        onObjetivoChange={setSelectedObjetivo}
        onCreate={() => setBuilderOpen(true)}
        onOpenDetail={(id) => {
          const plano = planos.find((p) => p.id === id)
          if (plano?.status === 'atribuido') {
            setOpenDetailId(id)
            setDetailTab('visao-geral')
          } else {
            console.log('open detail (template/arquivado):', id)
          }
        }}
        onApplyToAluno={(id) => setApplyTemplateId(id)}
        onEdit={(id) => console.log('edit:', id)}
        onDuplicate={(id) => console.log('duplicate:', id)}
        onArchive={(id) => console.log('archive:', id)}
        onUnarchive={(id) => console.log('unarchive:', id)}
        onMessageAluno={(id) => console.log('message aluno:', id)}
        onSaveAsTemplate={(id) => console.log('save as template:', id)}
        onClearFilters={() => {
          setSearchQuery('')
          setSelectedObjetivo('todos')
        }}
      />

      <AplicarEmAlunoModal
        open={!!applyTemplate}
        template={applyTemplate}
        alunosDisponiveis={alunosDisponiveis}
        onClose={() => setApplyTemplateId(null)}
        onConfirm={(data: AplicarEmAlunoData) => {
          console.log('aplicar em aluno:', data)
          setApplyTemplateId(null)
        }}
      />

      <NovoPlanoBuilder
        open={builderOpen}
        exercicios={exerciciosBiblio}
        onClose={() => setBuilderOpen(false)}
        onSave={(payload: NovoPlanoData, asDraft: boolean) => {
          console.log('novo plano:', { asDraft, payload })
          setBuilderOpen(false)
        }}
      />
    </>
  )
}
