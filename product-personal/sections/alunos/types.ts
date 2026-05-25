export type AlunoStatus = "em-plano" | "pausado" | "sem-plano" | "arquivado";

export type TabId =
  | "em-plano"
  | "pausados"
  | "sem-plano"
  | "em-risco"
  | "arquivados";

export type DetailTabId =
  | "visao-geral"
  | "treino"
  | "atividades"
  | "metricas"
  | "avaliacoes"
  | "mensagens";

export type MetricaTipo =
  | "peso"
  | "fcRepouso"
  | "hrv"
  | "sonoHoras"
  | "passos"
  | "energia";

export interface MetricaDiaria {
  data: string;
  peso?: number | null;
  fcRepouso?: number | null;
  hrv?: number | null;
  sonoHoras?: number | null;
  passos?: number | null;
  /** 1-5 (escala subjetiva) */
  energia?: number | null;
}

export type SessaoExecutadaStatus = "completa" | "parcial" | "pulada" | "agendada";

export interface SerieExecutadaShowcase {
  numero: number;
  repsReal?: number;
  tempoRealSegundos?: number;
  cargaRealKg: number | null;
  cargaPrescritaKg?: number | null;
  repsPrescrita?: number | null;
  rpePrescrito?: number | null;
  rpePercebido: number | null;
}

export interface ExercicioExecutadoShowcase {
  exercicioId: string;
  exercicioNome: string;
  series: SerieExecutadaShowcase[];
}

export interface SessaoExecutadaShowcase {
  id: string;
  data: string;
  treinoLetra: string;
  treinoNome: string;
  status: SessaoExecutadaStatus;
  duracaoMinutos: number | null;
  rpeMedio: number | null;
  comentarioAluno: string;
  exercicios: ExercicioExecutadoShowcase[];
}

export type Objetivo =
  | "hipertrofia"
  | "emagrecimento"
  | "performance"
  | "reabilitacao"
  | "geral";

export type ObjetivoFiltroId = Objetivo | "todos";

export type SortId = "nome-asc" | "recentes" | "adesao-desc" | "adesao-asc" | "ultima-sessao";

export type CriterioRisco =
  | "adesao-baixa"
  | "sem-sessao"
  | "dor"
  | "reavaliacao-atrasada";

export interface PlanoAtualResumo {
  id: string;
  nome: string;
  objetivo: Objetivo;
  inicioData: string;
  duracaoSemanas: number | null;
}

export interface AdesaoStats {
  percentual: number;
  sessoesFeitas: number;
  sessoesTotais: number;
  streak: number;
}

export interface ProximaSessao {
  data: string;
  treinoLetra?: string;
  treinoNome?: string;
}

export interface PlanoHistorico {
  id: string;
  nome: string;
  objetivo: Objetivo;
  inicioData: string;
  fimData: string;
  adesaoFinal: number;
  motivoTroca: string;
}

export interface AvaliacaoResumo {
  id: string;
  data: string;
  pesoKg: number | null;
  percentualGordura: number | null;
  fmsScore: number | null;
  rmSupino: number | null;
  rmSquat?: number | null;
  rmDeadlift?: number | null;
  massaMagraKg?: number | null;
}

export interface MetaPrincipal {
  titulo: string;
  /** Tom do badge — combina com o objetivo */
  tom: "hipertrofia" | "emagrecimento" | "performance" | "reabilitacao" | "geral";
  valorInicial: number;
  valorAtual: number;
  valorAlvo: number;
  unidade: string;
  /** Sentido da meta (ganho ou perda) */
  direcao: "ganhar" | "perder" | "atingir";
  /** Percentual já completado (0-100) */
  percentualAtingido: number;
  prazoData: string;
  diasRestantes: number;
}

export interface SemanaAdesao {
  semana: string;
  percentual: number;
}

export interface MensagemAluno {
  id: string;
  autor: "personal" | "aluno";
  texto: string;
  timestamp: string;
  lida?: boolean;
}

export interface AnotacaoPrivada {
  id: string;
  texto: string;
  criadoEm: string;
}

export interface AtividadeEvento {
  id: string;
  tipo:
    | "sessao-completa"
    | "sessao-pulada"
    | "mensagem"
    | "avaliacao-completa"
    | "comentario-dor";
  descricao: string;
  timestamp: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatarUrl: string | null;
  status: AlunoStatus;
  objetivo: Objetivo;
  inicioVinculoData: string;
  vinculadoApp: boolean;
  temNutri: boolean;
  ultimaSessaoData: string | null;
  ultimaAvaliacaoData: string | null;
  mensagensNaoLidas: number;
  observacoesIniciais: string;
  riscos: CriterioRisco[];
  alertasMotivos: string[];
  /** Apenas se status !== 'sem-plano' && !== 'arquivado' */
  planoAtual?: PlanoAtualResumo;
  /** Apenas se em plano */
  adesao?: AdesaoStats;
  proximaSessao?: ProximaSessao;
  /** Apenas se arquivado */
  arquivadoEm?: string;
  motivoArquivo?: string;
  /** Apenas se pausado */
  pausadoEm?: string;
  motivoPausa?: string;

  /** ===== Detail-only blocks (preenchidos para showcase aluno na ficha) ===== */
  planosAnteriores?: PlanoHistorico[];
  avaliacoes?: AvaliacaoResumo[];
  historicoSemanas?: SemanaAdesao[];
  mensagens?: MensagemAluno[];
  anotacoesPrivadas?: AnotacaoPrivada[];
  atividadeRecente?: AtividadeEvento[];
  /** Meta principal do aluno (para Visão geral) */
  metaPrincipal?: MetaPrincipal;
  /** Próxima avaliação prevista (alvo: cada 60d) */
  proximaAvaliacaoData?: string;
  /** Plano de assinatura do personal — pra mostrar Análise IA gating */
  planoPersonal?: "free" | "plus" | "pro";
  /** Sessões executadas — preenchido para showcase na aba Atividades */
  sessoesExecutadas?: SessaoExecutadaShowcase[];
  /** Métricas diárias do app (peso, FC, HRV, sono, passos) — para aba Métricas */
  metricasDiarias?: MetricaDiaria[];
}

export interface TabOption {
  id: TabId;
  label: string;
  count: number;
}

export interface ObjetivoOption {
  id: ObjetivoFiltroId;
  label: string;
  count: number;
}

export interface SortOption {
  id: SortId;
  label: string;
}

export interface AlunosKpis {
  totalAtivo: number;
  emPlano: number;
  emRisco: number;
  novosNoMes: number;
  deltaNovosMes: number;
}

export interface EmptyStates {
  emPlano: { title: string; description: string };
  pausados: { title: string; description: string };
  semPlano: { title: string; description: string; primaryCta: string };
  emRisco: { title: string; description: string };
  arquivados: { title: string; description: string };
  noResults: { title: string; description: string };
}

export interface AlunosProps {
  alunos: Aluno[];
  tabs: TabOption[];
  selectedTab: TabId;
  objetivos: ObjetivoOption[];
  selectedObjetivo: ObjetivoFiltroId;
  sortOptions: SortOption[];
  selectedSort: SortId;
  kpis: AlunosKpis;
  emptyStates: EmptyStates;
  searchQuery?: string;

  /** Switch tab */
  onTabChange?: (id: TabId) => void;
  /** Update search */
  onSearchChange?: (q: string) => void;
  /** Filter by objetivo */
  onObjetivoChange?: (id: ObjetivoFiltroId) => void;
  /** Change sort */
  onSortChange?: (id: SortId) => void;
  /** Open new aluno drawer */
  onCreate?: () => void;
  /** Open ficha do aluno */
  onOpenFicha?: (alunoId: string) => void;
  /** Quick message */
  onMessage?: (alunoId: string) => void;
  /** Quick: aplicar template */
  onApplyTemplate?: (alunoId: string) => void;
  /** Quick: nova avaliação */
  onNovaAvaliacao?: (alunoId: string) => void;
  /** Pausar plano */
  onPausar?: (alunoId: string) => void;
  /** Despausar */
  onDespausar?: (alunoId: string) => void;
  /** Arquivar */
  onArquivar?: (alunoId: string) => void;
  /** Restaurar arquivado */
  onRestaurar?: (alunoId: string) => void;
  /** Convidar pelo app */
  onConvidarApp?: (alunoId: string) => void;
  /** Clear filters */
  onClearFilters?: () => void;
}

/** ===== Ficha (detail) Props ===== */

export interface NovoAlunoData {
  nome: string;
  email: string;
  telefone: string;
  objetivo?: Objetivo;
  observacoes?: string;
  enviarConvite: boolean;
}

export interface NovoAlunoDrawerProps {
  open: boolean;
  objetivos: { id: Objetivo; label: string }[];
  onClose?: () => void;
  onSave?: (data: NovoAlunoData) => void;
}

export interface AlunoFichaProps {
  aluno: Aluno;
  selectedTab: DetailTabId;
  onTabChange?: (id: DetailTabId) => void;
  onBack?: () => void;
  onMessage?: () => void;
  onApplyTemplate?: () => void;
  onNovaAvaliacao?: () => void;
  onPausar?: () => void;
  onArquivar?: () => void;
  onSendMessage?: (texto: string) => void;
  onAddNotaPrivada?: (texto: string) => void;
  onRemoveNotaPrivada?: (notaId: string) => void;
  onOpenAvaliacao?: (id: string) => void;
  onEditAvaliacao?: (id: string) => void;
}
