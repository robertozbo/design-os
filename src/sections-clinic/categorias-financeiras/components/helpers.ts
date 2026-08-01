import type { Comportamento } from '@/../product-clinic/sections/categorias-financeiras/types'

export const COMPORTAMENTO_META: Record<Comportamento, { label: string; badge: string }> = {
  fixa: {
    label: 'Fixa',
    badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  },
  variavel: {
    label: 'Variável',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
}
