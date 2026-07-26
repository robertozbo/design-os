export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Modalidade = 'presencial' | 'tele'

/** Máquina de estados do escriba IA. */
export type EscribaEstado =
  | 'inativo'
  | 'consentimento'
  | 'gravando'
  | 'transcrevendo'
  | 'rascunho'
  | 'assinado'

export interface PacienteConsulta {
  id: string
  nome: string
  iniciais: string
  idade: number
  genero: string
  convenio: string
  condicoesCronicas: string[]
}

export interface SOAP {
  S: string
  O: string
  A: string
  P: string
}

export interface MedicacaoAtiva {
  id: string
  nome: string
  posologia: string
  prescritoPor: string
  /** Data em que foi prescrita (ex.: "12 mai"). */
  prescritoEm: string
  especialidade: string
  cor: CorEspecialidade
}

export interface ExameRecente {
  id: string
  nome: string
  data: string
  valor: string
  alterado: boolean
}

export interface EvolucaoRecente {
  id: string
  data: string
  medicoNome: string
  medicoIniciais: string
  especialidade: string
  cor: CorEspecialidade
  resumo: string
  geradoPorIA: boolean
}

export interface AssinaturaInfo {
  medicoNome: string
  crm: string
  em: string
  assistidoPorIA: boolean
  modeloIA: string | null
}

export interface ConsultaData {
  paciente: PacienteConsulta
  motivo: string
  modalidade: Modalidade
  sala: string | null
  /** Consentimento de IA-escriba já concedido antes desta consulta. */
  consentimentoIAConcedido: boolean
  modeloIA: string
  /** SOAP que a IA "geraria" após transcrever — usado pelo protótipo. */
  soapSugerido: SOAP
  /** Trechos de transcrição parcial que aparecem durante a gravação (mock). */
  transcricaoMock: string[]
  contexto: {
    medicacoes: MedicacaoAtiva[]
    exames: ExameRecente[]
    evolucoes: EvolucaoRecente[]
  }
}

/**
 * Resumo do que o paciente compartilhou pelo app **desde a última consulta**, já formatado.
 *
 * Vem pronto de propósito: a regra de "direção desejável" (peso caindo é bom, sono subindo é bom)
 * mora na section Acompanhamento — o painel de contexto só exibe, não interpreta.
 */
export interface ItemResumoApp {
  label: string
  valor: string
  delta: string
  tom: 'melhora' | 'piora' | 'neutro'
}

export interface ResumoApp {
  /** ISO da última sincronização do app. */
  ultimaSync: string
  itens: ItemResumoApp[]
}
