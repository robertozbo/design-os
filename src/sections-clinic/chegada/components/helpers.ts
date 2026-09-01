import type { LinhaChegada } from '@/../product-clinic/sections/chegada/types'

export const AVATAR_COR: Record<LinhaChegada['cor'], string> = {
  teal: 'bg-teal-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
}

/** "HH:MM" → minutos desde 00:00. */
export function minutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function dataExtenso(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return `${DIAS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

/** "1h05" / "23 min" — duração legível a partir de minutos. */
export function duracaoCurta(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  return `${h}h${String(min % 60).padStart(2, '0')}`
}

/**
 * Há quanto tempo esta pessoa está esperando, e quão ruim isso é.
 *
 * O limiar não é decoração: a recepção precisa ver a fila azedar **antes** de o
 * paciente vir reclamar no balcão. 15 min avisa, 30 min alarma.
 */
export function espera(linha: LinhaChegada, agora: string): { min: number; tom: string } | null {
  if (!linha.chegada || linha.status !== 'chegou') return null
  const min = Math.max(0, minutos(agora) - minutos(linha.chegada.hora))
  const tom =
    min >= 30
      ? 'text-rose-600 dark:text-rose-400'
      : min >= 15
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-slate-400 dark:text-slate-500'
  return { min, tom }
}

/**
 * Minutos de atraso de quem ainda **não** chegou e cuja hora já passou.
 * `null` quando não se aplica — quem chegou não está atrasado, e o futuro
 * também não.
 */
export function atraso(linha: LinhaChegada, agora: string): number | null {
  if (linha.chegada || linha.status === 'realizado' || linha.status === 'cancelado') return null
  if (linha.status === 'faltou' || linha.status === 'em-atendimento') return null
  const diff = minutos(agora) - minutos(linha.hora)
  return diff > 0 ? diff : null
}

export type GrupoChegada = 'na-clinica' | 'proximas' | 'encerradas'

/**
 * Em qual bloco da tela a linha cai.
 *
 * `em-atendimento` fica em **na-clinica** de propósito: a pessoa continua
 * fisicamente na casa, e some da vista da recepção se for tratada como
 * encerrada — que é exatamente quando alguém pergunta "cadê o paciente das
 * 10:30?".
 */
export function grupoDe(linha: LinhaChegada): GrupoChegada {
  if (linha.status === 'chegou' || linha.status === 'em-atendimento') return 'na-clinica'
  if (linha.status === 'realizado' || linha.status === 'faltou' || linha.status === 'cancelado') {
    return 'encerradas'
  }
  return 'proximas'
}

export interface GruposChegada {
  naClinica: LinhaChegada[]
  proximas: LinhaChegada[]
  encerradas: LinhaChegada[]
}

/**
 * Agrupa e ordena o dia. **Na clínica** ordena por hora de chegada (quem chegou
 * primeiro aparece primeiro — é a fila real, não a agendada); os outros dois
 * grupos ordenam pelo horário da consulta.
 */
export function agrupar(linhas: LinhaChegada[]): GruposChegada {
  const porHora = (a: LinhaChegada, b: LinhaChegada) => minutos(a.hora) - minutos(b.hora)
  const porChegada = (a: LinhaChegada, b: LinhaChegada) =>
    minutos(a.chegada?.hora ?? a.hora) - minutos(b.chegada?.hora ?? b.hora)

  return {
    naClinica: linhas.filter((l) => grupoDe(l) === 'na-clinica').sort(porChegada),
    proximas: linhas.filter((l) => grupoDe(l) === 'proximas').sort(porHora),
    encerradas: linhas.filter((l) => grupoDe(l) === 'encerradas').sort(porHora),
  }
}

export function filtrarPorNome(linhas: LinhaChegada[], busca: string): LinhaChegada[] {
  const q = busca.trim().toLowerCase()
  if (!q) return linhas
  return linhas.filter(
    (l) =>
      l.pacienteNome.toLowerCase().includes(q) || l.profissionalNome.toLowerCase().includes(q),
  )
}

export type ErroCodigo = 'nao-confere' | 'expirado' | 'ja-registrado'

export const ERRO_TEXTO: Record<ErroCodigo, string> = {
  'nao-confere': 'Código não confere com nenhuma consulta de hoje',
  expirado: 'Código expirado — peça para o paciente gerar outro',
  'ja-registrado': 'Chegada desta consulta já estava registrada',
}

/**
 * Resolve o código digitado contra o dia.
 *
 * No protótipo o código vem na própria linha, para a tela poder ser
 * experimentada sem o app. Na implementação isto é uma procedure: o código vive
 * no Redis com TTL de 5 min e nunca viaja junto da lista.
 */
export function acharPorCodigo(
  linhas: LinhaChegada[],
  codigo: string,
): { linha: LinhaChegada } | { erro: ErroCodigo } {
  const alvo = linhas.find((l) => l.codigo === codigo)
  if (!alvo) return { erro: 'nao-confere' }
  if (alvo.chegada) return { erro: 'ja-registrado' }
  return { linha: alvo }
}
