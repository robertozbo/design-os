export type StatusAluno = 'ativo' | 'risco' | 'pausado' | 'convidado'

export interface AlunoResumo {
  id: string
  nome: string
  inicial: string
  objetivo: string
  status: StatusAluno
  adesao: number
  ultimoTreino: string
  treinoAtual: string | null
  alerta?: string
  plano: 'presencial' | 'online' | 'hibrido'
}

export interface PersonalAlunosData {
  total: number
  alunos: AlunoResumo[]
}

export interface PersonalAlunosProps {
  data: PersonalAlunosData
  onAbrirAluno?: (id: string) => void
  onConvidar?: () => void
}
