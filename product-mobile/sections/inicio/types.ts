// Types for Início (Dashboard) — Mobile
//
// Combina vários módulos do backend num view-model único:
// - User (auth/users)
// - PatientDiet + PatientDietMeal (diets)
// - DashboardMetricsSummary (dashboard) — origem do anel de calorias e mini-stats
// - AIInsight (dashboard) — alimenta as novidades
//
// Cada bloco UI usa um tipo do backend como base e adiciona apenas o que
// é necessário pra renderização (cor, ícone, label humanizado, formatação).

import type {
  AIInsight,
  PatientDiet,
  PatientDietMeal,
  User,
} from '../../api-types'

export type Periodo = 'manha' | 'tarde' | 'noite'

/**
 * Contexto pessoal do header — derivado de User + cálculos UI.
 */
export interface UsuarioContexto {
  /** User row do backend */
  user: User
  /** Primeiro nome computado de user.name (fallback "Você") */
  primeiroNome: string
  /** Inicial pra avatar fallback */
  avatarInicial: string
  /** user.image direto (foto de perfil) */
  fotoUrl: string | null
  /** Período do dia (computado da hora local) */
  periodo: Periodo
  /** "Bom dia, Roberto" — DM Sans semibold */
  saudacao: string
  /** Frase IA contextual (vem de ai-insights ou hardcoded por hora) */
  fraseIA: string
  /** Streak de dias ativos seguidos (computado de activities/workouts) */
  streakDias: number
  /** Contador de notificações não lidas */
  notificacoesNaoLidas: number
  /** Algum Device com isConnected=true */
  wearableConectado: boolean
}

/**
 * Banner condicional. Pode envolver um AIInsight do backend (analise IA pendente)
 * ou ser uma novidade não-IA (plano novo, mensagem do nutri, foto pendente).
 */
export type NovidadeTipo =
  | 'analise-ia'
  | 'plano-novo'
  | 'mensagem-pro'
  | 'foto-pendente'
  | 'meta-batida'

export interface Novidade {
  id: string
  tipo: NovidadeTipo
  /** Insight original quando tipo='analise-ia' */
  insight: AIInsight | null
  iconeNome: string
  titulo: string
  subtitulo: string
  rota: string
  dispensada: boolean
}

/**
 * View-model do "Plano de Hoje". Embute PatientDiet + lista de PatientDietMeal
 * filtradas/marcadas para o dia atual.
 */
export interface PlanoHoje {
  /** PatientDiet do backend (pode ser null se usuário não tem plano ativo) */
  diet: PatientDiet | null
  ativo: boolean
  /** "Dra. Ana Carolina" — derivado de professionalId via outra chamada */
  profissionalNome: string
  profissionalRole: 'nutri' | 'medico'
  /** Refeições do dia (vem de PatientDiet.meals + log de hoje) */
  refeicoes: RefeicaoHoje[]
  refeicoesRegistradas: number
  refeicoesTotal: number
  proximaRefeicao: RefeicaoHoje | null
}

/** PatientDietMeal + estado "registrada hoje" */
export interface RefeicaoHoje {
  meal: PatientDietMeal
  /** Foi registrada (consumida) hoje */
  registrada: boolean
}

/**
 * Anel de calorias — derivado da soma das MealLogs do dia (consumidas)
 * e DashboardMetricsSummary.metrics.caloriesBurned (gastas).
 */
export interface AnelCalorias {
  consumidas: number
  gastas: number
  meta: number
  metaGasto: number
  acima: boolean
  semMeta: boolean
}

export type StatTendencia = 'up' | 'down' | 'stable'

/**
 * Mini-stat na strip horizontal. Aponta pra um metricType conhecido
 * (ex: 'weight', 'sleep_hours') — frontend resolve via Metric atual + delta.
 */
export interface MiniStat {
  /** = MetricType.value do backend (ex: 'weight', 'daily_steps') ou compute (ex: 'water') */
  id: string
  label: string
  /** Valor formatado pra display */
  valor: string
  unidade: string
  /** Delta vs período anterior, formatado */
  delta: string | null
  tendencia: StatTendencia
  iconeNome: string
  iconeCor: string
  /** Sub-rota de detalhe */
  rota: string
}

export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'

export interface DiaAtivo {
  dia: DiaSemana
  label: string
  /** Houve qualquer activity ou workout completado nesse dia */
  ativo: boolean
  hoje: boolean
}

export interface SemanaAtiva {
  diasAtivos: number
  diasTotal: number
  dias: DiaAtivo[]
  meta: number
}

export type QuickActionId = 'nutricao' | 'atividades' | 'treinos'

export interface QuickAction {
  id: QuickActionId
  label: string
  iconeNome: string
  rota: string
}

/** Preview do score de saúde — links pra Minha Saúde */
export interface HeroSaudePreview {
  scoreAtual: number
  /** Tendência de 7 dias */
  tendencia: 'melhorando' | 'estavel' | 'piorando'
  /** Microbenchmarks (3 dimensões em destaque) */
  microStatus: { label: string; status: 'otimo' | 'bom' | 'atencao' | 'risco' | 'sem_dados' }[]
  /** ISO date — "há 12 dias" */
  ultimaAnaliseEm: string | null
}

export interface MedicacaoDosePreview {
  id: string
  horario: string // "07:00"
  nome: string
  dose: string // "75mcg"
  status: 'cumprido' | 'pendente' | 'futuro' | 'perdido'
}

export interface MedicacaoHojePreview {
  /** Médico vinculado ao paciente. */
  medicoNome: string
  /** Total de doses hoje. */
  total: number
  /** Cumpridas até agora. */
  cumpridas: number
  /** Próximas até 3 doses (cronologicamente). */
  proximasDoses: MedicacaoDosePreview[]
  /** Adesão da semana 0–100 (mostrada como mini-badge). */
  adesaoSemana: number
}

export interface InicioData {
  usuario: UsuarioContexto
  novidades: Novidade[]
  heroSaude: HeroSaudePreview | null
  /** Aparece SÓ se o paciente está vinculado a um médico Nymos Clínico com prescrição ativa. */
  medicacaoHoje: MedicacaoHojePreview | null
  plano: PlanoHoje
  anelCalorias: AnelCalorias
  miniStats: MiniStat[]
  semanaAtiva: SemanaAtiva
  quickActions: QuickAction[]
}

export interface InicioProps {
  data: InicioData
  onNovidadeClick?: (novidade: Novidade) => void
  onNovidadeDismiss?: (id: string) => void
  onSaudeClick?: () => void
  onPlanoClick?: () => void
  onAnelClick?: () => void
  onMiniStatClick?: (stat: MiniStat) => void
  onSemanaClick?: () => void
  onQuickActionClick?: (action: QuickAction) => void
  onStreakClick?: () => void
  onMedicacaoClick?: () => void
  onMarcarDose?: (doseId: string) => void
  onRefresh?: () => Promise<void>
}
