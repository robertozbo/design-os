import type {
  CorProfissao,
  GrupoConduta,
  TomAlerta,
} from '@/../product-clinic/sections/atendimento/types'

interface CorMeta {
  chip: string
  barra: string
  texto: string
  borda: string
  fundo: string
}

/** Cada conselho tem um tom próprio — o profissional reconhece a tela dele antes de ler o título. */
export const COR_PROFISSAO: Record<CorProfissao, CorMeta> = {
  sky: {
    chip: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    barra: 'bg-sky-500',
    texto: 'text-sky-600 dark:text-sky-400',
    borda: 'border-sky-200 dark:border-sky-900/60',
    fundo: 'bg-sky-50/60 dark:bg-sky-950/25',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    barra: 'bg-emerald-500',
    texto: 'text-emerald-600 dark:text-emerald-400',
    borda: 'border-emerald-200 dark:border-emerald-900/60',
    fundo: 'bg-emerald-50/60 dark:bg-emerald-950/25',
  },
  violet: {
    chip: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    barra: 'bg-violet-500',
    texto: 'text-violet-600 dark:text-violet-400',
    borda: 'border-violet-200 dark:border-violet-900/60',
    fundo: 'bg-violet-50/60 dark:bg-violet-950/25',
  },
}

export const TOM_ALERTA: Record<TomAlerta, string> = {
  info: 'bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  atencao: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  risco: 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
}

export const GRUPO_CONDUTA: Record<GrupoConduta, string> = {
  eletroterapia: 'Eletroterapia',
  cinesioterapia: 'Cinesioterapia',
  'terapia-manual': 'Terapia manual',
  crioterapia: 'Crioterapia',
}

/** EVA e escalas de sintoma: verde embaixo, vermelho em cima. Nunca o contrário. */
export function corEva(valor: number): string {
  if (valor <= 3) return 'bg-emerald-500'
  if (valor <= 6) return 'bg-amber-400'
  return 'bg-rose-500'
}

export function textoEva(valor: number): string {
  if (valor <= 3) return 'text-emerald-600 dark:text-emerald-400'
  if (valor <= 6) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

export function numero(valor: number, casas = 1): string {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

/** Delta com sinal, já no tom certo: para peso e gordura, cair é melhorar. */
export function delta(atual: number, anterior: number, menorEhMelhor = true) {
  const d = atual - anterior
  const bom = menorEhMelhor ? d < 0 : d > 0
  return {
    valor: d,
    label: `${d > 0 ? '+' : ''}${numero(d)}`,
    cor: d === 0
      ? 'text-slate-400'
      : bom
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400',
  }
}
