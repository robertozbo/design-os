export interface PersonalPerfilData {
  nome: string
  inicial: string
  registro: string
  cidade: string
  bio: string
  especialidades: string[]
  locais: string[]
  modalidades: string[]
  linkPublico: string
}

export interface PersonalPerfilProps {
  data: PersonalPerfilData
  onEditar?: () => void
  onVerPublico?: () => void
}
