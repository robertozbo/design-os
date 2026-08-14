export type StatusCanal = 'conectado' | 'mock' | 'desconectado'
export type TipoPasso = 'botoes' | 'lista' | 'final'
export type StatusPreAgendamento = 'pendente' | 'confirmado' | 'recusado'
export type SeveridadeRegra = 'urgencia' | 'clinico' | 'administrativo'

/** Uma opção clicável dentro de um passo do chat. */
export interface OpcaoPasso {
  id: string
  rotulo: string
  /** Linha secundária — só aparece quando o passo é `lista`. */
  descricao?: string
  /** Id do passo para onde a escolha leva. */
  proximo: string
}

/** Um passo do fluxo determinístico do bot. */
export interface Passo {
  id: string
  /** Bolhas que o bot envia ao entrar neste passo, na ordem. */
  bot: string[]
  tipo: TipoPasso
  /** Cabeçalho do painel quando `tipo === 'lista'`. */
  titulo?: string
  opcoes: OpcaoPasso[]
  /** Restrição do WhatsApp exibida no rodapé (ex.: "3 botões", "até 10 linhas"). */
  limite?: string
}

export interface ServicoExposto {
  id: string
  nome: string
  /** Duração em minutos, vinda do cadastro de Serviços. */
  duracaoMin: number
  /** Preço de tabela em R$. */
  preco: number
  /** Se aparece na lista do bot. */
  exposto: boolean
}

export interface ProfissionalBot {
  id: string
  nome: string
  especialidade: string
  /** Ids dos serviços que este profissional atende. */
  servicos: string[]
}

export interface ConfigBot {
  saudacao: string
  /** Horas mínimas entre agora e o horário oferecido. */
  antecedenciaMinHoras: number
  /** Quantos dias à frente o bot pode oferecer. */
  janelaMaxDias: number
  horarioAtendimento: { inicio: string; fim: string }
  /** Mensagem enviada fora do horário de atendimento. */
  mensagemAusencia: string
  /** Sempre `true` — o bot nunca confirma sozinho. Travado na UI. */
  criaComoPendente: boolean
  /** Sempre `false` — a etapa Financeiro é da recepção. Travado na UI. */
  geraCobranca: boolean
  /** V2 — desabilitado no protótipo. */
  iaHabilitada: boolean
}

export interface PreAgendamento {
  id: string
  paciente: string
  telefone: string
  servico: string
  profissional: string
  /** Data por extenso em pt-BR (ex.: "ter, 19 ago"). */
  data: string
  hora: string
  /** Tempo relativo desde que o bot criou (ex.: "há 12 min"). */
  criadoEm: string
  status: StatusPreAgendamento
  /** Telefone não estava no pool — cadastro nasceu na conversa. */
  novoPaciente: boolean
}

/** Telefone não reconhecido: o bot coleta o básico e para. */
export interface Lead {
  id: string
  nome: string
  telefone: string
  nascimento: string
  /** O que a pessoa pediu antes de o bot travar. */
  pedido: string
  recebidoEm: string
}

/** O que o bot se recusa a responder e o que faz no lugar. */
export interface RegraEscalonamento {
  id: string
  gatilho: string
  acao: string
  /** Mensagem real que o paciente recebe. */
  exemplo: string
  severidade: SeveridadeRegra
}

/** Um dos três usos de IA previstos para a V2. */
export interface UsoIa {
  id: string
  titulo: string
  descricao: string
}

export interface AgendamentoWhatsappData {
  clinica: string
  telefoneClinica: string
  statusCanal: StatusCanal
  config: ConfigBot
  servicos: ServicoExposto[]
  profissionais: ProfissionalBot[]
  /** Máquina de estados do chat. `passoInicial` aponta a entrada. */
  passoInicial: string
  passos: Passo[]
  preAgendamentos: PreAgendamento[]
  leads: Lead[]
  regras: RegraEscalonamento[]
  usosIa: UsoIa[]
  /** Perguntas do ramo "Dúvidas" — texto administrativo, nunca clínico. */
  faq: { id: string; pergunta: string; resposta: string }[]
}

export interface AgendamentoWhatsappProps {
  data: AgendamentoWhatsappData
  /** Avança o simulador para o passo escolhido. */
  onEscolherOpcao?: (passoId: string, opcaoId: string) => void
  /** Volta o simulador ao passo inicial. */
  onReiniciarSimulacao?: () => void
  /** Salva o bloco de configuração (mock). */
  onSalvarConfig?: (config: ConfigBot) => void
  /** Liga/desliga um serviço na lista que o bot oferece. */
  onAlternarServicoExposto?: (servicoId: string) => void
  /** Transforma o pré-agendamento em consulta confirmada na Agenda. */
  onConfirmarPreAgendamento?: (id: string) => void
  /** Recusa o pré-agendamento com um motivo curto. */
  onRecusarPreAgendamento?: (id: string, motivo: string) => void
  /** Abre o cadastro do lead no pool de pacientes (mock). */
  onCadastrarLead?: (id: string) => void
}
