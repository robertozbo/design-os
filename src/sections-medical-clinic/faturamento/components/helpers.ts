import type {
  CorEspecialidade,
  FormaPgto,
  StatusCobranca,
} from '@/../product-medical-clinic/sections/faturamento/types'

export const AVATAR_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BADGE_COR: Record<CorEspecialidade, string> = {
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
}

export const FORMA_LABEL: Record<FormaPgto, string> = {
  pix: 'PIX',
  cartao: 'Cartão',
  convenio: 'Convênio',
  dinheiro: 'Dinheiro',
}

export const STATUS_META: Record<StatusCobranca, { label: string; badge: string }> = {
  pago: {
    label: 'Pago',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  pendente: {
    label: 'Pendente',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
  estornado: {
    label: 'Estornado',
    badge: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300',
  },
}

/** R$ 28.800 formatado pt-BR. */
export function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
export function dataCurta(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${d.getDate()} ${MESES[d.getMonth()]}`
}
