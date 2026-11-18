export type TipoNotificacao = 'dor' | 'treino' | 'mensagem' | 'agendamento' | 'avaliacao' | 'convite'

export interface Notificacao {
  id: string
  tipo: TipoNotificacao
  titulo: string
  texto: string
  quando: string
  lida: boolean
}

export interface PersonalNotificacoesData {
  hoje: Notificacao[]
  anteriores: Notificacao[]
}

export interface PersonalNotificacoesProps {
  data: PersonalNotificacoesData
  onAbrir?: (n: Notificacao) => void
  onMarcarTodas?: () => void
}
