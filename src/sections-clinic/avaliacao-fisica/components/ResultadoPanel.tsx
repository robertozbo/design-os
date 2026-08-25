import type { ReactNode } from 'react'
import { Activity, Flame, Ruler, Scale, Sigma, Target } from 'lucide-react'
import type {
  PacienteAvaliacao,
  ProtocoloId,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import {
  DOBRA_LABEL,
  FATOR_ATIVIDADE,
  NIVEL_ATIVIDADE_LABEL,
  PROTOCOLO_POR_ID,
  type Classificacao,
  type Resultado,
} from './formulas'
import { ClassBadge } from './FormPrimitives'
import { TOM_TEXTO, numero } from './helpers'

interface Props {
  paciente: PacienteAvaliacao
  protocolo: ProtocoloId | null
  resultado: Resultado
  /** Resultado da avaliação anterior, para o delta. `null` na primeira avaliação. */
  anterior: Resultado | null
}

/**
 * O painel que recalcula a cada tecla.
 *
 * A regra que ele existe para carregar: número derivado nunca fica parado enquanto a medida que o
 * gera muda. Se falta dado, o campo mostra "—" e **diz o que falta** — um zero no lugar do
 * desconhecido é a mentira mais fácil de uma tela de avaliação, porque zero também é um número
 * plausível de gordura.
 */
export function ResultadoPanel({ paciente, protocolo, resultado: r, anterior }: Props) {
  const meta = protocolo ? PROTOCOLO_POR_ID[protocolo] : null

  return (
    <div className="space-y-3">
      {/* Composição corporal — o que o paciente veio ver */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <Activity className="h-3.5 w-3.5 text-teal-500" /> Composição corporal
          </h2>
          {r.gorduraOrigem && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {r.gorduraOrigem === 'dobras' ? 'por dobras' : 'por bioimpedância'}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="font-mono text-3xl font-semibold tabular-nums leading-none text-slate-900 dark:text-slate-50">
            {numero(r.gorduraPct)}
          </span>
          <span className="pb-0.5 text-sm text-slate-400">%</span>
          <span className="flex-1" />
          <DeltaChip atual={r.gorduraPct} anterior={anterior?.gorduraPct} sufixo="%" />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <ClassBadge classificacao={r.gorduraClasse} />
          <span className="text-[10px] text-slate-400">
            adequado para {paciente.sexo === 'M' ? '♂' : '♀'} {paciente.idade}a: ~
            {numero(r.gorduraAlvoPct)}%
          </span>
        </div>

        {r.gorduraPct == null && (
          <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            {!protocolo
              ? 'Escolha um protocolo para calcular o % de gordura.'
              : r.faltando.length > 0
                ? `Falta medir: ${r.faltando.map((d) => DOBRA_LABEL[d]).join(' · ')}.`
                : 'Sem dado suficiente para o cálculo.'}
          </p>
        )}

        {/* Fracionamento — a leitura que separa "perdeu peso" de "perdeu gordura" */}
        {r.composicao && (
          <div className="mt-3">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <span
                className="bg-amber-400"
                style={{ width: `${r.composicao.gordura}%` }}
                title={`Gordura ${numero(r.composicao.gordura)}%`}
              />
              <span
                className="bg-teal-500"
                style={{ width: `${r.composicao.musculos}%` }}
                title={`Músculos ${numero(r.composicao.musculos)}%`}
              />
              <span
                className="bg-slate-300 dark:bg-slate-600"
                style={{ width: `${r.composicao.residual}%` }}
                title={`Residual ${numero(r.composicao.residual)}%`}
              />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-400">
              <Legenda cor="bg-amber-400" texto={`Gordura ${numero(r.composicao.gordura)}%`} />
              <Legenda cor="bg-teal-500" texto={`Músculos ${numero(r.composicao.musculos)}%`} />
              <Legenda
                cor="bg-slate-300 dark:bg-slate-600"
                texto={`Residual ${numero(r.composicao.residual)}%`}
              />
            </div>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Mini
            label="Massa gorda"
            valor={r.massaGordaKg}
            sufixo="kg"
            hint={r.massaGordaAlvoKg != null ? `ideal ~${numero(r.massaGordaAlvoKg)} kg` : undefined}
            delta={{ atual: r.massaGordaKg, anterior: anterior?.massaGordaKg }}
          />
          <Mini
            label="Massa magra"
            valor={r.massaMagraKg}
            sufixo="kg"
            hint={r.massaMagraAlvoKg != null ? `ideal ~${numero(r.massaMagraAlvoKg)} kg` : undefined}
            delta={{
              atual: r.massaMagraKg,
              anterior: anterior?.massaMagraKg,
              menorEhMelhor: false,
            }}
          />
        </div>
      </section>

      {/* Índices */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
          <Ruler className="h-3.5 w-3.5 text-teal-500" /> Índices
        </h2>
        <ul className="mt-3 space-y-2">
          <Linha
            icone={<Scale className="h-3 w-3" />}
            label="IMC"
            valor={numero(r.imc)}
            unidade="kg/m²"
            classificacao={r.imcClasse}
            delta={{ atual: r.imc, anterior: anterior?.imc }}
          />
          <Linha
            label="RCQ"
            hint="cintura / quadril"
            valor={numero(r.rcq, 2)}
            classificacao={r.rcqClasse}
            delta={{ atual: r.rcq, anterior: anterior?.rcq, casas: 2 }}
          />
          <Linha
            label="Cintura"
            hint="risco cardiometabólico"
            valor={numero(r.cinturaCm, 0)}
            unidade="cm"
            classificacao={r.cinturaClasse}
            delta={{ atual: r.cinturaCm, anterior: anterior?.cinturaCm, casas: 0 }}
          />
          <Linha
            label="RCE"
            hint="cintura / estatura · corte 0,50"
            valor={numero(r.rce, 2)}
            delta={{ atual: r.rce, anterior: anterior?.rce, casas: 2 }}
          />
          <Linha
            label="CMB"
            hint="braço − π × tríceps"
            valor={numero(r.cmb)}
            unidade="cm"
            classificacao={
              r.cmbClasse
                ? { label: `${r.cmbClasse.label} · ${Math.round(r.cmbClasse.adequacao)}% do P50`, tom: r.cmbClasse.tom }
                : null
            }
          />
        </ul>
      </section>

      {/* Protocolo e densidade */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
            <Sigma className="h-3.5 w-3.5 text-teal-500" /> Protocolo
          </h2>
          {r.somaDobras != null && (
            <span className="rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
              Σ {numero(r.somaDobras, 0)} mm
            </span>
          )}
        </div>
        {meta ? (
          <>
            <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-200">
              {meta.label}
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
              {meta.formula}
            </p>
            {r.densidade != null && (
              <p className="mt-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                D = {r.densidade.toFixed(4)} g/cm³ → Siri: %G = (4,95 / D − 4,5) × 100
              </p>
            )}
            <p className="mt-2 text-[10px] italic text-slate-400">
              {meta.referencia}
              {meta.populacao ? ` · ${meta.populacao}` : ''}
            </p>
          </>
        ) : (
          <p className="mt-2 text-[11px] text-slate-400">Nenhum protocolo escolhido.</p>
        )}
      </section>

      {/* Gasto energético — o número que vira meta de plano alimentar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
          <Flame className="h-3.5 w-3.5 text-teal-500" /> Gasto energético
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Mini
            label="TMB"
            valor={r.tmb}
            casas={0}
            sufixo="kcal"
            hint="Katch-McArdle · massa magra"
          />
          <Mini
            label="GET"
            valor={r.get}
            casas={0}
            sufixo="kcal"
            hint={`× ${FATOR_ATIVIDADE[paciente.nivelAtividade]} · ${
              NIVEL_ATIVIDADE_LABEL[paciente.nivelAtividade].split(' ·')[0]
            }`}
            destaque
          />
        </div>
        {r.metas && (
          <div className="mt-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Metas diárias derivadas
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {[
                `Proteína ${r.metas.proteinaG} g`,
                `Carboidrato ${r.metas.carboidratoG} g`,
                `Gordura ${r.metas.gorduraG} g`,
                `Fibra ${r.metas.fibraG} g`,
                `Água ${(r.metas.aguaMl / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L`,
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-lg bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-1 text-[10px] leading-snug text-slate-400">
              Ponto de partida do plano alimentar — é o que a nutricionista ajusta, não o que ela
              digita do zero.
            </p>
          </div>
        )}

        {r.pesoAlvoKg != null && paciente.metaGorduraPct != null && (
          <p className="mt-3 inline-flex items-start gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
            <Target className="mt-0.5 h-3 w-3 shrink-0 text-teal-500" />
            <span>
              Mantendo a massa magra atual, chegar a {numero(paciente.metaGorduraPct, 0)}% de
              gordura significa{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-100">
                {numero(r.pesoAlvoKg)} kg
              </strong>
              .
            </span>
          </p>
        )}
      </section>
    </div>
  )
}

function Legenda({ cor, texto }: { cor: string; texto: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`h-1.5 w-1.5 rounded-full ${cor}`} />
      {texto}
    </span>
  )
}

function DeltaChip({
  atual,
  anterior,
  sufixo,
  menorEhMelhor = true,
  casas = 1,
}: {
  atual: number | null | undefined
  anterior: number | null | undefined
  sufixo?: string
  menorEhMelhor?: boolean
  casas?: number
}) {
  if (atual == null || anterior == null) return null
  const d = atual - anterior
  const bom = menorEhMelhor ? d < 0 : d > 0
  const cor =
    d === 0
      ? TOM_TEXTO.slate
      : bom
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'
  return (
    <span className={`font-mono text-[11px] tabular-nums ${cor}`}>
      {d > 0 ? '+' : d < 0 ? '−' : ''}
      {numero(Math.abs(d), casas)}
      {sufixo}
    </span>
  )
}

function Mini({
  label,
  valor,
  sufixo,
  hint,
  casas = 1,
  destaque = false,
  delta: d,
}: {
  label: string
  valor: number | null
  sufixo: string
  hint?: string
  casas?: number
  destaque?: boolean
  delta?: {
    atual: number | null | undefined
    anterior: number | null | undefined
    menorEhMelhor?: boolean
    casas?: number
  }
}) {
  return (
    <div
      className={`rounded-xl p-2.5 ${
        destaque
          ? 'bg-teal-50 dark:bg-teal-950/30'
          : 'border border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {numero(valor, casas)}
        <span className="ml-1 text-[11px] font-normal text-slate-400">{sufixo}</span>
      </div>
      {d && (
        <DeltaChip
          atual={d.atual}
          anterior={d.anterior}
          menorEhMelhor={d.menorEhMelhor}
          casas={d.casas}
          sufixo={` ${sufixo}`}
        />
      )}
      {hint && <div className="text-[10px] text-slate-400">{hint}</div>}
    </div>
  )
}

function Linha({
  icone,
  label,
  hint,
  valor,
  valorBruto,
  unidade,
  classificacao,
  delta: d,
}: {
  icone?: ReactNode
  label: string
  hint?: string
  valor: string
  valorBruto?: string
  unidade?: string
  classificacao?: Classificacao | null
  delta?: {
    atual: number | null | undefined
    anterior: number | null | undefined
    menorEhMelhor?: boolean
    casas?: number
  }
}) {
  return (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
        {icone}
        {label}
      </span>
      {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      <span className="flex-1" />
      {d && <DeltaChip atual={d.atual} anterior={d.anterior} casas={d.casas} />}
      <span className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {valorBruto ?? valor}
        {unidade && <span className="ml-0.5 text-[10px] font-normal text-slate-400">{unidade}</span>}
      </span>
      {classificacao && <ClassBadge classificacao={classificacao} />}
    </li>
  )
}
