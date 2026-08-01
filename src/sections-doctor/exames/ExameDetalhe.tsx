import { useNavigate } from 'react-router-dom'
import data from '@/../product-doctor/sections/exames/data.json'
import type { ExameDetalhe as ExameDetalheType } from '@/../product-doctor/sections/exames/types'
import { ExameDetalhe as ExameDetalheView } from './components/ExameDetalhe'

export default function ExameDetalhePreview() {
  const navigate = useNavigate()
  return (
    <ExameDetalheView
      exame={data.exameDetalhe as ExameDetalheType}
      onVoltar={() => navigate(-1)}
      onMarcarRevisado={(obs) => console.log('marcar revisado:', obs)}
      onCompartilharComPaciente={(resumo) => console.log('compartilhar:', resumo)}
      onImprimir={() => console.log('imprimir')}
      onAbrirBiomarker={(nome) => console.log('abrir biomarker:', nome)}
      onAbrirPaciente={(id) => console.log('abrir paciente:', id)}
      onAbrirAuditIA={() => console.log('abrir audit IA')}
    />
  )
}
