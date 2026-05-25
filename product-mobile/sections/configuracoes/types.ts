// Types for Configurações (Mobile)
//
// Hub de preferências do usuário — tema, idioma, notificações, privacidade.

export type Tema = 'claro' | 'escuro'

export type Idioma =
  | 'pt-BR'
  | 'pt-PT'
  | 'en-US'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'ja'

export type SistemaUnidades = 'metric' | 'imperial'

export type FormatoData = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'

export interface NotificacoesPrefs {
  push: boolean
  email: boolean
  lembretesDiarios: boolean
  analisesIA: boolean
  profissionalRespondeu: boolean
  alertaPlanoExpirando: boolean
}

export interface PrivacidadePrefs {
  compartilharDadosAnonimos: boolean
  permitirIAUsarDados: boolean
  /** Pro user — sempre true, lock visual */
  permitirIAUsarDadosLocked?: boolean
}

export interface AcessibilidadePrefs {
  reduzirMovimento: boolean
  altoContraste: boolean
  textoMaior: boolean
}

export interface AppInfo {
  versao: string
  build: string
  ambiente: 'production' | 'staging' | 'development'
}

export interface ConfiguracoesData {
  tema: Tema
  idioma: Idioma
  unidades: SistemaUnidades
  formatoData: FormatoData
  notificacoes: NotificacoesPrefs
  privacidade: PrivacidadePrefs
  acessibilidade: AcessibilidadePrefs
  appInfo: AppInfo
}

export interface ConfiguracoesProps {
  data: ConfiguracoesData

  onTemaChange?: (t: Tema) => void
  onIdiomaChange?: (i: Idioma) => void
  onUnidadesChange?: (u: SistemaUnidades) => void
  onFormatoDataChange?: (f: FormatoData) => void

  onNotificacaoToggle?: (key: keyof NotificacoesPrefs, valor: boolean) => void
  onPrivacidadeToggle?: (key: keyof PrivacidadePrefs, valor: boolean) => void
  onAcessibilidadeToggle?: (key: keyof AcessibilidadePrefs, valor: boolean) => void

  onExportarDados?: () => void
  onExcluirConta?: () => void

  onAbrirTermos?: () => void
  onAbrirPrivacidade?: () => void
  onAbrirLicencas?: () => void
  onStatusSistema?: () => void
}
