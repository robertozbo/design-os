export interface ConversaResumo {
  id: string
  aluno: string
  inicial: string
  ultima: string
  hora: string
  naoLidas: number
  daAluno: boolean
  anexo?: 'foto' | 'video' | 'treino'
}

export interface PersonalMensagensData {
  conversas: ConversaResumo[]
}

export interface PersonalMensagensProps {
  data: PersonalMensagensData
  onAbrir?: (id: string) => void
  onNova?: () => void
}
