export type SeveridadeAlerta = 'risco' | 'atencao' | 'info'
export type StatusSessaoLista = 'agendada' | 'confirmada' | 'realizada' | 'em-andamento'
export type TipoAtividade =
  | 'evolucao'
  | 'avaliacao'
  | 'novo-paciente'
  | 'convite-aceito'
  | 'falta'
  | 'alta'

export interface KPIsDia {
  total: number
  confirmados: number
  realizados: number
  proximaHora?: string
}

export interface ProximaSessao {
  id: string
  hora: string
  pacienteId: string
  pacienteNome: string
  queixaCurta: string
  evaUltima: number
  duracaoMin: number
  status: StatusSessaoLista
  isProxima: boolean
}

export interface AlertaClinico {
  id: string
  severidade: SeveridadeAlerta
  texto: string
  pacienteNome: string
  pacienteId: string
  acaoLabel: string
}

export interface AtividadeRecenteItem {
  id: string
  tipo: TipoAtividade
  texto: string
  pacienteNome?: string
  dataIso: string
}

export interface KPIMes {
  label: string
  valor: string
  deltaPct?: number
  deltaTexto?: string
  positivo?: boolean
}
