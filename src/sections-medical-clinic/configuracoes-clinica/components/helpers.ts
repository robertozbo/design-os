import { Download, LogIn, Pencil, ShieldCheck, ToggleRight, UserPlus } from 'lucide-react'
import type { AcaoAudit, CorPapel, StatusConsentimento } from '@/../product-medical-clinic/sections/configuracoes-clinica/types'

export const AVATAR_COR: Record<CorPapel, string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

export const BADGE_COR: Record<CorPapel, string> = {
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  violet: 'bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300',
  slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  sky: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
}

export const ACAO_META: Record<AcaoAudit, { label: string; Icon: typeof Pencil; cls: string }> = {
  entrou: { label: 'Entrou', Icon: LogIn, cls: 'text-slate-500' },
  editou: { label: 'Editou', Icon: Pencil, cls: 'text-amber-600 dark:text-amber-400' },
  convidou: { label: 'Convidou', Icon: UserPlus, cls: 'text-sky-600 dark:text-sky-400' },
  integrou: { label: 'Integração', Icon: ToggleRight, cls: 'text-teal-600 dark:text-teal-400' },
  exportou: { label: 'Exportou', Icon: Download, cls: 'text-violet-600 dark:text-violet-400' },
  consentimento: {
    label: 'Consentimento',
    Icon: ShieldCheck,
    cls: 'text-emerald-600 dark:text-emerald-400',
  },
}

export const CONSENT_META: Record<StatusConsentimento, { label: string; badge: string }> = {
  ativo: {
    label: 'Ativo',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  },
  rascunho: {
    label: 'Rascunho',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  },
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "30 jun 2026" a partir de ISO date. */
export function dataCurta(iso: string): string {
  const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso)
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

const HOJE = new Date('2026-07-23T12:00:00')

/** "há 3d", "há 2h" — relativo a uma data de referência fixa (protótipo). */
export function relativo(iso: string): string {
  const d = new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso)
  const min = Math.round((HOJE.getTime() - d.getTime()) / 60000)
  if (min < 60) return `há ${Math.max(1, min)}min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h}h`
  const dias = Math.round(h / 24)
  if (dias < 30) return `há ${dias}d`
  const meses = Math.round(dias / 30)
  return `há ${meses}mes${meses > 1 ? 'es' : ''}`
}
