export type Canal = 'app' | 'whatsapp' | 'email' | 'sms'
export type CategoriaId =
  | 'agendamento'
  | 'clinico'
  | 'comunicacao'
  | 'cobranca'
  | 'marketing'

export interface Categoria {
  id: CategoriaId
  label: string
  descricao: string
  ativo: Record<Canal, boolean>
  /** Se a categoria é crítica (não pode desligar TODOS os canais) */
  critica: boolean
}

export interface HorarioSilencio {
  ativo: boolean
  inicio: string // 'HH:mm'
  fim: string // 'HH:mm'
  aplicaACanais: Canal[]
}

export type NotifSeveridade = 'info' | 'atencao' | 'sucesso' | 'risco'

export interface NotifFeedItem {
  id: string
  categoriaId: CategoriaId
  severidade: NotifSeveridade
  titulo: string
  descricao: string
  dataIso: string
  lida: boolean
  acaoLabel?: string
}

export interface NotificacoesData {
  categorias: Categoria[]
  horarioSilencio: HorarioSilencio
  recentes: NotifFeedItem[]
}
