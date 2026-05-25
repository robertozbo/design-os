import { useState } from 'react'
import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  CertificadoStatus,
  EventoEsocial,
} from '@/../product/sections/eventos-esocial/types'
import { GerarLoteWizard } from './components/GerarLoteWizard'

// Eventos selecionados de exemplo — pega os "disponíveis" + 1 novo do S-2221
const SELECIONADOS_IDS = ['evt-2221-0009']

export default function GerarLoteWizardPreview() {
  const eventos = data.eventos as EventoEsocial[]
  const [selecionados, setSelecionados] = useState<EventoEsocial[]>(() => {
    // Top 7 eventos que poderiam ir num lote (disponíveis + rejeitados pra reenvio)
    const candidatos = eventos.filter(
      (e) =>
        e.status === 'disponivel' ||
        e.status === 'rascunho' ||
        e.status === 'validado' ||
        e.status === 'rejeitado',
    )
    if (candidatos.length === 0) return eventos.slice(0, 7)
    // Pega no máximo 7 pra demo, garantindo mix de tipos
    return candidatos.slice(0, 7)
  })

  return (
    <GerarLoteWizard
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      certificadoStatus={data.certificadoStatus as CertificadoStatus}
      eventosSelecionados={selecionados}
      ambiente="producao"
      onCancelar={() => console.log('Cancelar wizard')}
      onRemoverEvento={(id) =>
        setSelecionados((prev) => prev.filter((e) => e.id !== id))
      }
      onValidar={(ids) => console.log('Validar:', ids)}
      onConfirmarEnvio={(ids) => console.log('Confirmar envio do lote:', ids)}
      onIrParaLote={(id) => console.log('Ir para o lote:', id)}
      onVoltarParaEventos={() => console.log('Voltar para eventos')}
    />
  )
}
