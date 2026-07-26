import type { StatusCredencial } from '@/../product-medical-clinic/sections/perfil/types'

export const CREDENCIAL_META: Record<
  StatusCredencial,
  { label: string; dot: string; badge: string }
> = {
  ativo: {
    label: 'Ativo',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  pendente: {
    label: 'Pendente',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
}
