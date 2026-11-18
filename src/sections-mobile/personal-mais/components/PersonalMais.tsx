import {
  ArrowLeftRight,
  Bell,
  CalendarPlus,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Dumbbell,
  Layers,
  LogOut,
  MessageSquare,
  Settings,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import type { PersonalMaisProps } from '@/../product-mobile/sections/personal-mais/types'

const ICONES: Record<string, LucideIcon> = {
  Bell,
  CalendarPlus,
  ClipboardList,
  CreditCard,
  Dumbbell,
  Layers,
  MessageSquare,
  Settings,
  UserPlus,
}

export function PersonalMais({ data, onPerfilClick, onItemClick, onTrocarPerfil, onSair }: PersonalMaisProps) {
  const u = data.usuario

  return (
    <div className="min-h-full bg-[#0A0E0D] px-4 pb-8">
      <button
        onClick={onPerfilClick}
        className="w-full mt-1 rounded-3xl bg-[#0A0E0D] border border-[#2A3130] p-4 flex items-center gap-3 text-left"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-[#0E1A17] font-semibold text-xl">
          {u.avatarInicial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-semibold text-[17px] truncate">{u.nome}</div>
          <div className="text-slate-400 text-[12px] font-mono">{u.registro}</div>
          <span className="mt-1 inline-block text-[11px] font-medium text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Personal · {u.plano}
          </span>
        </div>
        <ChevronRight size={18} className="text-slate-500" />
      </button>

      {u.temPerfilAluno && (
        <button
          onClick={onTrocarPerfil}
          className="w-full mt-3 rounded-2xl border border-teal-500/40 bg-teal-500/10 px-4 py-3 flex items-center gap-3 text-left"
        >
          <ArrowLeftRight size={18} className="text-teal-300" />
          <div className="flex-1">
            <div className="text-teal-50 text-[14px] font-medium">Trocar para perfil Aluna</div>
            <div className="text-teal-300/70 text-[12px]">Seu treino e suas métricas</div>
          </div>
          <ChevronRight size={16} className="text-teal-300/70" />
        </button>
      )}

      {data.grupos.map((g) => (
        <section key={g.id} className="mt-5">
          <h2 className="px-1 mb-2 text-[11px] uppercase tracking-wider font-mono text-slate-500">{g.label}</h2>
          <ul className="rounded-2xl bg-[#0A0E0D] border border-[#2A3130] divide-y divide-[#2A3130] overflow-hidden">
            {g.itens.map((item) => {
              const Icon = ICONES[item.icone] ?? Settings
              return (
                <li key={item.id}>
                  <button onClick={() => onItemClick?.(item)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                    <Icon size={18} className="text-emerald-300" />
                    <span className="flex-1 text-slate-100 text-[14px]">{item.label}</span>
                    {item.badge ? (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-semibold flex items-center justify-center">
                        {item.badge}
                      </span>
                    ) : null}
                    <ChevronRight size={16} className="text-slate-600" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <button
        onClick={onSair}
        className="w-full mt-6 rounded-2xl border border-rose-500/30 py-3 text-rose-400 text-[14px] font-medium inline-flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> Sair
      </button>
    </div>
  )
}
