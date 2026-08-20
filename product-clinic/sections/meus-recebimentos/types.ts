export type CorAtuacao = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'

/**
 * O que o profissional já pode contar como dinheiro e o que ainda não.
 * - `liberado`: a clínica recebeu; entra no próximo repasse
 * - `aguardando`: a clínica ainda não recebeu (convênio em análise ou paciente em aberto)
 * - `glosado`: o convênio negou; **não vira comissão**
 */
export type StatusLinha = 'liberado' | 'aguardando' | 'glosado'

export type OrigemEspera = 'convenio' | 'paciente'

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
  prazoConvenio: string
}

export interface LinhaExtrato {
  id: string
  data: string
  dataLabel: string
  pacienteNome: string
  pacienteIniciais: string
  servico: string
  /** 'Particular' ou o nome do convênio. */
  fonte: string
  valorBruto: number
  repassePct: number
  valorRepasse: number
  status: StatusLinha
  origemEspera: OrigemEspera | null
  previsaoLabel: string | null
  motivoGlosa: string | null
}

export interface Deducao {
  id: string
  label: string
  descricao: string
  valor: number
}

export interface PorFonte {
  nome: string
  atendimentos: number
  valorRepasse: number
  liberado: number
  aguardando: number
  glosado: number
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
  glosado: number
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
  porFonte: PorFonte[]
  deducoes: Deducao[]
  extrato: LinhaExtrato[]
  historico: RepassePago[]
}
