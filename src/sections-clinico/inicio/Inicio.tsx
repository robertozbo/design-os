import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinico/sections/inicio/data.json'
import type {
  Profissional,
  Saudacao,
  Kpi,
  ProximaConsulta,
  AgendaItem,
  PacienteAtencao,
} from '@/../product-clinico/sections/inicio/types'
import { Inicio as InicioView } from './components/Inicio'

export default function InicioPreview() {
  const navigate = useNavigate()

  const iniciarConsulta = (agendamentoId: string) => {
    console.log('iniciar consulta:', agendamentoId)
    // Vai pra Consulta com o agendamento como query param (a Consulta pode usar pra carregar o paciente correto)
    navigate(`/clinico/sections/consulta?agendamento=${agendamentoId}`)
  }

  return (
    <InicioView
      profissional={data.profissional as Profissional}
      saudacao={data.saudacao as Saudacao}
      kpis={data.kpis as Kpi[]}
      proximaConsulta={data.proximaConsulta as ProximaConsulta}
      agendaHoje={data.agendaHoje as AgendaItem[]}
      pacientesAtencao={data.pacientesAtencao as PacienteAtencao[]}
      onAbrirConsulta={(id) => iniciarConsulta(id)}
      onIniciarConsulta={(id) => iniciarConsulta(id)}
      onAbrirPacienteAtencao={(id) => navigate(`/clinico/sections/pacientes`)}
      onAbrirKpi={(id) => console.log('abrir KPI:', id)}
      onFiltrarAgenda={(f) => navigate(`/clinico/sections/agenda?filtro=${f}`)}
      onAbrirPerfil={() => console.log('abrir perfil')}
    />
  )
}
