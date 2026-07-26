export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Modalidade = 'presencial' | 'tele'
export type Periodo = 'hoje' | 'semana' | 'mes'

export interface StatAtendimento {
  id: string
  label: string
  valor: string
  sub: string
}

export interface AtendimentoItem {
  id: string
  data: string
  hora: string
  paciente: {
    nome: string
    iniciais: string
    idade: number
  }
  motivo: string
  especialidade: string
  cor: CorEspecialidade
  modalidade: Modalidade
  duracaoMin: number
  geradoPorIA: boolean
  prescricoes: number
  examesSolicitados: number
}

export interface AtendimentosData {
  medico: string
  periodo: Periodo
  stats: StatAtendimento[]
  atendimentos: AtendimentoItem[]
}
