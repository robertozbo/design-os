import { useNavigate } from 'react-router-dom'
import data from '@/../product-doctor/sections/prontuario/data.json'
import type {
  PacienteProntuario,
  Anamnese,
  ExameFisico,
  HipoteseDiagnostica,
  EvolucaoProntuario,
  ExameAnexado,
  PrescricaoAtiva,
} from '@/../product-doctor/sections/prontuario/types'
import { Prontuario as ProntuarioView } from './components/Prontuario'

export default function ProntuarioPreview() {
  const navigate = useNavigate()
  return (
    <ProntuarioView
      paciente={data.paciente as PacienteProntuario}
      anamnese={data.anamnese as Anamnese}
      exameFisico={data.exameFisico as ExameFisico}
      hipoteses={data.hipoteses as HipoteseDiagnostica[]}
      planoAtual={data.planoAtual}
      evolucoes={data.evolucoes as EvolucaoProntuario[]}
      examesAnexados={data.examesAnexados as ExameAnexado[]}
      prescricoesAtivas={data.prescricoesAtivas as PrescricaoAtiva[]}
      onVoltar={() => navigate('/doctor/sections/pacientes')}
      onSalvarCampo={(campo, v) => console.log('salvar campo:', campo, v)}
      onAdicionarItem={(lista, v) => console.log('adicionar:', lista, v)}
      onRemoverItem={(lista, i) => console.log('remover:', lista, i)}
      onAbrirEvolucao={(id) =>
        navigate(`/doctor/sections/consulta?finalizada=${id}`)
      }
      onAbrirExame={(id) =>
        navigate(`/doctor/sections/exames?exame=${id}`)
      }
      onAbrirPrescricao={(memedId) => console.log('abrir Memed:', memedId)}
      onExportarPDF={(incluirSOAP) => console.log('exportar PDF, SOAP:', incluirSOAP)}
      onCompartilharTrecho={(t) => console.log('compartilhar:', t)}
    />
  )
}
