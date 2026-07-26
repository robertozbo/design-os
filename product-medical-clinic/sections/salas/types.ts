export type TipoSala = 'consultorio' | 'procedimento' | 'tele'
export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'

export interface ProximaConsulta {
  inicio: string
  medico: string
  especialidade: string
  cor: CorEspecialidade
}

export interface Sala {
  id: string
  nome: string
  local: string
  tipo: TipoSala
  ativa: boolean
  capacidade: number
  recursos: string[]
  funcionamento: string
  /** Ocupação de hoje */
  consultasHoje: number
  horasOcupadas: number
  horasDisponiveis: number
  proxima: ProximaConsulta | null
}

export interface SalasData {
  data: string
  salas: Sala[]
}
