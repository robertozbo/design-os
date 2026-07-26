export type StatusCredencial = 'ativo' | 'pendente'

export interface Especialidade {
  nome: string
  rqe?: string
}

export interface Formacao {
  id: string
  titulo: string
  instituicao: string
  ano: string
}

export interface Contato {
  email: string
  telefone: string
  cidade: string
}

export interface HorarioDia {
  dia: string
  faixas: string[]
}

export interface Credencial {
  id: string
  nome: string
  descricao: string
  status: StatusCredencial
  detalhe?: string
}

export interface Preferencia {
  id: string
  label: string
  descricao: string
  ativo: boolean
}

export interface PerfilData {
  nome: string
  iniciais: string
  especialidadePrincipal: string
  crm: string
  uf: string
  especialidades: Especialidade[]
  bio: string
  bioMax: number
  formacao: Formacao[]
  contato: Contato
  horarios: HorarioDia[]
  credenciais: Credencial[]
  preferencias: Preferencia[]
}
