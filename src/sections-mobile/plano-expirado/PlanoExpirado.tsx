import { useState } from 'react'
import { AlertTriangle, Crown, Lock, X, Check } from 'lucide-react'
import data from '@/../product-mobile/sections/plano-expirado/data.json'

interface PlanoExpiradoData {
  primeiroNome: string
  avatarInicial: string
  fotoUrl: string | null
  tierExpirado: string
  labelTier: string
  expirouEm: string
  precoMensalLabel: string
  stripePriceId: string
  featuresPerdidas: string[]
}

function formatDataBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function PlanoExpiradoPreview() {
  const d = data as unknown as PlanoExpiradoData
  const [confirmandoFree, setConfirmandoFree] = useState(false)

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
      `}</style>
      <div
        data-nymos-mobile="true"
        className="min-h-full bg-gradient-to-b from-rose-500/10 via-slate-950 to-slate-950 flex flex-col px-5 pt-8 pb-6"
      >
        <div className="flex flex-col items-center text-center mt-2">
          {d.fotoUrl ? (
            <img src={d.fotoUrl} alt={d.primeiroNome} className="w-16 h-16 rounded-2xl object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-200 font-bold text-[24px]">
              {d.avatarInicial}
            </div>
          )}
          <div className="text-slate-300 text-[12px] mt-3 font-medium">Bem-vindo de volta,</div>
          <div className="text-slate-50 text-[20px] font-bold mt-0.5">{d.primeiroNome}</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-rose-500/15 to-rose-500/5 border border-rose-500/30 p-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
              <AlertTriangle size={20} strokeWidth={2.4} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-rose-200 font-bold text-[14px]">
                Seu plano {d.labelTier} expirou
              </div>
              <div className="text-rose-200/80 text-[11.5px] mt-1 leading-snug">
                Em <span className="font-mono font-semibold">{formatDataBR(d.expirouEm)}</span>. Renove pra
                voltar a acessar todos os recursos sem interrupção.
              </div>
            </div>
          </div>

          {d.featuresPerdidas.length > 0 && (
            <div className="mt-4 pt-4 border-t border-rose-500/20">
              <div className="flex items-center gap-1.5 mb-2 text-rose-200/80 text-[10px] font-semibold uppercase tracking-wider">
                <Lock size={10} strokeWidth={2.4} />
                Você perdeu acesso a
              </div>
              <ul className="space-y-1.5">
                {d.featuresPerdidas.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-slate-300 text-[11.5px] leading-snug">
                    <X size={11} className="text-rose-400 mt-0.5 shrink-0" strokeWidth={2.6} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 space-y-2">
          {confirmandoFree ? (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5">
              <div className="text-amber-200 text-[12.5px] font-semibold">Tem certeza?</div>
              <div className="text-amber-200/70 text-[11px] mt-1 leading-snug">
                Você perderá os recursos listados acima. Pode renovar a qualquer momento depois.
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button
                  onClick={() => setConfirmandoFree(false)}
                  className="h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-[12px]"
                >
                  Voltar
                </button>
                <button
                  onClick={() => console.log('Continuar com Free')}
                  className="h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-100 font-semibold text-[12px] flex items-center justify-center gap-1.5"
                >
                  <Check size={12} strokeWidth={2.4} />
                  Sim, continuar Free
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => console.log('Renovar', d.tierExpirado, d.stripePriceId)}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-bold text-[14px] flex items-center justify-center gap-2"
              >
                <Crown size={16} strokeWidth={2.6} />
                Renovar {d.labelTier} por {d.precoMensalLabel}
              </button>
              <button
                onClick={() => setConfirmandoFree(true)}
                className="w-full h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[12.5px] hover:border-slate-700"
              >
                Continuar com Free
              </button>
            </>
          )}
          <div className="text-center text-slate-600 text-[10px] mt-2">
            Você sempre pode renovar depois em <span className="font-mono">Mais → Plano</span>
          </div>
        </div>
      </div>
    </>
  )
}
