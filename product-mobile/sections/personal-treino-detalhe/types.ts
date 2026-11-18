export interface ExercicioPrescrito {
  id: string
  nome: string
  grupo: string
  series: number
  reps: string
  carga: string
  descanso: string
  rpe?: string
  obs?: string
}

export interface DiaTreino {
  id: string
  nome: string
  foco: string
  exercicios: ExercicioPrescrito[]
}

export interface PersonalTreinoDetalheData {
  template: { id: string; nome: string; divisao: string; nivel: string; semanas: number; objetivo: string }
  dias: DiaTreino[]
  alunosSugeridos: Array<{ id: string; nome: string; inicial: string }>
}

export interface PersonalTreinoDetalheProps {
  data: PersonalTreinoDetalheData
  onAdicionarExercicio?: (diaId: string) => void
  onEditarExercicio?: (id: string) => void
  onAplicar?: (alunoIds: string[]) => void
}
