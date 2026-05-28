// Types for Privacidade e Segurança (Mobile)
//
// Central de controles de segurança da conta, preferências de privacidade
// de dados e direitos LGPD do usuário.

import type { Tema } from '../configuracoes/types'

export type VisibilidadePerfil = 'publico' | 'profissionais' | 'privado'

export interface SegurancaPrefs {
  biometria: boolean
  biometriaTipoDispositivo: 'face_id' | 'touch_id' | 'fingerprint' | 'none'
  pinAtivo: boolean
  duasEtapas: boolean
  duasEtapasMetodo: 'totp' | 'sms' | null
}

export interface SessaoAtiva {
  id: string
  /** Nome amigável do device — "iPhone 15 Pro" */
  device: string
  /** Sistema operacional + versão — "iOS 17.4" */
  os: string
  /** Cidade aproximada por geo do IP */
  local: string
  /** Última atividade ISO */
  ultimaAtividade: string
  /** É a sessão da request atual */
  atual: boolean
}

export interface PrivacidadePrefs {
  compartilharDadosAnonimos: boolean
  permitirIAUsarDados: boolean
  /** Pro user — sempre true, lock visual */
  permitirIAUsarDadosLocked?: boolean
  visibilidadePerfil: VisibilidadePerfil
}

export interface ConsentimentoItem {
  id: string
  /** Tipo legível — "Política de Privacidade", "Termos de Uso", "Uso de IA" */
  tipo: string
  versaoTermo: string
  /** ISO */
  aceitoEm: string
  /** ISO se revogado */
  revogadoEm: string | null
  ipRegistro: string
}

export interface PrivacidadeSegurancaData {
  tema: Tema
  seguranca: SegurancaPrefs
  sessoesAtivas: SessaoAtiva[]
  privacidade: PrivacidadePrefs
  consentimentos: ConsentimentoItem[]
  /** Quando o usuário disparou export — null se nunca disparou */
  ultimoExportLGPDEm: string | null
}

export interface PrivacidadeSegurancaProps {
  data: PrivacidadeSegurancaData

  // Segurança
  onToggleBiometria?: (valor: boolean) => void
  onAbrirPinSetup?: () => void
  onAbrirSessoes?: () => void
  onAbrirTrocarSenha?: () => void
  onAbrirDuasEtapas?: () => void

  // Privacidade
  onTogglePrivacidade?: (key: keyof Omit<PrivacidadePrefs, 'permitirIAUsarDadosLocked' | 'visibilidadePerfil'>, valor: boolean) => void
  onAbrirVisibilidadePerfil?: () => void

  // LGPD
  onExportarDados?: () => void
  onAbrirConsentimentos?: () => void
  onExcluirConta?: () => void
}
