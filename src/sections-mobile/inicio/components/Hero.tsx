import type { UsuarioContexto } from '@/../product-mobile/sections/inicio/types'
import { Flame } from 'lucide-react'

interface HeroProps {
  usuario: UsuarioContexto
  onStreakClick?: () => void
}

export function Hero({ usuario, onStreakClick }: HeroProps) {
  return (
    <div className="px-4 pt-3 pb-3 flex items-start gap-3">
      <p className="text-slate-300 text-[13px] leading-snug flex-1">{usuario.fraseIA}</p>
      {usuario.streakDias > 0 && (
        <button
          onClick={onStreakClick}
          className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 font-mono text-[11.5px] font-medium hover:bg-amber-500/25"
        >
          <Flame size={11} strokeWidth={2.5} className="fill-amber-400/40" />
          {usuario.streakDias} dias
        </button>
      )}
    </div>
  )
}
