import { ChevronRight, Pill, Sparkles } from 'lucide-react'
import type { MedicacaoAtiva } from '@/../product-mobile/sections/medicacao/types'

interface Props {
  medicacao: MedicacaoAtiva
  onAbrir?: (medicacaoId: string) => void
}

function adesaoCor(p: number): { barra: string; texto: string } {
  if (p >= 90) return { barra: 'bg-emerald-400', texto: 'text-emerald-300' }
  if (p >= 70) return { barra: 'bg-amber-400', texto: 'text-amber-300' }
  return { barra: 'bg-rose-400', texto: 'text-rose-300' }
}

function isRecente(iso?: string | null): boolean {
  if (!iso) return false
  const t = new Date(iso).getTime()
  return Date.now() - t < 1000 * 60 * 60 * 24
}

export function MedicacaoAtivaCard({ medicacao, onAbrir }: Props) {
  const cor = adesaoCor(medicacao.adesao30d)
  const atualizado = isRecente(medicacao.atualizadoEm)

  return (
    <button
      onClick={() => onAbrir?.(medicacao.id)}
      className={`
        w-full text-left mx-4 mb-2 rounded-2xl bg-slate-900 border p-4 transition-all active:scale-[0.99]
        ${atualizado ? 'border-teal-500/40' : 'border-slate-800 hover:border-slate-700'}
      `}
      style={{ width: 'calc(100% - 2rem)' }}
    >
      {/* Linha 1: ícone + nome + dose + badge atualizado + chevron */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
          <Pill size={16} strokeWidth={2.2} className="text-teal-300" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[15px] truncate flex items-center gap-2">
            <span className="truncate">
              {medicacao.nome}{' '}
              <span className="font-mono text-[13px] text-slate-300">{medicacao.dose}</span>
            </span>
            {atualizado && (
              <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 text-[9px] font-semibold uppercase tracking-wider">
                <Sparkles size={9} strokeWidth={2.4} />
                atualizado
              </span>
            )}
          </div>
          <div className="text-slate-400 text-[12px] truncate">{medicacao.posologia}</div>
        </div>
        <ChevronRight size={14} className="text-slate-500 shrink-0" strokeWidth={2} />
      </div>

      {/* Linha 2: chips de meta */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="text-slate-500 font-mono text-[11px] tabular-nums">
          Início {medicacao.iniciadaEm}
        </span>
        <span className="text-slate-700">·</span>
        <span className="text-slate-400 text-[11px]">{medicacao.duracaoLabel}</span>
        {medicacao.proximaDoseLabel && (
          <>
            <span className="text-slate-700">·</span>
            <span className="text-amber-300 font-mono text-[11px] tabular-nums">
              próxima {medicacao.proximaDoseLabel}
            </span>
          </>
        )}
      </div>

      {/* Adesão */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
            Adesão 30d
          </span>
          <span className={`font-mono tabular-nums text-[12px] font-semibold ${cor.texto}`}>
            {medicacao.adesao30d}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full ${cor.barra} rounded-full`}
            style={{ width: `${medicacao.adesao30d}%` }}
          />
        </div>
      </div>
    </button>
  )
}
