import { useMemo, useState } from 'react'
import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  FiltrosLotes,
  Lote,
  SubTelaModulo,
} from '@/../product/sections/eventos-esocial/types'
import { LotesList } from './components/LotesList'

export default function LotesListPreview() {
  const [filtros, setFiltros] = useState<FiltrosLotes>({
    busca: '',
    status: 'todos',
    ambiente: (data.empregadorContexto.ambienteCorrente as Ambiente) ?? 'producao',
    periodoInicio: null,
    periodoFim: null,
  })
  const [subTela, setSubTela] = useState<SubTelaModulo>('lotes')

  const lotes = (data.lotes ?? []) as Lote[]
  const lotesEmTransmissao = useMemo(
    () =>
      lotes.filter((l) => l.status === 'em_transmissao' || l.status === 'recepcionado').length,
    [lotes],
  )
  const eventosDisponiveis = useMemo(
    () => (data.eventos as { status: string }[]).filter((e) => e.status === 'disponivel').length,
    [],
  )

  return (
    <LotesList
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      lotes={lotes}
      filtros={filtros}
      subTela={subTela}
      lotesEmTransmissao={lotesEmTransmissao}
      eventosDisponiveis={eventosDisponiveis}
      onSubTelaChange={(t) => setSubTela(t)}
      onAbrirLote={(id) => console.log('Abrir lote:', id)}
      onAmbienteChange={(amb) => console.log('Ambiente change:', amb)}
      onFiltrosChange={(next) => setFiltros(next)}
      onBaixarXml={(id) => console.log('Baixar XML:', id)}
      onBaixarProtocolo={(id) => console.log('Baixar protocolo:', id)}
    />
  )
}
