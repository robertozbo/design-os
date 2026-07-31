import { useEffect, useState } from 'react'
import data from '@/../product-medical-clinic/sections/consulta/data.json'
import type {
  AssinaturaInfo,
  ConsultaData,
  EscribaEstado,
  MedidasConsulta,
  Modalidade,
  SOAP,
} from '@/../product-medical-clinic/sections/consulta/types'
import acompanhamentoData from '@/../product-medical-clinic/sections/acompanhamento/data.json'
import type {
  AcompanhamentoData,
  Metrica,
} from '@/../product-medical-clinic/sections/acompanhamento/types'
import { AcompanhamentoView } from '../acompanhamento/components'
import prontuarioData from '@/../product-medical-clinic/sections/prontuario/data.json'
import type {
  AcessoAtual,
  AnamneseCompartilhada,
  Evolucao,
  MedicoVinculo,
  PacienteRef,
} from '@/../product-medical-clinic/sections/prontuario/types'
import { ProntuarioView } from '../prontuario/components'
import {
  ConsultaView,
  PainelSobreposto,
  SolicitarExameModal,
  PrescreverModal,
  EncaminharModal,
  type MedItem,
  type SolicItem,
} from './components'

const ACOMP_INICIAL = acompanhamentoData as unknown as AcompanhamentoData

/** Para onde o número deve ir. Cair é bom em peso/glicemia/pressão; subir é bom em sono. */
const DIRECAO: Record<string, 'menor' | 'maior'> = {
  'm-peso': 'menor',
  'm-glicemia': 'menor',
  'm-pas': 'menor',
  'm-fc': 'menor',
  'm-sono': 'maior',
}

function tomDa(m: Metrica): 'melhora' | 'piora' | 'neutro' {
  const dir = DIRECAO[m.id]
  if (!dir || m.variacao === 0) return 'neutro'
  const melhorou = dir === 'menor' ? m.variacao < 0 : m.variacao > 0
  return melhorou ? 'melhora' : 'piora'
}

/** As 3 métricas que mais se mexeram — em consulta de 27 min, ninguém lê cinco. */
const RESUMO_APP = {
  ultimaSync: ACOMP_INICIAL.vinculo.ultimaSync,
  itens: [...ACOMP_INICIAL.metricas]
    .sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao))
    .slice(0, 3)
    .map((m) => ({
      label: m.nome,
      valor: `${m.valorAtual.toLocaleString('pt-BR')} ${m.unidade}`,
      delta: `${m.variacao > 0 ? '+' : ''}${m.variacao.toLocaleString('pt-BR')}`,
      tom: tomDa(m),
    })),
}

/** Dia da consulta no protótipo — mock tem data fixa para não mudar screenshot. */
const DATA_CONSULTA = '2026-07-25'

/** Quais medidas preenchidas viram ponto de série, na ordem em que aparecem no toast. */
function aplicarMedidas(m: MedidasConsulta): string[] {
  const nomes: string[] = []
  if (m.peso.trim()) nomes.push('peso')
  if (m.pressaoSistolica.trim() && m.pressaoDiastolica.trim()) nomes.push('pressão')
  if (m.frequenciaCardiaca.trim()) nomes.push('FC')
  return nomes
}

const num = (v: string) => Number(v.replace(',', '.'))

/**
 * Anexa a medida da consulta à métrica correspondente, com a variação recalculada contra o valor
 * anterior. Altura fica de fora de propósito: em adulto é fixa e só serve pro IMC.
 */
function atualizarMetrica(m: Metrica, med: MedidasConsulta, data: string): Metrica {
  const push = (metrica: Metrica, valor: number, secundario?: number): Metrica => ({
    ...metrica,
    valorAtual: valor,
    medidoEm: data,
    variacao: Math.round((valor - metrica.valorAtual) * 10) / 10,
    fonte: 'Clínica',
    serie: [...metrica.serie, { data, valor }],
    secundaria:
      metrica.secundaria && secundario !== undefined
        ? {
            ...metrica.secundaria,
            valorAtual: secundario,
            variacao: Math.round((secundario - metrica.secundaria.valorAtual) * 10) / 10,
            serie: [...metrica.secundaria.serie, { data, valor: secundario }],
          }
        : metrica.secundaria,
  })

  if (m.id === 'm-peso' && med.peso.trim()) return push(m, num(med.peso))
  if (m.id === 'm-fc' && med.frequenciaCardiaca.trim()) return push(m, num(med.frequenciaCardiaca))
  if (m.id === 'm-pas' && med.pressaoSistolica.trim() && med.pressaoDiastolica.trim()) {
    return push(m, num(med.pressaoSistolica), num(med.pressaoDiastolica))
  }
  return m
}

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

const VAZIO: SOAP = { S: '', O: '', A: '', P: '' }

export default function ConsultaPreview() {
  const base = data as unknown as ConsultaData

  const [modalidade, setModalidade] = useState<Modalidade>(base.modalidade)
  const [estado, setEstado] = useState<EscribaEstado>('inativo')
  const [consultaTimer, setConsultaTimer] = useState(0)
  const [escribaTimer, setEscribaTimer] = useState(0)
  const [transcricaoIdx, setTranscricaoIdx] = useState(0)
  const [soap, setSoap] = useState<SOAP>(VAZIO)
  /**
   * Só é `true` quando achados do escriba foram de fato aplicados à evolução. Nasce `false`:
   * a assinatura registra autoria de ato médico, e creditar a IA por texto que o médico digitou
   * seria declaração falsa no documento que ele assina.
   */
  const [viaIA, setViaIA] = useState(false)
  // Medidas aferidas na sala — campo numérico, não prosa: só assim viram série do paciente.
  // O Acompanhamento é estado: ao assinar, as medidas da sala entram na série do paciente.
  const [acomp, setAcomp] = useState<AcompanhamentoData>(ACOMP_INICIAL)
  const [medidas, setMedidas] = useState<MedidasConsulta>({
    peso: '',
    altura: '',
    pressaoSistolica: '',
    pressaoDiastolica: '',
    frequenciaCardiaca: '',
    temperatura: '',
    saturacao: '',
  })
  const [assinatura, setAssinatura] = useState<AssinaturaInfo | null>(null)
  const [modal, setModal] = useState<null | 'exame' | 'prescrever' | 'encaminhar'>(null)
  /** Painel aberto por cima da consulta — o SOAP continua montado atrás. */
  const [painel, setPainel] = useState<null | 'prontuario' | 'acompanhamento'>(null)
  /** De onde vieram os itens em revisão — transcrição do escriba ou análise da anotação manual. */
  const [origemRevisao, setOrigemRevisao] = useState<'transcricao' | 'analise'>('transcricao')
  const [prescricoesSessao, setPrescricoesSessao] = useState<SolicItem[]>([])
  const [examesSessao, setExamesSessao] = useState<SolicItem[]>([])
  const [encaminhamentosSessao, setEncaminhamentosSessao] = useState<SolicItem[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  // Histórico anterior (de outras consultas) — vem do contexto do paciente.
  const prescricoesAnteriores: SolicItem[] = base.contexto.medicacoes.map((m) => ({
    titulo: m.nome,
    sub: `${m.prescritoEm} · ${m.posologia}`,
    nesta: false,
  }))
  const examesAnteriores: SolicItem[] = base.contexto.exames.map((e) => ({
    titulo: e.nome,
    sub: `${e.data} · ${e.valor}`,
    nesta: false,
  }))
  const encaminhamentosAnteriores: SolicItem[] = [
    { titulo: 'Endocrinologia', sub: 'Dr. Paulo Sette · 02 jul', nesta: false },
  ]

  const solicitacoes = {
    prescricoes: [...prescricoesSessao, ...prescricoesAnteriores],
    exames: [...examesSessao, ...examesAnteriores],
    encaminhamentos: [...encaminhamentosSessao, ...encaminhamentosAnteriores],
  }

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  // A IA "pensando" sobre a anotação manual — mesmo tempo de espera do escriba.
  useEffect(() => {
    if (estado !== 'analisando') return
    const id = setTimeout(() => setEstado('revisao'), 1600)
    return () => clearTimeout(id)
  }, [estado])

  // Cronômetro da consulta — corre até assinar.
  useEffect(() => {
    if (estado === 'assinado') return
    const id = setInterval(() => setConsultaTimer((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [estado])

  // Gravando: cronômetro do escriba + revela a transcrição aos poucos.
  useEffect(() => {
    if (estado !== 'gravando') return
    const tid = setInterval(() => setEscribaTimer((t) => t + 1), 1000)
    const rid = setInterval(
      () => setTranscricaoIdx((i) => Math.min(i + 1, base.transcricaoMock.length)),
      1600,
    )
    return () => {
      clearInterval(tid)
      clearInterval(rid)
    }
  }, [estado, base.transcricaoMock.length])

  // Transcrevendo -> rascunho SOAP gerado pela IA.
  useEffect(() => {
    if (estado !== 'transcrevendo') return
    const id = setTimeout(() => {
      // A IA não escreve na evolução: entrega achados para o médico marcar.
      setEstado('revisao')
    }, 2200)
    return () => clearTimeout(id)
  }, [estado, base.soapSugerido])

  const iniciar = () => {
    setEscribaTimer(0)
    setTranscricaoIdx(0)
    setEstado(base.consentimentoIAConcedido ? 'gravando' : 'consentimento')
  }

  const assinar = () => {
    setAssinatura({
      medicoNome: 'Dra. Helena Prado',
      crm: 'CRM 456789-SP',
      em: '22 jul 2026, 09:47',
      assistidoPorIA: viaIA,
      modeloIA: viaIA ? base.modeloIA : null,
    })
    // Medida aferida na sala vira ponto da série, com fonte "Clínica" — é o que permite comparar
    // o que o paciente mede em casa com o que foi medido no consultório.
    const gravadas = aplicarMedidas(medidas)
    if (gravadas.length > 0) {
      setAcomp((a) => ({ ...a, metricas: a.metricas.map((m) => atualizarMetrica(m, medidas, DATA_CONSULTA)) }))
    }
    setEstado('assinado')
    pushToast(
      gravadas.length > 0
        ? `Evolução assinada · ${gravadas.join(', ')} ${gravadas.length > 1 ? 'registrados' : 'registrado'} no acompanhamento`
        : 'Evolução assinada e enviada ao prontuário',
    )
  }

  const onAcao = (a: 'prescrever' | 'exame' | 'encaminhar') => {
    if (a === 'prescrever') setModal('prescrever')
    else if (a === 'exame') setModal('exame')
    else setModal('encaminhar')
  }

  return (
    <>
      <ConsultaView
        dados={base}
        modalidade={modalidade}
        onModalidade={setModalidade}
        consultaTimer={consultaTimer}
        estado={estado}
        escribaTimer={escribaTimer}
        transcricaoVisivel={base.transcricaoMock.slice(0, transcricaoIdx)}
        // Só existe transcrição depois que o escriba rodou — antes disso o SOAP é registro manual,
        // e creditar a IA por um texto que o médico digitou seria falso na assinatura.
        transcricaoCompleta={
          viaIA && origemRevisao === 'transcricao' && (estado === 'rascunho' || estado === 'assinado')
            ? base.transcricaoMock
            : []
        }
        soap={soap}
        assinatura={assinatura}
        onIniciar={iniciar}
        onConsentir={() => setEstado('gravando')}
        onRecusar={() => {
          setOrigemRevisao('transcricao')
          setViaIA(false)
          setSoap(VAZIO)
          setEstado('rascunho')
          pushToast('IA recusada — registre a evolução manualmente')
        }}
        onParar={() => setEstado('transcrevendo')}
        onSoapChange={(campo, valor) => setSoap((prev) => ({ ...prev, [campo]: valor }))}
        onAssinar={assinar}
        // Sobrepõe em vez de navegar: trocar de rota aqui descartaria a evolução não assinada.
        onAbrirProntuario={() => setPainel('prontuario')}
        onAcao={onAcao}
        queixas={(data as { queixasFrequentes?: string[] }).queixasFrequentes ?? []}
        origemRevisao={origemRevisao}
        onAnalisar={() => {
          setOrigemRevisao('analise')
          setEstado('analisando')
        }}
        itensExtraidos={origemRevisao === 'analise' ? base.itensAnalise : base.itensExtraidos}
        onAplicarItens={(itens) => {
          // Só o que foi marcado vira texto — o resto nunca existiu no prontuário.
          // Na análise da anotação manual, o texto do médico é a base — a IA acrescenta, não apaga.
          const porCampo: SOAP = origemRevisao === 'analise' ? { ...soap } : { ...VAZIO }
          for (const i of itens) {
            porCampo[i.campo] = porCampo[i.campo] ? `${porCampo[i.campo]} ${i.texto}` : i.texto
          }
          setSoap(porCampo)
          setViaIA(true)
          setEstado('rascunho')
          pushToast(`${itens.length} achado(s) aplicados à evolução · revise antes de assinar`)
        }}
        onDescartarItens={() => {
          setViaIA(false)
          setSoap(VAZIO)
          setEstado('rascunho')
          pushToast('Achados descartados · evolução segue como registro manual')
        }}
        medidas={medidas}
        onMedida={(campo, valor) => setMedidas((m) => ({ ...m, [campo]: valor }))}
        resumoApp={RESUMO_APP}
        onAbrirAcompanhamento={() => setPainel('acompanhamento')}
        solicitacoes={solicitacoes}
      />

      {painel === 'prontuario' && (
        <PainelSobreposto
          titulo={`Prontuário · ${base.paciente.nome}`}
          subtitulo="Consulta em andamento continua aberta atrás — nada é perdido ao fechar"
          voltarPara="Voltar à consulta"
          onFechar={() => setPainel(null)}
        >
          <ProntuarioView
            paciente={prontuarioData.paciente as PacienteRef}
            acessoAtual={prontuarioData.acessoAtual as AcessoAtual}
            equipeCuidado={prontuarioData.equipeCuidado as MedicoVinculo[]}
            anamnese={prontuarioData.anamnese as AnamneseCompartilhada}
            evolucoes={prontuarioData.evolucoes as Evolucao[]}
            onAbrirAudit={() => pushToast('Log de acesso disponível na section Prontuário')}
            onExportar={() => pushToast('PDF gerado · exportação registrada no log de acesso')}
          />
        </PainelSobreposto>
      )}

      {painel === 'acompanhamento' && (
        <PainelSobreposto
          titulo={`Acompanhamento · ${base.paciente.nome}`}
          subtitulo="O que o paciente compartilhou pelo app desde a última consulta"
          voltarPara="Voltar à consulta"
          onFechar={() => setPainel(null)}
        >
          <AcompanhamentoView dados={acomp} />
        </PainelSobreposto>
      )}

      {modal === 'exame' && (
        <SolicitarExameModal
          pacienteNome={base.paciente.nome}
          onFechar={() => setModal(null)}
          onSolicitar={(exames, urgencia, indicacao) => {
            setModal(null)
            setExamesSessao((prev) => [
              ...exames.map((nome) => ({
                titulo: nome,
                sub: urgencia === 'urgente' ? 'hoje · urgente' : 'hoje · rotina',
                indicacao: indicacao.trim() || undefined,
                nesta: true,
              })),
              ...prev,
            ])
            pushToast(
              `${exames.length} exame(s) solicitado(s)${urgencia === 'urgente' ? ' · URGENTE' : ''} · enviado ao laboratório`,
            )
          }}
        />
      )}

      {modal === 'prescrever' && (
        <PrescreverModal
          pacienteNome={base.paciente.nome}
          medicoNome="Dra. Helena Prado"
          onFechar={() => setModal(null)}
          onEmitir={(itens: MedItem[]) => {
            setModal(null)
            setPrescricoesSessao((prev) => [
              ...itens.map((m) => ({ titulo: m.nome, sub: `hoje · ${m.posologia}`, nesta: true })),
              ...prev,
            ])
            pushToast(`Receita com ${itens.length} medicamento(s) emitida e enviada ao app`)
          }}
        />
      )}

      {modal === 'encaminhar' && (
        <EncaminharModal
          pacienteNome={base.paciente.nome}
          onFechar={() => setModal(null)}
          onEnviar={(colegaNome, especialidade) => {
            setModal(null)
            setEncaminhamentosSessao((prev) => [
              { titulo: especialidade, sub: `hoje · ${colegaNome}`, nesta: true },
              ...prev,
            ])
            pushToast(`Encaminhado a ${colegaNome} · ${especialidade}`)
          }}
        />
      )}

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[55] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-2.5 text-sm text-emerald-900 shadow-lg backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
