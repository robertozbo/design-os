import { useEffect, useState } from 'react'
import data from '@/../product-medical-clinic/sections/consulta/data.json'
import type {
  AssinaturaInfo,
  ConsultaData,
  EscribaEstado,
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

const acomp = acompanhamentoData as unknown as AcompanhamentoData

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
  ultimaSync: acomp.vinculo.ultimaSync,
  itens: [...acomp.metricas]
    .sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao))
    .slice(0, 3)
    .map((m) => ({
      label: m.nome,
      valor: `${m.valorAtual.toLocaleString('pt-BR')} ${m.unidade}`,
      delta: `${m.variacao > 0 ? '+' : ''}${m.variacao.toLocaleString('pt-BR')}`,
      tom: tomDa(m),
    })),
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
  const [viaIA, setViaIA] = useState(true)
  const [assinatura, setAssinatura] = useState<AssinaturaInfo | null>(null)
  const [modal, setModal] = useState<null | 'exame' | 'prescrever' | 'encaminhar'>(null)
  /** Painel aberto por cima da consulta — o SOAP continua montado atrás. */
  const [painel, setPainel] = useState<null | 'prontuario' | 'acompanhamento'>(null)
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
      setSoap(base.soapSugerido)
      setEstado('rascunho')
    }, 2200)
    return () => clearTimeout(id)
  }, [estado, base.soapSugerido])

  const iniciar = () => {
    setEscribaTimer(0)
    setTranscricaoIdx(0)
    setViaIA(true)
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
    setEstado('assinado')
    pushToast('Evolução assinada e enviada ao prontuário')
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
          viaIA && (estado === 'rascunho' || estado === 'assinado') ? base.transcricaoMock : []
        }
        soap={soap}
        assinatura={assinatura}
        onIniciar={iniciar}
        onConsentir={() => setEstado('gravando')}
        onRecusar={() => {
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
          onSolicitar={(exames, urgencia, _indicacao) => {
            setModal(null)
            setExamesSessao((prev) => [
              ...exames.map((nome) => ({
                titulo: nome,
                sub: urgencia === 'urgente' ? 'hoje · urgente' : 'hoje · rotina',
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
