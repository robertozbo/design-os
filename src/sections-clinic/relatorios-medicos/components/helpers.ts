import type {
  ConsultaRef,
  CorEspecialidade,
  ModeloRelatorio,
  PacienteSelector,
  StatusRelatorio,
  TipoRelatorio,
} from '@/../product-clinic/sections/relatorios-medicos/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

interface StatusMeta {
  label: string
  chip: string
}

export const STATUS_META: Record<StatusRelatorio, StatusMeta> = {
  rascunho: {
    label: 'Rascunho',
    chip: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  emitido: {
    label: 'Emitido',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  enviado: {
    label: 'Enviado',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
}

export const TIPO_LABEL: Record<TipoRelatorio, string> = {
  'relatorio-medico': 'Relatório médico',
  atestado: 'Atestado',
  laudo: 'Laudo',
  declaracao: 'Declaração',
  evolucao: 'Evolução',
}

export const TIPO_CHIP: Record<TipoRelatorio, string> = {
  'relatorio-medico': 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  atestado: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  laudo: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  declaracao: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  evolucao: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
}

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

const MES_CURTO = MESES.map((m) => m.slice(0, 3))

/** '2026-08-18' → '18 de agosto de 2026'. Sem `new Date()`: fuso viraria o dia. */
export function dataExtenso(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return `${dia} de ${MESES[mes - 1]} de ${ano}`
}

/** '2026-08-18' → '18 ago 2026'. */
export function dataCurta(iso: string): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return `${String(dia).padStart(2, '0')} ${MES_CURTO[mes - 1]} ${ano}`
}

/** Soma dias corridos a uma data ISO, sem passar por Date (evita o off-by-one de fuso). */
export function somarDias(iso: string, dias: number): string {
  const [ano, mes, dia] = iso.split('-').map(Number)
  const base = Date.UTC(ano, mes - 1, dia) + dias * 86_400_000
  const d = new Date(base)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate(),
  ).padStart(2, '0')}`
}

const EXTENSO = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
  'onze',
  'doze',
  'treze',
  'quatorze',
  'quinze',
]

/** 2 → '02 (dois) dias'. Atestado com número só em algarismo é o que mais volta rasurado. */
export function diasExtenso(dias: number): string {
  const porExtenso = EXTENSO[dias] ?? String(dias)
  return `${String(dias).padStart(2, '0')} (${porExtenso}) ${dias === 1 ? 'dia' : 'dias'}`
}

function minusculaInicial(texto: string): string {
  return texto.charAt(0).toLowerCase() + texto.slice(1)
}

export interface ContextoRelatorio {
  paciente: PacienteSelector
  consulta: ConsultaRef
  medico: string
  crm: string
  especialidade: string
  clinica: string
  /** Só para atestado. */
  dias: number
  /** Só para evolução: consulta mais antiga do paciente. */
  primeiraConsulta: ConsultaRef
}

function valores(ctx: ContextoRelatorio): Record<string, string> {
  const { paciente, consulta } = ctx
  return {
    paciente: paciente.nome,
    idade: String(paciente.idade),
    cpf: paciente.cpf,
    convenio: paciente.convenio,
    dataConsulta: dataExtenso(consulta.data),
    dataRetorno: dataExtenso(somarDias(consulta.data, ctx.dias)),
    motivo: minusculaInicial(consulta.motivo),
    avaliacao: consulta.avaliacao,
    conduta: minusculaInicial(consulta.conduta),
    cid: consulta.cid ?? '',
    horaInicio: consulta.horaInicio,
    horaFim: consulta.horaFim,
    diasExtenso: diasExtenso(ctx.dias),
    periodo: `${dataExtenso(ctx.primeiraConsulta.data)} a ${dataExtenso(consulta.data)}`,
    especialidade: ctx.especialidade,
    medico: ctx.medico,
    crm: ctx.crm,
    clinica: ctx.clinica,
  }
}

/**
 * Preenche o modelo com paciente + consulta. Parágrafo cujo placeholder resolve vazio é
 * **descartado** — sem CID registrado na consulta, a linha "CID-10: ." não pode ir para o papel;
 * documento médico com lacuna impressa é o tipo de erro que volta do convênio.
 */
export function preencherModelo(modelo: ModeloRelatorio, ctx: ContextoRelatorio): string[] {
  const mapa = valores(ctx)
  const saida: string[] = []

  for (const paragrafo of modelo.corpo) {
    const chaves = [...paragrafo.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])
    if (chaves.some((c) => !mapa[c])) continue
    saida.push(paragrafo.replace(/\{\{(\w+)\}\}/g, (_, c: string) => mapa[c]))
  }

  return saida
}

/** REL-2026-0148 → REL-2026-0149. */
export function proximoNumero(numeros: string[]): string {
  const maior = numeros.reduce((max, n) => {
    const seq = Number(n.split('-').pop())
    return Number.isFinite(seq) && seq > max ? seq : max
  }, 0)
  return `REL-2026-${String(maior + 1).padStart(4, '0')}`
}
