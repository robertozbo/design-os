/**
 * Motor de cálculo da avaliação física.
 *
 * As equações de densidade/%G são **cópia verbatim** de
 * `backend/src/lib/body-composition/protocols.ts`, e as tabelas de classificação vêm de
 * `backend/src/lib/body-composition/norms.ts` (Pollock & Wilmore 1993 para %G, OMS para IMC/RCQ/
 * cintura, Frisancho 1981 + Blackburn para CMB). Não redesenhe fórmula aqui: se o número mudar,
 * ele passa a discordar do que a clínica já calcula em produção — e o que vai para o prontuário
 * é este número.
 *
 * Nada aqui é armazenado. Tudo é derivado das medidas a cada tecla: resultado guardado ao lado da
 * medida que o gerou é a mesma armadilha do peso que muda sem o IMC acompanhar.
 */
import type {
  Cardio,
  CircunferenciaId,
  CondicaoFisica,
  DobraId,
  FMS,
  FMSTesteId,
  Funcional,
  LiberacaoMedica,
  Medidas,
  NivelAtividade,
  OneRM,
  ProtocoloId,
  RMTeste,
  Sexo,
} from '@/../product-clinic/sections/avaliacao-fisica/types'

export type Tom = 'emerald' | 'amber' | 'rose' | 'slate'

export interface Classificacao {
  label: string
  tom: Tom
}

/* ═══════════════ Catálogo de protocolos ═══════════════ */

export interface ProtocoloMeta {
  id: ProtocoloId
  label: string
  /** Dobras exigidas por sexo. Iguais nos dois quando o protocolo não separa. */
  dobras: Record<Sexo, DobraId[]>
  exigeIdade: boolean
  /** A equação, como o avaliador a conhece. Aparece na tela ao escolher o protocolo. */
  formula: string
  referencia: string
  /** População/faixa em que o protocolo foi validado — null quando é adulto geral. */
  populacao: string | null
}

export const PROTOCOLOS: ProtocoloMeta[] = [
  {
    id: 'jackson_pollock_3',
    label: 'Jackson-Pollock (3 dobras)',
    dobras: {
      M: ['peitoral', 'abdominal', 'coxa'],
      F: ['triceps', 'suprailiaca', 'coxa'],
    },
    exigeIdade: true,
    formula:
      'D = 1,10938 − 0,0008267·Σ3 + 0,0000016·Σ3² − 0,0002574·idade (♂) · D = 1,0994921 − 0,0009929·Σ3 + 0,0000023·Σ3² − 0,0001392·idade (♀)',
    referencia: 'Jackson & Pollock (1978/1980)',
    populacao: null,
  },
  {
    id: 'jackson_pollock_7',
    label: 'Jackson-Pollock (7 dobras)',
    dobras: {
      M: ['peitoral', 'axilarMedia', 'triceps', 'subescapular', 'abdominal', 'suprailiaca', 'coxa'],
      F: ['peitoral', 'axilarMedia', 'triceps', 'subescapular', 'abdominal', 'suprailiaca', 'coxa'],
    },
    exigeIdade: true,
    formula:
      'D = 1,112 − 0,00043499·Σ7 + 0,00000055·Σ7² − 0,00028826·idade (♂) · D = 1,097 − 0,00046971·Σ7 + 0,00000056·Σ7² − 0,00012828·idade (♀)',
    referencia: 'Jackson & Pollock (1978/1980)',
    populacao: null,
  },
  {
    id: 'durnin_womersley',
    label: 'Durnin-Womersley (4 dobras)',
    dobras: {
      M: ['biceps', 'triceps', 'subescapular', 'suprailiaca'],
      F: ['biceps', 'triceps', 'subescapular', 'suprailiaca'],
    },
    exigeIdade: true,
    formula: 'D = C − M·log₁₀(Σ4), com C e M por sexo e faixa etária',
    referencia: 'Durnin & Womersley (1974)',
    populacao: null,
  },
  {
    id: 'guedes',
    label: 'Guedes (3 dobras)',
    dobras: {
      M: ['triceps', 'suprailiaca', 'abdominal'],
      F: ['coxa', 'suprailiaca', 'subescapular'],
    },
    exigeIdade: false,
    formula:
      'D = 1,17136 − 0,06706·log₁₀(Σ3) (♂) · D = 1,1665 − 0,07063·log₁₀(Σ3) (♀)',
    referencia: 'Guedes (1994) — validado no Brasil',
    populacao: null,
  },
  {
    id: 'petroski',
    label: 'Petroski (4 dobras)',
    dobras: {
      M: ['subescapular', 'triceps', 'suprailiaca', 'panturrilha'],
      F: ['axilarMedia', 'suprailiaca', 'coxa', 'panturrilha'],
    },
    exigeIdade: true,
    formula:
      'D = 1,10726863 − 0,00081201·Σ4 + 0,00000212·Σ4² − 0,00041761·idade (♂) · D = 1,1954713 − 0,07513507·log₁₀(Σ4) − 0,00041072·idade (♀)',
    referencia: 'Petroski (1995) — validado no Brasil',
    populacao: '♀ validada entre 18 e 51 anos',
  },
  {
    id: 'faulkner',
    label: 'Faulkner (4 dobras)',
    dobras: {
      M: ['triceps', 'subescapular', 'suprailiaca', 'abdominal'],
      F: ['triceps', 'subescapular', 'suprailiaca', 'abdominal'],
    },
    exigeIdade: false,
    formula: '%G = (Σ4 × 0,153) + 5,783 — %G direto, sem densidade',
    referencia: 'Faulkner (1968)',
    populacao: null,
  },
  {
    id: 'yuhasz',
    label: 'Yuhasz (6 dobras)',
    dobras: {
      M: ['triceps', 'subescapular', 'suprailiaca', 'abdominal', 'coxa', 'panturrilha'],
      F: ['triceps', 'subescapular', 'suprailiaca', 'abdominal', 'coxa', 'panturrilha'],
    },
    exigeIdade: false,
    formula: '%G = 0,1051·Σ6 + 2,585 (♂) · %G = 0,1548·Σ6 + 3,580 (♀)',
    referencia: 'Yuhasz (1974)',
    populacao: null,
  },
  {
    id: 'lohman',
    label: 'Slaughter-Lohman (2 dobras)',
    dobras: { M: ['triceps', 'panturrilha'], F: ['triceps', 'panturrilha'] },
    exigeIdade: false,
    formula: '%G = 0,735·Σ2 + 1,0 (♂) · %G = 0,610·Σ2 + 5,1 (♀)',
    referencia: 'Slaughter & Lohman (1988)',
    populacao: 'infanto-juvenil, 8 a 18 anos',
  },
]

export const PROTOCOLO_POR_ID: Record<ProtocoloId, ProtocoloMeta> = Object.fromEntries(
  PROTOCOLOS.map((p) => [p.id, p]),
) as Record<ProtocoloId, ProtocoloMeta>

/* ═══════════════ Rótulos dos sítios ═══════════════ */

export const DOBRA_LABEL: Record<DobraId, string> = {
  peitoral: 'Peitoral',
  axilarMedia: 'Axilar média',
  triceps: 'Tricipital',
  biceps: 'Bíceps',
  subescapular: 'Subescapular',
  abdominal: 'Abdominal',
  suprailiaca: 'Supra-ilíaca',
  coxa: 'Coxa média',
  panturrilha: 'Panturrilha',
}

/** Ordem de exibição da grade — a mesma do form do personal, de cima para baixo do corpo. */
export const DOBRAS_ORDEM: DobraId[] = [
  'peitoral',
  'axilarMedia',
  'triceps',
  'biceps',
  'subescapular',
  'abdominal',
  'suprailiaca',
  'coxa',
  'panturrilha',
]

export interface CircunferenciaMeta {
  id: CircunferenciaId
  label: string
  grupo: 'Tronco' | 'Membros superiores' | 'Membros inferiores'
  min: number
  max: number
}

export const CIRCUNFERENCIAS: CircunferenciaMeta[] = [
  { id: 'pescoco', label: 'Pescoço', grupo: 'Tronco', min: 20, max: 70 },
  { id: 'torax', label: 'Tórax', grupo: 'Tronco', min: 50, max: 200 },
  { id: 'cintura', label: 'Cintura', grupo: 'Tronco', min: 40, max: 200 },
  { id: 'abdomen', label: 'Abdômen', grupo: 'Tronco', min: 40, max: 200 },
  { id: 'quadril', label: 'Quadril', grupo: 'Tronco', min: 40, max: 200 },
  { id: 'bracoRelaxado', label: 'Braço relaxado', grupo: 'Membros superiores', min: 15, max: 80 },
  { id: 'bracoContraido', label: 'Braço contraído', grupo: 'Membros superiores', min: 15, max: 80 },
  { id: 'antebraco', label: 'Antebraço', grupo: 'Membros superiores', min: 15, max: 60 },
  { id: 'coxa', label: 'Coxa', grupo: 'Membros inferiores', min: 25, max: 100 },
  { id: 'panturrilha', label: 'Panturrilha', grupo: 'Membros inferiores', min: 20, max: 80 },
]

/** Faixas de validação dos campos numéricos. Fora delas o campo fica em rose e trava o salvar. */
export const LIMITES = {
  pesoKg: { min: 20, max: 300 },
  alturaCm: { min: 100, max: 250 },
  dobraMm: { min: 2, max: 80 },
}

/* ═══════════════ Dobras e densidade ═══════════════ */

export function dobrasDoProtocolo(protocolo: ProtocoloId | null, sexo: Sexo): DobraId[] {
  if (!protocolo) return []
  return PROTOCOLO_POR_ID[protocolo].dobras[sexo]
}

/**
 * Σ das dobras **exigidas pelo protocolo**, e não das preenchidas: uma soma que ignora o sítio
 * que faltou não é uma soma parcial, é um número menor apresentado como se fosse o certo.
 */
export function somaDobras(
  dobras: Partial<Record<DobraId, number>>,
  protocolo: ProtocoloId | null,
  sexo: Sexo,
): number | null {
  const exigidas = dobrasDoProtocolo(protocolo, sexo)
  if (exigidas.length === 0) return null
  let soma = 0
  for (const d of exigidas) {
    const v = dobras[d]
    if (!v) return null
    soma += v
  }
  return soma
}

/** Siri (1961): converte densidade corporal em % de gordura. */
export function siri(densidade: number): number {
  return (4.95 / densidade - 4.5) * 100
}

export interface DensidadeGordura {
  densidade: number | null
  gorduraPct: number | null
}

/**
 * Densidade e % de gordura pelo protocolo. Verbatim de `computeDensityAndFat` no backend —
 * inclusive a equação ♀ logarítmica de Petroski, que substituiu a quadrática antiga (a quadrática
 * omitia massa e estatura e inflava ~20 pontos percentuais).
 */
export function densidadeEGordura(
  dobras: Partial<Record<DobraId, number>>,
  protocolo: ProtocoloId | null,
  sexo: Sexo,
  idade: number,
): DensidadeGordura {
  const isMale = sexo === 'M'
  const triceps = dobras.triceps
  const subscapular = dobras.subescapular
  const suprailiac = dobras.suprailiaca
  const abdominal = dobras.abdominal
  const chest = dobras.peitoral
  const thigh = dobras.coxa
  const midaxillary = dobras.axilarMedia
  const calf = dobras.panturrilha
  const biceps = dobras.biceps

  let density: number | null = null
  let fatPercent: number | null = null

  switch (protocolo) {
    case 'faulkner': {
      if (triceps && subscapular && suprailiac && abdominal) {
        const sum4 = triceps + subscapular + suprailiac + abdominal
        fatPercent = sum4 * 0.153 + 5.783
        density = 4.95 / (fatPercent / 100 + 4.5)
      }
      break
    }

    case 'jackson_pollock_3': {
      let sum3 = 0
      if (isMale) {
        if (chest && abdominal && thigh) sum3 = chest + abdominal + thigh
        else break
      } else {
        if (triceps && suprailiac && thigh) sum3 = triceps + suprailiac + thigh
        else break
      }
      density = isMale
        ? 1.10938 - 0.0008267 * sum3 + 0.0000016 * sum3 * sum3 - 0.0002574 * idade
        : 1.0994921 - 0.0009929 * sum3 + 0.0000023 * sum3 * sum3 - 0.0001392 * idade
      fatPercent = siri(density)
      break
    }

    case 'jackson_pollock_7': {
      if (chest && midaxillary && triceps && subscapular && abdominal && suprailiac && thigh) {
        const sum7 =
          chest + midaxillary + triceps + subscapular + abdominal + suprailiac + thigh
        density = isMale
          ? 1.112 - 0.00043499 * sum7 + 0.00000055 * sum7 * sum7 - 0.00028826 * idade
          : 1.097 - 0.00046971 * sum7 + 0.00000056 * sum7 * sum7 - 0.00012828 * idade
        fatPercent = siri(density)
      }
      break
    }

    case 'guedes': {
      if (isMale) {
        if (triceps && suprailiac && abdominal) {
          const sum3 = triceps + suprailiac + abdominal
          density = 1.17136 - 0.06706 * Math.log10(sum3)
        }
      } else {
        if (thigh && suprailiac && subscapular) {
          const sum3 = thigh + suprailiac + subscapular
          density = 1.1665 - 0.07063 * Math.log10(sum3)
        }
      }
      if (density) fatPercent = siri(density)
      break
    }

    case 'petroski': {
      if (isMale) {
        if (subscapular && triceps && suprailiac && calf) {
          const sum4 = subscapular + triceps + suprailiac + calf
          density =
            1.10726863 - 0.00081201 * sum4 + 0.00000212 * sum4 * sum4 - 0.00041761 * idade
        }
      } else {
        if (midaxillary && suprailiac && thigh && calf) {
          const sum4 = midaxillary + suprailiac + thigh + calf
          density = 1.1954713 - 0.07513507 * Math.log10(sum4) - 0.00041072 * idade
        }
      }
      if (density) fatPercent = siri(density)
      break
    }

    case 'durnin_womersley': {
      if (biceps && triceps && subscapular && suprailiac) {
        const s4 = biceps + triceps + subscapular + suprailiac
        const bandsM: [number, number, number][] = [
          [17, 1.1533, 0.0643],
          [20, 1.162, 0.063],
          [30, 1.1631, 0.0632],
          [40, 1.1422, 0.0544],
          [50, 1.162, 0.07],
          [Infinity, 1.1715, 0.0779],
        ]
        const bandsF: [number, number, number][] = [
          [17, 1.1369, 0.0598],
          [20, 1.1549, 0.0678],
          [30, 1.1599, 0.0717],
          [40, 1.1423, 0.0632],
          [50, 1.1333, 0.0612],
          [Infinity, 1.1339, 0.0645],
        ]
        const banda = (isMale ? bandsM : bandsF).find(([max]) => idade < max)
        if (banda) {
          density = banda[1] - banda[2] * Math.log10(s4)
          fatPercent = siri(density)
        }
      }
      break
    }

    case 'yuhasz': {
      if (triceps && subscapular && suprailiac && abdominal && thigh && calf) {
        const sum6 = triceps + subscapular + suprailiac + abdominal + thigh + calf
        fatPercent = isMale ? 0.1051 * sum6 + 2.585 : 0.1548 * sum6 + 3.58
      }
      break
    }

    case 'lohman': {
      if (triceps && calf) {
        const sum2 = triceps + calf
        fatPercent = isMale ? 0.735 * sum2 + 1.0 : 0.61 * sum2 + 5.1
      }
      break
    }
  }

  return { densidade: density, gorduraPct: fatPercent }
}

/* ═══════════════ Índices e classificações ═══════════════ */

export function calcularIMC(pesoKg: number | null, alturaCm: number | null): number | null {
  if (!pesoKg || !alturaCm) return null
  const m = alturaCm / 100
  return pesoKg / (m * m)
}

/** OMS. */
export function classificarIMC(imc: number | null): Classificacao | null {
  if (imc == null) return null
  if (imc < 18.5) return { label: 'Magreza', tom: 'amber' }
  if (imc < 25) return { label: 'Eutrófico', tom: 'emerald' }
  if (imc < 30) return { label: 'Sobrepeso', tom: 'amber' }
  if (imc < 35) return { label: 'Obesidade grau I', tom: 'rose' }
  if (imc < 40) return { label: 'Obesidade grau II', tom: 'rose' }
  return { label: 'Obesidade grau III', tom: 'rose' }
}

// %G — Pollock & Wilmore (1993). Faixas etárias e limiares idênticos ao backend.
const PG_FAIXAS = [25, 35, 45, 55, Infinity]
const PG_LIMIARES: Record<Sexo, number[][]> = {
  M: [
    [8, 12, 17, 20, 26],
    [12, 16, 22, 25, 28],
    [16, 19, 24, 27, 30],
    [18, 21, 26, 28, 32],
    [20, 22, 26, 28, 32],
  ],
  F: [
    [17, 20, 26, 29, 33],
    [18, 21, 27, 31, 36],
    [20, 24, 30, 33, 38],
    [23, 26, 32, 35, 39],
    [24, 27, 33, 36, 39],
  ],
}
const PG_ROTULOS: Classificacao[] = [
  { label: 'Muito baixo', tom: 'amber' },
  { label: 'Baixo', tom: 'emerald' },
  { label: 'Adequado', tom: 'emerald' },
  { label: 'Moderadamente alto', tom: 'amber' },
  { label: 'Alto', tom: 'amber' },
  { label: 'Muito alto', tom: 'rose' },
]

function faixaEtariaPG(idade: number): number {
  return Math.max(0, PG_FAIXAS.findIndex((max) => idade <= max))
}

export function classificarGordura(
  pg: number | null,
  sexo: Sexo,
  idade: number,
): Classificacao | null {
  if (pg == null) return null
  const [t1, t2, t3, t4, t5] = PG_LIMIARES[sexo][faixaEtariaPG(idade)]
  if (pg < t1) return PG_ROTULOS[0]
  if (pg < t2) return PG_ROTULOS[1]
  if (pg < t3) return PG_ROTULOS[2]
  if (pg < t4) return PG_ROTULOS[3]
  if (pg < t5) return PG_ROTULOS[4]
  return PG_ROTULOS[5]
}

/** Centro da faixa "Adequado" — é o alvo que o peso-alvo e o hint "ideal ~X kg" usam. */
export function gorduraAlvo(sexo: Sexo, idade: number): number {
  const [, t2, t3] = PG_LIMIARES[sexo][faixaEtariaPG(idade)]
  return Math.round(((t2 + t3) / 2) * 10) / 10
}

export function calcularRCQ(cintura?: number, quadril?: number): number | null {
  if (!cintura || !quadril) return null
  return cintura / quadril
}

/** OMS: ♂ 0,90 / 1,00 · ♀ 0,80 / 0,85. */
export function classificarRCQ(rcq: number | null, sexo: Sexo): Classificacao | null {
  if (rcq == null) return null
  const limMod = sexo === 'M' ? 0.9 : 0.8
  const limAlto = sexo === 'M' ? 1.0 : 0.85
  if (rcq < limMod) return { label: 'Risco baixo', tom: 'emerald' }
  if (rcq < limAlto) return { label: 'Risco moderado', tom: 'amber' }
  return { label: 'Risco alto', tom: 'rose' }
}

/** Risco cardiometabólico pela cintura. Cortes OMS/NIH: ♂ 94/102 · ♀ 80/88. */
export function classificarRiscoCintura(
  cinturaCm: number | undefined,
  sexo: Sexo,
): Classificacao | null {
  if (!cinturaCm) return null
  const [aumentado, substancial] = sexo === 'M' ? [94, 102] : [80, 88]
  if (cinturaCm < aumentado) return { label: 'Risco baixo', tom: 'emerald' }
  if (cinturaCm < substancial) return { label: 'Risco aumentado', tom: 'amber' }
  return { label: 'Risco substancialmente aumentado', tom: 'rose' }
}

/** CMB (cm) = braço(cm) − π × (tríceps_mm / 10). */
export function calcularCMB(bracoCm?: number, tricepsMm?: number): number | null {
  if (!bracoCm || !tricepsMm) return null
  return bracoCm - Math.PI * (tricepsMm / 10)
}

// Frisancho (1981) P50 + adequação de Blackburn.
const CMB_FAIXAS = [24, 34, 44, 54, 64, Infinity]
const CMB_P50: Record<Sexo, number[]> = {
  M: [27.3, 27.9, 28.6, 28.1, 27.8, 26.8],
  F: [20.7, 21.2, 21.8, 22.0, 22.5, 22.5],
}

export function classificarCMB(
  cmb: number | null,
  sexo: Sexo,
  idade: number,
): (Classificacao & { adequacao: number }) | null {
  if (cmb == null) return null
  const idx = Math.max(0, CMB_FAIXAS.findIndex((max) => idade <= max))
  const adequacao = (cmb / CMB_P50[sexo][idx]) * 100
  const base: Classificacao =
    adequacao >= 90
      ? { label: 'Eutrofia', tom: 'emerald' }
      : adequacao >= 80
        ? { label: 'Desnutrição leve', tom: 'amber' }
        : adequacao >= 70
          ? { label: 'Desnutrição moderada', tom: 'rose' }
          : { label: 'Desnutrição grave', tom: 'rose' }
  return { ...base, adequacao }
}

/**
 * Fracionamento em 4 compartimentos (Matiegka / constante residual de Würch: ♂ 24,1% · ♀ 20,9%).
 * Ossos exige diâmetros ósseos, que esta avaliação não coleta — fica em 0 e o restante vira
 * músculo. É leitura de proporção, não de massa óssea medida.
 */
export interface Composicao4 {
  gordura: number
  residual: number
  ossos: number
  musculos: number
}

export function composicao4(gorduraPct: number | null, sexo: Sexo): Composicao4 | null {
  if (gorduraPct == null) return null
  const residual = sexo === 'M' ? 24.1 : 20.9
  const musculos = Math.max(0, 100 - gorduraPct - residual)
  return { gordura: gorduraPct, residual, ossos: 0, musculos }
}

/* ═══════════════ Gasto energético ═══════════════ */

/**
 * TMB por Katch-McArdle: 370 + 21,6 × massa magra (kg).
 *
 * Escolha deliberada: a avaliação **mede** a massa magra, então usar uma equação que parte dela
 * é melhor que estimar por peso/altura/idade. Quando a balança de bioimpedância informa a TMB, é
 * ela que vale — o aparelho mediu, aqui se estima. Mifflin-St Jeor continua sendo o que o backend
 * usa em `ai-insights/utils/rda-guidelines.ts`, onde não há massa magra disponível.
 */
export function tmbKatchMcArdle(massaMagraKg: number | null): number | null {
  if (!massaMagraKg) return null
  return 370 + 21.6 * massaMagraKg
}

export const FATOR_ATIVIDADE: Record<NivelAtividade, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  atleta: 1.9,
}

export const NIVEL_ATIVIDADE_LABEL: Record<NivelAtividade, string> = {
  sedentario: 'Sedentário',
  leve: 'Leve · 1–3×/sem',
  moderado: 'Moderado · 3–5×/sem',
  intenso: 'Intenso · 6–7×/sem',
  atleta: 'Atleta · 2×/dia',
}

export function calcularGET(tmb: number | null, nivel: NivelAtividade): number | null {
  if (tmb == null) return null
  return tmb * FATOR_ATIVIDADE[nivel]
}

/**
 * Metas diárias derivadas da avaliação — os coeficientes são verbatim de
 * `backend/api/modules/ai-insights/utils/rda-guidelines.ts`.
 *
 * É aqui que a avaliação deixa de ser um laudo e vira insumo: sem esta ponte, a nutricionista
 * mede a composição corporal numa tela e digita a meta calórica do plano noutra, à mão, sem
 * nenhuma relação entre as duas.
 */
export interface MetasDiarias {
  proteinaG: number
  carboidratoG: number
  gorduraG: number
  fibraG: number
  aguaMl: number
}

const PROTEINA_POR_NIVEL: Record<NivelAtividade, number> = {
  sedentario: 1.0,
  leve: 1.1,
  moderado: 1.2,
  intenso: 1.4,
  atleta: 1.6,
}

export function metasDiarias(
  pesoKg: number | null,
  nivel: NivelAtividade,
): MetasDiarias | null {
  if (!pesoKg) return null
  return {
    proteinaG: Math.round(pesoKg * 0.8 * PROTEINA_POR_NIVEL[nivel]),
    carboidratoG: Math.round(pesoKg * 3),
    gorduraG: Math.round(pesoKg * 1),
    fibraG: 30,
    aguaMl: Math.round(pesoKg * 35),
  }
}

/**
 * Peso que o paciente teria mantendo a massa magra atual e chegando na meta de % de gordura
 * (Behnke). É o único jeito honesto de dar uma meta de peso: peso-alvo por IMC ignora quanto
 * daquele peso é músculo.
 */
export function pesoAlvo(massaMagraKg: number | null, metaGorduraPct: number | null): number | null {
  if (!massaMagraKg || metaGorduraPct == null || metaGorduraPct >= 100) return null
  return massaMagraKg / (1 - metaGorduraPct / 100)
}

/* ═══════════════ Funcional ═══════════════ */

/**
 * 1RM estimado por Brzycki: peso × 36 / (37 − reps).
 *
 * A equação é a mesma do spec da vertical Personal. Vale para teste submáximo: acima de ~10
 * repetições ela superestima, e é por isso que a tela mostra as repetições ao lado do resultado
 * em vez de só o 1RM — o número sozinho esconde de que teste ele veio.
 */
export function calcular1RMBrzycki(
  pesoKg: number | null,
  reps: number | null,
): number | null {
  if (!pesoKg || !reps || reps < 1 || reps > 36) return null
  return (pesoKg * 36) / (37 - reps)
}

export const FMS_TESTES: { id: FMSTesteId; label: string }[] = [
  { id: 'agachamentoProfundo', label: 'Agachamento profundo' },
  { id: 'passagemBarreira', label: 'Passagem sobre barreira' },
  { id: 'avancoLinha', label: 'Avanço em linha' },
  { id: 'mobilidadeOmbro', label: 'Mobilidade de ombro' },
  { id: 'elevacaoPernaEstendida', label: 'Elevação da perna estendida' },
  { id: 'estabilidadeTroncoFlexao', label: 'Estabilidade de tronco (flexão)' },
  { id: 'estabilidadeRotatoria', label: 'Estabilidade rotatória' },
]

export function fmsTotal(fms: FMS | null): number | null {
  if (!fms) return null
  return FMS_TESTES.reduce((soma, t) => soma + (fms[t.id] ?? 0), 0)
}

/**
 * FMS: o único corte validado é **14**. Abaixo dele, risco aumentado de lesão (Kiesel et al.).
 *
 * E há uma regra que o total esconde: **zero em qualquer sub-teste significa DOR**, não
 * desempenho ruim — o protocolo manda encaminhar antes de prescrever, mesmo com o total alto.
 * Por isso a dor é verificada separado da soma.
 */
export function classificarFMS(fms: FMS | null): Classificacao | null {
  const total = fmsTotal(fms)
  if (total == null || !fms) return null
  const comDor = FMS_TESTES.some((t) => fms[t.id] === 0)
  if (comDor) return { label: 'Dor em um teste — encaminhar', tom: 'rose' }
  if (total <= 14) return { label: 'Risco aumentado (≤ 14)', tom: 'amber' }
  return { label: 'Acima do corte', tom: 'emerald' }
}

/** Sub-testes pontuados com 0, isto é, com dor relatada durante a execução. */
export function fmsComDor(fms: FMS | null): FMSTesteId[] {
  if (!fms) return []
  return FMS_TESTES.filter((t) => fms[t.id] === 0).map((t) => t.id)
}

/** Cooper (1968): VO₂máx = (distância_m − 504,9) / 44,73. Só o Cooper tem forma fechada. */
export function vo2Cooper(distanciaM: number | null): number | null {
  if (!distanciaM) return null
  return (distanciaM - 504.9) / 44.73
}

export function vo2De(cardio: Cardio | null): number | null {
  if (!cardio) return null
  if (cardio.protocolo === 'cooper') return vo2Cooper(cardio.metricaPrincipal)
  // Åstrand sai de nomograma (carga × FC × idade), não de equação fechada — vem digitado.
  return cardio.vo2Informado
}

export interface ResumoFuncional {
  rm: { id: keyof OneRM; label: string; estimado: number | null; teste: RMTeste | null }[]
  totalRM: number | null
  /** Soma dos três 1RM dividida pelo peso corporal. */
  forcaRelativa: number | null
  fmsTotal: number | null
  fmsClasse: Classificacao | null
  fmsComDor: FMSTesteId[]
  vo2: number | null
}

export const RM_LABEL: Record<keyof OneRM, string> = {
  supino: 'Supino',
  agachamento: 'Agachamento',
  levantamentoTerra: 'Levantamento terra',
}

export function resumirFuncional(
  funcional: Funcional | null,
  pesoKg: number | null,
): ResumoFuncional {
  const rm = (Object.keys(RM_LABEL) as (keyof OneRM)[]).map((id) => {
    const teste = funcional?.rm[id] ?? null
    return {
      id,
      label: RM_LABEL[id],
      estimado: calcular1RMBrzycki(teste?.pesoTesteKg ?? null, teste?.repsTeste ?? null),
      teste,
    }
  })
  const estimados = rm.map((x) => x.estimado).filter((v): v is number => v != null)
  const totalRM = estimados.length > 0 ? estimados.reduce((a, b) => a + b, 0) : null

  return {
    rm,
    totalRM,
    forcaRelativa: totalRM != null && pesoKg ? totalRM / pesoKg : null,
    fmsTotal: fmsTotal(funcional?.fms ?? null),
    fmsClasse: classificarFMS(funcional?.fms ?? null),
    fmsComDor: fmsComDor(funcional?.fms ?? null),
    vo2: vo2De(funcional?.cardio ?? null),
  }
}

export const FUNCIONAL_VAZIO: Funcional = {
  rm: { supino: null, agachamento: null, levantamentoTerra: null },
  fms: null,
  flexibilidade: null,
  cardio: null,
  resistenciaLocal: null,
}

export const CONDICAO_VAZIA: CondicaoFisica = {
  lesoesAtuais: '',
  cirurgiasPrevias: '',
  restricoes: '',
  liberacaoMedica: 'nao-informado',
  liberacaoNota: '',
}

export const LIBERACAO_LABEL: Record<LiberacaoMedica, string> = {
  'nao-informado': 'Não informado',
  liberado: 'Liberado',
  'com-restricoes': 'Com restrições',
  contraindicado: 'Contraindicado',
}

export const LIBERACAO_TOM: Record<LiberacaoMedica, Tom> = {
  'nao-informado': 'slate',
  liberado: 'emerald',
  'com-restricoes': 'amber',
  contraindicado: 'rose',
}

/* ═══════════════ Resultado consolidado ═══════════════ */

export interface Resultado {
  imc: number | null
  imcClasse: Classificacao | null
  somaDobras: number | null
  densidade: number | null
  gorduraPct: number | null
  /** De onde veio o %G exibido — a tela precisa dizer, senão dois números viram um só. */
  gorduraOrigem: 'dobras' | 'bioimpedancia' | null
  gorduraClasse: Classificacao | null
  gorduraAlvoPct: number
  massaGordaKg: number | null
  massaMagraKg: number | null
  massaGordaAlvoKg: number | null
  massaMagraAlvoKg: number | null
  rcq: number | null
  rcqClasse: Classificacao | null
  cinturaCm: number | null
  cinturaClasse: Classificacao | null
  rce: number | null
  cmb: number | null
  cmbClasse: (Classificacao & { adequacao: number }) | null
  composicao: Composicao4 | null
  tmb: number | null
  get: number | null
  metas: MetasDiarias | null
  pesoAlvoKg: number | null
  /** Dobras que o protocolo exige e ainda não foram medidas. */
  faltando: DobraId[]
}

export interface ContextoCalculo {
  sexo: Sexo
  idade: number
  nivelAtividade: NivelAtividade
  metaGorduraPct: number | null
}

/**
 * Uma passada só sobre as medidas. A tela não calcula nada por conta própria — todo número
 * exibido sai daqui, com a mesma entrada, na mesma tecla.
 */
export function calcular(
  medidas: Medidas,
  protocolo: ProtocoloId | null,
  ctx: ContextoCalculo,
  usarBioimpedancia: boolean,
): Resultado {
  const { sexo, idade } = ctx
  const imc = calcularIMC(medidas.pesoKg, medidas.alturaCm)
  const soma = somaDobras(medidas.dobras, protocolo, sexo)
  const porDobras = densidadeEGordura(medidas.dobras, protocolo, sexo, idade)
  const bio = medidas.bioimpedancia

  const usaBio = usarBioimpedancia && bio?.gorduraPct != null
  const gorduraPct = usaBio ? bio!.gorduraPct : porDobras.gorduraPct
  const gorduraOrigem = gorduraPct == null ? null : usaBio ? 'bioimpedancia' : 'dobras'

  const peso = medidas.pesoKg
  const massaGordaKg = gorduraPct != null && peso ? (gorduraPct / 100) * peso : null
  const massaMagraKg =
    usaBio && bio?.massaMagraKg != null
      ? bio.massaMagraKg
      : massaGordaKg != null && peso
        ? peso - massaGordaKg
        : null

  const alvoPct = gorduraAlvo(sexo, idade)
  const massaGordaAlvoKg = peso ? (alvoPct / 100) * peso : null
  const massaMagraAlvoKg = peso && massaGordaAlvoKg != null ? peso - massaGordaAlvoKg : null

  const c = medidas.circunferencias
  const rcq = calcularRCQ(c.cintura, c.quadril)
  const rce = c.cintura && medidas.alturaCm ? c.cintura / medidas.alturaCm : null
  const cmb = calcularCMB(c.bracoRelaxado, medidas.dobras.triceps)

  // A TMB do aparelho vence a estimada: o aparelho mediu, a equação estima.
  const tmb = usaBio && bio?.tmbKcal != null ? bio.tmbKcal : tmbKatchMcArdle(massaMagraKg)

  const exigidas = dobrasDoProtocolo(protocolo, sexo)

  return {
    imc,
    imcClasse: classificarIMC(imc),
    somaDobras: soma,
    densidade: usaBio ? null : porDobras.densidade,
    gorduraPct,
    gorduraOrigem,
    gorduraClasse: classificarGordura(gorduraPct, sexo, idade),
    gorduraAlvoPct: alvoPct,
    massaGordaKg,
    massaMagraKg,
    massaGordaAlvoKg,
    massaMagraAlvoKg,
    rcq,
    rcqClasse: classificarRCQ(rcq, sexo),
    cinturaCm: c.cintura ?? null,
    cinturaClasse: classificarRiscoCintura(c.cintura, sexo),
    rce,
    cmb,
    cmbClasse: classificarCMB(cmb, sexo, idade),
    composicao: composicao4(gorduraPct, sexo),
    tmb,
    get: calcularGET(tmb, ctx.nivelAtividade),
    metas: metasDiarias(peso, ctx.nivelAtividade),
    pesoAlvoKg: pesoAlvo(massaMagraKg, ctx.metaGorduraPct),
    faltando: exigidas.filter((d) => !medidas.dobras[d]),
  }
}
