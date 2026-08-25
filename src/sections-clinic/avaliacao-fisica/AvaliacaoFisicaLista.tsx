import { useState } from 'react'
import data from '@/../product-clinic/sections/avaliacao-fisica/data.json'
import type {
  AvaliacaoFisicaData,
  Conselho,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import { AvaliacoesListaView, Toasts, useToasts } from './components'

const d = data as unknown as AvaliacaoFisicaData

/** O histórico da clínica: por paciente, com o conselho de quem mediu como coluna. */
export default function AvaliacaoFisicaListaPreview() {
  const [conselhoFiltro, setConselhoFiltro] = useState<Conselho | 'todos'>('todos')
  const { toasts, push } = useToasts()

  return (
    <>
      <AvaliacoesListaView
        clinica={d.clinica}
        pacientes={d.pacientes}
        conselhoFiltro={conselhoFiltro}
        onConselhoFiltro={setConselhoFiltro}
        onNova={(pacienteId) => {
          const p = d.pacientes.find((x) => x.paciente.id === pacienteId)
          push(`Nova avaliação de ${p?.paciente.nome ?? 'paciente'}`)
        }}
        onAbrir={(_, avaliacaoId) => push(`Abrindo ${avaliacaoId}`)}
      />
      <Toasts toasts={toasts} />
    </>
  )
}
