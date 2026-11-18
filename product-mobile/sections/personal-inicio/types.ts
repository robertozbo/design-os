export type StatusSessao = 'realizada' | 'confirmada' | 'agendada' | 'faltou'
export type MotivoRisco = 'adesao' | 'sem-treino' | 'dor' | 'reavaliacao'

export interface Sessao {
  id: string
  hora: string
  alunoId: string
  aluno: string
  inicial: string
  tipo: string
  modalidade: 'presencial' | 'online'
  local?: string
  status: StatusSessao
}

export interface AlunoAtencao {
  alunoId: string
  aluno: string
  inicial: string
  motivo: MotivoRisco
  detalhe: string
}

export interface ExecucaoHoje {
  alunoId: string
  aluno: string
  inicial: string
  treino: string
  resumo: string
  rpe: number
  hora: string
}

export interface Kpi {
  id: string
  label: string
  valor: string
  delta?: string
  positivo?: boolean
}

export interface PersonalInicioData {
  usuario: {
    primeiroNome: string
    avatarInicial: string
    notificacoesNaoLidas: number
    temPerfilAluno: boolean
  }
  dataExtenso: string
  proximaSessao: Sessao & { emMinutos: number }
  agenda: Sessao[]
  atencao: AlunoAtencao[]
  execucoesHoje: ExecucaoHoje[]
  mensagensNaoLidas: number
  kpis: Kpi[]
}

export type AtalhoId = 'nova-avaliacao' | 'aplicar-treino' | 'convidar' | 'mensagens'

export interface PersonalInicioProps {
  data: PersonalInicioData
  onCheckin?: (sessao: Sessao) => void
  onAbrirAluno?: (alunoId: string) => void
  onVerAgenda?: () => void
  onAtalho?: (id: AtalhoId) => void
}
