import { useMemo } from 'react'
import { Syringe, MapPin } from 'lucide-react'
import {
  SITIO_LABELS,
  type MedicacaoAtiva,
  type RegistroInjecao,
} from '@/../product-mobile/sections/medicacao/types'

interface Props {
  medicacao: MedicacaoAtiva
  injecoes: RegistroInjecao[]
  /** Data atual de referência (ISO) — facilita preview/storybook. */
  hojeISO?: string
  onAplicarDose?: (medicacaoId: string) => void
  onAbrirDetalhe?: (medicacaoId: string) => void
}

const DIA_LABEL = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

function diasEntre(aISO: string, bISO: string): number {
  const a = new Date(aISO).getTime()
  const b = new Date(bISO).getTime()
  return Math.round((b - a) / 86400000)
}

function diaDaSemana(iso: string): number {
  // Mon=0 ... Sun=6 (compat com DIA_LABEL)
  const d = new Date(iso).getDay() // Sun=0 ... Sat=6
  return (d + 6) % 7
}

function diaMesLabel(iso: string): string {
  const [, m, d] = iso.split('T')[0].split('-')
  return `${d}/${m}`
}

export function MedicacaoSemanaCard({
  medicacao,
  injecoes,
  hojeISO = new Date().toISOString(),
  onAplicarDose,
  onAbrirDetalhe,
}: Props) {
  const injecoesDestaMed = injecoes.filter((i) => i.medicacaoId === medicacao.id)
  const ultimaInjecao = injecoesDestaMed[0] ?? null

  // Calcular próxima dose ISO (mesmo dia da semana da última injeção + 7d)
  const proximaDoseISO = useMemo(() => {
    if (!ultimaInjecao) return null
    const proxima = new Date(ultimaInjecao.aplicadoEm)
    proxima.setDate(proxima.getDate() + 7)
    return proxima.toISOString()
  }, [ultimaInjecao])

  const diasAteProxima = proximaDoseISO ? diasEntre(hojeISO, proximaDoseISO) : null
  const intervalo = 7
  const diasPassados = diasAteProxima !== null ? intervalo - diasAteProxima : 0
  const progressoPct = Math.max(0, Math.min(100, (diasPassados / intervalo) * 100))

  // Estado por dia da semana
  const diaProxima = proximaDoseISO ? diaDaSemana(proximaDoseISO) : null
  const diaHoje = diaDaSemana(hojeISO)
  const ultimaInjDow = ultimaInjecao ? diaDaSemana(ultimaInjecao.aplicadoEm) : null

  // Define se já passou da última injeção (em dias) por dot
  const dotStatus = (dow: number): 'cumprido' | 'hoje' | 'aplicar' | 'futuro' => {
    if (dow === diaHoje && dow === diaProxima) return 'aplicar'
    if (dow === diaHoje) return 'hoje'
    if (dow === diaProxima) return 'aplicar'
    if (dow === ultimaInjDow) return 'cumprido'
    return 'futuro'
  }

  const podeAplicar =
    diasAteProxima !== null && Math.abs(diasAteProxima) <= 1 // ±24h da janela
  const diasLabel =
    diasAteProxima === null
      ? '—'
      : diasAteProxima === 0
        ? 'hoje'
        : diasAteProxima > 0
          ? `em ${diasAteProxima}d`
          : `atrasada ${Math.abs(diasAteProxima)}d`

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-slate-900 border border-slate-800 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
            Próxima dose · {medicacao.nome}
          </div>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-slate-100 text-[15px] font-semibold">
              {proximaDoseISO ? diaMesLabel(proximaDoseISO) : '—'}
            </span>
            <span
              className={`font-mono text-[12.5px] tabular-nums ${
                diasAteProxima !== null && diasAteProxima < 0
                  ? 'text-rose-300'
                  : 'text-teal-300'
              }`}
            >
              {diasLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {DIA_LABEL.map((label, i) => {
            const status = dotStatus(i)
            const cls =
              status === 'cumprido'
                ? 'bg-emerald-400'
                : status === 'hoje'
                  ? 'bg-teal-400 animate-pulse'
                  : status === 'aplicar'
                    ? 'bg-teal-300 ring-2 ring-teal-400/30'
                    : 'bg-slate-700'
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${cls}`} />
                <span className="text-[9px] font-mono text-slate-500">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Barra progresso */}
      <div className="mb-3">
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all"
            style={{ width: `${progressoPct}%` }}
          />
        </div>
      </div>

      {/* Última injeção */}
      {ultimaInjecao && (
        <div className="mb-3 flex items-center gap-2 text-[12px] text-slate-400">
          <MapPin size={12} className="text-slate-500 shrink-0" />
          <span>
            Última:{' '}
            <span className="text-slate-300">{ultimaInjecao.aplicadoEmLabel}</span>
            {' · '}
            <span className="text-slate-300">{SITIO_LABELS[ultimaInjecao.sitio]}</span>
          </span>
        </div>
      )}

      {/* CTA aplicar */}
      <button
        onClick={() => onAplicarDose?.(medicacao.id)}
        disabled={!podeAplicar}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13.5px] font-semibold transition-all ${
          podeAplicar
            ? 'bg-teal-500 text-slate-950 active:scale-[0.99]'
            : 'bg-slate-800 text-slate-500'
        }`}
      >
        <Syringe size={14} strokeWidth={2.2} />
        {podeAplicar ? 'Aplicar dose' : 'Aplicar dose'}
      </button>
      {!podeAplicar && (
        <p className="mt-1.5 text-center text-slate-500 text-[10.5px]">
          Liberado a partir de 24h antes da próxima dose
        </p>
      )}

      {onAbrirDetalhe && (
        <button
          onClick={() => onAbrirDetalhe(medicacao.id)}
          className="mt-2 w-full rounded-lg py-1.5 text-[11.5px] text-teal-300 hover:text-teal-200 active:scale-[0.99] transition-all"
        >
          Ver detalhes →
        </button>
      )}
    </div>
  )
}
