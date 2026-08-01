// Types for Configurações Psi (Web)

export type Modalidade = 'presencial' | 'online' | 'hibrida'

export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'

export interface PerfilProfissional {
  fotoUrl: string | null
  inicial: string
  nomeCompleto: string
  crp: string
  email: string
  telefone: string
  especialidade: string
  abordagensPrincipais: string[]
  formacao: { instituicao: string; titulo: string; ano: number }[]
  bio: string
}

export interface SlotDisponibilidade {
  dia: DiaSemana
  inicio: string
  fim: string
  modalidade: Modalidade
}

export interface ConfiguracaoModalidades {
  presencial: { ativa: boolean; endereco: string | null }
  online: { ativa: boolean; plataforma: string | null }
  hibrida: { ativa: boolean }
}

export interface PacoteSessao {
  id: string
  nome: string
  numSessoes: number
  precoTotal: number
  validadeMeses: number
}

export interface ConfiguracaoValores {
  sessaoPadraoBrl: number
  sessaoOnlineBrl: number
  primeiraConsultaBrl: number
  pacotes: PacoteSessao[]
  formaPagamento: string[]
}

export interface Convenio {
  id: string
  nome: string
  ativo: boolean
  valorRepasseBrl: number | null
}

export interface NotificacoesPrefs {
  pushSessaoIniciar: boolean
  pushPacienteAlerta: boolean
  pushMensagemPaciente: boolean
  emailResumoDiario: boolean
  emailNovoAgendamento: boolean
  smsLembreteSessao: boolean
}

export interface ConfiguracoesData {
  perfil: PerfilProfissional
  disponibilidade: SlotDisponibilidade[]
  modalidades: ConfiguracaoModalidades
  valores: ConfiguracaoValores
  convenios: Convenio[]
  notificacoes: NotificacoesPrefs
}

export interface ConfiguracoesProps {
  data: ConfiguracoesData

  onPerfilChange?: (campo: keyof PerfilProfissional, valor: PerfilProfissional[keyof PerfilProfissional]) => void
  onSlotToggle?: (dia: DiaSemana, hora: string) => void
  onModalidadeToggle?: (modalidade: Modalidade) => void
  onValoresChange?: (campo: keyof ConfiguracaoValores, valor: ConfiguracaoValores[keyof ConfiguracaoValores]) => void
  onConvenioToggle?: (id: string) => void
  onNotificacaoToggle?: (key: keyof NotificacoesPrefs, valor: boolean) => void
  onSalvar?: () => void
}
