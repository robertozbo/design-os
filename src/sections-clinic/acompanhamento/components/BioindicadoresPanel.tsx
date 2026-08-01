import { useState } from 'react'
import {
  ChevronDown,
  Droplets,
  Dumbbell,
  Gauge,
  PencilLine,
  Percent,
  Scale,
  Smartphone,
  Stethoscope,
  Watch,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type {
  Bioimpedancia,
  FonteDado,
} from '@/../product-clinic/sections/acompanhamento/types'
import { dataExtensa, numero } from './helpers'
import { DeltaChip } from './DeltaChip'
import type { Direcao } from './DeltaChip'

interface Props {
  bioimpedancias: Bioimpedancia[]
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

const CARD =
  'rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6'
const TITULO_BLOCO =
  'text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'
const VAZIO =
  'rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700 dark:text-slate-500'

/**
 * Bioimpedância: a medição mais recente em destaque e o histórico das anteriores.
 *
 * A variação de cada número é apurada contra a medição imediatamente anterior — não contra a última
 * consulta —, porque bioimpedância só é comparável com outra bioimpedância.
 */
export function BioindicadoresPanel({ bioimpedancias }: Props) {
  const [anterioresAbertas, setAnterioresAbertas] = useState(true)

  // Defensivo: a lista chega do mais recente para o mais antigo, mas ordenar ISO é barato e garante.
  const bios = [...bioimpedancias].sort((a, b) => b.data.localeCompare(a.data))

  const atual = bios[0]
  const previa = bios[1]
  const anteriores = bios.slice(1)

  if (!atual) {
    return <div className={VAZIO}>Nenhuma medição de composição corporal compartilhada.</div>
  }

  return (
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

      {/* Como agora ocupa a aba inteira, os 5 tiles cabem numa linha só a partir de `lg` — o chip de
          variação continua dentro do card porque a largura por tile deixou de ser o gargalo. */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
        <div className="mt-5">
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
                  className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-800"
                >
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {dataExtensa(b.data)}
                  </span>
                  <FonteBadge fonte={b.fonte} />
                  <span className="flex basis-full flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] tabular-nums text-slate-500 sm:ml-auto sm:basis-auto sm:justify-end dark:text-slate-400">
                    <span>{numero(b.pesoKg, 1)} kg</span>
                    <span>{numero(b.gorduraPct, 1)}% gord.</span>
                    <span>{numero(b.massaMagraKg, 1)} kg magra</span>
                    <span>{numero(b.aguaPct, 1)}% água</span>
                    <span>IMC {numero(b.imc, 1)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
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
  const delta = anterior === null ? null : valor - anterior

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <Icone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">{campo.label}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {numero(valor, 1)}
        </span>
        {campo.unidade && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{campo.unidade}</span>
        )}
      </div>
      <div className="mt-2">
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
