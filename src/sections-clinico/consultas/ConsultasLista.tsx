import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinico/sections/consultas/data.json'
import type {
  ConsultaFinalizadaItem,
  FiltroPeriodo,
} from '@/../product-clinico/sections/consultas/types'
import { ConsultasListaView } from './components/ConsultasLista'

export default function ConsultasListaPreview() {
  const navigate = useNavigate()
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroPeriodo>(
    (data.filtroAtivoDefault as FiltroPeriodo) ?? 'hoje',
  )

  const consultas = data.consultasFinalizadas as ConsultaFinalizadaItem[]

  return (
    <ConsultasListaView
      consultas={consultas}
      filtroAtivo={filtroAtivo}
      onAlterarFiltro={(f) => setFiltroAtivo(f)}
      onAbrirConsulta={(id) => {
        console.log('abrir consulta finalizada:', id)
        navigate(`/clinico/sections/consulta?finalizada=${id}`)
      }}
    />
  )
}
