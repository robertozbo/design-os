export type Sexo = 'M' | 'F'

/** Quem assina a avaliação. A tela é a mesma; o que muda é o recorte de campos. */
export type Conselho = 'CRN' | 'CREF'

export type ProtocoloId =
  | 'faulkner'
  | 'jackson_pollock_3'
  | 'jackson_pollock_7'
  | 'guedes'
  | 'petroski'
  | 'yuhasz'
  | 'lohman'
  | 'durnin_womersley'

/** As 9 dobras que os protocolos usam. Nenhum protocolo pede todas. */
export type DobraId =
  | 'triceps'
  | 'subescapular'
  | 'suprailiaca'
  | 'abdominal'
  | 'peitoral'
  | 'coxa'
  | 'axilarMedia'
  | 'panturrilha'
  | 'biceps'

export type CircunferenciaId =
  | 'pescoco'
  | 'torax'
  | 'cintura'
  | 'abdomen'
  | 'quadril'
  | 'bracoRelaxado'
  | 'bracoContraido'
  | 'antebraco'
  | 'coxa'
  | 'panturrilha'

/** Multiplicador do GET sobre a TMB. */
export type NivelAtividade = 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'atleta'

export type ObjetivoId =
  | 'emagrecimento'
  | 'hipertrofia'
  | 'recomposicao'
  | 'performance'
  | 'saude'

/* ---------- Medidas ---------- */

/**
 * Tudo que a avaliação COLETA. Nada aqui é calculado — o que se deriva daqui mora em
 * `formulas.ts` e é recalculado a cada tecla. Guardar resultado junto de medida é como o
 * peso e o IMC se contradizerem na mesma tela: o dado derivado envelhece e ninguém percebe.
 */
export interface Medidas {
  pesoKg: number | null
  alturaCm: number | null
  /** mm, por dobra. Chave ausente = não medida. */
  dobras: Partial<Record<DobraId, number>>
  /** cm, por sítio. */
  circunferencias: Partial<Record<CircunferenciaId, number>>
  /** Bioimpedância, quando houve balança. Substitui o %G das dobras se o avaliador quiser. */
  bioimpedancia: Bioimpedancia | null
}

/**
 * O que a balança de bioimpedância devolve. No Nymos esses números vêm do aparelho
 * (OCR do visor ou integração), não de equação — por isso são campos, não derivados.
 */
export interface Bioimpedancia {
  gorduraPct: number | null
  massaMagraKg: number | null
  massaMuscularKg: number | null
  aguaCorporalPct: number | null
  gorduraVisceralNivel: number | null
  massaOsseaKg: number | null
  tmbKcal: number | null
  idadeMetabolica: number | null
}

/* ---------- Condição física ---------- */

export type LiberacaoMedica =
  | 'nao-informado'
  | 'liberado'
  | 'com-restricoes'
  | 'contraindicado'

/**
 * O que o avaliador precisa saber antes de prescrever. Numa clínica isso deixa de ser
 * autorrelato: a liberação vem de um médico da mesma equipe, e o campo aponta para ele.
 */
export interface CondicaoFisica {
  lesoesAtuais: string
  cirurgiasPrevias: string
  restricoes: string
  liberacaoMedica: LiberacaoMedica
  /** Quem liberou, com que restrição e quando. */
  liberacaoNota: string
}

export interface Fotos {
  frontal: boolean
  lateral: boolean
  posterior: boolean
}

/* ---------- Funcional ---------- */

/** Teste submáximo → 1RM estimado. */
export interface RMTeste {
  pesoTesteKg: number | null
  repsTeste: number | null
}

export interface OneRM {
  supino: RMTeste | null
  agachamento: RMTeste | null
  levantamentoTerra: RMTeste | null
}

export type FMSTesteId =
  | 'agachamentoProfundo'
  | 'passagemBarreira'
  | 'avancoLinha'
  | 'mobilidadeOmbro'
  | 'elevacaoPernaEstendida'
  | 'estabilidadeTroncoFlexao'
  | 'estabilidadeRotatoria'

/** Score 0–3 por sub-teste; o total (0–21) é derivado, nunca guardado. */
export type FMS = Record<FMSTesteId, number>

export interface Flexibilidade {
  sentaEAlcancaCm: number | null
  mobilidadeOmbroCm: number | null
  schoberCm: number | null
}

export type CardioProtocolo = 'cooper' | 'astrand'

export interface Cardio {
  protocolo: CardioProtocolo
  /** Cooper: metros em 12 min · Åstrand: degraus/min. */
  metricaPrincipal: number | null
  /** Só o Åstrand precisa digitar — no Cooper o VO₂ sai da distância. */
  vo2Informado: number | null
  fcMedia: number | null
  fcRecuperacao: number | null
}

export interface ResistenciaLocal {
  flexoesMax: number | null
  abdominais1min: number | null
  pranchaSegundos: number | null
}

export interface Funcional {
  rm: OneRM
  fms: FMS | null
  flexibilidade: Flexibilidade | null
  cardio: Cardio | null
  resistenciaLocal: ResistenciaLocal | null
}

/* ---------- Avaliação ---------- */

export interface AvaliadorRef {
  id: string
  nome: string
  iniciais: string
  /** "CRN 3-45678" · "CREF 012345-G/SP" */
  registro: string
  conselho: Conselho
  atuacao: string
}

export interface PacienteAvaliacao {
  id: string
  nome: string
  iniciais: string
  idade: number
  sexo: Sexo
  convenio: string
  /** Uma linha do que não pode passar batido na hora de medir. */
  observacaoCritica: string | null
  objetivo: ObjetivoId
  nivelAtividade: NivelAtividade
  /** Meta de % de gordura combinada com o paciente. Alimenta o peso-alvo. */
  metaGorduraPct: number | null
}

export type StatusAvaliacao = 'rascunho' | 'concluida'

/** As duas metades do formulário. Só a antropometria é comum aos dois conselhos. */
export type AbaFormulario = 'antropometria' | 'funcional'

export interface Avaliacao {
  id: string
  pacienteId: string
  data: string
  dataLabel: string
  avaliador: AvaliadorRef
  protocolo: ProtocoloId | null
  status: StatusAvaliacao
  medidas: Medidas
  condicao: CondicaoFisica
  fotos: Fotos
  /** `null` quando a avaliação foi só antropométrica — o caso da nutrição. */
  funcional: Funcional | null
  /** Leitura do avaliador. Vira a evolução no prontuário quando concluída. */
  parecer: string
  /** Marcado quando o %G exibido veio da balança, e não das dobras. */
  usarBioimpedancia: boolean
  /** Se o paciente vê esta avaliação no app. O pool da clínica já é compartilhado
   *  entre os profissionais; o que precisa de decisão é o que sai para fora dela. */
  visivelAoPaciente: boolean
}

/* ---------- Dados da section ---------- */

export interface PacienteComHistorico {
  paciente: PacienteAvaliacao
  avaliacoes: Avaliacao[]
}

export interface AvaliacaoFisicaData {
  clinica: string
  /** O avaliador logado no preview de cada tela. */
  avaliadorLogado: AvaliadorRef
  pacientes: PacienteComHistorico[]
}

/* ---------- Props dos componentes exportáveis ---------- */

export interface NovaAvaliacaoFormProps {
  paciente: PacienteAvaliacao
  avaliador: AvaliadorRef
  avaliacao: Avaliacao
  /** Avaliação anterior do mesmo paciente, para o delta ao vivo. `null` na primeira. */
  anterior: Avaliacao | null
  aba: AbaFormulario
  onAba: (aba: AbaFormulario) => void
  onData: (data: string) => void
  onMedidas: (medidas: Medidas) => void
  onProtocolo: (protocolo: ProtocoloId) => void
  onUsarBioimpedancia: (usar: boolean) => void
  onCondicao: (condicao: CondicaoFisica) => void
  onFotos: (fotos: Fotos) => void
  onFuncional: (funcional: Funcional | null) => void
  onParecer: (texto: string) => void
  onVisivelAoPaciente: (visivel: boolean) => void
  /** Objetivo e nível de atividade alimentam o GET — mudam o cálculo, então mudam aqui. */
  onObjetivo: (objetivo: ObjetivoId) => void
  onNivelAtividade: (nivel: NivelAtividade) => void
  onMetaGordura: (pct: number | null) => void
  onSalvarRascunho: () => void
  onConcluir: () => void
  onCancelar: () => void
}

export interface AvaliacoesListaProps {
  clinica: string
  pacientes: PacienteComHistorico[]
  conselhoFiltro: Conselho | 'todos'
  onConselhoFiltro: (c: Conselho | 'todos') => void
  onNova: (pacienteId: string) => void
  onAbrir: (pacienteId: string, avaliacaoId: string) => void
}

export interface ComparativoProps {
  paciente: PacienteAvaliacao
  /** Da mais antiga para a mais recente. */
  avaliacoes: Avaliacao[]
  atualId: string
  referenciaId: string
  onAtual: (id: string) => void
  onReferencia: (id: string) => void
  onExportar: () => void
  onEnviarAoPaciente: () => void
}
