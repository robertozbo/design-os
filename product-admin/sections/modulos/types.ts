export type StatusModulo = 'ativo' | 'beta' | 'planejado'

/**
 * Um add-on do catálogo, pelo lado de quem vende.
 *
 * O espelho da `Addon` que a clínica vê em Plano & limites: lá é "quanto eu pago e
 * quanto já usei"; aqui é "quantos pagam, quanto rende e quantos usam de fato".
 */
export interface Modulo {
  id: string
  nome: string
  descricao: string
  status: StatusModulo
  precoMensal: number
  /** Quantos workspaces contrataram. */
  contratantes: number
  /** Workspaces elegíveis — a base sobre a qual a penetração é calculada. */
  elegiveis: number
  /**
   * Quantos contratantes **usaram** o módulo nos últimos 30 dias.
   *
   * É o número que separa receita de adoção: módulo com 40 assinantes e 6 usuários
   * ativos não é sucesso, é cancelamento com data marcada.
   */
  ativos30d: number
  /** A section que o módulo destrava, quando já existe. */
  secao: string | null
  /** Só em `planejado`: quando entra. */
  previsto: string | null
}

export interface ResumoModulos {
  /** Receita mensal vinda de add-ons, sem o plano base. */
  mrrAddons: number
  /** Workspaces com pelo menos um add-on. */
  workspacesComAddon: number
  totalWorkspaces: number
}

export interface ModulosData {
  resumo: ResumoModulos
  modulos: Modulo[]
}

export interface ModulosProps extends ModulosData {
  /** Abre a section do módulo — a mesma que o cliente usa. */
  onAbrir?: (secao: string) => void
  /** Lista os workspaces que contrataram este módulo (leva para Clientes filtrado). */
  onVerContratantes?: (id: string) => void
}
