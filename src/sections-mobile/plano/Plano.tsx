import { useEffect, useMemo, useState } from 'react'
import data from '@/../product-mobile/sections/plano/data.json'
import type {
  AssinaturaAtual,
  CicloFaturamento,
  PlanoData,
  PlanoTier,
  PlanoTierConfig,
} from '@/../product-mobile/sections/plano/types'
import { Plano as PlanoComponent } from './components/Plano'
import { CheckoutSheet } from './components/CheckoutSheet'

interface CheckoutState {
  tierConfig: PlanoTierConfig
  ciclo: CicloFaturamento
}

type Cenario = 'active' | 'expired' | 'past_due'

const CENARIO_OVERRIDES: Record<Cenario, Partial<AssinaturaAtual>> = {
  active: { status: 'active' },
  expired: { status: 'expired', renovaEm: '2026-04-04' },
  past_due: { status: 'past_due' },
}

export default function PlanoPreview() {
  const baseData = data as unknown as PlanoData
  const [cenario, setCenario] = useState<Cenario>('active')
  const [checkout, setCheckout] = useState<CheckoutState | null>(null)

  const planoData = useMemo<PlanoData>(() => {
    return {
      ...baseData,
      assinaturaAtual: { ...baseData.assinaturaAtual, ...CENARIO_OVERRIDES[cenario] },
    }
  }, [baseData, cenario])

  useEffect(() => {
    const node = checkout ? (
      <CheckoutSheet
        tierConfig={checkout.tierConfig}
        ciclo={checkout.ciclo}
        emailUsuario="roberto@nymos.com"
        onClose={() => setCheckout(null)}
        onConfirmar={(p) => console.log('Confirmar:', p)}
      />
    ) : null
    window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node } }))
    return () => {
      window.dispatchEvent(new CustomEvent('nymos:set-overlay', { detail: { node: null } }))
    }
  }, [checkout])

  const handleAssinar = (tier: PlanoTier, ciclo: CicloFaturamento) => {
    const tierConfig = planoData.tiers.find((t) => t.tier === tier)
    if (!tierConfig || tier === 'free') return
    setCheckout({ tierConfig, ciclo })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true">
        {/* Cenários demo — só pra design-os, não vai pro app real */}
        <div className="absolute top-14 right-3 z-30 flex gap-1 bg-slate-900/80 backdrop-blur-sm rounded-full p-1 border border-slate-800">
          {(['active', 'expired', 'past_due'] as Cenario[]).map((c) => (
            <button
              key={c}
              onClick={() => setCenario(c)}
              className={`px-2 h-6 rounded-full text-[9.5px] font-semibold ${
                cenario === c ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'active' ? 'Ativa' : c === 'expired' ? 'Expirada' : 'Pendente'}
            </button>
          ))}
        </div>
        <PlanoComponent
          data={planoData}
          onAssinar={handleAssinar}
          onCancelarAssinatura={() => console.log('Cancelar')}
          onReativarAssinatura={() => console.log('Reativar')}
          onAlterarMetodoPagamento={() => console.log('Alterar pagamento')}
          onVerFatura={(id) => console.log('Ver fatura:', id)}
        />
      </div>
    </>
  )
}
