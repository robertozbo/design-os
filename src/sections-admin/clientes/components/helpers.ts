import type { SituacaoCobranca, TipoWorkspace } from '@/../product-admin/sections/clientes/types'

/** Hoje, fixo — o preview precisa de datas estáveis para a imagem não mudar sozinha. */
export const HOJE = new Date('2026-09-18T12:00:00-03:00')

export const TIPO_LABEL: Record<TipoWorkspace, string> = {
  clinica: 'Clínica',
  profissional: 'Profissional',
  empresa: 'Empresa',
}

export const SITUACAO_META: Record<SituacaoCobranca, { label: string; badge: string }> = {
  ativo: {
    label: 'Ativo',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  trial: {
    label: 'Trial',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  inadimplente: {
    label: 'Inadimplente',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  },
  cancelado: {
    label: 'Cancelado',
    badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  },
}

/** R$ 9.035 — sem centavos, que é como se lê receita recorrente. */
export function reais(v: number): string {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function diasDesde(iso: string): number {
  return Math.floor((HOJE.getTime() - new Date(iso).getTime()) / 86_400_000)
}

/** "há 3 dias" · "hoje" — para último acesso. */
export function desde(iso: string): string {
  const d = diasDesde(iso)
  if (d <= 0) return 'hoje'
  if (d === 1) return 'ontem'
  return `há ${d} dias`
}

/**
 * O prazo em palavras, que é o que diz o que fazer hoje.
 *
 * Trial conta para frente ("termina em 4 dias"), inadimplência conta para trás
 * ("vencida há 12 dias") — o mesmo campo, lido em direções opostas conforme a situação.
 */
export function prazo(situacao: SituacaoCobranca, iso: string | null): string | null {
  if (!iso) return null
  const d = diasDesde(iso)
  if (situacao === 'trial') {
    if (d > 0) return 'trial vencido'
    if (d === 0) return 'termina hoje'
    const faltam = Math.abs(d)
    return `termina em ${faltam} ${faltam === 1 ? 'dia' : 'dias'}`
  }
  if (situacao === 'inadimplente') return `vencida há ${d} ${d === 1 ? 'dia' : 'dias'}`
  return null
}

/** Parado demais para uma conta que paga — o sinal de churn antes da fatura. */
export function paradoDemais(ultimoAcesso: string): boolean {
  return diasDesde(ultimoAcesso) > 30
}
