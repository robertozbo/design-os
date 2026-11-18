export interface Solicitacao {
  id: string
  aluno: string
  inicial: string
  novo: boolean
  pedido: string
  horario: string
  mensagem?: string
  recebida: string
}

export interface PersonalSolicitacoesData {
  pendentes: Solicitacao[]
  respondidas: Array<Solicitacao & { resposta: 'aceita' | 'recusada' }>
}

export interface PersonalSolicitacoesProps {
  data: PersonalSolicitacoesData
  onAceitar?: (id: string) => void
  onSugerir?: (id: string) => void
  onRecusar?: (id: string) => void
}
