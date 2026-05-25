export type Modalidade = 'presencial' | 'tele'

export type StatusAgendamento =
  | 'pendente'
  | 'confirmado'
  | 'realizado'
  | 'cancelado'
  | 'faltou'

export type VisaoTipo = 'dia' | 'semana' | 'mes'

export interface VisaoAtual {
  tipo: VisaoTipo
  dataFoco: string
  labelPeriodo: string
}

export interface DiaSemana {
  label: string
  numero: number
  iso: string
  ehHoje: boolean
}

export interface Agendamento {
  id: string
  pacienteId: string
  pacienteNome: string
  iniciaEm: string
  duracaoMin: number
  modalidade: Modalidade
  status: StatusAgendamento
  valor: number
  isEncaixe: boolean
  observacao: string
}

export interface Bloqueio {
  id: string
  iniciaEm: string
  duracaoMin: number
  label: string
  recorrente: boolean
}

export interface Pendente {
  agendamentoId: string
  pacienteId: string
  pacienteNome: string
  iniciaEm: string
  modalidade: Modalidade
  isEncaixe: boolean
  observacao: string
}

export interface ProximaConsulta {
  agendamentoId: string
  pacienteId: string
  pacienteNome: string
  condicoesCronicas: string[]
  iniciaEm: string
  modalidade: Modalidade
  minutosAteInicio: number
}

export interface FiltroAtivo {
  status: StatusAgendamento[]
  modalidades: Modalidade[]
  pacienteIds: string[]
}

export interface PacienteAutocomplete {
  id: string
  nome: string
  ultimaConsulta: string | null
}

export interface NovoAgendamentoInput {
  pacienteId: string
  iniciaEm: string
  duracaoMin: number
  modalidade: Modalidade
  valor: number
  observacao: string
  isEncaixe: boolean
}

export interface AgendaProps {
  visaoAtual: VisaoAtual
  diasSemana: DiaSemana[]
  agendamentos: Agendamento[]
  bloqueios: Bloqueio[]
  pendentes: Pendente[]
  proximas: ProximaConsulta[]
  filtroAtivo: FiltroAtivo
  pacientesAutocomplete: PacienteAutocomplete[]

  /** Troca o tipo de visão do calendário (dia/semana/mês). */
  onTrocarVisao?: (tipo: VisaoTipo) => void
  /** Navega entre períodos: -1 = anterior, 1 = próximo, 0 = hoje. */
  onNavegarPeriodo?: (direcao: -1 | 0 | 1) => void
  /** Abre o foco do calendário num dia específico (mini-cal click). */
  onSelecionarDia?: (iso: string) => void

  /** Click num slot vazio do grid — abre drawer de criação com data/hora pré-preenchidas. */
  onClickSlotVazio?: (iso: string, hora: string) => void
  /** Click numa consulta — abre drawer de edição. */
  onClickAgendamento?: (id: string) => void
  /** Click no botão "Nova consulta" do topo — abre drawer vazio. */
  onCriarNovo?: () => void
  /** Submete novo agendamento. */
  onSalvarNovo?: (input: NovoAgendamentoInput) => void
  /** Submete edição de agendamento existente. */
  onSalvarEdicao?: (id: string, input: NovoAgendamentoInput) => void
  /** Cancela agendamento (com confirmação). */
  onCancelarAgendamento?: (id: string, motivo?: string) => void

  /** Confirma um pendente — dispara mensagem ao paciente, status vira 'confirmado'. */
  onConfirmarPendente?: (agendamentoId: string) => void
  /** Marca pendente pra remarcar — abre drawer de edição. */
  onRemarcarPendente?: (agendamentoId: string) => void

  /** Aplica filtros (substitui o estado de filtro inteiro). */
  onAplicarFiltro?: (filtro: FiltroAtivo) => void
  /** Limpa todos os filtros aplicados. */
  onLimparFiltros?: () => void

  /** Inicia o atendimento da próxima consulta (abre seção Consulta). */
  onIniciarConsulta?: (agendamentoId: string) => void
  /** Abre detalhe do paciente. */
  onVerPaciente?: (pacienteId: string) => void
}
