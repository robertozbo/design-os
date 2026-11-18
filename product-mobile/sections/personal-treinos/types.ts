export interface TemplateTreino {
  id: string
  nome: string
  divisao: string
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado'
  objetivo: string
  semanas: number
  alunosUsando: number
  atualizado: string
}

export interface TreinoAluno {
  id: string
  aluno: string
  inicial: string
  treino: string
  semana: string
  revisao: string
  vencido?: boolean
}

export interface PersonalTreinosData {
  templates: TemplateTreino[]
  porAluno: TreinoAluno[]
  bibliotecaTotal: number
}

export interface PersonalTreinosProps {
  data: PersonalTreinosData
  onAbrirTemplate?: (id: string) => void
  onAbrirTreinoAluno?: (id: string) => void
  onNovoTemplate?: () => void
  onBiblioteca?: () => void
  onProgramas?: () => void
}
