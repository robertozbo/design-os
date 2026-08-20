import type { StatusLinha } from '@/../product-clinic/sections/meus-recebimentos/types'

export function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

/** Sem centavos — para número grande de destaque, onde os centavos só poluem. */
export function brlCurto(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

interface StatusMeta {
  label: string
  chip: string
  barra: string
  texto: string
}

export const STATUS_META: Record<StatusLinha, StatusMeta> = {
  liberado: {
    label: 'Liberado',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    barra: 'bg-emerald-500',
    texto: 'text-emerald-600 dark:text-emerald-400',
  },
  aguardando: {
    label: 'Em aberto',
    chip: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    barra: 'bg-amber-400',
    texto: 'text-amber-600 dark:text-amber-400',
  },
}

/** Barra por tipo de atendimento — tom fixo, para a leitura não mudar entre competências. */
export function barraServico(nome: string): string {
  switch (nome) {
    case 'Consulta':
      return 'bg-teal-500'
    case 'Retorno':
      return 'bg-sky-500'
    case 'Teleatendimento':
      return 'bg-violet-500'
    case 'Sessão / procedimento':
      return 'bg-emerald-500'
    default:
      return 'bg-slate-400'
  }
}
