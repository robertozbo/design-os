import { useState } from 'react'
import data from '@/../product/sections/avalia-es-de-risco/data.json'
import type { StatusFiltro, Avaliacao, Empregador, AvaliacoesKpis } from '@/../product/sections/avalia-es-de-risco/types'
import { AvaliacoesList } from './components/AvaliacoesList'

export default function AvaliacoesListPreview() {
  const [filtroAtivo, setFiltroAtivo] = useState<StatusFiltro>('todos')
  const [busca, setBusca] = useState('')

  return (
    <AvaliacoesList
      empregador={data.empregador as Empregador}
      kpis={data.kpis as AvaliacoesKpis}
      avaliacoes={data.avaliacoes as Avaliacao[]}
      filtroAtivo={filtroAtivo}
      busca={busca}
      onNovaAvaliacao={() => console.log('Nova avaliação')}
      onAbrirAvaliacao={(id) => console.log('Abrir avaliação', id)}
      onFiltrarStatus={(status) => setFiltroAtivo(status)}
      onBuscar={(termo) => setBusca(termo)}
    />
  )
}
