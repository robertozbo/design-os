import type {
  ClasseTerapeutica,
  FiltroStatus,
  MotivoCancelamento,
  OrigemPrescricao,
  StatusPrescricao,
} from '@/../product-clinico/sections/prescricao/types'

export function formatDataBR(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDataCurta(iso: string): string {
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function formatDataLonga(iso: string): string {
  const d = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export const STATUS_LABEL: Record<StatusPrescricao, string> = {
  ativa: 'Ativa',
  expirada: 'Expirada',
  cancelada: 'Cancelada',
}

export const STATUS_BADGE_CLASS: Record<StatusPrescricao, string> = {
  ativa:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
  expirada:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
  cancelada:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300',
}

export const ORIGEM_LABEL: Record<OrigemPrescricao, string> = {
  consulta: 'Consulta',
  renovacao_sem_consulta: 'Renovação',
  prescricao_avulsa: 'Avulsa',
}

export const ORIGEM_LABEL_CURTA: Record<OrigemPrescricao, string> = {
  consulta: 'consulta',
  renovacao_sem_consulta: 'renovação',
  prescricao_avulsa: 'avulsa',
}

export const FILTRO_STATUS_OPCOES: { id: FiltroStatus; label: string; alerta?: boolean }[] = [
  { id: 'ativa', label: 'Ativa' },
  { id: 'precisa_renovar', label: 'Precisa renovar', alerta: true },
  { id: 'expirada', label: 'Expirada' },
  { id: 'cancelada', label: 'Cancelada' },
]

export const PERIODO_OPCOES: { id: '7d' | '30d' | '90d' | 'tudo'; label: string }[] = [
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: '90d', label: '90 dias' },
  { id: 'tudo', label: 'Tudo' },
]

export const MOTIVO_LABEL: Record<MotivoCancelamento, string> = {
  erro_prescricao: 'Erro de prescrição',
  mudanca_conduta: 'Mudança de conduta',
  reacao_adversa: 'Reação adversa',
  outro: 'Outro',
}

export const CLASSE_CHIP: Record<ClasseTerapeutica, string> = {
  antidiabetico:
    'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300',
  'antidiabetico-glp1':
    'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300',
  'insulina-basal':
    'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300',
  'insulina-rapida':
    'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300',
  'hormonio-tireoidiano':
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
  antitireoidiano:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
  'beta-bloqueador':
    'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300',
  hipolipemiante:
    'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-300',
  suplemento:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
  insumo:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  outro:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
}

export interface ValidadeInfo {
  texto: string
  tone: 'normal' | 'amber' | 'red' | 'expirada'
}

export function describeValidade(diasAteVencer: number, status: StatusPrescricao): ValidadeInfo {
  if (status === 'cancelada') return { texto: 'Cancelada', tone: 'expirada' }
  if (status === 'expirada' || diasAteVencer < 0) {
    const abs = Math.abs(diasAteVencer)
    return { texto: `expirada há ${abs}d`, tone: 'expirada' }
  }
  if (diasAteVencer === 0) return { texto: 'vence hoje', tone: 'red' }
  if (diasAteVencer === 1) return { texto: 'vence amanhã', tone: 'red' }
  if (diasAteVencer <= 2) return { texto: `vence em ${diasAteVencer}d`, tone: 'red' }
  if (diasAteVencer <= 14) return { texto: `vence em ${diasAteVencer}d`, tone: 'amber' }
  return { texto: `vence em ${diasAteVencer}d`, tone: 'normal' }
}

export const VALIDADE_TONE_CLASS: Record<ValidadeInfo['tone'], string> = {
  normal: 'text-slate-500 dark:text-slate-400',
  amber: 'text-amber-700 dark:text-amber-400 font-medium',
  red: 'text-rose-700 dark:text-rose-400 font-semibold',
  expirada: 'text-slate-400 dark:text-slate-500 italic',
}

export function pluralReceitas(n: number) {
  return n === 1 ? '1 receita' : `${n} receitas`
}
