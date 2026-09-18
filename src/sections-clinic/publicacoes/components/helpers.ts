import type {
  AlertaCompliance,
  TemplateId,
  Conselho,
  FiltroPublicacao,
  FormatoPublicacao,
  Publicacao,
  StatusPublicacao,
} from '@/../product-clinic/sections/publicacoes/types'

/** "hoje 11:00" · "sex, 19 set · 11:00" — data curta pt-BR, sem ano quando é deste ano. */
export function quando(iso: string | null): string {
  if (!iso) return 'sem data'
  const d = new Date(iso)
  const hoje = new Date('2026-09-17T12:00:00-03:00')
  const mesmoDia = d.toDateString() === hoje.toDateString()
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (mesmoDia) return `hoje · ${hora}`
  const dia = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  return `${dia.replace('.', '')} · ${hora}`
}

/** "1º de outubro" — para a renovação da cota. */
export function dataLonga(iso: string): string {
  const d = new Date(iso)
  const dia = d.getDate()
  const mes = d.toLocaleDateString('pt-BR', { month: 'long' })
  return `${dia === 1 ? '1º' : dia} de ${mes}`
}

/** Dias inteiros até a data. Negativo = já passou. */
export function diasAte(iso: string): number {
  const agora = new Date('2026-09-17T12:00:00-03:00').getTime()
  return Math.ceil((new Date(iso).getTime() - agora) / 86_400_000)
}

export const DIA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export const FORMATO_LABEL: Record<FormatoPublicacao, string> = {
  feed: 'Feed',
  carrossel: 'Carrossel',
  story: 'Story',
}

interface StatusMeta {
  label: string
  /** Classe do badge, light + dark. */
  badge: string
  /** Cor do ponto na lista. */
  ponto: string
}

export const STATUS_META: Record<StatusPublicacao, StatusMeta> = {
  rascunho: {
    label: 'Rascunho',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    ponto: 'bg-slate-300 dark:bg-slate-600',
  },
  gerando: {
    label: 'Gerando…',
    badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
    ponto: 'bg-violet-400',
  },
  revisar: {
    label: 'Revisar',
    badge: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
    ponto: 'bg-teal-500',
  },
  agendado: {
    label: 'Agendado',
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    ponto: 'bg-sky-500',
  },
  publicando: {
    label: 'Publicando',
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
    ponto: 'bg-sky-400 animate-pulse',
  },
  publicado: {
    label: 'Publicado',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    ponto: 'bg-emerald-500',
  },
  falhou: {
    label: 'Falhou',
    badge: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    ponto: 'bg-red-500',
  },
  bloqueado: {
    label: 'Bloqueado',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    ponto: 'bg-amber-500',
  },
}

/**
 * Acento do cartão → classes do template.
 *
 * Mapa explícito com as classes inteiras porque o Tailwind lê o código-fonte: classe
 * montada por interpolação (`bg-${cor}-500`) não existe no CSS gerado.
 */
export const ACENTO: Record<string, { fundo: string; barra: string; texto: string }> = {
  teal: { fundo: 'bg-teal-600', barra: 'bg-teal-300', texto: 'text-teal-100' },
  emerald: { fundo: 'bg-emerald-600', barra: 'bg-emerald-300', texto: 'text-emerald-100' },
  sky: { fundo: 'bg-sky-600', barra: 'bg-sky-300', texto: 'text-sky-100' },
  violet: { fundo: 'bg-violet-600', barra: 'bg-violet-300', texto: 'text-violet-100' },
  amber: { fundo: 'bg-amber-500', barra: 'bg-amber-200', texto: 'text-amber-50' },
  rose: { fundo: 'bg-rose-600', barra: 'bg-rose-300', texto: 'text-rose-100' },
  stone: { fundo: 'bg-stone-600', barra: 'bg-stone-300', texto: 'text-stone-100' },
}

export function acentoDe(nome: string) {
  return ACENTO[nome] ?? ACENTO.teal
}

const GRUPO: Record<FiltroPublicacao, StatusPublicacao[] | null> = {
  tudo: null,
  revisar: ['rascunho', 'gerando', 'revisar'],
  agendados: ['agendado', 'publicando'],
  publicados: ['publicado'],
  problemas: ['falhou', 'bloqueado'],
}

export function filtrar(pubs: Publicacao[], filtro: FiltroPublicacao): Publicacao[] {
  const grupo = GRUPO[filtro]
  return grupo ? pubs.filter((p) => grupo.includes(p.status)) : pubs
}

export function contarPorFiltro(pubs: Publicacao[], filtro: FiltroPublicacao): number {
  return filtrar(pubs, filtro).length
}

/** Bloqueio pendente é o que separa "pode agendar" de "precisa reescrever". */
export function temBloqueio(p: Publicacao): boolean {
  return p.alertas.some((a) => a.severidade === 'bloqueio')
}

/**
 * Por que NÃO pode agendar. `null` = pode.
 *
 * Devolve o motivo em vez de um booleano porque a tela precisa dele no `title` do
 * botão desabilitado — botão morto sem explicação é o que faz o usuário clicar duas
 * vezes e abrir ticket.
 */
export function motivoNaoAgendar(
  p: Publicacao,
  publicadosHoje: number,
  limiteDiario: number,
): string | null {
  if (temBloqueio(p)) return 'Há bloqueio de publicidade pendente — corrija o trecho ou refaça'
  if (p.status === 'gerando') return 'A IA ainda está escrevendo'
  if (p.status === 'rascunho') return 'Gere o conteúdo antes de agendar'
  if (p.status === 'publicado') return 'Já publicado'
  if (p.status === 'publicando') return 'Já está sendo publicado'
  if (publicadosHoje >= limiteDiario)
    return `Limite de ${limiteDiario} publicações por dia da API do Instagram já atingido`
  return null
}

/** Legenda como o Instagram mostra: corta no limite e oferece o "mais". */
export function truncarLegenda(legenda: string, limite = 125): { visivel: string; cortou: boolean } {
  const primeira = legenda.split('\n\n')[0]
  if (legenda.length <= limite) return { visivel: legenda, cortou: false }
  const corte = primeira.length > limite ? `${primeira.slice(0, limite).trimEnd()}…` : primeira
  return { visivel: corte, cortou: true }
}

export function inteiro(n: number): string {
  return n.toLocaleString('pt-BR')
}

/** A norma de publicidade de cada conselho — quem julga o texto é o conselho do autor. */
const REGRA_DO_CONSELHO: Record<Conselho, string> = {
  CRN: 'CFN 599/2018, art. 12',
  CRM: 'CFM 2.336/2023',
  CREF: 'CONFEF 307/2015',
  CRP: 'CFP 010/2005',
}

interface Padrao {
  teste: RegExp
  severidade: 'bloqueio' | 'aviso'
  /** `null` = usa a norma do conselho do autor. */
  regra: string | null
  explicacao: string
}

/**
 * A metade determinística do validador.
 *
 * Não pretende ser o validador inteiro — o real combina isto com uma passada de LLM,
 * porque "resultado garantido" tem mil formas de ser escrito e regex não pega todas.
 * O que estes padrões garantem é o **piso**: as vedações literais nunca passam, mesmo
 * quando a chamada de IA falha ou volta vazia. Validador que depende só do modelo
 * libera tudo no dia em que o modelo timeouta.
 */
const PADROES: Padrao[] = [
  {
    teste: /antes\s+e\s+depois/i,
    severidade: 'bloqueio',
    regra: null,
    explicacao:
      'Divulgação de imagem ou relato de antes e depois é vedada. Não há caminho de exceção — o trecho e a imagem precisam sair do post.',
  },
  {
    teste: /\b(garantid[oa]|garanto|garantia de resultado|resultado garantido)\b/i,
    severidade: 'bloqueio',
    regra: null,
    explicacao:
      'Prometer ou garantir resultado é vedado. Reescreva descrevendo o acompanhamento, não o desfecho.',
  },
  {
    teste: /\b\d+\s?(kg|quilos)\b.*\b(em|no)\s+\d+\s*(dias|semanas|meses|m[eê]s)\b/i,
    severidade: 'bloqueio',
    regra: null,
    explicacao:
      'Quantificar perda de peso em prazo é promessa de resultado, ainda que o número seja real de um caso.',
  },
  {
    teste: /\b(nosso|nossa)\s+paciente\b|\bpaciente\s+[A-Z][a-zá-ú]+/,
    severidade: 'bloqueio',
    regra: 'LGPD art. 11 · dado de saúde',
    explicacao:
      'Identificar paciente em rede social expõe dado de saúde e exige consentimento específico e por escrito, registrado para esta publicação.',
  },
  {
    // `[oa]` e não `o`: o padrão masculino deixava passar "a melhor clínica da
    // região", que é a forma mais provável numa clínica.
    teste: /\b[oa] melhor\b|\b[oa] maior\b|\búnic[oa] (?:na|da) (?:regi[ãa]o|cidade)/i,
    severidade: 'aviso',
    regra: null,
    explicacao:
      'Superlativo e comparação com concorrência caracterizam autopromoção. Não é vedação expressa sem promessa de resultado, mas é o trecho que costuma virar representação no conselho.',
  },
]

/**
 * Revalida a legenda e devolve os alertas.
 *
 * Roda a cada edição e a cada refação de propósito: alerta que só é calculado na
 * geração deixa o post aprovado com o texto que a pessoa acabou de piorar à mão.
 */
export function validarLegenda(
  legenda: string,
  conselho: Conselho,
  /** Termos que a clínica pediu para não usar. Viram aviso, nunca bloqueio. */
  evitar: string[] = [],
): AlertaCompliance[] {
  const achados: AlertaCompliance[] = []

  const texto = legenda.toLowerCase()
  for (const termo of evitar) {
    if (!termo || !texto.includes(termo.toLowerCase())) continue
    achados.push({
      id: `evitar-${termo}`,
      severidade: 'aviso',
      regra: 'Palavra evitada pela clínica',
      trecho: termo,
      explicacao:
        'Está na lista de palavras a evitar, em Configurações. Não impede agendar — é preferência da casa, não vedação de conselho.',
    })
  }
  PADROES.forEach((p, i) => {
    const m = legenda.match(p.teste)
    if (!m) return
    achados.push({
      id: `val-${i}`,
      severidade: p.severidade,
      regra: p.regra ?? REGRA_DO_CONSELHO[conselho],
      trecho: m[0],
      explicacao: p.explicacao,
    })
  })
  return achados
}

export const TEMPLATE_LABEL: Record<TemplateId, string> = {
  editorial: 'Editorial',
  lista: 'Lista numerada',
  estatistica: 'Estatística',
  convite: 'Convite',
  citacao: 'Citação',
  foto: 'Foto + faixa',
}

/** O que cada layout serve — aparece sob a miniatura no seletor. */
export const TEMPLATE_DESCRICAO: Record<TemplateId, string> = {
  editorial: 'Manchete e apoio. O padrão para dica e explicação',
  lista: 'Número grande ao fundo. Para carrossel de passos',
  estatistica: 'O dado em corpo enorme. Exige o campo destaque',
  convite: 'Centralizado, com chamada na base. Para agenda aberta',
  citacao: 'Frase em aspas. Para fala do profissional',
  foto: 'Fotografia com faixa de texto. Para foto própria',
}

