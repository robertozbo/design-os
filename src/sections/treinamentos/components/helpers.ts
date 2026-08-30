import type { Modalidade, StatusTurma, TipoTurma, Turma } from '@/../product/sections/treinamentos/types'

export const MODALIDADE_LABEL: Record<Modalidade, string> = {
  presencial: 'Presencial',
  ead: 'EAD',
  semipresencial: 'Semipresencial',
}

export const TIPO_TURMA_LABEL: Record<TipoTurma, string> = {
  formacao_inicial: 'Formação inicial',
  periodico: 'Periódico',
  reciclagem: 'Reciclagem',
}

export const STATUS_TURMA_LABEL: Record<StatusTurma, string> = {
  agendada: 'Agendada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  certificados_emitidos: 'Certificados emitidos',
}

export const STATUS_TURMA_CLASSES: Record<StatusTurma, string> = {
  agendada:
    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  em_andamento:
    'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  concluida:
    'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  certificados_emitidos:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
}

export function formatHoras(horas: number): string {
  return Number.isInteger(horas) ? `${horas}h` : `${String(horas).replace('.', ',')}h`
}

export function formatData(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

export function formatPeriodo(turma: Turma): string {
  return turma.dataInicio === turma.dataFim
    ? formatData(turma.dataInicio)
    : `${formatData(turma.dataInicio)} – ${formatData(turma.dataFim)}`
}

export function somaDisciplinas(disciplinas: { horas: number }[]): number {
  return disciplinas.reduce((acc, d) => acc + (Number.isFinite(d.horas) ? d.horas : 0), 0)
}
