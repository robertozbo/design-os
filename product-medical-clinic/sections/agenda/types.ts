export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Modalidade = 'presencial' | 'tele'
export type StatusConsulta =
  | 'pendente'
  | 'confirmado'
  | 'realizado'
  | 'cancelado'
  | 'faltou'
export type VisaoAgenda = 'medicos' | 'salas'

export interface MedicoAgenda {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
}

export interface SalaAgenda {
  id: string
  nome: string
  local: string
}

/**
 * Serviço do cadastro da clínica (section Serviços) — **fonte única** do preço de tabela e da
 * duração padrão. A agenda não tem lista própria de procedimentos.
 */
export interface ServicoAgenda {
  id: string
  nome: string
  /** Preço de tabela, em reais (o que o particular paga). */
  preco: number
  /** Duração padrão em minutos — pré-seleciona o fim da consulta. */
  duracaoMin: number
  categoria: string
}

/** Convênio do paciente e o desconto que ele aplica sobre a tabela. */
export interface ConvenioAgenda {
  nome: string
  /** Percentual de desconto sobre o preço de tabela. `0` = particular (paga a tabela cheia). */
  desconto: number
}

/**
 * Como a consulta é cobrada — define o que `FinanceiroAgendamento.valor` significa:
 * - `sessao`: preço de **uma** consulta (pay-per-visit). Numa série, cada sessão vira uma conta.
 * - `mensal`: a **mensalidade**, independente de quantas sessões o mês tem.
 * - `pacote`: o **total fechado** da série ("10 sessões por R$ 2.000"), dividido em parcelas.
 */
export type ModeloCobranca = 'sessao' | 'mensal' | 'pacote'

/** Como a consulta se repete. `Não repetir` = ocorrência única. */
export type Recorrencia = 'Não repetir' | 'Semanal' | 'Quinzenal' | 'Mensal'

/**
 * Uma parcela a receber originada por um agendamento. A implementação deve criar
 * uma linha correspondente em **Contas a Receber** (`Conta` com `tipo: 'receber'`,
 * `contraparte` = paciente, `metodo` = `FinanceiroAgendamento.formaPagamento`).
 */
export interface ContaAgendamento {
  descricao: string
  /** Vencimento, "YYYY-MM-DD". */
  vencimento: string
  valor: number
  /** Quitada no ato (ex.: pagamento na recepção) → nasce como `pago`. */
  pago: boolean
}

/** Cobrança combinada no agendamento. Ausente = consulta sem cobrança. */
export interface FinanceiroAgendamento {
  /** Soma de `contas` — o que este agendamento cobra (não o valor de uma parcela). */
  valor: number
  formaPagamento: string
  modeloCobranca: ModeloCobranca
  parcelas: number
  /** As parcelas revisadas pelo usuário — o que deve virar Contas a Receber. */
  contas: ContaAgendamento[]
}

export interface Agendamento {
  id: string
  medicoId: string
  salaId: string
  pacienteNome: string
  pacienteIniciais: string
  especialidade: string
  cor: CorEspecialidade
  /** Dia da consulta, "YYYY-MM-DD". */
  data: string
  /** "HH:MM" 24h */
  inicio: string
  fim: string
  modalidade: Modalidade
  status: StatusConsulta
  observacao?: string
  /** Serviço do cadastro. Ausente = encaixe/bloqueio, sem preço de tabela e sem cobrança. */
  servicoId?: string
  /** Convênio usado no cálculo do preço (`Particular` = tabela cheia). */
  convenio?: string
  /**
   * Id da consulta que originou este retorno. Retorno agendado junto é **cortesia**:
   * nasce sem `financeiro`.
   */
  retornoDe?: string
  /**
   * Cobrança combinada. Numa série recorrente a distribuição depende do modelo:
   * **por sessão** cada ocorrência leva a conta que vence no seu dia (a receita acompanha o
   * atendimento); **mensal** e **pacote** cobram a série toda e ficam só na primeira ocorrência.
   */
  financeiro?: FinanceiroAgendamento
  /** Id da 1ª ocorrência, quando o agendamento nasceu de uma série recorrente. */
  serieId?: string
}

/** Paciente do pool compartilhado da clínica — para selecionar ao agendar. */
export interface PacienteAgenda {
  id: string
  nome: string
  iniciais: string
  idade: number
  convenio: string
}

export interface AgendaDia {
  /** Dia exibido, "YYYY-MM-DD". */
  data: string
  /** limites do grid, "HH:MM" */
  horaInicio: string
  horaFim: string
  medicos: MedicoAgenda[]
  salas: SalaAgenda[]
  /** Catálogo de serviços ativos — vem do cadastro (section Serviços). */
  servicos: ServicoAgenda[]
  /** Convênios aceitos e seus descontos. */
  convenios: ConvenioAgenda[]
  /** Pool de pacientes da clínica. */
  pacientes: PacienteAgenda[]
  /** Agendamentos do dia `data` — a view descarta os de outras datas. */
  agendamentos: Agendamento[]
}
