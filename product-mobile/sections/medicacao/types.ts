export type StatusDose = 'cumprido' | 'pendente' | 'futuro' | 'perdido'
export type StatusDia = 'cumprido' | 'parcial' | 'perdido' | 'hoje' | 'futuro'
export type DuracaoTratamento = 'continua' | 'periodo'

// ============================================================================
// GLP-1 / via de administração
// ============================================================================

export type ViaAdministracao = 'oral' | 'subcutanea'
export type Frequencia = 'diaria' | 'semanal' | 'mensal'

/**
 * Categoria do fármaco — usada pra ativar UI específica (curva PK, sítio de
 * aplicação, log de food noise, etc). `outros` é o default que mantém o
 * comportamento legado.
 */
export type CategoriaFarmaco = 'glp1_injetavel' | 'glp1_oral' | 'outros'

/**
 * Fármaco específico — usado pra parametrizar modelo PK (meia-vida, pico).
 */
export type FarmacoId =
  | 'semaglutide_sc' // Ozempic, Wegovy
  | 'tirzepatide_sc' // Mounjaro, Zepbound
  | 'liraglutide_sc' // Saxenda, Victoza
  | 'semaglutide_oral' // Rybelsus
  | 'orforglipron_oral' // Orforglipron
  | 'outro'

/**
 * Sítio de aplicação subcutâneo — 8 zonas rotacionáveis.
 */
export type SitioAplicacao =
  | 'abdome_sup_esq'
  | 'abdome_sup_dir'
  | 'abdome_inf_esq'
  | 'abdome_inf_dir'
  | 'coxa_esq'
  | 'coxa_dir'
  | 'braco_esq'
  | 'braco_dir'

export const SITIO_LABELS: Record<SitioAplicacao, string> = {
  abdome_sup_esq: 'Abdômen sup. esq.',
  abdome_sup_dir: 'Abdômen sup. dir.',
  abdome_inf_esq: 'Abdômen inf. esq.',
  abdome_inf_dir: 'Abdômen inf. dir.',
  coxa_esq: 'Coxa esquerda',
  coxa_dir: 'Coxa direita',
  braco_esq: 'Braço esquerdo',
  braco_dir: 'Braço direito',
}

// ============================================================================
// Doses existentes
// ============================================================================

export interface DoseMedicacao {
  id: string
  horario: string // "07:00"
  nome: string
  dose: string // "75mcg"
  status: StatusDose
  tempoRestante?: string // só pra futuro, ex: "em 4h"
}

export interface AdesaoSemana {
  /** Percentual 0–100 */
  percentual: number
  /** Status diário ordem seg→dom. */
  dias: StatusDia[]
}

export interface ResumoHoje {
  adesaoSemana: AdesaoSemana
  doses: DoseMedicacao[]
  /** Quando adesão últimos 7d <60%, banner amber aparece. */
  adesaoBaixa?: boolean
}

// ============================================================================
// Medicação ativa (estendida pra GLP-1)
// ============================================================================

export interface MedicacaoAtiva {
  id: string
  nome: string
  dose: string // "75mcg", "850mg", "0,25mg"
  posologia: string // "1x ao dia · 07h · em jejum"
  iniciadaEm: string // label curto ("12/fev") ou ISO
  /** "contínua" / "30 dias" / "3 meses" */
  duracaoLabel: string
  duracao: DuracaoTratamento
  /** Próxima dose (label curto; só relevante em medicação periódica/semanal). */
  proximaDoseLabel?: string
  adesao30d: number // 0-100
  /** Orientação extra do médico (ex: "tomar com bastante água"). */
  orientacao?: string | null
  memedId?: string // pra abrir receita
  /** ISO de quando a receita foi atualizada (pra mostrar badge "atualizado" <24h). */
  atualizadoEm?: string | null
  /**
   * FK para o médico que prescreveu. Opcional pra back-compat em sample
   * data legada; com vínculos múltiplos vira obrigatório.
   */
  medicoId?: string

  // --- GLP-1 / via de administração ---
  /** Categoria do fármaco. `outros` mantém comportamento legado. */
  categoria?: CategoriaFarmaco
  /** Via de administração. Default = `oral` quando ausente. */
  via?: ViaAdministracao
  /** Frequência canônica. Default = `diaria` quando ausente. */
  frequencia?: Frequencia
  /** Fármaco específico — parametriza modelo PK. */
  farmaco?: FarmacoId
}

// ============================================================================
// Histórico / receitas (inalterado)
// ============================================================================

export type TipoReceita = 'inicio' | 'ajuste' | 'renovacao' | 'descontinuacao'

export interface RegistroReceita {
  id: string
  data: string // "28/abr" ou ISO
  titulo: string // "Levotiroxina · ajuste de dose pra 75mcg"
  medicoNome: string // "Dr. Pedro"
  tipo: TipoReceita
  /** Motivo da prescrição/ajuste (read-only). */
  motivo?: string | null
  /** Posologia anterior (só pra ajuste). */
  posologiaAnterior?: string | null
  /** Posologia nova após ajuste/início. */
  posologiaNova?: string | null
  /** Pra abrir o documento Memed. */
  memedId?: string | null
}

export interface ReceitaRenovada {
  /** id da medicação renovada */
  medicacaoId: string
  /** "há 5min" / "há 2h" */
  haLabel: string
  nomeMed: string
}

export interface MedicoVinculado {
  /** Identificador estável — usado como FK em MedicacaoAtiva.medicoId. */
  id: string
  nome: string
  especialidade: string
  iniciais: string
}

// ============================================================================
// GLP-1: curva farmacocinética
// ============================================================================

/**
 * Status semáforo do nível estimado — comunicado em linguagem educativa,
 * não em unidades clínicas.
 */
export type StatusPK = 'no_pico' | 'subindo' | 'caindo' | 'vale'

export const STATUS_PK_LABEL: Record<StatusPK, string> = {
  no_pico: 'No pico',
  subindo: 'Subindo',
  caindo: 'Caindo',
  vale: 'Vale',
}

export interface PontoPK {
  /** ISO date */
  data: string
  /** Concentração relativa normalizada 0-1 (NÃO mg/dL). */
  nivel: number
  /** True quando o ponto é projeção futura (linha tracejada). */
  projetado?: boolean
}

export type PeriodoPK = '14D' | '30D' | '90D'

export interface CurvaPK {
  /** Pra qual medicação ativa essa curva pertence. */
  medicacaoId: string
  /** Série de pontos no período (já calculados pelo modelo). */
  pontos: PontoPK[]
  /** Nível estimado hoje (0-1) — duplicado pra UX rápida. */
  nivelHoje: number
  /** Status atual no ciclo. */
  statusHoje: StatusPK
  /** Próxima dose (ISO) — usado pra desenhar linha vertical "Hoje" + linha tracejada futura. */
  proximaDoseISO?: string
  /** Última dose (ISO) — referência da curva. */
  ultimaDoseISO?: string
}

// ============================================================================
// GLP-1: registro de injeção
// ============================================================================

export interface RegistroInjecao {
  id: string
  medicacaoId: string
  /** ISO completo da aplicação. */
  aplicadoEm: string
  /** Label curto pra UI ("ter 23/05 · 09:12"). */
  aplicadoEmLabel: string
  /** Sítio escolhido. */
  sitio: SitioAplicacao
  /** Dor 0-10. */
  dor: number
  /** Dose aplicada (snapshot — pode mudar via ajuste de receita depois). */
  doseLabel: string
}

// ============================================================================
// GLP-1: log de sintomas
// ============================================================================

/**
 * Sliders 0-10. `pensamentos_alimentares` é a métrica-âncora do GLP-1
 * (food noise reduction). Refluxo/diarreia/constipação ficam opcionais.
 */
export interface RegistroSintomas {
  id: string
  /** ISO do registro. */
  registradoEm: string
  /** Label curto ("há 2h"). */
  haLabel: string
  /** Dose à qual o registro se associa (vínculo automático por timestamp). */
  injecaoId?: string

  nausea: number // 0-10
  refluxo: number // 0-10
  pensamentosAlimentares: number // 0-10 (alta = food noise alta = ruim)
  fadiga: number // 0-10
  diarreia: number // 0-10
  constipacao: number // 0-10
  /** Outros sintomas em texto livre. */
  observacoes?: string | null
}

// ============================================================================
// Data root
// ============================================================================

export interface MedicacaoData {
  /**
   * Médicos vinculados ao paciente. V1 Nymos Clínico = 1 entrada (endo
   * single-doctor). Array prepara V2 (multi-especialidade). UI no header
   * adapta: 1 médico → texto direto; ≥2 médicos → chips com filtro.
   */
  medicosVinculados: MedicoVinculado[]
  resumoHoje: ResumoHoje | null
  medicacoesAtivas: MedicacaoAtiva[]
  historicoReceitas: RegistroReceita[]
  /** Banner de receita renovada recentemente (<24h). */
  receitaRenovada?: ReceitaRenovada | null

  // --- GLP-1 ---
  /** Curvas PK por medicação ativa que tem categoria glp1_*. */
  curvasPK?: CurvaPK[]
  /** Histórico de injeções (mais recentes primeiro). */
  injecoes?: RegistroInjecao[]
  /** Histórico de logs de sintomas (mais recentes primeiro). */
  sintomas?: RegistroSintomas[]
}

// ============================================================================
// Props
// ============================================================================

export interface MedicacaoProps {
  data: MedicacaoData
  onMarcarDose?: (doseId: string) => void
  onAdiarDose?: (doseId: string, minutos?: number) => void
  onAbrirReceitaMemed?: (medicacaoId: string) => void
  onAbrirDetalheReceita?: (receitaId: string) => void
  onVerHistoricoCompleto?: () => void
  onFalarComMedico?: (contexto?: { medicacaoId?: string; nome?: string }) => void
  onDispensarRenovada?: () => void

  // --- GLP-1 ---
  /** Abre fluxo RegistrarInjecao (paciente vai aplicar agora). */
  onAplicarDose?: (medicacaoId: string) => void
  /** Marca comprimido oral como tomado (Rybelsus/Orforglipron). */
  onMarcarComprimido?: (medicacaoId: string) => void
  /** Abre fluxo RegistrarSintomas. */
  onRegistrarSintomas?: (injecaoId?: string) => void
  /** Abre histórico completo de injeções pra uma medicação. */
  onVerHistoricoInjecoes?: (medicacaoId: string) => void
}
