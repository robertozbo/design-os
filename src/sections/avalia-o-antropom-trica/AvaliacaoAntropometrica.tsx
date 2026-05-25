import { useState } from 'react'
import data from '@/../product/sections/avalia-o-antropom-trica/data.json'
import type {
  Avaliacao,
  AvaliacaoAntropometricaProps,
  Classificacoes,
  ConfigMedicoes,
  JanelaGrafico,
  MedidaId,
  MedidaSerieOpcao,
  MetaMedida,
  PacienteContexto,
  ProtocoloDobrasOpcao,
} from '@/../product/sections/avalia-o-antropom-trica/types'
import { AvaliacaoAntropometrica } from './components/AvaliacaoAntropometrica'
import { AvaliacaoDrawer } from './components/AvaliacaoDrawer'

type DataShape = {
  pacienteContexto: PacienteContexto
  configMedicoes: ConfigMedicoes
  metas: MetaMedida[]
  medidasSerieOpcoes: MedidaSerieOpcao[]
  protocolosDobras: ProtocoloDobrasOpcao[]
  avaliacoes: Avaliacao[]
  classificacoes: Classificacoes
}

export default function AvaliacaoAntropometricaPreview() {
  const baseProps = data as unknown as DataShape

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(baseProps.avaliacoes)
  const [medidaGrafico, setMedidaGrafico] = useState<MedidaId>('peso')
  const [janelaGrafico, setJanelaGrafico] = useState<JanelaGrafico>('1a')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerEditingId, setDrawerEditingId] = useState<string | null>(null)

  const editing = drawerEditingId ? avaliacoes.find((a) => a.id === drawerEditingId) ?? null : null

  function openDrawer(editingId?: string | null) {
    setDrawerEditingId(editingId ?? null)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setDrawerEditingId(null)
  }

  function saveAvaliacao(payload: Omit<Avaliacao, 'id' | 'criadoEm'>) {
    const now = new Date().toISOString()
    if (drawerEditingId) {
      setAvaliacoes((list) =>
        list.map((a) =>
          a.id === drawerEditingId ? { ...a, ...payload } : a,
        ),
      )
      console.log('Update avaliacao', drawerEditingId, payload)
    } else {
      const id = `av-new-${Date.now()}`
      setAvaliacoes((list) => [{ ...payload, id, criadoEm: now }, ...list])
      console.log('Create avaliacao', { id, ...payload })
    }
    closeDrawer()
  }

  function deleteAvaliacao(id: string) {
    setAvaliacoes((list) => list.filter((a) => a.id !== id))
    setExpandedId((cur) => (cur === id ? null : cur))
    console.log('Delete avaliacao', id)
  }

  const props: AvaliacaoAntropometricaProps = {
    pacienteContexto: baseProps.pacienteContexto,
    configMedicoes: baseProps.configMedicoes,
    avaliacoes,
    metas: baseProps.metas,
    medidasSerieOpcoes: baseProps.medidasSerieOpcoes,
    protocolosDobras: baseProps.protocolosDobras,
    classificacoes: baseProps.classificacoes,
    medidaGrafico,
    janelaGrafico,
    onMedidaGraficoChange: setMedidaGrafico,
    onJanelaGraficoChange: setJanelaGrafico,
    expandedAvaliacaoId: expandedId,
    onToggleExpand: setExpandedId,
    drawerOpen,
    drawerEditingId,
    onOpenDrawer: openDrawer,
    onCloseDrawer: closeDrawer,
    onCreateAvaliacao: saveAvaliacao,
    onUpdateAvaliacao: (id, patch) => {
      setAvaliacoes((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    },
    onDeleteAvaliacao: deleteAvaliacao,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-aa],
        [data-nymos-aa] *,
        [data-aa-drawer],
        [data-aa-drawer] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-aa] .font-mono,
        [data-nymos-aa] .tabular-nums,
        [data-aa-drawer] .font-mono,
        [data-aa-drawer] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <AvaliacaoAntropometrica {...props} />

      <AvaliacaoDrawer
        open={drawerOpen}
        pacienteContexto={baseProps.pacienteContexto}
        configMedicoes={baseProps.configMedicoes}
        classificacoes={baseProps.classificacoes}
        protocolosDobras={baseProps.protocolosDobras}
        editing={editing}
        onClose={closeDrawer}
        onSave={saveAvaliacao}
      />
    </>
  )
}
