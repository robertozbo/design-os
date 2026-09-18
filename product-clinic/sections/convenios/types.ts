export type FiltroConvenio = 'todos' | 'ativos' | 'inativos'

export interface Convenio {
  id: string
  nome: string
  /**
   * Registro ANS da operadora. `null` é o normal — o campo é opcional, e a recepção
   * quase nunca sabe o número na hora em que cria o convênio digitando.
   */
  codigoAns: string | null
  /** Inativo sai da oferta de NOVO cadastro; quem já tem, continua tendo. */
  ativo: boolean
  /**
   * Quantos pacientes do pool estão neste convênio hoje.
   *
   * Não é KPI de vaidade: é o que diz se dá para desativar sem quebrar cadastro, e é
   * o sinal de duplicata por grafia ("Unimed Regional 312, unimed regional 4" quase
   * sempre é a mesma operadora digitada duas vezes).
   */
  pacientes: number
}

export interface ResumoConvenios {
  ativos: number
  /** Pacientes com algum convênio — inclui os de convênio inativo. */
  conveniados: number
  /** Pacientes sem convênio (`convenioId = null`). Particular não é linha da lista. */
  particulares: number
}

export interface ConveniosData {
  resumo: ResumoConvenios
  convenios: Convenio[]
}

/** O que o modal devolve. Sem `id` = criação; com `id` = edição. */
export interface ConvenioFormValues {
  id?: string
  nome: string
  codigoAns: string | null
  ativo: boolean
}

export interface ConveniosProps extends ConveniosData {
  /**
   * Cria ou atualiza um convênio.
   *
   * Idempotente por nome do lado do servidor: criar com um nome que já existe devolve
   * o convênio existente em vez de erro (unique parcial em `lower(name)`).
   */
  onSalvar?: (values: ConvenioFormValues) => void
  /** Liga/desliga o convênio para novos cadastros. Nunca desvincula paciente. */
  onAlternarAtivo?: (id: string, ativo: boolean) => void
}
