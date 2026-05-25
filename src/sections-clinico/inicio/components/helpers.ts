import type {
  StatusAgendamento,
  TipoAtencao,
  Prioridade,
} from '@/../product-clinico/sections/inicio/types'

export function formatRelativoMin(min: number): string {
  if (min < 0) return 'agora'
  if (min < 60) return `em ${min} min`
  if (min < 60 * 24) {
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `em ${h}h${m.toString().padStart(2, '0')}` : `em ${h}h`
  }
  const d = Math.floor(min / 60 / 24)
  return `em ${d} ${d === 1 ? 'dia' : 'dias'}`
}

export const STATUS_LABEL: Record<StatusAgendamento, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  'em-andamento': 'Em andamento',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
  faltou: 'Faltou',
}

export const STATUS_DOT: Record<StatusAgendamento, string> = {
  pendente: 'bg-amber-500',
  confirmado: 'bg-teal-500',
  'em-andamento': 'bg-teal-500 animate-pulse',
  realizado: 'bg-slate-400 dark:bg-slate-600',
  cancelado: 'bg-slate-300 dark:bg-slate-700',
  faltou: 'bg-rose-500',
}

export const STATUS_TEXT: Record<StatusAgendamento, string> = {
  pendente: 'text-amber-700 dark:text-amber-300',
  confirmado: 'text-teal-700 dark:text-teal-300',
  'em-andamento': 'text-teal-700 dark:text-teal-300',
  realizado: 'text-slate-500 dark:text-slate-400',
  cancelado: 'text-slate-400 dark:text-slate-500',
  faltou: 'text-rose-700 dark:text-rose-300',
}

export const ATENCAO_LABEL: Record<TipoAtencao, string> = {
  'exame-novo': 'Exame novo',
  'mensagem-clinica': 'Mensagem clínica',
  'retorno-atrasado': 'Retorno atrasado',
  'adesao-critica': 'Adesão crítica',
}

export const ATENCAO_STYLE: Record<
  TipoAtencao,
  { bg: string; text: string; border: string; iconBg: string; iconText: string }
> = {
  'exame-novo': {
    bg: 'bg-violet-50/60 dark:bg-violet-950/20',
    text: 'text-violet-900 dark:text-violet-100',
    border: 'border-violet-200/70 dark:border-violet-900/40',
    iconBg: 'bg-violet-100 dark:bg-violet-950/60',
    iconText: 'text-violet-700 dark:text-violet-300',
  },
  'mensagem-clinica': {
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    text: 'text-emerald-900 dark:text-emerald-100',
    border: 'border-emerald-200/70 dark:border-emerald-900/40',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    iconText: 'text-emerald-700 dark:text-emerald-300',
  },
  'retorno-atrasado': {
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    text: 'text-amber-900 dark:text-amber-100',
    border: 'border-amber-200/70 dark:border-amber-900/40',
    iconBg: 'bg-amber-100 dark:bg-amber-950/60',
    iconText: 'text-amber-700 dark:text-amber-300',
  },
  'adesao-critica': {
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    text: 'text-rose-900 dark:text-rose-100',
    border: 'border-rose-200/70 dark:border-rose-900/40',
    iconBg: 'bg-rose-100 dark:bg-rose-950/60',
    iconText: 'text-rose-700 dark:text-rose-300',
  },
}

export const PRIORIDADE_DOT: Record<Prioridade, string> = {
  alta: 'bg-rose-500',
  media: 'bg-amber-500',
  baixa: 'bg-slate-400 dark:bg-slate-600',
}
