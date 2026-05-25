// Types for Prontuário Psi (Resolução CFP 001/2022)

export type RiscoSessao = 'sem_risco' | 'baixo' | 'moderado' | 'critico'

export type SeveridadeScore = 'minima' | 'leve' | 'moderada' | 'moderada_severa' | 'severa'

export interface IdentificacaoPaciente {
  nomeCompleto: string
  cpf: string
  dataNascimento: string
  idade: number
  genero: string
  estadoCivil: string
  profissao: string
  contatoEmergencia: { nome: string; relacao: string; telefone: string }
}

export interface AnamneseFields {
  queixaPrincipal: string
  historiaAtual: string
  historiaPregressa: string
  antecedentesFamiliares: string
  habitosContexto: string
  hipoteseDiagnosticaInicial: string
  /** ISO date da anamnese (primeira sessão) */
  realizadaEm: string
}

export interface EntradaEvolucao {
  /** Número da sessão */
  numero: number
  /** ISO datetime da sessão */
  dataHora: string
  /** Duração em minutos */
  duracaoMin: number
  modalidade: 'presencial' | 'online' | 'hibrida'
  /** Resumo SOAP/DAP em texto */
  resumo: string
  tecnicasUsadas: string[]
  homeworkPrescrito: string | null
  risco: RiscoSessao
}

export interface AplicacaoInstrumento {
  /** ISO date */
  data: string
  instrumento: string
  valor: number
  severidade: SeveridadeScore
  /** Delta vs aplicação anterior do mesmo instrumento */
  delta: number | null
}

export interface IntervencaoResumo {
  tecnica: string
  abordagem: string
  vezesAplicadas: number
  /** Eficácia percebida pelo profissional 1-5 */
  eficaciaPercebida: 1 | 2 | 3 | 4 | 5
  notas: string
}

export type TipoEncaminhamento = 'psiquiatra' | 'medico_geral' | 'neurologista' | 'nutricionista' | 'fisioterapeuta' | 'outro'

export interface Encaminhamento {
  data: string
  para: TipoEncaminhamento
  profissional: string | null
  motivo: string
  retorno: string | null
}

export interface Alta {
  data: string
  motivo: 'objetivo_alcancado' | 'transferencia' | 'abandono' | 'mutuo_acordo'
  evolucaoFinal: string
  recomendacoes: string
}

export interface ProntuarioData {
  identificacao: IdentificacaoPaciente
  anamnese: AnamneseFields
  evolucao: EntradaEvolucao[]
  instrumentos: AplicacaoInstrumento[]
  intervencoes: IntervencaoResumo[]
  encaminhamentos: Encaminhamento[]
  alta: Alta | null
  /** Profissional responsável */
  profissional: { nome: string; crp: string; especialidade: string }
  /** Hash SHA256 do conteúdo (auditoria) */
  hashAuditoria: string
  /** Versão do prontuário */
  versao: number
  /** ISO date da última atualização */
  atualizadoEm: string
}

export interface ProntuarioProps {
  data: ProntuarioData

  onExportarPdf?: () => void
  onImprimir?: () => void
  onEditarSecao?: (secao: string) => void
}
