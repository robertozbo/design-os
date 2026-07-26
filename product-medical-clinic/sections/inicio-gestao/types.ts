export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Periodo = 'hoje' | 'semana' | 'mes'
export type TendenciaDelta = 'up' | 'down' | 'flat'

export interface Kpi {
  id: string
  label: string
  valor: string
  delta: string
  tendencia: TendenciaDelta
  /** true quando ↑ é ruim (ex.: no-show) */
  invertido?: boolean
  sub: string
}

export interface BarraDia {
  dia: string
  atendimentos: number
}

export interface ProducaoMedico {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  atendimentos: number
  receita: number
  ocupacaoPct: number
}

export interface ReceitaEspecialidade {
  especialidade: string
  cor: CorEspecialidade
  valor: number
  pct: number
}

export interface OcupacaoSala {
  nome: string
  pct: number
}

export interface Pendencia {
  id: string
  tipo: 'convite' | 'agendamento' | 'sala'
  label: string
  count: number
  href: string
}

export interface GestaoData {
  clinica: string
  periodo: Periodo
  kpis: Kpi[]
  atendimentosSemana: BarraDia[]
  producao: ProducaoMedico[]
  receitaPorEspecialidade: ReceitaEspecialidade[]
  ocupacaoSalas: OcupacaoSala[]
  pendencias: Pendencia[]
}
