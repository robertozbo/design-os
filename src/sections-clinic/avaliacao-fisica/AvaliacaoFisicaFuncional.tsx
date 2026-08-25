import { useState } from 'react'
import data from '@/../product-clinic/sections/avaliacao-fisica/data.json'
import type {
  AbaFormulario,
  Avaliacao,
  AvaliacaoFisicaData,
  Medidas,
  PacienteAvaliacao,
  ProtocoloId,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import { NovaAvaliacaoForm, Toasts, useToasts } from './components'

const d = data as unknown as AvaliacaoFisicaData

/**
 * A metade funcional do mesmo formulário, aberta na aba de desempenho.
 *
 * O caso é o Diego, que tem dor documentada no ombro direito acima de 120° — e é isso que o
 * zero na mobilidade de ombro do FMS significa. A tela existe para não deixar esse zero
 * desaparecer dentro do total: 15/21 parece um resultado bom até alguém reparar que um dos
 * sete testes doeu.
 */
export default function AvaliacaoFisicaFuncionalPreview() {
  const base = d.pacientes[1]
  const anterior = [...base.avaliacoes].sort((a, b) => b.data.localeCompare(a.data))[0]

  const [paciente, setPaciente] = useState<PacienteAvaliacao>(base.paciente)
  const [aba, setAba] = useState<AbaFormulario>('funcional')

  const [avaliacao, setAvaliacao] = useState<Avaliacao>({
    id: 'av-nova-func',
    pacienteId: base.paciente.id,
    data: '2026-11-18',
    dataLabel: '18 nov 2026',
    avaliador: d.avaliadorLogado,
    protocolo: 'jackson_pollock_7',
    status: 'rascunho',
    usarBioimpedancia: false,
    visivelAoPaciente: true,
    parecer: '',
    condicao: {
      lesoesAtuais: 'Ombro direito com dor em elevação acima de 120°.',
      cirurgiasPrevias: 'Reconstrução de LCA em 2019 (joelho esquerdo).',
      restricoes: 'Sem desenvolvimento militar; agachamento liberado até profundidade completa.',
      liberacaoMedica: 'com-restricoes',
      liberacaoNota:
        'Dr. Bruno Sales (CRM 123456-SP) — liberado com restrição de amplitude no ombro direito, 10 mar 2026.',
    },
    fotos: { frontal: true, lateral: true, posterior: false },
    funcional: {
      rm: {
        supino: { pesoTesteKg: 112, repsTeste: 5 },
        agachamento: { pesoTesteKg: 160, repsTeste: 5 },
        levantamentoTerra: { pesoTesteKg: 190, repsTeste: 4 },
      },
      fms: {
        agachamentoProfundo: 3,
        passagemBarreira: 2,
        avancoLinha: 2,
        // Zero é dor, não desempenho ruim — bate com a queixa registrada na condição física.
        mobilidadeOmbro: 0,
        elevacaoPernaEstendida: 2,
        estabilidadeTroncoFlexao: 3,
        estabilidadeRotatoria: 2,
      },
      flexibilidade: { sentaEAlcancaCm: 24, mobilidadeOmbroCm: 13, schoberCm: 6.5 },
      cardio: {
        protocolo: 'cooper',
        metricaPrincipal: 2680,
        vo2Informado: null,
        fcMedia: 163,
        fcRecuperacao: 41,
      },
      resistenciaLocal: { flexoesMax: 40, abdominais1min: 52, pranchaSegundos: 128 },
    },
    medidas: {
      pesoKg: 85.4,
      alturaCm: 178,
      dobras: {
        peitoral: 10,
        axilarMedia: 12,
        triceps: 10,
        biceps: 5,
        subescapular: 16,
        abdominal: 21,
        suprailiaca: 17,
        coxa: 11,
        panturrilha: 9,
      },
      circunferencias: {
        pescoco: 39,
        torax: 104,
        cintura: 85,
        abdomen: 87,
        quadril: 100,
        bracoRelaxado: 35.5,
        bracoContraido: 38.5,
        antebraco: 29,
        coxa: 60.5,
        panturrilha: 39,
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
        aba={aba}
        onAba={setAba}
        onData={(dataIso) => setAvaliacao((a) => ({ ...a, data: dataIso }))}
        onMedidas={(medidas: Medidas) => setAvaliacao((a) => ({ ...a, medidas }))}
        onProtocolo={(protocolo: ProtocoloId) => setAvaliacao((a) => ({ ...a, protocolo }))}
        onUsarBioimpedancia={(usar) => setAvaliacao((a) => ({ ...a, usarBioimpedancia: usar }))}
        onCondicao={(condicao) => setAvaliacao((a) => ({ ...a, condicao }))}
        onFotos={(fotos) => setAvaliacao((a) => ({ ...a, fotos }))}
        onFuncional={(funcional) => setAvaliacao((a) => ({ ...a, funcional }))}
        onParecer={(parecer) => setAvaliacao((a) => ({ ...a, parecer }))}
        onVisivelAoPaciente={(visivel) =>
          setAvaliacao((a) => ({ ...a, visivelAoPaciente: visivel }))
        }
        onObjetivo={(objetivo) => setPaciente((p) => ({ ...p, objetivo }))}
        onNivelAtividade={(nivelAtividade) => setPaciente((p) => ({ ...p, nivelAtividade }))}
        onMetaGordura={(metaGorduraPct) => setPaciente((p) => ({ ...p, metaGorduraPct }))}
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
