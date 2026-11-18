export interface Execucao {
  data: string
  treino: string
  concluido: string
  rpe: number | null
  nota?: string
  pulou?: boolean
}

export interface TreinoDia {
  id: string
  nome: string
  foco: string
  exercicios: Array<{ nome: string; series: string; carga: string }>
}

export interface AvaliacaoResumo {
  id: string
  data: string
  tipo: string
  destaques: string[]
}

export interface PersonalAlunoFichaData {
  aluno: {
    id: string
    nome: string
    inicial: string
    idade: number
    objetivo: string
    desde: string
    modalidade: string
    telefone: string
  }
  metricas: Array<{ label: string; valor: string; delta?: string; positivo?: boolean }>
  alerta?: string
  programa: { nome: string; semana: string; progresso: number; proximaRevisao: string }
  treinos: TreinoDia[]
  execucoes: Execucao[]
  avaliacoes: AvaliacaoResumo[]
  anamnese: Array<{ pergunta: string; resposta: string; atencao?: boolean }>
}

export interface PersonalAlunoFichaProps {
  data: PersonalAlunoFichaData
  onMensagem?: () => void
  onNovaAvaliacao?: () => void
  onEditarTreino?: () => void
  onAbrirAvaliacao?: (id: string) => void
}
