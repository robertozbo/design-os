import data from '@/../product-clinico/sections/exames/data.json'
import type { ExameDetalhe as ExameDetalheType } from '@/../product-clinico/sections/exames/types'
import { ExameDetalhe as ExameDetalheView } from './components/ExameDetalhe'

export default function ExameDetalhePreview() {
  return (
    <ExameDetalheView
      exame={data.exameDetalhe as ExameDetalheType}
      onVoltar={() => console.log('voltar pra lista')}
      onMarcarRevisado={(obs) => console.log('marcar revisado:', obs)}
      onCompartilharComPaciente={(resumo) => console.log('compartilhar:', resumo)}
      onImprimir={() => console.log('imprimir')}
      onAbrirBiomarker={(nome) => console.log('abrir biomarker:', nome)}
      onAbrirPaciente={(id) => console.log('abrir paciente:', id)}
      onAbrirAuditIA={() => console.log('abrir audit IA')}
    />
  )
}
