import { Ruler, Stethoscope, TriangleAlert } from 'lucide-react'
import type {
  AvaliacaoFisica,
  MedidaCorporal,
} from '@/../product-clinic/sections/acompanhamento/types'
import { dataExtensa, numero } from './helpers'
import { DeltaChip } from './DeltaChip'
import type { Direcao } from './DeltaChip'

interface Props {
  avaliacoes: AvaliacaoFisica[]
}

/**
 * Circunferências com leitura consolidada. Quadril, braço, coxa e afins ficam neutros de propósito:
 * cair pode ser perda de gordura ou de massa magra, e a bioimpedância (aba Bioindicadores) é quem
 * desempata.
 */
const MEDIDA_DIRECAO: Record<string, Direcao> = {
  cintura: 'menor-melhor',
  abdomen: 'menor-melhor',
  'circunferencia abdominal': 'menor-melhor',
  pescoco: 'menor-melhor',
}

function direcaoMedida(nome: string): Direcao {
  const chave = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
  return MEDIDA_DIRECAO[chave] ?? 'neutra'
}

const CARD =
  'rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6'
const TITULO_BLOCO =
  'text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'
const VAZIO =
  'rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500'

/**
 * Antropometria: a avaliação física mais recente, com quem mediu em destaque.
 *
 * Quem mediu vem antes das medidas de propósito — uma auto-medição muda o peso de tudo o que vem
 * depois, e o médico precisa saber disso antes de ler os números.
 */
export function IndicadoresPanel({ avaliacoes }: Props) {
  // Defensivo: a lista chega da mais recente para a mais antiga, mas ordenar ISO é barato e garante.
  const avals = [...avaliacoes].sort((a, b) => b.data.localeCompare(a.data))

  const avaliacao = avals[0]
  const avaliacaoPrevia = avals[1]

  if (!avaliacao) {
    return <div className={VAZIO}>Nenhuma avaliação física registrada.</div>
  }

  return (
    <section className={CARD}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className={TITULO_BLOCO}>Avaliação física</h3>
          <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
            Avaliação de {dataExtensa(avaliacao.data)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {/* A variação da medida vem pronta do dado (é a diferença para a avaliação
                anterior), então nunca dá para afirmar "sem comparação" aqui — só nomear
                a avaliação de referência quando ela também foi compartilhada. */}
            {avaliacaoPrevia
              ? `Variação em relação à avaliação de ${dataExtensa(avaliacaoPrevia.data)}`
              : 'Variação de cada medida em relação à avaliação anterior do paciente'}
          </p>
        </div>
      </div>

      <QuemMediu avaliadoPor={avaliacao.avaliadoPor} />

      {avaliacao.medidas.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
          Nenhuma medida informada nesta avaliação.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {/* `nome` não é chave garantida (o tipo não tem id) — o índice desempata repetidos. */}
          {avaliacao.medidas.map((m, i) => (
            <TileMedida key={`${m.nome}-${i}`} medida={m} />
          ))}
        </div>
      )}

      <Legenda />
    </section>
  )
}

/* ─────────────────────────── Blocos internos ─────────────────────────── */

function TileMedida({ medida }: { medida: MedidaCorporal }) {
  const direcao = direcaoMedida(medida.nome)

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <Ruler className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">{medida.nome}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {numero(medida.valor, 1)}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{medida.unidade}</span>
      </div>
      <div className="mt-2">
        {/* `variacao` do tipo é a diferença para a avaliação anterior — não para a última consulta. */}
        <DeltaChip
          delta={medida.variacao}
          unidade={medida.unidade}
          direcao={direcao}
          referencia="avaliação anterior"
        />
      </div>
    </div>
  )
}

/** Quem mediu muda o peso do dado: `null` = o paciente mediu a si mesmo, sem profissional. */
function QuemMediu({ avaliadoPor }: { avaliadoPor: string | null }) {
  if (avaliadoPor === null) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/60 dark:bg-amber-950/30">
        <TriangleAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
          strokeWidth={2}
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
          <span className="font-semibold">Auto-medição do paciente.</span> As medidas abaixo foram
          tiradas pelo próprio paciente no app, sem profissional presente — a técnica varia entre
          medições e a confiabilidade é menor que a de uma avaliação feita na clínica. Confirme em
          consulta antes de usar como base de conduta.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 dark:border-teal-900/60 dark:bg-teal-950/30">
      <Stethoscope
        className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400"
        strokeWidth={2}
        aria-hidden="true"
      />
      <p className="text-xs leading-relaxed text-teal-800 dark:text-teal-200">
        Medido por <span className="font-semibold">{avaliadoPor}</span> — avaliação conduzida por
        profissional.
      </p>
    </div>
  )
}

function Legenda() {
  return (
    <div className="mt-5 border-t border-slate-200 pt-3 dark:border-slate-800">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
        <span>A seta indica a direção do número; a cor, a leitura clínica:</span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" /> melhora
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" /> piora
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" /> sem direção
          definida
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Circunferências como quadril e braço ficam em cinza de propósito: a queda pode ser perda de
        gordura ou de massa magra — cruze com a massa magra da bioimpedância para decidir.
      </p>
    </div>
  )
}
