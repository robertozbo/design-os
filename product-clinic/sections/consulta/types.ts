export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Modalidade = 'presencial' | 'tele'

/** Máquina de estados do escriba IA. */
export type EscribaEstado =
  | 'inativo'
  | 'consentimento'
  | 'gravando'
  | 'transcrevendo'
  /** IA analisando a anotação manual do médico. */
  | 'analisando'
  /** A IA terminou e lista o que extraiu; nada entra no SOAP antes do médico marcar. */
  | 'revisao'
  | 'rascunho'
  | 'assinado'

/**
 * Um achado que a IA extraiu da transcrição, ainda **fora** do prontuário.
 *
 * O escriba não escreve na evolução: propõe itens e o médico marca os que ficam. A diferença é de
 * responsabilidade — em vez de caçar erro dentro de um parágrafo já escrito no registro que ele vai
 * assinar, o médico aprova item a item, e o que não foi marcado nunca existiu no prontuário.
 */
export interface ItemExtraido {
  id: string
  campo: keyof SOAP
  texto: string
}

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

/**
 * Medidas aferidas **na sala**, durante a consulta. São campos numéricos e não texto do SOAP:
 * valor digitado em prosa não vira série, não aparece no Acompanhamento e não dá para comparar com
 * a consulta anterior. Alimentam a mesma série do app, com `fonte: 'Clínica'`.
 *
 * Resultado de laboratório (colesterol, triglicerídeos, HbA1c) **não entra aqui** — vem pela section
 * Exames, que guarda data de coleta, laboratório e o laudo. Digitado na consulta, seria um número
 * sem procedência num registro que tem valor legal.
 */
export interface MedidasConsulta {
  /** kg */
  peso: string
  /** cm — praticamente fixa em adulto; serve pro IMC, não vira série. */
  altura: string
  /** mmHg — a pressão é um par: 138 sem o 88 é metade da informação. */
  pressaoSistolica: string
  pressaoDiastolica: string
  /** bpm */
  frequenciaCardiaca: string
  /** °C */
  temperatura: string
  /** % */
  saturacao: string
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
  /** O que a IA extrai da transcrição, para o médico marcar antes de virar SOAP. */
  itensExtraidos: ItemExtraido[]
  /**
   * O que a IA devolve ao analisar a anotação **manual** do médico, cruzando com medicações
   * ativas, exames recentes e os dados que o paciente compartilhou pelo app. Passa pela mesma
   * revisão: nada entra sem marcação.
   */
  itensAnalise: ItemExtraido[]
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
