export type StatusCanal = 'conectado' | 'mock' | 'desconectado'
/** `entrada` = o paciente digita (nome, nascimento); os demais são menu fechado. */
export type TipoPasso = 'botoes' | 'lista' | 'entrada' | 'final'
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
  /** Só em `entrada`: texto do campo de digitar enquanto vazio. */
  placeholder?: string
  /** Só em `entrada`: para onde vai depois que o paciente envia o texto. */
  proximo?: string
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

/** Um bloco já tomado na agenda de um médico. */
export interface BlocoOcupado {
  medicoId: string
  inicio: string
  fim: string
}

/**
 * A agenda real do dia. É daqui que saem os horários oferecidos — o bot não tem lista própria.
 * Espelha a section Agenda: mesmos `medicoId`, mesmos blocos.
 */
export interface AgendaDoDia {
  /** ISO (`2026-07-21`). */
  data: string
  /** Rótulo pt-BR usado no chat (`ter, 21 jul`). */
  rotuloData: string
  horaInicio: string
  horaFim: string
  ocupados: BlocoOcupado[]
}

/** Um vão livre calculado: horário + de quem é. */
export interface HorarioLivre {
  hora: string
  medicoId: string
  medicoNome: string
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
}

/**
 * Telefone não reconhecido. Aqui o bot **para**: coleta nome e nascimento e encerra, sem oferecer
 * horário. Quem não está no pool não sai da conversa com consulta marcada — a Agenda não aceita
 * nome livre, e sem cadastro não há convênio para calcular o valor.
 */
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
  agendaDoDia: AgendaDoDia
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
  /** O paciente digitou e enviou texto livre num passo `entrada`. */
  onEnviarTexto?: (passoId: string, texto: string) => void
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
