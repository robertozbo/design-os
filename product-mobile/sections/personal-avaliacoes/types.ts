export interface AvaliacaoItem {
  id: string
  aluno: string
  inicial: string
  data: string
  tipo: string
  destaques: string[]
}

export interface Reavaliacao {
  alunoId: string
  aluno: string
  inicial: string
  ultima: string
  prazo: string
  atrasada: boolean
}

export interface PersonalAvaliacoesData {
  reavaliacoes: Reavaliacao[]
  recentes: AvaliacaoItem[]
}

export interface PersonalAvaliacoesProps {
  data: PersonalAvaliacoesData
  onNova?: (alunoId?: string) => void
  onAbrir?: (id: string) => void
}
