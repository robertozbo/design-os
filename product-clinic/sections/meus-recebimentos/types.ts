export type CorAtuacao = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'

/**
 * O que o profissional já pode contar como dinheiro e o que ainda não.
 * - `liberado`: o paciente pagou; entra no próximo repasse
 * - `aguardando`: atendimento feito, pagamento em aberto; entra quando a clínica receber
 *
 * V1 é só particular. Convênio (e a glosa que vem junto) fica para depois.
 */
export type StatusLinha = 'liberado' | 'aguardando'

export type FiltroExtrato = 'todos' | StatusLinha

/** Qualquer profissional que atende por comissão — médico, nutricionista, fisioterapeuta, dentista. */
export interface ProfissionalRef {
  id: string
  nome: string
  iniciais: string
  /** Registro no conselho da categoria: CRM, CRN, CREFITO, CRO… */
  conselho: string
  atuacao: string
  cor: CorAtuacao
}

export interface Contrato {
  /** Regra de comissão em uma frase, como está no contrato. */
  regra: string
  /** Dia do mês em que a clínica paga o repasse. */
  diaPagamento: number
  prazoPagamento: string
}

export interface LinhaExtrato {
  id: string
  data: string
  dataLabel: string
  pacienteNome: string
  pacienteIniciais: string
  /** Tipo de atendimento — é ele que define o % do contrato. */
  servico: string
  valorBruto: number
  repassePct: number
  valorRepasse: number
  status: StatusLinha
  formaPagamento: string | null
  pagoEm: string | null
}

export interface Deducao {
  id: string
  label: string
  descricao: string
  valor: number
}

export interface PorServico {
  nome: string
  repassePct: number
  atendimentos: number
  valorRepasse: number
  liberado: number
  aguardando: number
  pct: number
}

export interface ResumoCompetencia {
  competencia: string
  aberta: boolean
  ateLabel: string
  atendimentos: number
  /** Dias úteis já trabalhados na competência — base do acumulado e da projeção. */
  diasUteisDecorridos: number
  diasUteisNoMes: number
  bruto: number
  comissao: number
  liberado: number
  aguardando: number
  deducoesTotal: number
  /** `liberado − deduções` — é o que cai na conta na data prevista. */
  liquidoPrevisto: number
  pagamentoPrevisto: string
}

export interface RepassePago {
  id: string
  competencia: string
  atendimentos: number
  bruto: number
  comissao: number
  deducoes: number
  liquido: number
  pagoEm: string
  recibo: string
}

export interface MeusRecebimentosData {
  clinica: string
  profissional: ProfissionalRef
  contrato: Contrato
  resumo: ResumoCompetencia
  porServico: PorServico[]
  deducoes: Deducao[]
  extrato: LinhaExtrato[]
  historico: RepassePago[]
}
