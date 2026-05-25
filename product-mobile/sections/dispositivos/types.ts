// Types for Dispositivos (Mobile)
//
// Estende `Device` do backend (3 tipos: apple_health | google_fit | health_connect).
// Outros wearables (Apple Watch, Garmin, balanças, etc.) NÃO são Devices separados —
// fluem através dos agregadores via permissions/healthkit subtypes.
//
// O picker de "Adicionar dispositivo" reflete as 3 integrações reais:
// - Apple Health (iOS) — disponível no MVP
// - Google Fit — em breve
// - Health Connect (Android) — em breve

import type { Device, DeviceSyncStatus, DeviceType } from '../../api-types'

/**
 * Tipos de dado que podem ser sincronizados (chips no card).
 * Identificadores estáveis do backend.
 */
export type TipoDado =
  | 'daily_steps'
  | 'heart_rate'
  | 'resting_heart_rate'
  | 'sleep_hours'
  | 'calories_burned'
  | 'distance_traveled'
  | 'weight'
  | 'body_fat_percentage'
  | 'oxygen_saturation'
  | 'body_temperature'
  | 'blood_pressure'
  | 'blood_glucose'
  | 'stress_level'
  | 'flights_climbed'

export interface TipoDadoChip {
  id: TipoDado
  label: string // "Passos", "BPM", "Sono"
  iconeNome: string // lucide icon name
}

/**
 * View-model UI que combina Device do backend + extensions visuais.
 */
export interface DispositivoViewModel {
  /** Device row do backend (encrypted credentials já filtradas) */
  device: Device
  /** Label humanizado da integração ("Apple Health · Apple Watch", "Apple Saúde") */
  marcaLabel: string
  /** Modelo / descrição secundária mostrada no card ("Series 9 · 41mm", "HealthKit · iOS") */
  modelo: string
  /** Lucide icon name (UI-only) */
  iconeNome: string
  /** Tailwind suffix (ex: "red-400") */
  iconeCor: string
  /** Tailwind class (ex: "bg-red-500/15") */
  iconeBg: string
  /** Humanizado de Device.lastSync ("há 4 min", "ontem", "—") */
  ultimaSyncRelativo: string
  /** Tipos de dado coletados (computado das healthkitPermissions ou config) */
  tiposDado: TipoDadoChip[]
  /** Bateria reportada via HealthKit (UI-only, não vem do Device row) */
  bateriaPct: number | null
}

export interface DispositivosStats {
  total: number
  conectados: number
  ultimaSyncRelativo: string
}

export type FiltroStatus = 'todos' | 'conectados' | 'desconectados'

export interface FiltroOpcao {
  id: FiltroStatus
  label: string
  count: number
}

/**
 * Picker categoria — reflete as 3 integrações reais do backend (DeviceType).
 * Cada integração lista as marcas/wearables que conectam via ela.
 */
export interface CategoriaPicker {
  id: DeviceType
  label: string // "Apple Health (iOS)", "Health Connect (Android)", "Google Fit"
  descricao: string // "iPhone, Apple Watch, balanças, apps 3rd-party"
  iconeNome: string
  iconeCor: string
  iconeBg: string
  /** Disponível no MVP */
  disponivel: boolean
  /** Wearables/apps de origem que esta integração suporta (informativo) */
  origens: OrigemPickerItem[]
}

export interface OrigemPickerItem {
  id: string // ex: "apple-watch", "garmin-via-apple-health"
  label: string // "Apple Watch", "Garmin (via Apple Health)"
  iconeNome: string
  iconeCor: string
  descricao: string
  /** True se essa origem aparece automaticamente quando o agregador está conectado */
  automatico: boolean
}

export interface DispositivosData {
  stats: DispositivosStats
  dispositivos: DispositivoViewModel[]
  filtros: FiltroOpcao[]
  categoriasPicker: CategoriaPicker[]
}

export interface DispositivosProps {
  data: DispositivosData
  selectedFiltro: FiltroStatus
  onFiltroChange?: (filtro: FiltroStatus) => void
  onDispositivoClick?: (id: string) => void
  onSincronizarDispositivo?: (id: string) => void
  onDesconectar?: (id: string) => void
  onAdicionarClick?: () => void
  /** Selecionar uma das 3 integrações no picker (apple_health/google_fit/health_connect) */
  onIntegracaoSelecionada?: (deviceType: DeviceType) => void
  onSincronizarTudo?: () => void
  onBack?: () => void
}

// Backwards-compat para componentes antigos
export type Dispositivo = DispositivoViewModel
export type { DeviceSyncStatus as StatusDispositivo, DeviceType }
