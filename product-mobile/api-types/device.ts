// Mirror of backend/api/modules/devices/types.ts (Zod schemas removidos).

/**
 * Tipo "raiz" de device suportado pelo backend.
 * Apenas 3 — outros wearables (Apple Watch, Garmin, Fitbit, Whoop, Oura, balanças)
 * fluem através destes agregadores.
 */
export type DeviceType = 'google_fit' | 'apple_health' | 'health_connect'

export type DeviceSyncStatus = 'connected' | 'syncing' | 'error' | 'disconnected'

export interface HealthKitPermission {
  type: string
  status: 'granted' | 'denied' | 'restricted' | 'not_determined'
  hkIdentifier: string
  grantedAt?: Date
  lastChecked?: Date
}

/**
 * Device cadastrado pelo usuário.
 *
 * deviceSubtype identifica origem física (apple_watch, iphone, ipad).
 * Para Garmin/Fitbit/Whoop/balanças, o backend trata como source dentro
 * dos dados de Apple Health / Health Connect, não como Device separado.
 */
export interface Device {
  id: string
  userId: string
  deviceType: DeviceType
  /** Apple Health: 'iphone' | 'apple_watch' | 'ipad'. Outros: definido pelo agregador. */
  deviceSubtype?: string
  name: string
  description?: string
  /** Encrypted no DB; nunca exposto cru no app */
  credentials: DeviceCredentials
  // Apple Health específico
  appleUserId?: string
  appleTeamId?: string
  healthkitPermissions?: HealthKitPermission[]
  appleTokens?: unknown
  lastHealthkitSync?: Date
  appleNotificationToken?: string
  // Estado
  isConnected: boolean
  lastSync?: Date
  syncStatus: DeviceSyncStatus
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

export interface DeviceCredentials {
  googleFit?: {
    accessToken: string
    refreshToken: string
    tokenExpiry: Date
    email: string
  }
  appleHealth?: AppleHealthCredentials
  healthConnect?: HealthConnectCredentials
}

export interface AppleHealthCredentials {
  appleUserId: string
  tokens: {
    accessToken: string
    refreshToken?: string
    idToken: string
    tokenExpiry: Date
    refreshTokenExpiry?: Date
  }
  permissions?: HealthKitPermission[]
}

export interface HealthConnectCredentials {
  authorized: boolean
  authorizedAt?: Date | string
  permissions?: {
    read: string[]
    write: string[]
  }
  grantedAt?: Date
  lastSync?: Date
}

export interface CreateDeviceRequest {
  deviceType: DeviceType
  name: string
  description?: string
  credentials?: DeviceCredentials
  deviceSubtype?: string
  isConnected?: boolean
  syncStatus?: DeviceSyncStatus
  healthkitPermissions?: Record<string, unknown>
}

export interface UpdateDeviceRequest {
  name?: string
  description?: string
  credentials?: DeviceCredentials
  isConnected?: boolean
  syncStatus?: DeviceSyncStatus
  errorMessage?: string
  deviceSubtype?: string
  healthkitPermissions?: Record<string, unknown>
  lastHealthkitSync?: Date
}

export interface DeviceFilters {
  deviceType?: DeviceType
  isConnected?: boolean
  syncStatus?: DeviceSyncStatus
  limit?: number
  offset?: number
}

/**
 * Mapeamento de tipos de dado (Google Fit / Health Connect) → metric_type interno.
 * Útil pro UI saber o que cada agregador potencialmente fornece.
 */
export interface NymosMetricMapping {
  nymosMetricType: string
  dataType: 'number' | 'composite'
  unit?: string
  compositeFields?: Record<string, CompositeFieldMapping>
  googleFitUnit?: string
  requiresConversion?: boolean
  conversionFactor?: number
}

interface CompositeFieldMapping {
  label: string
  unit: string
}
