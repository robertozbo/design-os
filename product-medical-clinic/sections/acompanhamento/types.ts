export type Tendencia = 'subindo' | 'descendo' | 'estavel'

/** Leitura clínica do valor — dita a cor, não o julgamento do dado bruto. */
export type NivelMetrica = 'normal' | 'atencao' | 'alterado'

/** De onde o dado veio. `manual` = o próprio paciente digitou. */
export type FonteDado = 'Apple Health' | 'Google Fit' | 'Garmin' | 'Balança' | 'Manual' | 'Clínica'

export interface PacienteRef {
  id: string
  nome: string
  iniciais: string
  idade: number
}

/** Um ponto da série temporal. `data` em ISO. */
export interface Ponto {
  data: string
  valor: number
}

export interface Metrica {
  id: string
  nome: string
  unidade: string
  valorAtual: number
  medidoEm: string
  /** Variação desde a última consulta — é o número que o médico procura. */
  variacao: number
  tendencia: Tendencia
  nivel: NivelMetrica
  /** Meta combinada com o paciente, quando existe. */
  meta: number | null
  fonte: FonteDado
  serie: Ponto[]
}

export interface Atividade {
  passosMedia: number
  minutosAtivosSemana: number
  treinosSemana: number
  /** % de dias com algum registro no período — mede engajamento, não desempenho. */
  adesao: number
  variacaoPassos: number
  serie: Ponto[]
}

export interface Bioimpedancia {
  id: string
  data: string
  pesoKg: number
  gorduraPct: number
  massaMagraKg: number
  aguaPct: number
  imc: number
  fonte: FonteDado
}

export interface MedidaCorporal {
  nome: string
  valor: number
  unidade: string
  /** Diferença para a avaliação anterior. */
  variacao: number
}

export interface AvaliacaoFisica {
  id: string
  data: string
  /** `null` = auto-medição do paciente, sem profissional presente. */
  avaliadoPor: string | null
  medidas: MedidaCorporal[]
}

export interface ExameCompartilhado {
  id: string
  nome: string
  data: string
  nivel: NivelMetrica
  resumo: string
}

/**
 * O que o paciente autorizou compartilhar. Sem consentimento não há dado — a tela mostra o escopo
 * bloqueado em vez de esconder, para o médico saber que existe e não foi liberado.
 */
export interface Consentimento {
  escopo: string
  compartilhado: boolean
  /** Desde quando vale o consentimento. `null` quando nunca foi concedido. */
  desde: string | null
}

export interface VinculoApp {
  desde: string
  ultimaSync: string
  dispositivos: string[]
}

export interface AcompanhamentoData {
  paciente: PacienteRef
  vinculo: VinculoApp
  /** Referência do "desde a última consulta" que aparece em todas as variações. */
  ultimaConsultaEm: string
  consentimentos: Consentimento[]
  metricas: Metrica[]
  atividade: Atividade
  bioimpedancias: Bioimpedancia[]
  avaliacoes: AvaliacaoFisica[]
  examesCompartilhados: ExameCompartilhado[]
}
