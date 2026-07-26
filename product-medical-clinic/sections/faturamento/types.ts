export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type FormaPgto = 'pix' | 'cartao' | 'convenio' | 'dinheiro'
export type StatusCobranca = 'pago' | 'pendente' | 'estornado'
export type FiltroStatus = 'todos' | StatusCobranca
export type Periodo = 'mes' | 'trimestre'

export interface KpiFin {
  id: string
  label: string
  valor: number
  destaque?: boolean
}

export interface RepasseMedico {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  atendimentos: number
  receitaBruta: number
  repassePct: number
  repasseValor: number
  liquidoClinica: number
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

export interface PorConvenio {
  nome: string
  valor: number
  pct: number
}

export interface FaturamentoData {
  clinica: string
  periodo: Periodo
  kpis: KpiFin[]
  repasses: RepasseMedico[]
  cobrancas: Cobranca[]
  porConvenio: PorConvenio[]
}
