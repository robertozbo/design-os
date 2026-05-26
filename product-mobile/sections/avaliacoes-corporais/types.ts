// Avaliações Corporais — types do protótipo mobile (espelhando o que existe em produção)
// Real source: mobile/src/services/body-evaluations.service.ts (simplificado pra spec)

export type EvaluationSource = 'ia' | 'device' | 'manual'

export type PhotoAngle = 'front' | 'side' | 'back'

export interface Bioimpedance {
  id: string
  evaluationDateISO: string
  /** HH:mm pra render */
  timeLabel: string
  source: EvaluationSource
  deviceBrand?: string
  deviceModel?: string
  /** Peso em kg */
  weight: number | null
  /** % gordura corporal */
  bodyFatPercentage: number | null
  /** Massa muscular em kg */
  muscleMass: number | null
  /** Score de gordura visceral (sem unidade) */
  visceralFat: number | null
  /** % água corporal */
  bodyWaterPercentage: number | null
  /** Taxa metabólica basal em kcal */
  bmr: number | null
  /** Idade metabólica em anos */
  metabolicAge: number | null
  /** Índice de massa corporal */
  bmi: number | null
  notes?: string
}

export interface BodyPhoto {
  id: string
  photoType: PhotoAngle
  /** URL ou placeholder do recurso */
  imageUrl: string
}

export interface BodyPhotoSession {
  id: string
  evaluationDateISO: string
  /** HH:mm pra render */
  timeLabel: string
  source: EvaluationSource
  photos: BodyPhoto[]
  notes?: string
}

export interface BioimpedanceStats {
  total: number
  /** Último peso registrado em kg (null se ainda não tem registro) */
  lastWeight: number | null
  /** Última % gordura registrada (null se ainda não tem registro) */
  lastBodyFat: number | null
}

export interface PhotoStats {
  total: number
  /** Label relativo da última sessão, ex: "há 3 dias" */
  lastSessionLabel: string
}

/** Grupo de bioimpedâncias por data — usado pelo SectionList do mobile. */
export interface BioimpedanceDateGroup {
  /** Label formatado: "Segunda, 25 maio" */
  dateLabel: string
  dateISO: string
  items: Bioimpedance[]
}

/** Grupo de sessões de fotos por data — usado pelo SectionList do mobile. */
export interface PhotoSessionDateGroup {
  /** Label formatado: "Segunda, 25 maio" */
  dateLabel: string
  dateISO: string
  items: BodyPhotoSession[]
}

export interface AvaliacoesCorporaisData {
  bioimpedance: {
    stats: BioimpedanceStats
    groups: BioimpedanceDateGroup[]
  }
  photos: {
    stats: PhotoStats
    groups: PhotoSessionDateGroup[]
  }
}

export type AvaliacoesTab = 'bioimpedancia' | 'fotos'

export interface AvaliacoesCorporaisProps {
  data: AvaliacoesCorporaisData
  /** Tab ativo (controlado). Se omitido, componente controla internamente. */
  activeTab?: AvaliacoesTab
  onChangeTab?: (tab: AvaliacoesTab) => void
  /** Tap no card de bioimpedância → abre detalhe (modal/sheet). */
  onAbrirBioimpedancia?: (id: string) => void
  /** Tap no card de sessão de fotos → abre detalhe. */
  onAbrirSessaoFotos?: (id: string) => void
  /** FAB / empty state CTA → fluxo de nova entrada conforme tab ativo. */
  onNovaAvaliacao?: (tab: AvaliacoesTab) => void
  /** Pull-to-refresh. */
  onRefresh?: () => void
}
