export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'

/** Documentos que o médico emite para o paciente. */
export type TipoRelatorio = 'relatorio-medico' | 'atestado' | 'laudo' | 'declaracao' | 'evolucao'

export type StatusRelatorio = 'rascunho' | 'emitido' | 'enviado'

export type FiltroTipo = 'todos' | TipoRelatorio

/**
 * Campo que só existe em um tipo de documento. O atestado precisa de dias de afastamento; a
 * declaração de comparecimento, do horário; o relatório de evolução, do período acompanhado.
 * Os outros dois não pedem nada além da consulta.
 */
export type CampoExtra = 'dias' | 'horario' | 'periodo'

export interface ClinicaRef {
  nome: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
}

export interface MedicoRef {
  id: string
  nome: string
  iniciais: string
  crm: string
  rqe: string | null
  especialidade: string
  cor: CorEspecialidade
}

export interface PacienteRef {
  id: string
  nome: string
  iniciais: string
  idade: number
  cpf: string
  email: string
  convenio: string
}

export interface ConsultaRef {
  id: string
  /** ISO curto, para ordenação. */
  data: string
  /** Rótulo já formatado em pt-BR. */
  dataLabel: string
  horaInicio: string
  horaFim: string
  motivo: string
  especialidade: string
  cid: string | null
  avaliacao: string
  conduta: string
}

export interface PacienteSelector extends PacienteRef {
  /** Consultas do paciente com o médico logado, da mais recente para a mais antiga. */
  consultas: ConsultaRef[]
}

/**
 * Texto-base do documento. Cada parágrafo pode conter placeholders `{{chave}}` preenchidos com o
 * paciente + a consulta escolhida. Parágrafo cujo placeholder fica vazio (ex.: `{{cid}}` numa
 * consulta sem CID) é descartado — documento médico não sai com lacuna impressa.
 */
export interface ModeloRelatorio {
  tipo: TipoRelatorio
  titulo: string
  descricao: string
  corpo: string[]
  campo: CampoExtra | null
  exigeCid: boolean
}

export interface Relatorio {
  id: string
  numero: string
  tipo: TipoRelatorio
  titulo: string
  paciente: PacienteRef
  consultaData: string
  consultaDataLabel: string
  motivo: string
  cid: string | null
  corpo: string[]
  status: StatusRelatorio
  emitidoEm: string
  enviadoPara: string | null
  enviadoEm: string | null
}

export interface RelatorioMedicoData {
  clinica: ClinicaRef
  medicoLogado: MedicoRef
  modelos: ModeloRelatorio[]
  pacientes: PacienteSelector[]
  relatorios: Relatorio[]
}
