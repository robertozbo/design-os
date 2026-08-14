import type { Passo, ServicoExposto, StatusPreAgendamento, SeveridadeRegra } from '@/../product-clinic/sections/agendamento-whatsapp/types'

/** Bolha do chat: uma linha do bot ou a escolha do paciente ecoada. */
export interface Bolha {
  id: string
  autor: 'bot' | 'paciente'
  texto: string
}

export function passoPorId(passos: Passo[], id: string): Passo | undefined {
  return passos.find((p) => p.id === id)
}

/** Monta as bolhas iniciais do simulador a partir do passo de entrada. */
export function bolhasIniciais(passos: Passo[], passoInicial: string): Bolha[] {
  const passo = passoPorId(passos, passoInicial)
  if (!passo) return []
  return passo.bot.map((texto, i) => ({ id: `${passo.id}-b${i}`, autor: 'bot' as const, texto }))
}

/**
 * Negrito do WhatsApp (`**texto**`) em fragmentos, para renderizar sem `dangerouslySetInnerHTML`.
 * Índice par = texto normal, ímpar = negrito.
 */
export function fragmentosNegrito(texto: string): string[] {
  return texto.split(/\*\*(.+?)\*\*/g)
}

export function moeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Linha de resumo de um serviço, como o bot escreveria. */
export function resumoServico(s: ServicoExposto): string {
  return s.preco === 0 ? `${s.duracaoMin} min · sem custo` : `${s.duracaoMin} min · R$ ${moeda(s.preco)}`
}

export const CORES_STATUS: Record<StatusPreAgendamento, string> = {
  pendente:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/60',
  confirmado:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/60',
  recusado:
    'bg-slate-100 text-slate-500 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

export const ROTULO_STATUS: Record<StatusPreAgendamento, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  recusado: 'Recusado',
}

export const CORES_SEVERIDADE: Record<SeveridadeRegra, string> = {
  urgencia:
    'border-rose-200 bg-rose-50/70 dark:border-rose-900/60 dark:bg-rose-950/30',
  clinico:
    'border-amber-200 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/20',
  administrativo:
    'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60',
}

export const ROTULO_SEVERIDADE: Record<SeveridadeRegra, string> = {
  urgencia: 'Emergência',
  clinico: 'Clínico',
  administrativo: 'Administrativo',
}
