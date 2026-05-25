import { useState } from 'react'
import planoData from '@/../product-mobile/sections/plano/data.json'
import upgradeData from '@/../product-mobile/sections/upgrade/data.json'
import type { CicloFaturamento, PlanoData, PlanoTier } from '@/../product-mobile/sections/plano/types'
import { CheckoutSheet } from '@/sections-mobile/plano/components/CheckoutSheet'

export default function UpgradePreview() {
  const data = planoData as unknown as PlanoData
  const cfg = upgradeData as { tierAlvo: PlanoTier; ciclo: CicloFaturamento }

  const tierConfig = data.tiers.find((t) => t.tier === cfg.tierAlvo) ?? data.tiers[2]
  const [aberto, setAberto] = useState(true)

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
      <div data-nymos-mobile="true" className="relative min-h-full">
        {!aberto && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-300 mb-3">
              ✓
            </div>
            <div className="text-slate-100 font-semibold text-[14px]">Checkout fechado</div>
            <button
              onClick={() => setAberto(true)}
              className="mt-4 px-4 h-10 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[12.5px]"
            >
              Reabrir checkout
            </button>
          </div>
        )}
        {aberto && (
          <CheckoutSheet
            tierConfig={tierConfig}
            ciclo={cfg.ciclo}
            emailUsuario="roberto@nymos.com"
            onClose={() => setAberto(false)}
            onConfirmar={(p) => console.log('Confirmar pagamento:', p)}
          />
        )}
      </div>
    </>
  )
}
