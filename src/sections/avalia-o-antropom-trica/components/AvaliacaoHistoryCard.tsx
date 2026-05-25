import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import type {
  Avaliacao,
  Classificacoes,
  PacienteContexto,
} from '@/../product/sections/avalia-o-antropom-trica/types'
import {
  TONE_BADGE,
  TONE_TEXT,
  calcImc,
  calcRcq,
  classifyImc,
  classifyRcq,
  computeDelta,
  deltaTone,
  formatDateShort,
  formatNumber,
  formatRelativeDate,
  formatSigned,
} from './utils'

interface AvaliacaoHistoryCardProps {
  avaliacao: Avaliacao
  previous: Avaliacao | undefined
  pacienteContexto: PacienteContexto
  classificacoes: Classificacoes
  expanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

export function AvaliacaoHistoryCard({
  avaliacao,
  previous,
  pacienteContexto,
  classificacoes,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: AvaliacaoHistoryCardProps) {
  const imc = calcImc(avaliacao.basicas.pesoKg, avaliacao.basicas.alturaCm)
  const imcClass = classifyImc(imc, classificacoes)
  const rcq = calcRcq(avaliacao.circunferencias.cinturaCm, avaliacao.circunferencias.quadrilCm)
  const rcqClass = rcq ? classifyRcq(rcq, pacienteContexto.sexo, classificacoes) : null

  const pesoDelta = previous
    ? computeDelta(avaliacao.basicas.pesoKg, previous.basicas.pesoKg)
    : null

  return (
    <article
      className={`
        rounded-2xl border bg-white transition
        dark:bg-slate-900/40
        ${expanded
          ? 'border-teal-200 ring-1 ring-teal-200/40 dark:border-teal-900/60 dark:ring-teal-900/40'
          : 'border-slate-200/80 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'}
      `}
    >
      {/* Header (always visible) */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {/* Date column */}
          <div className="shrink-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
              {formatRelativeDate(avaliacao.dataIso)}
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {formatDateShort(avaliacao.dataIso)}
            </p>
          </div>

          <span className="hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" aria-hidden />

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
            <Stat label="Peso" value={`${formatNumber(avaliacao.basicas.pesoKg)} kg`} />
            <Stat
              label="IMC"
              value={formatNumber(imc)}
              badge={
                imcClass ? (
                  <span
                    className={`
                      inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider ring-1
                      ${TONE_BADGE[imcClass.tone]}
                    `}
                  >
                    {imcClass.label}
                  </span>
                ) : null
              }
            />
            {avaliacao.composicao.percentualGordura !== undefined && (
              <Stat
                label="% Gordura"
                value={`${formatNumber(avaliacao.composicao.percentualGordura)}%`}
              />
            )}
            {rcq !== null && (
              <Stat
                label="RCQ"
                value={formatNumber(rcq, 2)}
                badge={
                  rcqClass ? (
                    <span
                      className={`
                        inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider ring-1
                        ${TONE_BADGE[rcqClass.tone]}
                      `}
                    >
                      {rcqClass.label}
                    </span>
                  ) : null
                }
              />
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Weight delta */}
          {pesoDelta && (
            <span
              className={`
                inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums
                ${TONE_TEXT[deltaTone('peso', pesoDelta.direction)]}
              `}
            >
              {formatSigned(pesoDelta.abs, 1)}kg
            </span>
          )}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-slate-200/80 dark:border-slate-800">
          <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
            <DetailGroup
              title="Básicas"
              rows={[
                row('Peso', avaliacao.basicas.pesoKg, previous?.basicas.pesoKg, 'kg'),
                row('Altura', avaliacao.basicas.alturaCm, previous?.basicas.alturaCm, 'cm'),
                row('Idade', avaliacao.basicas.idade, previous?.basicas.idade, 'anos', 0),
                row('IMC', imc, previous ? calcImc(previous.basicas.pesoKg, previous.basicas.alturaCm) : undefined, 'kg/m²'),
              ]}
            />

            {hasComposicao(avaliacao) && (
              <DetailGroup
                title="Composição corporal"
                rows={[
                  row(
                    '% Gordura',
                    avaliacao.composicao.percentualGordura,
                    previous?.composicao.percentualGordura,
                    '%',
                  ),
                  row(
                    'Massa magra',
                    avaliacao.composicao.massaMagraKg,
                    previous?.composicao.massaMagraKg,
                    'kg',
                  ),
                  row(
                    'Gord. visceral',
                    avaliacao.composicao.gorduraVisceral,
                    previous?.composicao.gorduraVisceral,
                    '',
                    0,
                  ),
                  row('TMB', avaliacao.composicao.tmbKcal, previous?.composicao.tmbKcal, 'kcal', 0),
                ]}
              />
            )}

            {hasCircunferencias(avaliacao) && (
              <DetailGroup
                title="Circunferências"
                rows={[
                  row(
                    'Cintura',
                    avaliacao.circunferencias.cinturaCm,
                    previous?.circunferencias.cinturaCm,
                    'cm',
                  ),
                  row(
                    'Quadril',
                    avaliacao.circunferencias.quadrilCm,
                    previous?.circunferencias.quadrilCm,
                    'cm',
                  ),
                  row(
                    'Braço',
                    avaliacao.circunferencias.bracoCm,
                    previous?.circunferencias.bracoCm,
                    'cm',
                  ),
                  row(
                    'Coxa',
                    avaliacao.circunferencias.coxaCm,
                    previous?.circunferencias.coxaCm,
                    'cm',
                  ),
                ]}
              />
            )}

            {avaliacao.dobras && (
              <DetailGroup
                title={`Dobras cutâneas · ${protocoloLabel(avaliacao.dobras.protocolo)}`}
                rows={[
                  row(
                    'Tricipital',
                    avaliacao.dobras.tricipitalMm,
                    previous?.dobras?.tricipitalMm,
                    'mm',
                  ),
                  row(
                    'Subescapular',
                    avaliacao.dobras.subescapularMm,
                    previous?.dobras?.subescapularMm,
                    'mm',
                  ),
                  row(
                    'Suprailíaca',
                    avaliacao.dobras.suprailiacaMm,
                    previous?.dobras?.suprailiacaMm,
                    'mm',
                  ),
                  row(
                    'Abdominal',
                    avaliacao.dobras.abdominalMm,
                    previous?.dobras?.abdominalMm,
                    'mm',
                  ),
                  row('Coxa', avaliacao.dobras.coxaMm, previous?.dobras?.coxaMm, 'mm'),
                  row(
                    '% Estimado',
                    avaliacao.dobras.percentualEstimado ?? undefined,
                    previous?.dobras?.percentualEstimado ?? undefined,
                    '%',
                  ),
                ]}
              />
            )}
          </div>

          {avaliacao.observacoes && (
            <div className="border-t border-slate-200/80 px-5 py-4 dark:border-slate-800">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
                Observações
              </p>
              <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">
                {avaliacao.observacoes}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-1 border-t border-slate-200/80 px-3 py-2 dark:border-slate-800">
            <button
              type="button"
              onClick={onEdit}
              className="
                inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600
                hover:bg-slate-100 hover:text-slate-800
                dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200
              "
            >
              <Pencil size={11} /> Editar
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="
                inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600
                hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40
              "
            >
              <Trash2 size={11} /> Excluir
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

function Stat({
  label,
  value,
  badge,
}: {
  label: string
  value: string
  badge?: React.ReactNode
}) {
  return (
    <span className="inline-flex flex-col gap-0.5">
      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-500">
        {label}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {value}
        </span>
        {badge}
      </span>
    </span>
  )
}

interface RowData {
  label: string
  value: number | undefined
  prev: number | undefined
  unit: string
  digits: number
}

function row(label: string, value: number | undefined, prev: number | undefined, unit: string, digits = 1): RowData {
  return { label, value, prev, unit, digits }
}

function DetailGroup({ title, rows }: { title: string; rows: RowData[] }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/30 p-3 dark:border-slate-800 dark:bg-slate-900/30">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-teal-600 dark:text-teal-400">
        {title}
      </p>
      <table className="w-full text-xs">
        <tbody>
          {rows.map((r, i) => {
            if (r.value === undefined) return null
            const delta =
              r.prev !== undefined ? computeDelta(r.value, r.prev) : null
            return (
              <tr key={i} className={i > 0 ? 'border-t border-slate-200/60 dark:border-slate-800/60' : ''}>
                <td className="py-1 text-slate-600 dark:text-slate-400">{r.label}</td>
                <td className="py-1 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {formatNumber(r.value, r.digits)}
                  <span className="ml-0.5 text-[10px] text-slate-400">{r.unit}</span>
                </td>
                <td className="py-1 pl-2 text-right">
                  {delta && Math.abs(delta.abs) > 0.01 ? (
                    <span
                      className={`
                        inline-flex items-center gap-0.5 rounded px-1 text-[10px] font-semibold tabular-nums
                        ${delta.direction === 'down' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}
                      `}
                    >
                      {formatSigned(delta.abs, r.digits)}
                      <span className="opacity-60">({formatSigned(delta.pct, 1)}%)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300 dark:text-slate-700">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function hasComposicao(a: Avaliacao): boolean {
  return Object.values(a.composicao).some((v) => v !== undefined && v !== null)
}
function hasCircunferencias(a: Avaliacao): boolean {
  return Object.values(a.circunferencias).some((v) => v !== undefined && v !== null)
}

function protocoloLabel(p: string): string {
  if (p === 'pollock-3') return 'Pollock 3 dobras'
  if (p === 'pollock-7') return 'Pollock 7 dobras'
  return 'Manual'
}
