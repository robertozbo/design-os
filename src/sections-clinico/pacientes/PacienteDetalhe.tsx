import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinico/sections/pacientes/data.json'
import type {
  AtendimentoDetalhe,
  PacienteDetalhe as PacienteDetalheType,
} from '@/../product-clinico/sections/pacientes/types'
import { PacienteDetalhe as PacienteDetalheView } from './components/PacienteDetalhe'
import { AtendimentoDetalheDrawer } from './components/AtendimentoDetalheDrawer'

export default function PacienteDetalhePreview() {
  const navigate = useNavigate()
  const pacienteBase = data.pacienteDetalhe as PacienteDetalheType
  const detalhes = (data.atendimentosDetalhes ?? {}) as Record<string, AtendimentoDetalhe>
  const [atendimentoId, setAtendimentoId] = useState<string | null>(null)
  const atendimentoAtivo = atendimentoId ? (detalhes[atendimentoId] ?? null) : null

  const imagensAnalisadasRecentes = Object.values(detalhes)
    .flatMap((atd) =>
      (atd.imagensAnalisadas ?? []).map((img) => ({ ...img, atendimentoId: atd.id })),
    )
    .sort((a, b) => new Date(b.salvoEm).getTime() - new Date(a.salvoEm).getTime())

  const paciente: PacienteDetalheType = { ...pacienteBase, imagensAnalisadasRecentes }

  const iniciais = paciente.nome
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <>
      <PacienteDetalheView
        paciente={paciente}
        onVoltar={() => console.log('voltar pra lista')}
        onTrocarTab={(t) => console.log('trocar tab:', t)}
        onIniciarConsulta={(id) => {
          console.log('iniciar consulta:', id)
          navigate(`/clinico/sections/consulta?agendamento=${id}`)
        }}
        onAbrirMensagemClinica={() => console.log('abrir mensagem clínica')}
        onAgendar={() => console.log('agendar')}
        onExportarPDF={() => console.log('exportar PDF')}
        onAbrirAtendimento={(id) => setAtendimentoId(id)}
        onAbrirExame={(id) => console.log('abrir exame:', id)}
        onAbrirMemed={() => console.log('abrir Memed')}
      />

      <AtendimentoDetalheDrawer
        atendimento={atendimentoAtivo}
        pacienteNome={paciente.nome}
        pacienteIniciais={iniciais}
        onClose={() => setAtendimentoId(null)}
        onAbrirPrescricao={(id) => console.log('abrir prescrição:', id)}
        onAbrirAuditIA={(id) => console.log('audit IA:', id)}
        onIniciarNovaConsulta={() => navigate(`/clinico/sections/consulta`)}
      />
    </>
  )
}
