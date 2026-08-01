export type NotificacaoId =
  | 'novoAgendamento'
  | 'cancelamento'
  | 'mensagemAdmin'
  | 'cobrancaPendente'

export type VisaoAgenda = 'medico' | 'sala'
export type FormaLink = 'pix' | 'cartao'
export type Tema = 'claro' | 'escuro' | 'sistema'
export type Antecedencia = '24h' | '3h' | '1h'

export interface ContaRecepcao {
  nome: string
  email: string
  persona: string
  iniciais: string
  doisFatores: boolean
}

export interface NotificacaoRecepcao {
  id: NotificacaoId
  titulo: string
  descricao: string
  ativa: boolean
}

export interface AgendaConfig {
  visaoPadrao: VisaoAgenda
  horarioFuncionamento: string
  lembreteAtivo: boolean
  antecedencia: Antecedencia
}

export interface CobrancaConfig {
  formaPadrao: FormaLink
  reciboAutomatico: boolean
}

export interface MensagensConfig {
  assinatura: string
  horarioAtendimento: string
}

export interface AparenciaConfig {
  tema: Tema
}

export interface ConfiguracoesRecepcaoData {
  conta: ContaRecepcao
  notificacoes: NotificacaoRecepcao[]
  agenda: AgendaConfig
  cobranca: CobrancaConfig
  mensagens: MensagensConfig
  aparencia: AparenciaConfig
}
