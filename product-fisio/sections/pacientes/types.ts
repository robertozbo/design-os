export type StatusNymosMove = 'nao-convidado' | 'pendente' | 'conectado'
export type StatusPaciente = 'em-tratamento' | 'em-alta' | 'inativo'
export type StatusSessao = 'agendada' | 'confirmada' | 'realizada' | 'falta' | 'cancelada'
export type Tendencia = 'melhora' | 'estavel' | 'piora'
export type HubTabId = 'visao-geral' | 'avaliacoes' | 'evolucao' | 'agenda' | 'saude'

export interface Paciente {
  id: string
  nome: string
  idade: number
  avatarUrl?: string
  telefone: string
  email?: string
  queixaPrincipal: string
  status: StatusPaciente
  statusNymosMove: StatusNymosMove
  dataInicioTratamento: string
  evaAtual: number
  evaInicial: number
  sessoesRealizadas: number
  ultimaSessaoData?: string
  proximaSessaoData?: string
  ultimaAvaliacaoData?: string
  aderenciaExercicios?: number
  tendencia: Tendencia
}

export interface SessaoSOAP {
  id: string
  data: string
  eva: number
  subjetivo: string
  objetivo: string
  avaliacao: string
  plano: string
  condutas: string[]
  tendencia: Tendencia
}

export interface AvaliacaoResumo {
  id: string
  tipo: 'inicial' | 'reavaliacao'
  data: string
  eva: number
  admPrincipal?: { articulacao: string; valor: number; unidade: string }
  observacao: string
}

export interface AgendamentoResumo {
  id: string
  data: string
  hora: string
  duracaoMin: number
  status: StatusSessao
}

export interface DadosWearable {
  passos7d: number[]
  sonoMediaHoras: number
  sonoUltimas7Noites: number[]
  fcRepouso: number
  fcPico7d: number
  aderenciaExerciciosSemanal: number[]
  alertas: string[]
}

export interface AtividadeRecente {
  id: string
  tipo: 'sessao' | 'avaliacao' | 'agendamento' | 'prescricao' | 'mensagem'
  data: string
  descricao: string
}
