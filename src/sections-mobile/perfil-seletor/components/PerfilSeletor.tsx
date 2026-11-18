import { useState } from 'react'
import { Dumbbell, HeartPulse, ChevronRight, LogOut, type LucideIcon } from 'lucide-react'
import type { PerfilId, PerfilSeletorProps } from '@/../product-mobile/sections/perfil-seletor/types'

const ICONES: Record<string, LucideIcon> = { Dumbbell, HeartPulse }

const TOM: Record<PerfilId, { icone: string; borda: string }> = {
  personal: { icone: 'bg-teal-500/15 text-teal-300', borda: 'border-teal-500/70' },
  aluno: { icone: 'bg-sky-500/15 text-sky-300', borda: 'border-sky-500/70' },
}

export function PerfilSeletor({ data, onEscolher, onSair }: PerfilSeletorProps) {
  const [lembrar, setLembrar] = useState(data.lembrarEscolha)

  return (
    <div className="min-h-full bg-slate-950 px-5 pt-16 pb-8 flex flex-col">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-semibold text-lg">
          {data.usuario.avatarInicial}
        </div>
        <div>
          <div className="text-white text-[22px] font-semibold leading-tight">
            Oi, {data.usuario.primeiroNome}
          </div>
          <div className="text-slate-400 text-[12px] font-mono">{data.usuario.registro}</div>
        </div>
      </div>

      <p className="mt-6 text-slate-300 text-[15px]">Como você quer entrar agora?</p>

      <div className="mt-4 space-y-3">
        {data.opcoes.map((op) => {
          const Icon = ICONES[op.icone] ?? Dumbbell
          const ultimo = data.ultimoPerfil === op.id
          return (
            <button
              key={op.id}
              onClick={() => onEscolher?.(op.id, lembrar)}
              className={`w-full text-left rounded-3xl border bg-slate-900 p-4 active:scale-[0.99] transition ${
                ultimo ? TOM[op.id].borda : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${TOM[op.id].icone}`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-white font-semibold text-[17px] whitespace-nowrap">{op.titulo}</span>
                    {ultimo && (
                      <span className="text-[10px] uppercase tracking-wide font-mono text-teal-300 bg-teal-500/10 px-1.5 py-0.5 rounded whitespace-nowrap">
                        Último acesso
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[13px] mt-0.5 leading-snug">{op.descricao}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {op.contexto.map((c) => (
                      <span key={c} className="text-[11.5px] text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-500 mt-3" />
              </div>
            </button>
          )
        })}
      </div>

      <label className="mt-5 flex items-center justify-between rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3">
        <span className="text-slate-200 text-[14px]">Lembrar minha escolha</span>
        <button
          type="button"
          role="switch"
          aria-checked={lembrar}
          onClick={() => setLembrar((v) => !v)}
          className={`w-11 h-6 rounded-full relative transition ${lembrar ? 'bg-teal-500' : 'bg-slate-700'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${lembrar ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      </label>

      <p className="mt-3 text-center text-slate-500 text-[12px]">
        Você pode trocar a qualquer momento em Mais.
      </p>

      <button
        onClick={onSair}
        className="mt-auto pt-8 inline-flex items-center justify-center gap-2 text-slate-400 text-[13px]"
      >
        <LogOut size={14} /> Sair da conta
      </button>
    </div>
  )
}
