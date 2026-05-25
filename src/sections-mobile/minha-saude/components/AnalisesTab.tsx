import { useState } from 'react'
import { Archive } from 'lucide-react'
import type { MinhaSaudeData } from '@/../product-mobile/sections/minha-saude/types'
import { FreshnessCard } from './FreshnessCard'
import { SnapshotRow } from './SnapshotRow'
import { ConsentimentoModal, type EscopoConsentimento } from './ConsentimentoModal'

interface AnalisesTabProps {
  data: MinhaSaudeData
  onGerarAnalise?: (escopoConsentimento?: EscopoConsentimento[]) => void
  onSnapshotClick?: (id: string) => void
  onColetarDado?: (tipo: string) => void
}

export function AnalisesTab({ data, onGerarAnalise, onSnapshotClick, onColetarDado }: AnalisesTabProps) {
  const { freshness, snapshots } = data
  const total = snapshots.length
  const [consentOpen, setConsentOpen] = useState(false)

  const handleAceitar = (escopo: EscopoConsentimento[]) => {
    setConsentOpen(false)
    onGerarAnalise?.(escopo)
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <FreshnessCard
        freshness={freshness}
        onGerarAnalise={() => setConsentOpen(true)}
        onColetarDado={onColetarDado}
      />

      <ConsentimentoModal
        open={consentOpen}
        onClose={() => setConsentOpen(false)}
        onAceitar={handleAceitar}
      />

      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Archive size={11} strokeWidth={2.4} />
            Histórico
          </span>
          <span className="text-slate-600 text-[10px] font-mono tabular-nums">
            {total} análise{total === 1 ? '' : 's'}
          </span>
        </div>

        {total === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-8 text-center">
            <div className="text-slate-300 text-[12.5px] font-medium">Nenhuma análise ainda</div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Gere a primeira pra criar sua linha de base.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {snapshots.map((s, i) => (
              <SnapshotRow
                key={s.id}
                snapshot={s}
                isLatest={i === 0}
                isFirst={i === snapshots.length - 1}
                onClick={onSnapshotClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
