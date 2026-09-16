// Types for GLP-1 (Monitoramento de medicação + evolução de peso) — Mobile
//
// Módulo de acompanhamento para quem usa análogo de GLP-1 (semaglutida,
// tirzepatida, liraglutida, retatrutida). Duas metades:
//
// 1. MEDICAÇÃO  — o que usa, qual dose, com que frequência, onde aplicou,
//                 quanto doeu, como se sentiu.
// 2. EVOLUÇÃO   — peso inicial → peso atual → meta, com projeção até a data alvo.
//
// Backend esperado: `glp1_protocols` (configuração), `glp1_applications`
// (aplicações) e reuso de `metrics` (weight/height) + `users` (birthDate, sex)
// para o prefill do wizard.

// ============================================================================
// Catálogo de medicamentos
// ============================================================================

export type PrincipioAtivo =
  | 'tirzepatida'
  | 'semaglutida'
  | 'liraglutida'
  | 'retatrutida'
  | 'outro'

/** Marca de referência, genérico registrado ou manipulado/composto. */
export type TipoMedicamento = 'referencia' | 'generico' | 'composto' | 'outro'

export type ViaAdministracao = 'subcutanea' | 'oral'

export interface MedicamentoCatalogo {
  id: string
  /** Nome comercial como o paciente reconhece ("Mounjaro®"). */
  nome: string
  principio: PrincipioAtivo
  tipo: TipoMedicamento
  via: ViaAdministracao
  /** Escala de titulação do fármaco, em labels prontos ("0.25 mg"). */
  doses: string[]
}

export const PRINCIPIO_LABEL: Record<PrincipioAtivo, string> = {
  tirzepatida: 'Tirzepatida',
  semaglutida: 'Semaglutida',
  liraglutida: 'Liraglutida',
  retatrutida: 'Retatrutida',
  outro: 'Outro',
}

export const TIPO_LABEL: Record<TipoMedicamento, string> = {
  referencia: 'Referência',
  generico: 'Genérico',
  composto: 'Manipulado',
  outro: '',
}

// ============================================================================
// Frequência de aplicação
// ============================================================================

export type Frequencia =
  | 'diaria'
  | 'semanal'
  | 'quinzenal'
  | 'mensal'
  | 'outro'
  | 'nao_sei'

export const FREQUENCIA_LABEL: Record<Frequencia, string> = {
  diaria: 'Diariamente',
  semanal: 'Semanalmente',
  quinzenal: 'A cada duas semanas',
  mensal: 'Mensalmente',
  outro: 'Outro',
  nao_sei: 'Ainda não sei',
}

/** Intervalo em dias — usado pra calcular a próxima dose. */
export const FREQUENCIA_DIAS: Record<Frequencia, number | null> = {
  diaria: 1,
  semanal: 7,
  quinzenal: 14,
  mensal: 30,
  outro: null,
  nao_sei: null,
}

export type DiaSemana = 'dom' | 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab'

export const DIA_SEMANA_LABEL: Record<DiaSemana, string> = {
  dom: 'Domingo',
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
}

// ============================================================================
// Sítio de aplicação — 8 zonas rotacionáveis (subcutâneo)
// ============================================================================

export type SitioAplicacao =
  | 'abdome_sup_esq'
  | 'abdome_sup_dir'
  | 'abdome_inf_esq'
  | 'abdome_inf_dir'
  | 'coxa_esq'
  | 'coxa_dir'
  | 'braco_esq'
  | 'braco_dir'

export const SITIO_LABELS: Record<SitioAplicacao, string> = {
  abdome_sup_esq: 'Abdômen sup. esq.',
  abdome_sup_dir: 'Abdômen sup. dir.',
  abdome_inf_esq: 'Abdômen inf. esq.',
  abdome_inf_dir: 'Abdômen inf. dir.',
  coxa_esq: 'Coxa esquerda',
  coxa_dir: 'Coxa direita',
  braco_esq: 'Braço esquerdo',
  braco_dir: 'Braço direito',
}

// ============================================================================
// Perfil corporal (prefill vindo do app)
// ============================================================================

/** De onde cada dado veio — o wizard mostra badge "do seu perfil". */
export type OrigemDado = 'perfil' | 'manual' | 'ausente'

export interface Glp1Perfil {
  /** ISO date (users.birthDate). */
  nascimento: string | null
  /** Idade computada — null quando não há nascimento. */
  idade: number | null
  sexo: 'M' | 'F' | null
  alturaCm: number | null
  /** Peso no dia em que o protocolo começou. */
  pesoInicialKg: number | null
  /** Último registro de peso (metrics.weight). */
  pesoAtualKg: number | null
  /** Data ISO do último peso — o wizard avisa se estiver velho. */
  pesoAtualizadoEm: string | null
  origem: {
    nascimento: OrigemDado
    altura: OrigemDado
    peso: OrigemDado
  }
}

// ============================================================================
// Meta de peso
// ============================================================================

export interface Glp1Meta {
  pesoAlvoKg: number
  /** ISO date. */
  dataAlvo: string
}

// ============================================================================
// Configuração do protocolo (saída do wizard)
// ============================================================================

export interface Glp1Configuracao {
  medicamentoId: string
  medicamentoNome: string
  principio: PrincipioAtivo
  via: ViaAdministracao
  /** Label da dose ("5 mg") ou null quando o paciente não sabe ainda. */
  dose: string | null
  frequencia: Frequencia
  /** Só faz sentido em semanal/quinzenal. */
  diaSemana: DiaSemana | null
  /** "20:00" — base do lembrete. */
  horario: string
  perfil: Glp1Perfil
  meta: Glp1Meta
  /** ISO date de início do acompanhamento. */
  iniciadoEm: string
  lembreteAtivo: boolean
}

// ============================================================================
// Aplicações registradas
// ============================================================================

export interface Glp1Aplicacao {
  id: string
  /** ISO datetime. */
  aplicadaEm: string
  /** Label curto pronto ("há 2 dias"). */
  haLabel: string
  medicamentoNome: string
  dose: string
  sitio: SitioAplicacao
  /** 0–10. */
  dor: number
  observacao: string | null
  /** Peso registrado no dia da aplicação, quando houver. */
  pesoNoDiaKg: number | null
}

// ============================================================================
// Evolução de peso
// ============================================================================

export interface PontoPeso {
  /** ISO date. */
  data: string
  pesoKg: number
  /** true = projeção linear até a data alvo (linha tracejada). */
  projetado: boolean
  /** Houve aplicação nesse dia — vira marcador no gráfico. */
  aplicacao: boolean
}

export type PeriodoGrafico = '30D' | '90D' | 'TUDO'

// ============================================================================
// Stats do painel
// ============================================================================

export interface Glp1Stats {
  pesoAtualKg: number
  pesoInicialKg: number
  /** pesoInicial - pesoAtual (positivo = perdeu). */
  perdidoKg: number
  perdidoPct: number
  imc: number | null
  imcClassificacao: string | null
  /** pesoAtual - pesoAlvo. */
  faltaKg: number
  /** Dias até data alvo. */
  diasRestantes: number
  /** Ritmo médio realizado, kg/semana. */
  ritmoSemanalKg: number
  /** Ritmo necessário pra bater a meta no prazo, kg/semana. */
  ritmoNecessarioKg: number
  /** Projeção: bate a meta antes, em cima ou depois do prazo. */
  projecao: 'adiantado' | 'no_prazo' | 'atrasado'
  dosesAplicadas: number
  dosesEsperadas: number
  /** 0–100. */
  adesaoPct: number
  semanasTratamento: number
  proximaDose: ProximaDose | null
}

export interface ProximaDose {
  /** ISO date. */
  data: string
  /** "Quinta, 18/09" */
  label: string
  /** Negativo = atrasada. */
  emDias: number
  atrasada: boolean
}

// ============================================================================
// Payloads dos formulários
// ============================================================================

export interface NovaAplicacaoPayload {
  medicamentoId: string
  dose: string
  sitio: SitioAplicacao
  dor: number
  observacao: string | null
  /** ISO datetime. */
  aplicadaEm: string
  /** Peso do dia, quando o paciente aproveita pra atualizar. */
  pesoKg: number | null
}

export interface ConfiguracaoPayload {
  medicamentoId: string
  dose: string | null
  frequencia: Frequencia
  diaSemana: DiaSemana | null
  horario: string
  nascimento: string | null
  alturaCm: number | null
  pesoAtualKg: number | null
  pesoAlvoKg: number
  dataAlvo: string
  lembreteAtivo: boolean
}

// ============================================================================
// Section data + props
// ============================================================================

export interface Glp1Data {
  /** null = paciente ainda não configurou → tela de boas-vindas + wizard. */
  configuracao: Glp1Configuracao | null
  /** O que o app já sabe sobre o paciente, pra pré-preencher o wizard. */
  perfilPrefill: Glp1Perfil
  catalogo: MedicamentoCatalogo[]
  stats: Glp1Stats | null
  aplicacoes: Glp1Aplicacao[]
  evolucaoPeso: PontoPeso[]
  /** Sítios das 2 últimas aplicações — hint de rotação no formulário. */
  sitiosRecentes: SitioAplicacao[]
  /** Sítio usado 3× seguidas — alerta de lipodistrofia. */
  sitioSaturado: SitioAplicacao | null
}

export interface Glp1Props {
  data: Glp1Data
  onSalvarConfiguracao?: (payload: ConfiguracaoPayload) => void
  onSalvarAplicacao?: (payload: NovaAplicacaoPayload) => void
  onVerHistoricoCompleto?: () => void
  onFalarComMedico?: () => void
}
