export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
/**
 * Vínculo do paciente com o app Nymos. O convite vai **por email**; o paciente o recebe dentro do
 * app (Profissionais → Convites → Recebidos) e o aceite só cria o vínculo depois que ele confirma
 * as permissões de compartilhamento — mesmo padrão da vertical Personal.
 */
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
  /** Canal do convite pro app. Sem email não há como convidar. */
  email?: string
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
