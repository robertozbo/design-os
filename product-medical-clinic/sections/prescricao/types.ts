export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type StatusPrescricao = 'ativa' | 'expirada' | 'cancelada'
export type TipoReceita = 'comum' | 'controlada' | 'continua'
export type MotivoCancelamento = 'erro_prescricao' | 'mudanca_conduta' | 'reacao_adversa' | 'outro'
export type FiltroStatus = 'todas' | 'ativa' | 'precisa_renovar' | 'expirada' | 'cancelada'

export interface MedicoRef {
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
}

export interface PacienteRef {
  nome: string
  iniciais: string
  idade: number
}

export interface MedicamentoItem {
  id: string
  nome: string
  principioAtivo: string
  dose: string
  posologia: string
  duracaoDias: number
  continuo: boolean
}

export interface RenovacaoHistorico {
  id: string
  data: string
  medicoNome: string
  tipo: 'consulta' | 'renovacao'
}

export interface PrescricaoItem {
  id: string
  paciente: PacienteRef
  prescritor: MedicoRef
  tipo: TipoReceita
  status: StatusPrescricao
  dataEmissao: string
  validade: string
  /** Negativo quando já expirou. */
  diasAteVencer: number
  precisaRenovar: boolean
  entregueNoApp: boolean
  validadeICP: boolean
  medicamentos: MedicamentoItem[]
  /** Data da consulta que originou (null se avulsa). */
  origemConsultaData: string | null
  historicoRenovacoes: RenovacaoHistorico[]
  /** Médicos autorizados que enxergam a prescrição. */
  medicosAutorizados: MedicoRef[]
  canceladaEm: string | null
  canceladaPor: string | null
  motivoCancelamento: MotivoCancelamento | null
  /** Texto livre que o médico escreveu ao cancelar. Vai para o audit log. */
  justificativaCancelamento: string | null
}

export interface PrescricaoKpis {
  ativas: number
  precisaRenovar: number
  expiradas: number
  controladas: number
}

export interface PacienteSelector {
  id: string
  nome: string
  iniciais: string
  idade: number
  condicoesCronicas: string[]
  ultimaConsulta: string | null
}

export interface PrescricaoData {
  clinica: string
  medicoLogado: MedicoRef
  kpis: PrescricaoKpis
  prescricoes: PrescricaoItem[]
  pacientes: PacienteSelector[]
}
