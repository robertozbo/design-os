import type { Conta, StatusConta } from '@/../product-clinic/sections/_contas/types'

export const STATUS_META: Record<StatusConta, { label: string; badge: string }> = {
  aberto: {
    label: 'Em aberto',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
  pago: {
    label: 'Pago',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  vencido: {
    label: 'Vencido',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  },
}

export function moeda(n: number): string {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Máscara de moeda ao vivo: dígitos = centavos → "15.000,00". */
export function mascaraMoeda(v: string): string {
  const d = v.replace(/\D/g, '')
  if (!d) return ''
  return (Number(d) / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Converte "1.234,50" | "1234.50" | "150" em número, tratando o ÚLTIMO separador como decimal. */
export function parseValorBR(v: string): number {
  const s = v.trim().replace(/[^\d.,]/g, '')
  const dec = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'))
  if (dec === -1) return Number(s) || 0
  const inteiro = s.slice(0, dec).replace(/[.,]/g, '')
  const frac = s.slice(dec + 1).replace(/[.,]/g, '')
  return Number(`${inteiro}.${frac}`) || 0
}

export function dataBR(iso: string): string {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

/** Deriva o status efetivo: aberto com vencimento passado vira "vencido". */
export function statusEfetivo(conta: Conta, hoje: string): StatusConta {
  if (conta.status === 'pago') return 'pago'
  return conta.vencimento < hoje ? 'vencido' : 'aberto'
}
