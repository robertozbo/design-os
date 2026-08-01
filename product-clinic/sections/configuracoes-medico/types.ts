export type Tema = 'claro' | 'escuro' | 'sistema'

export interface MedicoPerfil {
  nome: string
  iniciais: string
  especialidade: string
  crm: string
  email: string
  ultimoAcesso: string
}

export interface Conta {
  doisFatores: boolean
  ultimaTrocaSenha: string
}

/** Um evento notificável, com toggle por canal. */
export interface NotificacaoEvento {
  id: string
  titulo: string
  descricao: string
  email: boolean
  push: boolean
}

export interface OpcaoSelect {
  value: string
  label: string
}

export interface Atendimento {
  escribaPadrao: boolean
  teleconsulta: boolean
  templateAnamnese: string
  templatesDisponiveis: OpcaoSelect[]
  duracaoConsulta: string
  duracoesDisponiveis: OpcaoSelect[]
}

export interface Prescricao {
  memedVinculada: boolean
  memedConta: string
  assinaturaAttest: boolean
}

export interface Privacidade {
  confirmarGravacaoPorConsulta: boolean
}

export interface ConfiguracoesMedicoData {
  medico: MedicoPerfil
  conta: Conta
  notificacoes: NotificacaoEvento[]
  atendimento: Atendimento
  prescricao: Prescricao
  privacidade: Privacidade
  tema: Tema
}

/** Canal de notificação (usado nos callbacks de toggle). */
export type CanalNotificacao = 'email' | 'push'
