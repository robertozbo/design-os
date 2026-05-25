import { useState } from 'react'
import data from '@/../product-clinico/sections/exames/data.json'
import type {
  ExameListItem,
  FiltroLista,
} from '@/../product-clinico/sections/exames/types'
import { ExamesLista as ExamesListaView } from './components/ExamesLista'

export default function ExamesListaPreview() {
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroLista>(
    data.filtroAtivo as FiltroLista,
  )

  return (
    <ExamesListaView
      exames={data.examesLista as ExameListItem[]}
      filtroAtivo={filtroAtivo}
      onAplicarFiltro={(f) => setFiltroAtivo(f)}
      onLimparFiltros={() =>
        setFiltroAtivo({ busca: '', tipos: [], statusRevisao: 'todos', periodo: '30d' })
      }
      onAbrirExame={(id) => console.log('abrir exame:', id)}
    />
  )
}
