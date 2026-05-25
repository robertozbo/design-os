import {
  Activity,
  ChevronRight,
  Image as ImageIcon,
  MoreHorizontal,
  Ruler,
  Share2,
  FileEdit,
  Sparkles,
} from 'lucide-react'
import type { Avaliacao, DeltaMetrica } from '@/../product-personal/sections/avaliacoes/types'
import { MetricaDelta } from './MetricaDelta'

interface AvaliacaoCardProps {
  avaliacao: Avaliacao
  onOpenDetail?: () => void
}

export function AvaliacaoCard({ avaliacao, onOpenDetail }: AvaliacaoCardProps) {
  const { aluno, antropometria, funcional, status, fotos, deltasResumo } = {
    aluno: avaliacao.aluno,
    antropometria: avaliacao.antropometria,
    funcional: avaliacao.funcional,
    status: avaliacao.status,
    fotos: avaliacao.antropometria?.fotos,
    deltasResumo: avaliacao.deltasResumo,
  }

  const isRascunho = status === 'rascunho'
  const hasAntro = !!antropometria
  const hasFuncional = !!funcional

  // Build mini-stats
  const stats = buildStats(avaliacao)

  // Count fotos disponíveis
  const fotosCount =
    [fotos?.frontalUrl, fotos?.lateralUrl, fotos?.posteriorUrl].filter(Boolean).length
  const fotoPrincipal = fotos?.frontalUrl ?? fotos?.lateralUrl ?? fotos?.posteriorUrl

  const dataObj = new Date(avaliacao.data)
  const dataFormatada = dataObj.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const diasAtras = Math.round(
    (Date.now() - dataObj.getTime()) / (1000 * 60 * 60 * 24),
  )
  const tempoRelativo =
    diasAtras === 0 ? 'hoje' : diasAtras === 1 ? 'ontem' : `há ${diasAtras} dias`

  return (
    <article
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetail?.()
        }
      }}
      className={`
        group relative flex cursor-pointer overflow-hidden rounded-2xl border bg-white
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
        dark:bg-slate-900
        ${
          isRascunho
            ? 'border-amber-200 dark:border-amber-900/50'
            : 'border-slate-200 hover:border-teal-300 dark:border-slate-800 dark:hover:border-teal-700'
        }
      `}
    >
      {/* Foto thumbnail (left) */}
      {fotoPrincipal ? (
        <div className="relative w-[120px] shrink-0 bg-slate-100 dark:bg-slate-800">
          <img
            src={fotoPrincipal}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {fotosCount > 1 && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-0.5 rounded-md bg-slate-900/75 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur">
              <ImageIcon size={9} />
              {fotosCount}
            </span>
          )}
        </div>
      ) : (
        <div className="flex w-[88px] shrink-0 flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/60">
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            sem
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            foto
          </span>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        {/* Top row: avatar + nome + ações */}
        <header className="flex items-center gap-3">
          {aluno.avatarUrl ? (
            <img
              src={aluno.avatarUrl}
              alt={aluno.nome}
              className="h-9 w-9 shrink-0 rounded-full bg-slate-100 object-cover dark:bg-slate-800"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {aluno.nome.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
              {aluno.nome}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="tabular-nums">{dataFormatada}</span> · {tempoRelativo}
            </p>
          </div>
          <button
            type="button"
            aria-label="Mais ações"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <MoreHorizontal size={14} />
          </button>
        </header>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {isRascunho && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              <FileEdit size={9} />
              Rascunho
            </span>
          )}
          {hasAntro && (
            <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              <Ruler size={9} />
              Antropo
            </span>
          )}
          {hasFuncional && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              <Activity size={9} />
              Funcional
            </span>
          )}
          {hasAntro && hasFuncional && !isRascunho && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <Sparkles size={9} />
              Completa
            </span>
          )}
          {avaliacao.compartilhadaComNutri && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Share2 size={9} />
              Nutri
            </span>
          )}
        </div>

        {/* Mini stats */}
        {stats.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60 ring-1 ring-inset ring-slate-100 dark:ring-slate-800">
            {stats.slice(0, 3).map((s) => (
              <MiniStat key={s.label} stat={s} delta={findDelta(deltasResumo, s.deltaKey)} />
            ))}
          </div>
        )}

        {/* Footer: link contextual pra ficha do aluno */}
        <button
          type="button"
          onClick={onOpenDetail}
          className="mt-3 inline-flex items-center justify-end gap-1 text-[11px] font-semibold uppercase tracking-wider text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          Abrir na ficha de {avaliacao.aluno.nome.split(' ')[0]}
          <ChevronRight size={11} strokeWidth={3} />
        </button>
      </div>
    </article>
  )
}

interface Stat {
  label: string
  value: string
  unit?: string
  deltaKey?: string
}

function buildStats(avaliacao: Avaliacao): Stat[] {
  const stats: Stat[] = []
  const a = avaliacao.antropometria
  const f = avaliacao.funcional

  if (a?.pesoKg != null) {
    stats.push({ label: 'Peso', value: a.pesoKg.toFixed(1), unit: 'kg', deltaKey: 'Peso' })
  }
  if (a?.dobras.percentualGorduraPollock != null) {
    stats.push({
      label: '% Gord',
      value: a.dobras.percentualGorduraPollock.toFixed(1),
      unit: '%',
      deltaKey: '% Gordura',
    })
  } else if (a?.bioimpedancia?.percentualGordura != null) {
    stats.push({
      label: '% Gord',
      value: a.bioimpedancia.percentualGordura.toFixed(1),
      unit: '%',
      deltaKey: '% Gordura',
    })
  }
  if (f?.fms) {
    stats.push({ label: 'FMS', value: `${f.fms.totalScore}`, unit: '/21', deltaKey: 'FMS' })
  } else if (f?.rm.supino?.estimadoKg != null) {
    stats.push({
      label: 'Sup 1RM',
      value: `${f.rm.supino.estimadoKg}`,
      unit: 'kg',
      deltaKey: 'Supino 1RM',
    })
  } else if (f?.cardio?.vo2Estimado != null) {
    stats.push({
      label: 'VO2',
      value: `${f.cardio.vo2Estimado}`,
      unit: '',
      deltaKey: 'VO2',
    })
  } else if (a?.circunferencias.cintura != null) {
    stats.push({
      label: 'Cintura',
      value: `${a.circunferencias.cintura}`,
      unit: 'cm',
      deltaKey: 'Cintura',
    })
  }

  return stats
}

function findDelta(deltas: DeltaMetrica[] | undefined, key?: string) {
  if (!deltas || !key) return undefined
  return deltas.find((d) => d.nome === key)
}

function MiniStat({ stat, delta }: { stat: Stat; delta?: DeltaMetrica }) {
  return (
    <div>
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        {stat.label}
      </p>
      <p className="mt-0.5 flex items-baseline gap-0.5 font-mono">
        <span className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-slate-50">
          {stat.value}
        </span>
        {stat.unit && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {stat.unit}
          </span>
        )}
      </p>
      {delta && (
        <div className="mt-0.5">
          <MetricaDelta delta={delta} compact />
        </div>
      )}
    </div>
  )
}
