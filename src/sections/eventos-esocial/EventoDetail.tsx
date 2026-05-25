import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  EventoEsocial,
} from '@/../product/sections/eventos-esocial/types'
import { EventoDetail } from './components/EventoDetail'

const FEATURED_ID = 'evt-2220-0118'

export default function EventoDetailPreview() {
  const eventos = data.eventos as EventoEsocial[]
  const evento =
    eventos.find((e) => e.id === FEATURED_ID) ??
    eventos.find((e) => e.status === 'rejeitado') ??
    eventos[0]

  return (
    <EventoDetail
      evento={evento}
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      eventosRelacionados={eventos.filter(
        (e) => e.id === evento.retificacaoDe || e.id === evento.retificadoPor,
      )}
      onVoltar={() => console.log('Voltar')}
      onAbrirEvento={(id) => console.log('Abrir evento:', id)}
      onAbrirTrabalhador={(id) => console.log('Abrir trabalhador:', id)}
      onAbrirOrigem={(id) => console.log('Abrir origem:', id)}
      onEditar={(id) => console.log('Editar:', id)}
      onValidarXsd={(id) => console.log('Validar XSD:', id)}
      onEnviarParaFila={(id) => console.log('Enviar para fila:', id)}
      onRetificar={(id) => console.log('Retificar:', id)}
      onExcluir={(id, just) => console.log('Excluir S-3000:', id, just)}
      onBaixarXml={(id) => console.log('Baixar XML:', id)}
      onUploadAnexo={(id) => console.log('Upload anexo em:', id)}
      onRemoverAnexo={(id, ax) => console.log('Remover anexo:', id, ax)}
      onAbrirAnexo={(id, ax) => console.log('Abrir anexo:', id, ax)}
      onRetentarTransmissao={(id) => console.log('Retentar transmissão:', id)}
    />
  )
}
