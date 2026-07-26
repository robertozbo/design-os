export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type StatusApp = 'vinculado' | 'convite-pendente' | 'nao-convidado'
export type FiltroEscopo = 'clinica' | 'meus'
export type FiltroEspecialidade = 'todas' | string
export type FiltroStatusApp = 'todos' | StatusApp

export interface MedicoVinculo {
  id: string
  nome: string
  iniciais: string
  especialidade: string
  cor: CorEspecialidade
  principal: boolean
}

export interface PacienteClinica {
  id: string
  nome: string
  iniciais: string
  idade: number
  genero: string
  convenio: string
  condicoesCronicas: string[]
  /** Equipe de cuidado — vários médicos de especialidades diferentes. */
  equipe: MedicoVinculo[]
  ultimaConsultaEm: string | null
  ultimaEspecialidade: string | null
  proximaConsultaEm: string | null
  proximaEspecialidade: string | null
  statusApp: StatusApp
}

export interface FiltroPacientes {
  busca: string
  escopo: FiltroEscopo
  especialidade: FiltroEspecialidade
  statusApp: FiltroStatusApp
}

export interface ClinicaCtx {
  nome: string
  medicoLogadoId: string
  especialidades: string[]
}
