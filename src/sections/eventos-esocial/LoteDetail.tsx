import data from '@/../product/sections/eventos-esocial/data.json'
import type { Ambiente, Lote } from '@/../product/sections/eventos-esocial/types'
import { LoteDetail } from './components/LoteDetail'

const FEATURED_LOTE_ID = 'lot-1834'

export default function LoteDetailPreview() {
  const lotes = (data.lotes ?? []) as Lote[]
  const lote =
    lotes.find((l) => l.id === FEATURED_LOTE_ID) ??
    lotes.find((l) => l.status === 'processado_com_erros') ??
    lotes[0]

  if (!lote) {
    return (
      <div className="p-10 text-center text-sm text-slate-500">
        Nenhum lote disponível para preview.
      </div>
    )
  }

  return (
    <LoteDetail
      lote={lote}
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      onVoltar={() => console.log('Voltar para Lotes')}
      onAbrirEvento={(id) => console.log('Abrir evento:', id)}
      onBaixarXml={(id) => console.log('Baixar XML do lote:', id)}
      onBaixarProtocolo={(id) => console.log('Baixar protocolo:', id)}
      onCancelarTransmissao={(id) => console.log('Cancelar transmissão:', id)}
      onReprocessarRejeitados={(id) => console.log('Reprocessar rejeitados:', id)}
    />
  )
}
