import {
  ChevronRight,
  Heart,
  ChefHat,
  FileText,
  User,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  MessageCircle,
  Star,
  LogOut,
  Crown,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import type { MaisCor, MaisItem, MaisProps } from '@/../product-mobile/sections/mais/types'

const ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  'chef-hat': ChefHat,
  'file-text': FileText,
  user: User,
  'credit-card': CreditCard,
  bell: Bell,
  shield: Shield,
  'help-circle': HelpCircle,
  'message-circle': MessageCircle,
  star: Star,
  users: Users,
  settings: Settings,
}

const COR_MAP: Record<MaisCor, { bg: string; text: string }> = {
  teal: { bg: 'bg-teal-500/15', text: 'text-teal-300' },
  sky: { bg: 'bg-sky-500/15', text: 'text-sky-300' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-300' },
  rose: { bg: 'bg-rose-500/15', text: 'text-rose-300' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-300' },
}

const PLANO_VISUAL: Record<string, { bg: string; text: string; label: string }> = {
  free: { bg: 'bg-slate-800', text: 'text-slate-300', label: 'Free' },
  plus: { bg: 'bg-teal-500/15', text: 'text-teal-300', label: 'Plus' },
  pro: { bg: 'bg-violet-500/15', text: 'text-violet-300', label: 'Pro' },
}

export function Mais({ data, onPerfilClick, onItemClick, onUpgradeClick, onLogoutClick }: MaisProps) {
  const planoVis = PLANO_VISUAL[data.plano.tier] ?? PLANO_VISUAL.free

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <button
        onClick={onPerfilClick}
        className="mx-4 mt-3 mb-4 w-[calc(100%-32px)] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-500/10 border border-slate-800 hover:border-teal-500/30 px-4 py-4 flex items-center gap-3 text-left"
      >
        {data.fotoUrl ? (
          <img src={data.fotoUrl} alt={data.primeiroNome} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-200 font-bold text-[22px] shrink-0">
            {data.avatarInicial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[15px] truncate">{data.user.name}</div>
          <div className="text-slate-400 text-[11.5px] truncate">{data.user.email}</div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full ${planoVis.bg} ${planoVis.text} text-[10px] font-bold uppercase tracking-wider`}>
              {planoVis.label}
            </span>
            {data.plano.renovaEm && (
              <span className="text-slate-600 text-[10px] font-mono tabular-nums">
                · renova {data.plano.renovaEm.split('-').reverse().slice(0, 2).join('/')}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={15} className="text-slate-500 shrink-0" />
      </button>

      {data.podeUpgrade && data.plano.tier !== 'pro' && (
        <button
          onClick={onUpgradeClick}
          className="mx-4 mb-4 w-[calc(100%-32px)] rounded-2xl bg-gradient-to-br from-violet-500/15 to-amber-500/15 border border-violet-500/30 px-4 py-3 flex items-center gap-3 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
            <Crown size={16} strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-amber-200 font-semibold text-[12.5px]">Upgrade pra Pro</div>
            <div className="text-amber-200/70 text-[10.5px]">
              Análise IA ilimitada · projeção corporal · sem limite de exames
            </div>
          </div>
          <ChevronRight size={14} className="text-amber-300 shrink-0" />
        </button>
      )}

      <div className="space-y-5">
        {data.grupos.map((g) => (
          <div key={g.id}>
            <div className="px-5 mb-1.5 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              {g.label}
            </div>
            <div className="bg-slate-900 border-y border-slate-800">
              {g.itens.map((item, i) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isLast={i === g.itens.length - 1}
                  onClick={onItemClick}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="px-4 pt-2">
          <button
            onClick={onLogoutClick}
            className="w-full h-12 rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-300 font-semibold text-[13px] flex items-center justify-center gap-2"
          >
            <LogOut size={14} strokeWidth={2.4} />
            Sair
          </button>
          <div className="text-center mt-3 text-slate-700 text-[10px] font-mono">
            Nymos v0.5.2 · build 2026.5.4
          </div>
        </div>
      </div>
    </div>
  )
}

interface ItemRowProps {
  item: MaisItem
  isLast: boolean
  onClick?: (item: MaisItem) => void
}

function ItemRow({ item, isLast, onClick }: ItemRowProps) {
  const Icon = ICON_MAP[item.iconeNome] ?? Star
  const cor = COR_MAP[item.cor]
  return (
    <button
      onClick={() => onClick?.(item)}
      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 text-left ${
        isLast ? '' : 'border-b border-slate-800/60'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl ${cor.bg} flex items-center justify-center ${cor.text} shrink-0`}>
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-medium text-[13px] leading-tight">{item.label}</div>
        {item.subtitulo && (
          <div className="text-slate-500 text-[11px] mt-0.5 truncate">{item.subtitulo}</div>
        )}
      </div>
      {item.badge && (
        <span className="px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 text-[10px] font-semibold uppercase tracking-wider shrink-0">
          {item.badge}
        </span>
      )}
      <ChevronRight size={13} className="text-slate-600 shrink-0" />
    </button>
  )
}
