export type ConviteStatus = "pendente" | "aceito" | "expirado" | "cancelado";

export type ConviteCanal = "link" | "qr" | "email" | "sms-whatsapp";

export type CanalFiltroId = ConviteCanal | "todos";

export type TabId = "pendentes" | "aceitos" | "expirados" | "cancelados";

export type SortId = "recentes" | "antigos" | "expira-em-breve" | "status";

export interface AlunoResumo {
  id: string;
  nome: string;
  avatarUrl: string | null;
}

export interface Convite {
  id: string;
  /** Snapshot do nome no momento do envio */
  nome: string;
  /** Email ou telefone (snapshot) */
  contato: string;
  canal: ConviteCanal;
  status: ConviteStatus;
  /** Mensagem personalizada do personal */
  mensagem: string;
  /** Link único gerado (apenas se canal === 'link') */
  linkUnico?: string;
  enviadoEm: string;
  /** ISO date — se aceito */
  aceitoEm?: string;
  /** Tempo até aceitar (dias) — se aceito */
  diasAteAceitar?: number;
  /** ISO date de expiração */
  expiraEm: string;
  /** Se cancelado, quando */
  canceladoEm?: string;
  /** Motivo opcional do cancelamento */
  motivoCancelamento?: string;
  /** Se aceito, referência ao aluno na carteira */
  alunoId?: string;
  /** Avatar opcional (snapshot ou do aluno se vinculado) */
  alunoAvatarUrl?: string | null;
}

export interface IndicacoesKpis {
  totalEnviados: number;
  aceitosNoMes: number;
  deltaAceitosMes: number;
  taxaConversaoPercentual: number;
  tempoMedioAceiteDias: number;
}

export interface TabOption {
  id: TabId;
  label: string;
  count: number;
}

export interface CanalOption {
  id: CanalFiltroId;
  label: string;
  count: number;
}

export interface SortOption {
  id: SortId;
  label: string;
}

export interface EmptyStates {
  pendentes: { title: string; description: string; primaryCta: string };
  aceitos: { title: string; description: string };
  expirados: { title: string; description: string };
  cancelados: { title: string; description: string };
  noResults: { title: string; description: string; primaryCta: string };
}

export interface AlunoSemApp {
  id: string;
  nome: string;
  avatarUrl: string | null;
  email: string;
  telefone: string;
}

export interface NovoConviteData {
  alunoId: string;
  canal: ConviteCanal;
  mensagem: string;
}

export interface IndicacoesProps {
  convites: Convite[];
  kpis: IndicacoesKpis;
  tabs: TabOption[];
  selectedTab: TabId;
  canais: CanalOption[];
  selectedCanal: CanalFiltroId;
  sortOptions: SortOption[];
  selectedSort: SortId;
  emptyStates: EmptyStates;
  /** Alunos cadastrados sem app vinculado (pra modal de novo convite) */
  alunosSemApp: AlunoSemApp[];
  /** Plano atual do personal (pra mostrar banner de upgrade se Free) */
  planoPersonal: "free" | "plus" | "pro";
  searchQuery?: string;

  /** Switch tab */
  onTabChange?: (id: TabId) => void;
  /** Update search */
  onSearchChange?: (q: string) => void;
  /** Filter by canal */
  onCanalChange?: (id: CanalFiltroId) => void;
  /** Change sort */
  onSortChange?: (id: SortId) => void;
  /** Open new convite drawer */
  onCreate?: () => void;
  /** Reenviar convite */
  onReenviar?: (conviteId: string) => void;
  /** Copiar link */
  onCopiarLink?: (conviteId: string) => void;
  /** Mostrar QR code */
  onMostrarQR?: (conviteId: string) => void;
  /** Cancelar convite pendente */
  onCancelar?: (conviteId: string) => void;
  /** Excluir (expirado ou cancelado) */
  onExcluir?: (conviteId: string) => void;
  /** Restaurar (cancelado → novo) */
  onRestaurar?: (conviteId: string) => void;
  /** Abrir ficha do aluno (apenas se aceito) */
  onOpenFichaAluno?: (alunoId: string) => void;
  /** Salvar novo convite */
  onSaveNovoConvite?: (data: NovoConviteData) => void;
  /** Upgrade plano */
  onUpgrade?: () => void;
  /** Clear filters */
  onClearFilters?: () => void;
}
