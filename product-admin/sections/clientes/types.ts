export type TipoWorkspace = 'clinica' | 'profissional' | 'empresa'

/**
 * Situação de cobrança — é o que decide a cor da linha e o que fazer com ela.
 *
 * `trial` e `inadimplente` são estados de curto prazo com prazo correndo; por isso os
 * dois carregam uma data, e é ela que a tela mostra em vez do rótulo sozinho.
 */
export type SituacaoCobranca = 'ativo' | 'trial' | 'inadimplente' | 'cancelado'

export interface AddonContratadoResumo {
  id: string
  nome: string
  /** Consumo do ciclo. `null` quando o add-on não tem cota. */
  usados: number | null
  incluidos: number | null
}

export interface Workspace {
  id: string
  nome: string
  tipo: TipoWorkspace
  cidade: string
  plano: string
  /** Profissionais em uso / permitidos pelo plano. */
  profissionais: number
  maxProfissionais: number
  /** Receita mensal recorrente em reais, plano + add-ons. */
  mrr: number
  situacao: SituacaoCobranca
  /** ISO. Fim do trial ou vencimento em aberto — só existe em `trial` e `inadimplente`. */
  prazoEm: string | null
  addons: AddonContratadoResumo[]
  criadoEm: string
  /**
   * ISO do último acesso de qualquer usuário do workspace.
   *
   * É o número que denuncia churn antes da fatura: conta paga e parada há 40 dias
   * cancela no próximo ciclo, e o plano sozinho não conta isso.
   */
  ultimoAcesso: string
}

export interface ResumoClientes {
  ativos: number
  /** Soma do MRR de todos os workspaces não cancelados. */
  mrr: number
  emTrial: number
  inadimplentes: number
}

export interface ClientesData {
  resumo: ResumoClientes
  workspaces: Workspace[]
}

export interface ClientesProps extends ClientesData {
  /** Abre o workspace. Sem acesso a dado clínico — contrato e uso, nunca paciente. */
  onAbrir?: (id: string) => void
  /** Dispara a régua de cobrança para um inadimplente. */
  onCobrar?: (id: string) => void
}
