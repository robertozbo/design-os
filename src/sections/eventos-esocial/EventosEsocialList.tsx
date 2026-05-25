import { useMemo, useState } from 'react'
import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  Ambiente,
  CertificadoStatus,
  EventoEsocial,
  FiltrosLista,
  StatusEvento,
  SubTelaModulo,
} from '@/../product/sections/eventos-esocial/types'
import { EventosEsocialList } from './components/EventosEsocialList'

export default function EventosEsocialListPreview() {
  const [filtros, setFiltros] = useState<FiltrosLista>({
    busca: '',
    tipo: 'todos',
    status: 'todos',
    ambiente: (data.empregadorContexto.ambienteCorrente as Ambiente) ?? 'producao',
    periodoInicio: null,
    periodoFim: null,
    origem: 'todos',
    motivoGatilho: 'todos',
    ordenacao: 'mais_recente',
  })

  const [subTela, setSubTela] = useState<SubTelaModulo>('eventos')
  const [eventos, setEventos] = useState<EventoEsocial[]>(
    () => data.eventos as EventoEsocial[],
  )
  const [selecionados, setSelecionados] = useState<string[]>([])

  const lotesEmTransmissao = useMemo(
    () =>
      (data.lotes ?? []).filter(
        (l) => l.status === 'em_transmissao' || l.status === 'recepcionado',
      ).length,
    [],
  )

  return (
    <EventosEsocialList
      empregadorContexto={{
        ...data.empregadorContexto,
        ambienteCorrente: data.empregadorContexto.ambienteCorrente as Ambiente,
      }}
      certificadoStatus={data.certificadoStatus as CertificadoStatus}
      agregado={data.agregado}
      filaAtual={data.filaAtual}
      eventos={eventos}
      estabelecimentos={data.estabelecimentos}
      filtros={filtros}
      subTela={subTela}
      lotesEmTransmissao={lotesEmTransmissao}
      selecionados={selecionados}
      onSubTelaChange={(t) => setSubTela(t)}
      onSelecionarEvento={(id, sel) =>
        setSelecionados((prev) =>
          sel ? [...prev, id] : prev.filter((x) => x !== id),
        )
      }
      onSelecionarTodos={(sel) => setSelecionados(sel ? eventos.map((e) => e.id) : [])}
      onIgnorarEvento={(id) =>
        setEventos((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, status: 'ignorado' as StatusEvento, statusLabel: 'Ignorado' }
              : e,
          ),
        )
      }
      onDesignorarEvento={(id) =>
        setEventos((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, status: 'disponivel' as StatusEvento, statusLabel: 'Disponível para envio' }
              : e,
          ),
        )
      }
      onQuickView={(id) => console.log('Quick view:', id)}
      onGerarLote={(ids) => console.log('Gerar lote com:', ids)}
      onAmbienteChange={(amb) => console.log('Ambiente change:', amb)}
      onNovoEvento={(tipo) => console.log('Novo evento:', tipo)}
      onAbrirEvento={(id) => console.log('Abrir evento:', id)}
      onAbrirFila={() => console.log('Abrir fila')}
      onConfigurarCertificado={() => console.log('Configurar certificado')}
      onValidarXsd={(id) => console.log('Validar XSD:', id)}
      onEnviarParaFila={(id) => console.log('Enviar para fila:', id)}
      onRetificar={(id) => console.log('Retificar:', id)}
      onExcluir={(id, just) => console.log('Excluir S-3000:', id, just)}
      onBaixarXml={(id) => console.log('Baixar XML:', id)}
      onFiltrosChange={(next) => setFiltros(next)}
    />
  )
}
