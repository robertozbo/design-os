export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type FormaPgto = 'pix' | 'cartao' | 'convenio' | 'dinheiro'
export type StatusCobranca = 'pago' | 'pendente' | 'estornado'
export type FiltroStatus = 'todos' | StatusCobranca

export interface KpiCobranca {
  id: string
  label: string
  valor: number
  /** Formata como número simples (contagem) em vez de moeda. */
  contagem?: boolean
  destaque?: boolean
}

export interface Cobranca {
  id: string
  pacienteNome: string
  pacienteIniciais: string
  medico: string
  especialidade: string
  cor: CorEspecialidade
  valor: number
  forma: FormaPgto
  status: StatusCobranca
  data: string
  convenio?: string
}

export interface CobrancaData {
  clinica: string
  kpis: KpiCobranca[]
  cobrancas: Cobranca[]
}
