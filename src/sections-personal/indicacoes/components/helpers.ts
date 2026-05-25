import { Link as LinkIcon, Mail, MessageCircle, QrCode } from 'lucide-react'
import type { ConviteCanal } from '@/../product-personal/sections/indicacoes/types'

export interface CanalStyle {
  label: string
  shortLabel: string
  icon: React.ElementType
  badge: string
  iconBg: string
  iconColor: string
  description: string
}

export const CANAL_STYLE: Record<ConviteCanal, CanalStyle> = {
  link: {
    label: 'Link compartilhável',
    shortLabel: 'Link',
    icon: LinkIcon,
    badge: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
    iconColor: 'text-teal-600 dark:text-teal-400',
    description: 'Copia e cola onde quiser — WhatsApp, email, etc.',
  },
  qr: {
    label: 'QR code',
    shortLabel: 'QR',
    icon: QrCode,
    badge:
      'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    description: 'Pra usar em sessão presencial.',
  },
  email: {
    label: 'Email automático',
    shortLabel: 'Email',
    icon: Mail,
    badge:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    description: 'Sistema dispara o email pelo Nymos.',
  },
  'sms-whatsapp': {
    label: 'SMS / WhatsApp',
    shortLabel: 'SMS/WP',
    icon: MessageCircle,
    badge:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    description: 'Envia direto · custa R$0,15 por envio.',
  },
}

export function diasParaData(dataISO: string): number {
  const d = new Date(dataISO)
  const hoje = new Date()
  d.setHours(0, 0, 0, 0)
  hoje.setHours(0, 0, 0, 0)
  return Math.round((d.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
}

export function diasDesdeData(dataISO: string): number {
  return -diasParaData(dataISO)
}

export function formatHaDias(dataISO: string): string {
  const dias = diasDesdeData(dataISO)
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  if (dias < 30) return `há ${dias} dias`
  const meses = Math.round(dias / 30)
  return meses === 1 ? 'há 1 mês' : `há ${meses} meses`
}

export function formatExpiraEm(dataISO: string): { texto: string; tone: 'normal' | 'amber' | 'rose' } {
  const dias = diasParaData(dataISO)
  if (dias < 0) return { texto: `expirou há ${Math.abs(dias)} dias`, tone: 'rose' }
  if (dias === 0) return { texto: 'expira hoje', tone: 'rose' }
  if (dias <= 7) return { texto: `expira em ${dias} dias`, tone: 'amber' }
  return { texto: `expira em ${dias} dias`, tone: 'normal' }
}

export function progressoPendente(enviadoEm: string, expiraEm: string): number {
  const total = new Date(expiraEm).getTime() - new Date(enviadoEm).getTime()
  const decorrido = Date.now() - new Date(enviadoEm).getTime()
  return Math.max(0, Math.min(100, (decorrido / total) * 100))
}
