export interface Exercicio {
  id: string
  nome: string
  grupo: string
  equipamento: string
  temVideo: boolean
  personalizado?: boolean
}

export interface PersonalExerciciosData {
  total: number
  grupos: string[]
  exercicios: Exercicio[]
}

export interface PersonalExerciciosProps {
  data: PersonalExerciciosData
  onSelecionar?: (id: string) => void
  onNovo?: () => void
}
