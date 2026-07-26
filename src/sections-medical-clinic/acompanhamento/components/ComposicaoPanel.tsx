import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Droplets,
  Dumbbell,
  Gauge,
  Minus,
  PencilLine,
  Percent,
  Ruler,
  Scale,
  Smartphone,
  Stethoscope,
  TriangleAlert,
  Watch,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  AvaliacaoFisica,
  Bioimpedancia,
  FonteDado,
  MedidaCorporal,
} from '@/../product-medical-clinic/sections/acompanhamento/types'
import { dataExtensa } from './helpers'

/**
 * Direção clinicamente desejável do número.
 * `neutra` = subir ou descer não tem leitura única (pode ser perda de gordura OU de massa magra).
 */
type Direcao = 'menor-melhor' | 'maior-melhor' | 'neutra'

type Leitura = 'melhora' | 'piora' | 'neutro'

interface Props {
  bioimpedancias: Bioimpedancia[]
  avaliacoes: AvaliacaoFisica[]
}

function fmt(valor: number, casas = 1): string {
  return valor.toFixed(casas).replace('.', ',')
}

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

/** Sinal explícito: o médico precisa ver +/− sem calcular. Usa o menos tipográfico (−). */
function comSinal(valor: number, casas = 1): string {
  const arredondado = arredondar(valor, casas)
  if (arredondado === 0) return fmt(0, casas)
  return `${arredondado > 0 ? '+' : '−'}${fmt(Math.abs(arredondado), casas)}`
}

function lerVariacao(delta: number, direcao: Direcao): Leitura {
  if (direcao === 'neutra' || delta === 0) return 'neutro'
  const bom = direcao === 'menor-melhor' ? delta < 0 : delta > 0
  return bom ? 'melhora' : 'piora'
}

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

interface FonteMeta {
  Icone: LucideIcon
  /** Como o dado chegou — o médico pondera a confiança a partir daqui. */
  descricao: string
  classe: string
}

const FONTE_META: Record<FonteDado, FonteMeta> = {
  'Apple Health': {
    Icone: Watch,
    descricao: 'sincronizado de wearable',
    classe: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  'Google Fit': {
    Icone: Smartphone,
    descricao: 'sincronizado do celular',
    classe: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  Garmin: {
    Icone: Watch,
    descricao: 'sincronizado de wearable',
    classe: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  'Balança': {
    Icone: Scale,
    descricao: 'balança de bioimpedância do paciente',
    classe: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  },
  Manual: {
    Icone: PencilLine,
    descricao: 'digitado pelo paciente — confiabilidade menor',
    classe: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  'Clínica': {
    Icone: Stethoscope,
    descricao: 'medido na clínica',
    classe: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  },
}

interface CampoBio {
  chave: 'pesoKg' | 'gorduraPct' | 'massaMagraKg' | 'aguaPct' | 'imc'
  label: string
  unidade: string
  direcao: Direcao
  Icone: LucideIcon
}

/** Cada número da bioimpedância tem a sua própria direção desejável — não dá para pintar por sinal. */
const CAMPOS_BIO: CampoBio[] = [
  { chave: 'pesoKg', label: 'Peso', unidade: 'kg', direcao: 'menor-melhor', Icone: Scale },
  { chave: 'gorduraPct', label: 'Gordura', unidade: '%', direcao: 'menor-melhor', Icone: Percent },
  {
    chave: 'massaMagraKg',
    label: 'Massa magra',
    unidade: 'kg',
    direcao: 'maior-melhor',
    Icone: Dumbbell,
  },
  { chave: 'aguaPct', label: 'Água', unidade: '%', direcao: 'maior-melhor', Icone: Droplets },
  { chave: 'imc', label: 'IMC', unidade: '', direcao: 'menor-melhor', Icone: Gauge },
]

/**
 * Circunferências com leitura consolidada. Quadril, braço, coxa e afins ficam neutros de propósito:
 * cair pode ser perda de gordura ou de massa magra, e a bioimpedância acima é quem desempata.
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
  'rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5'
const TITULO_BLOCO =
  'text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'
const VAZIO =
  'rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500'

export function ComposicaoPanel({ bioimpedancias, avaliacoes }: Props) {
  const [anterioresAbertas, setAnterioresAbertas] = useState(true)

  // Defensivo: a lista chega do mais recente para o mais antigo, mas ordenar ISO é barato e garante.
  const bios = [...bioimpedancias].sort((a, b) => b.data.localeCompare(a.data))
  const avals = [...avaliacoes].sort((a, b) => b.data.localeCompare(a.data))

  const atual = bios[0]
  const previa = bios[1]
  const anteriores = bios.slice(1)

  const avaliacao = avals[0]
  const avaliacaoPrevia = avals[1]

  return (
    <div className="space-y-4">
      {/* ── Bioimpedância ─────────────────────────────────────────────── */}
      {!atual ? (
        <div className={VAZIO}>Nenhuma medição de composição corporal compartilhada.</div>
      ) : (
        <section className={CARD}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className={TITULO_BLOCO}>Composição corporal</h3>
              <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                Medição de {dataExtensa(atual.data)}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {previa
                  ? `Variação em relação à medição de ${dataExtensa(previa.data)}`
                  : 'Primeira medição registrada — ainda sem comparação'}
              </p>
            </div>
            <FonteBadge fonte={atual.fonte} />
          </div>

          {/* 3 colunas no máximo: o painel divide a linha com Atividade a partir de `lg`,
              e 5 tiles nessa largura estouram o chip de variação para fora do card. */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CAMPOS_BIO.map((campo) => (
              <TileBio
                key={campo.chave}
                campo={campo}
                valor={atual[campo.chave]}
                anterior={previa ? previa[campo.chave] : null}
              />
            ))}
          </div>

          {anteriores.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setAnterioresAbertas((v) => !v)}
                aria-expanded={anterioresAbertas}
                className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${anterioresAbertas ? '' : '-rotate-90'}`}
                  aria-hidden="true"
                />
                Medições anteriores ({anteriores.length})
              </button>

              {anterioresAbertas && (
                <ul className="mt-2 space-y-1.5">
                  {anteriores.map((b) => (
                    <li
                      key={b.id}
                      className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800"
                    >
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {dataExtensa(b.data)}
                      </span>
                      <FonteBadge fonte={b.fonte} />
                      <span className="flex basis-full flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] tabular-nums text-slate-500 sm:ml-auto sm:basis-auto sm:justify-end dark:text-slate-400">
                        <span>{fmt(b.pesoKg)} kg</span>
                        <span>{fmt(b.gorduraPct)}% gord.</span>
                        <span>{fmt(b.massaMagraKg)} kg magra</span>
                        <span>{fmt(b.aguaPct)}% água</span>
                        <span>IMC {fmt(b.imc)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Avaliação física ──────────────────────────────────────────── */}
      {!avaliacao ? (
        <div className={VAZIO}>Nenhuma avaliação física registrada.</div>
      ) : (
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
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
              Nenhuma medida informada nesta avaliação.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {/* `nome` não é chave garantida (o tipo não tem id) — o índice desempata repetidos. */}
              {avaliacao.medidas.map((m, i) => (
                <TileMedida key={`${m.nome}-${i}`} medida={m} />
              ))}
            </div>
          )}

          <Legenda />
        </section>
      )}
    </div>
  )
}

/* ─────────────────────────── Blocos internos ─────────────────────────── */

function TileBio({
  campo,
  valor,
  anterior,
}: {
  campo: CampoBio
  valor: number
  anterior: number | null
}) {
  const { Icone } = campo
  const delta = anterior === null ? null : arredondar(valor - anterior)

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <Icone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">{campo.label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {fmt(valor)}
        </span>
        {campo.unidade && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{campo.unidade}</span>
        )}
      </div>
      <div className="mt-1.5">
        {delta === null ? (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">sem base anterior</span>
        ) : (
          <DeltaChip
            delta={delta}
            unidade={campo.unidade}
            direcao={campo.direcao}
            referencia="medição anterior"
          />
        )}
      </div>
    </div>
  )
}

function TileMedida({ medida }: { medida: MedidaCorporal }) {
  const direcao = direcaoMedida(medida.nome)

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <Ruler className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">{medida.nome}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {fmt(medida.valor)}
        </span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{medida.unidade}</span>
      </div>
      <div className="mt-1.5">
        {/* `variacao` do tipo é a diferença para a avaliação anterior — não para a última consulta. */}
        <DeltaChip
          delta={arredondar(medida.variacao)}
          unidade={medida.unidade}
          direcao={direcao}
          referencia="avaliação anterior"
        />
      </div>
    </div>
  )
}

/**
 * A seta segue o número; a cor segue a leitura clínica. Separar os dois evita o verde automático
 * em qualquer coisa que subiu.
 */
function DeltaChip({
  delta,
  unidade,
  direcao,
  referencia,
}: {
  delta: number
  unidade: string
  direcao: Direcao
  /** Contra o quê a diferença foi apurada — muda entre bioimpedância e avaliação física. */
  referencia: string
}) {
  const leitura = lerVariacao(delta, direcao)
  const Seta = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus
  const texto = delta === 0 ? 'sem mudança' : comUnidade(comSinal(delta), unidade)
  const titulo =
    delta === 0
      ? `Sem mudança desde a ${referencia}`
      : `${comUnidade(comSinal(delta), unidade)} desde a ${referencia} · ${LEITURA_TITULO[leitura]}`

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

function FonteBadge({ fonte }: { fonte: FonteDado }) {
  const { Icone, descricao, classe } = FONTE_META[fonte]
  return (
    <span
      title={`Fonte: ${fonte} — ${descricao}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${classe}`}
    >
      <Icone className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden="true" />
      {fonte}
    </span>
  )
}

/** Quem mediu muda o peso do dado: `null` = o paciente mediu a si mesmo, sem profissional. */
function QuemMediu({ avaliadoPor }: { avaliadoPor: string | null }) {
  if (avaliadoPor === null) {
    return (
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900/60 dark:bg-amber-950/30">
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
    <div className="mt-3 flex items-start gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 dark:border-teal-900/60 dark:bg-teal-950/30">
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
    <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
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
