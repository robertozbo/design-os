import { useState } from 'react'
import data from '@/../product-clinic/sections/avaliacao-fisica/data.json'
import type { AvaliacaoFisicaData } from '@/../product-clinic/sections/avaliacao-fisica/types'
import { ComparativoView, Toasts, useToasts } from './components'

const d = data as unknown as AvaliacaoFisicaData

/**
 * Evolução do Diego: recomposição corporal, em que o peso quase não anda e só a composição
 * mostra que o ciclo funcionou. É o caso em que a tabela de deltas precisa da direção desejável —
 * massa magra subindo é ganho, ainda que o peso tenha caído junto.
 */
export default function AvaliacaoFisicaComparativoPreview() {
  const { paciente, avaliacoes } = d.pacientes[1]
  const serie = [...avaliacoes].sort((a, b) => a.data.localeCompare(b.data))

  const [atualId, setAtualId] = useState(serie[serie.length - 1].id)
  const [referenciaId, setReferenciaId] = useState(serie[0].id)
  const { toasts, push } = useToasts()

  return (
    <>
      <ComparativoView
        paciente={paciente}
        avaliacoes={serie}
        atualId={atualId}
        referenciaId={referenciaId}
        onAtual={setAtualId}
        onReferencia={setReferenciaId}
        onExportar={() => push('Laudo gerado em PDF')}
        onEnviarAoPaciente={() => push('Evolução enviada ao app do paciente')}
      />
      <Toasts toasts={toasts} />
    </>
  )
}
