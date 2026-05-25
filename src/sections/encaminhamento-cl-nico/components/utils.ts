import {
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Mail,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  UserPlus,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type {
  Referral,
  ReferralStatus,
  ReferralTab,
  SignalPriority,
  TimelineActor,
  TimelineEventType,
  Language,
  PartnerProfessional,
} from '@/../product/sections/encaminhamento-cl-nico/types'

export const STATUS_TO_TAB: Record<ReferralStatus, ReferralTab> = {
  sugestao: 'sugestoes',
  aguardando: 'aguardando',
  em_atendimento: 'em_atendimento',
  concluido: 'concluidos',
  recusado: 'concluidos',
  cancelado: 'concluidos',
}

export const TAB_META: Record<
  ReferralTab,
  { label: string; description: string }
> = {
  sugestoes: {
    label: 'Sugestões',
    description: 'Sinais de risco individual sinalizados pelo sistema',
  },
  aguardando: {
    label: 'Aguardando consentimento',
    description: 'Convites enviados, aguardando resposta do trabalhador',
  },
  em_atendimento: {
    label: 'Em atendimento',
    description: 'Trabalhador aceitou e está em acompanhamento clínico',
  },
  concluidos: {
    label: 'Concluídos',
    description: 'Atendimentos finalizados, recusados ou cancelados',
  },
}

export const TAB_ORDER: ReferralTab[] = [
  'sugestoes',
  'aguardando',
  'em_atendimento',
  'concluidos',
]

export interface Tone {
  label: string
  bg: string
  text: string
  ring: string
  rail: string
  dot: string
}

export const PRIORITY_TONE: Record<SignalPriority, Tone> = {
  critico: {
    label: 'Crítico',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-900/60',
    rail: 'bg-rose-500 dark:bg-rose-400',
    dot: 'bg-rose-500',
  },
  alto: {
    label: 'Alto',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-900/60',
    rail: 'bg-amber-500 dark:bg-amber-400',
    dot: 'bg-amber-500',
  },
  moderado: {
    label: 'Moderado',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900/60',
    rail: 'bg-violet-500 dark:bg-violet-400',
    dot: 'bg-violet-500',
  },
}

export const STATUS_META: Record<ReferralStatus, { label: string; tone: 'teal' | 'amber' | 'violet' | 'emerald' | 'slate' | 'rose' }> = {
  sugestao: { label: 'Sugestão', tone: 'amber' },
  aguardando: { label: 'Aguardando', tone: 'violet' },
  em_atendimento: { label: 'Em atendimento', tone: 'teal' },
  concluido: { label: 'Concluído', tone: 'emerald' },
  recusado: { label: 'Recusado', tone: 'slate' },
  cancelado: { label: 'Cancelado', tone: 'slate' },
}

export const STATUS_TONE_CLASS: Record<
  'teal' | 'amber' | 'violet' | 'emerald' | 'slate' | 'rose',
  { bg: string; text: string; ring: string }
> = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    ring: 'ring-teal-200 dark:ring-teal-900/60',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-200 dark:ring-amber-900/60',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'ring-violet-200 dark:ring-violet-900/60',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-200 dark:ring-emerald-900/60',
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    text: 'text-slate-600 dark:text-slate-300',
    ring: 'ring-slate-200 dark:ring-slate-700',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-200 dark:ring-rose-900/60',
  },
}

export const ACTOR_TONE: Record<TimelineActor, { label: string; bg: string; text: string }> = {
  sistema: {
    label: 'Sistema',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
  },
  sst: {
    label: 'Profissional SST',
    bg: 'bg-teal-100 dark:bg-teal-950/50',
    text: 'text-teal-700 dark:text-teal-300',
  },
  trabalhador: {
    label: 'Trabalhador',
    bg: 'bg-violet-100 dark:bg-violet-950/50',
    text: 'text-violet-700 dark:text-violet-300',
  },
  professional: {
    label: 'Profissional clínico',
    bg: 'bg-emerald-100 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
}

export const EVENT_ICON: Record<TimelineEventType, LucideIcon> = {
  signal_detected: AlertTriangle,
  invite_sent: Mail,
  reminder_sent: RotateCcw,
  professional_assigned: UserPlus,
  consent_accepted: UserCheck,
  consent_declined: XCircle,
  session_completed: Calendar,
  completed: CheckCircle2,
  cancelled: XCircle,
}

export const SUCCESS_ICON = Check
export const PRIVACY_ICON = ShieldCheck

export const LANGUAGE_LABEL: Record<Language, { label: string; flag: string }> = {
  pt: { label: 'Português', flag: 'PT' },
  en: { label: 'English', flag: 'EN' },
  es: { label: 'Español', flag: 'ES' },
}

export const INVITE_TEMPLATES: Record<Language, string> = {
  pt: 'Identificamos sinais que sugerem um momento de atenção à sua saúde mental. Conversamos com discrição: sua participação é voluntária, sua identidade só é compartilhada com o profissional clínico parceiro caso você aceite, e nada disso é repassado ao seu empregador.',
  en: 'We have identified signals that suggest your mental wellbeing deserves attention. Your participation is fully voluntary; your identity is only shared with the partner clinical professional if you accept, and none of this is sent to your employer.',
  es: 'Detectamos señales que sugieren un momento de atención a su salud mental. Su participación es voluntaria, su identidad solo se comparte con el profesional clínico aliado si usted acepta, y nada de esto se comunica a su empleador.',
}

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

export function formatRelative(iso: string): string {
  const target = new Date(iso).getTime()
  const now = Date.now()
  const diffMs = target - now
  const diffMin = Math.round(diffMs / 60000)
  const diffH = Math.round(diffMs / 3600000)
  const diffD = Math.round(diffMs / 86400000)
  if (Math.abs(diffMin) < 60) return RELATIVE_FORMATTER.format(diffMin, 'minute')
  if (Math.abs(diffH) < 24) return RELATIVE_FORMATTER.format(diffH, 'hour')
  return RELATIVE_FORMATTER.format(diffD, 'day')
}

export function formatAbsolute(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeInState(referral: Referral): string {
  const since = new Date(referral.lastTransitionAt).getTime()
  const now = Date.now()
  const days = Math.floor((now - since) / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'há 1 dia'
  return `há ${days} dias`
}

export function partnerById(
  list: PartnerProfessional[],
  id: string | null | undefined,
): PartnerProfessional | undefined {
  if (!id) return undefined
  return list.find((p) => p.id === id)
}

export function getInitials(name: string): string {
  const parts = name.replace(/^(Dra?\.?|Dr\.?|Sra?\.?|Sr\.?)\s+/i, '').trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}
