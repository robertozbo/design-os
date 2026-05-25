export type SecaoId =
  | "perfil"
  | "agenda"
  | "plano"
  | "notificacoes"
  | "integracoes"
  | "dados";

export type PlanoTier = "free" | "plus" | "pro";

export type ModalidadeId = "presencial" | "online" | "hibrido";

export type DiaSemanaId =
  | "seg"
  | "ter"
  | "qua"
  | "qui"
  | "sex"
  | "sab"
  | "dom";

export type CanalNotificacao = "email" | "push" | "sms";

export interface PerfilProfissional {
  nome: string;
  email: string;
  telefone: string;
  cref: string;
  avatarUrl: string | null;
  bio: string;
  especialidades: string[];
  abordagens: string[];
  formacao: FormacaoItem[];
}

export interface FormacaoItem {
  id: string;
  curso: string;
  instituicao: string;
  ano: number;
}

export interface DisponibilidadeDia {
  dia: DiaSemanaId;
  ativo: boolean;
  inicioHora: string;
  fimHora: string;
}

export interface LocalAtendimento {
  id: string;
  nome: string;
  endereco: string;
  ativo: boolean;
}

export interface ValorSessao {
  id: string;
  tipo: "avulsa" | "mensal-3x" | "mensal-4x" | "mensal-5x" | "trimestral";
  label: string;
  centavos: number;
  unidade: string;
}

export interface AgendaConfig {
  modalidades: ModalidadeId[];
  disponibilidade: DisponibilidadeDia[];
  locais: LocalAtendimento[];
  valores: ValorSessao[];
}

export interface FeaturePlano {
  label: string;
  incluido: boolean;
}

export interface PlanoOption {
  tier: PlanoTier;
  nome: string;
  centavos: number;
  features: FeaturePlano[];
  destaque?: boolean;
}

export interface MetodoPagamento {
  id: string;
  tipo: "cartao" | "pix";
  rotulo: string;
  ultimosDigitos?: string;
  bandeira?: string;
  validade?: string;
  principal: boolean;
}

export type CobrancaStatus = "paga" | "pendente" | "falhou";

export interface Cobranca {
  id: string;
  data: string;
  centavos: number;
  status: CobrancaStatus;
  reciboUrl?: string;
  descricao: string;
}

export interface PlanoConfig {
  atual: PlanoTier;
  opcoes: PlanoOption[];
  proximaCobrancaData?: string;
  proximaCobrancaCentavos?: number;
  metodos: MetodoPagamento[];
  historico: Cobranca[];
}

export interface NotificacaoCategoria {
  id: string;
  label: string;
  descricao?: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface NotificacoesConfig {
  categorias: NotificacaoCategoria[];
}

export type IntegracaoStatus = "conectado" | "disponivel" | "em-breve";

export interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  status: IntegracaoStatus;
  iconKey: string;
  /** Se conectado, quando foi vinculado */
  conectadoEm?: string;
  /** Se disponível, requer plano Plus/Pro? */
  requerPlano?: PlanoTier;
}

export type Idioma = "pt-BR" | "en-US" | "es";
export type Tema = "light" | "dark" | "system";

export interface DadosConfig {
  idioma: Idioma;
  tema: Tema;
}

export interface ConfiguracoesData {
  perfil: PerfilProfissional;
  agenda: AgendaConfig;
  plano: PlanoConfig;
  notificacoes: NotificacoesConfig;
  integracoes: Integracao[];
  dados: DadosConfig;
}

export interface ConfiguracoesProps {
  data: ConfiguracoesData;
  selectedSecao: SecaoId;
  onSecaoChange?: (id: SecaoId) => void;
  onSavePerfil?: (perfil: PerfilProfissional) => void;
  onSaveAgenda?: (agenda: AgendaConfig) => void;
  onTrocarPlano?: (tier: PlanoTier) => void;
  onAddMetodoPagamento?: () => void;
  onRemoveMetodo?: (metodoId: string) => void;
  onMakeMetodoPrincipal?: (metodoId: string) => void;
  onToggleNotificacao?: (
    categoriaId: string,
    canal: CanalNotificacao,
    valor: boolean,
  ) => void;
  onConectarIntegracao?: (integracaoId: string) => void;
  onDesconectarIntegracao?: (integracaoId: string) => void;
  onChangeIdioma?: (id: Idioma) => void;
  onChangeTema?: (t: Tema) => void;
  onExportarDados?: () => void;
  onExcluirConta?: () => void;
  onUploadAvatar?: () => void;
}
