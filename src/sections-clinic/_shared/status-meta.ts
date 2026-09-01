import type { StatusConsulta } from '@/../product-clinic/sections/_shared/status'

export interface StatusMeta {
  label: string
  /** Bolinha — usada na legenda, no bloco da grade e no chip. */
  dot: string
  /** Pílula com fundo. Antes existia como `badge` na Agenda e `chip` no Início. */
  chip: string
  /** Reduz opacidade / risca: o agendamento não vai mais acontecer. */
  esmaecido: boolean
}

/**
 * Aparência de cada status — **um mapa só** para Agenda e Início.
 *
 * As duas telas mantinham mapas próprios que divergiam em três pontos, e cada
 * divergência dizia uma coisa diferente sobre o mesmo agendamento:
 *
 * - `confirmado` era emerald na Agenda e teal no Início → fica **emerald**.
 *   Teal é a cor da marca Nymos; gastá-la num status faz o estado competir com
 *   a identidade.
 * - `realizado` esmaecia no Início e não na Agenda → **não esmaece**. Realizado
 *   é o desfecho bom; apagá-lo sugere irrelevância. Esmaecido fica para o que
 *   não aconteceu.
 * - `chegou` (ex-`aguardando`) era amber, a mesma cor de `pendente` na Agenda —
 *   dois estados opostos com a mesma leitura visual. Agora é **sky**: distinto
 *   de pendente (amber), de confirmado (emerald) e do teal pulsante do
 *   atendimento em curso.
 */
export const STATUS_META: Record<StatusConsulta, StatusMeta> = {
  pendente: {
    label: 'Pendente',
    dot: 'bg-amber-400',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    esmaecido: false,
  },
  confirmado: {
    label: 'Confirmado',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    esmaecido: false,
  },
  chegou: {
    label: 'Chegou',
    dot: 'bg-sky-500',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
    esmaecido: false,
  },
  'em-atendimento': {
    label: 'Em atendimento',
    dot: 'bg-teal-500 animate-pulse',
    chip: 'bg-teal-500 text-white dark:bg-teal-500',
    esmaecido: false,
  },
  realizado: {
    label: 'Realizado',
    dot: 'bg-slate-400',
    chip: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    esmaecido: false,
  },
  cancelado: {
    label: 'Cancelado',
    dot: 'bg-slate-300',
    chip: 'bg-slate-100 text-slate-400 line-through dark:bg-slate-800 dark:text-slate-500',
    esmaecido: true,
  },
  faltou: {
    label: 'Faltou',
    dot: 'bg-rose-500',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
    esmaecido: true,
  },
}
