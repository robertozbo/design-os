// Types for Minha Saúde (Mobile)
//
// Camada de síntese: combina todos os dados coletados (metrics, body_evaluations,
// activities, nutrition, exams, sleep) num score de saúde com benchmarks oficiais.
// Permite gerar snapshots pontuais e comparar evolução.

// Tipos de referência estratificada são canônicos em api-types/metric.ts
// (compartilhados com MetricTypeInfo).
import type {
  Sexo,
  FaixaEtaria,
  FaixaReferenciaValor,
  ReferenciaPorIdadeSexo,
} from '../../api-types'

export type { Sexo, FaixaEtaria, FaixaReferenciaValor, ReferenciaPorIdadeSexo }

// ─────────────────────────────────────────────────────────────────────────────
// Dimensões da análise
// ─────────────────────────────────────────────────────────────────────────────

export type DimensionId =
  | 'composicao'
  | 'metabolico'
  | 'cardiovascular'
  | 'atividade'
  | 'sono'
  | 'nutricao'
  | 'mental'

export type DimensionStatus = 'otimo' | 'bom' | 'atencao' | 'risco' | 'sem_dados'

/** Confiabilidade da avaliação por suficiência de dados */
export type DataSufficiency = 'suficiente' | 'parcial' | 'insuficiente'

export interface DimensionScore {
  id: DimensionId
  /** Nome legível ("Composição Corporal") */
  label: string
  /** Score 0-100 (null se sem dados) */
  score: number | null
  status: DimensionStatus
  /** Confiabilidade do score baseado em dados disponíveis */
  sufficiency: DataSufficiency
  /** Métricas-chave que compõem essa dimensão */
  metrics: DimensionMetric[]
  /** O que coletar pra melhorar a avaliação */
  faltam?: string[]
}

export interface DimensionMetric {
  /** Nome da métrica ("% Gordura", "VO2 Máx", "Glicose jejum") */
  label: string
  /** Valor atual formatado pra display */
  valor: string
  /** Unidade ("kg", "%", "mg/dL") */
  unidade?: string
  /** Faixa de referência ("14-19%", "<100 mg/dL") — texto pra display */
  faixaReferencia: string
  /** Referência estruturada por idade+sexo (opcional, novo) — quando preenchido, o app escolhe faixa pelo perfil do usuário */
  referenciaPorIdadeSexo?: ReferenciaPorIdadeSexo
  /** Fonte oficial da referência ("OMS", "WHO", "ADA", "SBC") */
  fonteReferencia: string
  status: DimensionStatus
  /** Direção da mudança vs medição anterior */
  direcao?: 'subiu' | 'desceu' | 'manteve' | 'sem_anterior'
  /** Delta vs anterior formatado ("−0,3", "+2", "0%") */
  delta?: string
  /** Se subir é bom (ex: massa muscular, VO2) ou ruim (ex: % gordura, glicose) */
  subirEhBom?: boolean
  /** Histórico curto pra tooltip (mais antigo → mais recente) */
  historico?: MetricHistorico[]
}

export interface MetricHistorico {
  /** ISO date da medição */
  data: string
  /** Valor formatado naquele momento */
  valor: string
  /** Valor numérico cru (pra sparkline) */
  valorNumerico: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Snapshot (análise armazenada)
// ─────────────────────────────────────────────────────────────────────────────

export interface SnapshotFotos {
  frontal?: string
  posterior?: string
  lateralEsquerda?: string
  lateralDireita?: string
}

export interface Snapshot {
  id: string
  /** Quando a análise foi gerada */
  geradoEm: string // ISO date
  /** Score geral 0-100 */
  scoreGeral: number
  /** Delta de score vs snapshot anterior (null se for o primeiro) */
  deltaScore: number | null
  /** Breakdown por dimensão */
  dimensoes: DimensionScore[]
  /** Análise textual gerada por IA */
  resumoIA: string
  /** Highlights — pontos que mais mudaram */
  destaques: string[]
  /** Idades (real / corporal / visual estimada / visual projetada) — sempre tratadas como estimativa quando "visual" */
  idades?: SnapshotIdades
  /** Fotos corporais congeladas no momento (se havia) */
  fotos?: SnapshotFotos
  /** Dados base usados pra esta análise */
  baseadoEm: SnapshotBase
  /** Consentimento LGPD registrado pra análise das fotos (obrigatório quando há fotos) */
  consentimento?: SnapshotConsentimento
}

export interface SnapshotIdades {
  /** Idade cronológica real */
  real: number
  /** Idade corporal estimada pela bioimpedância */
  corporal?: number
  /**
   * Idade visual atual estimada pelas fotos (faixa).
   * SEMPRE apresentar como estimativa subjetiva, nunca como medição científica.
   */
  visualEstimada?: { min: number; max: number }
  /** Idade visual projetada se atingir a meta (faixa) */
  visualProjetada?: { min: number; max: number }
}

export interface SnapshotConsentimento {
  /** ISO date do aceite */
  aceitoEm: string
  /** Versão do termo aceito (pra rastreabilidade) */
  versaoTermo: string
  /** Escopo do consentimento concedido */
  escopo: ('analise_visual' | 'projecao_ia' | 'armazenamento' | 'export_profissional')[]
}

export interface SnapshotBase {
  /** Última bioimpedância considerada */
  bioimpedanciaId?: string
  /** Últimos exames considerados */
  exameIds: string[]
  /** Fotos corporais consideradas */
  fotosId?: string
  /** Janela de métricas usada (ex: 30 dias antes do snapshot) */
  janelaMetricas: { de: string; ate: string }
}

// ─────────────────────────────────────────────────────────────────────────────
// Freshness gate (regra anti-custo IA)
// ─────────────────────────────────────────────────────────────────────────────

export type FreshnessStatus = 'elegivel' | 'aguardando_dados' | 'sem_analise_anterior'

export interface FreshnessGate {
  status: FreshnessStatus
  /** ISO date da última análise (null se nunca gerou) */
  ultimaAnaliseEm: string | null
  /** Dias desde a última análise */
  diasDesdeUltima: number
  /** Cooldown mínimo em dias */
  cooldownDias: number
  /** Novidades desde última análise */
  novosDados: NovosDados
  /** Mensagem explicativa pro usuário */
  mensagem: string
}

export interface NovosDados {
  bioimpedancias: number
  exames: number
  fotosCorporais: number
  /** Pode override cooldown se algum desses for >0 */
  temNovidadeRelevante: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Comparação entre snapshots
// ─────────────────────────────────────────────────────────────────────────────

export interface SnapshotDiff {
  snapshotInicial: Snapshot
  snapshotFinal: Snapshot
  /** Diff por dimensão */
  dimensoes: DimensionDiff[]
  /** Score geral antes vs depois */
  scoreDelta: number
}

export interface DimensionDiff {
  dimensaoId: DimensionId
  label: string
  scoreInicial: number | null
  scoreFinal: number | null
  delta: number | null
  /** Direção visual da mudança */
  direcao: 'subiu' | 'desceu' | 'manteve' | 'sem_dados'
  /** Mudanças em métricas específicas */
  metricas: MetricDiff[]
}

export interface MetricDiff {
  label: string
  valorInicial: string
  valorFinal: string
  delta?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Evolução (séries temporais)
// ─────────────────────────────────────────────────────────────────────────────

export type EvolucaoPeriodo = '3m' | '6m' | '1a' | 'tudo'

export interface EvolucaoPonto {
  /** ISO date — quando o snapshot foi gerado */
  data: string
  /** Score 0-100 (null se não havia dados naquele snapshot) */
  score: number | null
}

export interface EvolucaoSerie {
  dimensaoId: DimensionId
  label: string
  /** Pontos cronológicos (mais antigo → mais recente) */
  pontos: EvolucaoPonto[]
  /** Score atual (último ponto válido) */
  scoreAtual: number | null
  /** Delta entre primeiro e último ponto */
  deltaTotal: number | null
  /** Status atual (deriva de scoreAtual) */
  statusAtual: DimensionStatus
}

// ─────────────────────────────────────────────────────────────────────────────
// Projeção Corporal (IA)
// ─────────────────────────────────────────────────────────────────────────────

export type ProjecaoStatus = 'pronta' | 'gerando' | 'sem_dados_suficientes' | 'nao_solicitada'

export type RegiaoCorporal =
  | 'abdomen'
  | 'flancos'
  | 'peitoral'
  | 'costas'
  | 'bracos'
  | 'pernas'
  | 'cintura'
  | 'ombros'
  | 'postura'

export type EstrategiaMassa = 'manter' | 'ganhar' | 'reduzir'

export interface ProjecaoMeta {
  /** Peso atual e alvo em kg (alvo pode ser faixa) */
  peso: { atual: number; alvoMin: number; alvoMax: number }
  /** Percentual de gordura atual e alvo (alvo pode ser faixa) */
  gorduraPercent: { atual: number; alvoMin: number; alvoMax: number }
  /** Massa de gordura em kg (opcional) */
  massaGordura?: { atual: number; alvoMin: number; alvoMax: number }
  /** Estratégia pra massa muscular */
  massaMuscular: { atual: number; estrategia: EstrategiaMassa; alvo?: number }
  /** Idade corporal (bioimpedância) — atual e projetada */
  idadeCorporal?: { atual: number; alvoMin: number; alvoMax: number }
  /** Regiões priorizadas pra mudança visual */
  regioesPrioritarias: RegiaoCorporal[]
  /** Horizonte estimado em meses pra atingir a meta */
  prazoMeses?: number
}

/** Configuração do prompt enviado ao gerador de imagem (Nano Banana etc) */
export interface ProjecaoPromptConfig {
  /** Modelo de IA usado pra gerar a imagem */
  modelo: 'nano-banana' | string
  /** O que preservar das fotos originais */
  preservar: ('identidade' | 'proporcoes' | 'iluminacao' | 'fundo' | 'roupa' | 'pose' | 'enquadramento')[]
  /**
   * Disclaimer educativo embutido na resposta.
   * Lembre: nunca diagnóstico, sempre estimativa.
   */
  disclaimerEducativo: string
  /** Prompt textual base (gerado a partir de meta + regiões) — usado pelo backend */
  promptTexto?: string
}

export interface ProjecaoCorporal {
  status: ProjecaoStatus
  /** Imagens-base usadas (URLs das fotos atuais) */
  basePhotos?: SnapshotFotos
  /** Imagem(ns) gerada(s) — placeholder até implementação real */
  resultado?: SnapshotFotos
  /** Meta estruturada (input principal pro prompt da IA) */
  meta?: ProjecaoMeta
  /** Fallback textual da meta (display ou quando o usuário descreve livre) */
  metaTexto?: string
  /** Configuração do prompt da IA */
  prompt?: ProjecaoPromptConfig
  /** Mensagem de status */
  mensagem?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero da dashboard
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroSaude {
  scoreAtual: number
  /** Tendência de 7 dias */
  tendencia: 'melhorando' | 'estavel' | 'piorando'
  /** Microbenchmarks pra preview */
  microStatus: { dimensaoId: DimensionId; label: string; status: DimensionStatus }[]
  /** Última análise (pra mostrar "há 12 dias") */
  ultimaAnaliseEm: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Data shape principal
// ─────────────────────────────────────────────────────────────────────────────

export interface MinhaSaudeData {
  hero: HeroSaude
  /** Estado atual (não congelado) */
  estadoAtual: {
    scoreGeral: number
    dimensoes: DimensionScore[]
    /** ISO date — quando os dados foram coletados pela última vez */
    atualizadoEm: string
    /**
     * Idades atuais (real + corporal vêm do perfil/bioimpedância;
     * visualEstimada vem da última análise com fotos).
     * visualProjetada não aparece aqui — só em snapshot com meta definida.
     */
    idades?: SnapshotIdades
  }
  /** Snapshots armazenados (mais recente primeiro) */
  snapshots: Snapshot[]
  /** Status de elegibilidade pra nova análise */
  freshness: FreshnessGate
  /** Comparação ativa (snapshots default = primeiro vs último) */
  comparacaoDefault?: SnapshotDiff
  /** Séries temporais por dimensão (pra aba Evolução) */
  evolucao: EvolucaoSerie[]
  /** Estado da projeção corporal */
  projecao: ProjecaoCorporal
}

// ─────────────────────────────────────────────────────────────────────────────
// Props do componente
// ─────────────────────────────────────────────────────────────────────────────

export type MinhaSaudeAba = 'estado-atual' | 'analises' | 'evolucao' | 'comparar'

export interface MinhaSaudeProps {
  data: MinhaSaudeData
  abaInicial?: MinhaSaudeAba

  /** Toque numa dimensão pra ver detalhes */
  onDimensaoClick?: (id: DimensionId) => void

  /**
   * Gerar nova análise (só dispara se freshness.status === 'elegivel').
   * Recebe o escopo de consentimento aceito pelo usuário (analise_visual, projecao_ia, armazenamento, export_profissional).
   */
  onGerarAnalise?: (
    escopoConsentimento?: ('analise_visual' | 'projecao_ia' | 'armazenamento' | 'export_profissional')[],
  ) => void

  /** Ver detalhe de um snapshot */
  onSnapshotClick?: (id: string) => void

  /** Trocar snapshot inicial / final na aba Comparar */
  onTrocarSnapshotInicial?: () => void
  onTrocarSnapshotFinal?: () => void

  /** Solicitar projeção corporal IA */
  onGerarProjecao?: () => void

  /** Definir / editar meta usada na projeção */
  onEditarMeta?: () => void

  /** Adicionar dado faltante (link contextual pra outras sections) */
  onColetarDado?: (tipo: 'bioimpedancia' | 'exame' | 'fotos_corporais' | string) => void
}

