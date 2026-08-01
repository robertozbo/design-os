export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Periodo = 'mes' | 'trimestre'

export interface KpiRelatorio {
  id: string
  label: string
  /** Valor já formatado (ex.: "1.240", "6,2%", "R$ 84.600"). */
  valor: string
  destaque?: boolean
}

export interface ProducaoMedico {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  atendimentos: number
  teleconsultas: number
  noShows: number
  receita: number
}

export interface OcupacaoSala {
  id: string
  nome: string
  /** 0-100 */
  pct: number
}

export interface ReceitaEspecialidade {
  especialidade: string
  cor: CorEspecialidade
  valor: number
  /** 0-100 */
  pct: number
}

export interface NoShowMedico {
  id: string
  nome: string
  cor: CorEspecialidade
  quantidade: number
  /** 0-100 */
  taxa: number
}

export interface ResumoFinanceiro {
  receita: number
  despesa: number
  /** receita − despesa. */
  resultado: number
  /** margem em % (resultado/receita). */
  margem: number
  aReceber: number
  recebido: number
  aPagar: number
  pago: number
}

export interface ReceitaPorTipo {
  tipo: string
  valor: number
  /** 0-100 */
  pct: number
}

export interface DespesaComportamento {
  fixa: number
  variavel: number
}

export interface DespesaPorGrupo {
  grupo: string
  valor: number
  /** 0-100 */
  pct: number
  comportamento: 'fixa' | 'variavel'
}

export interface RelatoriosData {
  clinica: string
  periodo: Periodo
  kpis: KpiRelatorio[]
  producao: ProducaoMedico[]
  salas: OcupacaoSala[]
  porEspecialidade: ReceitaEspecialidade[]
  noShow: NoShowMedico[]
  financeiro: ResumoFinanceiro
  receitaPorTipo: ReceitaPorTipo[]
  despesaComportamento: DespesaComportamento
  despesaPorGrupo: DespesaPorGrupo[]
}
