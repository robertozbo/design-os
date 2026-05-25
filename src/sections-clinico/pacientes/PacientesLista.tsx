import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '@/../product-clinico/sections/pacientes/data.json'
import prontuarioData from '@/../product-clinico/sections/prontuario/data.json'
import type {
  FiltroLista,
  PacienteListItem,
} from '@/../product-clinico/sections/pacientes/types'
import type {
  PacienteProntuario,
  Anamnese,
  ExameFisico,
  HipoteseDiagnostica,
  EvolucaoProntuario,
  ExameAnexado,
  PrescricaoAtiva,
} from '@/../product-clinico/sections/prontuario/types'
import { PacientesLista as PacientesListaView } from './components/PacientesLista'
import { Prontuario as ProntuarioView } from '../prontuario/components/Prontuario'
import { CadastroPacienteDrawer } from './components/CadastroPacienteDrawer'
import { ExcluirPacienteDialog } from './components/ExcluirPacienteDialog'

interface ToastMsg {
  id: number
  texto: string
}

let toastSeq = 0

export default function PacientesListaPreview() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pacienteParam = searchParams.get('paciente')

  const [filtroAtivo, setFiltroAtivo] = useState<FiltroLista>(
    data.filtroAtivo as FiltroLista,
  )
  const [pacientes, setPacientes] = useState<PacienteListItem[]>(
    data.pacientesLista as PacienteListItem[],
  )
  const [cadastroOpen, setCadastroOpen] = useState(false)
  const [pacienteEdicaoId, setPacienteEdicaoId] = useState<string | null>(null)
  const [pacienteExcluirId, setPacienteExcluirId] = useState<string | null>(null)
  const [pacienteAbertoId, setPacienteAbertoId] = useState<string | null>(pacienteParam)
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  const pacienteEdicao = pacienteEdicaoId
    ? pacientes.find((p) => p.id === pacienteEdicaoId) ?? null
    : null
  const pacienteExcluir = pacienteExcluirId
    ? pacientes.find((p) => p.id === pacienteExcluirId) ?? null
    : null

  const pacienteAbertoListItem = pacienteAbertoId
    ? pacientes.find((p) => p.id === pacienteAbertoId)
    : null

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  if (pacienteAbertoListItem) {
    // Usa a Maria demo do prontuário como base, sobrescreve identificação com o paciente clicado.
    const pacienteProntuarioBase = prontuarioData.paciente as PacienteProntuario
    const iniciaisAtual = pacienteAbertoListItem.nome
      .split(' ')
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
    const pacienteProntuario: PacienteProntuario = {
      ...pacienteProntuarioBase,
      id: pacienteAbertoListItem.id,
      nome: pacienteAbertoListItem.nome,
      iniciais: iniciaisAtual,
      idade: pacienteAbertoListItem.idade,
      genero: pacienteAbertoListItem.genero,
      convenio: pacienteAbertoListItem.convenio,
      condicoesCronicas: pacienteAbertoListItem.condicoesCronicas,
    }
    return (
      <ProntuarioView
        paciente={pacienteProntuario}
        anamnese={prontuarioData.anamnese as Anamnese}
        exameFisico={prontuarioData.exameFisico as ExameFisico}
        hipoteses={prontuarioData.hipoteses as HipoteseDiagnostica[]}
        planoAtual={prontuarioData.planoAtual}
        evolucoes={prontuarioData.evolucoes as EvolucaoProntuario[]}
        examesAnexados={prontuarioData.examesAnexados as ExameAnexado[]}
        prescricoesAtivas={prontuarioData.prescricoesAtivas as PrescricaoAtiva[]}
        onVoltar={() => setPacienteAbertoId(null)}
        onSalvarCampo={(campo, v) => console.log('salvar campo:', campo, v)}
        onAdicionarItem={(lista, v) => console.log('adicionar:', lista, v)}
        onRemoverItem={(lista, i) => console.log('remover:', lista, i)}
        onAbrirEvolucao={(id) =>
          navigate(`/clinico/sections/consulta?finalizada=${id}`)
        }
        onAbrirExame={(id) =>
          navigate(`/clinico/sections/exames?exame=${id}`)
        }
        onAbrirPrescricao={(memedId) => console.log('abrir Memed:', memedId)}
        onExportarPDF={(incluirSOAP) =>
          console.log('exportar PDF, SOAP:', incluirSOAP)
        }
        onCompartilharTrecho={(t) => console.log('compartilhar:', t)}
      />
    )
  }

  return (
    <>
      <PacientesListaView
        pacientes={pacientes}
        filtroAtivo={filtroAtivo}
        onAplicarFiltro={(f) => setFiltroAtivo(f)}
        onLimparFiltros={() =>
          setFiltroAtivo({ busca: '', statusApp: [], convenios: [], condicoes: [] })
        }
        onAbrirPaciente={(id) => setPacienteAbertoId(id)}
        onCadastrarNovo={() => setCadastroOpen(true)}
        onConvidarApp={(id) => {
          console.log('convidar app:', id)
          pushToast('Convite gerado · paciente notificado')
        }}
        onEditarPaciente={(id) => setPacienteEdicaoId(id)}
        onExcluirPaciente={(id) => setPacienteExcluirId(id)}
      />

      <CadastroPacienteDrawer
        open={cadastroOpen || !!pacienteEdicao}
        pacienteEdicao={pacienteEdicao}
        onClose={() => {
          setCadastroOpen(false)
          setPacienteEdicaoId(null)
        }}
        onSalvar={(form, modo, pacienteId) => {
          if (modo === 'edicao' && pacienteId) {
            setPacientes((prev) =>
              prev.map((p) =>
                p.id === pacienteId
                  ? {
                      ...p,
                      nome: form.nome,
                      genero: form.genero,
                      convenio: form.convenio || 'Particular',
                    }
                  : p,
              ),
            )
            pushToast(`${form.nome} atualizado`)
            return pacienteId
          }
          const novoId = `pct-novo-${Date.now()}`
          const idade = form.dataNascimento
            ? Math.max(
                0,
                new Date().getFullYear() -
                  new Date(form.dataNascimento).getFullYear(),
              )
            : 0
          const novoPaciente: PacienteListItem = {
            id: novoId,
            nome: form.nome,
            idade,
            genero: form.genero,
            condicoesCronicas: [],
            convenio: form.convenio || 'Particular',
            ultimaConsultaEm: null,
            proximaConsultaEm: null,
            statusApp: form.enviarConvite ? 'convite-pendente' : 'nao-convidado',
          }
          setPacientes((prev) => [novoPaciente, ...prev])
          pushToast(
            form.enviarConvite
              ? `${form.nome} cadastrado · convite enviado`
              : `${form.nome} cadastrado`,
          )
          return novoId
        }}
        onAbrirPaciente={(id) => {
          setCadastroOpen(false)
          setPacienteEdicaoId(null)
          setPacienteAbertoId(id)
        }}
      />

      <ExcluirPacienteDialog
        paciente={pacienteExcluir}
        onClose={() => setPacienteExcluirId(null)}
        onConfirmar={(motivo, justificativa) => {
          if (!pacienteExcluir) return
          setPacientes((prev) => prev.filter((p) => p.id !== pacienteExcluir.id))
          pushToast(`${pacienteExcluir.nome} arquivado · audit log registrado`)
          console.log('excluído:', { id: pacienteExcluir.id, motivo, justificativa })
          setPacienteExcluirId(null)
        }}
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
