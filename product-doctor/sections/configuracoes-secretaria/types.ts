// Types for Configurações Secretária (Web — persona Secretária)
// Reduced scope: personal account only. No clinic-wide config.

export type Tema = 'sistema' | 'claro' | 'escuro'

export interface PerfilSecretaria {
  fotoUrl: string | null
  inicial: string
  nomeCompleto: string
  email: string
  telefone: string
  cargo: string // fixo "Secretária"
  desde: string // ISO date de admissão / vínculo
}

export interface NotificacoesSecretaria {
  pushNovoAgendamento: boolean
  pushCancelamento: boolean
  pushMensagemAdmin: boolean
  emailResumoAgenda: boolean
  emailPagamentoConfirmado: boolean
  smsLembretePlantao: boolean
}

export interface PreferenciasSecretaria {
  tema: Tema
  idioma: string // 'pt-BR' fixo V1
  fusoHorario: string
}

export interface EscopoAcesso {
  permitido: string[]
  bloqueado: string[]
}

export interface ConfiguracoesSecretariaData {
  perfil: PerfilSecretaria
  notificacoes: NotificacoesSecretaria
  preferencias: PreferenciasSecretaria
  escopo: EscopoAcesso
}

export interface ConfiguracoesSecretariaProps {
  data: ConfiguracoesSecretariaData

  onPerfilChange?: (
    campo: keyof PerfilSecretaria,
    valor: PerfilSecretaria[keyof PerfilSecretaria],
  ) => void
  onNotificacaoToggle?: (key: keyof NotificacoesSecretaria, valor: boolean) => void
  onPreferenciaChange?: (
    campo: keyof PreferenciasSecretaria,
    valor: PreferenciasSecretaria[keyof PreferenciasSecretaria],
  ) => void
  onAlterarSenha?: (atual: string, nova: string) => void
  onSalvar?: () => void
}
