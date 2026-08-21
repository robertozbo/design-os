import { Plus, TrendingDown, Utensils } from 'lucide-react'
import type { AtendimentoNutri } from '@/../product-clinic/sections/atendimento/types'
import { Bloco, Campo } from './AtendimentoShell'
import { delta, numero } from './helpers'

interface Props {
  atendimento: AtendimentoNutri
  onEvolucao: (v: string) => void
  onPeso: (v: number) => void
  onOrientacao: (texto: string) => void
}

export function NutricaoRegistro({ atendimento: a, onEvolucao, onPeso, onOrientacao }: Props) {
  const { antropometria: at, antropometriaAnterior: ant } = a

  return (
    <>
      <Bloco
        titulo="Antropometria de hoje"
        acessorio={
          <span className="text-[11px] text-slate-400">
            comparada com {a.contexto[0]?.quando ?? 'a anterior'}
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <MedidaPeso valor={at.peso} anterior={ant.peso} onChange={onPeso} />
          <Medida label="IMC" valor={at.imc} anterior={ant.imc} sufixo="" />
          <Medida label="Cintura" valor={at.cintura} anterior={ant.cintura} sufixo=" cm" casas={0} />
          <Medida label="Quadril" valor={at.quadril} anterior={ant.quadril} sufixo=" cm" casas={0} />
          <Medida label="Gordura" valor={at.gorduraPct} anterior={ant.gorduraPct} sufixo="%" />
          <Medida
            label="Massa magra"
            valor={at.massaMagraKg}
            anterior={ant.massaMagraKg}
            sufixo=" kg"
            menorEhMelhor={false}
          />
        </div>
        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          Massa magra estável com queda de peso e de gordura é o padrão que se quer — perder peso
          derrubando massa magra é o alerta que essa comparação existe para dar.
        </p>
      </Bloco>

      <Bloco titulo="Metas do plano" acessorio={<span className="text-[11px] text-slate-400">por dia</span>}>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Meta label="Energia" valor={`${a.metas.kcal}`} unidade="kcal" destaque />
          <Meta label="Proteína" valor={`${a.metas.proteinaG}`} unidade="g" />
          <Meta label="Carboidrato" valor={`${a.metas.carboidratoG}`} unidade="g" />
          <Meta label="Gordura" valor={`${a.metas.gorduraG}`} unidade="g" />
        </div>
      </Bloco>

      <Bloco titulo="Recordatório alimentar (24h)">
        <ul className="space-y-2">
          {a.recordatorio.map((r) => (
            <li key={r.id} className="flex gap-3 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
              <span className="w-28 shrink-0 text-xs font-medium text-slate-700 dark:text-slate-200">
                {r.refeicao}
              </span>
              <span className="min-w-0 flex-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {r.descricao}
              </span>
            </li>
          ))}
        </ul>
      </Bloco>

      <Bloco
        titulo="Plano alimentar"
        acessorio={
          <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Plus className="h-3 w-3" /> Refeição
          </button>
        }
      >
        <ul className="space-y-2">
          {a.plano.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <Utensils className="h-3 w-3 text-emerald-500" /> {r.nome}
                </span>
                <span className="text-[10px] tabular-nums text-slate-400">{r.horario}</span>
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-1">
                {r.itens.map((i) => (
                  <li
                    key={i}
                    className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Bloco>

      <Bloco titulo="Orientações e evolução">
        <div className="space-y-3">
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Orientações para o paciente
            </span>
            <ul className="space-y-1.5">
              {a.orientacoes.map((o, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[11px] leading-snug text-slate-600 dark:text-slate-300"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {o}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onOrientacao('Nova orientação')}
              className="mt-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Plus className="h-3 w-3" /> Orientação
            </button>
          </div>

          <Campo
            label="Evolução da consulta"
            valor={a.evolucaoTexto}
            onChange={onEvolucao}
            linhas={4}
          />
        </div>
      </Bloco>
    </>
  )
}

function MedidaPeso({
  valor,
  anterior,
  onChange,
}: {
  valor: number
  anterior: number
  onChange: (v: number) => void
}) {
  const d = delta(valor, anterior)
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 dark:border-emerald-900/60 dark:bg-emerald-950/25">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">Peso</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <input
          type="number"
          step="0.1"
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 bg-transparent text-lg font-semibold tabular-nums text-slate-900 outline-none dark:text-slate-50"
        />
        <span className="text-[11px] text-slate-400">kg</span>
      </div>
      <div className={`text-[10px] tabular-nums ${d.cor}`}>{d.label} kg</div>
    </div>
  )
}

function Medida({
  label,
  valor,
  anterior,
  sufixo,
  casas = 1,
  menorEhMelhor = true,
}: {
  label: string
  valor: number
  anterior: number
  sufixo: string
  casas?: number
  menorEhMelhor?: boolean
}) {
  const d = delta(valor, anterior, menorEhMelhor)
  return (
    <div className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {numero(valor, casas)}
        <span className="text-[11px] font-normal text-slate-400">{sufixo}</span>
      </div>
      <div className={`text-[10px] tabular-nums ${d.cor}`}>{d.label}</div>
    </div>
  )
}

function Meta({
  label,
  valor,
  unidade,
  destaque = false,
}: {
  label: string
  valor: string
  unidade: string
  destaque?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        destaque
          ? 'bg-emerald-50 dark:bg-emerald-950/30'
          : 'bg-slate-50 dark:bg-slate-800/50'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-50">
        {valor}
        <span className="ml-1 text-[11px] font-normal text-slate-400">{unidade}</span>
      </div>
    </div>
  )
}

/** Cartão lateral: a curva de peso — é o que o paciente veio ver. */
export function EvolucaoPesoCard({ atendimento: a }: { atendimento: AtendimentoNutri }) {
  const pesos = a.historicoPeso.map((h) => h.peso)
  const min = Math.min(...pesos) - 1
  const max = Math.max(...pesos) + 1
  const total = a.historicoPeso[0].peso - a.antropometria.peso

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <TrendingDown className="h-3.5 w-3.5 text-emerald-500" /> Peso
      </h2>
      <div className="mt-3 flex h-20 items-end gap-1.5">
        {a.historicoPeso.map((h, i) => (
          <div key={h.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[9px] tabular-nums text-slate-400">{numero(h.peso)}</span>
            <div
              className={`w-full rounded-t bg-emerald-500 ${
                i === a.historicoPeso.length - 1 ? '' : 'opacity-50'
              }`}
              style={{ height: `${((h.peso - min) / (max - min)) * 56 + 4}px` }}
            />
            <span className="text-[9px] text-slate-400">{h.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          −{numero(total)} kg
        </span>{' '}
        desde o início do acompanhamento.
      </p>
    </div>
  )
}
