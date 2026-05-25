export type SessaoTipo = "treino" | "avaliacao" | "primeira-consulta";

export type SessaoStatus = "agendada" | "confirmada" | "realizada" | "cancelada";

export type SessaoModalidade = "presencial" | "online";

export type CriterioRisco =
  | "adesao-baixa"
  | "sem-sessao"
  | "dor"
  | "reavaliacao-atrasada";

export type AtividadeTipo =
  | "sessao-completa"
  | "sessao-pulada"
  | "mensagem"
  | "indicacao-aceita"
  | "avaliacao-completa"
  | "comentario-dor";

export type AtalhoId = "nova-avaliacao" | "novo-treino" | "convidar-aluno" | "anotar";

export interface AlunoResumo {
  id: string;
  nome: string;
  avatarUrl: string | null;
}

export interface AgendaItem {
  id: string;
  hora: string;
  duracaoMin: number;
  aluno: AlunoResumo;
  tipo: SessaoTipo;
  treinoLetra?: string;
  treinoNome?: string;
  modalidade: SessaoModalidade;
  status: SessaoStatus;
  local?: string;
}

export interface AlunoRisco {
  alunoId: string;
  aluno: AlunoResumo;
  criterio: CriterioRisco;
  /** Texto curto explicando o risco (ex: "Adesão de 45% nas últimas 4 semanas") */
  motivo: string;
  /** Tempo desde quando (ex: "há 9 dias") */
  desde: string;
  severidade: "alta" | "media" | "baixa";
}

export interface ProximaReavaliacao {
  alunoId: string;
  aluno: AlunoResumo;
  ultimaAvaliacaoData: string;
  diasDesdeUltima: number;
  /** "Vence em X dias" se ainda não passou de 60 dias, ou "Atrasada Y dias" */
  status: "proxima" | "atrasada";
  diasParaOuDesdePrazo: number;
}

export interface KpiAlunosAtivos {
  atual: number;
  anterior: number;
  delta: number;
}

export interface KpiSessoes {
  realizadas: number;
  alvoMes: number;
  percentual: number;
}

export interface KpiMrr {
  /** Valor em centavos pra evitar problemas de float */
  centavosAtual: number;
  centavosAnterior: number;
  delta: number;
  moeda: string;
}

export interface KpiIndicacoes {
  aceitas: number;
  pendentes: number;
}

export interface Kpis {
  alunosAtivos: KpiAlunosAtivos;
  sessoes: KpiSessoes;
  mrr: KpiMrr;
  indicacoes: KpiIndicacoes;
}

export interface NotaDiario {
  id: string;
  texto: string;
  criadoEm: string;
  feita: boolean;
}

export interface AtividadeEvento {
  id: string;
  tipo: AtividadeTipo;
  aluno: AlunoResumo;
  /** Frase curta descrevendo o evento (ex: "concluiu Treino A · 45min · RPE 8") */
  descricao: string;
  timestamp: string;
}

export interface Greeting {
  /** Nome do personal (primeiro nome) */
  nome: string;
  /** Saudação contextual ("Bom dia" / "Boa tarde" / "Boa noite") */
  saudacao: string;
  /** Data formatada por extenso */
  dataFormatada: string;
  /** Data ISO pro relógio */
  dataISO: string;
}

export interface InicioProps {
  greeting: Greeting;
  kpis: Kpis;
  agenda: AgendaItem[];
  alunosRisco: AlunoRisco[];
  proximasReavaliacoes: ProximaReavaliacao[];
  atalhos: AtalhoId[];
  diario: NotaDiario[];
  atividadeRecente: AtividadeEvento[];

  /** Confirmar/marcar sessão como realizada do dashboard */
  onMarcarSessaoRealizada?: (sessaoId: string) => void;
  /** Cancelar sessão */
  onCancelarSessao?: (sessaoId: string) => void;
  /** Abrir detalhe da sessão / aluno */
  onOpenSessao?: (sessaoId: string) => void;
  /** Abrir ficha do aluno */
  onOpenAluno?: (alunoId: string) => void;
  /** Iniciar nova avaliação */
  onCreateAvaliacao?: () => void;
  /** Criar novo treino / aplicar template */
  onOpenTreinos?: () => void;
  /** Convidar aluno (gera link) */
  onConvidarAluno?: () => void;
  /** Anotar nova nota no diário */
  onAddNota?: (texto: string) => void;
  /** Toggle nota como feita */
  onToggleNota?: (notaId: string) => void;
  /** Excluir nota */
  onRemoveNota?: (notaId: string) => void;
  /** Ir pra Agenda completa */
  onOpenAgenda?: () => void;
  /** Ver atividade completa */
  onOpenAtividade?: () => void;
}
