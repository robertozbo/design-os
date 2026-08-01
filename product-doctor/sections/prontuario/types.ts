export type Genero = 'feminino' | 'masculino' | 'outro'
export type StatusApp = 'vinculado' | 'convite-pendente' | 'nao-convidado'
export type Modalidade = 'presencial' | 'tele'
export type AlertNivel = 'baixo' | 'normal' | 'alto' | 'critico'
export type SeveridadeAlergia = 'leve' | 'moderada' | 'grave'
export type StatusHipotese = 'provavel' | 'confirmada' | 'descartada'
export type TipoHabito = 'tabaco' | 'alcool' | 'atividade-fisica' | 'sono'

export type SecaoId =
  | 'identificacao'
  | 'anamnese'
  | 'exame-fisico'
  | 'hipoteses-plano'
  | 'evolucoes'
  | 'exames'
  | 'prescricoes'

export interface PacienteProntuario {
  id: string
  nome: string
  iniciais: string
  cpf: string
  dataNascimento: string
  idade: number
  genero: Genero
  telefone: string
  email: string
  endereco: string
  convenio: string
  condicoesCronicas: string[]
  statusApp: StatusApp
  vinculadoEm: string
  primeiroAtendimentoEm: string
  ultimaConsultaEm: string
  totalConsultas: number
}

export interface Alergia {
  substancia: string
  reacao: string
  severidade: SeveridadeAlergia
}

export interface Habito {
  tipo: TipoHabito
  status: string
  detalhe: string
}

export interface Anamnese {
  queixaPrincipal: string
  hma: string
  antecedentesPessoais: string[]
  antecedentesFamiliares: string[]
  medicacoesEmUso: string[]
  alergias: Alergia[]
  habitos: Habito[]
}

export interface SinaisVitais {
  pa: string
  fc: string
  fr: string
  temperatura: string
  registradoEm: string
}

export interface AntropometriaAtual {
  peso: number
  altura: number
  imc: number
  circunferenciaAbdominal: number
  registradoEm: string
}

export interface AntropometriaPonto {
  data: string
  peso: number
  imc: number
  ca: number
}

export interface ExameFisico {
  sinaisVitais: SinaisVitais
  antropometriaAtual: AntropometriaAtual
  antropometriaHistorico: AntropometriaPonto[]
  exameEspecifico: string
}

export interface HipoteseDiagnostica {
  cid: string
  label: string
  status: StatusHipotese
  nota: string
}

export interface EvolucaoSOAP {
  S: string
  O: string
  A: string
  P: string
}

export interface EvolucaoProntuario {
  id: string
  data: string
  modalidade: Modalidade
  medico: string
  geradoPorIA: boolean
  modeloIA: string | null
  planoResumo: string
  soap: EvolucaoSOAP | null
}

export interface ExameAnexado {
  id: string
  tipo: string
  data: string
  destaqueLabel: string
  alertNivel: AlertNivel
}

export interface PrescricaoAtiva {
  id: string
  data: string
  medicacoes: string
  validade: string
  memedId: string
}

export interface ProntuarioProps {
  paciente: PacienteProntuario
  anamnese: Anamnese
  exameFisico: ExameFisico
  hipoteses: HipoteseDiagnostica[]
  planoAtual: string
  evolucoes: EvolucaoProntuario[]
  examesAnexados: ExameAnexado[]
  prescricoesAtivas: PrescricaoAtiva[]

  /** Volta pra detalhe do paciente. */
  onVoltar?: () => void
  /** Salva edição inline de um campo. */
  onSalvarCampo?: (campo: string, novoValor: string) => void
  /** Adiciona item numa lista (antecedente, alergia, hábito). */
  onAdicionarItem?: (lista: string, valor: string) => void
  /** Remove item de uma lista. */
  onRemoverItem?: (lista: string, index: number) => void
  /** Abre evolução completa (link pra Consulta original). */
  onAbrirEvolucao?: (id: string) => void
  /** Abre exame (link pra section Exames). */
  onAbrirExame?: (id: string) => void
  /** Abre Memed pra ver prescrição. */
  onAbrirPrescricao?: (memedId: string) => void
  /** Exporta PDF do prontuário. */
  onExportarPDF?: (incluirSOAPCompleto: boolean) => void
  /** Compartilha trecho via canal clínico. */
  onCompartilharTrecho?: (texto: string) => void
}
