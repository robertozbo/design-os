import {
  Apple,
  Brain,
  Dumbbell,
  Activity,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'
import type {
  Consulta,
  StatusConsulta,
  TipoProfissional,
} from '@/../product-mobile/sections/consultas/types'

export const TIPO_VISUAL: Record<TipoProfissional, { icon: LucideIcon; bg: string; text: string; label: string }> = {
  nutricionista: { icon: Apple, bg: 'bg-emerald-500/15', text: 'text-emerald-300', label: 'Nutri' },
  personal: { icon: Dumbbell, bg: 'bg-teal-500/15', text: 'text-teal-300', label: 'Personal' },
  medico: { icon: Stethoscope, bg: 'bg-sky-500/15', text: 'text-sky-300', label: 'Médico' },
  psicologo: { icon: Brain, bg: 'bg-violet-500/15', text: 'text-violet-300', label: 'Psicólogo' },
  fisioterapeuta: { icon: Activity, bg: 'bg-amber-500/15', text: 'text-amber-300', label: 'Fisio' },
}

export const STATUS_VISUAL: Record<StatusConsulta, { label: string; cls: string }> = {
  scheduled: { label: 'Agendada', cls: 'bg-slate-800 text-slate-300' },
  confirmed: { label: 'Confirmada', cls: 'bg-teal-500/15 text-teal-300' },
  checked_in: { label: 'Chegou', cls: 'bg-teal-500/15 text-teal-300' },
  completed: { label: 'Realizada', cls: 'bg-slate-800 text-slate-400' },
  cancelled: { label: 'Cancelada', cls: 'bg-rose-500/10 text-rose-300' },
  no_show: { label: 'Faltou', cls: 'bg-rose-500/10 text-rose-300' },
}

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]
const DIAS_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

/**
 * A data é `YYYY-MM-DD` de calendário, sem fuso: montar por `new Date(iso)`
 * leria meia-noite UTC e, em São Paulo, voltaria um dia.
 */
function partes(data: string): { y: number; m: number; d: number } {
  const [y, m, d] = data.split('-').map(Number)
  return { y, m, d }
}

function diaDaSemana(data: string): string {
  const { y, m, d } = partes(data)
  return DIAS_SEMANA[new Date(y, m - 1, d).getDay()]
}

export function diaCurto(data: string): { dia: string; mes: string; semana: string } {
  const { m, d } = partes(data)
  return { dia: String(d).padStart(2, '0'), mes: MESES_CURTOS[m - 1], semana: diaDaSemana(data).slice(0, 3) }
}

export function dataPorExtenso(data: string): string {
  const { y, m, d } = partes(data)
  return `${diaDaSemana(data)}, ${d} de ${MESES[m - 1]} de ${y}`
}

export function chaveDoMes(data: string): string {
  const { y, m } = partes(data)
  return `${MESES[m - 1]} ${y}`
}

function minutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

function hhmm(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function horaFim(consulta: Consulta): string {
  return hhmm(minutos(consulta.hora) + consulta.duracaoMin)
}

/** A teleconsulta libera 15 minutos antes do horário marcado. */
export const MINUTOS_ANTES_TELECONSULTA = 15

export function liberacaoTeleconsulta(consulta: Consulta, agora: string): { liberada: boolean; liberaAs: string } {
  const libera = minutos(consulta.hora) - MINUTOS_ANTES_TELECONSULTA
  return { liberada: minutos(agora) >= libera, liberaAs: hhmm(libera) }
}

export function horaDeIso(iso: string): string {
  return iso.split('T')[1]?.slice(0, 5) ?? ''
}

const ENCERRADOS: StatusConsulta[] = ['completed', 'cancelled', 'no_show']

/** Próxima = de hoje em diante e ainda não encerrada. O resto é histórico. */
export function separar(consultas: Consulta[], hoje: string): { proximas: Consulta[]; anteriores: Consulta[] } {
  const ordem = (a: Consulta, b: Consulta) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`)
  const proximas = consultas
    .filter((c) => c.data >= hoje && !ENCERRADOS.includes(c.status))
    .sort(ordem)
  const anteriores = consultas
    .filter((c) => !proximas.includes(c))
    .sort((a, b) => ordem(b, a))
  return { proximas, anteriores }
}

export function iniciais(nome: string): string {
  const partesNome = nome.replace(/^(Dr|Dra)\.\s+/i, '').split(/\s+/)
  return (partesNome[0][0] + (partesNome[1]?.[0] ?? '')).toUpperCase()
}
