export type Periodo = 'manha' | 'tarde' | 'noite' | 'madrugada'
export type Modalidade = 'presencial' | 'tele'
export type StatusAgendamento =
  | 'pendente'
  | 'confirmado'
  | 'em-andamento'
  | 'realizado'
  | 'cancelado'
  | 'faltou'
export type TipoAtencao =
  | 'exame-novo'
  | 'mensagem-clinica'
  | 'retorno-atrasado'
  | 'adesao-critica'
export type Prioridade = 'alta' | 'media' | 'baixa'

export interface Profissional {
  id: string
  nome: string
  primeiroNome: string
  iniciais: string
  especialidade: string
  crm: string
}

export interface Saudacao {
  periodo: Periodo
  texto: string
  frase: string
}

export interface Kpi {
  id: string
  label: string
  valor: string
  delta: string
  deltaPositivo: boolean
  historico: number[]
}

export interface ProximaConsulta {
  agendamentoId: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  iniciaEm: string
  horaLabel: string
  modalidade: Modalidade
  condicoesCronicas: string[]
  observacao: string
  minutosAteInicio: number
  podeIniciar: boolean
}

export interface AgendaItem {
  id: string
  horaLabel: string
  iniciaEm: string
  pacienteId: string
  pacienteNome: string
  iniciais: string
  condicoesCronicas: string[]
  modalidade: Modalidade
  status: StatusAgendamento
  observacao: string
  valor: number
  duracaoMin: number
  isEncaixe?: boolean
}

export interface PacienteAtencao {
  id: string
  tipo: TipoAtencao
  pacienteId: string
  pacienteNome: string
  iniciais: string
  contexto: string
  criadoHa: string
  prioridade: Prioridade
}

export interface InicioProps {
  profissional: Profissional
  saudacao: Saudacao
  kpis: Kpi[]
  proximaConsulta: ProximaConsulta | null
  agendaHoje: AgendaItem[]
  pacientesAtencao: PacienteAtencao[]

  /** Click numa consulta da agenda — abre detalhe do paciente. */
  onAbrirConsulta?: (agendamentoId: string) => void
  /** Botão "Iniciar consulta" — vai pra section Consulta. */
  onIniciarConsulta?: (agendamentoId: string) => void
  /** Click num paciente que precisa atenção — abre fluxo correspondente (exame, mensagem, etc.). */
  onAbrirPacienteAtencao?: (id: string) => void
  /** Click num KPI — abre relatório expandido (V2). */
  onAbrirKpi?: (id: string) => void
  /** Filtro rápido da agenda (todos/pendentes/realizados). */
  onFiltrarAgenda?: (filtro: 'todos' | 'pendentes' | 'realizados') => void
  /** Click no avatar/nome do médico — abre perfil. */
  onAbrirPerfil?: () => void
}
