// Notificações — types do protótipo mobile (espelhando o que existe em produção)
// Real source: mobile/src/services/notifications.service.ts (simplificado pra spec)

export type StatusLeitura = 'lida' | 'nao-lida'

export type TipoNotificacao =
  | 'lembrete-medicacao'
  | 'alerta-exame'
  | 'mensagem-profissional'
  | 'conquista'
  | 'sequencia'
  | 'saude'
  | 'ranking'
  | 'sistema'

export type BucketTempo = 'hoje' | 'ontem' | 'esta-semana' | 'mais-antigas'

export interface Notificacao {
  id: string
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  status: StatusLeitura
  criadaEmISO: string
  /** Path interno pra navegar quando o paciente tap. Ex.: '/medicacoes/abc'. */
  link?: string
  /** Label do CTA explícito (quando a notificação tem ação primária além do tap). */
  ctaLabel?: string
}

export interface NotificacoesStats {
  total: number
  naoLidas: number
}

/** Grupo de notificações por janela de tempo — usado pelo SectionList. */
export interface NotificacaoBucket {
  bucket: BucketTempo
  /** Label formatado pra header: "Hoje", "Ontem", etc. */
  label: string
  notificacoes: Notificacao[]
}

export interface NotificacoesData {
  stats: NotificacoesStats
  buckets: NotificacaoBucket[]
}

export type FiltroNotificacao = 'todas' | TipoNotificacao

export interface NotificacoesProps {
  data: NotificacoesData
  /** Tap na notificação → marca como lida + navega pro link (se houver). */
  onAbrirNotificacao?: (id: string) => void
  /** Botão "Marcar todas como lidas". */
  onMarcarTodasLidas?: () => void
  /** Pull-to-refresh. */
  onRefresh?: () => void
}
