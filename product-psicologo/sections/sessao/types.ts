// Types for Sessão (Psicólogo) — feature âncora

export type ModoAnotacao = 'soap' | 'dap' | 'livre'

export type AbordagemTerapeutica = 'tcc' | 'act' | 'mindfulness' | 'emdr' | 'humanista' | 'psicodinamica' | 'sistemica' | 'cgi'

export type CategoriaTecnica = 'cognitiva' | 'comportamental' | 'experiencial' | 'corporal' | 'narrativa'

export interface Tecnica {
  id: string
  nome: string
  abordagem: AbordagemTerapeutica
  categoria: CategoriaTecnica
  /** Descrição curta */
  descricao: string
}

export type RiscoNivel = 0 | 1 | 2 | 3

export interface ScoreInstrumento {
  instrumento: string
  valor: number
  severidade: 'minima' | 'leve' | 'moderada' | 'moderada_severa' | 'severa'
  aplicadoEm: string
}

export interface PacienteSessao {
  id: string
  nomeCompleto: string
  inicial: string
  fotoUrl: string | null
  idade: number
  scoresRecentes: ScoreInstrumento[]
}

export interface SessaoPlano {
  nome: string
  abordagem: AbordagemTerapeutica
  sessaoAtual: number
  totalSessoes: number
}

export interface SoapFields {
  subjetivo: string
  objetivo: string
  avaliacao: string
  plano: string
}

export interface DapFields {
  dados: string
  avaliacao: string
  plano: string
}

export interface HomeworkPrescrito {
  texto: string
  tags: string[]
  prazoEm: string | null
}

export interface SessaoData {
  /** Sessão em andamento */
  paciente: PacienteSessao
  plano: SessaoPlano
  modo: ModoAnotacao
  /** ISO datetime início */
  iniciadaEm: string
  /** Conteúdo SOAP (se modo = soap) */
  soap: SoapFields
  /** Conteúdo DAP (se modo = dap) */
  dap: DapFields
  /** Conteúdo texto livre */
  livre: string
  /** Técnicas selecionadas (IDs) */
  tecnicasSelecionadas: string[]
  /** Catálogo de técnicas disponíveis */
  catalogoTecnicas: Tecnica[]
  /** Homework prescrito */
  homework: HomeworkPrescrito
  /** Risco do encontro (0=nenhum, 3=crítico) */
  risco: RiscoNivel
  /** Notas privadas (não vão pro prontuário) */
  notasPrivadas: string
}

export interface SessaoProps {
  data: SessaoData

  onModoChange?: (modo: ModoAnotacao) => void
  onSoapChange?: (campo: keyof SoapFields, valor: string) => void
  onDapChange?: (campo: keyof DapFields, valor: string) => void
  onLivreChange?: (valor: string) => void
  onTecnicaToggle?: (id: string) => void
  onHomeworkChange?: (campo: keyof HomeworkPrescrito, valor: HomeworkPrescrito[keyof HomeworkPrescrito]) => void
  onRiscoChange?: (nivel: RiscoNivel) => void
  onNotasPrivadasChange?: (valor: string) => void

  onPause?: () => void
  onAplicarInstrumento?: () => void
  onFinalizar?: () => void
  onCancelar?: () => void
}
