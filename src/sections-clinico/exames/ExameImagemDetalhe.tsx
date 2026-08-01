import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinico/sections/exames/data.json'
import type { ExameImagemDetalhe as ExameImagemDetalheType } from '@/../product-clinico/sections/exames/types'
import { ExameImagemDetalhe as ExameImagemDetalheView } from './components/ExameImagemDetalhe'

export default function ExameImagemDetalhePreview() {
  const navigate = useNavigate()
  const exames = data.examesImagemDetalhes as ExameImagemDetalheType[]
  const [selectedId, setSelectedId] = useState<string>(exames[0]?.id ?? '')

  return (
    <ExameImagemDetalheView
      exames={exames}
      selectedId={selectedId}
      onSelectExame={(id) => setSelectedId(id)}
      onVoltar={() => navigate(-1)}
      onMarcarRevisado={(id, obs) => console.log('marcar revisado:', id, obs)}
      onCompartilharComPaciente={(id, resumo) => console.log('compartilhar:', id, resumo)}
      onImprimir={(id) => console.log('imprimir:', id)}
      onAbrirDicomExterno={(id, serieId) => console.log('abrir DICOM:', id, serieId)}
      onAbrirPaciente={(pid) => console.log('abrir paciente:', pid)}
      onAbrirAuditIA={(id) => console.log('audit IA:', id)}
      onAbrirComparacao={(id) => console.log('comparação:', id)}
    />
  )
}
