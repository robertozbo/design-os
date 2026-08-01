export type Modalidade = 'presencial' | 'tele'
export type AcaoAudit =
  | 'visualizou'
  | 'editou'
  | 'ia-inferencia'
  | 'exportou'
  | 'prescreveu'

/** Cor de badge por especialidade — usada em evoluções, medicações e equipe. */
export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'

export interface PacienteRef {
  id: string
  nome: string
  iniciais: string
  idade: number
  genero: string
  convenio: string
  condicoesCronicas: string[]
}

export interface MedicoVinculo {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  crm: string
  ultimoAtendimentoEm: string
  principal: boolean
}

export interface EvolucaoSOAP {
  S: string
  O: string
  A: string
  P: string
}

export interface Evolucao {
  id: string
  data: string
  especialidade: string
  cor: CorEspecialidade
  medicoNome: string
  medicoIniciais: string
  modalidade: Modalidade
  geradoPorIA: boolean
  modeloIA: string | null
  /** true quando o autor é o médico logado (editável). */
  doMedicoLogado: boolean
  resumo: string
  soap: EvolucaoSOAP | null
}

export interface MedicacaoUso {
  nome: string
  prescritoPor: string
  especialidade: string
  cor: CorEspecialidade
}

export interface AnamneseCompartilhada {
  condicoesCronicas: string[]
  medicacoesEmUso: MedicacaoUso[]
  alergias: string[]
  observacao: string
}

export interface AuditEvento {
  id: string
  ator: string
  iniciais: string
  papel: string
  especialidade: string | null
  cor: CorEspecialidade
  acao: AcaoAudit
  alvo: string
  em: string
}

export interface AcessoAtual {
  medicoNome: string
  especialidade: string
  viaVinculo: boolean
  consentimento: string
}

export interface ProntuarioCompartilhadoProps {
  paciente: PacienteRef
  acessoAtual: AcessoAtual
  equipeCuidado: MedicoVinculo[]
  anamnese: AnamneseCompartilhada
  evolucoes: Evolucao[]
  auditLog: AuditEvento[]
}
