import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '@/../product-clinico/sections/consulta/data.json'
import consultasData from '@/../product-clinico/sections/consultas/data.json'
import examesData from '@/../product-clinico/sections/exames/data.json'
import type {
  Consulta as ConsultaType,
  SoapBloco,
  SoapTipo,
  TabAtiva,
} from '@/../product-clinico/sections/consulta/types'
import type { ConsultaFinalizadaItem } from '@/../product-clinico/sections/consultas/types'
import type {
  ExameImagemDetalhe,
  ExameDetalhe as ExameLabDetalhe,
} from '@/../product-clinico/sections/exames/types'
import { Consulta as ConsultaView } from './components/Consulta'
import { ConsultaFinalizadaView } from './components/ConsultaFinalizadaView'

interface ToastMsg {
  id: number
  texto: string
}
let toastSeq = 0

interface AnaliseSalva {
  comentarioMedico: string | null
  imagensAnalisadasIds: string[]
  salvoEm: string
}

export default function ConsultaPreview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const finalizadaId = searchParams.get('finalizada')

  const [consulta, setConsulta] = useState<ConsultaType>(data.consulta as ConsultaType)
  const [soapBlocos, setSoapBlocos] = useState<SoapBloco[]>(data.soapBlocos as SoapBloco[])
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const [analisesSalvas, setAnalisesSalvas] = useState<Record<string, AnaliseSalva>>({})

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  // Modo read-only: drill-in vindo de /clinico/sections/consultas
  if (finalizadaId) {
    const finalizada = (consultasData.consultasFinalizadas as ConsultaFinalizadaItem[]).find(
      (c) => c.id === finalizadaId,
    )
    if (!finalizada) {
      return (
        <div className="mx-auto max-w-2xl p-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Consulta finalizada <code className="font-mono">{finalizadaId}</code> não encontrada.
          </p>
          <button
            onClick={() => navigate('/clinico/sections/consultas')}
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500"
          >
            Voltar pra Consultas
          </button>
        </div>
      )
    }
    return (
      <ConsultaFinalizadaView
        consulta={finalizada}
        onVoltar={() => navigate('/clinico/sections/consultas')}
        onAbrirProntuarioPaciente={(pacienteId) => {
          console.log('abrir prontuário:', pacienteId)
          navigate(`/clinico/sections/pacientes?paciente=${pacienteId}`)
        }}
        onAdicionarAdendo={(consultaId) => {
          // Abre Consulta em modo "novo atendimento" tipo=acrescimo, vinculada à original.
          navigate(`/clinico/sections/consulta?adendo=${consultaId}`)
        }}
      />
    )
  }

  return (
    <>
    <ConsultaView
      consulta={consulta}
      paciente={data.paciente as never}
      anamneseEntrada={data.anamneseEntrada as never}
      soapBlocos={soapBlocos}
      transcricaoTrechos={data.transcricaoTrechos as never}
      medicacaoAtiva={data.medicacaoAtiva as never}
      examesRecentes={data.examesRecentes as never}
      imagensRecentes={data.imagensRecentes as never}
      evolucoesAnteriores={data.evolucoesAnteriores as never}
      acoesPosConsulta={data.acoesPosConsulta as never}
      onIniciarGravacao={() => {
        setConsulta((c) => ({ ...c, gravacaoStatus: 'gravando' }))
        console.log('iniciar gravação')
      }}
      onPausarGravacao={() => {
        setConsulta((c) => ({ ...c, gravacaoStatus: 'pausado' }))
        console.log('pausar gravação')
      }}
      onRetomarGravacao={() => {
        setConsulta((c) => ({ ...c, gravacaoStatus: 'gravando' }))
        console.log('retomar gravação')
      }}
      onEncerrarGravacao={() => {
        setConsulta((c) => ({ ...c, gravacaoStatus: 'encerrado', estado: 'encerrada' }))
        console.log('encerrar gravação')
      }}
      onTrocarTab={(t: TabAtiva) => {
        setConsulta((c) => ({ ...c, tabAtiva: t }))
      }}
      onEditarSoapBloco={(tipo: SoapTipo, novoTexto: string) => {
        setSoapBlocos((prev) =>
          prev.map((b) =>
            b.tipo === tipo ? { ...b, texto: novoTexto, editadoPeloMedico: true } : b,
          ),
        )
        console.log('editar SOAP', tipo)
      }}
      onAlterarAnamnese={(campos) => {
        console.log('anamnese alterada (audit log):', campos)
      }}
      onAbrirMemed={() => console.log('abrir Memed')}
      onAssinarEFechar={() => console.log('iniciar fluxo de assinar')}
      onConfirmarAcoesPosConsulta={(ids) => {
        setConsulta((c) => ({
          ...c,
          estado: 'assinada',
          gravacaoStatus: 'encerrado',
          assinadaEm: new Date().toISOString(),
          assinadaPor: 'dr-pedro',
        }))
        console.log('ações pós-consulta confirmadas:', ids)
        // Após assinar, vai pra lista de Atendimentos com a recém-criada destacada.
        navigate(`/clinico/sections/consultas?recem=${consulta.id}`)
      }}
      onEntrarSalaTele={() => console.log('entrar sala teleconsulta')}
      onAbrirExameDetalhe={(id) => console.log('abrir exame:', id)}
      onAbrirImagemDetalhe={(id) => console.log('abrir imagem:', id)}
      onCarregarImagem={(form) => console.log('upload imagem:', form)}
      onSalvarAnaliseImagem={(data) => {
        console.log('análise IA salva no prontuário:', data)
        const existia = !!analisesSalvas[data.imagemId]
        setAnalisesSalvas((prev) => ({
          ...prev,
          [data.imagemId]: {
            comentarioMedico: data.comentarioMedico,
            imagensAnalisadasIds: data.imagensAnalisadasIds,
            salvoEm: new Date().toISOString(),
          },
        }))
        pushToast(
          existia
            ? `Análise atualizada · ${data.imagensAnalisadasIds.length} ${data.imagensAnalisadasIds.length === 1 ? 'série' : 'séries'} no prontuário`
            : `Análise IA salva · ${data.imagensAnalisadasIds.length} ${data.imagensAnalisadasIds.length === 1 ? 'série' : 'séries'} vinculada(s) ao atendimento`,
        )
      }}
      analisesSalvasPorImagem={analisesSalvas}
      getExameImagemDetalhe={(id) => {
        const detalhes = examesData.examesImagemDetalhes as ExameImagemDetalhe[]
        return detalhes.find((d) => d.id === id) ?? null
      }}
      getExameLabDetalhe={(id) => {
        const detalhes = (examesData as { examesLabDetalhes?: ExameLabDetalhe[] })
          .examesLabDetalhes
        return detalhes?.find((d) => d.id === id) ?? null
      }}
      onAbrirEvolucaoAnterior={(id) => console.log('abrir evolução:', id)}
    />

    {/* Toasts */}
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
