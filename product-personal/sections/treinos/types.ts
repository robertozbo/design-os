export type PlanoStatus = "template" | "atribuido" | "arquivado";

export type Objetivo =
  | "hipertrofia"
  | "emagrecimento"
  | "performance"
  | "reabilitacao"
  | "geral";

export type ObjetivoFiltroId = Objetivo | "todos";

export type TabId = "templates" | "atribuidos" | "arquivados";

export type DiaSemanaId =
  | "seg"
  | "ter"
  | "qua"
  | "qui"
  | "sex"
  | "sab"
  | "dom";

export type DuracaoId = "4" | "8" | "12" | "indeterminado";

export type ModoSerie = "reps" | "tempo";

export type SessaoStatus = "completa" | "parcial" | "pulada" | "agendada";

export interface SeriePrescricao {
  numero: number;
  modo: ModoSerie;
  reps?: number;
  tempoSegundos?: number;
  cargaKg: number | null;
  rpeAlvo: number | null;
}

export interface ExercicioPrescrito {
  exercicioId: string;
  exercicioNome: string;
  grupoMuscular: string;
  thumbUrl: string | null;
  series: SeriePrescricao[];
  descansoSegundos: number;
  observacoes: string;
}

export interface Treino {
  id: string;
  letra: string;
  nome: string;
  exercicios: ExercicioPrescrito[];
}

export interface AgendaSemanal {
  seg: string | null;
  ter: string | null;
  qua: string | null;
  qui: string | null;
  sex: string | null;
  sab: string | null;
  dom: string | null;
}

export interface AlunoResumo {
  id: string;
  nome: string;
  avatarUrl: string | null;
}

export interface AdesaoStats {
  percentual: number;
  streak: number;
  sessoesFeitas: number;
  sessoesTotais: number;
  rpeMedio: number | null;
}

export interface SerieExecutada {
  numero: number;
  repsReal?: number;
  tempoRealSegundos?: number;
  cargaRealKg: number | null;
  rpePercebido: number | null;
}

export interface ExercicioExecutado {
  exercicioId: string;
  exercicioNome: string;
  series: SerieExecutada[];
}

export interface SessaoExecutada {
  id: string;
  data: string;
  treinoLetra: string;
  treinoNome: string;
  status: SessaoStatus;
  duracaoMinutos: number | null;
  rpeMedio: number | null;
  comentarioAluno: string;
  exercicios: ExercicioExecutado[];
}

export interface Plano {
  id: string;
  nome: string;
  objetivo: Objetivo;
  descricao: string;
  status: PlanoStatus;
  treinos: Treino[];
  agendaPadrao: AgendaSemanal;
  duracaoPadrao: DuracaoId;
  permitirAjusteCarga: boolean;

  /** Atribuição (apenas quando status === "atribuido") */
  aluno?: AlunoResumo;
  dataInicio?: string;
  duracaoSemanas?: number;
  proximaSessao?: {
    data: string;
    treinoLetra: string;
    treinoNome: string;
  };
  adesao?: AdesaoStats;
  alertas?: string[];

  /** Apenas para templates */
  aplicadoEmAlunosCount?: number;

  /** Apenas para arquivados */
  arquivadoEm?: string;

  /** Histórico semanal de adesão (atribuídos) — para gráfico de Visão geral */
  historicoSemanas?: SemanaAdesao[];

  /** Sessões executadas pelo aluno (atribuídos) — para Sessões e Comparação */
  sessoesExecutadas?: SessaoExecutada[];
}

export interface SemanaAdesao {
  semana: string;
  inicioISO: string;
  percentual: number;
  feitas: number;
  totais: number;
}

export type DetailTabId = "visao-geral" | "sessoes" | "treinos" | "comparacao";

export interface ExercicioBiblio {
  id: string;
  name: string;
  source: "curated" | "custom";
  primaryMuscle: string;
  muscleGroup: string;
  equipment: string;
  movementPattern: string;
  difficulty: number;
  averageTimeSeconds: number;
  gifUrl: string | null;
  fallbackImageUrl: string | null;
}

export type BuilderStepId = "identificacao" | "treinos" | "exercicios" | "config";

export interface NovoPlanoData {
  nome: string;
  objetivo: Objetivo;
  descricao: string;
  treinos: Treino[];
  agendaPadrao: AgendaSemanal;
  duracaoPadrao: DuracaoId;
  permitirAjusteCarga: boolean;
}

export interface NovoPlanoBuilderProps {
  open: boolean;
  exercicios: ExercicioBiblio[];
  onClose?: () => void;
  onSave?: (data: NovoPlanoData, asDraft: boolean) => void;
}

export interface AlunoOption {
  id: string;
  nome: string;
  avatarUrl: string | null;
  /** Aluno já tem plano ativo? Mostra aviso no modal */
  hasPlanoAtivo: boolean;
  planoAtivoNome?: string;
  ultimaAtividade?: string;
}

export interface AplicarEmAlunoData {
  templateId: string;
  alunoId: string;
  dataInicio: string;
  agenda: AgendaSemanal;
  duracao: DuracaoId;
  permitirAjusteCarga: boolean;
}

export interface AplicarEmAlunoModalProps {
  open: boolean;
  /** Template fixo (modo: entrar de Treinos com template já escolhido) */
  template?: Plano | null;
  /** Lista de templates disponíveis (modo: entrar do aluno e escolher template aqui) */
  templates?: Plano[];
  /** Lista de alunos sem plano (modo: template fixo, escolher aluno) */
  alunosDisponiveis?: AlunoOption[];
  /** Aluno fixo (modo: entrar do aluno) */
  preSelectedAlunoId?: string;
  /** Snapshot do aluno fixo pra exibir (quando vem da ficha) */
  alunoFixo?: AlunoOption;
  onClose?: () => void;
  onConfirm?: (data: AplicarEmAlunoData) => void;
}

export interface PlanoAtribuidoDetailProps {
  plano: Plano;
  selectedTab: DetailTabId;
  onTabChange?: (id: DetailTabId) => void;
  onBack?: () => void;
  onAdjustPlano?: () => void;
  onMessageAluno?: () => void;
  onArchive?: () => void;
  /** Save current assigned plan as a new template (strips aluno-specific data). */
  onSaveAsTemplate?: () => void;
  onOpenSessao?: (sessaoId: string) => void;
}

export interface ObjetivoOption {
  id: ObjetivoFiltroId;
  label: string;
  count: number;
}

export interface TabOption {
  id: TabId;
  label: string;
  count: number;
}

export interface DuracaoOption {
  id: DuracaoId;
  label: string;
}

export interface EmptyStates {
  templates: { title: string; description: string; primaryCta: string };
  atribuidos: { title: string; description: string; primaryCta: string };
  arquivados: { title: string; description: string };
  noResults: { title: string; description: string; primaryCta: string };
}

export interface TreinosProps {
  planos: Plano[];
  tabs: TabOption[];
  selectedTab: TabId;
  objetivos: ObjetivoOption[];
  selectedObjetivo: ObjetivoFiltroId;
  duracoes: DuracaoOption[];
  emptyStates: EmptyStates;
  searchQuery?: string;

  /** Switch active tab (templates/atribuidos/arquivados) */
  onTabChange?: (id: TabId) => void;
  /** Update search query */
  onSearchChange?: (q: string) => void;
  /** Filter by objective */
  onObjetivoChange?: (id: ObjetivoFiltroId) => void;
  /** Open create plan builder */
  onCreate?: () => void;
  /** Open detail page for a plan */
  onOpenDetail?: (planoId: string) => void;
  /** Open the apply-to-student modal for a template */
  onApplyToAluno?: (templateId: string) => void;
  /** Open builder in edit mode for a plan */
  onEdit?: (planoId: string) => void;
  /** Duplicate a plan into a new template */
  onDuplicate?: (planoId: string) => void;
  /** Archive a plan (template or assigned) */
  onArchive?: (planoId: string) => void;
  /** Restore an archived plan */
  onUnarchive?: (planoId: string) => void;
  /** Open chat with the assigned aluno */
  onMessageAluno?: (alunoId: string) => void;
  /** Save an assigned plan as a new template (strips aluno-specific data) */
  onSaveAsTemplate?: (planoId: string) => void;
  /** Clear active filters */
  onClearFilters?: () => void;
}
