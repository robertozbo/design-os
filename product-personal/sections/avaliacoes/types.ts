export type TipoFiltroId = "todas" | "antropometria" | "funcional" | "completas";

export type PeriodoId = "30d" | "90d" | "ano" | "todas";

export type SortId = "recentes" | "antigas" | "por-aluno";

export type DetailTabId =
  | "antropometria"
  | "funcional"
  | "comparacao"
  | "fotos";

export type StatusAvaliacao = "rascunho" | "finalizada";

/** ===== Antropometria ===== */

export interface Circunferencias {
  cintura: number | null;
  quadril: number | null;
  braco: number | null;
  coxa: number | null;
  panturrilha: number | null;
  abdomen: number | null;
}

/** Dobras cutâneas (mm) — protocolo Pollock 7 dobras */
export interface Dobras {
  peitoral: number | null;
  axilarMedia: number | null;
  triciptal: number | null;
  subescapular: number | null;
  abdominal: number | null;
  suprailiaca: number | null;
  coxa: number | null;
  /** Calculado a partir das dobras (Jackson-Pollock 7-dobras) */
  percentualGorduraPollock: number | null;
}

export interface Bioimpedancia {
  pesoKg: number | null;
  percentualGordura: number | null;
  massaMagraKg: number | null;
  percentualAgua: number | null;
}

export interface Fotos {
  frontalUrl: string | null;
  lateralUrl: string | null;
  posteriorUrl: string | null;
}

export interface Antropometria {
  pesoKg: number | null;
  estaturaCm: number | null;
  imc: number | null;
  circunferencias: Circunferencias;
  dobras: Dobras;
  bioimpedancia: Bioimpedancia;
  fotos: Fotos;
}

/** ===== Funcional ===== */

/** 1RM submáximo (Brzycki) */
export interface RMTeste {
  pesoTesteKg: number;
  repsTeste: number;
  /** Calculado: peso × 36 / (37 - reps) */
  estimadoKg: number;
  formula: "brzycki" | "epley";
}

export interface OneRM {
  supino: RMTeste | null;
  squat: RMTeste | null;
  deadlift: RMTeste | null;
}

/** FMS — score 0-3 por sub-teste, total 0-21 */
export interface FMS {
  deepSquat: number;
  hurdleStep: number;
  inLineLunge: number;
  shoulderMobility: number;
  activeStraightLegRaise: number;
  trunkStabilityPushup: number;
  rotaryStability: number;
  totalScore: number;
}

export interface Flexibilidade {
  sitAndReachCm: number | null;
  shoulderMobilityCm: number | null;
  schoberCm: number | null;
}

export type CardioProtocolo = "cooper" | "astrand";

export interface Cardio {
  protocolo: CardioProtocolo;
  /** Cooper: distância em metros em 12min; Astrand: degraus/min */
  metricaPrincipal: number;
  vo2Estimado: number | null;
  fcMedia: number | null;
  fcRecuperacao: number | null;
}

export interface ResistenciaLocal {
  flexoesMax: number | null;
  abdominaisMin: number | null;
  pranchaTempoSegundos: number | null;
}

export interface Funcional {
  rm: OneRM;
  fms: FMS | null;
  flexibilidade: Flexibilidade | null;
  cardio: Cardio | null;
  resistenciaLocal: ResistenciaLocal | null;
}

/** ===== Avaliação ===== */

export interface AlunoResumo {
  id: string;
  nome: string;
  avatarUrl: string | null;
  /** Aluno também tem nutricionista no Nymos? */
  temNutri: boolean;
}

export interface DeltaMetrica {
  /** Nome da métrica para tooltip (ex: "Peso") */
  nome: string;
  /** Valor anterior */
  anterior: number;
  /** Valor atual */
  atual: number;
  /** Delta absoluto (atual - anterior) */
  delta: number;
  /** Sentido considerado positivo (ex: peso ↓ é positivo se objetivo é emagrecer; RM ↑ é sempre positivo) */
  positivoQuandoBaixa: boolean;
}

export interface Avaliacao {
  id: string;
  alunoId: string;
  aluno: AlunoResumo;
  data: string;
  status: StatusAvaliacao;
  observacoes: string;
  antropometria: Antropometria | null;
  funcional: Funcional | null;
  /** Já tá compartilhada com o nutri (se aluno tem) */
  compartilhadaComNutri: boolean;
  /** Delta calculado vs avaliação anterior do mesmo aluno (preenchido para listagem) */
  deltasResumo?: DeltaMetrica[];
}

export interface TipoOption {
  id: TipoFiltroId;
  label: string;
  count: number;
}

export interface PeriodoOption {
  id: PeriodoId;
  label: string;
}

export interface SortOption {
  id: SortId;
  label: string;
}

export interface AvaliacoesStats {
  total: number;
  antropometria: number;
  funcional: number;
  completas: number;
  alunosAvaliados: number;
}

export interface EmptyStates {
  noAvaliacoes: { title: string; description: string; primaryCta: string };
  noResults: { title: string; description: string; primaryCta: string };
}

export interface AlunoPicker {
  id: string;
  nome: string;
  avatarUrl: string | null;
  temNutri: boolean;
  ultimaAvaliacaoData?: string | null;
}

export type AvaliacaoTabId = "antropometria" | "funcional";

export interface NovaAvaliacaoData {
  alunoId: string;
  data: string;
  observacoes: string;
  antropometria: Antropometria | null;
  funcional: Funcional | null;
  compartilhadaComNutri: boolean;
  status: StatusAvaliacao;
}

export interface NovaAvaliacaoDrawerProps {
  open: boolean;
  alunos: AlunoPicker[];
  /** Pré-selecionar aluno (quando abre da ficha) */
  preSelectedAlunoId?: string;
  /** Modo edição — pré-popula com avaliação existente, troca títulos/CTAs */
  editing?: Avaliacao | null;
  onClose?: () => void;
  onSave?: (data: NovaAvaliacaoData) => void;
}

export interface AvaliacaoDetailProps {
  avaliacao: Avaliacao;
  /** Avaliações anteriores do mesmo aluno (pra comparação e fotos antes/depois) */
  outrasAvaliacoes: Avaliacao[];
  selectedTab: DetailTabId;
  /** ID da avaliação escolhida para comparar (na tab Comparação) */
  comparacaoId: string | null;
  onTabChange?: (id: DetailTabId) => void;
  onComparacaoChange?: (id: string | null) => void;
  onBack?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onCompare?: () => void;
  onExportPdf?: () => void;
  onDelete?: () => void;
  onToggleNutriShare?: () => void;
}

export interface AvaliacoesProps {
  avaliacoes: Avaliacao[];
  tipos: TipoOption[];
  selectedTipo: TipoFiltroId;
  periodos: PeriodoOption[];
  selectedPeriodo: PeriodoId;
  sortOptions: SortOption[];
  selectedSort: SortId;
  stats: AvaliacoesStats;
  emptyStates: EmptyStates;
  searchQuery?: string;

  /** Update search query */
  onSearchChange?: (q: string) => void;
  /** Switch tipo filter */
  onTipoChange?: (id: TipoFiltroId) => void;
  /** Switch periodo filter */
  onPeriodoChange?: (id: PeriodoId) => void;
  /** Change sort */
  onSortChange?: (id: SortId) => void;
  /** Open create-new drawer */
  onCreate?: () => void;
  /** Open detail page for an avaliação */
  onOpenDetail?: (avaliacaoId: string) => void;
  /** Open the comparison modal for an avaliação (preselects this one) */
  onCompare?: (avaliacaoId: string) => void;
  /** Edit avaliação */
  onEdit?: (avaliacaoId: string) => void;
  /** Duplicate avaliação as new (preencher com valores anteriores) */
  onDuplicate?: (avaliacaoId: string) => void;
  /** Export to PDF */
  onExportPdf?: (avaliacaoId: string) => void;
  /** Delete avaliação */
  onDelete?: (avaliacaoId: string) => void;
  /** Clear filters */
  onClearFilters?: () => void;
}
