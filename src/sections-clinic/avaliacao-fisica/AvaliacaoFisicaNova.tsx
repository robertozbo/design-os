import { useState } from 'react'
import data from '@/../product-clinic/sections/avaliacao-fisica/data.json'
import type {
  Avaliacao,
  AvaliacaoFisicaData,
  Medidas,
  ProtocoloId,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import { NovaAvaliacaoForm, Toasts, useToasts } from './components'

const d = data as unknown as AvaliacaoFisicaData

/**
 * A tela de medir. Avaliação nova da Ana pelo educador físico da clínica, com a última avaliação
 * (feita pela nutricionista) do lado direito como referência — é o ponto do produto: o corpo é um
 * só, a série é uma só, e quem mede hoje vê o que o colega mediu em agosto.
 */
export default function AvaliacaoFisicaNovaPreview() {
  const { paciente, avaliacoes } = d.pacientes[0]
  const anterior = [...avaliacoes].sort((a, b) => b.data.localeCompare(a.data))[0]

  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    id: 'av-nova',
    pacienteId: paciente.id,
    data: '2026-11-18',
    dataLabel: '18 nov 2026',
    avaliador: d.avaliadorLogado,
    protocolo: 'petroski',
    status: 'rascunho',
    usarBioimpedancia: false,
    parecer: '',
    medidas: {
      pesoKg: 67.9,
      alturaCm: 168,
      dobras: {
        peitoral: 11,
        axilarMedia: 12,
        triceps: 18,
        subescapular: 15,
        abdominal: 20,
        suprailiaca: 16,
        coxa: 24,
        panturrilha: 15,
      },
      circunferencias: {
        pescoco: 32,
        torax: 88,
        cintura: 75,
        abdomen: 79,
        quadril: 96,
        bracoRelaxado: 28,
        bracoContraido: 30.5,
        antebraco: 24,
        coxa: 55,
        panturrilha: 35,
      },
      bioimpedancia: null,
    },
  })

  const { toasts, push } = useToasts()

  return (
    <>
      <NovaAvaliacaoForm
        paciente={paciente}
        avaliador={d.avaliadorLogado}
        avaliacao={avaliacao}
        anterior={anterior}
        onMedidas={(medidas: Medidas) => setAvaliacao((a) => ({ ...a, medidas }))}
        onProtocolo={(protocolo: ProtocoloId) => setAvaliacao((a) => ({ ...a, protocolo }))}
        onUsarBioimpedancia={(usar) =>
          setAvaliacao((a) => ({ ...a, usarBioimpedancia: usar }))
        }
        onParecer={(parecer) => setAvaliacao((a) => ({ ...a, parecer }))}
        onSalvarRascunho={() => push('Rascunho salvo — medidas mantidas')}
        onConcluir={() => {
          setAvaliacao((a) => ({ ...a, status: 'concluida' }))
          push('Avaliação concluída — parecer enviado ao prontuário compartilhado')
        }}
        onCancelar={() => push('Saiu sem concluir — o rascunho continua na ficha')}
      />
      <Toasts toasts={toasts} />
    </>
  )
}
