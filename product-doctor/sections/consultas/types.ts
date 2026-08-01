export type FiltroPeriodo = 'hoje' | 'semana' | 'mes' | 'tudo'

export interface SoapConsulta {
  S: string
  O: string
  A: string
  P: string
}

export interface PrescricaoEmitida {
  id: string
  medicacao: string
  posologia: string
  via?: string
  duracao?: string
  validade: string
  memedId: string
}

/** Item resumido pra lista de consultas já finalizadas (assinadas). */
export interface ConsultaFinalizadaItem {
  id: string
  pacienteId: string
  pacienteNome: string
  pacienteIniciais: string
  modalidade: 'presencial' | 'tele'
  inicioEm: string
  fimEm: string
  duracaoMin: number
  assinadoEm: string
  queixaPrincipal: string
  hipoteseDiagnostica: string
  prescricoesCount: number
  examesSolicitadosCount: number
  imagensAnalisadasCount: number
  geradoPorIA: boolean
  /** SOAP completo do atendimento assinado (read-only). Opcional pra retro-compat. */
  soap?: SoapConsulta | null
  /** Prescrições emitidas no atendimento (read-only). */
  prescricoes?: PrescricaoEmitida[]
}

export interface ConsultasFinalizadasProps {
  consultas: ConsultaFinalizadaItem[]
  filtroAtivo: FiltroPeriodo
  onAlterarFiltro?: (filtro: FiltroPeriodo) => void
  onAbrirConsulta?: (consultaId: string) => void
  onIniciarNova?: () => void
}
