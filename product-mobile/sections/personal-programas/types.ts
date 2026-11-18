export interface Fase {
  nome: string
  semanas: string
  foco: string
  status: 'concluida' | 'atual' | 'proxima'
}

export interface Programa {
  id: string
  nome: string
  aluno: string
  inicial: string
  inicio: string
  fim: string
  progresso: number
  fases: Fase[]
}

export interface PersonalProgramasData {
  programas: Programa[]
}

export interface PersonalProgramasProps {
  data: PersonalProgramasData
  onAbrir?: (id: string) => void
  onNovo?: () => void
}
