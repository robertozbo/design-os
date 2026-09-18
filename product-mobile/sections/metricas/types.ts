// Types for Métricas (Mobile)
//
// Estende os tipos do backend (Metric + MetricTypeInfo) com campos UI-only:
// sparkline, delta formatado, fonte humanizada, agrupamento por categoria.
// O backend não envia esses campos — são computados no frontend a partir
// do array de Metric e formatados pra exibição.

import type { Metric, MetricTypeInfo, CompositeFieldDefinition } from '../../api-types'

export type Periodo = 'hoje' | '7d' | '30d' | '6m' | '1a'

export interface PeriodoOpcao {
  id: Periodo
  label: string
}

export type StatTendencia = 'up' | 'down' | 'stable'
export type DeltaTone = 'positive' | 'negative' | 'neutral'

/**
 * Categorias de UI (agrupamento visual). Não vem do backend — são derivadas
 * de `metricType.value` por convenção (ver getCategoriaForMetric em utils).
 */
export type CategoriaMetrica =
  | 'composicao'
  | 'cardio'
  | 'atividade'
  | 'sono'
  | 'hidratacao'
  | 'outros'

/**
 * View-model que combina o último Metric da série + metadata da MetricTypeInfo
 * + campos UI computados (sparkline, delta, fonte humanizada).
 *
 * Construído no frontend a partir de uma chamada à API GET /metrics?metricTypeId=X
 * (que retorna histórico) — usa-se a última pra valor atual e a série pra sparkline.
 */
export interface MetricaViewModel {
  /** ID estável (= metricType.value, ex: 'weight', 'heart_rate') */
  id: string
  /** A última medição (pode ser null se sem dados) */
  ultimo: Metric | null
  /** Catálogo (label, unidade, faixa normal, etc.) */
  tipo: MetricTypeInfo
  /** Categoria derivada (UI-only) */
  categoria: CategoriaMetrica
  /** Ícone Lucide (UI-only) */
  iconeNome: string
  /** Tailwind suffix (ex: 'teal-300') */
  iconeCor: string
  /** Tailwind class (ex: 'bg-teal-500/15') */
  iconeBg: string
  /** Valor formatado pra display (ex: '83,4', '8h 12m'). null se semDados. */
  valorFormatado: string | null
  /** Delta formatado (ex: '↓ -0,3 kg'). null se semDados ou sem comparação. */
  delta: string | null
  tendencia: StatTendencia
  deltaTone: DeltaTone
  /** "Apple Watch · há 3 min" — humanizado a partir de Metric.source/deviceId/measuredAt */
  fonte: string
  /** Últimos N pontos pra sparkline (vem da API ou computado no client) */
  sparkline: number[]
  semDados: boolean
  /** Rota de detalhe (ex: '/metricas/weight') */
  rota: string
}

export interface CategoriaSection {
  id: CategoriaMetrica
  label: string
  iconeNome: string
  metricas: MetricaViewModel[]
}

export interface MetricasData {
  periodos: PeriodoOpcao[]
  categorias: CategoriaSection[]
  /** True se nenhum Device com isConnected=true */
  semWearables: boolean
}

export interface MetricasProps {
  data: MetricasData
  selectedPeriodo: Periodo
  onPeriodoChange?: (periodo: Periodo) => void
  /** Recebe a métrica view-model (componente parent navega usando rota) */
  onMetricaClick?: (metrica: MetricaViewModel) => void
  onAdicionarClick?: () => void
  onConectarDispositivoClick?: () => void
  onRefresh?: () => Promise<void>
}

// Backwards-compat alias for the old `Metrica` type used in components.
// Antes era um tipo flat; agora é o view-model. O alias simplifica migração.
export type Metrica = MetricaViewModel

// ─────────────────────────────────────────────────────────────────────────
// Tela de Detalhe da Métrica
// ─────────────────────────────────────────────────────────────────────────

/** Períodos do filtro na tela de detalhe (abre em 7d). */
export type PeriodoDetalhe = '7d' | '30d' | '3m' | '6m' | '1a'

export interface PeriodoDetalheOpcao {
  id: PeriodoDetalhe
  label: string
}

/** Ponto datado da série temporal exibida no gráfico/histórico. */
export interface SeriePonto {
  /** ISO date (ex: '2026-05-14') */
  t: string
  v: number
  /** Rótulo curto pra eixo X / histórico (ex: '14 mai') */
  rotulo: string
  /** Fonte humanizada da leitura (ex: 'Apple Watch') */
  fonte?: string
}

/** Estatísticas agregadas do período selecionado. */
export interface MetricaDetalheStats {
  min: number
  max: number
  media: number
  unidade: string
}

/** Faixa normal de referência (sombreada no gráfico), quando houver. */
export interface FaixaNormal {
  min: number | null
  max: number | null
}

export interface MetricaDetalheProps {
  /** View-model da métrica (header: ícone, nome, valor atual, delta, fonte). */
  metrica: MetricaViewModel
  periodos: PeriodoDetalheOpcao[]
  periodoSelecionado: PeriodoDetalhe
  /** Série já filtrada pro período selecionado (mais antigo → mais recente). */
  serie: SeriePonto[]
  stats: MetricaDetalheStats
  faixaNormal?: FaixaNormal
  /** Adiciona espaço no topo pra notch quando renderizada full-frame (sem status bar da shell). */
  safeTop?: boolean
  onPeriodoChange?: (p: PeriodoDetalhe) => void
  onVoltar?: () => void
  onAdicionarClick?: () => void
}

// ─────────────────────────────────────────────────────────────────────────
// Cadastrar registro de métrica
// ─────────────────────────────────────────────────────────────────────────

/** Opção selecionável no picker de métrica do formulário de cadastro. */
export interface MetricaOpcao {
  id: string
  label: string
  unit: string
  iconeNome: string
  iconeCor: string
  iconeBg: string
  /** 'number' | 'composite' */
  dataType: string
  compositeFields: Record<string, CompositeFieldDefinition> | null
}

export interface AdicionarMetricaCategoria {
  id: CategoriaMetrica
  label: string
  opcoes: MetricaOpcao[]
}

/** Campo de entrada de uma métrica derivada (ex: peso e altura pro IMC). */
export interface DerivacaoCampo {
  key: string
  label: string
  unit: string
  placeholder?: string
}

/**
 * Configuração de uma métrica **calculada** a partir de mais de uma entrada.
 * Ex: IMC = peso / altura². A fórmula vive no preview (domínio), o componente
 * só renderiza os campos e mostra o resultado.
 */
export interface DerivacaoConfig {
  campos: DerivacaoCampo[]
  unidade: string
  /** Retorna o valor calculado, ou null se entradas insuficientes/ inválidas. */
  calcular: (valores: Record<string, number>) => number | null
}

/** Payload emitido ao salvar um registro manual. */
export interface NovoRegistro {
  metricaId: string
  /** Valor escalar (number) ou mapa de campos (composite/derivado calculado). */
  valor: number | Record<string, number>
  /** Entradas brutas quando o valor é calculado (ex: { peso, altura } pro IMC). */
  entradas?: Record<string, number>
  data: string
  hora: string
  nota?: string
}

export interface AdicionarMetricaProps {
  categorias: AdicionarMetricaCategoria[]
  /** Métrica pré-selecionada (ex: vindo do detalhe). */
  selecionadaId?: string | null
  /** Métricas calculadas (id → config). Ex: { bmi: { campos:[peso,altura], calcular } }. */
  derivacoes?: Record<string, DerivacaoConfig>
  safeTop?: boolean
  onVoltar?: () => void
  onSalvar?: (registro: NovoRegistro) => void
}
