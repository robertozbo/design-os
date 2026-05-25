export function formatTempoDecorrido(seg: number): string {
  const min = Math.floor(seg / 60)
  const s = seg % 60
  return `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function formatDataBR(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativo(iso: string | null): string {
  if (!iso) return 'sem registro'
  const d = new Date(iso)
  const now = new Date()
  const diasAtras = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diasAtras === 0) return 'hoje'
  if (diasAtras === 1) return 'ontem'
  if (diasAtras < 7) return `há ${diasAtras} dias`
  if (diasAtras < 30) return `há ${Math.floor(diasAtras / 7)} sem`
  if (diasAtras < 365) return `há ${Math.floor(diasAtras / 30)} m`
  return `há ${Math.floor(diasAtras / 365)} a`
}

export function formatPercentAdesao(adesao: number | null): string {
  if (adesao === null) return '—'
  return `${Math.round(adesao * 100)}%`
}

export const SOAP_DESCRICAO = {
  S: 'O que o paciente conta — queixas, sintomas, contexto subjetivo.',
  O: 'O que se observa — exame físico, sinais vitais, dados objetivos.',
  A: 'A avaliação clínica — diagnóstico, hipóteses, raciocínio.',
  P: 'O plano — conduta, prescrição, orientações, retorno.',
} as const

export const ALERT_NIVEL_STYLE = {
  baixo: 'text-sky-600 dark:text-sky-400',
  normal: 'text-slate-600 dark:text-slate-400',
  alto: 'text-amber-600 dark:text-amber-400',
  critico: 'text-rose-600 dark:text-rose-400',
} as const
