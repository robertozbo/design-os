import { Sparkles, Lock, Plus, AlertCircle } from 'lucide-react'
import type { FreshnessGate } from '@/../product-mobile/sections/minha-saude/types'
import { formatRelativeDate } from './_shared'

interface FreshnessCardProps {
  freshness: FreshnessGate
  onGerarAnalise?: () => void
  onColetarDado?: (tipo: string) => void
}

export function FreshnessCard({ freshness, onGerarAnalise, onColetarDado }: FreshnessCardProps) {
  if (freshness.status === 'elegivel') {
    return <ElegivelCard freshness={freshness} onGerarAnalise={onGerarAnalise} />
  }
  if (freshness.status === 'sem_analise_anterior') {
    return <PrimeiraAnaliseCard freshness={freshness} onGerarAnalise={onGerarAnalise} />
  }
  return <AguardandoCard freshness={freshness} onColetarDado={onColetarDado} />
}

function ElegivelCard({
  freshness,
  onGerarAnalise,
}: {
  freshness: FreshnessGate
  onGerarAnalise?: () => void
}) {
  const { novosDados, ultimaAnaliseEm } = freshness
  const items: string[] = []
  if (novosDados.bioimpedancias > 0)
    items.push(`${novosDados.bioimpedancias} bioimpedância${novosDados.bioimpedancias === 1 ? '' : 's'}`)
  if (novosDados.exames > 0)
    items.push(`${novosDados.exames} exame${novosDados.exames === 1 ? '' : 's'}`)
  if (novosDados.fotosCorporais > 0)
    items.push(`${novosDados.fotosCorporais} set${novosDados.fotosCorporais === 1 ? '' : 's'} de fotos`)

  return (
    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
          <Sparkles size={16} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-emerald-200 text-[13px] font-semibold">Pronto pra nova análise</div>
          {ultimaAnaliseEm && (
            <div className="text-emerald-200/70 text-[11px] mt-0.5">
              Última análise {formatRelativeDate(ultimaAnaliseEm)}
              {items.length > 0 && (
                <>
                  {' · '}
                  {items.join(' · ')} novo{items.length === 1 && !items[0].endsWith('s') ? '' : 's'}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onGerarAnalise}
        className="mt-3 w-full h-11 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[13.5px] flex items-center justify-center gap-2"
      >
        <Sparkles size={14} strokeWidth={2.4} />
        Nova análise
      </button>
    </div>
  )
}

function AguardandoCard({
  freshness,
  onColetarDado,
}: {
  freshness: FreshnessGate
  onColetarDado?: (tipo: string) => void
}) {
  const { ultimaAnaliseEm, diasDesdeUltima, cooldownDias, novosDados } = freshness
  const diasRestantes = Math.max(0, cooldownDias - diasDesdeUltima)

  const sugestoes: { tipo: string; label: string; coletado: boolean }[] = [
    { tipo: 'bioimpedancia', label: 'Bioimpedância', coletado: novosDados.bioimpedancias > 0 },
    { tipo: 'exame', label: 'Exame laboratorial', coletado: novosDados.exames > 0 },
    { tipo: 'fotos_corporais', label: 'Fotos corporais', coletado: novosDados.fotosCorporais > 0 },
  ]

  return (
    <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
          <Lock size={15} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-amber-200 text-[13px] font-semibold">Aguardando novos dados</div>
          {ultimaAnaliseEm && (
            <div className="text-amber-200/70 text-[11px] mt-0.5 leading-snug">
              Última análise {formatRelativeDate(ultimaAnaliseEm)}. Adicione um dos itens abaixo ou aguarde{' '}
              <span className="font-mono font-semibold">
                {diasRestantes} dia{diasRestantes === 1 ? '' : 's'}
              </span>
              .
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {sugestoes.map((s) => (
          <button
            key={s.tipo}
            onClick={() => !s.coletado && onColetarDado?.(s.tipo)}
            disabled={s.coletado}
            className={`w-full px-3 h-10 rounded-xl flex items-center gap-2.5 text-left ${
              s.coletado
                ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 cursor-default'
                : 'bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700'
            }`}
          >
            {s.coletado ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 text-[10px] font-bold shrink-0">
                ✓
              </span>
            ) : (
              <Plus size={13} strokeWidth={2.4} className="text-slate-500 shrink-0" />
            )}
            <span className="text-[12.5px] font-medium flex-1">{s.label}</span>
            {s.coletado && (
              <span className="text-[10px] font-mono text-emerald-300/80">já coletado</span>
            )}
          </button>
        ))}
      </div>

      <button
        disabled
        className="mt-3 w-full h-11 rounded-2xl bg-slate-800/60 text-slate-600 font-semibold text-[13.5px] flex items-center justify-center gap-2 cursor-not-allowed"
      >
        <Lock size={13} strokeWidth={2.4} />
        Nova análise · indisponível
      </button>
    </div>
  )
}

function PrimeiraAnaliseCard({
  onGerarAnalise,
}: {
  freshness: FreshnessGate
  onGerarAnalise?: () => void
}) {
  return (
    <div className="rounded-2xl bg-sky-500/10 border border-sky-500/30 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300 shrink-0">
          <AlertCircle size={16} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sky-200 text-[13px] font-semibold">Comece sua jornada</div>
          <div className="text-sky-200/70 text-[11px] mt-0.5 leading-snug">
            Você ainda não gerou nenhuma análise. A primeira fica como sua linha de base — daí você compara
            evolução ao longo do tempo.
          </div>
        </div>
      </div>
      <button
        onClick={onGerarAnalise}
        className="mt-3 w-full h-11 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[13.5px] flex items-center justify-center gap-2"
      >
        <Sparkles size={14} strokeWidth={2.4} />
        Gerar primeira análise
      </button>
    </div>
  )
}
