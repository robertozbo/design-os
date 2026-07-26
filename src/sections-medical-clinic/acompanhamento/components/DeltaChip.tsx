import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { comSinal } from './helpers'

/**
 * Direção clinicamente desejável do número.
 * `neutra` = subir ou descer não tem leitura única (pode ser perda de gordura OU de massa magra).
 */
export type Direcao = 'menor-melhor' | 'maior-melhor' | 'neutra'

type Leitura = 'melhora' | 'piora' | 'neutro'

const LEITURA_CLASSE: Record<Leitura, string> = {
  melhora: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  piora: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  neutro: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

const LEITURA_TITULO: Record<Leitura, string> = {
  melhora: 'melhora',
  piora: 'piora',
  neutro: 'sem direção clínica definida',
}

/**
 * Arredonda para a mesma casa que a tela mostra: a comparação com zero (que escolhe a seta e a cor)
 * tem de concordar com o número exibido — em float, 48,2 − 47,5 dá 0,7000000000000028.
 */
function arredondar(valor: number, casas = 1): number {
  const f = 10 ** casas
  return Math.round(valor * f) / f
}

/** Junta número e unidade respeitando o "%" colado e o IMC sem unidade. */
function comUnidade(texto: string, unidade: string): string {
  if (!unidade) return texto
  if (unidade === '%') return `${texto}%`
  return `${texto} ${unidade}`
}

/**
 * `comSinal` do helpers herda o hífen do `Intl` (`-`), mas MetricasPanel e AtividadePanel escrevem
 * a variação com o menos tipográfico (`−`). Como as quatro abas ficam lado a lado, o chip normaliza
 * para o mesmo sinal — trocar de aba não pode trocar o desenho do menos.
 */
function sinalDe(delta: number): string {
  return comSinal(delta).replace(/^-/, '−')
}

function lerVariacao(delta: number, direcao: Direcao): Leitura {
  if (direcao === 'neutra' || delta === 0) return 'neutro'
  const bom = direcao === 'menor-melhor' ? delta < 0 : delta > 0
  return bom ? 'melhora' : 'piora'
}

interface Props {
  /** Diferença bruta — o chip arredonda antes de ler sinal, cor e "sem mudança". */
  delta: number
  unidade: string
  direcao: Direcao
  /** Contra o quê a diferença foi apurada — muda entre bioimpedância e avaliação física. */
  referencia: string
}

/**
 * A seta segue o número; a cor segue a leitura clínica. Separar os dois evita o verde automático
 * em qualquer coisa que subiu.
 *
 * Vive fora dos painéis porque Bioindicadores e Indicadores leem variação com a mesma regra —
 * duplicar o chip é o caminho curto para as duas telas divergirem de cor.
 */
export function DeltaChip({ delta: deltaBruto, unidade, direcao, referencia }: Props) {
  const delta = arredondar(deltaBruto)
  const leitura = lerVariacao(delta, direcao)
  const Seta = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus
  const texto = delta === 0 ? 'sem mudança' : comUnidade(sinalDe(delta), unidade)
  const titulo =
    delta === 0
      ? `Sem mudança desde a ${referencia}`
      : `${comUnidade(sinalDe(delta), unidade)} desde a ${referencia} · ${LEITURA_TITULO[leitura]}`

  return (
    <span
      title={titulo}
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${LEITURA_CLASSE[leitura]}`}
    >
      <Seta className="h-3 w-3 shrink-0" strokeWidth={2.25} aria-hidden="true" />
      {texto}
    </span>
  )
}
