import type { Tema } from '@/../product-clinic/sections/configuracoes-medico/types'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** 14 mai 2026 */
export function dataLonga(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export const TEMA_OPCOES: { value: Tema; label: string }[] = [
  { value: 'claro', label: 'Claro' },
  { value: 'escuro', label: 'Escuro' },
  { value: 'sistema', label: 'Sistema' },
]
