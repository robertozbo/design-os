import { useState } from 'react'
import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  FilaContexto,
} from '@/../product/sections/eventos-esocial/types'
import { FilaTransmissao } from './components/FilaTransmissao'

export default function FilaTransmissaoPreview() {
  const [ambiente, setAmbiente] = useState<Ambiente>(
    (data.empregadorContexto.ambienteCorrente as Ambiente) ?? 'producao',
  )

  return (
    <FilaTransmissao
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      fila={data.fila as FilaContexto}
      ambiente={ambiente}
      onVoltar={() => console.log('Voltar')}
      onAmbienteChange={(a) => setAmbiente(a)}
      onAbrirEvento={(id) => console.log('Abrir evento:', id)}
      onReenviarAgora={(id) => console.log('Reenviar agora:', id)}
      onCancelar={(id) => console.log('Cancelar:', id)}
      onPriorizar={(id) => console.log('Priorizar:', id)}
      onVerLog={(id) => console.log('Ver log:', id)}
      onPausarWorker={() => console.log('Pausar worker')}
      onRetomarWorker={() => console.log('Retomar worker')}
      onLimparExaustos={() => console.log('Limpar esgotados')}
    />
  )
}
